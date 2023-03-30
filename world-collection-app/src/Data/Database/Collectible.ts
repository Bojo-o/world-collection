import { CustomDate, DatePrecision } from "../CustomDate";
import { DATEOPTIONS } from "../DateOption";

export class Collectible{
    QNumber: string = '';
    collectionID : number = 0;
    name : string = '';
    type : string ='';
    lati : number = 0;
    long : number = 0;
    isVisit : boolean = false;
    dateFormat : DatePrecision = DatePrecision.Day;
    dateFrom : CustomDate|null = null;
    dateTo : CustomDate|null = null;
    icon : string = '';
        
    constructor(initializer?: any){
        if(!initializer) return;
        if (initializer.q_number) this.QNumber = initializer.q_number;    
        //
        if (initializer.QNumber) this.QNumber = initializer.QNumber; 

        if (initializer.collection_id) this.collectionID = initializer.collection_id;
        //
        if (initializer.collectionID) this.collectionID = initializer.collectionID;

        if (initializer.name) this.name = initializer.name; 
        if (initializer.instance_of) this.type = initializer.instance_of;   
        //
        if (initializer.type) this.type = initializer.type;   

        if (initializer.latitude) this.lati = initializer.latitude;    
        if (initializer.longitude) this.long = initializer.longitude;  
        if (initializer.is_visited) {
            if (initializer.is_visited === 1){
                this.isVisit = true;
            }else{
                this.isVisit = false;
            }
        }
        if (initializer.visit_date_format) this.dateFormat = DatePrecision[initializer.visit_date_format as keyof typeof DatePrecision];  
        if (initializer.visit_date_from) this.dateFrom = new CustomDate(initializer.visit_date_from,this.dateFormat); 
        if (initializer.visit_date_to) this.dateTo = new CustomDate(initializer.visit_date_to,this.dateFormat);  
        if (initializer.icon) this.icon = initializer.icon;   
    }
}