import React from "react";
import './ViewMap.css';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { ResultData } from "../Data/ResultsData";
import WayPoint from "./WayPoint";

export interface ViewMapProps {
    waypoints : ResultData[];
    remove : (qNumber : string) => void;
}
function ViewMap({waypoints,remove}: ViewMapProps) {
    return (
        <React.Fragment>
            <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
                <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
                {waypoints.map((waypoint) => {
                    return <WayPoint data={waypoint} remove={remove}/>
                })}
            </MapContainer>
        </React.Fragment>
    );
}

export default ViewMap;