import L, { Point } from "leaflet";

export function GetIcon(icon : string,visit : boolean){
    return L.icon({
        iconUrl : require('../static/Icons/'+icon+'.png'),
        iconSize : [30,40],
        className :  (visit) ? "" : "gray"
    })
}