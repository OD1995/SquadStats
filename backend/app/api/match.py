import asyncio
from datetime import datetime
import traceback
from uuid import UUID
from flask import Blueprint, jsonify, request
import flask_praetorian
from sqlalchemy import and_, or_
from app import db
from app.data_handlers.MatchInfoDataHandler import MatchInfoDataHandler
from app.data_handlers.MatchesDataHandler import MatchesDataHandler
from app.helpers.MetricIdGetter import MetricIdGetter
from app.helpers.misc import do_error_handling
from app.models.Competition import Competition
from app.models.DataSource import DataSource
from app.models.League import League
from app.models.LeagueSeason import LeagueSeason
from app.models.Match import Match
from app.models.MatchError import MatchError
from app.models.MatchReport import MatchReport
from app.models.Metric import Metric
from app.models.Player import Player
from app.models.PlayerMatchPerformance import PlayerMatchPerformance
from app.models.Team import Team
from app.models.TeamSeason import TeamSeason
from app.scrapers.teams.FootballAssociationTeamScraper import FootballAssociationTeamScraper
from app.types.enums import DataSource as DataSourceEnum, HomeAwayNeutral, MiscStrings, Result, Metric as MetricEnum

match_bp = Blueprint(
    name="match",
    url_prefix="/match",
    import_name=__name__
)

@match_bp.route("/scrape-matches", methods=['POST'])
@flask_praetorian.auth_required
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
            
            db.session.query(MatchError) \
                .filter(MatchError.match_id.in_(match_id_list)) \
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
        return do_error_handling(e)

@match_bp.route("/get-current-matches/<team_id>/<league_season_id>", methods=['GET']) #
@flask_praetorian.auth_required
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
            ])
    except Exception as e:
        return do_error_handling(e)
    

@match_bp.route("/update-matches", methods=['POST'])
@flask_praetorian.auth_required
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
        return do_error_handling(e)
    

@match_bp.route("/get-match-info/<match_id>", methods=['GET'])
def get_match_info(match_id):
    try:
        match_info_data_handler = MatchInfoDataHandler(match_id)
        result = match_info_data_handler.get_result()
        return jsonify(result)
    except Exception as e:
        return do_error_handling(e)
    
@match_bp.route("/get-matches-data", methods=['GET'])
def get_matches_data():
    try:
        matches_data_handler = MatchesDataHandler(
            club_id=request.args.get("clubId"),
            team_id=request.args.get("teamId"),
            split_by=request.args.get("splitBy"),
            team_id_filter=request.args.get("teamIdFilter"),
            season_filter=request.args.get("seasonFilter"),
            opposition_filter=request.args.get("oppositionFilter"),    
            player_id_filter=request.args.get("playerIdFilter"),
            year_filter=request.args.get("yearFilter"),
            month_filter=request.args.get("monthFilter"),
        )
        result = matches_data_handler.get_result()
        return jsonify(result)
    except Exception as e:
        return do_error_handling(e)
    
@match_bp.route("/get-match-edit-update-data-info/<league_season_id>/<team_id>/<match_id>", methods=['GET'])
@flask_praetorian.auth_required
def get_match_edit_update(league_season_id, team_id, match_id):
    try:
        match_info_data_handler = MatchInfoDataHandler(match_id)
        return jsonify(match_info_data_handler.get_edit_update_info(league_season_id, team_id))
    except Exception as e:
        return do_error_handling(e)

