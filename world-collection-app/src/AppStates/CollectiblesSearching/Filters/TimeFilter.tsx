import { useState } from "react";
import { Precision, CustomTime } from "../../../Data/CustomTime";
import { AppliedFilterData } from "../../../Data/FiltersData/AppliedFilterData";
import { FilterData } from "../../../Data/FiltersData/FilterData";
import { FilterTimeValueData } from "../../../Data/FiltersData/FilterTimeValueData";
import { FilterComparisonOperator } from "./FilterComparisonOperator";
import { FilterProps } from "./FilterProps";


export enum TimePrecision{
    Date,
    Month,
    Year,
    Century
}

function TimeFilter({filter,handleAddFilterToAplied} : FilterProps){
    const [timeRepresentation,setTimeRepresentation] = useState<TimePrecision>(TimePrecision.Year)
    const [comparisonOperator,setComparisonOperator] = useState<FilterComparisonOperator>(FilterComparisonOperator.GreaterThan)

    const [isBC,setIsBC] = useState(false);

    const [time,setTime] = useState<CustomTime|null>(null)


    const handleTimePrecisionSelection = (e : any) => {
        setTimeRepresentation(e.target.value);
    }
    const handleComparisonOperatorSelect = (e : any) => {
        setComparisonOperator(e.target.value);
    }
    const handleDate = (e : any) => {
        let date : string = e.target.value;
        let dateSplited = date.split('-');

        if (dateSplited.length == 2){
            setTime(new CustomTime(Precision.Month,isBC,parseInt(dateSplited[0]),parseInt(dateSplited[1])));
        }

        if (dateSplited.length == 3){
            setTime(new CustomTime(Precision.Day,isBC,parseInt(dateSplited[0]),parseInt(dateSplited[1]),parseInt(dateSplited[2])));
        }
    }
    const renderDateInput = (name : string,renderAsMonthType = false) => {
        return(
            <>
                <h4>Choose {name}:</h4>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id={"date-addon-"}>{name}</span>
                        <input className="form-control" type={renderAsMonthType ? "month" : "date"} name={name} aria-describedby={"date-addon-"} onChange={handleDate}></input>
                    </div>
            </>
        )
    }
    const handleYear = (e : any) => {
        let year = e.target.value;
        if(year >= 0){
            setTime(new CustomTime(Precision.Year,isBC,year));
        }
    }
    const handleCentury = (e : any) => {
        let century = e.target.value;
        if(century >= 1){
            setTime(new CustomTime(Precision.Year,isBC,(century - 1) * 100));
        }
        
    }
    const handleIsBC = () => {
        setIsBC((p) => !p);
    }

    const renderTimeNumberInput = (name : string,handleFunc : (e : any) => void ,showAsCentury : boolean = false) => {
        let value : number =  (time == null) ? 0 : time.getYear();
        if (showAsCentury){
            value = ~~(value/100) + 1; 
        }

        return(
            <>
                <h4>Choose {name}:</h4>
                    <div className="input-group mb-3">
                        <span className="input-group-text">{name}</span>
                        <input className="form-control" type="number" name={name}  min={0} value={value} onChange={handleFunc}></input>
                        <div className="input-group-text">
                            {isBC ? (
                                <>
                                    <input className="form-check-input mt-0" type="checkbox" value="" onChange={() => handleIsBC} checked/>
                                </>
                            ) : (
                                <>
                                    <input className="form-check-input mt-0" type="checkbox" value="" onChange={() => handleIsBC} />
                                </>
                            )}
                            <label className="form-check-label">BC</label>    
                        </div>
                    </div>
            </>
        )
    }
    const handleSave = () => {
        if (time != null){
            handleAddFilterToAplied(new AppliedFilterData(filter,new FilterTimeValueData(comparisonOperator,time)));
        }
    }

    return(
        <>
            <div className="m-3">
                <h3>Apply time filter</h3>
                <div className="m-5">
                        <p>Select time representation you want to use :</p>
                        <select className="form-select" aria-label="Select Time represenation" onChange={handleTimePrecisionSelection} >
                            <option value={TimePrecision.Year}> Year</option>
                            <option value={TimePrecision.Date} > Date </option>
                            <option value={TimePrecision.Month} > Month </option>
                            <option value={TimePrecision.Century}> Century </option>
                        </select>
                </div>

                {timeRepresentation == TimePrecision.Date && (renderDateInput("Date"))}
                {timeRepresentation == TimePrecision.Month && (renderDateInput("Month",true))}
                {timeRepresentation == TimePrecision.Year && (renderTimeNumberInput("Year",handleYear))}
                {timeRepresentation == TimePrecision.Century && (renderTimeNumberInput("Century",handleCentury,true))}

                <p>Select comparison operator</p>
                
                <div className="d-flex flex-row">
                    <h3>Selected time</h3>
                    <select className="form-select w-25 mx-2" onChange={handleComparisonOperatorSelect}>
                        <option value={FilterComparisonOperator.EqualTo}>is equal to</option>
                        <option value={FilterComparisonOperator.NotEqual}> is not equal</option>
                        <option value={FilterComparisonOperator.GreaterThan}>is greater than</option>
                        <option value={FilterComparisonOperator.GreaterThanOrEqual}>is greater than or equal to</option>
                        <option value={FilterComparisonOperator.LessThan}>is less than</option>
                        <option value={FilterComparisonOperator.LessThanOrEqual}>is less than or equal to</option>
                    </select>
                    <h3>"{filter.name}" time value</h3>
                </div>
                
                {time != null && (
                    <button type="button" className="btn btn-success" onClick={handleSave}>Applied filter</button>
                )}

            </div>
        </>
    )
}

export default TimeFilter;