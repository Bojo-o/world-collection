import { useEffect, useState } from "react";
import { WikiDataAPI } from "../../../API/WikiDataAPI";
import { AppliedFilterData } from "../../../Data/FilterModels/AppliedFilterData";
import { WikibaseItemValueData } from "../../../Data/FilterModels/WikibaseItemFilterModel/WikibaseItemValueData";
import { WikibaseItemFilterData } from "../../../Data/FilterModels/WikibaseItemFilterModel/WIkibaseItemFilterData";
import { Entity } from "../../../Data/DataModels/Entity";
import { SearchData } from "../../../Data/DataModels/SearchData";
import SearchBar from "../../../SearchBar/SearchBar";
import { FilterProps } from "./FilterProps";

/**
 * Func rendering UI, which serves to the user to searching, choosing and then setting filter value.
 * Filter value is of WikibaseItem data type.
 * WikibaseItem or for brevity item is value, which is some other item existing on Wikidata as item (has its own QNumber).
 * Func contains mechanism for fetching necessary data about the given filter to restrict searching and choosing.
 * @param FilterProps See FilterProps description.
 * @returns JSX element rendering UI for setting a value of specific WikibaseItem filter.
 */
function ItemFilter({filterData: filter,handleAddFilterToAplied} : FilterProps){
    const[filterConstraintData,setFilterConstraintData] = useState<WikibaseItemFilterData>(new WikibaseItemFilterData());

    const[loadingValueType,setLoadingValueType] = useState(false);
    const[errorForFetchingValueType,setErrorForFetchingValueType] = useState(false);

    const [selectedValue,setSelectedValue] = useState<Entity|null>(null)

    /**
     * Fetches from Wikidata API constraints, which restrict which value can be selected.
     */
    const fetchFilterValueConstraintData = () => {
        setLoadingValueType(true)
        setErrorForFetchingValueType(false);

        WikiDataAPI.getWikibaseItemFilterData(filter.PNumber).then(
            (data) => {
                setLoadingValueType(false);
                setFilterConstraintData(data);
            }
        ).catch(() => setErrorForFetchingValueType(true))
    }

    /**
     * Sets choosed value as value which is currently selected.
     * @param filterValue Found data as filter value, which contains necessary information to identify this value.
     */
    const handleChoosedValue =  (filterValue: SearchData) => {
        setSelectedValue(new Entity(filterValue.QNumber,filterValue.name));
    }
    /**
     * Some filters have a predefined set of allowed values. For this filters it renders selector
     * and this func is called when the user select some value from that selection.
     * @param e event
     */
    const handleSelectedItem = (e : any) => {
        let valueQNumber = e.target.value;
        let item : Entity|null = null
        filterConstraintData.one_of_constraint.forEach((constraint) => {
            if (constraint.QNumber == valueQNumber){
                
                item = new Entity(constraint.QNumber,constraint.name);
            }
        })
        setSelectedValue(item);
    }
    /**
     * Invoke func, which was provided from parent component to adds this filter with value into some list of applied filters.
     */
    const handleSave = () => {
        if (selectedValue != null){
            handleAddFilterToAplied(new AppliedFilterData(filter,new WikibaseItemValueData(selectedValue)));
        }
    }
    /** Func for Search bar as data getter, which provides searching for filters WikibaseItem values. 
     * @param searchWord Key word used for searching.
    */
    const valuesDataGetter =  (searchWord : string) => {
        return WikiDataAPI.searchForWikibaseItem(searchWord,filterConstraintData)
    }

    useEffect(() => {
        fetchFilterValueConstraintData()
    },[filter])

    return(
        <div>
            {loadingValueType && (<>
                <button type="button" className="list-group-item list-group-item-action">{errorForFetchingValueType ? "Some error occurs, try later" : 
                    <div className="spinner-border text-info" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                }</button>
            </>)}
            {!loadingValueType && (
                <>
                    {filterConstraintData.one_of_constraint.length != 0 && (
                        <>
                            <h3>This filter supports choosing from list of constraint : </h3>
                            <select className="form-select" onChange={handleSelectedItem}>
                                <option value="" selected disabled hidden>Choose here</option>
                                {filterConstraintData.one_of_constraint.map((value,index) => {
                                    return (
                                        <option key={index} value={value.QNumber}>{value.name}</option>
                                    )
                                })}
                            </select>
                        </>
                    )}
                    {filterConstraintData.one_of_constraint.length == 0 && (
                        <>
                            {filterConstraintData.value_type_constraint.length != 0 && (
                                <>
                                    <h3>Value types, you can used : </h3>
                                    <div className="d-flex flex-wrap">
                                        {filterConstraintData.value_type_constraint.map((value,index) => {
                                            return (
                                                <>
                                                    <small key={index} className={"badge bg-success text-wrap"}>
                                                        {value.name}
                                                    </small>
                                                </>
                                            )
                                        })}
                                    </div>
                                </>
                            )}
                            {filterConstraintData.conflict_with_constraint.length != 0 && (
                                <>
                                    <h3>Value type, which can not be used : </h3>
                                    <div className="d-flex flex-wrap">
                                        {filterConstraintData.conflict_with_constraint.map((value,index) => {
                                            return (
                                                <>
                                                    <small key={index} className={"badge bg-warning text-dark text-wrap"}>
                                                        {value.name}
                                                    </small>
                                                </>
                                            )
                                        })}
                                    </div>
                                </>
                            )}
                            {filterConstraintData.none_of_constraint.length != 0 && (
                                <>
                                    <h3>Values, that can not be used</h3>
                                    <div className="d-flex flex-wrap">                          
                                        {filterConstraintData.none_of_constraint.map((value,index) => {
                                            return (
                                                <>
                                                    <small key={index} className={"badge bg-danger text-wrap"}>
                                                        {value.name}
                                                    </small>
                                                </>
                                            )
                                        })}
                                    </div>
                                </>
                            )}

                            <h2>Search for item</h2>
                            <SearchBar placeHolderText={"Search for wikibase items"} handleClickedResult={handleChoosedValue} dataGetter={valuesDataGetter} emptySearchingFlag={false}/>

                            
                            
                        </>
                    )}

                    {selectedValue != null && (
                        <>
                            <h3>Choosed, that item "{selectedValue.getName()}" is value of "{filter.name}"</h3>
                            <button type="button" className="btn btn-success" onClick={handleSave}>Use filter</button>
                        </>
                    )}
                    
                </>
            )}
        </div>
    )
}
export default ItemFilter;