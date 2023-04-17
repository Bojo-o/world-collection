import { ReactNode, useEffect, useState } from "react";
import TableFooter from "./TableFooter";

function countPages(results: number,rowsPerPage : number) : number {
    return results === 0 ? 1 : Math.ceil(results / rowsPerPage);
}

export interface TableProps{
    rowsCount : number
    renderHead : () => ReactNode;
    renderBody : (currPage : number,rowsPerPage : number) => ReactNode;
}
function Table ({rowsCount,renderHead,renderBody} : TableProps){
    const [rowsPerPage,setRowsPerPage] = useState(25);
    const [pages,setPages] = useState(countPages(rowsCount,rowsPerPage));
    const [currPage,setCurrPage] = useState(1);

    
    useEffect(() => {
        let newPages = countPages(rowsCount,rowsPerPage);
        setPages(newPages)
        if (currPage > newPages){
            setCurrPage((prev) => prev === 1 ? 0 : newPages)
        }
    },[rowsPerPage])

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
        <>
        <div className="table-wrapper">
            <table className="table table-light table-bordered table-striped table-hover">
                <thead>
                    <tr className="table-dark">
                        {renderHead()}
                    </tr>
                </thead>
                    
                <tbody>
                    {renderBody(currPage,rowsPerPage)}
                </tbody>
            </table>
        </div>
        
        <TableFooter nextPage={nextPage} prevPage={prevPage} firstPage={firstPage} lastPage={lastPage} setRowsPerPage={setRecordsPerPage} pages={pages} currPage={currPage}/>   
        </>
    );
}
export default Table