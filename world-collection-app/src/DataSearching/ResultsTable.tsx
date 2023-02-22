import React from "react";
import { ResultData } from "../Data/ResultsData";
import Details from "../Details/Details";
import Table from "../Table/Table";
import TableFooter from "../Table/TableFooter";

function countPages(results: number,rowsPerPage : number) : number {
    return results === 0 ? 1 : Math.ceil(results / rowsPerPage);
}

export interface ResultsTableProps{
    results : ResultData[];
    edited : ResultData;
    detailShowing : ResultData;
    removeItem : (item : ResultData) => void;
    editItem : (row : ResultData) => void;
    cancelItem : () => void;
    saveItem : (edited : ResultData) => void;
    handleChange : (event : any) => void;
    showDetails : (item : ResultData) => void;
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
                                            <td>{row.instanceOf.replaceAll("/"," , ")}</td>

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
                                            <td>{row.instanceOf.replaceAll("/"," , ")}</td>
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
                                        <Details QNumber={row.QNumber} name={row.name} type={row.instanceOf} />
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