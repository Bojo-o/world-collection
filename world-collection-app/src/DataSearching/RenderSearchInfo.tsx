import React from "react";
import { SearchData } from "../Data/SearchData/SearchData";

interface RenderSearchInfo{
    result : SearchData;
}
function RenderSearchInfo({result} : RenderSearchInfo) {
    return (
        <>
            <p className="h5">
                {result.name}
                <br />
                <small className="text-muted">{result.desc}</small>
            </p>
        </>
    );
}

export default RenderSearchInfo;