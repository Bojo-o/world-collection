import { icon, map, PopupEvent } from 'leaflet';
import React,{useEffect, useRef, useState} from 'react';
import { Marker, Popup } from 'react-leaflet';
import { CustomDate } from '../Data/CustomDate';
import { Collectible } from '../Data/Database/Collectible';
import { DateOption } from '../Data/DateOption';
import { DatabaseAPI } from '../DatabaseGateway/DatabaseAPI';
import Details from '../Details/Details';
import './Card.css'
import { GetIcon } from './GetIcon';

enum DatesRange{
    From,
    To
}
export interface CollectibleWayPointProps{
    collectible : Collectible;
}
function CollectibleWayPoint({collectible} : CollectibleWayPointProps){
    const [isDetailsShowed,setIsDetailsShowed] = useState(false);
    const [editationOfVisit,setEdititationOfVisit] = useState(false);
    const [isVisit,setIsVisit] = useState(collectible.isVisit);
    const [dateOption,setDateOption] = useState<DateOption>(DateOption.Date);
    const [todayDate,setTodayDate] = useState(new CustomDate(null));

    const [year,setYear] = useState(todayDate.year);

    const [dateFrom,setDateFrom] = useState<CustomDate|null>(null);
    const [dateTo,setDateTo] = useState<CustomDate|null>(null);

    const handleEditationOfVisit = () => {
        if (editationOfVisit){
            setDateFrom(null)
            setDateTo(null)
            setIsVisit(collectible.isVisit)
        }
        setEdititationOfVisit((prev) => !prev)
    }
    const handleDetails = () => {
        setIsDetailsShowed((prev) => !prev)
    }
    const handleChangeOfCheckbox = (e : any) => {
        
        if (e.target.checked){
            setIsVisit(true)
        }else{
            setIsVisit(false)
        }
        
    }
    const handleSave = () => {
        if (isVisit){
            DatabaseAPI.postVisitation(collectible.QNumber,isVisit,DateOption[dateOption],dateFrom,dateTo)
        }else{
            DatabaseAPI.postVisitation(collectible.QNumber,isVisit)
        }
        collectible.isVisit = isVisit;
        collectible.dateFormat = DateOption[dateOption];
        collectible.dateFrom = dateFrom;
        collectible.dateTo = dateTo;

    }
    const handleDate = (e: any,d : DatesRange) =>{
        if (d == DatesRange.From){
            setDateFrom(new CustomDate(e.target.value));
        }else{
            setDateTo(new CustomDate(e.target.value));
        }
    }

    
    const handleYear = (e: any) => {
        let year = e.target.value;
        if(year <= todayDate.year && year > 1900){
            setYear(year);
            setDateFrom(new CustomDate(e.target.value+"-01"));
        }
    }

    
    const handleDateSelection = (e : any) => {
        setDateFrom(null)
        setDateTo(null)
        switch(e.target.value){
            case 'date':
                setDateOption(DateOption.Date)
                break;
            case 'month':
                setDateOption(DateOption.Month)
                break;
            case 'year':
                setDateOption(DateOption.Year)
                break;
            case 'rangeInDate':
                setDateOption(DateOption.RangeInDate)
                break;
            case 'rangeInMonth':
                setDateOption(DateOption.RangeInMonth)
                break;
        }
    }

    const renderDate = () => {
        if (collectible.isVisit && collectible.dateFormat != null){
            switch(collectible.dateFormat){
                case 'Date':
                    return (<h6>{collectible.dateFrom?.GetDateToShow()}</h6>)
                case 'Month':
                    return (<h6>{collectible.dateFrom?.GetMonthYearToShow()}</h6>)
                case 'Year':
                    return (<h6>{collectible.dateFrom?.GetYear()}</h6>)
                case 'RangeInDate':
                    return (<h6>{collectible.dateFrom?.GetDateToShow()} - {collectible.dateTo?.GetDateToShow()}</h6>)
                case 'RangeInMonth':
                    return (<h6>{collectible.dateFrom?.GetMonthYearToShow()} - {collectible.dateTo?.GetMonthYearToShow()}</h6>)   
            }
        }
        return (<></>)
    }
    return (
        <React.Fragment>
            <Marker position={[collectible.longitude,collectible.latitude]}
            icon={GetIcon(collectible.isVisit ? "visit" : "unvisit")}
            >
                <Popup>      
                    <>        
                    <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{collectible.name}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{collectible.type.replaceAll('/',', ')}</h6>                               
                                <h5 className="card-subtitle mb-2 text-muted">{collectible.isVisit ? ("Visited") : ("Not visited")}</h5>
                                {renderDate()}
                                {editationOfVisit && (
                                    <>
                                    <div>
                                        {isVisit ? (<input type="checkbox" id="visition" name="visition" onChange={handleChangeOfCheckbox} checked/>) : (<input type="checkbox" id="visition" name="visition" value="Visited" onChange={handleChangeOfCheckbox}/>)}
                                        <label htmlFor="visition">Visited this place? </label>
                                        {isVisit && (
                                            <>
                                                <p>Set date of visit:</p>
                                                <p>Select date format you want to use</p>
                                                <select className='form-select' aria-label='Date selection' onChange={handleDateSelection}>
                                                    <option value={"date"}>Date</option>
                                                    <option value={"month"}>Month and year</option>
                                                    <option value={"year"}>Year</option>
                                                    <option value={"rangeInDate"}>Range of Dates</option>
                                                    <option value={"rangeInMonth"}>Range of Months and years</option>
                                                </select>

                                                {dateOption == DateOption.Date && (
                                                    <>
                                                        <label htmlFor='date'>Date of visit</label>
                                                        <input type={"date"} id={"date"} name={"date"} max={todayDate.GetDate()} onChange={(event) => handleDate(event,DatesRange.From)}/>
                                                        {dateFrom != null && (
                                                            <>
                                                                <p>Setted date: {dateFrom.GetDateToShow()}</p>
                                                            </>
                                                        )}
                                                    </>
                                                )}

                                                {dateOption == DateOption.Month && (
                                                    <>
                                                        <label htmlFor='month'>Month of visit</label>
                                                        <input type={"month"} id={"month"} name={"month"} max={todayDate.GetMonthYear()} onChange={(event) => handleDate(event,DatesRange.From)}/>
                                                        {dateFrom != null && (
                                                            <>
                                                                <p>Setted month: {dateFrom.GetMonthYearToShow()}</p>
                                                            </>
                                                        )}
                                                    </>
                                                )}

                                                {dateOption == DateOption.Year && (
                                                    <>
                                                        <label htmlFor='year'>Year of visit</label>
                                                        <input type="number" id={"year"} name={'year'} min="1900" max={todayDate.GetYear()} step="1" value={year} onChange={handleYear}/>
                                                        {dateFrom != null && (
                                                            <>
                                                                <p>Setted year: {dateFrom.GetYear()}</p>
                                                            </>
                                                        )}
                                                    </>                                           
                                                )}

                                                {dateOption == DateOption.RangeInDate && (
                                                    <>
                                                        <label htmlFor='dateFrom'>Date from </label>
                                                        <input type="date" id={"dateFrom"} name={'dateFrom'} max={dateTo != null ? dateTo.GetDate() : todayDate.GetDate()} onChange={(event) => handleDate(event,DatesRange.From)}/>
                                                        <br/>
                                                        <label htmlFor='DateTo'>Date to</label>
                                                        <input type="date" id={"dateTo"} name={'dateTo'}  min={dateFrom != null ? (dateFrom.GetDate()) : ("")} max={todayDate.GetDate()}  onChange={(event) => handleDate(event,DatesRange.To)}/>
                                                        {dateFrom != null && dateTo!= null && (
                                                            <>
                                                                <p>Setted date from: {dateFrom.GetDateToShow()}</p>
                                                                <p>Setted date to: {dateTo.GetDateToShow()}</p>
                                                            </>
                                                        )}
                                                    </>
                                                )}

                                                {dateOption == DateOption.RangeInMonth && (
                                                    <>
                                                        <label htmlFor='monthFrom'>Month from </label>
                                                        <input type="month" id={"monthFrom"} name={'monthFrom'} max={dateTo != null ? dateTo.GetMonthYear() : todayDate.GetMonthYear()} onChange={(event) => handleDate(event,DatesRange.From)}/>
                                                        <br/>
                                                        <label htmlFor='DateTo'>Month to</label>
                                                        <input type="month" id={"monthTo"} name={'monthTo'}  min={dateFrom != null ? (dateFrom.GetMonthYear()) : ("")} max={todayDate.GetMonthYear()}  onChange={(event) => handleDate(event,DatesRange.To)}/>
                                                        {dateFrom != null && dateTo!= null && (
                                                            <>
                                                                <p>Setted date from: {dateFrom.GetMonthYearToShow()}</p>
                                                                <p>Setted date to: {dateTo.GetMonthYearToShow()}</p>
                                                            </>
                                                        )}
                                                    </>
                                                )}

                                            </>
                                        )}
                                    </div>

                                    <button type='button' className="btn btn-success" onClick={handleSave}>Save</button>
                                    </>
                                )}
                                <button type='button' className="btn btn-primary" onClick={() => handleEditationOfVisit()}>{!editationOfVisit ? ("Set visitation") : ("Close")}</button>
                                <button type='button' className="btn btn-info" onClick={() => handleDetails()}>{!isDetailsShowed ? ("Show details") : ("Hide details")}</button> 
                            </div>
                        </div>

                        {isDetailsShowed && (
                        <React.Fragment>
                            <Details QNumber={collectible.QNumber} name={collectible.name} type={collectible.type} />
                        </React.Fragment>  
                    ) }
                    </>
                </Popup>
            </Marker>
        </React.Fragment>
    )
}

export default CollectibleWayPoint;