from pdb import pm
from uuid import UUID
from app import db
from app.models.Match import Match
from app.types.GenericTableCell import GenericTableCell
from app.types.GenericTableData import GenericTableData
from app.types.GenericTableRow import GenericTableRow
from app.types.enums import Metric

class MatchInfoDataHandler:

    def __init__(
        self,
        match_id:str
    ):
        self.match_id = UUID(match_id)

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
                sort_by=Metric.FEATURED_PLAYER,
                sort_direction='asc'
            ).to_dict(),
            # 'unique_metric_names' : list(unique_metrics.keys()),
            'match_info' : match.to_dict(),
            'team_name' : match.team_season.team.get_default_team_name(),
            'competition_full_name' : match.competition.competition_name
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
                if metric_name == Metric.FEATURED_PLAYER:
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
            Metric.GOALS,
            Metric.ASSISTS,
            Metric.PLAYER_OF_MATCH,
            Metric.POTM
        ]
        metric_dict = {}
        for metric in unique_metrics:
            if metric != Metric.APPEARANCES:
                metric_dict[metric] = False
        return_array = [Metric.FEATURED_PLAYER]
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