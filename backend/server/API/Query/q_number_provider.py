import os
import json
from flask import current_app

class qnumber_provider:
    def __init__(self):
        
        with current_app.open_resource("API/Query/q_number_provider.json") as json_file:           
            self._data = json.loads(json_file.read())
    def get_qnumber(self,poi : str):
        try:
            result = self._data[poi]              
            return result
        except KeyError:
            return print("Result not found")
        

    def register_qnumber(self,poi_name : str , qnumber : str):
        if (poi_name in self._data):
            return print("Already registered")
        self._data[poi_name] = qnumber
        with open("q_number_provider.json", "w", encoding="utf-8") as _:
            _.write(json.dumps(self._data))
