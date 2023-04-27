import { Areas } from "../../../../Data/Enums/Areas";
import CardForArea from "./CardForArea";
/**
 * Props neccesary for AreaChoosing component.
 */
export interface AreaChoosingProps {
    /**
     * Func from parent class to handles selection of area, which will be used in search collectibles process.
     * @param areaType Type of area restriction.
     */
    handleSelection: (areaType: Areas) => void;
}
/**
 * Func rendering UI, where the user view as cards all types of area restriction, which can be used.
 * @param AreaChoosingProps See AreaChoosingProps description. 
 * @returns JSX element rendering UI for area type restriction selection.
 */
function AreaChoosing({ handleSelection }: AreaChoosingProps) {
    return (
        <>
            <h1>Choose the way of selecting area, in which collectibles will be searched.</h1>
            <div className="d-flex flex-wrap justify-content-center">
                <CardForArea imgSrc="/Images/radius_area_image.png" title="Radius" text="Find and then set center of circle, also set distance from center. It will search for collectibles in this circe." areaType={Areas.RADIUS} handleSelection={handleSelection} />
                <CardForArea imgSrc="/Images/administrative_area_image.png" title="Administrative Area" text="Seach for administrative area in world. It will search for collectibles, which lies in this administrative area. You can also select here country." areaType={Areas.ADMINISTRAVIVE_AREA} handleSelection={handleSelection} />
                <CardForArea imgSrc="/Images/region_area_image.png" title="Region" text="Seach for region likes Europa , East Asian ... It will search for collectibles, which lies in country that belongs to the selected region." areaType={Areas.REGION} handleSelection={handleSelection} />
                <CardForArea imgSrc="/Images/world_area_image.png" title="World" text="It will search for collectibles, which lies somewhere in the world. Please take in mind that, int this type it must search all around world, so do not use it if your query will contains a huge amount of collectibles. Use for example if searching for all UNESCO heritage places." areaType={Areas.WORLD} handleSelection={handleSelection} />
            </div>
        </>
    )
}
export default AreaChoosing;