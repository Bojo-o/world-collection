import { Areas } from "../../../../Data/Enums/Areas";

/**
 * Props necessary for CardForArea component.
 */
export interface CardForAreaProps{
    imgSrc : string
    title : string
    text : string
    areaType : Areas
    handleSelection : (areaType : Areas) => void;
}
/**
 * Func rendering bootstrap card element containg area information, which inform the user.
 * Also contains button to choosing this area type for search collectibles process.
 * @param CardForAreaProps See CardForAreaProps desciption.
 * @returns JSX element rendering card with information about area type.
 */
function CardForArea({imgSrc,title,text,areaType,handleSelection} : CardForAreaProps){
    return(
        <div className="card text-center m-3" >
                <img src={imgSrc} className="card-img-top" alt={title + "Image"} height={250}/>
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">{text}</p>
                    <button type="button" className="btn btn-primary " onClick={() => handleSelection(areaType)}>Use</button>
                </div>
        </div>
    )
}

export default CardForArea;