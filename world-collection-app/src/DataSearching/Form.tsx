import React from "react";
import CollectiblesClassSearcher from "./ColletiblesClassSearch";

function Form() {

    return(
        <React.Fragment>
            <div className="container mt -1 mb -3">
                <h1>World collectibles searcher</h1>
                <CollectiblesClassSearcher />
            </div>           
        </React.Fragment>
    )
}

export default Form;