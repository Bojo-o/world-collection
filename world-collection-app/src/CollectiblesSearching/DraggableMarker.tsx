import { Marker, MarkerProps, Popup } from 'react-leaflet';
import { useMemo, useRef, useState } from "react"

const center = {
    lat: 51.505,
    lng: -0.09,
}

function DraggableMarker() {
    const [position, setPosition] = useState(center)
    const markerRef = useRef<any>(null)
    const eventHandlers = useMemo(
    () => ({
            dragend() {
            const marker = markerRef.current
            if (marker != null) {
                setPosition(marker.getLatLng())
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