import { WikibaseItemPropertyData } from "./WikibaseItemPropertyData";

export class WikibaseItemFilterData {
    conflict_with_constraint : WikibaseItemPropertyData[] = []
    one_of_constraint : WikibaseItemPropertyData[] = []
    none_of_constraint : WikibaseItemPropertyData[] = []
    value_type_constraint : WikibaseItemPropertyData[] = []

    constructor(){
    }
    private trasform(data : WikibaseItemPropertyData[]){
        //let result : string = ""
        let result : string[]  =  data.map((d) => {
            //if (result == ""){
            //    result = d.QNumber
            //}else{
            //    result = result + "," +d.QNumber
            //}
            return d.QNumber;
        })
        return result;
    }
    public getValueTypesRelation(){
        let result  = ""
        if (this.value_type_constraint.length != 0){
            result = this.value_type_constraint[0].relation;
        }
        return result;
    }
    public getConflictTypesRelation(){
        let result  = ""
        if (this.conflict_with_constraint.length != 0){
            result = this.conflict_with_constraint[0].relationQNumber;
        }
        return result;
    }
    public getValueTypeQNumbers(){
        return this.trasform(this.value_type_constraint)
    }
    public getConflictTypeQNumbers(){
        return this.trasform(this.conflict_with_constraint)
    }
    public getNoneValuesQNumbers(){
        return this.trasform(this.none_of_constraint)
    }
}