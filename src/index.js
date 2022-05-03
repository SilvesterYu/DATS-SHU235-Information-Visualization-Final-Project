import React from "react";
import ReactDOM from "react-dom";
import { WorldMap } from "./worldmap";
import { LegendBase } from "./legend";
import "./styles.css";
// -- can experiment with different color schemes -- //
import {
  json,
  csv,
  scale,
  scaleSequential,
  interpolateOranges,
  interpolatePurples,
  schemeReds,
  schemePiYG,
  schemePurples,
  scaleOrdinal,
  schemeOranges,
  schemeBrBG,
  schemeBlues,
  schemeOrRd,
  schemePaired,
  schemeGreens,
  schemeCategory10,
  schemePRGn,
  schemeSpectral,
  schemePastel2,
  schemeYlGn,
} from "d3";
import { MultipleLineChart } from "./lineChart";
import * as topojson from "topojson-client";
import { feature } from "topojson-client";
// -- dropdown menu -- //
import { Dropdown, Selection } from "react-dropdown-now";
import "react-dropdown-now/style.css";

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
  // -- dropdown menu -- //
  const [selectedRank, setSelectedRank] = React.useState(" ");
  const WIDTH = 1000;
  const HEIGHT = 600;
  const margin = { left: 50, right: 50, top: 50, bottom: 50 };
  const rawData = useData(csvUrl);
  const map = useMap(mapUrl);
  if (!map || !rawData) {
    return <pre>Loading...</pre>;
  }

  // -- dropdown menu -- //
  const Select = (d) => {
    setSelectedRank(d);
  };

  const YEAR = [2015, 2016, 2017, 2018, 2019, 2020, 2021];
  const changeHandler = (event) => {
    setYear(event.target.value);
  };

  const data = rawData.filter((d) => {
    return d.year === YEAR[year];
  });

  const width = WIDTH - margin.left - margin.right;
  const height = HEIGHT - margin.top - margin.bottom;
  const income_grp = data.map((d) => d.happiness_level);
  const incomeLevels = income_grp
    .filter((a, b) => income_grp.indexOf(a) === b)
    .sort()
    .reverse();

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
    <div className="row">
      {/* Column Left */}
      <div className="column1" style={{ backgroundColor: "#fff" }}>
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
          id="dropdownbar"
          style={{
            width: "20%",
          }}
        >
          <Dropdown
            placeholder="select filter"
            className="dropDown"
            options={["none", "top 5", "top 10", "top 20", "top 30", "top 40", "top 50"]}
            value=" "
            onChange={(d) => Select(d)}
            onSelect={(d) => Select(d)} // always fires once a selection happens even if there is no change
            onClose={(closedBySelection) =>
              console.log("closedBySelection?:", closedBySelection)
            }
            onOpen={() => console.log("open!")}
          />
        </div>

        <div>
          {/* // -- adjust the width and height of the map here -- // */}
          <svg
            width={WIDTH * 0.9}
            height={HEIGHT * 0.9}
            viewBox={"0 0 1000 600"}
          >
            <g>
              <WorldMap
                map={map}
                colormap={colormap}
                projection={"geoEqualEarth"}
                width={width}
                height={height}
                data={data}
                hoveredLegend={hoveredLegend}
                selectedRank={selectedRank}
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
      </div>
      {/* Column Right */}
      <div className="column2" style={{ backgroundColor: "#fff" }}>
        <MultipleLineChart></MultipleLineChart>
      </div>
    </div>
  );
}

ReactDOM.render(<Geomap />, document.getElementById("root"));
