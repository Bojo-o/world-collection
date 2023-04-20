# https://rdflib.github.io/sparqlwrapper/

import sys
from SPARQLWrapper import SPARQLWrapper, JSON

def get_query_results(endpoint_url : str, query : str):
    '''
    Obtains result from query at certain endpoint url.
    
    Parameters
    ----------
    endpoint_url : str
        URL endpoint.
    query : str
        Query as string, which runs on the provided endpoint.

    Return 
    ------
    result : ConvertResult
        Converted result of query in Json format.
        For this project, its then converted to json by our own convertor.
    '''
    # adjust user agent; see https://w.wiki/CX6
    user_agent = "WorldCollection/%s.%s" % (sys.version_info[0], sys.version_info[1])
    sparql = SPARQLWrapper(endpoint_url, agent=user_agent)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    result = sparql.query().convert()

    return result




