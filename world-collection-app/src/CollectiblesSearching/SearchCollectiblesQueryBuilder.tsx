import { Entity } from "../Data/SearchData/Entity";

export class SearchCollectiblesBuilderQuery{

    private collectibleType : Entity|null = null;
    private exceptionsCollectibleType : Entity[] = [];

    constructor(initializer?: SearchCollectiblesBuilderQuery){
        if(!initializer) return;
        this.collectibleType = initializer.collectibleType;
        this.exceptionsCollectibleType = initializer.exceptionsCollectibleType; 
    }

    public setType(entity : Entity) {
        this.collectibleType = entity;
        this.exceptionsCollectibleType = [];
        return new SearchCollectiblesBuilderQuery(this);
    }

    public addTypeException(entity : Entity){
        this.exceptionsCollectibleType.push(entity);
        return new SearchCollectiblesBuilderQuery(this);
    }
    public removeTypeException(index : number){
        this.exceptionsCollectibleType.splice(index);
        return new SearchCollectiblesBuilderQuery(this);
    }
    public isTypeSet(){
        return this.collectibleType !== null;
    }
    public getType(){
        return this.collectibleType;
    }
    public getTypeExceptions(){
        let newArr : Entity[] = [];
        this.exceptionsCollectibleType.forEach((type) => {
            newArr.push(type);
        })
        return newArr;
    }
    

}
