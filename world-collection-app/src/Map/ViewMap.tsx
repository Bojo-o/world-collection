import React from "react";
import './ViewMap.css';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { ResultData } from "../Data/ResultsData";
import WayPoint from "./WayPoint";
import { map } from "leaflet";
import MapOptions from "./MapOptions";

export interface ViewMapProps {
    waypoints : ResultData[];
    removeItem : (qNumber : string) => void;
}
function ViewMap({waypoints,removeItem}: ViewMapProps) {   
    return (
        <React.Fragment>
            <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
                <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
                {waypoints.map((waypoint,index) => {                  
                    return <WayPoint data={waypoint} removeItem={removeItem}/>
                })}
                <MapOptions waypoints={waypoints}/>
            </MapContainer>
        </React.Fragment>
    );
}

export default ViewMap;