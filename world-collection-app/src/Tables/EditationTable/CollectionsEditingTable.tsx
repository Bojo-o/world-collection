import { useEffect, useState } from "react";
import { Collection } from "../../Data/DatabaseModels/Colection";
import Table from "../Table/Table";
import IconsSelector from "../../CollectibleEditableComponents/Icons/IconsSelector";
import { LocalAPIProxy } from "../../API/LocalAPIProxy";
import React from "react";


/**
 * Props necessary for CollectionsEditingTable.
 */
export interface CollectionsEditingTableProps {
    /** Collections as records of table. */
    records: Collection[];
    /** Collection, which is actually edited by user. */
    edited: Collection | null;
    /** Flag representing if collection can be saved. If can not be, button for saving will be disabled.
     *  It is used when user edit name of collection. Each collection must have unique name.
     */
    canSaveItem: boolean;
    /** Collection, which user want to merge into other */
    merging: Collection | null;
    // func for managing and handling editaion of collection, here are only invoked.
    editItem: (row: Collection) => void;
    cancelEditation: () => void;
    removeItem: (row: Collection) => void;
    handleChange: (event: any) => void;
    saveItem: (edited: Collection) => void;
    merge: (collectionID: Number, intoCollectionID: Number) => void;
    mergeItem: (row: Collection) => void;
    editCollectibles: (row: Collection) => void;

}
/**
 * Func rendering table with collections as records.
 * It contains columns describing collections and also mechanism for editing, removing, merging two collections into one of them,
 * seting icons for each collectible in those colections, those collections.
 * These functions are only invoked here when user clicks on certains buttons, which represent those actions.
 * Imlementation of those functions is elsewhere.

 * @param CollectionsEditingTableProps See CollectionsEditingTableProps description.
 * @returns JSX element rendering table with collections, which can be edited.
 */
function CollectionsEditingTable({ records: collections, edited, editItem, cancelEditation, removeItem, handleChange, saveItem, canSaveItem, merge, mergeItem, merging, editCollectibles }: CollectionsEditingTableProps) {
    const [selectedCollectionID, setSelectedCollectionID] = useState(-1)
    const [iconSetting, setIconSetting] = useState(false);

    const handleIconSetting = () => {
        setIconSetting((prev) => !prev);
    }
    const handleCollectionSelection = (e: any) => {
        let value = e.target.value;
        setSelectedCollectionID(value)
    }
    useEffect(() => {
        setSelectedCollectionID(-1)
    }, [merging, edited])

    const renderHead = () => {
        return (
            <>
                <th scope="col">#</th>
                <th scope="col">Name of collection</th>
                <th scope="col">#Collectibles</th>
                <th scope="col"></th>
            </>
        )
    }

    const saveIconChange = (settedIcon: string) => {
        return LocalAPIProxy.postCollectiblesInCollectionUpdateIcon(edited!.collectionID, settedIcon);
    }
    const renderBody = (currPage: number, rowsPerPage: number) => {
        return (
            <>
                {
                    collections.slice(currPage * rowsPerPage - rowsPerPage, currPage * rowsPerPage).map((row, index) => {
                        return (
                            <React.Fragment key={index}>
                                <tr >
                                    <th scope="row">{currPage * rowsPerPage - rowsPerPage + index + 1}</th>
                                    {(edited == null || edited.collectionID !== row.collectionID) && (merging == null || merging.collectionID !== row.collectionID) && (
                                        <>
                                            <td>{row.name}</td>
                                            <td>{row.getCountOfCollectibles().toString()}</td>
                                            <td>
                                                <div className="d-flex flex-wrap justify-content-center">
                                                    <button type="button" className="btn btn-info" onClick={() => editCollectibles(row)}>Edit Collectibles</button>
                                                    <button type="button" className="btn btn-primary" onClick={() => editItem(row)}>Edit</button>
                                                    <button type="button" className="btn btn-warning" onClick={() => mergeItem(row)}>Merge</button>
                                                    <button key={index} type="button" className="btn btn-danger" onClick={() => removeItem(row)}>Remove</button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                    {merging != null && merging.collectionID === row.collectionID && (
                                        <>
                                            <td>{row.name}</td>
                                            <td>{row.getCountOfCollectibles().toString()}</td>
                                            <td>
                                                <div className="d-flex flex-wrap justify-content-center">
                                                    <p>Merge into collection:</p>
                                                    <select className="form-select" onChange={handleCollectionSelection} defaultValue={""} >
                                                        <option value="" disabled hidden>Choose collection</option>
                                                        {collections.map((item, index) => {
                                                            if (item.collectionID === row.collectionID) {
                                                                return (<React.Fragment key={index}></React.Fragment>)
                                                            }
                                                            return (
                                                                <option value={item.collectionID.toString()} key={index}>{item.name}</option>
                                                            )
                                                        })}
                                                    </select>

                                                    {selectedCollectionID === -1 ? (
                                                        <button type="button" className="btn btn-success" disabled onClick={() => merge(row.collectionID, 0)}>Merge</button>
                                                    ) : (
                                                        <button type="button" className="btn btn-success" onClick={() => merge(row.collectionID, selectedCollectionID)}>Merge</button>
                                                    )}
                                                    <button type="button" className="btn btn-danger" onClick={cancelEditation}>Cancel</button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                    {edited != null && edited.collectionID === row.collectionID &&
                                        (
                                            <>
                                                <td>
                                                    <input type="text" className="form-control" aria-describedby="collectionNameHelp" value={edited.name} onChange={handleChange} />
                                                    {!canSaveItem && (
                                                        <div id="collectionNameHelp" className="form-text">{edited.name.length > 2 ? "That name has already used" : "Name must be at least 3 character long."}</div>
                                                    )}

                                                </td>
                                                <td>{row.getCountOfCollectibles().toString()}</td>
                                                <td >
                                                    <div className="d-flex flex-wrap justify-content-center">
                                                        <button type="button" className="btn btn-secondary" onClick={handleIconSetting}>{(!iconSetting) ? "Set Icon for all collectibles" : "Cancel"}</button>
                                                        {canSaveItem ? (
                                                            <button type="button" className="btn btn-success" onClick={() => saveItem(edited)}>Save</button>
                                                        ) : (
                                                            <button type="button" className="btn btn-success" disabled onClick={() => saveItem(edited)}>Save</button>
                                                        )}

                                                        <button type="button" className="btn btn-danger" onClick={cancelEditation}>Cancel</button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                </tr>
                                {edited != null && edited.collectionID === row.collectionID && iconSetting && (
                                    <tr key={index}>
                                        <td colSpan={4}>
                                            <div className="d-flex justify-content-center">
                                                <IconsSelector handleChangeOfIcon={() => { }} saveIconChange={saveIconChange} />
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })
                }
            </>
        )
    }
    return (
        <>
            <Table recordsCount={collections.length} renderHead={renderHead} renderBody={renderBody} />
        </>
    );
}
export default CollectionsEditingTable