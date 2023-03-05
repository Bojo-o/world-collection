import { Marker, MarkerProps, Popup } from 'react-leaflet';
import { useEffect, useMemo, useRef, useState } from "react"


export interface DraggableMarkerProps{
    position : {lat : number,lng : number}
    handleChangeOfPosition : (newPosition : {lat : number,lng : number}) => void;
}
function DraggableMarker({position,handleChangeOfPosition} : DraggableMarkerProps) {
    
    const markerRef = useRef<any>(null)
    const eventHandlers = useMemo(
    () => ({
            dragend() {
            const marker = markerRef.current
            if (marker != null) {
                handleChangeOfPosition(marker.getLatLng())
                //setPosition(marker.getLatLng())
            }
            },
    }),[],)
    
    return (
        <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}>
        </Marker>
    )
}

export default DraggableMarker;