import React from "react";

export interface ResultsTableFooterProps {
    nextPage : () => void;
    prevPage : () => void;
    firstPage : () => void;
    lastPage : () => void;
    setRowsPerPage : (value : number) => void;
    currPage : number;
    pages : number;
}
function ResultsTableFooter({nextPage,prevPage,firstPage,lastPage,setRowsPerPage,currPage,pages} : ResultsTableFooterProps) {
    const first = "<<";
    const last = ">>"
    return (
        <React.Fragment>
            <div className="d-flex justify-content-center">
                <button type="button" className="btn btn-outline-secondary" onClick={firstPage}>{first}</button>
                <button type="button" className="btn btn-outline-secondary" onClick={prevPage}>prev</button>  
                <p>{currPage} / {pages}</p>
                <button type="button" className="btn btn-outline-secondary" onClick={nextPage}>next</button>  
                <button type="button" className="btn btn-outline-secondary" onClick={lastPage}>{last}</button>
                <select defaultValue={25} onChange={(e : any) => setRowsPerPage(e.target.value)}>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>
            
        </React.Fragment>     
    );     
}

export default ResultsTableFooter;