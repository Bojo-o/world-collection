import { Collectible } from "../Data/Database/Collectible";
import Table from "../Table/Table";

export interface CollectiblesTableProps{
    collectibles : Collectible[];
    editedCollectible : Collectible;
    removeCollectible : (collectible : Collectible) => void;
    editCollectible : (collectible : Collectible) => void;
    saveCollectible : (collectible : Collectible) => void;
    cancleCollectibleAction : () => void;
    handleCollectibleNameChange : (event : any) => void;
    canSaveCollectible : boolean;
}
function CollectiblesTable ({collectibles,editCollectible,removeCollectible,editedCollectible,saveCollectible,cancleCollectibleAction,handleCollectibleNameChange,canSaveCollectible} : CollectiblesTableProps) {
    const renderTypesColumn = (types : string) => {
        return(
            <>
                <div className="d-flex ">
                    {types.split('/').map((type,index) => {
                        return (
                            <>
                                <div key={index} className="badge bg-info text-wrap">
                                    {type}
                                </div>
                            </>
                        )
                    })}
                </div>
            </>
        )
    }
    const renderVisition = (visit : boolean) => {
        return (
            <>
                {visit ? (
                    <>
                        <div className="badge bg-success text-wrap">
                            Visited
                        </div>
                    </>
                ) : (
                    <>
                        <div className="badge bg-danger text-wrap">
                            Not visited
                        </div>
                    </>
                )}               
            </>
        )
    }
    const renderHead = () => {
        return (
            <>
                <th scope="col">#</th>
                <th scope="col">Name of collectible</th>
                <th scope="col">Types of</th>
                <th scope="col">Visition</th>
                <th scope="col"></th>
            </>
        )
    }
    const renderBody = (currPage : number,rowsPerPage : number) => {
        return (
            <>
                {collectibles.slice(currPage * rowsPerPage - rowsPerPage,currPage * rowsPerPage).map((collectible,index) => {
                    return(
                        <>
                            <tr key={index}>
                                <th scope="row">{currPage * rowsPerPage - rowsPerPage + index + 1}</th>
                                <th scope="row">
                                    {editedCollectible.QNumber === collectible.QNumber ? (
                                        <>
                                            <input type="text" className="form-control" aria-describedby="collectibleInputNameHelp" value={editedCollectible.name} onChange={handleCollectibleNameChange}/>
                                            {!canSaveCollectible && (
                                                <div id="collectibleInputNameHelp" className="form-text">{editedCollectible.name === collectible.name ? ("You need change name") : ("Name must be at least 3 character long.")}</div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {collectible.name}
                                        </>
                                    )}   
                                </th>
                                <th scope="row">{renderTypesColumn(collectible.type)}</th>
                                <th scope="row">{renderVisition(collectible.isVisit)}</th>
                                <th scope="row">
                                    <div className="d-flex justify-content-center" >
                                        {editedCollectible.QNumber === collectible.QNumber && (
                                            <>
                                                {canSaveCollectible ? (
                                                    <button type="button" className="btn btn-success"  onClick={() => saveCollectible(editedCollectible)}>Save</button>
                                                ) : (
                                                    <button type="button" className="btn btn-success"  disabled onClick={() => saveCollectible(editedCollectible)}>Save</button>
                                                )}
                                                
                                                <button type="button" className="btn btn-danger" onClick={cancleCollectibleAction}>Cancel</button>
                                            </>
                                        )}
                                        {editedCollectible.QNumber !== collectible.QNumber && (
                                            <>
                                                <button type="button" className="btn btn-primary" onClick={() => editCollectible(collectible)}>Edit</button>
                                                <button type="button" className="btn btn-danger" onClick={() => removeCollectible(collectible)}>Remove</button>
                                            </>
                                        )}                                       
                                    </div>
                                </th>
                            </tr>
                        </>
                    )
                })}
            </>
        )
    }
    return (
        <>
            <Table rowsCount={collectibles.length} renderHead={renderHead} renderBody={renderBody} />
        </>
    )
}
export default CollectiblesTable;