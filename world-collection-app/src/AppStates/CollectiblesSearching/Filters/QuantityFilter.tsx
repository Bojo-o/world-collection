import { useEffect, useState } from "react";
import { WikiDataAPI } from "../../../API/WikiDataAPI";
import { QuantityFilterData, ValueRange } from "../../../Data/FiltersData/QuantityFilterData";
import { Entity } from "../../../Data/SearchData/Entity";
import { FilterProps } from "./FilterProps";

function TimeFilter({filter,handleAddFilterToAplied} : FilterProps){
    const[filterData,setFilterData] = useState<QuantityFilterData>(new QuantityFilterData([],new ValueRange()));
    const[loadingValueType,setLoadingValueType] = useState(false);
    const[errorForFetchingValueType,setErrorForFetchingValueType] = useState(false);

    const[unit,setUnit] = useState<string|undefined>(undefined);
    const[value,setValue] = useState<number|undefined>(undefined);
    const handleInput = (e : any) => {
        if (e.target.value == ""){
            setValue(undefined)
            return;
        }
        
        let number = Math.max(filterData.range.min, Math.min(filterData.range.max, Number(e.target.value)));
        setValue(number);
    }
    const handleUnitChange = (e : any) => {
        console.log(e.target.value)
    }
    const fetchFilterData = () => {
        setLoadingValueType(true)
        setErrorForFetchingValueType(false);

        WikiDataAPI.searchForFilterDataQuantity(filter.PNumber).then(
            (data) => {
                setLoadingValueType(false);
                setFilterData(data);

            }
        ).catch(() => setErrorForFetchingValueType(true))
    }
    useEffect(() => {
        fetchFilterData()
    },[filter])
    return(
        <div className="m-3">
            <h3>Apply Quantity filter</h3>
            {loadingValueType && (<>
                <button type="button" className="list-group-item list-group-item-action">{errorForFetchingValueType ? "Some error occurs, try later" : 
                    <div className="spinner-border text-info" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                }</button>
            </>)}
            {!loadingValueType && (
                <>
                    {filterData.supportedUnits.length == 0 ? (
                        <>
                            <h3>This filter does not use units</h3>
                        </>
                    ) : (
                        <>
                            <h3>Choose which units you want to use</h3>
                            <select className="form-select" onChange={handleUnitChange}>
                                <option value="" selected disabled hidden>Choose unit</option>
                                {filterData.supportedUnits.map((value,index) => {
                                    return (
                                        <option key={index} value={value.GetQNumber()}>{value.GetName()}</option>
                                    )
                                })}
                            </select>
                        </>
                    )}

                    <div className="input-group mb-3">
                        <span className="input-group-text">Min : {filterData.range.min}</span>
                        <input type="number" className="form-control"  placeholder="Type value" value={value} onChange={handleInput} />
                        <span className="input-group-text">Max : {filterData.range.max}</span>
                    </div>
                    <h1>{value}</h1>
                </>
            )}
        </div>
    )
}
export default TimeFilter;