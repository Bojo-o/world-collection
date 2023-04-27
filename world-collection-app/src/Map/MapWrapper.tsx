import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import './Map.css';

/**
 * Props necessary for map.
 */
export interface MapProps {
    /** Addition implemented body. We want to render map many times and for avoiding repetetion this func is part which is different for each map invoking.*/
    mapContainerBody: () => JSX.Element
}
/**
 * Wrapping function, which takes addtion body and renders map.
 * @param MapProps See MapProps decription.
 * @returns JSX element rendering map.
 */
function MapWrapper({ mapContainerBody }: MapProps) {
    return (
        <>
            <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                scrollWheelZoom={true}
                zoomControl={false}

            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {mapContainerBody()}
                <ZoomControl position="bottomright" zoomInText="🔍" zoomOutText="🗺️" />
            </MapContainer>
        </>
    )
}

export default MapWrapper;