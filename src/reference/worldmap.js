import React from "react";
// -- can replace geoEqualEarth with geoMercator, that will be a rectangular map -- //
// -- geoAitoff, geoArmadillo, geoAugust are also fun -- //
import { geoPath, geoEqualEarth, geoMercator } from "d3-geo";
// import { feature } from "topojson-client";

export function WorldMap(props){
    const {map, colormap, projection, width, height, data} = props;
    
    let path = geoPath(geoEqualEarth()); // the default projection
    if (projection==="geoEqualEath"){
        path = geoPath(geoEqualEarth().fitSize([width, height], map));
    }
    if (projection==="geoMercator"){
        path = geoPath(geoMercator().fitSize([width, height], map));
    }
    console.log(path({type:"Sphere"}));
    
    // -- convert feature to a path -- //
    // -- "key" is not a real attribute of svg element, it is just required by react. -- //
    // -- react needs a key for html object generated for its idntification, if we remove it, webpage still works but there will be warning, and if any of the path is changed, then all paths will be regenerated and re-rendered, this is a way to increase efficiency for the webpage -- //
    // -- classname: react takes use of it. We use css for color and style of our objects -- //
    
    // -- why we need if? not all country in map can we find data item in data -- //
    return <g>
            <path className={'sphere'} d={path({type: 'Sphere'})} />

            {map.features.map( feature => 
                 <path key={feature.properties.name+"boundary"} className={"boundary"} 
                    d={path(feature)}
                />)}
               
            { map.features.map( feature => {
                const country = data.filter( d => d.country === feature.properties.name); // Todo: apply string methods to remove spaces
                if (country[0]){
                    return <path key={feature.properties.name+"boundary"} className={"boundary"} 
                d={path(feature)}
                style={{fill:colormap(country[0].happiness_level)}}/>}
                else {
                    return <path key={feature.properties.name+"boundary"} className={"boundary"} 
                d={path(feature)}/>} 
            }
            )}
        </g>
}