import React from "react";
import { ResultData } from "../Data/ResultsData";

export interface DetailsProps{
    entity : ResultData;
}
function Details({entity} : DetailsProps){
    return(
        <p>Loading</p>
    );
}

export default Details;