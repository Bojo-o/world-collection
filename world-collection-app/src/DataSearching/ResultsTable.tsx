import React from "react";
import { ResultData } from "../Data/ResultsData";
import ResultsTableFooter from "./ResultsTableFooter";

function countPages(results: number,rowsPerPage : number) : number {
    return Math.ceil(results / rowsPerPage);
}

export interface ResultsTableProps{
    results : ResultData[];
    edited : ResultData;
    removeItem : (qNumber : string) => void;
    editItem : (row : ResultData) => void;
    cancelItem : () => void;
    saveItem : (edited : ResultData) => void;
    handleChange : (event : any) => void;
}

function ResultsTable ({results,edited,editItem,handleChange, cancelItem,removeItem,saveItem} : ResultsTableProps) {
    //const [data,setData] = React.useState<ResultData[]>(results);
    //const [edited,setEdited] = React.useState<ResultData>(new ResultData);

    const [rowsPerPage,setRowsPerPage] = React.useState(25);
    const [pages,setPages] = React.useState(countPages(results.length,rowsPerPage));
    const [resultsCount, setResultsCount] = React.useState(results.length);
    const [currPage,setCurrPage] = React.useState(1);

    React.useEffect(() => {
        let newPages = countPages(results.length,rowsPerPage);
        setResultsCount(results.length);
        setPages(newPages)
        if (currPage > newPages){
            setCurrPage((prev) => prev === 1 ? 0 : newPages)
        }
    },[results,rowsPerPage])

    const nextPage = () => {
        if (currPage !== pages){
            setCurrPage((prev)=> prev + 1);
        }
    }
    const prevPage = () => {
        if (currPage !== 1){
            setCurrPage((prev)=> prev - 1);
        }
    }
    const lastPage = () => {
        setCurrPage(pages);
    }
    const firstPage = () => {
        setCurrPage(1);
    }
    const setRecordsPerPage = (value : number) => {
        setRowsPerPage(value);
    }
    
    
    return (
        <React.Fragment>
        <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Sub-Type of</th>
                </tr>
            </thead>

            <tbody>
                {
                    

                    results.slice(currPage * rowsPerPage - rowsPerPage,currPage * rowsPerPage).map((row,index) => {
                        return (
                            <tr key={index}>
                                <th scope="row">{currPage * rowsPerPage - rowsPerPage + index + 1}</th>
                                
                                {edited.QNumber === row.QNumber && 
                                    (
                                        <React.Fragment>
                                            <td><input type="text" className="form-control" value={edited.name} onChange={handleChange}/></td>
                                            <td>{row.instanceOf.replaceAll("/"," , ")}</td>
                                            <td><button type="button" className="btn btn-success" onClick={() =>  saveItem(edited)}>Save</button></td>
                                            <td><button key={index} type="button" className="btn btn-danger" onClick={cancelItem}>Cancel</button></td>
                                        </React.Fragment>
                                    )
                                }
                                {edited.QNumber !== row.QNumber && 
                                    (
                                        <React.Fragment>
                                            <td>{row.name}</td>
                                            <td>{row.instanceOf.replaceAll("/"," , ")}</td>
                                            <td><button type="button" className="btn btn-primary" onClick={() => editItem(row)}>Edit</button></td>
                                            <td><button key={index} type="button" className="btn btn-danger" onClick={() => removeItem(row.QNumber)}>Remove</button></td>
                                        </React.Fragment>    
                                    )
                                }                               
                            </tr>
                        );
                    })
                }
            </tbody>
        </table>
        <ResultsTableFooter nextPage={nextPage} prevPage={prevPage} firstPage={firstPage} lastPage={lastPage} setRowsPerPage={setRecordsPerPage} pages={pages} currPage={currPage}/>     
        </React.Fragment>
    );
}

export default ResultsTable