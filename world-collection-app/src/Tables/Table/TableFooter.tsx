import React from "react";

/**
 * Props necessary for Table footer.
 */
export interface TableFooterProps {
    /**Func handling going to next page. */
    nextPage: () => void;
    /**Func handling going to previous page. */
    prevPage: () => void;
    /** Func handling going to the first page. */
    firstPage: () => void;
    /** Func handling going to the last page. */
    lastPage: () => void;
    /** Func handling setting rows per page value. */
    setRowsPerPage: (value: number) => void;
    /** Current page in table. */
    currPage: number;
    /** Number of all pages in table. */
    pages: number;
}
/**
 * Helping function fo managing table paging asn setting rows per page value.
 * It renders table footer, where user can presses buttons, which invoke action involving paging.
 * @param  ResultsTableFooterProps See Props description.
 * @returns JSX element rendering table footer.
 */
function TableFooter({ nextPage, prevPage, firstPage, lastPage, setRowsPerPage, currPage, pages }: TableFooterProps) {
    return (
        <>
            <div className="d-flex flex-row justify-content-center">
                <button type="button" className="btn btn-outline-secondary" onClick={firstPage}>{"<<"}</button>
                <button type="button" className="btn btn-outline-secondary" onClick={prevPage}>prev</button>
                <p>{currPage} / {pages}</p>
                <button type="button" className="btn btn-outline-secondary" onClick={nextPage}>next</button>
                <button type="button" className="btn btn-outline-secondary" onClick={lastPage}>{">>"}</button>
                <select defaultValue={25} onChange={(e: any) => setRowsPerPage(e.target.value)}>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>
        </>
    );
}

export default TableFooter;