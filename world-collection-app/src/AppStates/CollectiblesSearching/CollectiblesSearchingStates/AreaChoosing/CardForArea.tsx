import { Areas } from "./Areas";

export interface CardForAreaProps{
    imgSrc : string
    title : string
    text : string
    areaType : Areas
    handleSelection : (areaType : Areas) => void;
}
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