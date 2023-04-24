import React, { FormEvent, SyntheticEvent, useEffect, useRef, useState } from "react";
import { WikiDataAPI } from "../../API/WikiDataAPI";
import { SearchData } from "../../Data/DataModels/SearchData";
import RenderSearchInfo from "../RenderSearchInfo";
import "./SearchBar.css";

interface SearchBarProps{   
    placeHolder : string;
    handleClickedResult : (data : SearchData) => void;
    dataGetter : (searchWord : string) => Promise<SearchData[]>;
    emptySearchingFlag : boolean;
}
function SearchBar({placeHolder,handleClickedResult,dataGetter,emptySearchingFlag} : SearchBarProps) {
    const [results, setResults] = useState<SearchData[]>([]);
    const [loading, setLoading] = useState(false);
    const [isError,setIsError] = useState(false);
    const [display, setDisplay] = useState(false);
    const [searchWord, setSearchWord] = useState("");

    const [barValue,setbarValue] = useState("");

    const searchTypeRef = useRef<HTMLUListElement>(null);

    const handleChange = (event : FormEvent<HTMLInputElement>) => {
        let input = event.currentTarget.value;
        setResults([])
        setSearchWord(input) 
        setbarValue(input)      
    }

    const handleClick = (event : FormEvent<HTMLInputElement>) => {
        //setDisplay(true);
    }

    useEffect(() => {
        const closeSearchingBar = (event : any) => {
            if(searchTypeRef.current && !searchTypeRef.current.contains(event.target)){
                setDisplay(false);
            }
        };

        document.body.addEventListener('mousedown', closeSearchingBar);

        return () => document.body.removeEventListener('mousedown', closeSearchingBar);
    }, []);
    const handleShowAll = () => {
        fetchData("")
    }
    const fetchData = (word : string) => {
        setLoading(true)
        setIsError(false);

        dataGetter(word).then(
            (data) => {
                console.log(data)
                setLoading(false)
                setResults(data);
                setDisplay(true)
            }
        ).catch(() => setIsError(true))
    }
    useEffect(() => {
        setDisplay(false)
        if (searchWord.length < 3){
            return;
        }
        fetchData(searchWord)
    }, [searchWord]);
    return (
        <React.Fragment>
                <div className="search-bar-dropdown">
                    <div className="input-group flex-nowrap">
                        {emptySearchingFlag && (
                            <>
                                <span className="input-group-text" id="addon-wrapping">
                                    <button type="button" className="btn btn-outline-info" onClick={handleShowAll}>Show all</button>
                                </span>
                            </>
                        )}
                        
                        <input type="search" className="form-control mr-sm-2" placeholder={placeHolder} value={barValue} onChange={handleChange} onClick={handleClick}  aria-describedby="addon-wrapping"/>
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
                                    results.map((result,index) => {
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
                                            <RenderSearchInfo result={result}/>
                                            </button>
                                        );
                                    })
                                }
                                </ul>
                            </>
                        )}     
                </div>
                
        </React.Fragment>
    )
}
export default SearchBar;