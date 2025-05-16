from copy import deepcopy
from dataclasses import dataclass
from typing import List
from uuid import UUID, uuid4
from datetime import date as dateDT, time as timeDT
from sqlalchemy import Enum, ForeignKey, String
from app.helpers.misc import get_unappearance_metrics, is_other_result_type, none_of_list1_in_list2
from app.models import Base
from app.models.Competition import Competition
from app.models.MatchError import MatchError
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.MatchReport import MatchReport
from app.models.PlayerMatchPerformance import PlayerMatchPerformance
from app.models.TeamSeason import TeamSeason
from app.types.GenericTableRow import GenericTableRow
from app.types.enums import HomeAwayNeutral, MiscStrings, Result, SplitByType

@dataclass
class Match(Base):
    __tablename__ = 'matches'
    __table_args__ = {"mysql_engine": "InnoDB"}
    
    match_id: Mapped[UUID] = mapped_column(primary_key=True)
    data_source_match_id: Mapped[str] = mapped_column(
        String(50),
        nullable=True
    )
    competition_id: Mapped[UUID] = mapped_column(
        ForeignKey("competitions.competition_id", name="fk_competitions_competition_id"),
        index=True,
        nullable=True
    )
    team_season_id: Mapped[UUID] = mapped_column(
        ForeignKey("team_seasons.team_season_id", name="team_seasons_team_season_id"),
        index=True
    )
    goals_for: Mapped[int] = mapped_column(nullable=True)
    goals_against: Mapped[int] = mapped_column(nullable=True)
    goal_difference: Mapped[int] = mapped_column(nullable=True)
    pens_for: Mapped[int] = mapped_column(nullable=True)
    pens_against: Mapped[int] = mapped_column(nullable=True)
    opposition_team_name: Mapped[str] = mapped_column(String(100), nullable=True)
    result: Mapped[Result] = mapped_column(Enum(Result), nullable=True)
    date: Mapped[dateDT] = mapped_column(nullable=True)
    time: Mapped[timeDT] = mapped_column(nullable=True)
    location: Mapped[str] = mapped_column(String(100), nullable=True)
    home_away_neutral: Mapped[HomeAwayNeutral] = mapped_column(
        Enum(HomeAwayNeutral),
        nullable=True
    )
    notes: Mapped[str] = mapped_column(String(100), nullable=True)
    match_report_id: Mapped[UUID] = mapped_column(
        ForeignKey("match_reports.match_report_id", name="match_reports_match_report_id"),
        index=True,
        nullable=True
    )

    match_errors: Mapped[List["MatchError"]] = relationship(lazy='joined')
    team_season: Mapped[TeamSeason] = relationship(back_populates='matches', lazy='joined')
    player_match_performances: Mapped[List[PlayerMatchPerformance]] = relationship(lazy='joined')
    competition: Mapped[Competition] = relationship(lazy='joined')
    match_report: Mapped[MatchReport] = relationship(lazy='joined')

    def __init__(
        self,
        data_source_match_id:str|None,
        team_season_id:UUID,
        competition_id:UUID|None,
        goals_for:int,
        goals_against:int,
        goal_difference:int,
        pens_for:int,
        pens_against:int,
        opposition_team_name:str,
        result:Result,
        date:dateDT,
        time:timeDT,
        location:str,
        home_away_neutral:HomeAwayNeutral,
        notes:str,
        match_id:UUID|None=None,
        match_report_id:UUID|None=None
    ):
        self.match_id = match_id or uuid4()
        self.data_source_match_id = data_source_match_id
        self.team_season_id = team_season_id
        self.competition_id = competition_id
        self.goals_for = goals_for
        self.goals_against = goals_against
        self.goal_difference = goal_difference
        self.pens_for = pens_for
        self.pens_against = pens_against
        self.opposition_team_name = opposition_team_name
        self.result = result
        self.date = date
        self.time = time
        self.location = location
        self.home_away_neutral = home_away_neutral
        self.notes = notes
        self.match_report_id = match_report_id

    def __repr__(self):
        return f"<Match {self.match_id} vs {self.opposition_team_name} on {self.date}>"

    def get_pmp(self):
        return [
            pmp.get_dict()
            for pmp in self.player_match_performances
        ]
    
    def get_short_table_row(
        self,
        format_score:bool=False
    ):
        score_formattable = False
        opposition = f"{self.opposition_team_name} ({self.home_away_neutral.value[0]})"
        if (self.goals_for is not None) & (self.goals_against is not None):
            result = f"{self.goals_for}-{self.goals_against}"
            score_formattable = True
        elif self.notes is not None:
            result = self.notes
        else:
            result = 'n/a'            
        row = deepcopy(
            GenericTableRow(
                {
                    'Opposition' : opposition,
                    'Result' : result,
                    'Date' : self.date
                }
            )
        )
        row.set_cell_link(
            column_name='Opposition',
            link=f"/team/{self.team_season.team_id}/match/{self.match_id}"
        )
        if format_score & score_formattable:
            if self.goal_difference > 0:
                res = 'win'
            elif self.goal_difference == 0:
                res = 'draw'
            else:
                res = 'loss'
            row.set_cell_class_name(
                column_name='Result',
                class_name=f'{res}-result'
            )
        return row
    
    def get_player_info_scraped(self):
        if len(self.player_match_performances) > 0:
            return True
        if is_other_result_type(self.notes):
            return True
        return False
    
    def get_pmps_by_player_id(self):
        pmps_by_player_id = {}
        player_by_player_id = {}
        for pmp in self.player_match_performances:
            key = str(pmp.player_id)
            player_by_player_id[key] = pmp.player
            player_dict = pmps_by_player_id.get(
                key,
                {}
            )
            player_dict[pmp.metric.get_best_metric_name()] = pmp.value
            pmps_by_player_id[key] = player_dict
        return pmps_by_player_id, player_by_player_id
    
    def get_player_count(self):
        player_count = 0
        for player_id, player_obj in self.get_active_player_dict().items():
            if player_obj.get_best_name() != MiscStrings.OWN_GOALS:
                player_count += 1
        return player_count
    
    def get_active_player_dict(self):
        active_player_dict = {}
        pmps_by_player_id, player_by_player_id = self.get_pmps_by_player_id()
        unappearance_metrics = get_unappearance_metrics()
        for player_id, player_dict in pmps_by_player_id.items():
            if none_of_list1_in_list2(unappearance_metrics, player_dict):
                active_player_dict[player_id] = player_by_player_id[player_id]
        return active_player_dict
    
    def get_agg_data_key(
        self,
        split_by:SplitByType,
        player_id:str|None=None
    ):
        match split_by:
            case SplitByType.OPPOSITION:
                return self.opposition_team_name
            case SplitByType.PLAYER_COUNT:
                return self.get_player_count()
            case SplitByType.SEASON:
                return self.team_season.league_season.data_source_season_name
            case SplitByType.WITH_OR_WITHOUT:
                return self.get_with_or_without(player_id)
            case SplitByType.MONTH:
                return self.date.strftime("%b")
            case SplitByType.YEAR:
                return self.date.year
            case SplitByType.KO_TIME:
                return self.time.strftime("%H:%M")
            case None:
                return ""
            case _:
                raise Exception(f"Unexpected split by type: {split_by}")

    def get_with_or_without(
        self,
        player_id:str
    ):
        if player_id in self.get_active_player_dict():
            return MiscStrings.WITH
        return MiscStrings.WITHOUT
    
    def get_points_earned(self):
        match self.result:
            case Result.WIN:
                return 3
            case Result.DRAW:
                return 1
            case Result.LOSS:
                return 0
            case _:
                raise ValueError(f"Unexpected result: {self.result}") 

    def to_dict(
        self,
        include_player_stats:bool=False
    ):
        data = {
            'match_id' : self.match_id,
            'data_source_match_id' : self.data_source_match_id,
            'team_season_id' : self.team_season_id,
            'competition_acronym' : self.competition.competition_acronym,
            'competition_id' : self.competition_id,
            'goals_for' : self.goals_for,
            'goals_against' : self.goals_against,
            'goal_difference' : self.goal_difference,
            'pens_for' : self.pens_for,
            'pens_against' : self.pens_against,
            'opposition_team_name' : self.opposition_team_name,
            'result' : self.result,
            'date' : self.date.strftime("%d %b %y"),
            'computer_date' : self.date.strftime("%Y-%m-%d"),
            'time' : self.time.strftime("%H:%M"),
            'location' : self.location,
            'home_away_neutral' : self.home_away_neutral,
            'match_errors' : self.match_errors,
            'player_info_scraped' : self.get_player_info_scraped(),
            'player_performance_data' : self.get_pmp() if include_player_stats else [],
            'notes' : self.notes,
            'match_report_id' : self.match_report_id
        }
        if self.match_report_id is not None:
            if self.match_report.text is not None:
                data['match_report_text'] = self.match_report.text
            else:
                data['match_report_image_ids'] = self.match_report.image_ids.split(",")
        return data