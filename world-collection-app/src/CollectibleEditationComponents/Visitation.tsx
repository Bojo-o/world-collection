import { useState } from "react"
import { CustomDate, DatePrecision } from "../Data/CustomDate";
import { Precision } from "../Data/CustomTime";
import { Collectible } from "../Data/Database/Collectible";
import { DATEOPTIONS } from "../Data/DateOption";
import { DatabaseAPI } from "../DatabaseGateway/DatabaseAPI";
import LoadingStatus from "../Gadgets/LoadingStatus";

enum Date{
    Date = "date",
    Month = "month"
}

export interface VisitationProps{
    collectible : Collectible;
    updateVisitation : (isVisited : boolean) => void;
}
function Visitation({collectible,updateVisitation} : VisitationProps){
    const [isVisited,setIsVisited] = useState(collectible.isVisit)


    const [saving,setSaving] = useState(false);
    const [savingError,setSavingError] = useState(false);
    const [savingStatus,setSavingStatus] = useState<string|null>(null)

    const [todayDate,setTodayDate] = useState(new CustomDate(null,DatePrecision.Day));
    const [dateFrom,setDateFrom] = useState<CustomDate|null>(null);
    const [dateTo,setDateTo] = useState<CustomDate|null>(null);
    const [year,setYear] = useState(todayDate.year);
    const [dateOption,setDateOption] = useState<DATEOPTIONS>(DATEOPTIONS.Date);

    const handleChangeOfVisitationCheckbox = (e : any) => {
        
        if (e.target.checked){
            setIsVisited(true)
        }else{
            setIsVisited(false)
        }
        
    }
    const handleSave = () => {
        setSaving(true);
        setSavingError(false);
        setSavingStatus(null);
        
        DatabaseAPI.postVisitation(collectible.QNumber,isVisited,(dateFrom == null) ? null : dateFrom.GetPrecision().toString(),dateFrom,dateTo).then((status) => {
            setSaving(false);
            setSavingStatus(status);

            updateVisitation(isVisited);
            // change
        }).catch(() => {
            setSavingError(true);
        })

        //
        //collectible.dateFormat = DateOption[dateOption];
        //collectible.dateFrom = dateFrom;
        //collectible.dateTo = dateTo;
        //setEdititationOfVisit(false)

    }
    const handleDateFrom = (e: any,precision : DatePrecision) =>{
        setDateFrom(new CustomDate(e.target.value,precision));
    }
    const handleDateTo = (e: any,precision : DatePrecision) =>{
        setDateTo(new CustomDate(e.target.value,precision));
    }
    
    const renderDateInput = (type : Date,label : string,handleDate : (e: any,precision : DatePrecision) => void,max : CustomDate|null = null,min : CustomDate|null = null) => {
        return(
            <>
                <label htmlFor={type}>{label}</label>
                <input  className="form-control" type={type} id={type} name={type}
                    max={(max == null) ? undefined : (type == Date.Date) ? max.GetDate() : max.GetMonthYear()}
                    min={(min == null) ? undefined : (type == Date.Date) ? min.GetDate() : min.GetMonthYear()}
                    onChange={(e: any) => handleDate(e,(type == Date.Date) ? DatePrecision.Day : DatePrecision.Month)}/>
            </>
        )
    }

    const handleYear = (e: any) => {
        let year = e.target.value;
        if(year <= todayDate.year && year > 1900){
            setYear(year);
            setDateFrom(new CustomDate(e.target.value+"-01",DatePrecision.Year));
        }
    }
    const renderYearInput =  () => {
        return(
            <>
                <label htmlFor='year'>Year of visit</label>
                <input  className="form-control" type="number" id={"year"} name={'year'} min="1900" max={todayDate.GetYear()} step="1" value={year} onChange={handleYear}/>
            </>
        )
    }
    const handleDateSelection = (e : any) => {
        setDateFrom(null)
        setDateTo(null)
        let value : string = e.target.value;
        setDateOption(DATEOPTIONS[value as keyof typeof DATEOPTIONS])
    }
    return(
        <>
            <div className="d-flex flex-column">
                <div>
                    {isVisited ? (<input type="checkbox" id="visition" name="visition" onChange={handleChangeOfVisitationCheckbox} checked/>) : (<input type="checkbox" id="visition" name="visition" value="Visited" onChange={handleChangeOfVisitationCheckbox}/>)}
                    <label htmlFor="visition">Visited this place? </label>
                </div>

                {isVisited && (
                    <>
                        <p>Set date of visit:</p>
                        <p>Select date format you want to use</p>
                        <select className='form-select' aria-label='Date selection' onChange={handleDateSelection}>
                            {Object.entries(DATEOPTIONS).map((d,index) => {
                                return (
                                    <option key={index} value={d[0]}>{d[1]}</option>
                                )
                            })}
                            
                        </select>

                        {dateOption == DATEOPTIONS.Date &&  (
                            <>
                                {renderDateInput(Date.Date,"Date of visit",handleDateFrom,todayDate)}
                            </>
                        )}
                        {dateOption == DATEOPTIONS.Month && (
                            <>
                                {renderDateInput(Date.Month,"Month of visit",handleDateFrom,todayDate)}
                            </>
                        )}
                        {dateOption == DATEOPTIONS.Year && (
                            <>
                                {renderYearInput()}
                            </>
                        )}
                        {dateOption == DATEOPTIONS.RangeInDate && (
                            <>
                                <h3>Date of visit</h3>
                                {renderDateInput(Date.Date,"Visit from",handleDateFrom,(dateTo != null) ? dateTo : todayDate)}
                                <br/>
                                {renderDateInput(Date.Date,"Visit to",handleDateTo,todayDate,(dateFrom != null) ? dateFrom : null)}
                            </>
                        )}
                        {dateOption == DATEOPTIONS.RangeInMonth && (
                            <>
                                <h3>Month of visit</h3>
                                {renderDateInput(Date.Month,"Visit from",handleDateFrom,(dateTo != null) ? dateTo : todayDate)}
                                <br/>
                                {renderDateInput(Date.Month,"Visit to",handleDateTo,todayDate,(dateFrom != null) ? dateFrom : null)}
                            </>
                        )}
                        {(dateOption == DATEOPTIONS.RangeInDate || dateOption == DATEOPTIONS.RangeInMonth) ? (
                            <>
                                {dateFrom != null && (
                                    <>
                                        <p>Setted date from: {dateFrom.ToString()}</p>
                                    </>
                                )}
                                {dateTo != null && (
                                    <>
                                        <p>Setted date to: {dateTo.ToString()}</p>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                {dateFrom != null && (
                                    <>
                                        <p>Setted date: {dateFrom.ToString()}</p>
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}
                
                <div className="d-flex justify-content-center">
                    {saving && (<LoadingStatus error={savingError} errorText={"Something went wrong, try again"} loadingText={"Saving update"}/>)}
                    {savingStatus != null && (<h5>{savingStatus}</h5>)}
                </div>

                <button type='button' className="btn btn-success" onClick={handleSave}>Save</button>

            </div>
        </>
    )
}
export default Visitation;