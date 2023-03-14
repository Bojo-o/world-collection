import { useEffect, useState } from "react";
import { WikiDataAPI } from "../../API/WikiDataAPI";
import FiltersSelection from "./Filters/FiltersSelection";
import TimeFilter from "./Filters/TimeFilter";
import SearchByRadius from "./CollectiblesSearchingStates/SeachByRadius";
import { SearchCollectiblesBuilderQuery } from "../../CollectiblesSearching/SearchCollectiblesQueryBuilder";
import SearchCollectiblesQueryRenderer from "../../CollectiblesSearching/SearchCollectiblesQueryRenderer";
import { Entity } from "../../Data/SearchData/Entity";
import { SearchData } from "../../Data/SearchData/SearchData";
import SearchBar from "../../DataSearching/SearchBar/SearchBar";
import "./CollectiblesSearching.css"
import { CollectiblesSearchingBaseBuilder } from "./CollectiblesSearchingBaseBuilder";
import AreaChoosing from "./CollectiblesSearchingStates/AreaChoosing/AreaChoosing";
import { Areas } from "./CollectiblesSearchingStates/AreaChoosing/Areas";
import { CollectiblesSearchingStates } from "./CollectiblesSearchingStates/CollectiblesSearchingStates";
import TypeChoosing from "./CollectiblesSearchingStates/TypeChoosing";
import SearchByAdministrativeArea from "./CollectiblesSearchingStates/SearchByAdministrativeArea";


function CollectibleSearching(){
    const [searchQuery,setSearchQuery] = useState<SearchCollectiblesBuilderQuery>(new SearchCollectiblesBuilderQuery());

    const [state,setState] = useState<CollectiblesSearchingStates>(CollectiblesSearchingStates.FiltersSelection)
    const [builder,setBuilder] = useState<CollectiblesSearchingBaseBuilder>(new CollectiblesSearchingBaseBuilder())

    const typeChoosingStateHandleNext = (type : Entity,exceptionSubTypes : Entity[]) => {
        setBuilder((prev) => prev.setTypeAndExceptionSubTypes(type,exceptionSubTypes))
        setState(CollectiblesSearchingStates.AreaChoosing)
    }
    const renderTypeChoosingState = () => {
        return(
            <TypeChoosing handleNext={typeChoosingStateHandleNext}/>
        );
    }
    const areaChoosingStatehandleNext = (areaType : Areas) => {
        switch (areaType){
            case Areas.ADMINISTRAVIVE_AREA: { 
                setState(CollectiblesSearchingStates.AdministrativeArea)
                break; 
            } 
            case Areas.RADIUS: { 
                setState(CollectiblesSearchingStates.RadiusArea)
                break; 
            } 
            default: { 
                break; } 
        }
    }
    const renderAreaChoosingState = () => {
        return(
            <>
                <AreaChoosing handleSelection={areaChoosingStatehandleNext}/>
            </>
        );
    }
    const radiusAreaStateHandleNext = (center : {lat : number,lng : number}, radius : number) => {
        setSearchQuery(searchQuery.setRadius(center,radius));
        setState(CollectiblesSearchingStates.FiltersSelection);
    }
    const renderRadiusAreaState = () => {
        return (
            <>
                <SearchByRadius handleNext={radiusAreaStateHandleNext}/>
            </>
        )
    }
    const administrativeAreaStateHandleNext = (area : Entity,exceptionSubAreas : Entity[]) => {     
        setState(CollectiblesSearchingStates.FiltersSelection)
    }
    const renderAdministrativeAreaState = () => {
        return (
            <>
                <SearchByAdministrativeArea handleNext={administrativeAreaStateHandleNext}/>
            </>
        )
    }
    const renderFiltersSelectionState = () => {
        return (
            <>
                <FiltersSelection filtersForType={new Entity("Q23413","castle")}/>
            </>
        )
    }

    return(
        <>
            <div >
                { state === CollectiblesSearchingStates.TypeChoosing && renderTypeChoosingState()}
                { state === CollectiblesSearchingStates.AreaChoosing && renderAreaChoosingState()}
                { state === CollectiblesSearchingStates.RadiusArea && renderRadiusAreaState()}
                { state === CollectiblesSearchingStates.AdministrativeArea && renderAdministrativeAreaState()}
                { state === CollectiblesSearchingStates.FiltersSelection && renderFiltersSelectionState()}
            </div>
        </>
    )
}

export default CollectibleSearching;