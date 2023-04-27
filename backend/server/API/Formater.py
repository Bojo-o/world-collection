import collections
import json


def toJson(input):
    '''
    Convert provided input to json format.
    It works only for input, which is result of Wikidata sparql endpoint query.

    Parameters
    ----------
    input : any
        Result, which return Wikidata sparql endpoint query.
    Returns
    -------
    JSON formatted str
            Result of query in JSON formatted str.
    '''
    data = input['results']['bindings']
    formatted_data = []

    for item in data:
        d = collections.OrderedDict()
        for bindings_in_item in item:
            type = item[bindings_in_item]['type']
            value: str = item[bindings_in_item]['value']
            match type:
                case "literal":
                    d[bindings_in_item] = value
                case "uri":
                    if bindings_in_item == "image" or bindings_in_item == "article":
                        d[bindings_in_item] = value
                        break
                    temp: str = value.split('/')[-1]
                    if temp.startswith("ontology#"):
                        temp = temp.lstrip("ontology#")
                    d[bindings_in_item] = temp
        formatted_data.append(d)
    return json.dumps(formatted_data)
