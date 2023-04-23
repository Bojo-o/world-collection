import { Entity } from "../../SearchData/Entity";

/**
 * Object storing value for some filter/property, whose data type is WikibaseItem.
 */
export class WikibaseItemValueData{
    /** Entity representing WikibaseItem value, that value represents QNumber of Entity*/
    private item : Entity

    constructor(item : Entity){
        this.item = item;
    }

    public getString(){
        return "\""  + this.item.GetName() + "\"  is value of item property"  
    }

    toJSON(){
        return {
            item : this.item.GetQNumber()
        }
    }
}