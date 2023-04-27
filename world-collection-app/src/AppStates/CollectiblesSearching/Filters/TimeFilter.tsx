import { useState } from "react";
import {TimeWithPrecision } from "../../../Data/TimeModels/TimeWithPrecision";
import { AppliedFilterData } from "../../../Data/FilterModels/AppliedFilterData";
import { TimeValueData } from "../../../Data/FilterModels/TimeFilterModel/TimeValueData";
import { ComparisonOperator } from "../../../Data/Enums/ComparisonOperator";
import { FilterProps } from "./FilterProps";
import { useMediaQuery } from "react-responsive";
import { DatePrecision } from "../../../Data/Enums/DatePrecision";



/**
 * Func rendering UI, which serves to the user to sets time value for specific time filter.
 * Also the user sets comparison operator for filtering.
 * Filter value is of Time data type.
 * Time value is represented as point of time.
 * Func contains a mechanism for choosing how to enter the time. the user can enter a value such as date, year or century.
 * Also the user can set if the setted time is before year 0 (BC).
 * @param FilterProps See FilterProps description.
 * @returns JSX element rendering UI for setting a time value of specific Time filter.
 */
function TimeFilter({filterData: filter,handleAddFilterToAplied} : FilterProps){
    /**
     * Enum with time precision representing date format, which the user will used.
     */
    enum TimePrecision{
        Date,
        Month,
        Year,
        Century
    }
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
    /**
     * Renders input, into which the user can type date.
     * @param name Name for heading naming date input.
     * @param renderAsMonthFlag True if the user is allowed to picks only mounth and year (mm-yyyy). False represents date (dd-mm-yyyy)
     * @returns JSX element rendering date/mounth input with description.
     */
    const renderDateInput = (name : string,renderAsMonthFlag = false) => {
        return(
            <>
                <h4>Choose {name}:</h4>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id={"date-addon-"}>{name}</span>
                        <input className="form-control" type={renderAsMonthFlag ? "month" : "date"} name={name} aria-describedby={"date-addon-"} onChange={handleDate}></input>
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
    /**
     * Renders input, into which the user can type number representing years or centuries.
     * @param name Name for heading naming number input.
     * @param handleFunc Func for handling change of value.
     * @param showAsCenturyFlag True means that input value represents century. False represents years.
     * @returns JSX element rendering number input with description and checkbox for setting BC years.
     */
    const renderTimeNumberInput = (name : string,handleFunc : (e : any) => void ,showAsCenturyFlag : boolean = false) => {
        let value : number =  (time == null) ? 1 : time.getYear();
        if (showAsCenturyFlag){
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
    /**
     * Invoke func, which was provided from parent component to adds this filter with value into some list of applied filters.
     */
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