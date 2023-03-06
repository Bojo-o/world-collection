import { useEffect, useState } from "react";
import { WikiDataAPI } from "../API/WikiDataAPI";
import SearchByRadius from "../CollectiblesSearching/SeachByRadius";
import { SearchCollectiblesBuilderQuery } from "../CollectiblesSearching/SearchCollectiblesQueryBuilder";
import SearchCollectiblesQueryRenderer from "../CollectiblesSearching/SearchCollectiblesQueryRenderer";
import { Entity } from "../Data/SearchData/Entity";
import { SearchData } from "../Data/SearchData/SearchData";
import SearchBar from "../DataSearching/SearchBar/SearchBar";
import "./CollectiblesSearching.css"

export enum CollectiblesSearchingStates{
    TypePicking,
    AreaChoosing,
    RadiusArea,
    AdministrativeArea,
}
function CollectibleSearching(){
    const [searchQuery,setSearchQuery] = useState<SearchCollectiblesBuilderQuery>(new SearchCollectiblesBuilderQuery());
    const [showTypeException,setShowTypeException] = useState(false);
    const [state,setState] = useState<CollectiblesSearchingStates>(CollectiblesSearchingStates.TypePicking)
    const [nextStepFlag,setNextStepFlag] = useState(false);

    const handleCollectibleType = (data : SearchData) => {
        setSearchQuery(searchQuery.setType(new Entity(data.QNumber,data.name)));
        setNextStepFlag(true);
        //setSearchState(chooseAreaTypeState)
    }
    const handleAdministrativeArea = (data : SearchData) => {
        setSearchQuery(searchQuery.setType(new Entity(data.QNumber,data.name)));
        setNextStepFlag(true);
        //setSearchState(chooseAreaTypeState)
    }
    const handleExceptionType = (data : SearchData) => {
        setSearchQuery(searchQuery.addTypeException(new Entity(data.QNumber,data.name)));
        
    }
    const typesDataGetter = (searchWord : string) => {
        return WikiDataAPI.searchForTypesOfCollectibles(searchWord);
    }
    const administrativeAreaDataGetter = (searchWord : string) => {
        return WikiDataAPI.searchForAdministrativeAreas(searchWord);
    }
    const typesExceptionsDataGetter = (searchWord : string) => {
        return WikiDataAPI.searchForTypesOfCollectiblesExceptions(searchWord,searchQuery.getType()?.GetQNumber(),[]);
    }
    const handleTypeExceptionRemove = (index : number) => {
        setSearchQuery(searchQuery.removeTypeException(index));
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
                <h1>Choose the way of selecting area, in which collectibles will be searched.</h1>
                <div className="d-flex">
                    <button type="button" className="button-area-choosing" id="button-administrative-area" onClick={() => handleNextStep(CollectiblesSearchingStates.AdministrativeArea)}>Select the administrative area</button>
                    <button type="button" className="button-area-choosing" id="button-radius-area" onClick={() => handleNextStep(CollectiblesSearchingStates.RadiusArea)}>Radius from center point</button>
                </div>
                
                
            </>
        );
    }

    const radiusAreaState = () => {
        return (
            <>
                <SearchByRadius />
            </>
        )
    }

    const administrativeAreaState = () => {
        return (
            <>
                <div className="d-flex flex-column">
                    <h1>Choose the administrative area, in which collectibles will be searched</h1>
                    <SearchBar placeHolder={"Type administrative area, country"} handleClickedResult={handleAdministrativeArea} dataGetter={administrativeAreaDataGetter} emptySearchingFlag={false}/>  
                </div>
            </>
        )
    }

    const handleNextStep = (newState: CollectiblesSearchingStates) => {
        setNextStepFlag(false);
        setState(newState);
    }

    useEffect(() => {
        setShowTypeException(searchQuery.isTypeSet())
    },[searchQuery])
    return(
        <>
            <div >
                { state === CollectiblesSearchingStates.TypePicking && searchTypeState()}
                { state === CollectiblesSearchingStates.AreaChoosing && chooseAreaTypeState()}
                { state === CollectiblesSearchingStates.RadiusArea && radiusAreaState()}
                { state === CollectiblesSearchingStates.AdministrativeArea && administrativeAreaState()}
                <SearchCollectiblesQueryRenderer searchQueryBuilder={searchQuery} handleTypeExceptionRemove={handleTypeExceptionRemove}/>
                {nextStepFlag && state === CollectiblesSearchingStates.TypePicking && (
                    <>
                        <button type="button" className="btn btn-success" onClick={() => handleNextStep(CollectiblesSearchingStates.AreaChoosing)}>Next step</button>
                    </>
                )}
            </div>
        </>
    )
}

export default CollectibleSearching;