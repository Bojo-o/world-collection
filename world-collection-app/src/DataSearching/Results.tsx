import React from 'react'
import MapShowingRawCollectibles from '../Map/MapShowingRawCollectibles';
import RawCollectiblesTable from '../Tables/RawCollectiblesTable/RawCollectiblesTable';
import { Caretaker } from './Undo/Caretaker';
import { TypeOfChange } from './Undo/ResultState';
import { RawCollectible } from '../Data/CollectibleModels/RawCollectible';
import RawCollectiblesSaving from '../DataSaving/RawCollectiblesSaving';

export interface ResultProps{
    data : RawCollectible[];
}
enum View {
    Table,
    Map,
}

function Result({data} : ResultProps) {
    //const [resultDataaa,setResultDataaa]  = React.useState<ResultData[]>(data);
    const [resultData,setResultData]  = React.useState<RawCollectible[]>(data);
    const [resultsToRender,setResultsToRender] = React.useState<RawCollectible[]>(data);
    const [viewType,setViewType] = React.useState<View>(View.Table);

    const [edited,setEdited] = React.useState<RawCollectible|null>(null);
    const [showedDetails,setShowedDetails] = React.useState<RawCollectible|null>(null)

    const [nameFilter,setNameFilter] = React.useState<string>('');
    const [subTypeFilter,setSubTypeFilter] = React.useState<string>('');

    const [resultsStateCaretaker,setResultsStateCaretaker] = React.useState<Caretaker>(new Caretaker(data,5));

    //const [saveProcess,setSaveProcess] = React.useState(false);

    const editItem = (row : RawCollectible) => {
        setEdited(new RawCollectible(row.getObject()));     
    }
    const cancelItem = () => {
        setEdited(null)
        setShowedDetails(null)
    }

    const setView = (view : View) => {
        setViewType(view);
    }
    const removeItem = (item : RawCollectible) => {  
        setResultData((prevData) =>    
            prevData.filter((result,index) => {
                if (result.QNumber != item.QNumber){
                    return true;
                }
                resultsStateCaretaker.saveState(result,TypeOfChange.REMOVE,index);
                return false;
            })
        );}
        
    const handleChange = (event : any) => {
        const value = event.target.value;
        
        const change = {
            name: value,
        };
        setEdited((prev) => {
            if (prev != null){
                let temp = new RawCollectible(prev.getObject());
                temp.name = change.name;
                return temp;
            }
            return null;
            
        });
    }
    const saveItem = (edited : RawCollectible) => {
        
        setResultData((data) => {
            return data.map((d,index) => {
                if (d.QNumber === edited.QNumber){
                    resultsStateCaretaker.saveState(d,TypeOfChange.EDIT,index);
                    return edited;
                }
                return d;
            })
        })
        //resultsStateCaretaker.saveState(edited,TypeOfChange.EDIT);
        setEdited(null)
    }
    const handleResultsSearch = (event : any) => {
        const value = event.target.value;
        setNameFilter(value);  
    }
    const handleResultSearchSubType = (event : any) => {
        const value = event.target.value;
        setSubTypeFilter(value);
    } 
    const handleUndo = () =>{
        setResultData(resultsStateCaretaker.undoState());       
    }

    const showDetails = (item : RawCollectible) => {
        setShowedDetails(item);  
    }


    React.useEffect(() => {
        resultsStateCaretaker.changeResults(resultData);
    },[resultData])

    React.useEffect(() =>{
        setResultsToRender(resultData);
        if (nameFilter !== ''){
            setResultsToRender((prev) => prev.filter((result) => result.name.toLocaleLowerCase().includes(nameFilter.toLocaleLowerCase())));
        }
        if (subTypeFilter !== ''){
            setResultsToRender((prev) => prev.filter((result) => result.instanceOF.join("").toLocaleLowerCase().includes(subTypeFilter.toLocaleLowerCase())));
        }
        
    },[nameFilter,subTypeFilter,resultData])
    return (
        <React.Fragment>
            
            <div className="btn-group dropend">
                <button type="button" className="btn btn-danger dropdown-toggle"  id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    View
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li><a className="dropdown-item" onClick={() => setView(View.Table)}>Table</a></li>
                    <li><a className="dropdown-item" onClick={() => setView(View.Map)}>Map</a></li>                    
                </ul>         
            </div>
            <input type="text" className="form-control" placeholder={"Search for name"} onChange={handleResultsSearch}/>
            <input type="text" className="form-control" placeholder={"Search for sub-type"} onChange={handleResultSearchSubType}/>
            {resultsStateCaretaker.isUndoAvailable() ? 
                ( <button type='button' className='btn btn-info' onClick={handleUndo} >Undo</button>) :
                ( <button type='button' className='btn btn-info' onClick={handleUndo} disabled>Undo</button>)}

            
            <RawCollectiblesSaving rawCollectibles={resultData} />
            <h4>{resultsToRender.length} results</h4>
            {viewType === View.Table ? < RawCollectiblesTable records={resultsToRender} handleChange={handleChange} cancelItem={cancelItem} edited={edited}  detailShowing={showedDetails} editItem={editItem} removeItem={removeItem} saveItem={saveItem} showDetails={showDetails}/>
            : <MapShowingRawCollectibles rawCollectiblesToShow={resultsToRender} removeItem={removeItem}  handleNameChange={handleChange} cancelItem={cancelItem} edited={edited}  editItem={editItem} saveItem={saveItem}/>}     
        </React.Fragment>
    );
}

export default Result;