import { AppliedFilterData } from "../../Data/FiltersData/AppliedFilterData"
import { Entity } from "../../Data/SearchData/Entity"
import { Areas } from "./CollectiblesSearchingStates/AreaChoosing/Areas"

export class CollectiblesSearchQueryData{
    private type : string|null = null
    private exceptionsSubTypes : string[] = []
    private filters : AppliedFilterData[] = []

    private radius : number|null = null;
    private center : {lat : number,lng : number}|null = null;

    private area : string|null = null;
    private exceptionsSubAreas : string[] = [];
    
    private region : string|null = null;
    private areaSearchType : Areas|null = null;

    constructor(initializer? : any){
        if(!initializer) return;  
        if (initializer.type) this.type = initializer.type;    
        if (initializer.exceptionsSubTypes) this.exceptionsSubTypes = initializer.exceptionsSubTypes;  
        if (initializer.filters) this.filters = initializer.filters;
        if (initializer.radius) this.radius = initializer.radius;    
        if (initializer.center) this.center = initializer.center;  
        if (initializer.area) this.area = initializer.area;    
        if (initializer.exceptionsSubAreas) this.exceptionsSubTypes = initializer.exceptionsSubTypes;    
        if (initializer.areaSearchType) this.areaSearchType = initializer.areaSearchType;
        if (initializer.region) this.region = initializer.region;
    }
    public getType(){
        if (this.type != null){
            return this.type;
        }
        return "Not yet provided"
    }
    public getExceptionsSubTypes(){
        return this.exceptionsSubTypes;
    }
    public setTypeAndExceptionSubTypes(type : Entity,exceptionsSubTypes : Entity[]){
        this.type = type.GetQNumber();
        this.exceptionsSubTypes = exceptionsSubTypes.map((e) => {return e.GetQNumber()}) ;
        return new CollectiblesSearchQueryData(this);
    }
    public setFilters(filters : AppliedFilterData[]){
        this.filters = filters;
        console.log(filters)
        return new CollectiblesSearchQueryData(this);
    }
    public setAreaSearchTypeAsRadius(radius : number,center : {lat : number,lng : number}){
        this.areaSearchType = Areas.RADIUS;
        this.radius = radius;
        this.center = center;
        return new CollectiblesSearchQueryData(this);
    }
    public setAreaSearchTypeAsRegion(region : Entity){
        this.areaSearchType = Areas.REGION;
        this.region = region.GetQNumber();
        return new CollectiblesSearchQueryData(this);
    }
    public setAreaSearchTypeAsAdministrative(area : Entity,exceptionsSubAreas : Entity[]){
        this.areaSearchType = Areas.ADMINISTRAVIVE_AREA;
        this.area= area.GetQNumber();
        this.exceptionsSubAreas = exceptionsSubAreas.map((e) => {return e.GetQNumber()});
        return new CollectiblesSearchQueryData(this);
    }
    public setAreaSearchTypeAsWorld(){
        this.areaSearchType = Areas.WORLD;
        return new CollectiblesSearchQueryData(this);
    }

}