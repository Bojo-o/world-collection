import { useEffect, useState } from "react";
import { WikiDataAPI } from "../API/WikiDataAPI";
import SearchByRadius from "../CollectiblesSearching/SeachByRadius";
import { SearchCollectiblesBuilderQuery } from "../CollectiblesSearching/SearchCollectiblesQueryBuilder";
import { SearchData } from "../Data/SearchData/SearchData";
import SearchBar from "../DataSearching/SearchBar/SearchBar";



function CollectibleSearching(){
    const [searchQuery,setSearchQuery] = useState<SearchCollectiblesBuilderQuery>(new SearchCollectiblesBuilderQuery());
    const [showTypeException,setShowTypeException] = useState(false);

    const handleCollectibleType = (data : SearchData) => {
        setSearchQuery(searchQuery.setType(data.QNumber,data.name));
        //setSearchState(chooseAreaTypeState)
    }
    const handleExceptionType = (data : SearchData) => {
        setSearchQuery(searchQuery.addTypeException(data.QNumber,data.name));
        
    }
    const typesDataGetter = (searchWord : string) => {
        return WikiDataAPI.searchForTypesOfCollectibles(searchWord);
    }
    const typesExceptionsDataGetter = (searchWord : string) => {
        return WikiDataAPI.searchForTypesOfCollectiblesExceptions(searchWord,searchQuery.getType()?.GetQNumber(),[]);
    }
    const searchTypeState = () => {
        return(
            <>
                <div className="d-flex flex-column">
                    <h1>Choose what type of collectibles you want to search for</h1>
                    <SearchBar placeHolder={"Type type of collectibles"} handleClickedResult={handleCollectibleType} dataGetter={typesDataGetter} emptySearchingFlag={false}/>  
                    {showTypeException && (
                        <>
                            <h2>You can choose some exception types</h2>
                            <SearchBar placeHolder={"Type type of collectibles"} handleClickedResult={handleExceptionType} dataGetter={typesExceptionsDataGetter} emptySearchingFlag={true}/> 
                        </>
                    )}
                </div>
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
                    <SearchByRadius />
                </div>
                
            </>
        );
    }

    const [searchState,setSearchState] = useState<JSX.Element>(searchTypeState());

    useEffect(() => {
        setShowTypeException(searchQuery.isTypeSet())
    },[searchQuery])
    return(
        <>
            <div className="flex-column" >
                {searchTypeState()}
                {searchQuery.render()}
            </div>
        </>
    )
}

export default CollectibleSearching;