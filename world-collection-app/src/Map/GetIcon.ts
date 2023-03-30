import L, { Point } from "leaflet";

export function GetIcon(icon : string,visit : boolean){
    return L.icon({
        iconUrl : require('../static/Icons/'+icon+'.png'),
        iconSize : [64,64],
        className :  (visit) ? "" : "gray"
    })
}