import { useEffect, useState } from "react";
import { json } from "stream/consumers";
import { WikiDataAPI } from "../../../API/WikiDataAPI";
import { AppliedFilterData } from "../../../Data/FilterModels/AppliedFilterData";
import { DataTypeOfFilter, FilterIdentificationData } from "../../../Data/FilterModels/FilterIdentificationData";
import { Entity } from "../../../Data/DataModels/Entity";
import './FiltersSelection.css';
import ItemFilter from "./ItemFilter";
import QuantityFilter from "./QuantityFilter";
import TimeFilter from "./TimeFilter";
import { useMediaQuery } from "react-responsive";

/**
 * Props necessary for FiltersSelection component.
 */
export interface FiltersSelectionProps {
    /** Super class, which defines super parent of all searching collectibles. It will fetch filters, which are recomended (make a sense) for this class. */
    superClass: Entity;
    /** Func for handling going to the next step in search collectibles process.*/
    handleNext: (appliedFilters: AppliedFilterData[]) => void;
    /** Filter, which have already been applied. */
    usedFilters: AppliedFilterData[];
    /** Notify parent component that the user want to change applied filters. The user want to remove some applied filter. */
    handleUsedFiltersChange: (filters: AppliedFilterData[]) => void;
    /** Func for handling going one step back in search collectible process. */
    handleBack: () => void;
}


/**
 * Func rendering UI for viewing all or recomended filters (fetches from Wikidata API) for provided super class.
 * Choosing some filter from the list and then setting filter value.
 * Managing applied filters. The user can remove applied filter from list.
 * @param FiltersSelectionProps See FiltersSelectionProps description.
 * @returns JSX element rendering UI for viewing filters for provided super class, choosing and setting filter values, managing applied filters.
 */
