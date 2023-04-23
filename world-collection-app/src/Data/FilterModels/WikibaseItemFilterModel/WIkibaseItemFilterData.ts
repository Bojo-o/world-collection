import { WikibaseItemPropertyData } from "./WikibaseItemPropertyData";

/**
 * Data model representing property/filter, whose data type is "WikibaseItem".
 * It contains data necessary for searching satisfying WikibaseItem values of this property/filter.
 */
export class WikibaseItemFilterData {
    /** List of constraint, which cause conflict*/
    conflict_with_constraint : WikibaseItemPropertyData[] = []
    /** List of constraints. Values allowed for given filter can be only one of those constraints. */
    one_of_constraint : WikibaseItemPropertyData[] = []
    /** List of constraints defining that values in given property can not be those constraints */
    none_of_constraint : WikibaseItemPropertyData[] = []
    /** List of allowed type constraint. In searching for values, which can be used as value in given filter, that values must be instance of those constraints. */
    value_type_constraint : WikibaseItemPropertyData[] = []

    private trasform(data : WikibaseItemPropertyData[]){
        let result : string[]  =  data.map((d) => {
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