import { icon, map, PopupEvent } from 'leaflet';
import React,{useEffect, useRef, useState} from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Collectible } from '../Data/Database/Collectible';
import { DateOption } from '../Data/DateOption';
import { TodayDate } from '../Data/TodayDate';
import { DatabaseAPI } from '../DatabaseGateway/DatabaseAPI';
import Details from '../Details/Details';
import './Card.css'
import { GetIcon } from './GetIcon';

export interface CollectibleWayPointProps{
    collectible : Collectible;
}
function CollectibleWayPoint({collectible} : CollectibleWayPointProps){
    const [isDetailsShowed,setIsDetailsShowed] = useState(false);
    const [editationOfVisit,setEdititationOfVisit] = useState(false);
    const [isVisit,setIsVisit] = useState(collectible.isVisit);
    const [dateOption,setDateOption] = useState<DateOption>(DateOption.Date);
    const [todayDate,setTodayDate] = useState(new TodayDate());

    const [year,setYear] = useState(todayDate.year)

    const handleEditationOfVisit = () => {
        setEdititationOfVisit((prev) => !prev)
    }
    const handleDetails = () => {
        setIsDetailsShowed((prev) => !prev)
    }
    const handleChangeOfCheckbox = (e : any) => {
        console.log(e.target.checked)
        if (e.target.checked){
            setIsVisit(true)
        }else{
            setIsVisit(false)
        }
        
    }
    const handleSave = () => {
        
        if (collectible.isVisit != isVisit){
            collectible.isVisit = isVisit
            DatabaseAPI.postVisitation(collectible.QNumber,isVisit)

        }
    }
    const handleDate = (e: any) =>{
        console.log(e.target.value)
    }
    const handleYear = (e: any) => {
        let year = e.target.value;
        if(year <= todayDate.year && year > 1900){
            setYear(year);
        }
    }

    
    const handleDateSelection = (e : any) => {
        console.log(e.target.value)
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
                setDateOption(DateOption.Date)
                break;
            case 'RangeInMonth':
                setDateOption(DateOption.Month)
                break;
        }
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
                                {editationOfVisit && (
                                    <>
                                    <div>
                                        {isVisit ? (<input type="checkbox" id="visition" name="visition" onChange={handleChangeOfCheckbox} checked/>) : (<input type="checkbox" id="visition" name="visition" value="Visited" onChange={handleChangeOfCheckbox}/>)}
                                        <label htmlFor="visition">Visited this place? </label>
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
                                                <input type={"date"} id={"date"} name={"date"} max={todayDate.GetDate()} onChange={handleDate}/>
                                            </>
                                        )}
                                        {dateOption == DateOption.Month && (
                                            <>
                                                <label htmlFor='month'>Month of visit</label>
                                                <input type={"month"} id={"month"} name={"month"} max={todayDate.GetMonthYear()} onChange={handleDate}/>
                                            </>
                                        )}
                                        {dateOption == DateOption.Year && (
                                            <>
                                                <label htmlFor='year'>Year of visit</label>
                                                <input type="number" id={"year"} name={'year'} min="1900" max={todayDate.GetYear()} step="1" value={year} onChange={handleYear}/>
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