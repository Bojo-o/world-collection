import { Entity } from "../../Data/SearchData/Entity";

export class CollectiblesSearchingBaseBuilder{
    private type : Entity|null = null;
    private exceptionsSubTypes : Entity[] = [];

    

    constructor(initializer? : CollectiblesSearchingBaseBuilder){
        if(!initializer) return;  
        if (initializer.type) this.type = initializer.type;    
        if (initializer.exceptionsSubTypes) this.exceptionsSubTypes = initializer.exceptionsSubTypes;  
    }

    public setTypeAndExceptionSubTypes(type : Entity,exceptionsSubTypes : Entity[]){
        this.type = type;
        this.exceptionsSubTypes = exceptionsSubTypes;
        return new CollectiblesSearchingBaseBuilder(this);
    }
}