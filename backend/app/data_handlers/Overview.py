from sqlalchemy import Row
from app.helpers.misc import get_timestamp_from_date
from app.models.Match import Match
from app.models.Player import Player
from app.types.GenericTableCell import GenericTableCell
from app.types.GenericTableData import GenericTableData
from app.types.GenericTableRow import GenericTableRow

class Overview:

    def __init__(self):
        pass

    def create_table_data_for_matches(
        self,
        title:str,
        matches:list[Match]
    ):
        column_headers = [
            'Opposition',
            'Result',
            'Date'
        ]
        rows = []
        for match in matches:
            cells = {
                'Opposition' : GenericTableCell(
                    value=f"{match.opposition_team_name} ({match.home_away_neutral.value[0]})",
                    link=f"/team/{match.team_season.team_id}/match/{match.match_id}"
                ),
                'Result' : GenericTableCell(
                    value=f"{match.goals_for}-{match.goals_against}"
                ),
                'Date' : GenericTableCell(
                    value=match.date
                )
            }
            rows.append(GenericTableRow(row_data=cells))
        return GenericTableData(
            column_headers=column_headers,
            rows=rows,
            title=title.upper(),
            is_ranked=True,
            not_sortable=True,
            column_ratio=[4, 41, 20, 35]
        ).to_dict()
            
    def create_table_data_for_player_stats(
        self,
        title:str,
        stat_name:str,
        player_stats:Row
    ):
        column_headers =[
            'Player',
            stat_name
        ]
        rows = []
        player:Player
        for player, stat in player_stats:
            cells = {
                'Player' : GenericTableCell(
                    value=player.get_best_name(),
                    link=f"/player/{player.player_id}/overview"
                ),
                stat_name : GenericTableCell(
                    value=stat
                )
            }
            rows.append(GenericTableRow(row_data=cells))
        return GenericTableData(
            column_headers=column_headers,
            rows=rows,
            title=title.upper(),
            is_ranked=True,
            not_sortable=True,
            column_ratio=[4, 58, 38]
        ).to_dict()