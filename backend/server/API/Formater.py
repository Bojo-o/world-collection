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

def toJson(input):
    
    data = input['results']['bindings']
    formatted_data = []

    for item in data:
        d = collections.OrderedDict()
        for bindings_in_item in item:
            type = item[bindings_in_item]['type']
            value : str = item[bindings_in_item]['value']
            match type:
                case "literal":
                    d[bindings_in_item] = value
                case "uri":
                    if bindings_in_item == "image":
                        d[bindings_in_item] = value
                        break
                    temp : str = value.split('/')[-1]
                    if temp.startswith("ontology#"):
                        temp = temp.lstrip("ontology#")
                    d[bindings_in_item] = temp
        formatted_data.append(d)
    return json.dumps(formatted_data)