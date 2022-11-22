import React, { FormEvent, SyntheticEvent } from "react";
import { CollectiblesBaseData } from "../Data/ColletiblesBaseData";
import { SearchAPI } from "./SearchAPI";

interface CollectiblesClassSearcherProps{
    inputChange : () => void;
}
function CollectiblesClassSearcher() {
    const [options, setOptions] = React.useState<CollectiblesBaseData[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [searchWord, setSearchWord] = React.useState("");
    const handleChange = (event : FormEvent<HTMLInputElement>) => {
        let input = event.currentTarget.value;
        setOptions([])
        
        if (input.length > 2){          
            setSearchWord(input)
        }              
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
                <ul>
                {options.map((option,index) => {
                    return (
                        <ol                       
                        key={index}>
                        {option.name} .. {option.desc}
                        </ol>
                    );
                })}
                </ul>    
            </ul>
        </React.Fragment>
    )
}
export default CollectiblesClassSearcher;