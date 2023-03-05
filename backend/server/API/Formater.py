import collections
import json


def convertToJson(input):
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
                case "coord":
                    coords = item['coord']["value"].removeprefix("Point(").removesuffix(")").split(' ')
                    d["long"] = coords[0]
                    d["lati"] = coords[1]
                case "instancesResult":
                    d["instanceOf"] = item["instancesResult"]["value"]
        formatted_data.append(d)
    return json.dumps(formatted_data)

def toJson(input,withTypesFlaf=False):
    vars = input['head']['vars']
    data = input['results']['bindings']

    formatted_data = []
    for item in data:
        d = collections.OrderedDict()
        for bindings_in_item in item:
            if withTypesFlaf is True:
                inner = collections.OrderedDict()
                inner["value"] = item[bindings_in_item]['value']
                inner["type"] = item[bindings_in_item]['type']
                d[bindings_in_item] = inner
            else:
                d[bindings_in_item] = item[bindings_in_item]['value']
        formatted_data.append(d)
    return json.dumps(formatted_data)