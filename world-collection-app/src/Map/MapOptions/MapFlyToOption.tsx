import { useEffect } from "react";
import { useMap } from "react-leaflet";

export interface MapFlyToOptionProps{
    position : {lat : number,lng : number}
}
function MapFlyToOption({position} : MapFlyToOptionProps){
    const map = useMap(); 
    
    useEffect(() => {
        map.flyTo(position);
    },[map,position])

    return (
        <></>
    );
}

export default MapFlyToOption;