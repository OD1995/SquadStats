from dataclasses import dataclass
from turtle import back
from typing import List
from uuid import UUID, uuid4
from datetime import date as dateDT, time as timeDT
from sqlalchemy import Enum, ForeignKey, String, null
from app.helpers.misc import is_other_result_type
from app.models import Base
from app.models.Competition import Competition
from app.models.MatchError import MatchError
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.PlayerMatchPerformance import PlayerMatchPerformance
from app.models.TeamSeason import TeamSeason
from app.types.GenericTableRow import GenericTableRow
from app.types.enums import HomeAwayNeutral, Result

@dataclass
class Match(Base):
    __tablename__ = 'matches'
    __table_args__ = {"mysql_engine": "InnoDB"}
    
    match_id: Mapped[UUID] = mapped_column(primary_key=True)
    data_source_match_id: Mapped[str] = mapped_column(String(50))
    competition_id: Mapped[UUID] = mapped_column(
        ForeignKey("competitions.competition_id", name="fk_competitions_competition_id"),
        index=True,
        nullable=True
    )
    team_season_id: Mapped[UUID] = mapped_column(
        ForeignKey("team_seasons.team_season_id", name="team_seasons_team_season_id"),
        index=True
    )
    competition_acronym: Mapped[str] = mapped_column(String(10), nullable=True)
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
    match_errors: Mapped[List["MatchError"]] = relationship(lazy='joined')
    team_season: Mapped[TeamSeason] = relationship(back_populates='matches')
    player_match_performances: Mapped[List[PlayerMatchPerformance]] = relationship(lazy='joined')
    competition: Mapped[Competition] = relationship(lazy='joined')

    def __init__(
        self,
        data_source_match_id:str,
        team_season_id:UUID,
        competition_id:UUID|None,
        competition_acronym:str,
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
        notes:str
    ):
        self.match_id = uuid4()
        self.data_source_match_id = data_source_match_id
        self.team_season_id = team_season_id
        self.competition_id = competition_id
        self.competition_acronym = competition_acronym
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

    def get_pmp(self):
        return [
            pmp.get_dict()
            for pmp in self.player_match_performances
        ]
    
    def get_short_table_row(
        self,
        format_score:bool=False
    ):
        row = GenericTableRow(
            {
                'Opposition' : f"{self.opposition_team_name} ({self.home_away_neutral.value[0]})",
                'Result' : f"{self.goals_for}-{self.goals_against}",
                'Date' : self.date.strftime("%d %b %y")
            }
        )
        row.set_cell_link(
            column_name='Opposition',
            link=f"/match/{self.match_id}"
        )
        if format_score:
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
        for pmp in self.player_match_performances:
            player_dict = pmps_by_player_id.get(
                str(pmp.player_id),
                {}
            )
            player_dict[pmp.metric.get_best_metric_name()] = pmp.value
            pmps_by_player_id[str(pmp.player_id)] = player_dict
        return pmps_by_player_id
    
    def get_player_count(self):
        player_count = 0
        for player_dict in self.get_pmps_by_player_id().values():
            if "Bench Unused" not in player_dict:
                player_count += 1
        return player_count

    def to_dict(
        self,
        include_player_stats:bool=False
    ):
        return {
            'match_id' : self.match_id,
            'data_source_match_id' : self.data_source_match_id,
            'team_season_id' : self.team_season_id,
            'competition_acronym' : self.competition_acronym,
            'goals_for' : self.goals_for,
            'goals_against' : self.goals_against,
            'goal_difference' : self.goal_difference,
            'pens_for' : self.pens_for,
            'pens_against' : self.pens_against,
            'opposition_team_name' : self.opposition_team_name,
            'result' : self.result,
            'date' : self.date.strftime("%d %b %y"),
            'time' : self.time.strftime("%H:%M"),
            'location' : self.location,
            'home_away_neutral' : self.home_away_neutral,
            'match_errors' : self.match_errors,
            'player_info_scraped' : self.get_player_info_scraped(),
            'player_performance_data' : self.get_pmp() if include_player_stats else [],
            'notes' : self.notes
        }