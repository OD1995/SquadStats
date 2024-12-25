import asyncio
import traceback
from uuid import UUID
from flask import Blueprint, jsonify, request
from sqlalchemy import and_, or_
from app import db
from app.models.DataSource import DataSource
from app.models.League import League
from app.models.LeagueSeason import LeagueSeason
from app.models.Match import Match
from app.models.MatchError import MatchError
from app.models.Metric import Metric
from app.models.Player import Player
from app.models.PlayerMatchPerformance import PlayerMatchPerformance
from app.models.Team import Team
from app.models.TeamSeason import TeamSeason
from app.scrapers.teams.FootballAssociationTeamScraper import FootballAssociationTeamScraper
from app.types.enums import DataSource as DataSourceEnum

match_bp = Blueprint(
    name="match",
    url_prefix="/match",
    import_name=__name__
)

@match_bp.route("/scrape-matches", methods=['POST'])
def scrape_matches():
    try:
        data = request.get_json()
        match_id_list = [
            UUID(mi)
            for mi in data['matchIds']
        ]
        matches_to_scrape = db.session.query(Match) \
            .filter(Match.match_id.in_(match_id_list)) \
            .all()
        matches_to_scrape_by_id = {
            m.match_id : m
            for m in matches_to_scrape
        }
        first_match = matches_to_scrape[0]
        team_season = first_match.team_season
        team = team_season.team
        team_names = [
            tn.team_name
            for tn in team.team_names
        ]
        data_source = team.data_source
        match_ids = []
        data_source_match_ids = []
        for m in matches_to_scrape:
            match_ids.append(m.match_id)
            data_source_match_ids.append(m.data_source_match_id)
        players = db.session.query(Player) \
            .filter_by(club_id=team.club_id) \
            .all()
        players_by_name = {
            p.data_source_player_name : p
            for p in players
        }
        metrics = db.session.query(Metric) \
            .filter_by(data_source_id=data_source.data_source_id) \
            .all()
        metrics_by_name = {
            m.metric_name.lower() : m
            for m in metrics
        }
        player_match_performances = db.session.query(PlayerMatchPerformance) \
            .join(Match) \
            .filter(Match.match_id.in_(match_ids)) \
            .all()
        still_exists = {}
        player_match_performances_by_fk = {}
        for pmp in player_match_performances:
            still_exists[(pmp.player_id, pmp.match_id, pmp.metric_id)] = False
            player_match_performances_by_fk[(pmp.player_id, pmp.match_id, pmp.metric_id)] = pmp
        if data_source.data_source_id == DataSourceEnum.FOOTBALL_ASSOCIATION:
            team_scraper = FootballAssociationTeamScraper(
                fa_team_id=team.data_source_team_id,
                fa_league_id="",
                fa_base_url=data_source.url
            )
            results = asyncio.run(
                team_scraper.scrape_matches(
                    fa_match_id_list=data_source_match_ids,
                    team_names=team_names,
                    match_id_list=match_ids
                )
            )
            new_players = []
            new_metrics = []
            new_player_match_perfs = []
            new_match_errors = []
            for result in results:
                match_id = result['match_id']
                if 'location' in result['match_info']:
                    match = matches_to_scrape_by_id[match_id]
                    match.location = result['match_info']['location']
                match_errors = [
                    MatchError(
                        match_id=match_id,
                        error_message=me
                    )
                    for me in result['match_errors']
                ]
                new_match_errors.extend(match_errors)
                for player_name, metric_dict in result['player_data'].items():
                    if player_name in players_by_name:
                        player = players_by_name[player_name]
                    else:
                        player = Player(
                            club_id=team.club_id,
                            data_source_player_name=player_name
                        )
                        new_players.append(player)
                        players_by_name[player_name] = player
                    for metric_name, value in metric_dict.items():
                        cleaner_metric_name = metric_name.lower()
                        if cleaner_metric_name in metrics_by_name:
                            metric = metrics_by_name[cleaner_metric_name]
                        else:
                            metric = Metric(
                                data_source_id=data_source.data_source_id,
                                metric_name=metric_name
                            )
                            new_metrics.append(metric)
                            metrics_by_name[cleaner_metric_name] = metric
                        key = (
                            player.player_id,
                            match_id,
                            metric.metric_id
                        )
                        if key in player_match_performances_by_fk:
                            player_match_perf = player_match_performances_by_fk[key]
                            player_match_perf.value = value
                            still_exists[key] = True
                        else:
                            player_match_perf = PlayerMatchPerformance(
                                player_id=player.player_id,
                                match_id=match_id,
                                metric_id=metric.metric_id,
                                value=value
                            )
                            new_player_match_perfs.append(player_match_perf)
            pmp_delete_filters = []
            for pmp_key, exists in still_exists.items():
                if exists == False:
                    pmp_delete_filters.append(
                        and_(*[
                            PlayerMatchPerformance.player_id == UUID(pmp_key[0]),
                            PlayerMatchPerformance.match_id == UUID(pmp_key[1]),
                            PlayerMatchPerformance.metric_id == UUID(pmp_key[2])
                        ])
                    )
            if len(pmp_delete_filters) > 0:
                db.session.query(PlayerMatchPerformance) \
                    .filter(or_(*pmp_delete_filters)) \
                    .delete()
            db.session.add_all(new_players)
            db.session.add_all(new_metrics)
            db.session.add_all(new_player_match_perfs)
            db.session.add_all(new_match_errors)
            db.session.commit()
            matches_to_return = db.session.query(Match) \
                .filter(Match.team_season_id == team_season.team_season_id) \
                .all()
            return jsonify([
                match.to_dict()
                for match in sorted(matches_to_return, key=lambda x: x.date)
            ])
        else:
            raise Exception(f"Unexpected data source: {data_source.data_source_id}")
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400

