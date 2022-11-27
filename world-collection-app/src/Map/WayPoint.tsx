import React from 'react'
import { Marker, Popup} from 'react-leaflet';
import { ResultData } from '../Data/ResultsData';

export interface WayPointProps {
    data: ResultData;
    remove : (qNumber : string) => void;
}
function WayPoint({data,remove} : WayPointProps){
    return (
        <React.Fragment>
            <Marker position={[data.long,data.lati]}>
                <Popup>                    
                    {data.name}
                    <button onClick={() => remove(data.QNumber)} >aa</button>
                </Popup>
            </Marker>
        </React.Fragment>
    )
}

export default WayPoint;