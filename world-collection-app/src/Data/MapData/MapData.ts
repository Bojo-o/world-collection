export class MapData{
    latitude : number = 0;
    longitude : number = 0;
    
    constructor(initializer?: any){
        if(!initializer) return;  
        if (initializer.lati) this.latitude = initializer.lati;    
        if (initializer.long) this.longitude = initializer.long;  
    }
}
