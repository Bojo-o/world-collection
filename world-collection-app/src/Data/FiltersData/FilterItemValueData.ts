import { Entity } from "../SearchData/Entity";

export class FilterItemValueData{
    private item : Entity

    constructor(item : Entity){
        this.item = item;

    }

    public getString(){
        return "\""  + this.item.GetName() + "\"  is value of item property"  
    }
    public getData(){
        return this.item.GetQNumber();
    }
    toJSON(){
        return {
            item : this.item.GetQNumber()
        }
    }
}