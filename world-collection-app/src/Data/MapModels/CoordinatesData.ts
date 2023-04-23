export interface ICoordinates{
    latitude : number;
    longitude : number
}
export class Coordinates{
    latitude : number = 0;
    longitude : number = 0;
    
    constructor({longitude,latitude} :ICoordinates){ 
        this.latitude = latitude;    
        this.longitude = longitude;  
    }
}
