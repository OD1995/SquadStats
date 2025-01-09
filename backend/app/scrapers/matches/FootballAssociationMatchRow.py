from datetime import datetime
from app.helpers.misc import is_other_result_type
from app.types.enums import HomeAwayNeutral, Result


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
        self.match_errors = []
        self.goals_and_names_already_retrieved = False
        self.notes = None
    
    def get_fa_match_id(self):
        try:
            return self.match_div['id'].replace("fixture-","")
        except Exception as e:
            self.match_errors.append(repr(e)[:10000])
            return None
        
    def get_competition_name(self):
        try:
            competition_name_div = self.match_div.find(
                'div',
                attrs={
                    'class' : 'fg-col'
                }
            )
            return competition_name_div.p.text.strip()
        except Exception as e:
            self.match_errors.append(repr(e)[:10000])
            return None

    
    def get_competition_acronym(self):
        try:
            return self.match_div.find(
                'div',
                attrs={
                    'class' : 'type-col center'
                }
            ).p.a.text.strip()
        except Exception as e:
            self.match_errors.append(repr(e)[:10000])
            return None
        
    def get_goals_for(self):
        try:
            if not self.goals_and_names_already_retrieved:
                self.retrieve_goals_and_names()
            return self.goals_for
        except Exception as e:
            self.match_errors.append(repr(e)[:10000])
            return None

    def get_goals_against(self):
        try:
            if not self.goals_and_names_already_retrieved:
                self.retrieve_goals_and_names()
            return self.goals_against
        except Exception as e:
            self.match_errors.append(repr(e)[:10000])
            return None
    
    def get_goal_difference(self):
        try:
            if None in [self.goals_for, self.goals_against]:
                return None
            return self.goals_for - self.goals_against
        except Exception as e:
            self.match_errors.append(repr(e)[:10000])
            return None


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
            home_away_team_names[tm] = team_name
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
        
        if is_other_result_type(score_text):
            home_score = None
            away_score = None
            new_note = score_text.split("\r")[0]
            if self.notes is None:
                self.notes = new_note
            else:
                self.notes += f", {new_note}"
        else:
            try:
                home_score, away_score = [
                    int(goals)
                    for goals in score_text.split(" - ")
                ]
            except ValueError:
                a=1
        self.home_away = self.get_home_or_away(home_away_team_names)
        if self.home_away == self.HOME:
            self.goals_for = home_score
            self.goals_against = away_score
            self.oppo_team_name = home_away_team_names[self.AWAY]
            self.pens_for = home_pens
            self.pens_against = away_pens
        elif self.home_away == self.AWAY:
            self.goals_for = away_score
            self.goals_against = home_score
            self.oppo_team_name = home_away_team_names[self.HOME]
            self.pens_for = away_pens
            self.pens_against = home_pens
        else:
            self.goals_for = None
            self.goals_against = None
            self.oppo_team_name = self.combine_team_names(home_away_team_names)
            self.pens_for = away_pens
            self.pens_against = home_pens
        self.goals_and_names_already_retrieved = True
    
    def combine_team_names(
        self,
        home_away_team_names:dict
    ):
        return f"{home_away_team_names[self.HOME]}/{home_away_team_names[self.AWAY]}"

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
        try:
            return self.oppo_team_name
        except Exception as e:
            self.match_errors.append(repr(e)[:10000])
            return None
    
    def get_result(self):
        try:
            if None in [self.goals_for, self.goals_against]:
                return None
            if self.goals_for > self.goals_against:
                return Result.WIN
            elif self.goals_for < self.goals_against:
                return Result.LOSS
            return Result.DRAW
        except Exception as e:
            self.match_errors.append(repr(e)[:10000])
            return None
    
    def get_pens_for(self):
        try:
            return self.pens_for
        except Exception as e:
            self.match_errors.append(repr(e)[:10000])
            return None
    
    def get_pens_against(self):
        try:
            return self.pens_against
        except Exception as e:
            self.match_errors.append(repr(e)[:10000])
            return None
    
    def get_date(self):
        try:
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
        except Exception as e:
            self.match_errors.append(repr(e)[:10000])
            return None
    
    def get_time(self):
        try:
            return self.time
        except Exception as e:
            self.match_errors.append(repr(e)[:10000])
            return None
    
    def get_home_away_neutral(self):
        try:
            match self.home_away:
                case self.HOME:
                    return HomeAwayNeutral.HOME
                case self.AWAY:
                    return HomeAwayNeutral.AWAY
                case _:
                    raise Exception(f"Unexpected home/away/neutral: {self.home_and_away}")
        
        except Exception as e:
            self.match_errors.append(repr(e)[:10000])
            return None
        
    def get_home_or_away(
        self,
        home_away_team_names
    ):
        for ha in self.home_and_away:
            name = home_away_team_names[ha]
            if name in self.team_names:
                return ha
        error_msg = f"Neither team names are expected. "
        error_msg += f"Home - {home_away_team_names[self.HOME]}, Away - {home_away_team_names[self.AWAY]}, "
        expected_team_names = " or ".join(self.team_names)
        error_msg += f"Expected - {expected_team_names}"
        self.match_errors.append(error_msg)
        return None
    
    def get_notes(self):
        return self.notes