import React from "react";
import { RawCollectible } from "../../Data/CollectibleModels/RawCollectible";
import Table from "../Table/Table";
import RawCollectibleCard from "../../Map/Markers/RawCollectibleMarker/RawCollectibleCard";

/**
 * Props necessary for RawCollectiblesTable.
 */
export interface RawCollectiblesTableProps{
    /** Raw collectibles as records of table */
    records : RawCollectible[];
    /** Raw colectible, which is actually edited by user.*/
    edited : RawCollectible|null;
    /** Raw collectible, for which are details showed.*/
    detailShowing : RawCollectible|null;
    // functions for editing, showing etc.. of raw collectibles
    removeItem : (item : RawCollectible) => void;
    editItem : (row : RawCollectible) => void;
    cancel : () => void;
    saveItem : (edited : RawCollectible) => void;
    handleChange : (event : any) => void;
    showDetails : (item : RawCollectible) => void;
}
/**
 * Func rendering table with raw collectibles as records.
 * It contains columns describing raw collectible and also mechanism for editing, removing raw collectibles.
 * These functions are only invoked here when user clicks on certains buttons, which represent those actions.
 * Imlementation of those functions is elsewhere.
 * In this table user also can see raw colletible`s details by clicking "details" button.
 * @param RawCollectiblesTableProps See RawCollectiblesTableProps description.
 * @returns JSX element rendering table with raw collectibles, which can be edited.
 */
function RawCollectiblesTable ({records: results,edited,editItem,handleChange,cancel,removeItem,saveItem,showDetails,detailShowing} : RawCollectiblesTableProps) {

    const renderHead = () => {
        return (
            <>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Sub-Type of</th>
                <th scope="col"></th>
            </>
        )
    }

    const renderBody = (currPage : number,rowsPerPage : number) => {
        return(
            <>
                {                   
                    results.slice(currPage * rowsPerPage - rowsPerPage,currPage * rowsPerPage).map((row,index) => {
                        return (
                            <>
                                <tr key={index}>
                                <th scope="row">{currPage * rowsPerPage - rowsPerPage + index + 1}</th>
                                
                                {edited!=null && edited.QNumber === row.QNumber && 
                                    (
                                        <>
                                            <td><input type="text" className="form-control" value={edited.name} onChange={handleChange}/></td>
                                            <td>
                                                <div className="d-flex flex-wrap">
                                                    {row.instanceOF.map((subType,index) => {
                                                        return (
                                                            <>
                                                                <span key={index} className="badge bg-primary">{subType}</span>
                                                            </>
                                                        )
                                                    })}
                                                </div>
                                            </td>

                                            <td className="d-flex flex-wrap justify-content-center">
                                                <button type="button" className="btn btn-success" onClick={() =>  saveItem(edited)}>Save</button>
                                                <button key={index} type="button" className="btn btn-danger" onClick={cancel}>Cancel</button>
                                            </td>
                                            
                                        </>
                                    )
                                }
                                {(edited == null || edited.QNumber !== row.QNumber) && 
                                    (
                                        <>
                                            <td>{row.name}</td>
                                            <td>
                                                <div className="d-flex flex-wrap">
                                                    {row.instanceOF.map((subType,index) => {
                                                        return (
                                                            <>
                                                                <span key={index} className="badge bg-primary">{subType}</span>
                                                            </>
                                                        )
                                                    })}
                                                </div>
                                            </td>
                                            {(detailShowing == null || detailShowing.QNumber !== row.QNumber) ? 
                                            (
                                                <>    
                                                    <td className="d-flex flex-wrap justify-content-center">
                                                        <button type="button" className="btn btn-info" onClick={() => showDetails(row)}>Details</button>
                                                        <button type="button" className="btn btn-primary" onClick={() => editItem(row)}>Edit</button>
                                                        <button key={index} type="button" className="btn btn-danger" onClick={() => removeItem(row)}>Remove</button>
                                                    </td>
                                                    
                                                </>    
                                            )
                                            :
                                            (
                                                <>    
                                                    <td className="d-flex flex-wrap justify-content-center">
                                                        <button key={index} type="button" className="btn btn-danger" onClick={cancel}>Cancel</button>
                                                    </td>                                                   
                                                </>   
                                            )
                                            }
                                            
                                        </>    
                                    )
                                }                               
                            </tr>
                            {detailShowing != null && detailShowing.QNumber === row.QNumber && (
                                <tr>
                                    <th colSpan={4}>
                                        <div className="d-flex justify-content-center">
                                            <RawCollectibleCard rawCollectible={row} />
                                        </div>
                                    </th>
                                </tr>
                            )}
                            </>
                        );
                    })
                }
            </>
        )
    }
    return (
        <>
            <Table recordsCount={results.length} renderHead={renderHead} renderBody={renderBody} />
        </>
    );
}

export default RawCollectiblesTable