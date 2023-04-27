import React from 'react'
import MapShowingRawCollectibles from '../Map/MapShowingRawCollectibles';
import RawCollectiblesTable from '../Tables/RawCollectiblesTable/RawCollectiblesTable';
import { Caretaker } from './Undo/Caretaker';
import { TypeOfChange } from './Undo/Memento';
import { RawCollectible } from '../Data/CollectibleModels/RawCollectible';
import RawCollectiblesSaving from '../DataSaving/RawCollectiblesSaving';

/**
 * Props necessary for FoundResultsHandler component.
 */
export interface FoundResultsHandlerProps {
    /**
     * Array of raw collectibles as results, which were found by WikidataAPI as a result of a user-specified query.
     */
    results: RawCollectible[];
}

/**
 * Func rendering found results, what is represented as raw collectibles which were found by WikidataAPI as a result of a user-specifified query.
 * Func contains two possible views on that results. Table view, which renders table containing records as results and Map view, where are displayed 
 * markers, which represents results.
 * In both of view user can edit name of result and also remove some results, which user does not want to save.
 * Func also contains "Undo" mechanism for turning back some actions. It represents "Originator" in memento pattern.
 * User in Table view can search and display results by name and type of (each raw collectible is instance of some types/class).
 * There is also saving mechanism (calling RawCollectibleSaving component), which saves raw collectibles, as user has modified them them.
 * Func contains impolementations of function, which handles and process editation and deletion of raw collectibles.
 * @param FoundResultsHandlerProps See FoundResultsHandlerProps descriptions. 
 * @returns JSX element rendering component, which serves for user to view,save and edit found raw collectibles.
 */
function FoundResultsHandler({ results }: FoundResultsHandlerProps) {
    // all found raw collectibles as results
    const [resultsData, setResultsData] = React.useState<RawCollectible[]>(results);
    // results, which will be render in Map or Table
    // helps to make name and syb-type filtering
    const [resultsToRender, setResultsToRender] = React.useState<RawCollectible[]>(results);
    enum View {
        Table,
        Map
    }
    const [viewType, setViewType] = React.useState<View>(View.Table);

    // result, which is actually edited by user
    const [edited, setEdited] = React.useState<RawCollectible | null>(null);
    // result,on which is actually watched details by user
    const [showedDetails, setShowedDetails] = React.useState<RawCollectible | null>(null)
    // filters values
    const [nameFilter, setNameFilter] = React.useState<string>('');
    const [subTypeFilter, setSubTypeFilter] = React.useState<string>('');
    // undo as memento pattern`s caretaker
    const [resultsStateCaretaker] = React.useState<Caretaker>(new Caretaker(results, 5));


    const handleEditResultSelection = (result: RawCollectible) => {
        setEdited(new RawCollectible(result.getObject()));
    }
    const handleCancle = () => {
        setEdited(null)
        setShowedDetails(null)
    }

    const setView = (view: View) => {
        setViewType(view);
    }
    const handleResultDeletion = (result: RawCollectible) => {
        setResultsData((prevData) =>
            prevData.filter((d, index) => {
                if (d.QNumber !== result.QNumber) {
                    return true;
                }
                resultsStateCaretaker.saveState(d, TypeOfChange.REMOVE, index);
                return false;
            })
        );
    }

    const handleNameChange = (event: any) => {
        const value = event.target.value;

        const change = {
            name: value,
        };
        setEdited((prev) => {
            if (prev != null) {
                let temp = new RawCollectible(prev.getObject());
                temp.name = change.name;
                return temp;
            }
            return null;

        });
    }
    const saveEditedResult = (edited: RawCollectible) => {
        setResultsData((data) => {
            return data.map((d, index) => {
                if (d.QNumber === edited.QNumber) {
                    resultsStateCaretaker.saveState(d, TypeOfChange.EDIT, index);
                    return edited;
                }
                return d;
            })
        })
        setEdited(null)
    }
    const handleResultsSearch = (event: any) => {
        const value = event.target.value;
        setNameFilter(value);
    }
    const handleResultSearchSubType = (event: any) => {
        const value = event.target.value;
        setSubTypeFilter(value);
    }
    const handleUndo = () => {
        setResultsData(resultsStateCaretaker.undoState());
    }

    const handleShowDetails = (result: RawCollectible) => {
        setShowedDetails(result);
    }
    // when results changes, it notifies caretaker
    React.useEffect(() => {
        resultsStateCaretaker.changeResults(resultsData);
    }, [resultsData, resultsStateCaretaker])

    // when some value of filter change, then it re-filters results again.
    React.useEffect(() => {
        setResultsToRender(resultsData);
        if (nameFilter !== '') {
            setResultsToRender((prev) => prev.filter((result) => result.name.toLocaleLowerCase().includes(nameFilter.toLocaleLowerCase())));
        }
        if (subTypeFilter !== '') {
            setResultsToRender((prev) => prev.filter((result) => result.instanceOF.join("").toLocaleLowerCase().includes(subTypeFilter.toLocaleLowerCase())));
        }

    }, [nameFilter, subTypeFilter, resultsData])

    return (
        <>
            <div className="btn-group dropend">
                <button type="button" className="btn btn-danger dropdown-toggle" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    View
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li className="dropdown-item" onClick={() => setView(View.Table)}>Table</li>
                    <li className="dropdown-item" onClick={() => setView(View.Map)}>Map</li>
                </ul>
            </div>

            <input type="text" className="form-control" placeholder={"Search for name"} onChange={handleResultsSearch} />
            <input type="text" className="form-control" placeholder={"Search for sub-type"} onChange={handleResultSearchSubType} />
            {resultsStateCaretaker.isUndoAvailable() ?
                (<button type='button' className='btn btn-info' onClick={handleUndo} >Undo</button>) :
                (<button type='button' className='btn btn-info' onClick={handleUndo} disabled>Undo</button>)}


            <RawCollectiblesSaving rawCollectibles={resultsData} />
            <h4>{resultsToRender.length} results</h4>
            {viewType === View.Table ? < RawCollectiblesTable records={resultsToRender} handleChange={handleNameChange} cancel={handleCancle} edited={edited} detailShowing={showedDetails} editItem={handleEditResultSelection} removeItem={handleResultDeletion} saveItem={saveEditedResult} showDetails={handleShowDetails} />
                : <MapShowingRawCollectibles rawCollectiblesToShow={resultsToRender} removeItem={handleResultDeletion} handleNameChange={handleNameChange} cancel={handleCancle} edited={edited} editItem={handleEditResultSelection} saveItem={saveEditedResult} />}
        </>
    );
}

export default FoundResultsHandler;