import React from "react";
import { SearchData } from "../Data/DataModels/SearchData";

/**
 * Props necessary for RenderSearchResult.
 */
interface RenderSearchResultProps{
    /** the result for which we want to render information */
    result : SearchData;
}
/**
 * Renders SearchData information to show that to the user.
 * It renders name and description of Search data result.
 * @param RenderSearchResultProps See RenderSearchResultProps descriptions.
 * @returns JSX element rendering SearchData information.
 */
function RenderSearchResult({result} : RenderSearchResultProps) {
    return (
        <>
            <p className="h5">
                {result.name}
                <br />
                <small className="text-muted">{result.description}</small>
            </p>
        </>
    );
}

export default RenderSearchResult;