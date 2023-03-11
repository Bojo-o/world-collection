import { useEffect, useState } from "react";
import { WikiDataAPI } from "../../API/WikiDataAPI";
import { AppliedFilterData } from "../../Data/FiltersData/AppliedFilterData";
import { FilterDataType, FilterData } from "../../Data/FiltersData/FilterData";
import { Entity } from "../../Data/SearchData/Entity";
import './FiltersSelection.css';
import ItemFilter from "./ItemFilter";
import TimeFilter from "./TimeFilter";
export interface FiltersSelectionProps{
    filtersForType : Entity;
}

function FiltersSelection({filtersForType} : FiltersSelectionProps){
    const [loadingFilters,setLoadingFilters] = useState(false);
    const [errorForFetchingFilters,setErrorForFetchingFilters] = useState(false);
    const [filters,setFilters] = useState<FilterData[]>([]);
    const [selectedFilter,setSelectedFilter] = useState<FilterData>(new FilterData());
    const [appliedFilters,setAppliedFilters] = useState<AppliedFilterData[]>([]);

    const [filterSearchWord,setFIlterSearchWord] = useState<string>("");

    const getColorByFilterType = (type : FilterDataType) => {
        if (type === FilterDataType.Quantity){
            return "warning text-dark";
        }
        if (type === FilterDataType.Time){
            return "success";
        }
        if (type === FilterDataType.WikibaseItem){
            return "info text-dark";
        }
        return "secondary";
    }
    const handleAddFilterToAplied = (data : AppliedFilterData) => {
        setAppliedFilters([...appliedFilters, data]) //simple value
        setSelectedFilter(new FilterData())
    }
    const removeFilterFromApplied = (data : AppliedFilterData) => {
        setAppliedFilters((prev) => prev.filter((f) => f.getFilter().PNumber != data.getFilter().PNumber))
    }
    const fetchFiltersData = () => {
        setLoadingFilters(true)
        setErrorForFetchingFilters(false);

        WikiDataAPI.searchForFilters(filtersForType.GetQNumber()).then(
            (data) => {
                setLoadingFilters(false);
                setFilters(data);
            }
        ).catch(() => setErrorForFetchingFilters(true))
    }
    const handleFilterSelection = (filter : FilterData) => {
        setSelectedFilter(filter);
        console.log(filter.PNumber)
    }
    const handleFiltersSearch = (e : any) => {
        setFIlterSearchWord(e.target.value);
    }
    const isFilterUsed = (filter : FilterData) => {
        let result = false;
        appliedFilters.forEach((appliedFilter) => {
            if (appliedFilter.getFilter().PNumber == filter.PNumber){
                result = true;
            }
        })
        return result;
    }
    useEffect(() => {
        fetchFiltersData()

    },[])

    return(
        <>  
            <h1>You can apply some filters for your collectibles searching</h1>
            <div className="d-flex flex-row justify-content-between" >
                <div className="w-25 border border-dark rounded" >
                    <h3>Filters you can use :</h3>
                    <input className="form-control mr-sm-2" type="search" placeholder="Search for filter" onChange={handleFiltersSearch} />
                    <div className="list-group" id="filters">
                        {loadingFilters && (<>
                            <button type="button" className="list-group-item list-group-item-action">{errorForFetchingFilters ? "Some error occurs, try later" : 
                                    <div className="spinner-border text-info" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                            }</button>
                        </>)}
                        {!loadingFilters && (
                            <>
                                {filters.filter((filter) => {
                                    return filter.name.toLocaleLowerCase().includes(filterSearchWord.toLocaleLowerCase()) && !isFilterUsed(filter)
                                }).map((filter,index) => {
                                    return(
                                        <>
                                            
                                            <button  key={index} type="button" className="list-group-item list-group-item-action" onClick={() => handleFilterSelection(filter)} >
                                                <div className="d-flex w-100 justify-content-between">
                                                    <h5 className="mb-1">{filter.name}</h5>
                                                    <small className={"badge bg-" + getColorByFilterType(filter.dataType) +" text-wrap"}>
                                                        {filter.dataType}
                                                    </small>
                                                </div>
                                                <p className="mb-1">{filter.desc}</p>
                                            </button>
                                        </>
                                        
                                    )
                                })}
                            </>
                        )}
                    </div>
                </div>
                <div>
                    {selectedFilter.dataType != FilterDataType.NotSupported && (
                        <h2>Applying {selectedFilter.dataType} filter for "{selectedFilter.name}" property</h2>
                    )}
                    {selectedFilter.dataType == FilterDataType.Time && (<TimeFilter filter={selectedFilter} handleAddFilterToAplied={handleAddFilterToAplied}/>)}
                    {selectedFilter.dataType == FilterDataType.WikibaseItem && (<ItemFilter filter={selectedFilter} handleAddFilterToAplied={handleAddFilterToAplied}/>)}
                </div>
                <div className="w-25 border border-dark rounded">
                    <h3>Applied filters :</h3>
                    <ul className="list-group" id="filters">
                        {appliedFilters.map((filter,index) => {
                            return(
                                <li key={index} className="list-group-item ">
                                    <div className="d-flex flex-row justify-content-between">
                                        <div >
                                            <h5 className="mb-1"> {filter.getFilter().name}</h5>
                                            <small className={"badge bg-" + getColorByFilterType(filter.getFilter().dataType) +" text-wrap "}>
                                                            {filter.getFilter().dataType}
                                            </small>
                                        </div>
                                        
                                        <button type="button" className="btn btn-danger" onClick={() => removeFilterFromApplied(filter)}>Remove filter</button>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </>
    )
}
export default FiltersSelection;