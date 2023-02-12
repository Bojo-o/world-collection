import { icon, map, PopupEvent } from 'leaflet';
import React,{useEffect, useRef, useState} from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Collectible } from '../Data/Database/Collectible';
import Details from '../Details/Details';
import './Card.css'
import { GetIcon } from './GetIcon';

export interface CollectibleWayPointProps{
    collectible : Collectible;
}
function CollectibleWayPoint({collectible} : CollectibleWayPointProps){
    const [isDetailsShowed,setIsDetailsShowed] = useState(false);
    const handleDetails = () => {
        setIsDetailsShowed((prev) => !prev)
    }
    return (
        <React.Fragment>
            <Marker position={[collectible.longitude,collectible.latitude]}
            icon={GetIcon()}
            >
                <Popup>      
                    <>        
                    <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{collectible.name}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{collectible.type.replaceAll('/',', ')}</h6>                               
                                <h5 className="card-subtitle mb-2 text-muted">{collectible.isVisit ? ("Visited") : ("Not visited")}</h5>
                                <button type='button' className="btn btn-primary" onClick={() => handleDetails()}>{!isDetailsShowed ? ("Show details") : ("Hide details")}</button> 
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