@match_bp.route("/create", methods=['POST'])
@flask_praetorian.auth_required
def create_match():
    try:
        req = request.get_json()
        match_js = req["match"]
        active_players = req['activePlayers']
        goals = req['goals']
        potm = req['potm']
        new_comp_name = req.get('newCompName', None)
        new_comp_acronym = req.get('newCompAcronym', None)
        team_id = UUID(req['teamId'])
        league_season_id = UUID(req['leagueSeasonId'])
        match_report_image_ids = req.get('imageIds', [])
        match_report_text = match_js.get('match_report_text', None)

        match_comp_id = match_js.get('competition_id', None)
        league_season = db.session.query(LeagueSeason) \
            .filter_by(league_season_id=league_season_id) \
            .first()
        team_season = db.session.query(TeamSeason) \
            .filter_by(league_season_id=league_season_id, team_id=team_id) \
            .first()
        if (
            (match_comp_id is None) &
            (new_comp_name != "") & 
            (new_comp_acronym != "")
        ):
            new_comp = Competition(
                league_id=league_season.league_id,
                data_source_competition_id=None,
                competition_name=new_comp_name,
                competition_acronym=new_comp_acronym,
            )
            db.session.add(new_comp)
            competition_id = new_comp.competition_id
        else:
            competition_id = UUID(match_comp_id)
        match_report_id = match_js.get('match_report_id', None)
        if match_report_id is not None:
            match_report_id = UUID(match_report_id)
        delete_old_match_report = False
        if (len(match_report_image_ids) != 0) or (match_report_text is not None):
            new_match_report = MatchReport(
                image_ids=match_report_image_ids,
                text=match_report_text
            )
            if match_report_id is not None:
                delete_old_match_report = True
                old_match_report_id = match_report_id
            match_report_id = new_match_report.match_report_id
            db.session.add(new_match_report)

        goals_for = match_js['goals_for']
        goals_against = match_js['goals_against']
        goal_diff = goals_for - goals_against
        result = Result.WIN if (goal_diff > 0) else \
            Result.DRAW if (goal_diff == 0) else Result.LOSS
        match_obj = Match(
            match_id=UUID(match_js['match_id']),
            data_source_match_id=None,
            team_season_id=team_season.team_season_id,
            competition_id=competition_id,
            goals_for=goals_for,
            goals_against=goals_against,
            goal_difference=goal_diff,
            pens_for=match_js.get('pens_for', None),
            pens_against=match_js.get('pens_against', None),
            opposition_team_name=match_js['opposition_team_name'],
            result=result,
            date=datetime.strptime(match_js['computer_date'], "%Y-%m-%d").date(),
            time=datetime.strptime(match_js['time'],"%H:%M").time(),
            location=match_js['location'],
            home_away_neutral=HomeAwayNeutral(match_js['home_away_neutral']),
            notes=None,
            match_report_id=match_report_id
        )
        mig = MetricIdGetter(
            metric_list=[
                MetricEnum.APPEARANCES,
                MetricEnum.GOALS, 
                MetricEnum.POTM
            ],
            data_source=DataSourceEnum.MANUAL
        )
        metric_ids = mig.get_metric_ids_dict()
        player_id_list = [
            UUID(player_id)
            for player_id in active_players.keys()
        ]
        players_by_id = {
            str(pl.player_id) : pl
            for pl in db.session.query(Player) \
                .filter(Player.player_id.in_(player_id_list)) \
                .all()
        }
        pmps = []
        new_players = []
        club_id = team_season.team.club_id
        for player_id, player_js in active_players.items(): 
            if player_id not in players_by_id:
                new_players.append(
                    Player(
                        player_id=UUID(player_id),
                        club_id=club_id,
                        data_source_player_name=player_js['player_name']
                    )
                )
            pmps.append(
                PlayerMatchPerformance(
                    player_id=UUID(player_id),
                    match_id=match_obj.match_id,
                    metric_id=metric_ids[MetricEnum.APPEARANCES],
                    value=1
                )
            )
            if (player_id in goals) and (goals[player_id] > 0):
                pmps.append(
                    PlayerMatchPerformance(
                        player_id=UUID(player_id),
                        match_id=match_obj.match_id,
                        metric_id=metric_ids[MetricEnum.GOALS],
                        value=goals[player_id]
                    )
                )
            if player_id == potm:
                pmps.append(
                    PlayerMatchPerformance(
                        player_id=UUID(player_id),
                        match_id=match_obj.match_id,
                        metric_id=metric_ids[MetricEnum.POTM],
                        value=1
                    )
                )
        club_own_goaler = db.session.query(Player) \
            .filter(
                Player.data_source_player_name == MiscStrings.OWN_GOALS,
                Player.club_id == club_id
            ) \
            .first()
        if club_own_goaler is None:
            club_own_goaler = Player(
                club_id=club_id,
                data_source_player_name=MiscStrings.OWN_GOALS
            )
            new_players.append(club_own_goaler)
        # pmps.append(
        #     PlayerMatchPerformance(
        #         player_id=club_own_goaler.player_id,
        #         metric_id=metric_ids[MetricEnum.APPEARANCES],
        #         value=1,
        #         match_id=match_obj.match_id
        #     )
        # )
        own_goals = match_obj.goals_for - sum(goals.values())
        if own_goals > 0:
            pmps.append(
                PlayerMatchPerformance(
                    player_id=club_own_goaler.player_id,
                    metric_id=metric_ids[MetricEnum.GOALS],
                    value=own_goals,
                    match_id=match_obj.match_id
                )
            )
        ## Remove all pmp data that already exists
        db.session.query(PlayerMatchPerformance) \
            .filter_by(match_id=match_obj.match_id) \
            .delete()
        
        db.session.merge(match_obj)
        for np in new_players:
            db.session.merge(np)
        for pmp in pmps:
            db.session.merge(pmp)
        if delete_old_match_report:
            db.session.query(MatchReport) \
                .filter_by(match_report_id=old_match_report_id) \
                .delete()
        db.session.commit()
        return jsonify(success=True)
    except Exception as e:
        return do_error_handling(e)  