import { useEffect, useState } from "react";
import { WikiDataAPI } from "../API/WikiDataAPI";
import FiltersSelection from "../CollectiblesSearching/Filters/FiltersSelection";
import TimeFilter from "../CollectiblesSearching/Filters/TimeFilter";
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
    FiltersSelection,
}
function CollectibleSearching(){
    const [searchQuery,setSearchQuery] = useState<SearchCollectiblesBuilderQuery>(new SearchCollectiblesBuilderQuery());
    const [state,setState] = useState<CollectiblesSearchingStates>(CollectiblesSearchingStates.FiltersSelection)

    const handleCollectibleType = (data : SearchData) => {
        setSearchQuery(searchQuery.setType(new Entity(data.QNumber,data.name)));
        //setSearchState(chooseAreaTypeState)
    }
    const handleAdministrativeArea = (data : SearchData) => {
        setSearchQuery(searchQuery.setAdministrativeArea(new Entity(data.QNumber,data.name)));
        //setSearchState(chooseAreaTypeState)
    }
    const handleExceptionType = (data : SearchData) => {
        setSearchQuery(searchQuery.addTypeException(new Entity(data.QNumber,data.name)));
    }
    const handleExceptionArea = (data : SearchData) => {
        setSearchQuery(searchQuery.addAdministrativeAreaException(new Entity(data.QNumber,data.name)));
        
    }
    const typesDataGetter = (searchWord : string) => {
        return WikiDataAPI.searchForTypesOfCollectibles(searchWord);
    }
    const administrativeAreaDataGetter = (searchWord : string) => {
        return WikiDataAPI.searchForAdministrativeAreas(searchWord);
    }
    const administrativeAreaExceptionsDataGetter = (seachWord : string) => {
        let QNumbersOfAreaExceptions = searchQuery.getAdministrativeAreaExceptions().map((type) => { return type.GetQNumber()})
        return WikiDataAPI.searchForAdministrativeAreasExceptions(seachWord,searchQuery.getAdministrativeArea()?.GetQNumber(),QNumbersOfAreaExceptions)
    }
    const typesExceptionsDataGetter = (searchWord : string) => {
        let QNumbersOfTypesExceptions = searchQuery.getTypeExceptions().map((type) => { return type.GetQNumber()})
        return WikiDataAPI.searchForTypesOfCollectiblesExceptions(searchWord,searchQuery.getType()?.GetQNumber(),QNumbersOfTypesExceptions);
    }
    const handleTypeExceptionRemove = (index : number) => {
        setSearchQuery(searchQuery.removeTypeException(index));
    }
    const handleAreaExceptionRemove = (index : number) => {
        setSearchQuery(searchQuery.removeAdministrativeAreaException(index));
        
    }
    const searchTypeState = () => {
        return(
            <>
                <div className="d-flex flex-column">
                    <h1>Choose what type of collectibles you want to search for</h1>
                    <SearchBar placeHolder={"Type type of collectibles"} handleClickedResult={handleCollectibleType} dataGetter={typesDataGetter} emptySearchingFlag={false}/>  
                    {searchQuery.isTypeSet() && (
                        <>
                            <h2>You can choose some exception types</h2>
                            <SearchBar placeHolder={"Type type of collectibles"} handleClickedResult={handleExceptionType} dataGetter={typesExceptionsDataGetter} emptySearchingFlag={true}/>
                            <button type="button" className="btn btn-success" onClick={() => handleNextStep(CollectiblesSearchingStates.AreaChoosing)}>Continue to area selection</button> 
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
    const handleRadiusArea = (center : {lat : number,lng : number}, radius : number) => {
        setSearchQuery(searchQuery.setRadius(center,radius));
        handleNextStep(CollectiblesSearchingStates.FiltersSelection)
    }
    const radiusAreaState = () => {
        return (
            <>
                <SearchByRadius handleRadiusArea={handleRadiusArea}/>
            </>
        )
    }

    const administrativeAreaState = () => {
        return (
            <>
                <div className="d-flex flex-column">
                    <h1>Choose the administrative area, in which collectibles will be searched</h1>
                    <SearchBar placeHolder={"Type administrative area, country"} handleClickedResult={handleAdministrativeArea} dataGetter={administrativeAreaDataGetter} emptySearchingFlag={false}/>  
                    {searchQuery.isAdministrativeAreaSet() && (
                        <>
                            <h2>You can choose some exception areas</h2>
                            <SearchBar placeHolder={"Type administrative area"} handleClickedResult={handleExceptionArea} dataGetter={administrativeAreaExceptionsDataGetter} emptySearchingFlag={true}/>
                            <button type="button" className="btn btn-success" onClick={() => handleNextStep(CollectiblesSearchingStates.FiltersSelection)}>Save area and continue</button>
                        </>
                    )}
                </div>
            </>
        )
    }
    const FiltersSelectionState = () => {
        return (
            <>
                <FiltersSelection filtersForType={new Entity("Q23413","castle")}/>
            </>
        )
    }
    const handleNextStep = (newState: CollectiblesSearchingStates) => {
        setState(newState);
    }


    return(
        <>
            <div >
                { state === CollectiblesSearchingStates.TypePicking && searchTypeState()}
                { state === CollectiblesSearchingStates.AreaChoosing && chooseAreaTypeState()}
                { state === CollectiblesSearchingStates.RadiusArea && radiusAreaState()}
                { state === CollectiblesSearchingStates.AdministrativeArea && administrativeAreaState()}
                { state === CollectiblesSearchingStates.FiltersSelection && FiltersSelectionState()}
                <SearchCollectiblesQueryRenderer searchQueryBuilder={searchQuery} handleTypeExceptionRemove={handleTypeExceptionRemove} handleAreaExceptionRemove={handleAreaExceptionRemove}/>
            </div>
        </>
    )
}

export default CollectibleSearching;