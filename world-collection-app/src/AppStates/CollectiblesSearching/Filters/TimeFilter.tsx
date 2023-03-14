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
export enum TimeRange{
    From = "From",
    To = "To"
}
function TimeFilter({filter,handleAddFilterToAplied} : FilterProps){
    const [timeRepresentation,setTimeRepresentation] = useState<TimePrecision>(TimePrecision.Year)
    const [filterType,setFilterType] = useState<FilterComparisonOperator>(FilterComparisonOperator.GreaterThan)

    const [isBCFrom,setIsBCFrom] = useState(false);
    const [isBCTo,setIsBCTo] = useState(false);

    const [timeFrom,setTimeFrom] = useState<CustomTime>(new CustomTime(Precision.Year,false,new Date().getFullYear()))
    const [timeTo,setTimeTo] = useState<CustomTime>(new CustomTime(Precision.Year,false,new Date().getFullYear()))

    const handleTimePrecisionSelection = (e : any) => {
        setTimeRepresentation(e.target.value);
        
    }
    const handleFilterTypeSelection = (e : any) => {
        setFilterType(e.target.value);
    }
    const handleDate = (e : any,time : TimeRange) => {
        let date : string = e.target.value;
        let dateSplited = date.split('-');

        
        if (dateSplited.length == 2){
            if(time == TimeRange.From){
                setTimeFrom(new CustomTime(Precision.Month,isBCFrom,parseInt(dateSplited[0]),parseInt(dateSplited[1])));
                
            }else{
                setTimeTo(new CustomTime(Precision.Month,isBCTo,parseInt(dateSplited[0]),parseInt(dateSplited[1])));
            }
        }
        if (dateSplited.length == 3){
            if(time == TimeRange.From){
                setTimeFrom(new CustomTime(Precision.Day,isBCFrom,parseInt(dateSplited[0]),parseInt(dateSplited[1]),parseInt(dateSplited[2])));
                
            }else{
                setTimeTo(new CustomTime(Precision.Day,isBCTo,parseInt(dateSplited[0]),parseInt(dateSplited[1]),parseInt(dateSplited[2])));
            }
        }
    }
    const renderDateInput = (name : string,time : TimeRange,renderAsMonthType = false) => {
        return(
            <>
                <h4>Choose {name}:</h4>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id={"date-addon-" + name}>{name}</span>
                        <input className="form-control" type={renderAsMonthType ? "month" : "date"} name={name} aria-describedby={"date-addon-" + name} onChange={(e: any) => handleDate(e,time)}></input>
                    </div>
            </>
        )
    }
    const handleYear = (e : any,time : TimeRange) => {
        let year = e.target.value;
        if(year >= 0){
            if(time == TimeRange.From){
                setTimeFrom(new CustomTime(Precision.Year,isBCFrom,year));
                
            }else{
                setTimeTo(new CustomTime(Precision.Year,isBCTo,year));
            }
        }
    }
    const handleCentury = (e : any,time : TimeRange) => {
        let century = e.target.value;
        if(century >= 1){
            if(time == TimeRange.From){
                setTimeFrom(new CustomTime(Precision.Year,isBCFrom,(century - 1) * 100));
                
            }else{
                setTimeTo(new CustomTime(Precision.Year,isBCTo,(century - 1) * 100));
            }
        }
        
    }
    const handleIsBC = (time : TimeRange) => {
        if(time == TimeRange.From){
            setIsBCFrom((p) => !p);
        }else{
            setIsBCTo((p) => !p);
        }
    }

    const renderTimeNumberInput = (name : string,time : TimeRange,handleFunc : (e : any,time : TimeRange) => void ,showAsCentury : boolean = false) => {
        let value : number = (time == TimeRange.From) ? timeFrom.getYear() : timeTo.getYear();
        if (showAsCentury){
            value = ~~(value/100) + 1; 
        }

        let isBcSet : boolean = (time == TimeRange.From) ? isBCFrom : isBCTo;
        return(
            <>
                <h4>Type {name}:</h4>
                    <div className="input-group mb-3">
                        <span className="input-group-text">{time}</span>
                        <input className="form-control" type="number" name={time}  min={0} value={value} onChange={(e : any) => handleFunc(e,time)}></input>
                        <span className="input-group-text">{name}</span>
                        <div className="input-group-text">
                            {isBcSet ? (
                                <>
                                    <input className="form-check-input mt-0" type="checkbox" value="" onChange={() => handleIsBC(time)} checked/>
                                </>
                            ) : (
                                <>
                                    <input className="form-check-input mt-0" type="checkbox" value="" onChange={() => handleIsBC(time)} />
                                </>
                            )}
                            <label className="form-check-label">BC</label>    
                        </div>
                    </div>
            </>
        )
    }
    const handleSave = () => {
        handleAddFilterToAplied(new AppliedFilterData(filter,new FilterTimeValueData(filterType,timeFrom,timeTo)));
    }

    return(
        <>
            <div className="m-3">
                <h3>Apply time filter</h3>
                <div className="d-flex flex-row">
                    <div className="m-5">
                        <h5>Choose filter type: </h5>
                        <select className="form-select" aria-label="Select filter type" onChange={handleFilterTypeSelection}>
                            <option value={FilterComparisonOperator.GreaterThan} > {FilterComparisonOperator.GreaterThan.valueOf()} </option>
                            <option value={FilterComparisonOperator.GreaterThanEqual}> {FilterComparisonOperator.GreaterThanEqual.valueOf()}</option>
                            <option value={FilterComparisonOperator.LessThan}> {FilterComparisonOperator.LessThan.valueOf()} </option>
                            <option value={FilterComparisonOperator.LessThanEqual}> {FilterComparisonOperator.LessThanEqual.valueOf()}</option>
                            <option value={FilterComparisonOperator.InRange}> {FilterComparisonOperator.InRange.valueOf()}</option>
                            <option value={FilterComparisonOperator.InRangeEqual}> {FilterComparisonOperator.InRangeEqual.valueOf()}</option>
                        </select>
                    </div>

                    <div className="m-5">
                        <p>Select time representation you want to use :</p>
                        <select className="form-select" aria-label="Select Time represenation" onChange={handleTimePrecisionSelection} >
                            <option value={TimePrecision.Year}> Year</option>
                            <option value={TimePrecision.Date} > Date </option>
                            <option value={TimePrecision.Month} > Month </option>
                            <option value={TimePrecision.Century}> Century </option>
                        </select>
                    </div>
                    
                </div>
                
                {(filterType == FilterComparisonOperator.InRange || filterType == FilterComparisonOperator.InRangeEqual) ? (
                    <>
                        {timeRepresentation == TimePrecision.Date && (
                            <>
                                {renderDateInput("From Date",TimeRange.From)}
                                {renderDateInput("To Date",TimeRange.From)}
                            </>
                        )}
                        {timeRepresentation == TimePrecision.Month && (
                            <>
                                {renderDateInput("From Date",TimeRange.From,true)}
                                {renderDateInput("To Date",TimeRange.From,true)}
                            </>
                        )}
                        {timeRepresentation == TimePrecision.Year && (
                            <>
                                {renderTimeNumberInput("Year",TimeRange.From,handleYear)}
                                {renderTimeNumberInput("Year",TimeRange.To,handleYear)}
                            </>
                        )}
                        {timeRepresentation == TimePrecision.Century && (
                            <>
                                {renderTimeNumberInput("Century",TimeRange.From,handleCentury,true)}
                                {renderTimeNumberInput("Century",TimeRange.To,handleCentury,true)}
                            </>
                        )}
                    </>
                ) : (
                    <>
                        {timeRepresentation == TimePrecision.Date && (renderDateInput("Date",TimeRange.From))}
                        {timeRepresentation == TimePrecision.Month && (renderDateInput("Date",TimeRange.From,true))}
                        {timeRepresentation == TimePrecision.Year && (renderTimeNumberInput("Year",TimeRange.From,handleYear))}
                        {timeRepresentation == TimePrecision.Century && (renderTimeNumberInput("Century",TimeRange.From,handleCentury,true))}
                    </>
                )}
                <button type="button" className="btn btn-success" onClick={handleSave}>Applied filter</button>
            </div>
        </>
    )
}

export default TimeFilter;