@match_bp.route("/get-current-matches/<team_id>/<league_season_id>", methods=['GET'])
def get_current_matches(team_id, league_season_id):
    try:
        current_matches = db.session.query(Match) \
            .join(TeamSeason) \
            .filter(
                TeamSeason.team_id == UUID(team_id),
                TeamSeason.league_season_id == UUID(league_season_id)
            ).all()
        return jsonify([
                match.to_dict()
                for match in sorted(current_matches, key=lambda x: x.date)
            ]), 200
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400
    

@match_bp.route("/update-matches", methods=['POST'])
def update_matches():
    try:
        req = request.get_json()
        team_id = req['teamId']
        league_season_id = req['leagueSeasonId']
        league_season = db.session.query(LeagueSeason) \
            .filter_by(league_season_id=UUID(league_season_id)) \
            .first()
        ## There's a chance this team_season doesn't exist yet
        team_season = db.session.query(TeamSeason) \
            .filter_by(team_id=UUID(team_id), league_season_id=UUID(league_season_id)) \
            .first()
        if (team_season is None):
            team = db.session.query(Team) \
                .filter_by(team_id=UUID(team_id)) \
                .first()
            team_season = TeamSeason(
                team_id=UUID(team_id),
                league_season_id=UUID(league_season_id)
            )
            db.session.add(team_season)
        else:
            team = team_season.team
        current_matches = db.session.query(Match) \
            .filter_by(team_season_id=team_season.team_season_id) \
            .all()
        if team.data_source_id == DataSourceEnum.FOOTBALL_ASSOCIATION:
            league_id = team.team_leagues[0].league_id
            league = db.session.query(League) \
                .filter_by(league_id=league_id) \
                .first()
            data_source = db.session.query(DataSource) \
                .filter_by(data_source_id=team.data_source_id) \
                .first()
            team_scraper = FootballAssociationTeamScraper(
                fa_team_id=team.data_source_team_id,
                fa_league_id=league.data_source_league_id,
                fa_base_url=data_source.url
            )
            (
                new_matches,
                new_match_errors,
                new_competitions,
                delete_match_errors,
                match_ids_to_delete,
                matches_to_return
            ) = team_scraper.get_team_matches(
                fa_season_id=league_season.data_source_league_season_id,
                team_names=team.get_team_name_str_list(),
                team_season_id=team_season.team_season_id,
                current_matches=current_matches
            )
            db.session.add_all(new_competitions)
            db.session.query(MatchError) \
                .filter(MatchError.match_id.in_(delete_match_errors+match_ids_to_delete)) \
                .delete()
            db.session.query(PlayerMatchPerformance) \
                .filter(PlayerMatchPerformance.match_id.in_(match_ids_to_delete)) \
                .delete()
            db.session.query(Match) \
                .filter(Match.match_id.in_(match_ids_to_delete)) \
                .delete()
            db.session.add_all(new_matches)
            db.session.add_all(new_match_errors)
            db.session.commit()
            return jsonify([
                match.to_dict()
                for match in sorted(matches_to_return, key=lambda x: x.date)
            ])
        else:
            raise Exception('Unexpected data source type')
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400
    

