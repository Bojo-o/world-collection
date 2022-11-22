import React, { FormEvent, SyntheticEvent } from "react";
import { CollectiblesBaseData } from "../Data/ColletiblesBaseData";
import RenderSearchInfo from "./RenderSearchInfo";
import { SearchAPI } from "./SearchAPI";


interface CollectiblesClassSearcherProps{
    inputChange : () => void;
}
function CollectiblesClassSearcher() {
    const [options, setOptions] = React.useState<CollectiblesBaseData[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [display, setDisplay] = React.useState(false);
    const [searchWord, setSearchWord] = React.useState("");

    const handleChange = (event : FormEvent<HTMLInputElement>) => {
        let input = event.currentTarget.value;
        setOptions([])
        
        if (input.length > 2){          
            setSearchWord(input)
        }              
    }

    const handleClick = (event : FormEvent<HTMLInputElement>) => {
        setDisplay(true);
    }

    React.useEffect(() => {
        setLoading(true)
        SearchAPI.get(searchWord).then((data) => {
            setLoading(false)
            setOptions(data);
        }).catch()
    }, [searchWord]);

    return (
        <React.Fragment>
                <div className="search-bar-dropdown">
                    <input type="text" className="form-control" placeholder="Search type of collectibles" onChange={handleChange} onClick={handleClick} />
                    <ul id="searchedResults" className="list-group">
                        {loading && ( <button type="button" className="list-group-item list-group-item-action">Loading...</button>)}
                        {!loading && display && options.map((option,index) => {
                            return (
                                <button    
                                type="button"                  
                                key={index}
                                className="list-group-item list-group-item-action">
                                <RenderSearchInfo colletible={option}/>
                                </button>
                            );
                        })}                        
                    </ul>      
                </div>
                
        </React.Fragment>
    )
}
export default CollectiblesClassSearcher;