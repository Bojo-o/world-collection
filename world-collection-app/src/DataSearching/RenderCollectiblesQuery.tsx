import React from "react";
import { CollectiblesQuery } from "../Data/Query/CollectiblesResultQuery";

interface RenderCollectiblesQueryProps{
    queryObject : CollectiblesQuery;
}
function RenderCollectiblesQuery({queryObject} :RenderCollectiblesQueryProps) {
    return (
        <React.Fragment>
            {queryObject.typeOfCollectiblesQNumber !== null && 
                (<p>Search for collectibles, which are type of {queryObject.typeOfCollectiblesLabel} ({queryObject.typeOfCollectiblesQNumber})</p>)
            }
        </React.Fragment>
    );
}

export default RenderCollectiblesQuery;