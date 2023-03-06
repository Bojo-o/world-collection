import { SearchCollectiblesBuilderQuery } from "./SearchCollectiblesQueryBuilder";

export interface SearchCollectiblesQueryRendererProps{
    searchQueryBuilder : SearchCollectiblesBuilderQuery;
    handleTypeExceptionRemove : (index : number) => void;
}
function SearchCollectiblesQueryRenderer({searchQueryBuilder,handleTypeExceptionRemove} : SearchCollectiblesQueryRendererProps){
    return (
        <div className="d-flex flex-column">
            {searchQueryBuilder.getType() != null && (
                <>
                    <h3>Search for collectibles of type "{searchQueryBuilder.getType()?.GetName()}"</h3>
                    <h3>Type Exceptions:</h3>
                    {searchQueryBuilder.getTypeExceptions().length !== 0 && (
                        <>
                            <table className="table table-light">
                                <thead>
                                    <tr>
                                        <th scope="col">Type</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>                                                
                                <tbody>
                                    {searchQueryBuilder.getTypeExceptions().map((type,index) => {
                                        return(
                                            <>
                                                <tr key={index}>
                                                    <td>{type.GetName()}</td>
                                                    <td><button type="button" className="btn btn-outline-danger" onClick={() => handleTypeExceptionRemove(index)}>Remove</button></td>
                                                </tr>
                                            </>
                                        )
                                    })}
                                </tbody>
                        </table>       
                        </>
                    )}
                </>
            )}
        </div>
    )
}
export default SearchCollectiblesQueryRenderer;

                                            
