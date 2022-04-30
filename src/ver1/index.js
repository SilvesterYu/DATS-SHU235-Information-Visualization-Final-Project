import React from "react";
import ReactDOM from "react-dom";
import { WorldMap } from "./worldmap";
import { Legend } from "./legend";
import "./styles.css";
import { json, csv, scaleOrdinal, schemeOranges } from "d3";
import * as topojson from "topojson-client";
// import { feature } from "topojson-client";

const mapUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const csvPath = "https://raw.githubusercontent.com/SilvesterYu/DATS-SHU235-Information-Visualization-Final-Project/main/src/data/2015.csv";

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
                d['Happiness Rank'] = +d['Happiness Rank'];
                d['Happiness Score'] = +d['Happiness Score'];
                d['Economy (GDP per Capita)'] = +d['Economy (GDP per Capita)'];
                d['Family'] = +d['Family'];
                d['Health (Life Expectancy)'] = +d['Health (Life Expectancy)'];
                d['Freedom'] = +d['Freedom'];
                d['Trust (Government Corruption)'] = +d['Trust (Government Corruption)'];
                d['Generosity'] = +d['Generosity'];
                d['Dystopia Residual'] = +d['Dystopia Residual'];
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
    const width = WIDTH - margin.left - margin.right;
    const height = HEIGHT - margin.top - margin.bottom;

    const rawData  = useData(csvPath);
    console.log(rawData);

    const map = useMap(mapUrl);
    const YEAR = ['2015', '2016', '2017', '2018', '2019', '2020', '2021'];

    if (!map || !rawData) {
            return <pre>Loading...</pre>;
        };
    console.log(rawData, map);
    
    const changeHandler = (event) => {
        setYear(event.target.value);
    }

    const happiness_score = rawData.map(d => d['Happiness Score']);
    const happinessLevels = happiness_score.filter((a, b) => happiness_score.indexOf(a) === b).sort().reverse();
    console.log(happinessLevels);
    const colormap = scaleOrdinal(schemeOranges[happinessLevels.length])
            .domain(happinessLevels);

    return <div>
        <div>
            <input key="slider" type='range' min='2015' max='2021' value={year} step='1' onChange={changeHandler}/>
            <input key="yearText" type="text" value={YEAR[year]} readOnly/>
        </div>
            <svg width={WIDTH} height={HEIGHT}>
                <g>
                    <WorldMap map={map} colormap={colormap} projection={"geoEqualEarth"} width={width} height={height}
                    data={rawData} hoveredLegend={hoveredLegend}/> 
                    <Legend x={50} y={HEIGHT/2} colormap={colormap} happinessLevels={happinessLevels} 
                    hoveredLegend={hoveredLegend} setHoveredLegend={setHoveredLegend}/>
                </g>
            </svg>
        <div style={{position: "absolute", textAlign: "left", width: "240px",left:"40px", top:"40px"}}>
            <h3>World Happiness Report (2015-2021)</h3>
            <p>A visualization of the World Happiness Report up to 2021.</p>
        </div>
    </div>
        
}


ReactDOM.render(<Geomap />, document.getElementById("root"));