import { RawCollectible } from "../../Data/CollectibleModels/RawCollectible";
import { Memento, TypeOfChange } from "./Memento";

/**
 * Class for storing and loading memento from/into originator (FoundResultsHandler).
 * It manages states.
 */
export class Caretaker {
    /** Current array of raw collectibles, which can be modified. */
    private results: RawCollectible[];
    /** Stack of changes */
    private stack: Memento[];
    /** Number of how many changes it will remember. */
    private stackSize: number;

    constructor(results: RawCollectible[], stackSize: number) {
        this.results = results;
        this.stack = [];
        this.stackSize = stackSize;
    }

    private insertToArr(arr: RawCollectible[], data: RawCollectible, index: number) {
        return arr.splice(index, 0, data);
    }
    /**
     * Changes a results, it is called from parent component when it changes that array.
     * @param results A new array of results.
     */
    changeResults(results: RawCollectible[]) {
        this.results = results;
    }
    /**
     * Saves change into stack as memento.
     * When stack is full,then it removes the first element for storing a new one. 
     * @param data Original data, before editation.
     * @param change Type of made change.
     * @param index Number of index, on which position was data.
     */
    saveState(data: RawCollectible, change: TypeOfChange, index: number) {
        if (this.stack.length >= this.stackSize) {
            this.stack.shift();
        }
        this.stack.push(new Memento(data, change, index));
    }
    /**
     * Get knows to originator that undo is possible, because some editation was made.
     * @returns True if stack contains some changes.
     */
    isUndoAvailable() {
        return this.stack.length !== 0;
    }
    /**
     * Undo back one change made.
     * @returns Array of results, before the last editation.
     */
    undoState() {
        let state: Memento | undefined = this.stack.pop();
        if (state !== undefined) {
            const { result, change, index } = state.get();

            switch (change) {
                case TypeOfChange.EDIT:
                    let temp = this.results.filter((item) => item.QNumber !== result.QNumber);
                    this.insertToArr(temp, result, index);
                    this.results = temp;
                    break;
                case TypeOfChange.REMOVE:
                    let temp2 = this.results.filter((item) => item.QNumber !== result.QNumber);

                    this.insertToArr(temp2, result, index);
                    this.results = temp2;
                    break;
                case TypeOfChange.ADD:
                    break;
                default:
                    break;
            };
        }
        return this.results;
    }
}