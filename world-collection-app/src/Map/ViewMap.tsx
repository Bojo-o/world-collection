import React from "react";
import './ViewMap.css';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { ResultData } from "../Data/ResultsData";
import WayPoint from "./WayPoint";
import { map } from "leaflet";
import MapOptions from "./MapOptions";

export interface ViewMapProps {
    waypoints : ResultData[];
    edited : ResultData;
    removeItem : (qNumber : string) => void;
    editItem : (row : ResultData) => void;
    cancelItem : () => void;
    saveItem : (edited : ResultData) => void;
    handleChange : (event : any) => void;
}
function ViewMap({waypoints,edited,removeItem,editItem,cancelItem,saveItem,handleChange}: ViewMapProps) {  
    
    return (
        <React.Fragment>
            <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
                <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
                {waypoints.map((waypoint,index) => {                  
                    return <WayPoint key={index} data={waypoint} removeItem={removeItem} edited={edited} editItem={editItem} cancelItem={cancelItem} saveItem={saveItem} handleChange={handleChange}/>
                })}
                <MapOptions waypoints={waypoints}/>
            </MapContainer>
        </React.Fragment>
    );
}

export default ViewMap;