import React, { useState, useEffect } from "react";
import { scaleLinear, scaleBand, max, map, descending } from "d3";
const faintOpacity = 0.1; //For how much other lines should faint when one is selected

// This is to note the direction of data flow between bar and map
var dataFlow = 0;

const csvUrl =
  "https://raw.githubusercontent.com/SilvesterYu/DATS-SHU235-Information-Visualization-Final-Project/main/src/data/binnined_final_version_data.csv";

function BarChart(props) {
  const [dynamicwidth, setDynamicwidth] = useState(1200);
  const [selectedInt, setSelectedInt] = useState(1000000);
  const {
    offsetX,
    offsetY,
    data,
    height,
    width,
    currentRegion,
    selectedStation,
    setSelectedStation,
    selectedRank,
  } = props;
  //   console.log("plotting barChart");
  //   Traverse the country list ID for bar highlighting
  var allCountries = [];
  for (let i = 0; i < data.length; i++) {
    const countryID = data[i].country + "_" + data[i].year;
    allCountries.push(countryID);
  }

  const mouseEnter = (d, event) => {
    dataFlow = 1;
    // Passing the current region back to parent component
    const regionIDProcessed = d.country.replace(/ /g, "_");
    props.func(regionIDProcessed);
    // Deal with highlighting
    var currentID = d.country + "_" + d.year;
    if (allCountries[0]) {
      for (let j = 0; j < allCountries.length; j++) {
        if (currentID == allCountries[j]) {
          document.getElementById(currentID).style.opacity = "1.0";
          document.getElementById(currentID).style.cursor = "pointer";
        } else {
          if (document.getElementById(allCountries[j])) {
            document.getElementById(allCountries[j]).style.opacity =
              faintOpacity;
          }
        }
      }
    }
  };
  const mouseOut = (event) => {
    props.func(null);
    dataFlow = 0;
    for (let j = 0; j < allCountries.length; j++) {
      if (document.getElementById(allCountries[j])) {
        document.getElementById(allCountries[j]).style.opacity = "1.0";
      }
    }
  };

  //   Dyanmic width with hooks
  useEffect(() => {
    if (selectedRank.label == undefined) {
      setDynamicwidth(1200);
    } else {
      setSelectedInt(parseInt(selectedRank.label.split(" ")[1]));
      setDynamicwidth(selectedInt * 20);
    }
    // Highlight the bar, if exists
    if (currentRegion != null && currentRegion != "") {
      const regionIDProcessed = currentRegion.split("--")[0].replace(/_/g, " ");
      for (let j = 0; j < allCountries.length; j++) {
        if (allCountries[j].includes(regionIDProcessed)) {
          if (document.getElementById(allCountries[j])) {
            document.getElementById(allCountries[j]).style.opacity = "1.0";
          }
        } else {
          if (document.getElementById(allCountries[j])) {
            document.getElementById(allCountries[j]).style.opacity = "0.1";
          }
        }
      }
    }
    if ((currentRegion == null || currentRegion == "") && dataFlow == 0) {
      for (let j = 0; j < allCountries.length; j++) {
        if (document.getElementById(allCountries[j])) {
          document.getElementById(allCountries[j]).style.opacity = "1.0";
        }
      }
    }
    // console.log(currentRegion + " " + dataFlow);
  }, [props, selectedRank, selectedInt, currentRegion]);

  // -- Q2.6 make bars sorted (May) -- //
  // -- Q2.6 make bars sorted (May) -- //
  let maySort = data.sort(function (x, y) {
    return descending(x.happiness_score, y.happiness_score);
  });

  const filteredCountry = maySort.filter(
    (d) => d.happiness_rank <= selectedInt
  ); // Todo: apply string methods to remove spaces

  //   console.log(filteredCountry);
  const xScale = scaleBand()
    .range([30, dynamicwidth])
    .domain(map(filteredCountry, (d) => d.country + " (" + d.year + ")"));
  const yScale = scaleLinear()
    .range([height, height * 0.1])
    .domain([0, max(filteredCountry, (d) => d.happiness_score)])
    .nice();

  if (selectedInt >= 1) {
    return (
      <>
        <div>
          Displaying {selectedInt <= 1000 ? "top " : ""}
          {selectedInt <= 1000 ? selectedInt : "all"} countries
        </div>
        <svg width={dynamicwidth + 30} height={height + 200}>
          <text
            className={"y label"}
            textAnchor={"end"}
            y={0}
            x={-30}
            dy={".75em"}
            transform={"rotate(-90)"}
          >
            Happiness Score
          </text>
          <line x1={30} x2={30} y1={0} y2={height} stroke="black" />
          <line
            x1={30}
            x2={dynamicwidth}
            y1={height}
            y2={height}
            stroke="black"
          />
          {yScale.ticks(5).map((tickValue) => (
            <g
              key={tickValue}
              transform={`translate(-10, ${yScale(tickValue)})`}
            >
              <line x2={10} stroke="black" />
              <text style={{ textAnchor: "end", fontSize: "10px" }}>
                {tickValue}
              </text>
            </g>
          ))}
          {filteredCountry.map((d) => {
            return (
              <rect
                id={d.country + "_" + d.year}
                stroke={"black"}
                key={d.country + " (" + d.year + ")"}
                x={xScale(d.country + " (" + d.year + ")")}
                y={yScale(d.happiness_score)}
                height={height - yScale(d.happiness_score)}
                fill={"#7b1fa2"}
                width={xScale.bandwidth()}
                onMouseEnter={(event) => mouseEnter(d, event)}
                onMouseOut={(event) => mouseOut(event)}
              ></rect>
            );
          })}
          {xScale.domain().map((tickValue) => (
            <g
              key={tickValue + "B"}
              transform={`translate(${xScale(tickValue)}, 0)`}
            >
              <line y2={height} />
              <text
                style={{ textAnchor: "country", fontSize: "10px" }}
                y={height + 3}
                transform={`rotate(75, 0, ${height + 3})`}
              >
                {tickValue}
              </text>
            </g>
          ))}
          Sorry, your browser does not support inline SVG.
        </svg>
      </>
    );
  } else {
    return (
      <div>
        No countries selected. Please select the dropdown menu for bar chart.
      </div>
    );
  }
}

export { BarChart };
