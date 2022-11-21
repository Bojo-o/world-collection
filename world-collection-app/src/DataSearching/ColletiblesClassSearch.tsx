import React, { FormEvent, SyntheticEvent } from "react";
import { SearchAPI } from "./SearchAPI";

interface CollectiblesClassSearcherProps{
    inputChange : () => void;
}
function CollectiblesClassSearcher() {
    const [options, setOptions] = React.useState(["a","b"]);
    const [loading, setLoading] = React.useState(true);
    const handleChange = (event : FormEvent<HTMLInputElement>) => {
        let input = event.currentTarget.value;

        if (input.length < 3){
            return;
        }
        
        //let data = SearchAPI.get("cave");
        //console.log(data);
        setLoading(false);
    }
    return (
        <React.Fragment>
            <input type="text" name="classSearch" placeholder="Search type of collectibles" onChange={handleChange}/>
            <ul>
                {loading && (
                    <div className="row">
                        <button 
                        type="button"
                        >
                        Loading..
                        </button>
                    </div>
                )}
                {options.map((option,index) => {
                    return (
                        <button 
                        type="button"
                        key={index}>
                        {option}
                        </button>
                    );
                })}    
            </ul>
        </React.Fragment>
    )
}
export default CollectiblesClassSearcher;