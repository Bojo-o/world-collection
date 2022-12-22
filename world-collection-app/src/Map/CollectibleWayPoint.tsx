import React,{useState} from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Collectible } from '../Data/Database/Collectible';
import Details from '../Details/Details';
import './Card.css'

export interface CollectibleWayPointProps{
    collectible : Collectible
}
function CollectibleWayPoint({collectible} : CollectibleWayPointProps){
    const [showDetails,setShowDetails] = useState(false);
    const handleDetails = () => {
        setShowDetails((prev) => !prev)
    }
    return (
        <React.Fragment>
            <Marker position={[collectible.longitude,collectible.latitude]}>
                <Popup>
                    {showDetails ? (
                        <React.Fragment>
                            
                            <button type='button' className="btn btn-primary" onClick={handleDetails}>Cancel</button>
                        </React.Fragment>  
                    ) : (
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{collectible.name}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{collectible.type.replaceAll('/',', ')}</h6>
                                <button type='button' className="btn btn-primary" onClick={handleDetails}>Show details</button>
                            </div>
                        </div>
                    )}
                    
                </Popup>
            </Marker>
        </React.Fragment>
    )
}

export default CollectibleWayPoint;