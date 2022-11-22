import React from "react";
import { CollectiblesBaseData } from "../Data/ColletiblesBaseData";

interface RenderSearchInfo{
    colletible : CollectiblesBaseData;
}
function RenderSearchInfo({colletible} : RenderSearchInfo) {

    return (
        <React.Fragment>
            <p className="h5">
                {colletible.name}
                <br />
                <small className="text-muted">{colletible.desc}</small>
            </p>
        </React.Fragment>
    );
}

export default RenderSearchInfo;