import {Popup } from 'leaflet';
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { Collectible } from '../Data/Database/Collectible';
import CollectibleWayPoint from './CollectibleWayPoint';
import { convertToMapDataModel } from './ConvertToMapData';
import './Map.css';
import MapOptions from './MapOptions/MapOptions';

export interface MapProps{
    collectiblesToShow : Collectible[]
}
function Map ({collectiblesToShow} : MapProps){

    return (
        <React.Fragment>
            <MapContainer 
            center={[51.505, -0.09]}
            zoom={13}
            scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {               
                    collectiblesToShow.map((collectible,index) => {             
                        return (<CollectibleWayPoint key={index} collectible={collectible}/>)
                    })
                }
                <MapOptions waypoints={convertToMapDataModel(collectiblesToShow)}/>
            </MapContainer>
            
        </React.Fragment>
    );
}

export default Map;