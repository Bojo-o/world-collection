import { icon, map, PopupEvent } from 'leaflet';
import React,{useEffect, useRef, useState} from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Collectible } from '../Data/Database/Collectible';
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
    const [isVisit,setIsVisit] = useState(collectible.isVisit)
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