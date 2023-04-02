import React from "react";
import { RawCollectible } from "../Data/RawCollectible";
import Details from "../Details/Details";
import Table from "../Table/Table";
import TableFooter from "../Table/TableFooter";
import RawCollectibleInfoCard from "../Map/RawCollectibleInfoCard";

function countPages(results: number,rowsPerPage : number) : number {
    return results === 0 ? 1 : Math.ceil(results / rowsPerPage);
}

export interface ResultsTableProps{
    results : RawCollectible[];
    edited : RawCollectible;
    detailShowing : RawCollectible;
    removeItem : (item : RawCollectible) => void;
    editItem : (row : RawCollectible) => void;
    cancelItem : () => void;
    saveItem : (edited : RawCollectible) => void;
    handleChange : (event : any) => void;
    showDetails : (item : RawCollectible) => void;
}

function ResultsTable ({results,edited,editItem,handleChange, cancelItem,removeItem,saveItem,showDetails,detailShowing} : ResultsTableProps) {

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
                            <React.Fragment>
                                <tr key={index}>
                                <th scope="row">{currPage * rowsPerPage - rowsPerPage + index + 1}</th>
                                
                                {edited.QNumber === row.QNumber && 
                                    (
                                        <React.Fragment>
                                            <td><input type="text" className="form-control" value={edited.name} onChange={handleChange}/></td>
                                            <td>
                                                <div className="d-flex flex-wrap">
                                                    {row.subTypeOf.split('/').map((subType,index) => {
                                                        return (
                                                            <>
                                                                <span key={index} className="badge bg-primary">{subType}</span>
                                                            </>
                                                        )
                                                    })}
                                                </div>
                                            </td>

                                            <td className="d-flex flex-row justify-content-center">
                                                <button type="button" className="btn btn-success" onClick={() =>  saveItem(edited)}>Save</button>
                                                <button key={index} type="button" className="btn btn-danger" onClick={cancelItem}>Cancel</button>
                                            </td>
                                            
                                        </React.Fragment>
                                    )
                                }
                                {edited.QNumber !== row.QNumber && 
                                    (
                                        <React.Fragment>
                                            <td>{row.name}</td>
                                            <td>
                                                <div className="d-flex flex-wrap">
                                                    {row.subTypeOf.split('/').map((subType,index) => {
                                                        return (
                                                            <>
                                                                <span key={index} className="badge bg-primary">{subType}</span>
                                                            </>
                                                        )
                                                    })}
                                                </div>
                                            </td>
                                            {detailShowing.QNumber !== row.QNumber ? 
                                            (
                                                <React.Fragment>    
                                                    <td className="d-flex flex-row justify-content-center">
                                                        <button type="button" className="btn btn-info" onClick={() => showDetails(row)}>Details</button>
                                                        <button type="button" className="btn btn-primary" onClick={() => editItem(row)}>Edit</button>
                                                        <button key={index} type="button" className="btn btn-danger" onClick={() => removeItem(row)}>Remove</button>
                                                    </td>
                                                    
                                                </React.Fragment>    
                                            )
                                            :
                                            (
                                                <React.Fragment>    
                                                    <td className="d-flex flex-row justify-content-center">
                                                        <button key={index} type="button" className="btn btn-danger" onClick={cancelItem}>Cancel</button>
                                                    </td>                                                   
                                                </React.Fragment>   
                                            )
                                            }
                                            
                                        </React.Fragment>    
                                    )
                                }                               
                            </tr>
                            {detailShowing.QNumber === row.QNumber && (
                                <tr>
                                    <th colSpan={4}>
                                        <div className="d-flex flex justify-content-center">
                                            <RawCollectibleInfoCard rawCollectible={row} />
                                        </div>
                                        {/*<Details QNumber={row.QNumber} name={row.name} type={row.subTypeOf} />*/}
                                    </th>
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
            <Table rowsCount={results.length} renderHead={renderHead} renderBody={renderBody} />
        </>
    );
}

export default ResultsTable