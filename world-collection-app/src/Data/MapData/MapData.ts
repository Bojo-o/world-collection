export class MapData{
    latitude : number = 0;
    longitude : number = 0;
    
    constructor(initializer?: any){
        if(!initializer) return;  
        if (initializer.latitude) this.latitude = initializer.latitude;    
        if (initializer.longitude) this.longitude = initializer.longitude;  
    }
}
