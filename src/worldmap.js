import React from "react";
import { geoPath, geoEqualEarth, geoMercator } from "d3-geo";
// import { feature } from "topojson-client";

export function WorldMap(props){
    const {map, colormap, projection, width, height, data, hoveredLegend} = props;
    let path = geoPath(geoEqualEarth()); // the default projection
    if (projection==="geoEqualEath"){
        path = geoPath(geoEqualEarth().fitSize([width, height], map));
    }
    if (projection==="geoMercator"){
        path = geoPath(geoMercator().fitSize([width, height], map));
    }
    // console.log(path({type:"Sphere"}));
    const filteredData = data.filter(d => d.happiness_score === hoveredLegend);
    const opacity = hoveredLegend ? 0.5 : 1;
    console.log(hoveredLegend);
    console.log("opacity country", opacity);
    return <g>
            <path className={'sphere'} d={path({type: 'Sphere'})} />
               
            { map.features.map( feature => {
                const country = data.filter( d => d.geounit === feature.properties.name); // Todo: apply string methods to remove spaces
                if (country[0]){
                    return <path key={feature.properties.name+"boundary"} className={"boundary"} 
                d={path(feature)} opacity={opacity}
                style={{fill:colormap(country[0].happiness_score)}}/>}
                else {
                    return <path key={feature.properties.name+"boundary"} className={"boundary"} 
                d={path(feature)} opacity={opacity}/>} 
                }
            )}
            {map.features.map( feature => {
                const country = filteredData.filter( d => d.geounit === feature.properties.name);
                {/* console.log(country); */}
                if (country[0]){
                    {/* console.log(country); */}
                    return <path key={feature.properties.name+"boundary"} className={"boundary"} 
                    d={path(feature)} 
                    style={{fill: colormap(country[0].happiness_score)}} />}
                else {
                    if (hoveredLegend==="6. Unknown") {
                        const country = data.filter( d => d.geounit === feature.properties.name);
                        if (!country[0]) {
                            return <path key={feature.properties.name+"boundary"} className={"boundary"} 
                            d={path(feature)} style={{fill:"#9a9e9e"}}/>
                        }
                    }
                       return <g key={feature.properties.name+"boundary"}></g> 
                    }
            })}
        </g>
}