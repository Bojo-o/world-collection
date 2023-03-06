import { Entity } from "../Data/SearchData/Entity";

export class SearchCollectiblesBuilderQuery{

    private collectibleType : Entity|null = null;
    private exceptionsCollectibleType : Entity[] = [];

    constructor(initializer?: SearchCollectiblesBuilderQuery){
        if(!initializer) return;
        this.collectibleType = initializer.collectibleType;
        this.exceptionsCollectibleType = initializer.exceptionsCollectibleType; 
    }

    public setType(QNumber : string,name : string) {
        this.collectibleType = new Entity(QNumber,name);
        return new SearchCollectiblesBuilderQuery(this);
    }

    public addTypeException(QNumber : string,name : string){
        this.exceptionsCollectibleType.push(new Entity(QNumber,name));
        return new SearchCollectiblesBuilderQuery(this);
    }
    public isTypeSet(){
        return this.collectibleType !== null;
    }
    public getType(){
        return this.collectibleType;
    }
    public render(){
        return (
            <div className="d-flex">
                {this.collectibleType != null && (
                    <>
                        <h3>Search for collectibles of type {this.collectibleType.GetName()}</h3>
                        <ul className="list-group">
                            {this.exceptionsCollectibleType.map((type) => {
                                return(
                                    <li className="list-group-item">{type.GetName()}</li>
                                )
                            })}
                        </ul>
                    </>
                )}
            </div>
        )
    }
}
