import { useEffect, useState } from "react";
import { WikiDataAPI } from "../../API/WikiDataAPI";
import { FilterDataType, FiltersData } from "../../Data/FiltersData/FiltersData";
import { Entity } from "../../Data/SearchData/Entity";
import './FiltersSelection.css';
import TimeFilter from "./TimeFilter";
export interface FiltersSelectionProps{
    filtersForType : Entity;
}

function FiltersSelection({filtersForType} : FiltersSelectionProps){
    const [loadingFilters,setLoadingFilters] = useState(false);
    const [errorForFetchingFilters,setErrorForFetchingFilters] = useState(false);
    const [filters,setFilters] = useState<FiltersData[]>([])

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

    useEffect(() => {
        fetchFiltersData()
    },[])

    return(
        <>  
            <h1>You can apply some filters for your collectibles searching</h1>
            <div className="d-flex flex-row">
                <div className="list-group w-25" id="filters">
                    {loadingFilters && (<>
                        <button type="button" className="list-group-item list-group-item-action">{errorForFetchingFilters ? "Some error occurs, try later" : 
                                <div className="spinner-border text-info" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                        }</button>
                    </>)}
                    {!loadingFilters && (
                        <>
                            {filters.map((filter,index) => {
                                return(
                                    <button  key={index} type="button" className="list-group-item list-group-item-action">
                                        <div className="d-flex w-100 justify-content-between">
                                            <h5 className="mb-1">{filter.name}</h5>
                                            
                                            <small className={"badge bg-" + getColorByFilterType(filter.dataType) +" text-wrap"}>
                                                {filter.dataType}
                                            </small>
                                        </div>
                                        <p className="mb-1">{filter.desc}</p>
                                    </button>
                                )
                            })}
                        </>
                    )}
                </div>
                
                <TimeFilter />
            </div>
        </>
    )
}
export default FiltersSelection;