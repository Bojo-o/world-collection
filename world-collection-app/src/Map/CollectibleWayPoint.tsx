import { icon, map, PopupEvent } from 'leaflet';
import React,{useEffect, useRef, useState} from 'react';
import { Marker, Popup } from 'react-leaflet';
import { CustomDate, DatePrecision } from '../Data/CustomDate';
import { Collectible } from '../Data/Database/Collectible';
import { DATEOPTIONS } from '../Data/DateOption';
import { DatabaseAPI } from '../API/DatabaseAPI';
import Details from '../Details/Details';
import IconsSelector from '../ImageIcons/IconsSelector';
import './Card.css'
import { GetIcon } from './GetIcon';
import "./Gray.css"

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
    const [dateOption,setDateOption] = useState<DATEOPTIONS>(DATEOPTIONS.Date);
    const [todayDate,setTodayDate] = useState(new CustomDate(null,DatePrecision.Day));

    const [year,setYear] = useState(todayDate.year);

    const [dateFrom,setDateFrom] = useState<CustomDate|null>(null);
    const [dateTo,setDateTo] = useState<CustomDate|null>(null);
    const [icon,setIcon] = useState(collectible.icon);

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
            //DatabaseAPI.postVisitation(collectible.QNumber,isVisit,DATEOPTIONS[dateOption],dateFrom,dateTo)
        }else{
            DatabaseAPI.setCollectibleVisitation(collectible.QNumber,isVisit)
        }
        collectible.isVisit = isVisit;
        //collectible.dateFormat = DATEOPTIONS[dateOption];
        collectible.dateFrom = dateFrom;
        collectible.dateTo = dateTo;
        setEdititationOfVisit(false)

    }
    const handleDate = (e: any,d : DatesRange) =>{
        if (d == DatesRange.From){
            //setDateFrom(new CustomDate(e.target.value));
        }else{
            //setDateTo(new CustomDate(e.target.value));
        }
    }

    
    const handleYear = (e: any) => {
        let year = e.target.value;
        if(year <= todayDate.year && year > 1900){
            setYear(year);
            //setDateFrom(new CustomDate(e.target.value+"-01"));
        }
    }

    
    const handleDateSelection = (e : any) => {
        setDateFrom(null)
        setDateTo(null)
        switch(e.target.value){
            case 'date':
                setDateOption(DATEOPTIONS.Date)
                break;
            case 'month':
                setDateOption(DATEOPTIONS.Month)
                break;
            case 'year':
                setDateOption(DATEOPTIONS.Year)
                break;
            case 'rangeInDate':
                setDateOption(DATEOPTIONS.RangeInDate)
                break;
            case 'rangeInMonth':
                setDateOption(DATEOPTIONS.RangeInMonth)
                break;
        }
    }

   
    const handleIconChange = (icon : string) => {
        setIcon(icon);
    }
    return (
        <React.Fragment>
            <Marker position={[collectible.lati,collectible.long]}
            icon={GetIcon(icon,collectible.isVisit)}
            >
                <Popup>      
                    <>        
                    <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{collectible.name}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{collectible.type.replaceAll('/',', ')}</h6>                               
                                <h5 className="card-subtitle mb-2 text-muted">{collectible.isVisit ? ("Visited") : ("Not visited")}</h5>
                               
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

                                                {dateOption == DATEOPTIONS.Date && (
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

                                                {dateOption == DATEOPTIONS.Month && (
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

                                                {dateOption == DATEOPTIONS.Year && (
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

                                                {dateOption == DATEOPTIONS.RangeInDate && (
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

                                                {dateOption == DATEOPTIONS.RangeInMonth && (
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