import { RawCollectible } from "../../Data/CollectibleModels/RawCollectible";

/**
 * Enums of possible changes.
 */
export enum TypeOfChange {
    REMOVE,
    EDIT,
    ADD,
}
/**
 * Class representing state of change of some raw collectible, which was made during editation by user.
 * It builds with other class "Undo" mechanism.
 * It represents "memento" class in Memento pattern.
 */
export class Memento {
    /** Original raw collectible, before editation */
    private item : RawCollectible;
    /**Type of change. To knows how to undo that. */
    private change : TypeOfChange;
    /** Number of index, which has raw collectible. Important for removing item, then restoring it backs at the original index. */
    private changeAtIndex : number;

    constructor(result : RawCollectible,change : TypeOfChange, changeAtIndex : number){
        this.item = result;
        this.change = change;
        this.changeAtIndex = changeAtIndex;
    }
    // get state
    get = () => {
        return {
            result : this.item,
            change : this.change,
            index : this.changeAtIndex,
        }
    }
}