export class SearchCollectiblesBuilderQuery{
    private collectibleTypeQNumber : string|null = null;
    private collectibleTypeName : string|null = null;

    constructor(initializer?: SearchCollectiblesBuilderQuery){
        if(!initializer) return;
        this.collectibleTypeQNumber = initializer.collectibleTypeQNumber;
        this.collectibleTypeName = initializer.collectibleTypeName;
        
    }

    public setSearingType(QNumber : string,name : string) {
        this.collectibleTypeName = name;
        this.collectibleTypeQNumber = QNumber;
        return new SearchCollectiblesBuilderQuery(this);
    }

    public render(){
        return (
            <div className="d-flex">
                {this.collectibleTypeName != null && (
                    <>
                        <h3>Search for collectibles of type {this.collectibleTypeName}</h3>
                    </>
                )}
            </div>
        )
    }
}
