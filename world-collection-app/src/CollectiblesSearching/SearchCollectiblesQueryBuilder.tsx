import { Entity } from "../Data/SearchData/Entity";

export class SearchCollectiblesBuilderQuery{

    private collectibleType : Entity|null = null;
    private exceptionsCollectibleType : Entity[] = [];

    private administrativeArea : Entity|null = null;
    private exceptionsAdministrativeArea : Entity[] = [];

    private centerOfRadiusArea : {lat : number,lng : number}|null = null;
    private radius : number|null = null;

    constructor(initializer?: SearchCollectiblesBuilderQuery){
        if(!initializer) return;
        this.collectibleType = initializer.collectibleType;
        this.exceptionsCollectibleType = initializer.exceptionsCollectibleType; 
        this.administrativeArea = initializer.administrativeArea;
        this.exceptionsAdministrativeArea = initializer.exceptionsAdministrativeArea;

        this.centerOfRadiusArea = initializer.centerOfRadiusArea;
        this.radius = initializer.radius;
    }
    public setRadius(center : {lat : number,lng : number},radius : number){
        this.centerOfRadiusArea = center;
        this.radius = radius;
        this.administrativeArea = null;
        this.exceptionsAdministrativeArea = [];
        return new SearchCollectiblesBuilderQuery(this);
    }
    public setType(entity : Entity) {
        this.collectibleType = entity;
        this.exceptionsCollectibleType = [];
        return new SearchCollectiblesBuilderQuery(this);
    }
    public setAdministrativeArea(entity : Entity){
        this.administrativeArea = entity;
        this.exceptionsAdministrativeArea = [];
        this.radius = null;
        this.centerOfRadiusArea = null;
        return new SearchCollectiblesBuilderQuery(this);
    }
    public addTypeException(entity : Entity){
        this.exceptionsCollectibleType.push(entity);
        return new SearchCollectiblesBuilderQuery(this);
    }
    public addAdministrativeAreaException(entity : Entity){
        this.exceptionsAdministrativeArea.push(entity);
        return new SearchCollectiblesBuilderQuery(this);
    }
    public removeTypeException(index : number){
        this.exceptionsCollectibleType.splice(index);
        return new SearchCollectiblesBuilderQuery(this);
    }
    public removeAdministrativeAreaException(index : number){
        this.exceptionsAdministrativeArea.splice(index);
        return new SearchCollectiblesBuilderQuery(this);
    }
    public isTypeSet(){
        return this.collectibleType !== null;
    }
    public isAdministrativeAreaSet(){
        return this.administrativeArea !== null;
    }
    public isRadiusAreaSet(){
        return this.centerOfRadiusArea !== null;
    }
    public getRadiusValue(){
        return this.radius;
    }
    public getRadiusCenter(){
        return this.centerOfRadiusArea;
    }
    public getType(){
        return this.collectibleType;
    }
    public getAdministrativeArea(){
        return this.administrativeArea;
    }
    public getTypeExceptions(){
        return this.ArrCopy(this.exceptionsCollectibleType);
    }
    public getAdministrativeAreaExceptions(){
        return this.ArrCopy(this.exceptionsAdministrativeArea);
    }
    private ArrCopy(arr : Entity[]){
        let newArr : Entity[] = [];
        arr.forEach((item) => {
            newArr.push(item);
        })
        return newArr;
    }
    

}
