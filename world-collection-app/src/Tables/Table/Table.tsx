import { ReactNode, useEffect, useState } from "react";
import TableFooter from "./TableFooter";

/**
 * Props necessary for Table.
 */
export interface TableProps{
    /**Number of records, which will be cointained in the table.It is needed for paging*/
    recordsCount : number
    /**
     * Custom implemented header of table.
     * @returns React node, which renders head of table.
     */
    renderHead : () => ReactNode;
    /**
     * Custom implemended body of table.
     * @param currPage In body you may need information about current page.
     * @param rowsPerPage In body you may need information about value how many rows are displayed per page.
     * @returns React node, whichrenders body of table.
     */
    renderBody : (currPage : number,rowsPerPage : number) => ReactNode;
}
/**
 * Wrapping func, which renders table and adds table footer for handling paging under the table.
 * @param  TableProps See TableProps description.
 * @returns 
 */
function Table ({recordsCount: rowsCount,renderHead,renderBody} : TableProps){
    const computeNumberOfPages = (rows: number,rowsPerPage : number) => {
        return (rows === 0 ) ? 1 : Math.ceil(rows / rowsPerPage);
    }
    const [recordsPerPage,setRecordsPerPage] = useState(25);
    const [numberOfPages,setNumberOfPages] = useState(computeNumberOfPages(rowsCount,recordsPerPage));
    const [currPage,setCurrPage] = useState(1);

    // when rows per page changes, it computes a new number of pages and current page.
    useEffect(() => {
        let newNumberOfPages = computeNumberOfPages(rowsCount,recordsPerPage);
        setNumberOfPages(newNumberOfPages)
        if (currPage > newNumberOfPages){
            setCurrPage((prev) => prev === 1 ? 0 : newNumberOfPages)
        }
    },[recordsPerPage])

    const handleNextPage = () => {
        if (currPage !== numberOfPages){
            setCurrPage((prev)=> prev + 1);
        }
    }
    const handlePrevPage = () => {
        if (currPage !== 1){
            setCurrPage((prev)=> prev - 1);
        }
    }
    const handleLastPage = () => {
        setCurrPage(numberOfPages);
    }
    const handleFirstPage = () => {
        setCurrPage(1);
    }
    const handleSettingRecordsPerPage = (value : number) => {
        setRecordsPerPage(value);
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
                    {renderBody(currPage,recordsPerPage)}
                </tbody>
            </table>
        </div>
        
        <TableFooter nextPage={handleNextPage} prevPage={handlePrevPage} firstPage={handleFirstPage} lastPage={handleLastPage} setRowsPerPage={handleSettingRecordsPerPage} pages={numberOfPages} currPage={currPage}/>   
        </>
    );
}
export default Table