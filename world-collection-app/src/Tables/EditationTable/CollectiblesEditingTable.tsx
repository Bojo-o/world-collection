import React from "react";
import { Collectible } from "../../Data/DatabaseModels/Collectible";
import Table from "../Table/Table";

/**
 * Props necessary for CollectiblesEditingTable.
 */
export interface CollectiblesEditingTableProps {
    /** Collectibles as records of table. */
    records: Collectible[];
    /** Collectible, which is actually edited by user. */
    editedCollectible: Collectible | null;
    /** Flag representing if collecttible can be saved. If can not be, button for saving will be disabled.*/
    canSaveCollectible: boolean;
    // func for managing and handling editaion of collection, here are only invoked.
    removeCollectible: (collectible: Collectible) => void;
    editCollectible: (collectible: Collectible) => void;
    saveCollectible: (collectible: Collectible) => void;
    cancleCollectibleAction: () => void;
    handleCollectibleNameChange: (event: any) => void;
}
/**
 * Func rendering table with collectibles as records.
 * It contains columns describing collectible and also mechanism for editing, removing collectibles.
 * These functions are only invoked here when user clicks on certains buttons, which represent those actions.
 * Imlementation of those functions is elsewhere.

 * @param CollectiblesEditingTableProps See CollectiblesEditingTableProps description.
 * @returns JSX element rendering table with collections, which can be edited.
 */
function CollectiblesEditingTable({ records: collectibles, editCollectible, removeCollectible, editedCollectible, saveCollectible, cancleCollectibleAction, handleCollectibleNameChange, canSaveCollectible }: CollectiblesEditingTableProps) {
    const renderTypesColumn = (types: string[]) => {
        return (
            <>
                <div className="d-flex flex-wrap">
                    {types.map((type, index) => {
                        return (
                            <div key={index} className="badge bg-info text-wrap">
                                {type}
                            </div>
                        )
                    })}
                </div>
            </>
        )
    }
    const renderVisition = (visit: boolean) => {
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
    const renderBody = (currPage: number, rowsPerPage: number) => {
        return (
            <>
                {collectibles.slice(currPage * rowsPerPage - rowsPerPage, currPage * rowsPerPage).map((collectible, index) => {
                    return (
                        <React.Fragment key={index}>
                            <tr >
                                <th scope="row">{currPage * rowsPerPage - rowsPerPage + index + 1}</th>
                                <th scope="row">
                                    {editedCollectible != null && editedCollectible.QNumber === collectible.QNumber ? (
                                        <>
                                            <input type="text" className="form-control" aria-describedby="collectibleInputNameHelp" value={editedCollectible.name} onChange={handleCollectibleNameChange} />
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
                                <th scope="row">{renderTypesColumn(collectible.instanceOf)}</th>
                                <th scope="row">{renderVisition(collectible.isVisit)}</th>
                                <th scope="row">
                                    <div className="d-flex flex-wrap justify-content-center" >
                                        {editedCollectible != null && editedCollectible.QNumber === collectible.QNumber && (
                                            <>
                                                {canSaveCollectible ? (
                                                    <button type="button" className="btn btn-success" onClick={() => saveCollectible(editedCollectible)}>Save</button>
                                                ) : (
                                                    <button type="button" className="btn btn-success" disabled onClick={() => saveCollectible(editedCollectible)}>Save</button>
                                                )}

                                                <button type="button" className="btn btn-danger" onClick={cancleCollectibleAction}>Cancel</button>
                                            </>
                                        )}
                                        {(editedCollectible == null || editedCollectible.QNumber !== collectible.QNumber) && (
                                            <>
                                                <button type="button" className="btn btn-primary" onClick={() => editCollectible(collectible)}>Edit</button>
                                                <button type="button" className="btn btn-danger" onClick={() => removeCollectible(collectible)}>Remove</button>
                                            </>
                                        )}
                                    </div>
                                </th>
                            </tr>
                        </React.Fragment>
                    )
                })}
            </>
        )
    }
    return (
        <>
            <Table recordsCount={collectibles.length} renderHead={renderHead} renderBody={renderBody} />
        </>
    )
}
export default CollectiblesEditingTable;