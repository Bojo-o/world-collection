import { useEffect, useState } from "react";
import { WikiDataAPI } from "../../../API/WikiDataAPI";
import { AppliedFilterData } from "../../../Data/FiltersData/AppliedFilterData";
import { FilterQuantityValueData } from "../../../Data/FiltersData/FIlterQuantityValueData";
import { QuantityFilterData, ValueRange } from "../../../Data/FiltersData/QuantityFilterData";
import { Entity } from "../../../Data/SearchData/Entity";
import { FilterComparisonOperator } from "./FilterComparisonOperator";
import { FilterProps } from "./FilterProps";

function TimeFilter({filter,handleAddFilterToAplied} : FilterProps){
    const[filterData,setFilterData] = useState<QuantityFilterData>(new QuantityFilterData([],new ValueRange()));
    const[loadingValueType,setLoadingValueType] = useState(false);
    const[errorForFetchingValueType,setErrorForFetchingValueType] = useState(false);

    const[unit,setUnit] = useState<string|null>(null);
    const[value,setValue] = useState<number|undefined>(undefined);
    const [comparisonOperator,setComparisonOperator] = useState<FilterComparisonOperator>(FilterComparisonOperator.GreaterThan)

    const handleInput = (e : any) => {
        if (e.target.value == ""){
            setValue(undefined)
            return;
        }
        
        let number = Math.max(filterData.range.min, Math.min(filterData.range.max, Number(e.target.value)));
        setValue(number);
    }
    const handleUnitChange = (e : any) => {
        setUnit(e.target.value)
    }
    const handleComparisonOperatorSelect = (e : any) => {
        setComparisonOperator(e.target.value);
    }
    const handleSave = () => {
        if (value != undefined){
            handleAddFilterToAplied(new AppliedFilterData(filter,new FilterQuantityValueData(comparisonOperator,value,unit)));
        }
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
                    <h3>Choose value</h3>
                    <div className="input-group mb-3">
                        <span className="input-group-text">Min : {filterData.range.min}</span>
                        <input type="number" className="form-control"  placeholder="Type value" value={value} onChange={handleInput} />
                        <span className="input-group-text">Max : {filterData.range.max}</span>
                    </div>
                    <div className="d-flex flex-row">
                        <h4>{value}</h4>
                        <select className="form-select w-25 mx-2" onChange={handleComparisonOperatorSelect}>
                            <option value={FilterComparisonOperator.EqualTo}>is equal to</option>
                            <option value={FilterComparisonOperator.NotEqual}> is not equal</option>
                            <option value={FilterComparisonOperator.GreaterThan}>is greater than</option>
                            <option value={FilterComparisonOperator.GreaterThanOrEqual}>is greater than or equal to</option>
                            <option value={FilterComparisonOperator.LessThan}>is less than</option>
                            <option value={FilterComparisonOperator.LessThanOrEqual}>is less than or equal to</option>
                        </select>
                        <h3>"{filter.name}" quantity value</h3>
                    </div>
                    {value != undefined && (
                        <button type="button" className="btn btn-success" onClick={handleSave}>Applied filter</button>
                    )}
                </>
            )}
        </div>
    )
}
export default TimeFilter;