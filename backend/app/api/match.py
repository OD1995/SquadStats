import asyncio
import traceback
from uuid import UUID
from flask import Blueprint, request
from app import db
from app.models.Match import Match
from app.models.MatchError import MatchError
from app.models.Metric import Metric
from app.models.Player import Player
from app.models.PlayerMatchPerformance import PlayerMatchPerformance
from app.scrapers.teams.FootballAssociationTeamScraper import FootballAssociationTeamScraper
from app.types.enums import DataSource

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
            .filter(club_id=team.club_id) \
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
        if data_source.data_source_id == DataSource.FOOTBALL_ASSOCIATION:
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
            for match_id, result in results:
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
                    for metric_name, value in metric_dict.items():
                        cleaner_metric_name = metric_name.strip().lower()
                        if cleaner_metric_name in metrics_by_name:
                            metric = metrics_by_name[cleaner_metric_name]
                        else:
                            metric = Metric(
                                data_source_id=data_source.data_source_id,
                                metric_name=metric_name
                            )
                            new_metrics.append(metric)
                        player_match_perf = PlayerMatchPerformance(
                            player_id=player.player_id,
                            match_id=match_id,
                            metric_id=metric.metric_id,
                            value=value
                        )
                        new_player_match_perfs.append(player_match_perf)                        
            db.session.add_all(new_players)
            db.session.add_all(new_metrics)
            db.session.add_all(new_player_match_perfs)
            db.session.add_all(new_match_errors)
            db.session.commit()
        else:
            raise Exception(f"Unexpected data source: {data_source.data_source_id}")
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400
