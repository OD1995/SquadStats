from uuid import UUID
from sqlalchemy import func
from app import db
from app.data_handlers.DataHandler import DataHandler
from app.helpers.misc import is_own_goal_player
from app.models.LeagueSeason import LeagueSeason
from app.models.Match import Match
from app.models.Metric import Metric
from app.models.Player import Player
from app.models.PlayerMatchPerformance import PlayerMatchPerformance
from app.models.Team import Team
from app.models.TeamSeason import TeamSeason
from app.types.GenericTableCell import GenericTableCell
from app.types.GenericTableData import GenericTableData
from app.types.GenericTableRow import GenericTableRow
from app.types.enums import Metric as MetricEnum

class MatchInfoDataHandler(DataHandler):

    def __init__(
        self,
        match_id:str
    ):
        DataHandler.__init__(self)
        self.match_id = UUID(match_id)

    def get_edit_update_info(self, league_season_id, team_id):
        league_season_id = UUID(league_season_id)
        team_id = UUID(team_id)
        team = db.session.query(Team) \
            .filter_by(team_id=team_id) \
            .first()
        ## Locations
        location_list = db.session.query(
            Match.home_away_neutral,
            Match.location
        ) \
            .join(TeamSeason) \
            .join(Team) \
            .filter(Team.club_id == team.club_id) \
            .distinct() \
            .all()
        location_dict = {}
        for han, loc in location_list:
            if han in location_dict:
                location_dict[han].append(loc)
            else:
                location_dict[han] = [loc]
        ## Competitions
        # competition_list = db.session.query(Competition) \
        #     .join(League) \
        #     .join(LeagueSeason) \
        #     .filter(LeagueSeason.league_season_id == league_season_id) \
        #     .all()
        league_season_obj = db.session.query(LeagueSeason) \
            .filter_by(league_season_id=league_season_id) \
            .first()
        competitions = [
            c.get_competition_info()
            for c in league_season_obj.league.competitions
        ]
        ## Active players
        player_list = db.session.query(Player) \
            .filter(Player.club_id == team.club_id) \
            .all()
        player_team_apps = db.session.query(
                Player.player_id,
                func.sum(PlayerMatchPerformance.value)
            ) \
            .join(Player) \
            .join(Match) \
            .join(TeamSeason) \
            .join(Metric) \
            .filter(
                TeamSeason.team_id == team_id,
                Metric.metric_name == MetricEnum.APPEARANCES
            ) \
            .group_by(Player.player_id)\
            .all()
        player_team_apps_dict = {
            str(p_id) : apps
            for p_id, apps in player_team_apps
        }
        available_players = {
            str(p.player_id) : p
            for p in player_list
            if not is_own_goal_player(p)
        }
        ## Match
        match_ = db.session.query(Match) \
            .filter_by(match_id=self.match_id) \
            .first()
        goals = {}
        potm = None
        active_players = {}
        match_info = None
        extra_match_info = {
            'league_name' : league_season_obj.league.league_name,
            'season_name' : league_season_obj.data_source_season_name
        }
        if (match_ is not None):
            metric_name_list = [
                MetricEnum.APPEARANCES,
                MetricEnum.GOALS,
                MetricEnum.POTM
            ]
            pmp_list = db.session.query(PlayerMatchPerformance) \
                .join(Metric) \
                .filter(
                    PlayerMatchPerformance.match_id == match_.match_id,
                    Metric.metric_name.in_(metric_name_list)
                ) \
                .all()
            for pmp in pmp_list:
                pid = str(pmp.player_id)
                match pmp.metric.metric_name:
                    case MetricEnum.APPEARANCES:
                        active_players[pid] = pmp.player
                        if pid in available_players:
                            del available_players[pid]
                    case MetricEnum.GOALS:
                        if pid in goals:
                            goals[pid] += pmp.value
                        else:
                            goals[pid] = pmp.value
                    case MetricEnum.POTM:
                        potm = pid
            match_info = match_.to_dict()
        #     extra_match_info = {
        #         'league_name' : match_.team_season.league_season.league.league_name,
        #         'season_name' : match_.team_season.league_season.data_source_season_name
        #     }
        # else:
        #     extra_match_info = {
        #         'league_name' : match_.team_season.league_season.league.league_name,
        #         'season_name' : match_.team_season.league_season.data_source_season_name
        #     }
        return {
            'match' : match_info,
            'extra_match_info' : extra_match_info,
            'goals' : goals,
            'potm' : potm,
            'locations' : location_dict,
            'competitions' : competitions,
            'active_players' : self.make_players_sortable(active_players, player_team_apps_dict),
            'available_players' : self.make_players_sortable(available_players, player_team_apps_dict),
        }
    
    def make_players_sortable(
        self,
        player_dict,
        player_team_apps_dict
    ):
        return_me = {}
        for player_id, player_obj in player_dict.items():
            return_me[player_id] = {
                'player' : player_obj.to_dict(),
                'apps' : player_team_apps_dict.get(player_id, 0),
                'name' : player_obj.get_best_name()
            }
        return return_me

    def get_result(self):
        match = db.session.query(Match) \
            .filter_by(match_id=self.match_id) \
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
        player_data_col_headers = self.get_ordered_player_data_columns(unique_metrics.keys())

        return {
            'player_data' : GenericTableData(
                column_headers=player_data_col_headers,
                rows=self.create_rows_from_pmp_dict(
                    pmp_dict=pmp_dict,
                    column_headers=player_data_col_headers
                ),
                title=None,
                is_ranked=False,
                not_sortable=False,
                sort_by=MetricEnum.FEATURED_PLAYER,
                sort_direction='asc'
            ).to_dict(),
            # 'unique_metric_names' : list(unique_metrics.keys()),
            'match_info' : match.to_dict(),
            'team_name' : match.team_season.team.get_default_team_name(),
            'competition_full_name' : match.competition.competition_name,
            'league_season_id' : match.team_season.league_season_id,
            'team' : match.team_season.team.get_team_info()
        }
    
    def create_rows_from_pmp_dict(
        self,
        pmp_dict:dict,
        column_headers:list[str]
    ):
        rows = []
        for player_id, player_dict in pmp_dict.items():
            row_data = {}
            for metric_name in column_headers:
                if metric_name == MetricEnum.FEATURED_PLAYER:
                    new_cell = GenericTableCell(
                        value=player_dict['player_name'],
                        link=f"/player/{player_id}/overview"
                    )
                else:
                    new_cell = GenericTableCell(value=player_dict.get(metric_name, ""))
                row_data[metric_name] = new_cell
            rows.append(GenericTableRow(row_data=row_data))
        return rows