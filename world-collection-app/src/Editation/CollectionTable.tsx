import { useEffect, useState } from "react";
import { Collection } from "../Data/Database/Colection";
import Table from "../Table/Table";
import TableFooter from "../Table/TableFooter";
import IconsSelector from "../ImageIcons/IconsSelector";
import { DatabaseAPI } from "../DatabaseGateway/DatabaseAPI";

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
    editCollectibles : (row : Collection) => void;

}
function CollectionTable ({collections,edited,editItem,cancelEditation,removeItem,handleChange,saveItem,canSaveItem,merge,mergeItem,merging,editCollectibles} : EditationTableProps){
    const [selectedCollection,setSelectedCollection] = useState(-1)

    const [iconSetting,setIconSetting] = useState(false);

    const handleIconSetting = () =>{
        setIconSetting((prev) => !prev);
    }
    const handleCollectionSelection = (e : any) => {
        let value = e.target.value;
        setSelectedCollection(value)
    }
    useEffect(() => {
        setSelectedCollection(-1)
    },[merging,edited]) 

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

    const iconChange = (settedIcon : string) => {
        return  DatabaseAPI.postCollectiblesInCollectionUpdateIcon(edited.collectionID,settedIcon);
    }
    const renderBody = (currPage : number,rowsPerPage : number) => {
        return (
            <>
                {
            collections.slice(currPage * rowsPerPage - rowsPerPage,currPage * rowsPerPage).map((row,index) => {
            return (
                <>
                    <tr key={index}>
                       <th scope="row">{currPage * rowsPerPage - rowsPerPage + index + 1}</th>
                        {edited.collectionID !== row.collectionID && merging.collectionID !== row.collectionID  &&(
                            <>
                                <td>{row.name}</td>
                                <td>{row.GetCountOfCollectibles().toString()}</td>
                                <td>
                                    <div className="d-flex flex-row justify-content-center">
                                        <button type="button" className="btn btn-info" onClick={() => editCollectibles(row)}>Edit Collectibles</button>
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
                                        <div id="collectionNameHelp" className="form-text">{edited.name.length > 2 ? "That name has already used" : "Name must be at least 3 character long."}</div>
                                    )}
                                    
                                </td>
                                <td>{row.GetCountOfCollectibles().toString()}</td>
                                <td >
                                    <div className="d-flex flex-row justify-content-center">
                                        <button type="button" className="btn btn-secondary" onClick={handleIconSetting}>{(!iconSetting) ? "Set Icon for all collectibles" : "Cancel"}</button>
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
                        {edited.collectionID === row.collectionID && iconSetting && (
                            <>
                                <tr>
                                    <th colSpan={4}>
                                        <div className="d-flex flex justify-content-center">
                                            <IconsSelector handleChangeOfIcon={() => {}} iconChange={iconChange}/>
                                        </div>
                                    </th>
                                </tr>
                            </>
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
            <Table rowsCount={collections.length} renderHead={renderHead} renderBody={renderBody} />
        </>
    );
}
export default CollectionTable