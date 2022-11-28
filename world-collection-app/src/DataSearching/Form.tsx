import React from "react";
import { CollectiblesBaseData } from "../Data/ColletiblesBaseData";
import { CollectiblesQuery } from "../Data/Query/CollectiblesResultQuery";
import { ResultData } from "../Data/ResultsData";
import ViewMap from "../Map/ViewMap";
import SearcherBar, { TypeOfSearch } from "./ColletiblesClassSearch";
import RenderCollectiblesQuery from "./RenderCollectiblesQuery";
import Result from "./Results";
import ResultsTable from "./ResultsTable";
import { SearchAPI } from "./SearchAPI";

function Form() {

    const [query,setQuery] = React.useState<CollectiblesQuery>(new CollectiblesQuery);
    const [resultData,setResultData]  = React.useState<ResultData[]|null>(null);
    const [loading,setLoading] = React.useState(false);

    const setCollectiblesClass = (data : CollectiblesBaseData) => {
        setQuery((q) => {
            let newQuery = new CollectiblesQuery({...q});
            newQuery.setType(data.name,data.QNumber);
            return newQuery;
        })
    }

    const setRestrictionAdministrativeArea = (data : CollectiblesBaseData) => {
        setQuery((q) => {
            let newQuery = new CollectiblesQuery({...q});
            newQuery.setRestrictionAdministrativeArea(data.name,data.QNumber);
            return newQuery;
        })
    };

    const invokeQueryToGetResultsData = () => {
        if (!query.isReady){
            return;
        }
        setLoading(true);
        SearchAPI.getQueryResult(query).then((data) => {
            setLoading(false)
            setResultData(data);
        })
    }


    return(
        <React.Fragment>
            <div className="container mt -1 mb -3">                               
                <h1>World collectibles searcher</h1>
                <SearcherBar setDataToQuery={setCollectiblesClass} placeHolder={"Search type of collectibles"} typeOfSearch={TypeOfSearch.collectiblesCLass} />
                <br/>
                <SearcherBar setDataToQuery={setRestrictionAdministrativeArea} placeHolder={"Search for administrative area"} typeOfSearch={TypeOfSearch.administrativeArea} />
                <br/>
                <RenderCollectiblesQuery queryObject={query} />
                <br/>
                {query.isReady() && (
                    <button type="button" className="btn btn-success" onClick={invokeQueryToGetResultsData}>Search</button>
                )}

                {loading && (<p>Searching data ...</p>)}  
                {!loading && resultData !== null && <Result data={resultData}/>}                
            </div>           
        </React.Fragment>
    )
}

export default Form;