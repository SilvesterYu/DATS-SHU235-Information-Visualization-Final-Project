import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { WorldMap } from "./worldmap";
import { LegendBase } from "./legend";
import { BarChart } from "./barChart";
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

// To keep track of map <-> Graph interactivity
var all_country_ID = [];

// Format non-Data Countries
function FormatNonData(opacity) {
  // Format the non-Data visible countries
  var countryBoundaries2 = document.getElementsByClassName("boundaryNone");
  if (countryBoundaries2[0]) {
    for (let i = 0; i < countryBoundaries2.length; i++) {
      countryBoundaries2[i].style.opacity = opacity;
    }
  }

  var countryBoundaries3 = document.getElementsByClassName("boundary");

  for (let i = 0; i < countryBoundaries3.length; i++) {
    if (!countryBoundaries3[i].id) {
      countryBoundaries3[i].style.opacity = opacity;
    }
  }
}

function Geomap() {
  const [selectedregion, setSelectedregion] = React.useState(null);

  const [selectedCountryBar, setSelectedCountryBar] = React.useState(null);
  // Get data from the Bar Graph for Intearactivity
  const pull_data_bar = (data) => {
    setSelectedCountryBar(data);
  };

  // Get data from the Line graph, and process the graph to map interactivity
  // https://javascript.plainenglish.io/how-to-pass-props-from-child-to-parent-component-in-react-d90752ff4d01
  const pull_data = (data) => {
    // console.log(data);
    if (data == "None" || data == undefined) {
      for (let i = 0; i < all_country_ID.length; i++) {
        document.getElementById(all_country_ID[i]).style.opacity = "1.0";
      }
      FormatNonData("1.0");
    } else {
      for (let i = 0; i < all_country_ID.length; i++) {
        if (all_country_ID[i].includes(data)) {
          document.getElementById(all_country_ID[i]).style.opacity = "1.0";
        } else {
          document.getElementById(all_country_ID[i]).style.opacity = "0.1";
        }
      }
      FormatNonData("0.1");
    }
  };
  // Process country region highlighting
  useEffect(() => {
    if (selectedCountryBar == null) {
      // Reset opacity
      for (let i = 0; i < all_country_ID.length; i++) {
        if (document.getElementById(all_country_ID[i])) {
          document.getElementById(all_country_ID[i]).style.opacity = "1.0";
        }
      }
      FormatNonData("1.0");
      // Do not plot bar, go with line chart
      all_country_ID = [];
      var countryBoundaries = document.getElementsByClassName("boundary");
      if (countryBoundaries[0]) {
        for (var i = 0; i < countryBoundaries.length; i++) {
          if (
            countryBoundaries[i].id != undefined &&
            countryBoundaries[i].id != ""
          ) {
            all_country_ID.push(countryBoundaries[i].id);
          }
        }
        // HIGHLIGHTING FOR LINE CHART
        // Add event listeners
        for (var i = 0; i < countryBoundaries.length; i++) {
          countryBoundaries[i].addEventListener("mouseover", function () {
            setSelectedregion(event.target.id);
            FormatNonData("0.1");
            // Process the highlight
            if (all_country_ID[0]) {
              for (let i = 0; i < all_country_ID.length; i++) {
                if (all_country_ID[i] == event.target.id) {
                  document.getElementById(event.target.id).style.cursor =
                    "pointer";
                  document.getElementById(event.target.id).style.opacity =
                    "1.0";
                  // console.log(selectedregion);
                } else {
                  document.getElementById(all_country_ID[i]).style.opacity =
                    "0.1";
                }
              }
            }
          });
          countryBoundaries[i].addEventListener("mouseout", function () {
            setSelectedregion("");
            //  Reset Opacity
            if (all_country_ID[0]) {
              FormatNonData("1.0");
              for (let i = 0; i < all_country_ID.length; i++) {
                document.getElementById(all_country_ID[i]).style.opacity =
                  "1.0";
              }
            }
          });
        }
      }
    } else {
      // Highlight the country from bar
      FormatNonData("0.1");
      for (let i = 0; i < all_country_ID.length; i++) {
        if (all_country_ID[i].includes(selectedCountryBar)) {
          document.getElementById(all_country_ID[i]).style.opacity = "1.0";
        } else {
          document.getElementById(all_country_ID[i]).style.opacity = "0.1";
        }
      }
    }
  });

  const [hoveredLegend, setHoveredLegend] = React.useState(null);
  const [year, setYear] = React.useState("3");
  // -- dropdown menu -- //
  const [selectedRank, setSelectedRank] = React.useState(" ");
  const WIDTH = 1000;
  const HEIGHT = 600;
  const margin = { left: 50, right: 50, top: 50, bottom: 50, gap: 10 };
  // For Bar
  const innerWidth = WIDTH - margin.left - margin.right;
  const innerHeight = HEIGHT - margin.top - margin.bottom;

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
            options={[
              "none",
              "top 5",
              "top 10",
              "top 20",
              "top 30",
              "top 40",
              "top 50",
            ]}
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
            height={HEIGHT * 0.85}
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
        <div>
          <BarChart
            selectedRank={selectedRank}
            height={170}
            width={500}
            data={data}
            func={pull_data_bar}
            currentRegion={selectedregion}
          ></BarChart>
          <br />
        </div>
      </div>
      {/* Column Right */}
      <div className="column2" style={{ backgroundColor: "#fff" }}>
        <MultipleLineChart
          currentRegion={selectedregion}
          func={pull_data}
        ></MultipleLineChart>
      </div>
    </div>
  );
}

ReactDOM.render(<Geomap />, document.getElementById("root"));
