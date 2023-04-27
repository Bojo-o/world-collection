import { Marker } from 'react-leaflet';
import { useMemo, useRef } from "react"

/**
 * Props necessary for DraggableMarker.
 */
export interface DraggableMarkerProps {
    /** Position of marker. */
    position: { lat: number, lng: number }
    /** Func that will be invoked if draggable marker was moved by user. It is necessary for handling radius area selection. */
    handleChangeOfPosition: (newPosition: { lat: number, lng: number }) => void;
}
/**
 * Func rendering draggable marker into map.
 * In this project it us used in showing to user center of radius circle, when user sets radius area restriction for searching colletibles.
 * We want to that circle can be moved by user.
 * @param DraggableMarkerProps See DraggableMarkerProps description.
 * @returns JSX element rendering into map marker, which is draggable.
 */
function DraggableMarker({ position, handleChangeOfPosition }: DraggableMarkerProps) {

    const markerRef = useRef<any>(null)
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    handleChangeOfPosition(marker.getLatLng())
                }
            },
        }), [],)

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