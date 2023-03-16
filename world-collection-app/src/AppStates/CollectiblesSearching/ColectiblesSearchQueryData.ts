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

    private areaSearchType : Areas|null = null;

    constructor(initializer? : any){
        if(!initializer) return;  
        if (initializer.type) this.type = initializer.type;    
        if (initializer.exceptionsSubTypes) this.exceptionsSubTypes = initializer.exceptionsSubTypes;  
        if (initializer.filtes) this.filters = initializer.filtes;
        if (initializer.radius) this.radius = initializer.radius;    
        if (initializer.center) this.center = initializer.center;  
        if (initializer.area) this.area = initializer.area;    
        if (initializer.exceptionsSubAreas) this.exceptionsSubTypes = initializer.exceptionsSubTypes;    
        if (initializer.areaSearchType) this.areaSearchType = initializer.areaSearchType;
    }

    public setTypeAndExceptionSubTypes(type : Entity,exceptionsSubTypes : Entity[]){
        this.type = type.GetQNumber();
        this.exceptionsSubTypes = exceptionsSubTypes.map((e) => {return e.GetQNumber()}) ;
        return new CollectiblesSearchQueryData(this);
    }
    public setFilters(filters : AppliedFilterData[]){
        this.filters = filters;
        return new CollectiblesSearchQueryData(this);
    }
    public setAreaSearchTypeAsRadius(radius : number,center : {lat : number,lng : number}){
        this.areaSearchType = Areas.RADIUS;
        this.radius = radius;
        this.center = center;
        return new CollectiblesSearchQueryData(this);
    }
    public setAreaSearchTypeAsAdministrative(area : Entity,exceptionsSubAreas : Entity[]){
        this.areaSearchType = Areas.ADMINISTRAVIVE_AREA;
        this.area= area.GetQNumber();
        this.exceptionsSubAreas = exceptionsSubAreas.map((e) => {return e.GetQNumber()});
        return new CollectiblesSearchQueryData(this);
    }

}