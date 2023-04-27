import L from "leaflet";

/**
 * Obtains image of icon for markers on the map.
 * @param nameOfIcon Name of icon image, which will be used as marker icon.
 * @param grayFlag Flag, true if into image icon className will be assinged "gray" value.
 * @returns icon object, which can be assing into marker property icon.
 */
export function getIcon(nameOfIcon: string, grayFlag: boolean) {
    return L.icon({
        iconUrl: require('../../static/Icons/' + nameOfIcon + '.png'),
        iconSize: [64, 64],
        className: (grayFlag) ? "" : "gray"
    })
}