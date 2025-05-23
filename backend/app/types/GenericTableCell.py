from dataclasses import dataclass
from datetime import date

from app.helpers.misc import get_timestamp_from_date


@dataclass
class GenericTableCell:

    def __init__(
        self,
        value:str|int|float|date,
        value_for_sorting:str|int|float=None,
        link:str=None,
        class_name:str=None,
        styles:dict={}
    ):
        if isinstance(value, date):
            self.value = value.strftime("%d %b %y")
            self.value_for_sorting = get_timestamp_from_date(value)
        else:
            self.value = value
            self.value_for_sorting = value_for_sorting
        self.link = link
        self.class_name = class_name
        self.styles = styles

    def increment_value(
        self,
        increment:int|float
    ):
        self.value += increment

    def set_link(
        self,
        link:str
    ):
        self.link = link

    def set_class_name(
        self,
        class_name:str
    ):
        self.class_name = class_name

    def add_to_styles(
        self,
        property:str,
        value:str
    ):
        self.styles[property] = value

    def to_dict(self):
        return {
            'value' : self.value,
            'value_for_sorting' : self.value_for_sorting,
            'link' : self.link,
            'class_name' : self.class_name,
            'styles' : self.styles
        }