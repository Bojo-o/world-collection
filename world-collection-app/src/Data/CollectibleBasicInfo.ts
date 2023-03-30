export class CollectibleBasicInfo{
    image : string|null = null
    desc : string|null = null

    constructor(initializer?: any){
        if(!initializer) return;
        if (initializer.image) this.image = initializer.image;
        if (initializer.desc) this.desc = initializer.desc;
    }
}