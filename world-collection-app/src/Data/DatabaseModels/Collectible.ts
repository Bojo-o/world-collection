import { CustomDate, DatePrecision } from "../CustomDate";

/**
 * Collectible Interface.
 * Properties names coresponds with names of collectible on the backend.
 */
export interface ICollectible {
    q_number : string,
    collection_id : number,
    name : string,
    instance_of : string,
    latitude : number,
    longitude : number,
    is_visited : boolean,
    visit_date_format : string|null,
    visit_date_from : string|null,
    visit_date_to : string|null,
    icon : string;
    notes : string|null;
}
/**
 * Data model representing collectible.
 */
export class Collectible{
    /**Unique QNUmber of collectible. */
    QNumber: string;
    /**Unique ID of collection, in which collectible is belonged. */
    collectionID : number;
    /**Name of collectible */
    name : string;
    /** List of class/types. Collectible is instance of them. */
    instanceOf : string[];
    /**Latitude of collectible. */
    latitude : number;
    /**Longitude of collectible. */
    longitude : number;
    /** Flag if this collectible has been visited by user. */
    isVisit : boolean;
    /**Date format, for rendering a right precision of date. */
    dateFormat : DatePrecision;
    /** Date of visit - if dateTo is null. Starting point of visit - if dateTo is setted. */
    dateFrom : CustomDate|null;
    /** Ending point of visit */
    dateTo : CustomDate|null;
    /** Name of icon, which renders as Marker icon on the map. */
    icon : string;
    /** Collectible notes, which user want to save with collectible. */
    notes : string|null;
    
    constructor({q_number,collection_id,name,instance_of,latitude,longitude,is_visited,visit_date_format,visit_date_from,visit_date_to,icon,notes} : ICollectible){
        this.QNumber = q_number;    
        this.collectionID = collection_id;
        this.name = name; 
        this.instanceOf = instance_of.split('/');   
        this.latitude = latitude;    
        this.longitude = longitude;  
        this.isVisit = is_visited
        
        this.dateFormat = (visit_date_format == null) ? DatePrecision.Day : DatePrecision[visit_date_format as keyof typeof DatePrecision];  
        this.dateFrom = (visit_date_from == null)  ? null : new CustomDate(visit_date_from,this.dateFormat); 
        this.dateTo = (visit_date_to == null)  ? null : new CustomDate(visit_date_to,this.dateFormat);  
        this.icon = icon;   
        this.notes = notes;
    }
    getObject = () => {
        return {
            q_number : this.QNumber,
            collection_id : this.collectionID,
            name : this.name,
            instance_of : this.instanceOf.join("/"),
            latitude : this.latitude,
            longitude : this.longitude,
            is_visited : this.isVisit,
            visit_date_format : this.dateFormat.valueOf(),
            visit_date_from : (this.dateFrom == null) ? null : this.dateFrom.GetDate(),
            visit_date_to : (this.dateTo == null) ? null : this.dateTo.GetDate(),
            icon : this.icon,
            notes : this.notes
        }
    }
}