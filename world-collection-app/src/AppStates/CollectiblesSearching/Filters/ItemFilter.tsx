import { FILE } from "dns";
import { useEffect, useState } from "react";
import { WikiDataAPI } from "../../../API/WikiDataAPI";
import { WikibaseItemFilterData } from "../../../Data/FiltersData/WIkibaseItemFilterData";
import { Entity } from "../../../Data/SearchData/Entity";
import { SearchData } from "../../../Data/SearchData/SearchData";
import SearchBar from "../../../DataSearching/SearchBar/SearchBar";
import { FilterProps } from "./FilterProps";

function ItemFilter({filter,handleAddFilterToAplied} : FilterProps){
    const[filterData,setFilterData] = useState<WikibaseItemFilterData>(new WikibaseItemFilterData());
    const[loadingValueType,setLoadingValueType] = useState(false);
    const[errorForFetchingValueType,setErrorForFetchingValueType] = useState(false);

    const [selectedItem,setSelectedItem] = useState<Entity|null>(null)

    const fetchValueTypeData = () => {
        setLoadingValueType(true)
        setErrorForFetchingValueType(false);

        WikiDataAPI.searchForFilterDataWikibaseItem(filter.PNumber).then(
            (data) => {
                setLoadingValueType(false);
                setFilterData(data);
            }
        ).catch(() => setErrorForFetchingValueType(true))
    }

    const handleClickedItem =  (data: SearchData) => {
        
    }
    const handleSelectedItem = (e : any) => {
        
        let valueQNumber = e.target.value;
        let item : Entity|null = null
        filterData.one_of_constraint.forEach((constraint) => {
            if (constraint.QNumber == valueQNumber){
                
                item = new Entity(constraint.QNumber,constraint.name);
            }
        })
        setSelectedItem(item);
    }
    const itemDataGetter =  (searchWord : string) => {
        return WikiDataAPI.searchWikibaseItem(searchWord,filterData)
    }
    useEffect(() => {
        fetchValueTypeData()
    },[filter])

    return(
        <div className="m-3">
            <h3>Apply Item filter</h3>
            {loadingValueType && (<>
                <button type="button" className="list-group-item list-group-item-action">{errorForFetchingValueType ? "Some error occurs, try later" : 
                    <div className="spinner-border text-info" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                }</button>
            </>)}
            {!loadingValueType && (
                <>
                    {filterData.one_of_constraint.length != 0 && (
                        <>
                            <h3>This filter supports choosing from list of constraint : </h3>
                            <select className="form-select" onChange={handleSelectedItem}>
                                {filterData.one_of_constraint.map((value,index) => {
                                    return (
                                        <option key={index} value={value.QNumber}>{value.name}</option>
                                    )
                                })}
                            </select>
                        </>
                    )}
                    {filterData.one_of_constraint.length == 0 && (
                        <>
                            {filterData.value_type_constraint.length != 0 && (
                                <>
                                    <h3>Value types, you can used : </h3>
                                    <div className="d-flex flex-row">
                                        {filterData.value_type_constraint.map((value,index) => {
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
                            {filterData.conflict_with_constraint.length != 0 && (
                                <>
                                    <h3>Value type, which can not be used : </h3>
                                    <div className="d-flex flex-row">
                                        {filterData.conflict_with_constraint.map((value,index) => {
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
                            {filterData.none_of_constraint.length != 0 && (
                                <>
                                    <h3>Values, that can not be used</h3>
                                    <div className="d-flex flex-row">                          
                                        {filterData.none_of_constraint.map((value,index) => {
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
                            <SearchBar placeHolder={"Search for wikibase items"} handleClickedResult={handleClickedItem} dataGetter={itemDataGetter} emptySearchingFlag={false}/>

                            
                            
                        </>
                    )}

                    {selectedItem != null && (
                        <>
                            <h3>Picked item "{selectedItem.GetName()}"</h3>
                            <button type="button" className="btn btn-success" >Applied filter</button>
                        </>
                    )}
                    
                </>
            )}
        </div>
    )
}
export default ItemFilter;