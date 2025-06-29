from re import S
from uuid import UUID
from sqlalchemy import func, and_
from app.data_handlers.DataHandler import DataHandler
from app import db
from app.helpers.QueryBuilder import QueryBuilder
from app.helpers.misc import get_goal_metrics, get_potm_metrics, is_own_goal_player, normal_round
from app.models.Club import Club
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
from app.types.enums import Metric as MetricEnum, MiscStrings, Result, SplitByType

class LeaderboardDataHandler(DataHandler):

    def __init__(
        self,
        metric:str,
        club_id:str|None,
        team_id:str|None,
        split_by:str|None,
        season_filter:str,
        opposition_filter:str|None,
        team_id_filter:str|None,
        player_id_filter:str|None,
        per_game:bool|None,
        min_apps:int|None,
        min_goals:int|None,
        year_filter:int|None,
        month_filter:str|None,
    ):
        """
        metric - should be one of Metric options
        club_id - None (if focus is on team matches) or uuid
        team_id - None (if focus is on club matches) or uuid
        season_filter - '' or uuid (league_season_id) or str (data_source_season_name, if focus is on all club matches)
        opposition_filter - None or str (opposition_team_name)
        team_id_filter - '' or uuid
        year_filter = None or int
        month_filter = None or str
        """
        DataHandler.__init__(self)
        self.metric = metric
        self.club_id = club_id
        self.team_id = team_id
        self.season_filter = season_filter
        self.opposition_filter = opposition_filter
        self.team_id_filter = team_id_filter
        self.split_by = split_by
        self.player_id_filter = player_id_filter
        self.year_filter = year_filter
        self.month_filter = month_filter

        self.query_split_by = self.get_query_split_by()
        self.per_game = False if ((per_game == "False") or (per_game is None)) else True
        self.min_apps = None if (min_apps is None) else int(min_apps)
        self.min_goals = None if (min_goals is None) else int(min_goals)

        self.PLAYER = 'Player'
        self.PER_GAME = 'Per Game'
        self.CONSECUTIVE_MATCHES = 'Streak Length'
        self.FIRST_MATCH_DATE = "Streak Start"
        self.LAST_MATCH_DATE = "Streak End"
        self.GOALS_IN_STREAK = 'Goals In Streak'
        self.GAP_START = 'Gap Start'
        self.GAP_END = 'Gap End'
        self.DAYS = 'Days'

        self.metric_lookup = {
            MetricEnum.GOALS : get_goal_metrics(),
            MetricEnum.HATTRICKS : get_goal_metrics(),
            MetricEnum.POTM : get_potm_metrics(),
        }

    def get_result(self):
        match self.metric:
            case MetricEnum.APPEARANCES | MetricEnum.GOALS | MetricEnum.HATTRICKS | MetricEnum.POTM:
                return self.get_standard_metric_result()
            case MetricEnum.IMPACT_GOALS:
                return self.get_impact_goals_result()
            case MetricEnum.IMPACT_GOAL_RATIO:
                return self.get_impact_goal_ratio_result()
            case MetricEnum.CLEAN_SHEETS:
                return self.get_clean_sheets_result()
            case MetricEnum.CONSECUTIVE_APPS:
                return self.get_consecutive_apps_result()
            case MetricEnum.CONSECUTIVE_WINS:
                return self.get_consecutive_wins_result()
            case MetricEnum.CONSECUTIVE_GOALSCORING_MATCHES:
                return self.get_consecutive_goalscoring_matches_result()
            case MetricEnum.CONSECUTIVE_HATTRICKS:
                return self.get_consecutive_hattricks_result()
            case MetricEnum.POINTS_PER_GAME:
                return self.get_player_impact_result(
                    metric=MetricEnum.POINTS_PER_GAME,
                    value_callback=lambda match : match.get_points_earned()
                )
            case MetricEnum.GOALS_SCORED:
                return self.get_player_impact_result(
                    metric=MetricEnum.GOALS_SCORED,
                    value_callback=lambda match : match.goals_for
                )
            case MetricEnum.GOALS_CONCEDED:
                return self.get_player_impact_result(
                    metric=MetricEnum.GOALS_CONCEDED,
                    value_callback=lambda match : match.goals_against
                )
            case MetricEnum.GOAL_DIFFERENCE:
                return self.get_player_impact_result(
                    metric=MetricEnum.GOAL_DIFFERENCE,
                    value_callback=lambda match : match.goal_difference
                )
            case MetricEnum.X_SHREK:
                return self.get_xshrek_result()
            case MetricEnum.DAYS_BETWEEN_APPS:
                return self.get_days_between_apps_result()

        raise Exception('Unexpected metric')
    
    def get_impact_goal_data(self):
        filters = [
            Metric.metric_name.in_(self.metric_lookup[MetricEnum.GOALS] + [MetricEnum.APPEARANCES])
        ] + self.get_filters()
        ig_data = self.get_complicated_player_performances(
            query_selectors=[PlayerMatchPerformance, Player, Match],
            filters=filters
        )
        data = {}
        for [pmp,player,match] in ig_data:
            splitter = match.get_agg_data_key(
                split_by=self.split_by
            )
            p_id = str(player.player_id)
            if p_id not in data:
                data[p_id] = {
                    'player_obj' : player
                }
            if splitter not in data[p_id]:
                data[p_id][splitter] = {
                    MetricEnum.IMPACT_GOALS : 0,
                    MetricEnum.APPEARANCES : 0,
                    MetricEnum.GOALS : 0,
                }
            if pmp.metric.metric_name == MetricEnum.GOALS:
                x = match.get_impact_goal_denominator()
                goals = pmp.value
                data[p_id][splitter][MetricEnum.GOALS] += goals
                data[p_id][splitter][MetricEnum.IMPACT_GOALS] += goals/x
                if player.data_source_player_name == MiscStrings.OWN_GOALS:
                    data[p_id][splitter][MetricEnum.APPEARANCES] += 1
            elif pmp.metric.metric_name == MetricEnum.APPEARANCES:
                data[p_id][splitter][MetricEnum.APPEARANCES] += pmp.value
        return data
    
    def get_impact_goals_result(self):
        ## Normal
        ## Per Game
        ## Split By
        data = self.get_impact_goal_data()
        metric = MetricEnum.IMPACT_GOALS + (f" {self.PER_GAME}" if self.per_game else "")
        column_headers = [
            self.PLAYER,
            *([self.split_by] if self.split_by is not None else []),
            metric,
            *([MetricEnum.APPEARANCES] if self.per_game else [])
        ]
        rows = []
        for player_data in data.values():
            if self.split_by is None:                
                row = self.create_impact_goal_row(player_data,"")
                if row:
                    rows.append(row)
            else:
                for splitter in player_data.keys():
                    if splitter in ["player_obj"]:
                        continue
                    row = self.create_impact_goal_row(player_data,splitter)
                    if row:
                        rows.append(row)

        return [
            GenericTableData(
                column_headers=column_headers,
                rows=rows,
                title=metric.upper(),
                is_ranked=True,
                sort_by=metric,
                sort_direction='desc',
                column_ratio=self.get_generic_column_ratio()
            ).to_dict()
        ]
    
    def get_impact_goal_ratio_result(self):
        ## Normal
        ## Per Game
        ## Split By
        data = self.get_impact_goal_data()
        metric = MetricEnum.IMPACT_GOAL_RATIO
        column_headers = [
            self.PLAYER,
            *([self.split_by] if self.split_by is not None else []),
            MetricEnum.IMPACT_GOALS,
            MetricEnum.GOALS,
            metric,
        ]
        rows = []
        for player_data in data.values():
            if self.split_by is None:                
                row = self.create_impact_goal_ratio_row(player_data,"")
                if row:
                    rows.append(row)
            else:
                for splitter in player_data.keys():
                    if splitter in ["player_obj"]:
                        continue
                    row = self.create_impact_goal_ratio_row(player_data,splitter)
                    if row:
                        rows.append(row)

        return [
            GenericTableData(
                column_headers=column_headers,
                rows=rows,
                title=metric.upper(),
                is_ranked=True,
                sort_by=metric,
                sort_direction='desc',
                column_ratio=[1,30,20,20,30] if self.split_by is None else [1,30,15,15,15,25]
            ).to_dict()
        ]

    
    def get_generic_column_ratio(self):
        if self.per_game:
            if self.split_by is not None:
                column_ratio = [1,30,20,25,24]
            else:
                column_ratio = [1,30,35,34]
        elif self.split_by is not None:
            column_ratio = [1,30,35,34]
        else:
            column_ratio = [1,50,49]
        return column_ratio
    
    def create_impact_goal_row(self, player_data, splitter):
        if is_own_goal_player(player_data['player_obj']):
            return False
        impact_goals = player_data[splitter][MetricEnum.IMPACT_GOALS]
        apps = player_data[splitter][MetricEnum.APPEARANCES]
        if (
            (impact_goals == 0) or 
            ((self.min_apps is not None) and (apps < self.min_apps))
        ):
            return False
        
        row_data = {
            self.PLAYER : self.create_player_cell(player_data['player_obj'])
        }
        if splitter != "":
            row_data[self.split_by] = GenericTableCell(value=splitter)
        if self.per_game:
            metric = f"{MetricEnum.IMPACT_GOALS.value} {self.PER_GAME}"
            per_game_val = normal_round(impact_goals/apps)
            row_data[metric] = GenericTableCell(value=per_game_val)
            row_data[MetricEnum.APPEARANCES] = GenericTableCell(value=apps)
        else:
            row_data[MetricEnum.IMPACT_GOALS] = GenericTableCell(value=normal_round(impact_goals))
        return GenericTableRow(row_data=row_data)
    
    def create_impact_goal_ratio_row(self, player_data, splitter):
        if is_own_goal_player(player_data['player_obj']):
            return False
        impact_goals = player_data[splitter][MetricEnum.IMPACT_GOALS]
        goals = player_data[splitter][MetricEnum.GOALS]
        ratio = normal_round(impact_goals / goals) if goals != 0 else 0        
        if (self.min_goals is not None) and (goals < self.min_goals):
            return False
        row_data = {
            self.PLAYER : self.create_player_cell(player_data['player_obj'])
        }
        if splitter != "":
            row_data[self.split_by] = GenericTableCell(value=splitter)
        row_data[MetricEnum.IMPACT_GOALS] = GenericTableCell(value=normal_round(impact_goals))
        row_data[MetricEnum.GOALS] = GenericTableCell(value=goals)
        row_data[MetricEnum.IMPACT_GOAL_RATIO] = GenericTableCell(value=ratio)
        return GenericTableRow(row_data=row_data)
    
    def get_days_between_apps_result(self):
        ## Get data
        (
            match_id_list,
            matches_by_id,
            pmps_by_player_id
        ) = self.get_consecutive_data()
        gaps = []
        unique_player_ids = {}
        for player_id, player_match_dict in pmps_by_player_id.items():
            match_list = [
                matches_by_id[match_id]
                for match_id in player_match_dict.keys()
            ]
            match_list.sort(key=lambda m: m.date)
            for ix, match in enumerate(match_list):
                if ix == 0:
                    prev_match_date = match.date
                    continue
                days_passed = (match.date - prev_match_date).days
                if days_passed >= 14:
                    gaps.append(
                        {
                            'player_id' : player_id,
                            'gap_start' : prev_match_date,
                            'gap_end' : match.date,
                            'days' : days_passed
                        }
                    )
                    unique_player_ids[player_id] = 1
                prev_match_date = match.date
        return self.return_gap_table(
            gaps=gaps,
            player_ids=list(unique_player_ids.keys()),
            metric=MetricEnum.DAYS_BETWEEN_APPS
        )
    
    def return_gap_table(
        self,
        gaps,
        player_ids,
        metric
    ):
        player_list = db.session.query(Player) \
            .filter(Player.player_id.in_([UUID(x) for x in player_ids])) \
            .all()
        players_by_player_id = {
            str(p.player_id) : p
            for p in player_list
        }
        rows = []
        for gap in gaps:
            player = players_by_player_id[gap['player_id']]
            if is_own_goal_player(player):
                continue
            row_data = {
                self.PLAYER : self.create_player_cell(player),
                self.DAYS : GenericTableCell(value=gap['days']),
                self.GAP_START : GenericTableCell(value=gap['gap_start']),
                self.GAP_END : GenericTableCell(value=gap['gap_end']),
            }
            rows.append(GenericTableRow(row_data=row_data))

        column_headers = [
            self.PLAYER,
            self.DAYS,
            self.GAP_START,
            self.GAP_END
        ]
        return [
            GenericTableData(
                column_headers=column_headers,
                rows=rows,
                title=metric.upper(),
                is_ranked=True,
                sort_by=self.DAYS,
                sort_direction='desc',
                column_ratio=[1,33,24,21,21]
            ).to_dict()
        ]
    
    def get_xshrek_result(self):
        rows = []
        metric = MetricEnum.X_SHREK + (f" {self.PER_GAME}" if self.per_game else "")
        column_headers = [
            self.PLAYER,
            metric
        ]
        sam_sholli = db.session.query(Player) \
            .filter_by(data_source_player_name="Sam Sholli") \
            .first()
        val = 1_000_000
        self.player_id_filter = str(sam_sholli.player_id)
        if self.per_game:
            matches_query = QueryBuilder(
                db.session.query(Match) \
                    .join(PlayerMatchPerformance) \
                    .join(Player)
            )
            if self.season_filter not in [None, '']:
                matches_query.add_join(TeamSeason)
                matches_query.add_join(LeagueSeason)
            for filter in self.get_filters():
                if filter is not None:
                    matches_query.add_filter(filter)
            match_list = matches_query.all()
            apps = len(match_list)
            val = normal_round(val / apps)
        row_data = {
            self.PLAYER : self.create_player_cell(sam_sholli),
            metric : GenericTableCell(value=f'{val:,}')
        }
        if self.per_game:
            row_data[MetricEnum.APPEARANCES] = GenericTableCell(value=apps)
            column_headers.append(MetricEnum.APPEARANCES)
        rows.append(GenericTableRow(row_data=row_data))
        return [
            GenericTableData(
                column_headers=column_headers,
                rows=rows,
                title=metric.upper(),
                is_ranked=True,
                sort_by=metric,
                sort_direction='desc',
                # column_ratio=[1,40,20,20]
            ).to_dict()
        ]

    def get_player_impact_result(
        self,
        metric,
        value_callback
    ):
        better_cols = {
            MetricEnum.POINTS_PER_GAME : "PPG",
            MetricEnum.GOALS_SCORED : "Avg Goals Scored",
            MetricEnum.GOALS_CONCEDED : "Avg Goals Conceded",
            MetricEnum.GOAL_DIFFERENCE : "Avg Goal Difference"
        }
        col = better_cols.get(metric, metric)
        if self.team_id is not None:
            team_obj = db.session.query(Team) \
                .filter_by(team_id=UUID(self.team_id)) \
                .first()
            team_or_club_name = team_obj.get_default_team_name()
        elif self.club_id is not None:
            club_obj = db.session.query(Club) \
                .filter_by(club_id=UUID(self.club_id)) \
                .first()
            team_or_club_name = club_obj.club_name
        else:
            raise Exception("Neither club_id nor team_id provided")
        match_id_list, matches_by_id = self.get_match_data()
        result_by_player = {
            team_or_club_name : {'score' : 0, 'matches' : 0}
        }
        players_by_id = {}
        for match_id in match_id_list:
            match = matches_by_id[str(match_id)]
            active_player_dict = match.get_active_player_dict()
            players_by_id = {**players_by_id, **active_player_dict}
            player_id_list = list(active_player_dict.keys()) + [team_or_club_name]
            score = value_callback(match)
            for player_id in player_id_list:
                if player_id not in result_by_player:
                    result_by_player[player_id] = {'score' : 0, 'matches' : 0}
                result_by_player[player_id]['score'] += score
                result_by_player[player_id]['matches'] += 1
        rows = []
        for player_id, result in result_by_player.items():
            if result['matches'] < (self.min_apps or 0):
                continue
            player_cell = GenericTableCell(value=player_id)
            if player_id in players_by_id:
                player = players_by_id[player_id]
                if is_own_goal_player(player):
                    continue
                player_cell = self.create_player_cell(player)
            # player_cell = self.create_player_cell(players_by_id[player_id]) \
            #     if player_id in players_by_id else \
            #     GenericTableCell(value=player_id)
            val = normal_round(result['score'] / result['matches'])
            row_data = {
                self.PLAYER : player_cell,
                col : GenericTableCell(value=val),
                MetricEnum.APPEARANCES : GenericTableCell(value=result['matches'])
            }
            rows.append(GenericTableRow(row_data=row_data))
        column_headers = [
            self.PLAYER,
            col,
            MetricEnum.APPEARANCES
        ]
        return [
            GenericTableData(
                column_headers=column_headers,
                rows=rows,
                title=metric.upper(),
                is_ranked=True,
                sort_by=col,
                sort_direction='asc' if metric == MetricEnum.GOALS_CONCEDED else'desc',
                column_ratio=[1,40,20,20]
            ).to_dict()
        ]
        
    def get_clean_sheets_result(self):
        match_id_list, matches_by_id = self.get_match_data()
        players_by_id = {}
        result_by_player = {
            # team_name : {'score' : 0, 'matches' : 0}
        }
        for match_id in match_id_list:
            match = matches_by_id[str(match_id)]
            active_player_dict = match.get_active_player_dict()
            players_by_id = {**players_by_id, **active_player_dict}
            for player_id in active_player_dict.keys():
                if player_id not in result_by_player:
                    result_by_player[player_id] = {'clean_sheets' : 0, 'matches' : 0}
                result_by_player[player_id]['matches'] += 1
                if match.goals_against == 0:
                    result_by_player[player_id]['clean_sheets'] += 1
        metric = MetricEnum.CLEAN_SHEETS + (f" {self.PER_GAME}" if self.per_game else "")
        rows = []
        for player_id, result in result_by_player.items():
            clean_sheets = result['clean_sheets']
            matches = result['matches']
            if (self.min_apps is not None) and (self.min_apps > matches):
                continue
            val = normal_round(clean_sheets / matches) \
                if self.per_game else clean_sheets
            if val == 0:
                continue
            row_data = {
                self.PLAYER : self.create_player_cell(players_by_id[player_id]),
                metric : GenericTableCell(value=val)
            }
            if self.per_game:
                row_data[MetricEnum.APPEARANCES] = GenericTableCell(value=result['matches'])
            rows.append(GenericTableRow(row_data=row_data))

        column_headers = [
            self.PLAYER,
            metric,
        ]
        if self.per_game:
            column_headers.append(MetricEnum.APPEARANCES)
        return [
            GenericTableData(
                column_headers=column_headers,
                rows=rows,
                title=metric.upper(),
                is_ranked=True,
                sort_by=metric,
                sort_direction='desc',
                # column_ratio=[1,33,15,20,21,21] if goals else [1,36,20,21.5,21.5]
            ).to_dict()
        ]

    def get_consecutive_hattricks_result(self):
        ## Get data
        (
            match_id_list,
            matches_by_id,
            pmps_by_player_id
        ) = self.get_consecutive_data()
        all_streaks = []
        involved_player_id_list = []
        ## Do logic
        for player_id, matches in pmps_by_player_id.items():
            streaks = []
            current_streak = {
                'streak_length' : 0,
                'first_game_date' : None,
                'last_game_date' : None,
                'player_id' : player_id,
                'goals_in_streak' : 0
            }
            for match_id in match_id_list:
                match_id = str(match_id)
                if (match_id in matches):
                    goals_scored = matches[match_id]
                    if (goals_scored >= 3):
                        match = matches_by_id[match_id]
                        current_streak['streak_length'] += 1
                        current_streak['goals_in_streak'] += goals_scored
                        current_streak['last_game_date'] = match.date
                        if current_streak['first_game_date'] is None:
                            current_streak['first_game_date'] = match.date
                    else:
                        if current_streak['streak_length'] >= 2:
                            streaks.append(current_streak)
                        current_streak = {
                            'streak_length' : 0,
                            'first_game_date' : None,
                            'last_game_date' : None,
                            'player_id' : player_id,
                            'goals_in_streak' : 0
                        }
            if current_streak['streak_length'] >= 2:
                current_streak['last_game_date'] = None
                streaks.append(current_streak)
            if len(streaks) > 0:
                involved_player_id_list.append(UUID(player_id))
                all_streaks.extend(streaks)
        ## Return data
        return self.return_consecutive_table(
            involved_player_id_list,
            all_streaks,
            MetricEnum.CONSECUTIVE_HATTRICKS,
            goals=True
        )

    def get_consecutive_goalscoring_matches_result(self):
        ## Get data
        (
            match_id_list,
            matches_by_id,
            pmps_by_player_id
        ) = self.get_consecutive_data()
        all_streaks = []
        involved_player_id_list = []
        ## Do logic
        for player_id, matches in pmps_by_player_id.items():
            streaks = []
            current_streak = {
                'streak_length' : 0,
                'first_game_date' : None,
                'last_game_date' : None,
                'player_id' : player_id,
                'goals_in_streak' : 0
            }
            for match_id in match_id_list:
                match_id = str(match_id)
                if (match_id in matches):
                    goals_scored = matches[match_id]
                    if (goals_scored >= 1):
                        match = matches_by_id[match_id]
                        current_streak['streak_length'] += 1
                        current_streak['goals_in_streak'] += goals_scored
                        current_streak['last_game_date'] = match.date
                        if current_streak['first_game_date'] is None:
                            current_streak['first_game_date'] = match.date
                    else:
                        if current_streak['streak_length'] >= 2:
                            streaks.append(current_streak)
                        current_streak = {
                            'streak_length' : 0,
                            'first_game_date' : None,
                            'last_game_date' : None,
                            'player_id' : player_id,
                            'goals_in_streak' : 0
                        }
            if current_streak['streak_length'] >= 2:
                current_streak['last_game_date'] = None
                streaks.append(current_streak)
            if len(streaks) > 0:
                involved_player_id_list.append(UUID(player_id))
                all_streaks.extend(streaks)
        ## Return data
        return self.return_consecutive_table(
            involved_player_id_list,
            all_streaks,
            MetricEnum.CONSECUTIVE_GOALSCORING_MATCHES,
            goals=True
        )

    def get_consecutive_wins_result(self):
        ## Get data
        (
            match_id_list,
            matches_by_id,
            pmps_by_player_id
        ) = self.get_consecutive_data()
        all_streaks = []
        involved_player_id_list = []
        ## Do logic
        for player_id, matches in pmps_by_player_id.items():
            streaks = []
            current_streak = {
                'streak_length' : 0,
                'first_game_date' : None,
                'last_game_date' : None,
                'player_id' : player_id,
            }
            for match_id in match_id_list:
                match_id = str(match_id)
                if (match_id in matches):
                    if (matches_by_id[match_id].result == Result.WIN):
                        match = matches_by_id[match_id]
                        current_streak['streak_length'] += 1
                        current_streak['last_game_date'] = match.date
                        if current_streak['first_game_date'] is None:
                            current_streak['first_game_date'] = match.date
                    else:
                        if current_streak['streak_length'] >= 2:
                            streaks.append(current_streak)
                        current_streak = {
                            'streak_length' : 0,
                            'first_game_date' : None,
                            'last_game_date' : None,
                            'player_id' : player_id,
                        }
            if current_streak['streak_length'] >= 2:
                current_streak['last_game_date'] = None
                streaks.append(current_streak)
            if len(streaks) > 0:
                involved_player_id_list.append(UUID(player_id))
                all_streaks.extend(streaks)
        ## Return data
        return self.return_consecutive_table(involved_player_id_list, all_streaks, MetricEnum.CONSECUTIVE_WINS)

    def get_match_data(
        self,
        skip_walkovers=True
    ):
        ## Get all matches, given the filters
        match_query = QueryBuilder(
            db.session.query(Match) \
                .join(TeamSeason) \
                .join(Team)
        )
        match_query.add_filters(self.get_filters(players=False))
        if self.season_filter not in [None, ""]:
            match_query.add_join(LeagueSeason)
        match_query.order_by([Match.date])
        match_list = match_query.all()
        match_id_list = [
            m.match_id
            for m in match_list
        ]
        match_id_list = []
        matches_by_id = {}
        for match in match_list:
            if skip_walkovers:
                ## Don't include if it was a walkover
                is_walkover = False if match.notes is None else "walkover" in match.notes.lower()
                if is_walkover:
                    continue
            match_id_list.append(match.match_id)
            matches_by_id[str(match.match_id)] = match
        return match_id_list, matches_by_id
    
    def get_consecutive_data(
        self,
        skip_walkovers=True
    ):
        match_id_list, matches_by_id = self.get_match_data(skip_walkovers)
        ## Get all players involved in those matches
        goal_metrics = get_goal_metrics()
        player_filter = self.get_player_filter()
        pmp_list = db.session.query(PlayerMatchPerformance) \
            .join(Metric) \
            .filter(
                PlayerMatchPerformance.match_id.in_(match_id_list),
                Metric.metric_name.in_([MetricEnum.APPEARANCES] + goal_metrics),
                player_filter if player_filter is not None else True,
                Player.data_source_player_name != MiscStrings.OWN_GOALS
            ) \
            .all()
        pmps_by_player_id = {}
        for pmp in pmp_list:
            player_id = str(pmp.player_id)
            match_id = str(pmp.match_id)
            val = 0 if pmp.metric.metric_name not in goal_metrics else pmp.value
            if player_id not in pmps_by_player_id:
                pmps_by_player_id[player_id] = {}
            if match_id not in pmps_by_player_id[player_id]:
                pmps_by_player_id[player_id][match_id] = val
            else:
                pmps_by_player_id[player_id][match_id] += val
        return (
            match_id_list,
            matches_by_id,
            pmps_by_player_id
        )
    
    def return_consecutive_table(
        self,
        involved_player_id_list,
        all_streaks,
        metric,
        goals=False
    ):
        player_list = db.session.query(Player) \
            .filter(Player.player_id.in_(involved_player_id_list)) \
            .all()
        players_by_player_id = {
            str(p.player_id) : p
            for p in player_list
        }
        rows = []
        if goals:
            all_streaks = sorted(all_streaks, key=lambda x: (x['streak_length'], x['goals_in_streak']), reverse=True)
        for streak in all_streaks:
            row_data = {
                self.PLAYER : self.create_player_cell(players_by_player_id[streak['player_id']]),
                self.CONSECUTIVE_MATCHES : GenericTableCell(value=streak['streak_length']),
                self.FIRST_MATCH_DATE : GenericTableCell(value=streak['first_game_date']),
                self.LAST_MATCH_DATE : GenericTableCell(
                    value="present"
                    if streak['last_game_date'] is None else
                    streak['last_game_date']
                ),
            }
            if goals:
                row_data[self.GOALS_IN_STREAK] = GenericTableCell(value=streak['goals_in_streak'])
            rows.append(GenericTableRow(row_data=row_data))

        column_headers = [
            self.PLAYER,
            self.CONSECUTIVE_MATCHES,
            self.FIRST_MATCH_DATE,
            self.LAST_MATCH_DATE
        ]
        if goals:
            column_headers.insert(2,self.GOALS_IN_STREAK)
        return [
            GenericTableData(
                column_headers=column_headers,
                rows=rows,
                title=metric.upper(),
                is_ranked=True,
                sort_by=self.CONSECUTIVE_MATCHES,
                sort_direction='desc',
                column_ratio=[1,33,15,20,21,21] if goals else [1,36,20,21.5,21.5]
            ).to_dict()
        ]

    def get_consecutive_apps_result(self):
        (
            match_id_list,
            matches_by_id,
            pmps_by_player_id
        ) = self.get_consecutive_data()     
        involved_player_id_list = []
        all_streaks = []
        for player_id, matches in pmps_by_player_id.items():
            streaks = []
            current_streak = {
                'streak_length' : 0,
                'first_game_date' : None,
                'last_game_date' : None,
                'player_id' : player_id,
            }
            for match_id in match_id_list:
                if str(match_id) in matches:
                    match = matches_by_id[str(match_id)]
                    current_streak['streak_length'] += 1
                    current_streak['last_game_date'] = match.date
                    if current_streak['first_game_date'] is None:
                        current_streak['first_game_date'] = match.date
                else:
                    if current_streak['streak_length'] >= 2:
                        streaks.append(current_streak)
                    current_streak = {
                        'streak_length' : 0,
                        'first_game_date' : None,
                        'last_game_date' : None,
                        'player_id' : player_id,
                    }
            if current_streak['streak_length'] >= 2:
                current_streak['last_game_date'] = None
                streaks.append(current_streak)
            if len(streaks) > 0:
                involved_player_id_list.append(UUID(player_id))
                all_streaks.extend(streaks)
        return self.return_consecutive_table(involved_player_id_list, all_streaks, MetricEnum.CONSECUTIVE_APPS)
        
    def get_query_split_by(self):
        split_by_lookup = {
            SplitByType.YEAR : func.year(Match.date).label(SplitByType.YEAR.value),
            SplitByType.SEASON : LeagueSeason.data_source_season_name.label(SplitByType.SEASON.value),
            SplitByType.MONTH : func.date_format(Match.date, "%b").label(SplitByType.MONTH.value),
            SplitByType.MONTH_AND_YEAR : func.date_format(Match.date, "%b-%y").label(SplitByType.MONTH_AND_YEAR.value),
            SplitByType.OPPOSITION : Match.opposition_team_name.label(SplitByType.OPPOSITION.value),
            SplitByType.KO_TIME : Match.time.label(SplitByType.KO_TIME.value),
        }
        return split_by_lookup.get(self.split_by, None)
    
    def get_standard_metric_result(self):
        column_headers = [self.PLAYER]
        if self.query_split_by is not None:
            column_headers.append(self.split_by)
        important_metric = f"{self.metric} {self.PER_GAME}" if self.per_game else self.metric
        column_headers.append(important_metric)
        metric_filters = [
            Metric.metric_name.in_(self.metric_lookup.get(self.metric, [self.metric]))
        ] + self.get_filters()
        agg = func.sum
        if self.metric == MetricEnum.HATTRICKS:
            metric_filters.append(PlayerMatchPerformance.value >= 3)
            agg = func.count
        if self.per_game:
            column_headers.append(MetricEnum.APPEARANCES)
            query_selectors = [Player]
            group_by_list = [Player]
            if self.query_split_by is not None:
                query_selectors.append(self.query_split_by)
                group_by_list.append(self.query_split_by)
            perf_col = agg(PlayerMatchPerformance.value).label(self.metric)
            app_col = func.sum(PlayerMatchPerformance.value).label(MetricEnum.APPEARANCES)

            player_performances = self.get_complicated_player_performances(
                query_selectors=query_selectors + [perf_col],
                filters=metric_filters,
                order_by_list=[],
                group_by_list=group_by_list,
                return_all=False
            )
            player_appearances = self.get_complicated_player_performances(
                query_selectors=query_selectors + [app_col],
                filters=[
                    Metric.metric_name == MetricEnum.APPEARANCES
                ] + self.get_filters(),
                group_by_list=group_by_list,
                havings=[func.sum(PlayerMatchPerformance.value) >= self.min_apps] if self.min_apps else [],
                return_all=False
            )
            combined_joins = [
                player_performances.c.player_id == player_appearances.c.player_id
            ]

            if self.query_split_by is not None:
                split_col_name = self.query_split_by.name 
                combined_joins.append(
                    player_performances.c[split_col_name] == player_appearances.c[split_col_name]
                )

            combined_results = db.session.query(player_performances, player_appearances) \
                .join(player_appearances, and_(*combined_joins)) \
                .all()
            rows = []
            for res in combined_results:
                res_dict = res._mapping
                player_name = res.better_player_name or res.data_source_player_name
                row_data = {}
                row_data[self.PLAYER] = GenericTableCell(
                    value=player_name,
                    link=f"/player/{res.player_id}/overview"
                )
                row_data[f"{self.metric} {self.PER_GAME}"] = GenericTableCell(
                    value=normal_round(
                        res_dict[self.metric] / res_dict[MetricEnum.APPEARANCES]
                    )
                )
                row_data[MetricEnum.APPEARANCES] = GenericTableCell(
                    value=res_dict[MetricEnum.APPEARANCES]
                )
                if self.split_by:
                    row_data[self.split_by] = GenericTableCell(
                        value=res_dict[self.split_by]
                    )
                rows.append(GenericTableRow(row_data=row_data))
        else:
            player_performances = self.get_player_performances(
                filters=metric_filters,
                split_by=self.query_split_by,
                sort_value_desc=True,
                aggregator=agg
            )
            rows = self.get_rows(player_performances,column_headers)
        return [
            GenericTableData(
                column_headers=column_headers,
                rows=rows,
                title=important_metric.upper(),
                is_ranked=True,
                sort_by=important_metric,
                sort_direction='desc',
                column_ratio=self.get_generic_column_ratio()
            ).to_dict()
        ]
    
    def get_rows(
        self,
        player_performances,
        column_headers
    ):
        rows = []
        for pp in player_performances:
            row_dict = {}
            for i, ch in enumerate(column_headers):
                if ch == self.PLAYER:
                    val = self.create_player_cell(pp[i])
                else:
                    val = GenericTableCell(
                        value=pp[i]
                    )
                row_dict[ch] = val
            rows.append(
                GenericTableRow(
                    row_data=row_dict
                )
            )
        return rows

    # def get_goals_result(self):
    #     pass

    # def get_filters(self):
    #     filters = []
    #     ## Team/Club filtering
    #     if self.team_id in [None, '']:
    #         filters.append(Team.club_id == UUID(self.club_id))
    #     else:
    #         filters.append(Team.team_id == UUID(self.team_id))
    #     if self.team_id_filter is not None:
    #         filters.append(Team.team_id == UUID(self.team_id_filter))
    #     ## Season filtering
    #     filters.append(self.get_season_filter())
    #     if self.opposition not in [None, '']:
    #         filters.append(Match.opposition_team_name == self.opposition)
    #     return filters
    
    # def get_season_filter(self):
    #     if self.season_filter not in [None, '']:
    #         # matches_query.add_join(LeagueSeason)
    #         if is_valid_uuid(self.season_filter):
    #             return LeagueSeason.league_season_id == UUID(self.season_filter)
    #         else:
    #             return LeagueSeason.data_source_season_name == self.season_filter
    #     return None
        
    # def get_app_result(self):
    #     # pmp_list = self.get_pmps()
    #     # player_dict = {}
    #     # player_data_dict = {}
    #     # for pmp in pmp_list:
    #     #     key1 = str(pmp.player_id)
    #     #     key2 = str(pmp.match_id)
    #     #     player_dict[key1] = pmp.player
    #     #     if key1 not in player_data_dict:
    #     #         player_data_dict[key1] = {}
    #     #     if key2 not in player_data_dict[key1]:
    #     #         player_data_dict[key1][key2] = {}
    #     #     player_data_dict[key1][key2][pmp.metric.get_best_metric_name()] = pmp.value
    #     # result_dict = {}
    #     # for player_id, player_match_dict in player_data_dict.items():
    #     #     player_app_count = 0
    #     #     for match_id, match_dict in player_match_dict.items():
    #     #         if :
    #     #             player_app_count += 
    #     result_dict = {}
    #     player_id_dict = {}
    #     matches = self.get_matches(
    #         filters=self.get_filters()
    #     )
    #     for match in matches:
    #         for player_id, player_obj in match.get_active_player_dict().items():
    #             player_id_dict[player_id] = player_obj
    #             if player_id not in result_dict:
    #                 result_dict[player_id] = 0
    #             result_dict[player_id] += 1
    #     rows = []
    #     column_headers = [
    #         self.PLAYER,
    #         self.metric
    #     ]
    #     for player_id, value in result_dict.items():
    #         rows.append(
    #             GenericTableRow(
    #                 row_data={
    #                     self.PLAYER : GenericTableCell(
    #                         value=player_id_dict[player_id].get_best_name(),
    #                         link=f"/player/{player_id}"
    #                     ),
    #                     self.metric : GenericTableCell(
    #                         value=value
    #                     )
    #                 }
    #             )
    #         )
    #     return [
    #         GenericTableData(
    #             column_headers=column_headers,
    #             rows=sorted(
    #                 rows,
    #                 key=lambda x: x.get_cell_value(self.metric),
    #                 reverse=True
    #             ),
    #             title='APPEARANCES',
    #             is_ranked=True,
    #             not_sortable=False,
    #             sort_by=self.metric,
    #             sort_direction='desc'
    #         ).to_dict()
    #     ]

            
    # def get_pmps(self) -> List[PlayerMatchPerformance]:
    #     apps_query = QueryBuilder(
    #         db.session.query(PlayerMatchPerformance)
    #     )
    #     ###### Add filters
    #     return apps_query.all()