function FiltersSelection({ superClass: filtersForType, handleNext, usedFilters, handleUsedFiltersChange, handleBack }: FiltersSelectionProps) {
    /** Enum with values representing state of filter selection.
     * Filters => To view list of all/recomended filters.
     * UsedFilters => TO view and manage list of applied filters.
     * Filter => render UI for specific filter, where the user can sets filter value and adds it to the list of applied filters
     */
    enum FiltersState {
        Filters,
        UsedFilters,
        Filter
    }
    const [loadingFilters, setLoadingFilters] = useState(false);
    const [errorForFetchingFilters, setErrorForFetchingFilters] = useState(false);

    const [showingFilters, setShowingFilters] = useState<FilterIdentificationData[]>([]);

    const [recomendedFilters, setRecomendedFilters] = useState<FilterIdentificationData[]>([]);

    const [allFilters, setAllFilters] = useState<FilterIdentificationData[]>([]);
    const [loadingAllFilters, setLoadingAllFilters] = useState(false);
    const [errorForFetchingAllFilters, setErrorForFetchingAllFilters] = useState(false);

    const [selectedFilter, setSelectedFilter] = useState<FilterIdentificationData | null>(null);
    const [appliedFilters, setAppliedFilters] = useState<AppliedFilterData[]>(usedFilters);

    const [filterSearchWord, setFIlterSearchWord] = useState<string>("");

    const [filterState, setFilterState] = useState<FiltersState>(FiltersState.Filters)

    const isBigScreen = useMediaQuery({ query: '(min-width: 1024px)' })

    /**
     * Obtains specific color for specific type of value of filter.
     * @param type Type of value of filter.
     * @returns bootstrapt class name representing color.
     */
    const getColorByFilterType = (type: DataTypeOfFilter) => {
        if (type === DataTypeOfFilter.Quantity) {
            return "warning text-dark";
        }
        if (type === DataTypeOfFilter.Time) {
            return "success";
        }
        if (type === DataTypeOfFilter.WikibaseItem) {
            return "info text-dark";
        }
        return "secondary";
    }
    const handleShowingFilters = (filters: FilterIdentificationData[]) => {
        setShowingFilters(filters);
    }

    const handleAddFilterToAplied = (data: AppliedFilterData) => {
        setAppliedFilters([...appliedFilters, data])
        setSelectedFilter(null)
        setFilterState(FiltersState.UsedFilters);
    }
    const removeFilterFromApplied = (data: AppliedFilterData) => {
        setAppliedFilters((prev) => prev.filter((f) => f.getFilter().PNumber != data.getFilter().PNumber))
    }
    /**
     * Fetches and sets recomended filters from Wikidata API.
     */
    const fetchRecomendedFiltersData = () => {
        setLoadingFilters(true)
        setErrorForFetchingFilters(false);

        WikiDataAPI.searchForFilters(filtersForType.getQNumber()).then(
            (data) => {
                setLoadingFilters(false);
                setRecomendedFilters(data);
                setShowingFilters(data);
            }
        ).catch(() => setErrorForFetchingFilters(true))
    }
    /**
     * Fetches and sets all filters from Wikidata API.
     */
    const fetchAllFiltersData = () => {
        setLoadingAllFilters(true)
        setErrorForFetchingAllFilters(false);

        WikiDataAPI.searchForFilters().then(
            (data) => {
                setLoadingAllFilters(false);
                setAllFilters(data);
            }
        ).catch(() => setErrorForFetchingAllFilters(true))
    }
    const handleFilterSelection = (filter: FilterIdentificationData) => {
        setSelectedFilter(filter);
        setFilterState(FiltersState.Filter);
    }
    const handleFiltersSearch = (e: any) => {
        setFIlterSearchWord(e.target.value);
    }
    /** Invokes func provided from parent component to move to the next step of search collectible process. */
    const saveAndContinue = () => {
        handleNext(appliedFilters)
    }
    useEffect(() => {
        fetchRecomendedFiltersData()
        fetchAllFiltersData()
    }, [])

    useEffect(() => {
        handleUsedFiltersChange(appliedFilters)
    }, [appliedFilters])
    /**
     * Renders UI containg list of filters with filter description (the user can switch between viewing all or recomnded filters).
     * @returns JSX element.
     */
    const renderFilters = () => {
        return (
            <>
                <div className="border border-dark rounded" >
                    <div className="btn-group">
                        <button type="button" className="btn btn-info dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            Filters
                        </button>
                        <ul className="dropdown-menu">
                            <li><button className="dropdown-item" onClick={() => handleShowingFilters(recomendedFilters)}>Recomended Filters</button></li>
                            {loadingAllFilters ? (
                                <>
                                    <li>
                                        <button className="dropdown-item" disabled>All filters
                                            {
                                                <div className="spinner-border text-info" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            }
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <button className="dropdown-item" onClick={() => handleShowingFilters(allFilters)}>All filters</button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    <input className="form-control mr-sm-2" type="search" placeholder="Search for filter" onChange={handleFiltersSearch} />
                    <div className="list-group" id="filters">
                        {loadingFilters && (<>
                            <button type="button" className="list-group-item list-group-item-action">{errorForFetchingFilters ? "Some error occurs, try later" :
                                <div className="spinner-border text-info" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            }</button>
                        </>)}
                        {!loadingFilters && (
                            <>
                                {showingFilters.filter((filter) => {
                                    return filter.name.toLocaleLowerCase().includes(filterSearchWord.toLocaleLowerCase())
                                }).map((filter, index) => {
                                    return (
                                        <>

                                            <button key={index} type="button" className="list-group-item list-group-item-action" onClick={() => handleFilterSelection(filter)} >
                                                <div className="d-flex w-100 flex-wrap justify-content-between">
                                                    <h5 className="mb-1">{filter.name}</h5>
                                                    <small className={"badge bg-" + getColorByFilterType(filter.dataType) + " text-wrap"}>
                                                        {filter.dataType}
                                                    </small>
                                                </div>
                                                <p className="mb-1">{filter.description}</p>
                                            </button>
                                        </>

                                    )
                                })}
                            </>
                        )}
                    </div>
                </div>
            </>
        )
    }
    /**
     * Renders UI containg mechanism for setting filter value.
     * It calls specific filter UI component based on the data type of value of filter.
     * @returns JSX element.
     */
    const renderFilter = () => {
        return (
            <>
                <div className="m-2">
                    <button type="button" className="btn btn-danger" onClick={() => setFilterState(FiltersState.Filters)}>
                        Back to filters
                    </button>
                    {selectedFilter != null && (
                        <>
                            <h2>Applying {selectedFilter.dataType} filter for "{selectedFilter.name}" property</h2>
                            {selectedFilter.dataType == DataTypeOfFilter.Time && (<TimeFilter filterData={selectedFilter} handleAddFilterToAplied={handleAddFilterToAplied} />)}
                            {selectedFilter.dataType == DataTypeOfFilter.WikibaseItem && (<ItemFilter filterData={selectedFilter} handleAddFilterToAplied={handleAddFilterToAplied} />)}
                            {selectedFilter.dataType == DataTypeOfFilter.Quantity && (<QuantityFilter filterData={selectedFilter} handleAddFilterToAplied={handleAddFilterToAplied} />)}
                        </>
                    )}

                </div>
            </>
        )
    }
    /**
     * Renders UI with list of applied filters. Also contains mechanism for removing applied filters from that list.
     * @returns JSX element.
     */
    const renderUsedFilters = () => {
        return (
            <>
                <div className="border border-dark rounded">
                    <h3>Used filters :</h3>
                    <ul className="list-group" id="used-filters">
                        {appliedFilters.map((filter, index) => {
                            return (
                                <li key={index} className="list-group-item ">
                                    <div className={"d-flex flex-" + ((isBigScreen) ? "row" : "column") + " justify-content-between"}>
                                        <div >
                                            <h5 className="mb-1"> {filter.getFilter().name}</h5>
                                            <small className={"badge bg-" + getColorByFilterType(filter.getFilter().dataType) + " text-wrap "}>
                                                {filter.getFilter().dataType}
                                            </small>
                                            <p>{filter.getValueOfFilter().getString()}</p>
                                        </div>
                                        <div>
                                            <button type="button" className="btn btn-danger" onClick={() => removeFilterFromApplied(filter)}>Remove filter</button>
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </>
        )
    }
    return (
        <>
            <div className='d-flex flex-row  '>

                <div className='side-menu d-flex flex-column '>
                    <button type="button" className="btn btn-outline-light" onClick={handleBack}>
                        Back to area choosing
                    </button>

                    <button type="button" className="btn btn-outline-light" onClick={() => setFilterState(FiltersState.Filters)} >
                        Filters
                    </button>

                    <button type="button" className="btn btn-outline-light" onClick={() => setFilterState(FiltersState.UsedFilters)}>
                        Used Filters
                    </button>

                    <button type="button" className="btn btn-outline-success" onClick={saveAndContinue} >
                        Continue
                    </button>

                </div>

                <div className="w-100 filter-container">
                    {filterState == FiltersState.Filters && renderFilters()}
                    {filterState == FiltersState.UsedFilters && renderUsedFilters()}
                    {filterState == FiltersState.Filter && renderFilter()}
                </div>


            </div>
        </>
    )
}
export default FiltersSelection;