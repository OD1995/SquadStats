from dataclasses import dataclass


@dataclass
class GenericTableCell:

    def __init__(
        self,
        value:str|int|float,
        link:str=None,
        class_name:str=None,
        styles:dict={}
    ):
        self.value = value
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
            'link' : self.link,
            'class_name' : self.class_name,
            'styles' : self.styles
        }