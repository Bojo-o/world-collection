import { runInThisContext } from "vm";
import { ResultData } from "../../Data/ResultsData";
import { ResultState, TypeOfChange } from "./ResultState";

export class Caretaker {
    private results : ResultData[];
    private stack : ResultState[];

    constructor(results : ResultData[]){
        this.results = results;
        this.stack = [];
    }

    changeResults(results : ResultData[]){
        this.results = results;
    }
    saveState(data : ResultData,change :TypeOfChange) {
        this.stack.push(new ResultState(data,change));
    }

    undoState(){
        let state : ResultState|undefined = this.stack.pop();
        if  (state !== undefined ) {
            const {result,change} = state.get();
            
            switch (change){               
                case TypeOfChange.EDIT:
                    let temp = this.results.filter((item) => item.QNumber !== result.QNumber);
                    temp.push(result);
                    this.results = temp;
                    break;
                case TypeOfChange.REMOVE:    
                    let temp2 = this.results.filter((item) => item.QNumber !== result.QNumber);
                    temp2.push(result);
                    this.results = temp2;                                   

                    break;
                case TypeOfChange.ADD:
                    this.results = this.results.filter((item) => item.QNumber !== result.QNumber);
                    break;
                default:
                    break;
            };
        }
        return this.results;
    }
}