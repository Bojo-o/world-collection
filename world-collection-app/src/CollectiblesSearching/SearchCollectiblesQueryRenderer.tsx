import { Entity } from "../Data/SearchData/Entity";
import { SearchCollectiblesBuilderQuery } from "./SearchCollectiblesQueryBuilder";

export interface SearchCollectiblesQueryRendererProps{
    searchQueryBuilder : SearchCollectiblesBuilderQuery;
    handleTypeExceptionRemove : (index : number) => void;
    handleAreaExceptionRemove : (index : number) => void;
}
export interface TableForExceptionsProps{
    data : Entity[];
    handleRemove : (index: number) => void;
}
export function TableForExceptions({data,handleRemove} : TableForExceptionsProps){
    return(
        <>
            <table className="table table-light">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col"></th>
                        </tr>
                </thead>                                                
                <tbody>
                    {data.map((type,index) => {
                        return(
                            <>
                                <tr key={index}>
                                    <td>{type.GetName()}</td>
                                    <td><button type="button" className="btn btn-outline-danger" onClick={() => handleRemove(index)}>Remove</button></td>
                                </tr>
                            </>
                        )
                    })}
                </tbody>
            </table>       
        </>
    )
}
function SearchCollectiblesQueryRenderer({searchQueryBuilder,handleTypeExceptionRemove,handleAreaExceptionRemove} : SearchCollectiblesQueryRendererProps){

    return (
        <div className="d-flex flex-column">
            {searchQueryBuilder.getType() != null && (
                <>
                    <h3>Search for collectibles of type "{searchQueryBuilder.getType()?.GetName()}"</h3>
                    <h3>Type Exceptions:</h3>
                    {searchQueryBuilder.getTypeExceptions().length !== 0 && (
                        
                        <TableForExceptions data={searchQueryBuilder.getTypeExceptions()} handleRemove={handleTypeExceptionRemove}/>
                    )}
                </>
            )}

            {searchQueryBuilder.isAdministrativeAreaSet() && (
                <>
                    <h3>Search for collectibles in administrative area "{searchQueryBuilder.getAdministrativeArea()?.GetName()}"</h3>
                    <h3>Administrative Area Exceptions:</h3>
                    {searchQueryBuilder.getAdministrativeAreaExceptions().length !== 0 && (
                        <TableForExceptions data={searchQueryBuilder.getAdministrativeAreaExceptions()} handleRemove={handleAreaExceptionRemove}/>
                    )}
                </>
            )}

            {searchQueryBuilder.isRadiusAreaSet() && (
                <>
                    <h3>Search for collectibles in selected radius area with center "{searchQueryBuilder.getRadiusCenter()?.lat} , {searchQueryBuilder.getRadiusCenter()?.lng}" and radius of {searchQueryBuilder.getRadiusValue()} km</h3>
                </>
            )}
        </div>
    )
}
export default SearchCollectiblesQueryRenderer;

