import { runInThisContext } from "vm";
import { ResultData } from "../../Data/ResultsData";
import { ResultState, TypeOfChange } from "./ResultState";

export class Caretaker {
    private results : ResultData[];
    private stack : ResultState[];
    private stackSize : number;

    constructor(results : ResultData[],stackSize : number){
        this.results = results;
        this.stack = [];
        this.stackSize = stackSize;
    }

    private insertToArr(arr: ResultData[] ,data : ResultData, index : number){
        return arr.splice(index, 0,data);
    }
    changeResults(results : ResultData[]){
        this.results = results;
    }
    saveState(data : ResultData,change :TypeOfChange,index : number) {
        if (this.stack.length >= this.stackSize){
            this.stack.shift();
        }
        this.stack.push(new ResultState(data,change,index));
    }
    isUndoAvailable(){
        return this.stack.length != 0;
    }
    undoState(){
        let state : ResultState|undefined = this.stack.pop();
        if  (state !== undefined ) {
            const {result,change,index} = state.get();
            
            switch (change){               
                case TypeOfChange.EDIT:
                    let temp = this.results.filter((item) => item.QNumber !== result.QNumber);
                    this.insertToArr(temp,result,index);
                    this.results = temp;
                    break;
                case TypeOfChange.REMOVE:    
                    let temp2 = this.results.filter((item) => item.QNumber !== result.QNumber);
                    
                    this.insertToArr(temp2,result,index);
                    this.results = temp2;      
                    //this.results.push(result);                           

                    break;
                case TypeOfChange.ADD:
                    //this.results = this.results.filter((item) => item.QNumber !== result.QNumber);
                    break;
                default:
                    break;
            };
        }
        return this.results;
    }
}