@match_bp.route("/get-match-info/<match_id>", methods=['GET'])
def get_match_info(match_id):
    try:
        match = db.session.query(Match) \
            .filter_by(match_id=UUID(match_id)) \
            .first()
        pmp_dict = {}
        unique_metrics = {}
        for pmp in match.player_match_performances:
            player_id_key = str(pmp.player_id)
            metric_name = pmp.metric.get_best_metric_name()
            if player_id_key not in pmp_dict:
                pmp_dict[player_id_key] = {
                    'player_name' : pmp.player.get_best_name()
                }
            pmp_dict[player_id_key][metric_name] = pmp.value
            unique_metrics[metric_name] = 1
        return_dict = {
            'player_data' : pmp_dict,
            'unique_metric_names' : list(unique_metrics.keys()),
            'match_info' : match.to_dict(),
            'team_name' : match.team_season.team.get_default_team_name(),
            'competition_full_name' : match.competition.competition_name
        }
        # return_dict = {
        #   "competition_full_name": "uhlsport Hellenic League Division 1",
        #     "match_info": {
        #         "competition_acronym": "HL1",
        #         "data_source_match_id": "26468677",
        #         "date": "30 Nov 24",
        #         "goal_difference": 7,
        #         "goals_against": 0,
        #         "goals_for": 7,
        #         "home_away_neutral": "H",
        #         "location": "Northcourt Road.  OX14 1PL",
        #         "match_errors": [],
        #         "match_id": "0d4f7e38-290e-4671-91c1-1e3002e5b5b0",
        #         "opposition_team_name": "Newent Town",
        #         "pens_against": None,
        #         "pens_for": None,
        #         "player_info_scraped": True,
        #         "player_performance_data": [],
        #         "result": "W",
        #         "team_season_id": "11a8e7ea-4434-4fdb-8c6b-e7a2b4aeb7b3",
        #         "time": "15:00"
        #     },
        #     "player_data": {
        #         "0995e3a2-3327-4b1b-88f5-ae5611eede04": {
        #         "Appearances": 1.0,
        #         "player_name": "Joe Green"
        #         },
        #         "11fb0dec-ac89-4149-b2ae-a3763755b817": {
        #         "Appearances": 1.0,
        #         "player_name": "Lewis Dix"
        #         },
        #         "16297342-6632-4eb0-938c-dd8494151fac": {
        #         "Appearances": 1.0,
        #         "player_name": "Zach Morey"
        #         },
        #         "2affef0e-a545-4cdc-a262-70875d4c8f17": {
        #         "Appearances": 1.0,
        #         "Overall Goals": 1.0,
        #         "player_name": "Nathanael Robinson"
        #         },
        #         "3213a1ea-137f-49d7-a4d7-240d342d4129": {
        #         "Appearances": 1.0,
        #         "player_name": "Harry Sampford"
        #         },
        #         "4e6144cd-e558-4eb4-9b7e-f59843c61ce5": {
        #         "Appearances": 1.0,
        #         "player_name": "Hayden Luke Beadle"
        #         },
        #         "59b94ea3-c2e7-4c58-8a5c-a809d965eb3d": {
        #         "Appearances": 1.0,
        #         "Overall Goals": 1.0,
        #         "player_name": "Harry Walters"
        #         },
        #         "6de0a5b6-f1fa-48b3-bff7-68fc9a33898d": {
        #         "Appearances": 1.0,
        #         "player_name": "Edward Cavanagh"
        #         },
        #         "7219412f-6b87-44d6-a727-f74f72cd499b": {
        #         "Appearances": 1.0,
        #         "player_name": "Jack Gaul"
        #         },
        #         "8d31033a-c5a0-4036-9a57-3c5485fd7639": {
        #         "Appearances": 1.0,
        #         "Overall Goals": 1.0,
        #         "player_name": "Casey Highmoor"
        #         },
        #         "96c150bf-8fe2-4a11-af32-00967a95f9c9": {
        #         "Appearances": 1.0,
        #         "Overall Goals": 1.0,
        #         "player_name": "John Mills"
        #         },
        #         "b608dcd6-0e2d-41a5-ae0f-00fa5aefa2fd": {
        #         "Appearances": 1.0,
        #         "player_name": "Ryan George Hicks"
        #         },
        #         "bc73b2d7-8c0e-4cab-995f-3d6a77a1be28": {
        #         "Appearances": 1.0,
        #         "player_name": "Matthew Woodley"
        #         },
        #         "c2429d7e-2f88-45d4-8ed2-e574a6145d14": {
        #         "Appearances": 1.0,
        #         "Overall Goals": 1.0,
        #         "player_name": "Josh Richardson"
        #         },
        #         "f01dd3d7-9aff-460a-9b6d-5f4627ad8557": {
        #         "Appearances": 1.0,
        #         "Overall Goals": 1.0,
        #         "player_name": "Aaron Woodley"
        #         },
        #         "f79a7ec3-b34d-4978-b57d-21fd75e7b565": {
        #         "Appearances": 1.0,
        #         "player_name": "Leo cole"
        #         }
        #     },
        #     "team_name": "Abingdon United FC First"
        # }

        return jsonify(return_dict), 200
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400