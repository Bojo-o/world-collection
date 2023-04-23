export enum DataTypeOfFilter{
    Quantity = "Quantity",
    Time = "Time",
    WikibaseItem = "Item"
}

export interface IFilterData{
    PNumber : string,
    name : string,
    description : string,
    dataType : string
}
/** Data model representing filter identification. */
export class FilterIdentificationData {
    /**The unique PNumber of filter/property.  */
    PNumber : string;
    /** Name of filter. */
    name : string;
    /** Description of filter. */
    description : string;
    /** Data type identifying that this filter/property has value as this data type. */
    dataType : DataTypeOfFilter;
    
    constructor({PNumber,name,description,dataType} : IFilterData){
        this.PNumber = PNumber;
        this.name = name;
        this.description = description;
        this.dataType = DataTypeOfFilter[dataType as keyof typeof DataTypeOfFilter];
    }

}