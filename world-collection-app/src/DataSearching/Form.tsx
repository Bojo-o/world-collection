import React from "react";
import { CollectiblesBaseData } from "../Data/ColletiblesBaseData";
import { CollectiblesQuery } from "../Data/Query/CollectiblesResultQuery";
import SearcherBar, { TypeOfSearch } from "./ColletiblesClassSearch";
import RenderCollectiblesQuery from "./RenderCollectiblesQuery";
import { SearchAPI } from "./SearchAPI";

function Form() {

    const [query,setQuery] = React.useState<CollectiblesQuery>(new CollectiblesQuery);

    const setCollectiblesClass = (data : CollectiblesBaseData) => {
        setQuery((q) => {
            let newQuery = new CollectiblesQuery({...q});
            newQuery.setType(data.name,data.qNumber);
            return newQuery;
        })
    }

    const setRestrictionAdministrativeArea = (data : CollectiblesBaseData) => {
        setQuery((q) => {
            let newQuery = new CollectiblesQuery({...q});
            newQuery.setRestrictionAdministrativeArea(data.name,data.qNumber);
            return newQuery;
        })
    };
    return(
        <React.Fragment>
            <div className="container mt -1 mb -3">
                <h1>World collectibles searcher</h1>
                <SearcherBar setDataToQuery={setCollectiblesClass} placeHolder={"Search type of collectibles"} typeOfSearch={TypeOfSearch.collectiblesCLass} />
                <br/>
                <SearcherBar setDataToQuery={setRestrictionAdministrativeArea} placeHolder={"Search for administrative area"} typeOfSearch={TypeOfSearch.administrativeArea} />
                <br/>
                <RenderCollectiblesQuery queryObject={query} />
            </div>           
        </React.Fragment>
    )
}

export default Form;