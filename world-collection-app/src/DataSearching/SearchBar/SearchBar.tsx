import React, { FormEvent, SyntheticEvent, useEffect, useRef, useState } from "react";
import { WikiDataAPI } from "../../API/WikiDataAPI";
import { SearchData } from "../../Data/SearchData/SearchData";
import RenderSearchInfo from "../RenderSearchInfo";


interface SearchBarProps{   
    placeHolder : string;
    handleClickedResult : (data : SearchData) => void;
    dataGetter : (searchWord : string) => Promise<SearchData[]>;
}
function SearchBar({placeHolder,handleClickedResult,dataGetter} : SearchBarProps) {
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
        setDisplay(true);
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

    useEffect(() => {
        if (searchWord.length < 3){
            return;
        }
        setLoading(true)
        setIsError(false);

        dataGetter(searchWord).then(
            (data) => {
                setLoading(false)
                setResults(data);
            }
        ).catch(() => setIsError(true))

    }, [searchWord]);
    return (
        <React.Fragment>
                <div className="search-bar-dropdown">
                    <input type="text" className="form-control" placeholder={placeHolder} value={barValue} onChange={handleChange} onClick={handleClick} />
                    <ul ref={searchTypeRef} id="searchedResults" className="list-group">
                        {loading && ( <button type="button" className="list-group-item list-group-item-action">{isError ? "Some error occurs, try later" : "Loading..."}</button>)}
                        {!loading && display && results.map((result,index) => {
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
                        })}     
                    </ul>   
                </div>
                
        </React.Fragment>
    )
}
export default SearchBar;