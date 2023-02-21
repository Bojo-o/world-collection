import { useEffect, useState } from "react";
import { Collection } from "../Data/Database/Colection";
import { DatabaseAPI } from "../DatabaseGateway/DatabaseAPI";
import EditationTable from "../Editation/EditationTable";

function Editation(){
    const [collectionsLoading,setCollectionsLoading] = useState<boolean>(false);
    const [collections,setCollections] = useState<Collection[]>([]); 
    const [edited,setEdited] = useState<Collection>(new Collection);
    const [filter,setfilter] = useState<string>('');

    const [canSaveCollection,setCanSaveCollection] = useState(false);

    const handleSearch = (event : any) => {
        const value = event.target.value;
        setfilter(value);  
    }
    useEffect(() => {
        fetchCollections()
    },[])
    const fetchCollections = () => {
        setCollectionsLoading(true);
        DatabaseAPI.getCollections().then( (collections) => {
            setCollectionsLoading(false);
            setCollections(collections);            
        }        
        );
    }

    const editItem = (row : Collection) => {  
        setEdited(new Collection(row));   
    }
    const cancelEditation= () => {
        setEdited(new Collection) 
    }
    const handleChange = (event : any) => {
        const value : string = event.target.value;
        
        const change = {
            name: value,
        };
        setEdited((prev) => {
            return new Collection({...prev,...change});
        });

        DatabaseAPI.askIfExistsCollections(value).then((r) => {
            if (value.length > 2){
                setCanSaveCollection(!r)
            }else{
                setCanSaveCollection(false)
            }
        })
        
    }
    const saveItem = (edited : Collection) => {
        
        DatabaseAPI.postCollectionUpdateRename(edited.collectionID,edited.name)
        cancelEditation();
        fetchCollections();
    }
    return (
        <>
            <h2>Edit your collections and collectibles</h2>
            {collectionsLoading ? (
                <h3>Loading..</h3>
            ) : (
                <>
                <input className="form-control mr-sm-2" type="search" placeholder="Search for collection" onChange={handleSearch} />
                <h3>Collections:</h3>
                <EditationTable collections={collections.filter((result) => result.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))} edited={edited}
                editItem={editItem} cancelEditation={cancelEditation} handleChange={handleChange} saveItem={saveItem} canSaveItem={canSaveCollection}/>
                </>
            )}
        </>
    )
}
export default Editation;