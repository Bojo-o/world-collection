import React from 'react'
import { Marker, Popup} from 'react-leaflet';
import { RawCollectible } from '../Data/CollectibleModels/RawCollectible';
import RawCollectibleInfoCard from './RawCollectibleInfoCard';

export interface WayPointProps {
    data: RawCollectible;
    removeItem : (item : RawCollectible) => void;
    edited : RawCollectible|null;
    editItem : (row : RawCollectible) => void;
    cancelItem : () => void;
    saveItem : (edited : RawCollectible) => void;
    handleChange : (event : any) => void;
    
}
function WayPoint({data,removeItem,edited,editItem,cancelItem,saveItem,handleChange} : WayPointProps){
    
    return (
        <>
            <Marker position={[data.latitude,data.longitude]}>
                <Popup>  
                    <div>
                        <RawCollectibleInfoCard rawCollectible={data} />   
                        { edited != null && edited.QNumber === data.QNumber ? (
                            <React.Fragment>
                                
                                <input type="text" className="form-control" value={edited.name} onChange={handleChange}/>
                                <button type="button" className="btn btn-success" onClick={() => saveItem(edited)}>Save</button>
                                <button type="button" className="btn btn-danger" onClick={() => cancelItem()}>Cancel</button>
                            </React.Fragment> 
                        ) : (
                            <React.Fragment>
                                <h3>Actions</h3>
                                <button type="button" className="btn btn-primary" onClick={() => editItem(data)}>Edit</button>
                                <button type="button" className="btn btn-danger" onClick={() => removeItem(data)}>Remove</button>
                            </React.Fragment> 
                        ) }
                    </div>                       
                </Popup>
            </Marker>
        </>
    )
}

export default WayPoint;