import React from 'react'
import { Marker, Popup} from 'react-leaflet';
import { ResultData } from '../Data/ResultsData';

export interface WayPointProps {
    data: ResultData;
    removeItem : (item : ResultData) => void;
    edited : ResultData;
    editItem : (row : ResultData) => void;
    cancelItem : () => void;
    saveItem : (edited : ResultData) => void;
    handleChange : (event : any) => void;
    
}
function WayPoint({data,removeItem,edited,editItem,cancelItem,saveItem,handleChange} : WayPointProps){
    return (
        <React.Fragment>
            <Marker position={[data.long,data.lati]}>
                <Popup>                    
                    
                    {edited.QNumber === data.QNumber ? (
                        <React.Fragment>
                            <input type="text" className="form-control" value={edited.name} onChange={handleChange}/>
                            <button type="button" className="btn btn-success" onClick={() => saveItem(edited)}>Save</button>
                            <button type="button" className="btn btn-danger" onClick={() => cancelItem}>Cancel</button>
                        </React.Fragment> 
                    ) : (
                        <React.Fragment>
                            {data.name}
                            <button type="button" className="btn btn-primary" onClick={() => editItem(data)}>Edit</button>
                            <button type="button" className="btn btn-danger" onClick={() => removeItem(data)}>Remove</button>
                        </React.Fragment> 
                    ) }
                    
                </Popup>
            </Marker>
        </React.Fragment>
    )
}

export default WayPoint;