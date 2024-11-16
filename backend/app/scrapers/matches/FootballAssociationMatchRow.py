from datetime import datetime
from app.types.enums import Result


class FootballAssociationMatchRow:

    def __init__(
        self,
        match_div,
        team_names:list[str]
    ):
        self.match_div = match_div
        self.team_names = team_names
        self.goals_for = None
        self.goals_against = None
        self.HOME = 'home'
        self.AWAY = 'road'
        self.home_and_away = [self.HOME, self.AWAY]
    
    def get_fa_match_id(self):
        return self.match_div['id'].replace("fixture-","")
    
    def get_competition_acronym(self):
        return self.match_div.find(
            'div',
            attrs={
                'class' : 'type-col center'
            }
        ).p.a.text.strip()
    
    def get_goals_for(self):
        if not self.goals_already_retrieved():
            self.retrieve_goals_and_names()
        return self.goals_for

    def get_goals_against(self):
        if not self.goals_already_retrieved():
            self.retrieve_goals_and_names()
        return self.goals_against
    
    def get_goal_difference(self):
        return self.goals_for - self.goals_against

    def goals_already_retrieved(self):
        return (self.goals_for is not None) and (self.goals_against is not None)
    
    def retrieve_goals_and_names(self):
        home_away_team_names = {}
        for tm in self.home_and_away:
            team_section = self.match_div.find(
                'div',
                attrs={
                    'class' : f"{tm}-team-col"
                }
            )
            team_name_section = team_section.find(
                'div',
                attrs={
                    'class' : f"team-name"
                }
            )
            team_name = team_name_section.a.text.strip()
            home_away_team_names[tm] = {
                'name' : team_name
            }
        score_text = self.match_div.find(
            'div',
            attrs={
                'class' : 'score-col'
            }
        ).text.strip()
        home_pens = None
        away_pens = None
        if "pens" in score_text.lower():
            score_text, pens_text = self.split_out_score_and_pens(score_text)
            home_pens, away_pens = [
                int(pens)
                for pens in pens_text.split("-")
            ]
        else:
            score_text = score_text.split("\r\n")[0].strip()
        home_score, away_score = [
            int(goals)
            for goals in score_text.split(" - ")
        ]
        self.home_away = self.get_home_or_away(home_away_team_names)
        if self.home_away == self.HOME:
            self.goals_for = home_score
            self.goals_against = away_score
            self.oppo_team_name = home_away_team_names[self.AWAY]
            self.pens_for = home_pens
            self.pens_against = away_pens
        else:
            self.goals_for = away_score
            self.goals_against = home_score
            self.oppo_team_name = home_away_team_names[self.HOME]
            self.pens_for = away_pens
            self.pens_against = home_pens

    def split_out_score_and_pens(
        self,
        score_text
    ):
        rows = score_text.split("\r\n")
        score_text = rows[0].strip()
        for row in rows[1:]:
            if 'pen' in row.lower():
                pens_text = row.replace("(Pens","").replace(")","").strip()
        return score_text, pens_text

    def get_oppo_team_name(self):
        return self.oppo_team_name
    
    def get_result(self):
        if self.goals_for > self.goals_against:
            return Result.WIN
        elif self.goals_for < self.goals_against:
            return Result.LOSS
        return Result.DRAW
    
    def get_pens_for(self):
        return None#self.pens_for
    
    def get_pens_against(self):
        return None#self.pens_against
    
    def get_date(self):
        date_time_div = self.match_div.find(
            'div',
            attrs={
                'class' : 'datetime-col'
            }
        )
        date_txt = date_time_div.a.span.text.strip()
        self.date = datetime.strptime(
            date_txt,
            "%d/%m/%y"
        ).date()
        time_txt = date_time_div.find(
            'span',
            attrs={
                'class' : 'color-dark-grey'
            }
        ).text.strip()
        self.time = datetime.strptime(
            time_txt,
            "%H:%M"
        ).time()
        return self.date
    
    def get_time(self):
        return self.time
    
    def get_home_away_neutral(self):
        return self.home_away

    def get_home_or_away(
        self,
        home_away_team_names
    ):
        for ha in self.home_and_away:
            name = home_away_team_names[ha]
            if name in self.team_names:
                return ha
        error_msg = f"Neither team names for matchID {self.get_fa_match_id()} are expected. "
        error_msg += f"Home - {home_away_team_names[self.HOME]}, Away - {home_away_team_names[self.AWAY]}, "
        expected_team_names = " or ".join(self.team_names)
        error_msg += f"Expected - {expected_team_names}"
        return NameError(error_msg)