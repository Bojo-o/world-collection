import { useEffect, useState } from "react";
import { WikiDataAPI } from "../../../API/WikiDataAPI";
import { AppliedFilterData } from "../../../Data/FilterModels/AppliedFilterData";
import { QuantityValueData } from "../../../Data/FilterModels/QuantityFilterModel/QuantityValueData";
import { QuantityFilterData, ValueRange } from "../../../Data/FilterModels/QuantityFilterModel/QuantityFilterData";
import { Entity } from "../../../Data/DataModels/Entity";
import { ComparisonOperator } from "../../../Data/Enums/ComparisonOperator";
import { FilterProps } from "./FilterProps";
import { useMediaQuery } from "react-responsive";

function TimeFilter({filter,handleAddFilterToAplied} : FilterProps){
    const[filterData,setFilterData] = useState<QuantityFilterData>(new QuantityFilterData([],new ValueRange({max : null,min : null})));
    const[loadingValueType,setLoadingValueType] = useState(false);
    const[errorForFetchingValueType,setErrorForFetchingValueType] = useState(false);

    const[unit,setUnit] = useState<string|null>(null);
    const[value,setValue] = useState<number|undefined>(undefined);
    const [comparisonOperator,setComparisonOperator] = useState<ComparisonOperator>(ComparisonOperator.EqualTo)

    const isBigScreen = useMediaQuery({ query: '(min-width: 1024px)' })

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
            handleAddFilterToAplied(new AppliedFilterData(filter,new QuantityValueData(comparisonOperator,value,unit)));
        }
    }
    const fetchFilterData = () => {
        setLoadingValueType(true)
        setErrorForFetchingValueType(false);

        WikiDataAPI.getQuantityFilterData(filter.PNumber).then(
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
                                        <option key={index} value={value.getQNumber()}>{value.getName()}</option>
                                    )
                                })}
                            </select>
                        </>
                    )}
                    <h3>Choose value</h3>
                    
                        {isBigScreen ? (
                            <>
                                <div className="input-group mb-3">
                                <span className="input-group-text">Min : {filterData.range.min}</span>
                                <input type="number" className="form-control"  placeholder="Type value" value={value} onChange={handleInput} />
                                <span className="input-group-text">Max : {filterData.range.max}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="d-flex flex-wrap justify-content-between">
                                    <h6 className="input-group-text">Min : {filterData.range.min}</h6>
                                    <h6 className="input-group-text">Max : {filterData.range.max}</h6>
                                </div>
                                
                                <input type="number" className="form-control"  placeholder="Type value" value={value} onChange={handleInput} />
                                
                            </>
                        )}
                        
                    <div className={"d-flex flex-" + ((isBigScreen) ? "row" : "column")}>
                        <h4>{(value!=undefined) ? value : "value"}</h4>
                        
                        <select className={"form-select w-50 mx-2"} onChange={handleComparisonOperatorSelect}>
                            <option value={ComparisonOperator.EqualTo} selected disabled hidden>Choose here</option>
                            <option value={ComparisonOperator.EqualTo}>is equal to</option>
                            <option value={ComparisonOperator.NotEqual}> is not equal</option>
                            <option value={ComparisonOperator.GreaterThan}>is greater than</option>
                            <option value={ComparisonOperator.GreaterThanOrEqual}>is greater than or equal to</option>
                            <option value={ComparisonOperator.LessThan}>is less than</option>
                            <option value={ComparisonOperator.LessThanOrEqual}>is less than or equal to</option>
                        </select>
                        <h4>"{filter.name}"</h4>
                    </div>
                    {value != undefined && (
                        <button type="button" className="btn btn-success" onClick={handleSave}>Use filter</button>
                    )}
                </>
            )}
        </div>
    )
}
export default TimeFilter;