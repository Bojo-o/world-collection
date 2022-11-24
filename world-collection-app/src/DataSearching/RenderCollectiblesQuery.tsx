import React from "react";
import { CollectiblesQuery } from "../Data/Query/CollectiblesResultQuery";

interface RenderCollectiblesQueryProps{
    queryObject : CollectiblesQuery;
}
function RenderCollectiblesQuery({queryObject} :RenderCollectiblesQueryProps) {
    let locationText : string = queryObject.restrictionAdministrativeAreaQNumber !== null ? "in the administrative teritorial of "
    + queryObject.restrictionAdministrativeAreaLabel + " (" + queryObject.restrictionAdministrativeAreaQNumber +" )" : " anywhere in the world.";
    return (
        <React.Fragment>
            {queryObject.typeOfCollectiblesQNumber !== null && 
                (<p>
                    Search for collectibles, which are type of {queryObject.typeOfCollectiblesLabel} ({queryObject.typeOfCollectiblesQNumber}) located 
                    {locationText}
                </p>)
            }
        </React.Fragment>
    );
}

export default RenderCollectiblesQuery;