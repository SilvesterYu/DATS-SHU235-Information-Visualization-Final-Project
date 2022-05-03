import React from "react";
import ReactDOM from "react-dom";
import { WorldMap } from "./worldmap";
import { LegendBase } from "./legend";
import "./styles.css";
// -- can experiment with different color schemes -- //
import { json, csv, scale, scaleSequential, interpolateOranges, interpolatePurples, schemeReds, schemePiYG, schemePurples, scaleOrdinal, schemeOranges, schemeBrBG, schemeBlues, schemeOrRd, schemePaired, schemeGreens, schemeCategory10, schemePRGn, schemeSpectral, schemePastel2 } from "d3";
import { MultipleLineChart } from './lineChart';
import * as topojson from "topojson-client";
import { feature } from "topojson-client";
// -- dropdown menu -- //
import { Dropdown, Selection } from 'react-dropdown-now';
import 'react-dropdown-now/style.css';


// Line Chart Data
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const dataChart = [
  {
    Year: 2015,
    "Australia and New Zealand": 7.285,
    "Central and Eastern Europe": 5.295,
    "Eastern Asia": 5.4947,
    "Latin America and Caribbean": 5.6945,
    "Middle East and Northern Africa": 5.5313,
    "North America": 7.2868,
    "Southeastern Asia": 5.2729,
    "Southern Asia": 4.5012,
    "Sub-Saharan Africa": 4.5195,
    "Western Europe": 6.0985,
  },
  {
    Year: 2016,
    "Australia and New Zealand": 7.3235,
    "Central and Eastern Europe": 5.2933,
    "Eastern Asia": 5.5129,
    "Latin America and Caribbean": 5.6728,
    "Middle East and Northern Africa": 5.5106,
    "North America": 7.2226,
    "Southeastern Asia": 5.2802,
    "Southern Asia": 4.513,
    "Sub-Saharan Africa": 4.5318,
    "Western Europe": 6.0922,
  },
  {
    Year: 2017,
    "Australia and New Zealand": 7.299,
    "Central and Eastern Europe": 5.298,
    "Eastern Asia": 5.5214,
    "Latin America and Caribbean": 5.6458,
    "Middle East and Northern Africa": 5.497,
    "North America": 7.1739,
    "Southeastern Asia": 5.2931,
    "Southern Asia": 4.576,
    "Sub-Saharan Africa": 4.5902,
    "Western Europe": 6.0713,
  },
  {
    Year: 2018,
    "Australia and New Zealand": 7.298,
    "Central and Eastern Europe": 5.3205,
    "Eastern Asia": 5.5598,
    "Latin America and Caribbean": 5.6649,
    "Middle East and Northern Africa": 5.5004,
    "North America": 7.1555,
    "Southeastern Asia": 5.3144,
    "Southern Asia": 4.6324,
    "Sub-Saharan Africa": 4.6558,
    "Western Europe": 6.084,
  },
  {
    Year: 2019,
    "Australia and New Zealand": 7.2675,
    "Central and Eastern Europe": 5.3517,
    "Eastern Asia": 5.5893,
    "Latin America and Caribbean": 5.6909,
    "Middle East and Northern Africa": 5.5254,
    "North America": 7.2229,
    "Southeastern Asia": 5.345,
    "Southern Asia": 4.6968,
    "Sub-Saharan Africa": 4.7387,
    "Western Europe": 6.1042,
  },
  {
    Year: 2020,
    "Australia and New Zealand": 7.2612,
    "Central and Eastern Europe": 5.3974,
    "Eastern Asia": 5.6318,
    "Latin America and Caribbean": 5.7396,
    "Middle East and Northern Africa": 5.5695,
    "North America": 7.2104,
    "Southeastern Asia": 5.3996,
    "Southern Asia": 4.7638,
    "Sub-Saharan Africa": 4.8011,
    "Western Europe": 6.1442,
  },
  {
    Year: 2021,
    "Australia and New Zealand": 7.23,
    "Central and Eastern Europe": 5.4474,
    "Eastern Asia": 5.6928,
    "Latin America and Caribbean": 5.7667,
    "Middle East and Northern Africa": 5.6059,
    "North America": 7.1813,
    "Southeastern Asia": 5.4487,
    "Southern Asia": 4.8506,
    "Sub-Saharan Africa": 4.8753,
    "Western Europe": 6.164,
  },
];

const mapUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json";
const csvUrl =
  "https://raw.githubusercontent.com/SilvesterYu/DATS-SHU235-Information-Visualization-Final-Project/main/src/data/binnined_final_version_data.csv";

function useMap(jsonPath) {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    json(jsonPath).then((topoJsonData) => {
      setData(topojson.feature(topoJsonData, topoJsonData.objects.countries));
    });
  }, []);
  return data;
}

function useData(csvPath) {
  const [dataAll, setData] = React.useState(null);
  React.useEffect(() => {
    csv(csvPath).then((data) => {
      data.forEach((d) => {
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
  const [year, setYear] = React.useState("3");
  const WIDTH = 1000;
  const HEIGHT = 600;
  const margin = { left: 50, right: 50, top: 50, bottom: 50 };
  const rawData = useData(csvUrl);
  const map = useMap(mapUrl);
  if (!map || !rawData) {
    return <pre>Loading...</pre>;
  }

  // -- checking data from all years -- //
  console.log("this is raw data");
  console.log(rawData);

  const YEAR = [2015, 2016, 2017, 2018, 2019, 2020, 2021];
  const changeHandler = (event) => {
    setYear(event.target.value);
  };
  // -- check year -- //
  console.log("this is year");
  console.log(year);
  const data = rawData.filter((d) => {
    return d.year === YEAR[year];
  });
  // -- checking yearly data -- //
  console.log("this is yearly data");
  console.log(data);

  const width = WIDTH - margin.left - margin.right;
  const height = HEIGHT - margin.top - margin.bottom;
  const income_grp = data.map((d) => d.happiness_level);
  const incomeLevels = income_grp
    .filter((a, b) => income_grp.indexOf(a) === b)
    .sort()
    .reverse();
  console.log(incomeLevels);

  // -- ordinal color scale -- //
  const colormap = scaleOrdinal(schemePurples[incomeLevels.length]).domain(
    incomeLevels
  );

  // -- continuous color scale -- //
  /*
  const colormap = scaleSequential().domain([2,8])
  .interpolator(interpolateOranges);
*/

  return (
    <div>
      <div>
        <input
          key="slider"
          type="range"
          min="0"
          max="6"
          value={year}
          step="1"
          onChange={changeHandler}
        />
        <input key="yearText" type="text" value={YEAR[year]} readOnly />
      </div>
      <div
        id = "dropdownbar"
        style={{
          width: "15%",
        }}
      >
      <g>
          <Dropdown
            placeholder="Select an option"
            className="my-className"
            options={['one', 'two', 'three']}
            value="one"
            onChange={(d) => Select(d)}
            onSelect={(value) => console.log('selected!', value)} // always fires once a selection happens even if there is no change
            onClose={(closedBySelection) => console.log('closedBySelection?:', closedBySelection)}
            onOpen={() => console.log('open!')}
          />
</g>
      </div>

     

      <div>
        {/* // -- adjust the width and height of the map here -- // */ }
        <svg width={WIDTH * 0.9} height={HEIGHT * 0.9} viewBox={"0 0 1000 600"}>
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
            <LegendBase
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

      

      <MultipleLineChart></MultipleLineChart>
      
    </div>
  );
}

ReactDOM.render(<Geomap />, document.getElementById("root"));