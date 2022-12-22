interface Detail {
    name: string;
    value: string;
}
export class EntityDetailsData {
    details : Detail[] = [];
    image : string = '';

    constructor(initializer?: any[]){
        if(!initializer) return;
        initializer.map((i) => {
            if (i.statement === 'image'){
                return this.image = i.value;
            }
            return this.details.push({name : i.statement,value: i.value })
        })
        
    }
}