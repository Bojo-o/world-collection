import React from 'react'
import { Marker, Popup } from 'react-leaflet';
import { RawCollectible } from '../../../Data/CollectibleModels/RawCollectible';
import RawCollectibleCard from './RawCollectibleCard';

/**
 * rops neccesary for RawCollectibleMarker.
 */
export interface RawCollectibleMarkerProps {
    /** Raw colelctible, which represents marker. */
    rawCollectible: RawCollectible;
    /** Func for removing raw colletible.*/
    removeItem: (item: RawCollectible) => void;
    /** Raw collectible, which is actually edited by user. */
    edited: RawCollectible | null;
    /** Func for start editing raw collectible. */
    editItem: (item: RawCollectible) => void;
    /** Func for cancel action. In this it means stop editing some raw collectible or cancel saving process. */
    cancelItem: () => void;
    /** Func for saving collectible editation. */
    saveItem: (item: RawCollectible) => void;
    /** Func for handling and propagating change of name. */
    handleNameChange: (event: any) => void;
}
/**
 * Func rendering raw collectible marker into map.
 * It also renders card contaiing raw collectible data such as image, name, description , collectible`s details.
 * It contains mechanism for user to edit or remove raw collectible, because this fucn is called in part when user choosing, which raw collectibles user wants to collect.
 * So it should contains possiblility to edit collectible before saving into database.
 * @param RawCollectibleMarkerProps See RawCollectibleMarkerProps details.
 * @returns JSX element rendering raw collectible marker, which if was clicked by user it also will render collectible card.
 */
function RawCollectibleMarker({ rawCollectible, removeItem, edited, editItem, cancelItem, saveItem, handleNameChange: handleChange }: RawCollectibleMarkerProps) {
    return (
        <>
            <Marker position={[rawCollectible.latitude, rawCollectible.longitude]}>
                <Popup>
                    <div>
                        <RawCollectibleCard rawCollectible={rawCollectible} />
                        {edited != null && edited.QNumber === rawCollectible.QNumber ? (
                            <React.Fragment>

                                <input type="text" className="form-control" value={edited.name} onChange={handleChange} />
                                <button type="button" className="btn btn-success" onClick={() => saveItem(edited)}>Save</button>
                                <button type="button" className="btn btn-danger" onClick={() => cancelItem()}>Cancel</button>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <h3>Actions</h3>
                                <button type="button" className="btn btn-primary" onClick={() => editItem(rawCollectible)}>Edit</button>
                                <button type="button" className="btn btn-danger" onClick={() => removeItem(rawCollectible)}>Remove</button>
                            </React.Fragment>
                        )}
                    </div>
                </Popup>
            </Marker>
        </>
    )
}

export default RawCollectibleMarker;