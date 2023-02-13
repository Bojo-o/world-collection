export class Collectible{
    QNumber: string = '';
    collectionID : number = 0;
    name : string = '';
    type : string ='';
    latitude : number = 0;
    longitude : number = 0;
    isVisit : boolean = false;

        
    constructor(initializer?: any){
        if(!initializer) return;
        if (initializer.q_number) this.QNumber = initializer.q_number;    
        if (initializer.collection_id) this.collectionID = initializer.collection_id;
        if (initializer.name) this.name = initializer.name; 
        if (initializer.instance_of) this.type = initializer.instance_of;    
        if (initializer.latitude) this.latitude = initializer.latitude;    
        if (initializer.longitude) this.longitude = initializer.longitude;  
        if (initializer.is_visited) {
            if (initializer.is_visited === 1){
                this.isVisit = true;
            }else{
                this.isVisit = false;
            }
        }

    }
}