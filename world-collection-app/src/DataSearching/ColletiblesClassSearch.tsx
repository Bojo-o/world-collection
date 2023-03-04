import React, { FormEvent, SyntheticEvent } from "react";
import { SearchData } from "../Data/SearchData/SearchData";
import RenderSearchInfo from "./RenderSearchInfo";
import { SearchAPI } from "./SearchAPI";

export enum TypeOfSearch {
    collectiblesCLass,
    administrativeArea,
}
interface SearcherBarProps{   
    setDataToQuery : (data : SearchData) => void;
    placeHolder : string;
    typeOfSearch : TypeOfSearch;
}
function SearcherBar({setDataToQuery: setCollectiblesClass,placeHolder, typeOfSearch} : SearcherBarProps) {
    const [options, setOptions] = React.useState<SearchData[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [display, setDisplay] = React.useState(false);
    const [searchWord, setSearchWord] = React.useState("");

    const searchTypeRef = React.useRef<HTMLUListElement>(null);

    const handleChange = (event : FormEvent<HTMLInputElement>) => {
        let input = event.currentTarget.value;
        setOptions([])
        
        setSearchWord(input)         
    }

    const handleClick = (event : FormEvent<HTMLInputElement>) => {
        setDisplay(true);
    }
    
    React.useEffect(() => {
        const closeSearchingBar = (event : any) => {
            if(searchTypeRef.current && !searchTypeRef.current.contains(event.target)){
                setDisplay(false);
            }
        };

        document.body.addEventListener('mousedown', closeSearchingBar);

        return () => document.body.removeEventListener('mousedown', closeSearchingBar);
    }, []);

    React.useEffect(() => {
        if (searchWord.length < 3){
            return;
        }
        setLoading(true)
        if (typeOfSearch === TypeOfSearch.collectiblesCLass){
            SearchAPI.getTypeOfCollectibles(searchWord).then((data) => { 
                setLoading(false)
                setOptions(data);
            }).catch()
        }
        if (typeOfSearch === TypeOfSearch.administrativeArea){
            SearchAPI.getAdministrativeArea(searchWord).then((data) => { 
                setLoading(false)
                setOptions(data);
            }).catch()
        }
        
    }, [searchWord]);

    return (
        <React.Fragment>
                <div className="search-bar-dropdown">
                    <input type="text" className="form-control" placeholder={placeHolder} onChange={handleChange} onClick={handleClick} />
                    <ul ref={searchTypeRef} id="searchedResults" className="list-group">
                        {loading && ( <button type="button" className="list-group-item list-group-item-action">Loading...</button>)}
                        {!loading && display && options.map((option,index) => {
                            return (
                                <button    
                                type="button"                  
                                key={index}
                                className="list-group-item list-group-item-action"
                                onClick={() => {
                                    setCollectiblesClass(option);                               
                                    setDisplay(false)                                   
                                }}>
                                <RenderSearchInfo result={option}/>
                                </button>
                            );
                        })}                        
                    </ul>   
                </div>
                
        </React.Fragment>
    )
}
export default SearcherBar;