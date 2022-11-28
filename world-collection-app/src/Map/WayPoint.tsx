import React from 'react'
import { Marker, Popup} from 'react-leaflet';
import { ResultData } from '../Data/ResultsData';

export interface WayPointProps {
    data: ResultData;
    removeItem : (qNumber : string) => void;
}
function WayPoint({data,removeItem} : WayPointProps){
    return (
        <React.Fragment>
            <Marker position={[data.long,data.lati]}>
                <Popup>                    
                    {data.name}
                    <button onClick={() => removeItem(data.QNumber)} >aa</button>
                </Popup>
            </Marker>
        </React.Fragment>
    )
}

export default WayPoint;