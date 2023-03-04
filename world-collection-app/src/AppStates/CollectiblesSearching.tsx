import { useState } from "react";
import SearchByRadius from "../CollectiblesSearching/SeachByRadius";
import { SearchCollectiblesBuilderQuery } from "../CollectiblesSearching/SearchCollectiblesQueryBuilder";
import SearchTypeState from "../CollectiblesSearching/SearchTypeState";
import { SearchData } from "../Data/SearchData/SearchData";



function CollectibleSearching(){
    const [searchQuery,setSearchQuery] = useState<SearchCollectiblesBuilderQuery>(new SearchCollectiblesBuilderQuery());

    const handleCollectibleType = (data : SearchData) => {
        setSearchQuery(searchQuery.setSearingType(data.QNumber,data.name));
        setSearchState(chooseAreaTypeState)
    }

    const searchTypeState = () => {
        return(
            <>
                <SearchTypeState handleCollectibleType={handleCollectibleType} />
            </>
        );
    }
    const chooseAreaTypeState = () => {
        return(
            <>
                <h1>Choose the way of area, in which collectibles are located.</h1>
                <div className="d-flex">
                    <button type="button" className="btn btn-info">By administrative area</button>
                    <button type="button" className="btn btn-info">By radius from center point</button>
                    
                </div>
                <SearchByRadius />
            </>
        );
    }

    const [searchState,setSearchState] = useState<JSX.Element>(searchTypeState);

    
    return(
        <>
            <div className="container d-flex mx-5 my-5 flex-column" >
                {searchState}
                {searchQuery.render()}
            </div>
        </>
    )
}

export default CollectibleSearching;