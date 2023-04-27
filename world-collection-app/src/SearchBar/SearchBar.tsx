import React, { FormEvent, useEffect, useRef, useState } from "react";
import { SearchData } from "../Data/DataModels/SearchData";
import RenderSearchResult from "./RenderSearchInfo";
import "./SearchBar.css";

/**
 * Props necessary for SearchBar.
 */
export interface SearchBarProps {
    /** Text writed in bar as place holder.*/
    placeHolderText: string;
    /**
     * Function handling user clicking on the certain result founded in searching.
     * Here is that function only invoked.
     * @param dataOfClickedResult Data of clicked result.
     */
    handleClickedResult: (dataOfClickedResult: SearchData) => void;
    /**
     * Specific implementation of func, which search for specific data.
     * @param searchWord Search word for searching process.
     * @returns Array of SearchData containing data of result, which were founded.
     */
    dataGetter: (searchWord: string) => Promise<SearchData[]>;
    /**  Support of blank searching,the user does not have to write anything.*/
    emptySearchingFlag: boolean;
}
/**
 * Func rendering search bar for searching certain data.
 * Into bar can user writes, after user typed search word, which is at least 3 characters long, it searches for data.
 * @param SearchBarProps See SearchBarProps description.
 * @returns JSX element rendering search bar.
 */
function SearchBar({ placeHolderText: placeHolder, handleClickedResult, dataGetter, emptySearchingFlag }: SearchBarProps) {
    const [results, setResults] = useState<SearchData[]>([]);
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [display, setDisplay] = useState(false);

    const [searchWord, setSearchWord] = useState("");
    const [barValue, setbarValue] = useState("");

    const searchTypeRef = useRef<HTMLUListElement>(null);

    const handleChange = (event: FormEvent<HTMLInputElement>) => {
        let input = event.currentTarget.value;
        setResults([])
        setSearchWord(input)
        setbarValue(input)
    }

    useEffect(() => {
        const closeSearchingBar = (event: any) => {
            if (searchTypeRef.current && !searchTypeRef.current.contains(event.target)) {
                setDisplay(false);
            }
        };

        document.body.addEventListener('mousedown', closeSearchingBar);

        return () => document.body.removeEventListener('mousedown', closeSearchingBar);
    }, []);
    /**
     * Fetches all data, search word is empty so it does not depend on it.
     */
    const handleShowAll = () => {
        fetchData("")
    }
    /**
     * Fetches data from dataGetter.
     * @param word Search word.
     */
    const fetchData = (word: string) => {
        setLoading(true)
        setIsError(false);

        dataGetter(word).then(
            (data) => {
                setLoading(false)
                setResults(data);
                setDisplay(true)
            }
        ).catch(() => setIsError(true))
    }
    // if search word changes and search word is at least 3 symbols long, then it fetches from API data
    useEffect(() => {
        setDisplay(false)
        if (searchWord.length < 3) {
            return;
        }
        fetchData(searchWord)
    }, [searchWord]);
    return (
        <>
            <div className="search-bar-dropdown">
                <div className="input-group flex-nowrap">
                    {emptySearchingFlag && (
                        <>
                            <span className="input-group-text" id="addon-wrapping">
                                <button type="button" className="btn btn-outline-info" onClick={handleShowAll}>Show all</button>
                            </span>
                        </>
                    )}

                    <input type="search" className="form-control mr-sm-2" placeholder={placeHolder} value={barValue} onChange={handleChange} aria-describedby="addon-wrapping" />
                </div>

                {loading && (
                    <ul ref={searchTypeRef} className="list-group searchedResults">
                        <button type="button" className="list-group-item list-group-item-action">{isError ? "Some error occurs, try later" :
                            <div className="spinner-border text-info" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        }</button>

                    </ul>
                )}
                {!loading && display && (
                    <>
                        <ul ref={searchTypeRef} className="list-group searchedResults">
                            {
                                results.map((result, index) => {
                                    return (
                                        <button
                                            type="button"
                                            key={index}
                                            className="list-group-item list-group-item-action"
                                            onClick={() => {
                                                handleClickedResult(result);
                                                setbarValue(result.name)
                                                setDisplay(false)
                                            }}>
                                            <RenderSearchResult result={result} />
                                        </button>
                                    );
                                })
                            }
                        </ul>
                    </>
                )}
            </div>

        </>
    )
}
export default SearchBar;