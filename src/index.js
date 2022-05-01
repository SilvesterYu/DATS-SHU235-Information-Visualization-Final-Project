import React from "react";
import ReactDOM from "react-dom";
import { WorldMap } from "./worldmap";
import { Legend } from "./legend";
import "./styles.css";
import { json, csv, scaleOrdinal, schemeOranges } from "d3";
import * as topojson from "topojson-client";
import { feature } from "topojson-client";

const mapUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json";
const csvUrl = "https://raw.githubusercontent.com/SilvesterYu/DATS-SHU235-Information-Visualization-Final-Project/main/src/data/binnined_final_version_data.csv";

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
                d.year = +d.year;
                d.happiness_score = +d.happiness_score;
                d.happiness_rank = +d.happiness_rank;
                d.economy_GDP_per_capita = +d.economy_GDP_per_capita;
                d.family = +d.family;
                d.health_life_expectancy = +d.health_life_expectancy;
                d.freedom = +d.freedom;
                d.trust_government_corruption = +d.trust_government_corruption;
                d.generosity = +d.generosity;
                d.dystopia_residual = +d.dystopia_residual;
            });
            setData(data);
        });
    }, []);
    return dataAll;
}

function Geomap() {
    const [hoveredLegend, setHoveredLegend] = React.useState(null);
    const [year, setYear] = React.useState('3');
    const WIDTH = 1000;
    const HEIGHT = 600;
    const margin = {left: 50, right: 50, top: 50, bottom: 50};
    const rawData  = useData(csvUrl);
    const map = useMap(mapUrl);
    if (!map || !rawData) {
            return <pre>Loading...</pre>;
        };

    // -- checking data from all years -- //
    console.log("this is raw data");
    console.log(rawData);

    const YEAR = [2015, 2016, 2017, 2018, 2019, 2020, 2021];
    const changeHandler = (event) => {
        setYear(event.target.value);
    }
    // -- check year -- //
    console.log("this is year");
    console.log(year);
    const data = rawData.filter( d => {
        return d.year === YEAR[year];
    });
    // -- checking yearly data -- //
    console.log("this is yearly data");
    console.log(data);

    const width = WIDTH - margin.left - margin.right;
    const height = HEIGHT - margin.top - margin.bottom;
    const income_grp = data.map(d => d.happiness_level);
    const incomeLevels = income_grp.filter((a, b) => income_grp.indexOf(a) === b).sort().reverse();
    console.log(incomeLevels);
    const colormap = scaleOrdinal(schemeOranges[incomeLevels.length])
            .domain(incomeLevels);

    return <div>
        <div>
            <input key="slider" type='range' min='0' max='6' value={year} step='1' onChange={changeHandler}/>
            <input key="yearText" type="text" value={YEAR[year]} readOnly/>
        </div>

        
        <div>
        <svg width={WIDTH / 2} height={HEIGHT / 2} viewBox={"0 0 1000 600"}>
          <g>
            <WorldMap
              map={map}
              colormap={colormap}
              projection={"geoEqualEarth"}
              width={width}
              height={height}
              data={data}
              hoveredLegend={hoveredLegend}
            />
            <Legend
              x={50}
              y={HEIGHT / 2}
              colormap={colormap}
              incomeLevels={incomeLevels}
              hoveredLegend={hoveredLegend}
              setHoveredLegend={setHoveredLegend}
            />
          </g>
        </svg>
      </div>

        
    </div>
    
    
}


ReactDOM.render(<Geomap />, document.getElementById("root"));