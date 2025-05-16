from copy import deepcopy
from dataclasses import dataclass
from datetime import date
from app.helpers.misc import get_timestamp_from_date
from app.types.GenericTableCell import GenericTableCell

@dataclass
class GenericTableRow:

    def __init__(
        self,
        init:dict={},
        row_data:dict={}
    ):
        self.row_data = {}
        self.row_data = row_data
        for k,v in init.items():
            # sfv = None
            # if (k == 'Date') and isinstance(v, date):
            #     sfv = get_timestamp_from_date(v)
            #     v = v.strftime("%d %b %y")
            # self.row_data[k] = deepcopy(GenericTableCell(value=v, value_for_sorting=sfv))
            self.row_data[k] = deepcopy(GenericTableCell(value=v))

    def increment_cell_value(
        self,
        column_name:str,
        increment:int|float
    ):
        self.row_data[column_name].increment_value(increment)

    def get_cell_value(
        self,
        column_name:str
    ):
        return self.row_data[column_name].value
    
    def set_cell_value(
        self,
        column_name:str,
        val:str|int|float
    ):
        self.row_data[column_name].value = val
    
    def set_cell_link(
        self,
        column_name:str,
        link:str
    ):
        self.row_data[column_name].set_link(link)

    def set_cell_class_name(
        self,
        column_name:str,
        class_name:str
    ):
        self.row_data[column_name].set_class_name(class_name)

    def add_to_cell_styles(
        self,
        column_name:str,
        property:str,
        value:str
    ):
        self.row_data[column_name].add_to_styles(
            property=property,
            value=value
        )

    def to_dict(self):
        return {
            k : v.to_dict()
            for k,v in self.row_data.items()
        }