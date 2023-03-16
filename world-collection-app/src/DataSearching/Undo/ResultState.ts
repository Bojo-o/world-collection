import { RawCollectible } from "../../Data/RawCollectible";

export enum TypeOfChange {
    REMOVE,
    EDIT,
    ADD,
}
export class ResultState {
    private result : RawCollectible;
    private change : TypeOfChange;
    private changeAtIndex : number;

    constructor(result : RawCollectible,change : TypeOfChange, changeAtIndex : number){
        this.result = result;
        this.change = change;
        this.changeAtIndex = changeAtIndex;
    }

    get = () => {
        return {
            result : this.result,
            change : this.change,
            index : this.changeAtIndex,
        }
    }
}