# https://rdflib.github.io/sparqlwrapper/

import sys
import json
import collections
from SPARQLWrapper import SPARQLWrapper, JSON

def get_query_results(endpoint_url, query):
    user_agent = "WorldCollection/%s.%s" % (sys.version_info[0], sys.version_info[1])
    # TODO adjust user agent; see https://w.wiki/CX6
    sparql = SPARQLWrapper(endpoint_url, agent=user_agent)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    result = sparql.query().convert()

    data = result['results']['bindings']
    formattedData = []
    for item in data:
      d = collections.OrderedDict()
      d["QNumber"] = item['item']['value'].removeprefix("http://www.wikidata.org/entity/")
      d["name"] = item["itemLabel"]["value"]
      coords = item['geo']["value"].removeprefix("Point(").removesuffix(")").split(' ')
      d["lati"] = coords[0]
      d["long"] = coords[1]
      formattedData.append(d)
              
    return json.dumps(formattedData)




