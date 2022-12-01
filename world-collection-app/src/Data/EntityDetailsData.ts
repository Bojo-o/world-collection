interface Detail {
    name: string;
    value: string;
}
export class EntityDetailsData {
    details : Detail[] = []

    constructor(initializer?: any[]){
        if(!initializer) return;
        initializer.map((i) => {
            return this.details.push({name : i.statement,value: i.value })
        })
        
    }
}