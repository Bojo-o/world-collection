import React from "react";
import { CollectiblesBaseData } from "../Data/ColletiblesBaseData";
import { CollectiblesQuery } from "../Data/Query/CollectiblesResultQuery";
import CollectiblesClassSearcher from "./ColletiblesClassSearch";
import RenderCollectiblesQuery from "./RenderCollectiblesQuery";

function Form() {

    const [query,setQuery] = React.useState<CollectiblesQuery>(new CollectiblesQuery);

    const setCollectiblesClass = (data : CollectiblesBaseData) => {
        setQuery((q) => {
            let newQuery = new CollectiblesQuery({...q});
            newQuery.setType(data.name,data.qNumber);
            return newQuery;
        })
    }
    return(
        <React.Fragment>
            <div className="container mt -1 mb -3">
                <h1>World collectibles searcher</h1>
                <CollectiblesClassSearcher setCollectiblesClass={setCollectiblesClass}/>
                <RenderCollectiblesQuery queryObject={query} />
            </div>           
        </React.Fragment>
    )
}

export default Form;