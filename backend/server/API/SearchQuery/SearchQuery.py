import sys
import json
import collections
from SPARQLWrapper import SPARQLWrapper, JSON

def search(endpoint_url, query):
    user_agent = "WorldCollection/%s.%s" % (sys.version_info[0], sys.version_info[1])
    # TODO adjust user agent; see https://w.wiki/CX6
    sparql = SPARQLWrapper(endpoint_url, agent=user_agent)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    result = sparql.query().convert()    
    return result