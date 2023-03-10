import { useState } from "react";

export interface TimeFilterProps{

}
export enum TimePrecision{
    Date,
    Year,
    Century
}
export enum FilterType{
    GreaterThan = "Greater than (collectible`s property > selected time)",
    GreaterThanEqual = "Greater than and equals (collectible`s property >= selected time)",
    LessThan = "Less than (collectible`s property < selected time)",
    LessThanEqual = "Less than and equals (collectible`s property <= selected time)",
    InRange = "In certain range (selected time < collectible`s property < other selected time)",
    InRangeEqual = "In certain range (selected time <= collectible`s property <= other selected time)"
}
export enum Time{
    From = "From",
    To = "To"
}
function TimeFilter({} : TimeFilterProps){
    const [timeRepresentation,setTimeRepresentation] = useState<TimePrecision>(TimePrecision.Date)
    const [filterType,setFilterType] = useState<FilterType>(FilterType.GreaterThan)
    const [fromYear,setFromYear] = useState(new Date().getFullYear())
    const [toYear,setToYear] = useState(new Date().getFullYear())
    const [isBCFrom,setIsBCFrom] = useState(false);
    const [isBCTo,setIsBCTo] = useState(false);

    const handleTimePrecisionSelection = (e : any) => {
        setTimeRepresentation(e.target.value);
    }
    const handleFilterTypeSelection = (e : any) => {
        setFilterType(e.target.value);
    }
    const renderDateInput = (name : string) => {
        return(
            <>
                <h4>Choose {name}:</h4>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id={"date-addon-" + name}>{name}</span>
                        <input className="form-control" type="date" name={name} aria-describedby={"date-addon-" + name}></input>
                    </div>
            </>
        )
    }
    const handleYear = (e : any,time : Time) => {
        let year = e.target.value;
        if(year >= 0){
            if(time == Time.From){
                setFromYear(year);
            }else{
                setToYear(year);
            }
        }
    }
    const handleIsBC = (time : Time) => {
        if(time == Time.From){
            setIsBCFrom((p) => !p);
        }else{
            setIsBCTo((p) => !p);
        }
    }

    const renderNumberInput = (name : string,time : Time) => {
        let value : number = (time == Time.From) ? fromYear : toYear;

        let isBcSet : boolean = (time == Time.From) ? isBCFrom : isBCTo;
        return(
            <>
                <h4>Type {name}:</h4>
                    <div className="input-group mb-3">
                        <span className="input-group-text">{time}</span>
                        <input className="form-control" type="number" name={time}  min={0} value={value} onChange={(e : any) => handleYear(e,time)}></input>
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
    return(
        <>
            <div className="m-3">
                <h3>Apply time filter</h3>
                <div className="d-flex flex-row">
                    <div className="m-5">
                        <h5>Choose filter type: </h5>
                        <select className="form-select" aria-label="Select filter type" onChange={handleFilterTypeSelection}>
                            <option value={FilterType.GreaterThan} > {FilterType.GreaterThan.valueOf()} </option>
                            <option value={FilterType.GreaterThanEqual}> {FilterType.GreaterThanEqual.valueOf()}</option>
                            <option value={FilterType.LessThan}> {FilterType.LessThan.valueOf()} </option>
                            <option value={FilterType.LessThanEqual}> {FilterType.LessThanEqual.valueOf()}</option>
                            <option value={FilterType.InRange}> {FilterType.InRange.valueOf()}</option>
                            <option value={FilterType.InRangeEqual}> {FilterType.InRangeEqual.valueOf()}</option>
                        </select>
                    </div>

                    <div className="m-5">
                        <p>Select time representation you want to use :</p>
                        <select className="form-select" aria-label="Select Time represenation" onChange={handleTimePrecisionSelection} >
                            <option value={TimePrecision.Date} > Date </option>
                            <option value={TimePrecision.Year}> Year</option>
                            <option value={TimePrecision.Century}> Century </option>
                        </select>
                    </div>
                    
                </div>
                
                {(filterType == FilterType.InRange || filterType == FilterType.InRangeEqual) ? (
                    <>
                        {timeRepresentation == TimePrecision.Date && (
                            <>
                                {renderDateInput("From Date")}
                                {renderDateInput("To Date")}
                            </>
                        )}
                        {timeRepresentation == TimePrecision.Year && (
                            <>
                                {renderNumberInput("From Year",Time.From)}
                                {renderNumberInput("To Year",Time.To)}
                            </>
                        )}
                    </>
                ) : (
                    <>
                        {timeRepresentation == TimePrecision.Date && (renderDateInput("Date"))}
                        {timeRepresentation == TimePrecision.Year && (renderNumberInput("Year",Time.From))}
                    </>
                )}
                
            </div>
        </>
    )
}

export default TimeFilter;