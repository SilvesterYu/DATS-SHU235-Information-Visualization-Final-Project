import React from "react";
import ReactDOM from "react-dom";
import { WorldMap } from "./worldmap";
import { Legend } from "./legend";
import "./styles.css";
import { json, csv, scaleOrdinal, schemeOranges } from "d3";
import * as topojson from "topojson-client";
import { feature } from "topojson-client";

const mapUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json";
const csvUrl = "https://raw.githubusercontent.com/SilvesterYu/All_kinds_of_scratch/main/2015.csv";

function useMap(jsonPath) {
    const [data, setData] = React.useState(null);
    React.useEffect(() => {
        json(jsonPath).then(topoJsonData => {
            setData(topojson.feature(topoJsonData, topoJsonData.objects.countries))});
    }, []);
    return data;
}

function useData(csvPath){
    const [dataAll, setData] = React.useState(null);
    React.useEffect(() => {
        csv(csvPath).then(data => {
            data.forEach(d => {
                d.happiness_rank = +d.happiness_rank;
                //d.pop_est = +d.pop_est;
            });
            setData(data);
        });
    }, []);
    return dataAll;
}

function Geomap() {
    const [hoveredLegend, setHoveredLegend] = React.useState(null);
    const WIDTH = 1000;
    const HEIGHT = 600;
    const margin = {left: 50, right: 50, top: 50, bottom: 50};
    const rawData  = useData(csvUrl);
    const map = useMap(mapUrl);
    if (!map || !rawData) {
            return <pre>Loading...</pre>;
        };
    // -- checking raw data -- //
    console.log("this is raw data");
    console.log(rawData, map);
    const width = WIDTH - margin.left - margin.right;
    const height = HEIGHT - margin.top - margin.bottom;
    const income_grp = rawData.map(d => d.happiness_level);
    const incomeLevels = income_grp.filter((a, b) => income_grp.indexOf(a) === b).sort().reverse();
    console.log(incomeLevels);
    const colormap = scaleOrdinal(schemeOranges[incomeLevels.length])
            .domain(incomeLevels);

    return <svg width={WIDTH} height={HEIGHT}>
        <g>
            <WorldMap map={map} colormap={colormap} projection={"geoEqualEarth"} width={width} height={height}
            data={rawData} hoveredLegend={hoveredLegend}/> 
            <Legend x={50} y={HEIGHT/2} colormap={colormap} incomeLevels={incomeLevels} 
            hoveredLegend={hoveredLegend} setHoveredLegend={setHoveredLegend}/>
        </g>
    </svg>
}


ReactDOM.render(<Geomap />, document.getElementById("root"));