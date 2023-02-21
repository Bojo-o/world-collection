import { useEffect, useState } from "react";
import { Collection } from "../Data/Database/Colection";
import TableFooter from "../DataSearching/TableFooter";

function countPages(results: number,rowsPerPage : number) : number {
    return results === 0 ? 1 : Math.ceil(results / rowsPerPage);
}

export interface EditationTableProps{
    collections : Collection[];
    edited : Collection;
    editItem: (row : Collection) => void;
    cancelEditation: () => void;
    removeItem: (row : Collection) => void;
    handleChange : (event : any) => void;
    saveItem : (edited : Collection) => void;
    canSaveItem : boolean;
    merge : (collectionID : Number,intoCollectionID : Number) => void;
    mergeItem : (row : Collection) => void;
    merging : Collection;
}
function EditationTable ({collections,edited,editItem,cancelEditation,removeItem,handleChange,saveItem,canSaveItem,merge,mergeItem,merging} : EditationTableProps){
    const [rowsPerPage,setRowsPerPage] = useState(25);
    const [pages,setPages] = useState(countPages(collections.length,rowsPerPage));
    const [currPage,setCurrPage] = useState(1);

    const [selectedCollection,setSelectedCollection] = useState(-1)

    useEffect(() => {
        let newPages = countPages(collections.length,rowsPerPage);
        setPages(newPages)
        if (currPage > newPages){
            setCurrPage((prev) => prev === 1 ? 0 : newPages)
        }
    },[collections,rowsPerPage])

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

    const handleCollectionSelection = (e : any) => {
        let value = e.target.value;
        setSelectedCollection(value)
    }
    useEffect(() => {
        setSelectedCollection(-1)
    },[merging,edited]) 

    return (
        <>
        <table className="table table-light table-bordered table-striped table-hover">
            <thead>
                <tr className="table-dark">
                    <th scope="col">#</th>
                    <th scope="col">Name of collection</th>
                    <th scope="col">#Collectibles</th>
                    <th scope="col"></th>
                </tr>
            </thead>
                
            <tbody>
                {
                     collections.slice(currPage * rowsPerPage - rowsPerPage,currPage * rowsPerPage).map((row,index) => {
                        return (
                            <>
                                <tr key={index}>
                                <th scope="row">{currPage * rowsPerPage - rowsPerPage + index + 1}</th>
                                
                                {edited.collectionID !== row.collectionID && merging.collectionID !== row.collectionID &&(
                                    <>
                                        <td>{row.name}</td>
                                        <td>{row.GetCountOfCollectibles().toString()}</td>
                                        <td>
                                            <div className="d-flex flex-row justify-content-center">
                                                <button type="button" className="btn btn-primary" onClick={() => editItem(row)}>Edit</button>
                                                <button type="button" className="btn btn-warning" onClick={() => mergeItem(row)}>Merge</button>
                                                <button key={index} type="button" className="btn btn-danger" onClick={() => removeItem(row)}>Remove</button>
                                            </div>
                                        </td>
                                    </>     
                                )}
                                {merging.collectionID === row.collectionID && (
                                    <>
                                        <td>{row.name}</td>
                                        <td>{row.GetCountOfCollectibles().toString()}</td>
                                        <td>
                                            <div className="d-flex flex-row justify-content-center">
                                                <p>Merge into collection:</p>
                                                <select className="form-select" onChange={handleCollectionSelection} >
                                                    {collections.map((item,index) => {
                                                        if (item.collectionID === row.collectionID){
                                                            return (<></>)
                                                        }
                                                        return (
                                                        <>
                                                            <option value={item.collectionID.toString()} key={index}>{item.name}</option>
                                                        </>
                                                        )
                                                    })}
                                                </select>
                                                <></>
                                                {selectedCollection === -1 ? (
                                                    <button type="button" className="btn btn-success" disabled onClick={() => merge(row.collectionID,0)}>Merge</button>
                                                ) : (
                                                    <button type="button" className="btn btn-success" onClick={() => merge(row.collectionID,selectedCollection)}>Merge</button>
                                                )}
                                                <button type="button" className="btn btn-danger" onClick={cancelEditation}>Cancle</button>
                                            </div>
                                        </td>
                                    </>
                                )}
                                {edited.collectionID === row.collectionID &&
                                (
                                    <>
                                        <td>
                                            
                                            <input type="text" className="form-control" aria-describedby="collectionNameHelp" value={edited.name} onChange={handleChange}/>
                                            {!canSaveItem && (
                                                <div id="collectionNameHelp" className="form-text">{edited.name.length > 2 ? "That name has already used" : "Mame must be at least 3 character long."}</div>
                                            )}
                                            
                                        </td>
                                        <td>{row.GetCountOfCollectibles().toString()}</td>
                                        <td >
                                            <div className="d-flex flex-row justify-content-center">
                                                {canSaveItem ? (
                                                    <button type="button" className="btn btn-success" onClick={() => saveItem(edited)}>Save</button>
                                                ) : (
                                                    <button type="button" className="btn btn-success"  disabled onClick={() => saveItem(edited)}>Save</button>
                                                )}
                                                
                                                <button type="button" className="btn btn-danger" onClick={cancelEditation}>Cancle</button>
                                            </div>
                                        </td>
                                    </>
                                )}
                                
                                </tr>
                            </>
                        );
                    })
                }
            </tbody>
        </table>
        <TableFooter nextPage={nextPage} prevPage={prevPage} firstPage={firstPage} lastPage={lastPage} setRowsPerPage={setRecordsPerPage} pages={pages} currPage={currPage}/>   
        </>
    );
}
export default EditationTable