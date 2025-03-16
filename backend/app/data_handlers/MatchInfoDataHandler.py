from pdb import pm
from uuid import UUID
from app import db
from app.models.Club import Club
from app.models.Competition import Competition
from app.models.League import League
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
from app.types.enums import Metric as MetricEnum, MiscStrings

class MatchInfoDataHandler:

    def __init__(
        self,
        match_id:str
    ):
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
        competition_list = db.session.query(Competition) \
            .join(League) \
            .join(LeagueSeason) \
            .filter(LeagueSeason.league_season_id == league_season_id) \
            .all()
        competitions = [
            c.get_competition_info()
            for c in competition_list
        ]
        ## Active players
        player_list = db.session.query(Player) \
            .filter(Player.club_id == team.club_id) \
            .all()
        available_players = {
            str(p.player_id) : p.to_dict()
            for p in player_list
            if p.get_best_name() != MiscStrings.OWN_GOALS
        }
        ## Match
        match_ = db.session.query(Match) \
            .filter_by(match_id=self.match_id) \
            .first()
        goals = {}
        potm = None
        active_players = {}
        match_info = None
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
                        active_players[pid] = pmp.player.to_dict()
                        del available_players[pid]
                    case MetricEnum.GOALS:
                        if pid in goals:
                            goals[pid] += pmp.value
                        else:
                            goals[pid] = pmp.value
                    case MetricEnum.POTM:
                        potm = pid
            match_info = match_.to_dict()
        return {
            'match' : match_info,
            'goals' : goals,
            'potm' : potm,
            'locations' : location_dict,
            'competitions' : competitions,
            'active_players' : active_players,
            'available_players' : available_players
        }

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
    
    def get_ordered_player_data_columns(
        self,
        unique_metrics:list[str]
    ):
        preferred_order = [
            MetricEnum.GOALS,
            MetricEnum.ASSISTS,
            MetricEnum.PLAYER_OF_MATCH,
            MetricEnum.POTM
        ]
        metric_dict = {}
        for metric in unique_metrics:
            if metric != MetricEnum.APPEARANCES:
                metric_dict[metric] = False
        return_array = [MetricEnum.FEATURED_PLAYER]
        # Add existing metrics in preferred order
        for metric in preferred_order:
            if metric in metric_dict:
                return_array.append(metric)
                metric_dict[metric] = True
        # Add the rest of the metrics
        for metric in metric_dict.keys():
            if metric_dict[metric] == False:
                return_array.append(metric)
        return return_array