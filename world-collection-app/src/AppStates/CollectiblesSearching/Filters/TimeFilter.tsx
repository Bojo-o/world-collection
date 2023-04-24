import { useState } from "react";
import {TimeWithPrecision } from "../../../Data/TimeModels/TimeWithPrecision";
import { AppliedFilterData } from "../../../Data/FilterModels/AppliedFilterData";
import { FilterIdentificationData } from "../../../Data/FilterModels/FilterIdentificationData";
import { TimeValueData } from "../../../Data/FilterModels/TimeFilterModel/TimeValueData";
import { ComparisonOperator } from "../../../Data/Enums/ComparisonOperator";
import { FilterProps } from "./FilterProps";
import { useMediaQuery } from "react-responsive";
import { DatePrecision } from "../../../Data/Enums/DatePrecision";


export enum TimePrecision{
    Date,
    Month,
    Year,
    Century
}

function TimeFilter({filter,handleAddFilterToAplied} : FilterProps){
    const [timeRepresentation,setTimeRepresentation] = useState<TimePrecision>(TimePrecision.Year)
    const [comparisonOperator,setComparisonOperator] = useState<ComparisonOperator>(ComparisonOperator.EqualTo)

    const [isBC,setIsBC] = useState(false);

    const [time,setTime] = useState<TimeWithPrecision|null>(null)
    
    const isBigScreen = useMediaQuery({ query: '(min-width: 1024px)' })


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
            setTime(new TimeWithPrecision(DatePrecision.Month,isBC,parseInt(dateSplited[0]),parseInt(dateSplited[1])));
        }

        if (dateSplited.length == 3){
            setTime(new TimeWithPrecision(DatePrecision.Day,isBC,parseInt(dateSplited[0]),parseInt(dateSplited[1]),parseInt(dateSplited[2])));
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
            setTime(new TimeWithPrecision(DatePrecision.Year,isBC,year));
        }
    }
    const handleCentury = (e : any) => {
        let century = e.target.value;
        if(century >= 1){
            setTime(new TimeWithPrecision(DatePrecision.Year,isBC,century * 100));
        }
        
    }
    const handleIsBC = () => {
        setIsBC((p) => !p);
    }

    const renderTimeNumberInput = (name : string,handleFunc : (e : any) => void ,showAsCentury : boolean = false) => {
        let value : number =  (time == null) ? 1 : time.getYear();
        if (showAsCentury){
            if (value%100 == 0){
                value = ~~(value/100);
            }else{
                value = ~~(value/100) + 1; 
            }
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
            handleAddFilterToAplied(new AppliedFilterData(filter,new TimeValueData(comparisonOperator,time)));
        }
    }

    return(
        <>
            <div >
                
                        <p>Select time representation you want to use :</p>
                        <select className="form-select" aria-label="Select Time represenation" onChange={handleTimePrecisionSelection} >
                            <option value={TimePrecision.Year}> Year</option>
                            <option value={TimePrecision.Date} > Date </option>
                            <option value={TimePrecision.Month} > Month </option>
                            <option value={TimePrecision.Century}> Century </option>
                        </select>
                

                {timeRepresentation == TimePrecision.Date && (renderDateInput("Date"))}
                {timeRepresentation == TimePrecision.Month && (renderDateInput("Month",true))}
                {timeRepresentation == TimePrecision.Year && (renderTimeNumberInput("Year",handleYear))}
                {timeRepresentation == TimePrecision.Century && (renderTimeNumberInput("Century",handleCentury,true))}

                <p>Select comparison operator</p>
                
                <div className={"d-flex flex-" + ((isBigScreen) ? "row" : "column")}>
                    <h4>Selected time</h4>
                    <select className="form-select w-50 mx-2" onChange={handleComparisonOperatorSelect}>
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
                
                {time != null && (
                    <button type="button" className="btn btn-success" onClick={handleSave}>Use filter</button>
                )}

            </div>
        </>
    )
}

export default TimeFilter;