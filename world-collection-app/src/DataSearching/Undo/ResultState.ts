import { ResultData } from "../../Data/ResultsData";

export enum TypeOfChange {
    REMOVE,
    EDIT,
    ADD,
}
export class ResultState {
    private result : ResultData;
    private change : TypeOfChange;

    constructor(result : ResultData,change : TypeOfChange){
        this.result = result;
        this.change = change;
    }

    get = () => {
        return {
            result : this.result,
            change : this.change,
        }
    }
}