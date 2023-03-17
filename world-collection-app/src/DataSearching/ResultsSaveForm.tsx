import React,{useEffect, useState} from 'react';

export interface ResultsSaveFormProps{
    handleSave : (collectionName : string) => void;
    handleCancel : () => void;
}
function ResultsSaveFrom({handleSave,handleCancel} : ResultsSaveFormProps){
    const [collectionName,setCollectionName] = useState('');

    const handleChange = (event : any) => {
        const value = event.target.value;
        setCollectionName(value);
    }
    useEffect(() => {

    },[])
    return (
        <div>
            <form>
                <h3>Save collectibles into collection</h3>
                <div className='mb-3'>
                    <label htmlFor="collectionName" className="form-label">Collection name</label>
                    <input type="text" className="form-control" id="collectionName" aria-describedby="collectionNameHelp" minLength={3} onChange={handleChange}></input>
                    <div id="collectionNameHelp" className="form-text">Collection name must be at least 3 character long.</div>
                </div>
                {collectionName.length < 3 ? (
                    <button type="button" className="btn btn-primary" onClick={() => handleSave(collectionName)} disabled>Save</button>
                ) : (
                    <button type="button" className="btn btn-primary" onClick={() => handleSave(collectionName)}>Save</button>
                )}
                <button type="button" className="btn btn-primary" onClick={handleCancel}>Close</button>
            </form>    
        </div>
    );
}

export default ResultsSaveFrom;