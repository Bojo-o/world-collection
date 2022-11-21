import collections
import json


def formatToJson(input):
    vars = input['head']['vars']
    data = input['results']['bindings']

    formatted_data = []
    for item in data:
        d = collections.OrderedDict()
        for bindings_in_item in item:
            match bindings_in_item:
                case "item":
                    d["QNumber"] = item['item']['value'].removeprefix("http://www.wikidata.org/entity/")
                case "itemLabel":
                    d["name"] = item["itemLabel"]["value"]
                case "description":
                    d["description"] = item["description"]["value"]
        formatted_data.append(d)
    return json.dumps(formatted_data)