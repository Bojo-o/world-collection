export class Collectible{
    QNumber: string = '';
    collectionID : number = 0;
    name : string = '';
    type : string ='';
    latitude : number = 0;
    longitude : number = 0;

        
    constructor(initializer?: any){
        if(!initializer) return;
        if (initializer.QNUmber) this.QNumber = initializer.QNumber;    
        if (initializer.collectionID) this.collectionID = initializer.collectionID;
        if (initializer.name) this.name = initializer.name; 
        if (initializer.type) this.type = initializer.type;    
        if (initializer.latitude) this.latitude = initializer.latitude;    
        if (initializer.longitude) this.longitude = initializer.longitude;          
    }
}