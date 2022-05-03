import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";

// General Parameters, can change
const yAxisLabel = "Average Happniess Score";
const xAxisLabel = "Year";
const faintOpacity = 0.1; //For how much other lines should faint when one is selected

// Color Swatch Assignment using modulo to rotate around
let color_index = 0;

function getColor() {
  // We can add as many hex colors into following array, and line graph colors will loop through
  let colour = [
    "#ff0000",
    "#003366",
    "#800080",
    "#ff5c00",
    "#ffb600",
    "#187377",
    "#008080",
    "#0c9c19",
    "#088da5",
  ];
  color_index = (color_index + 1) % colour.length;
  return colour[color_index];
}

// Auto ID Generation for all lines and points, please don't edit
//  requires non-empty dataProcessed array
var allLinesAndPoints = [];
function autoIDGenerate() {
  for (let i = 0; i < dataProcessed.length; i++) {
    // Add the line IDs
    allLinesAndPoints.push(
      "#line_" + dataProcessed[i][0].region.replace(/ /g, "_")
    );
    for (let j = 0; j < dataProcessed[i].length; j++) {
      // Add the point ids
      allLinesAndPoints.push(
        "#point_" + dataProcessed[i][j].region.replace(/ /g, "_") + "_" + j
      );
    }
  }
}

// Region Names - Don't delete
const regionNames = [
  "Australia and New Zealand",
  "Central and Eastern Europe",
  "Eastern Asia",
  "Latin America and Caribbean",
  "Middle East and Northern Africa",
  "North America",
  "Southeastern Asia",
  "Southern Asia",
  "Sub-Saharan Africa",
  "Western Europe",
];
// This is where data comes in, in JSON format exactly as below
const dataChart = [
  {
    region: "Australia and New Zealand",
    happiness_score_avg: 7.285,
    year: 2015,
  },
  {
    region: "Central and Eastern Europe",
    happiness_score_avg: 5.295,
    year: 2015,
  },
  {
    region: "Eastern Asia",
    happiness_score_avg: 5.4947,
    year: 2015,
  },
  {
    region: "Latin America and Caribbean",
    happiness_score_avg: 5.6945,
    year: 2015,
  },
  {
    region: "Middle East and Northern Africa",
    happiness_score_avg: 5.5313,
    year: 2015,
  },
  {
    region: "North America",
    happiness_score_avg: 7.2868,
    year: 2015,
  },
  {
    region: "Southeastern Asia",
    happiness_score_avg: 5.2729,
    year: 2015,
  },
  {
    region: "Southern Asia",
    happiness_score_avg: 4.5012,
    year: 2015,
  },
  {
    region: "Sub-Saharan Africa",
    happiness_score_avg: 4.5195,
    year: 2015,
  },
  {
    region: "Western Europe",
    happiness_score_avg: 6.0985,
    year: 2015,
  },
  {
    region: "Australia and New Zealand",
    happiness_score_avg: 7.3235,
    year: 2016,
  },
  {
    region: "Central and Eastern Europe",
    happiness_score_avg: 5.2933,
    year: 2016,
  },
  {
    region: "Eastern Asia",
    happiness_score_avg: 5.5129,
    year: 2016,
  },
  {
    region: "Latin America and Caribbean",
    happiness_score_avg: 5.6728,
    year: 2016,
  },
  {
    region: "Middle East and Northern Africa",
    happiness_score_avg: 5.5106,
    year: 2016,
  },
  {
    region: "North America",
    happiness_score_avg: 7.2226,
    year: 2016,
  },
  {
    region: "Southeastern Asia",
    happiness_score_avg: 5.2802,
    year: 2016,
  },
  {
    region: "Southern Asia",
    happiness_score_avg: 4.513,
    year: 2016,
  },
  {
    region: "Sub-Saharan Africa",
    happiness_score_avg: 4.5318,
    year: 2016,
  },
  {
    region: "Western Europe",
    happiness_score_avg: 6.0922,
    year: 2016,
  },
  {
    region: "Australia and New Zealand",
    happiness_score_avg: 7.299,
    year: 2017,
  },
  {
    region: "Central and Eastern Europe",
    happiness_score_avg: 5.298,
    year: 2017,
  },
  {
    region: "Eastern Asia",
    happiness_score_avg: 5.5214,
    year: 2017,
  },
  {
    region: "Latin America and Caribbean",
    happiness_score_avg: 5.6458,
    year: 2017,
  },
  {
    region: "Middle East and Northern Africa",
    happiness_score_avg: 5.497,
    year: 2017,
  },
  {
    region: "North America",
    happiness_score_avg: 7.1739,
    year: 2017,
  },
  {
    region: "Southeastern Asia",
    happiness_score_avg: 5.2931,
    year: 2017,
  },
  {
    region: "Southern Asia",
    happiness_score_avg: 4.576,
    year: 2017,
  },
  {
    region: "Sub-Saharan Africa",
    happiness_score_avg: 4.5902,
    year: 2017,
  },
  {
    region: "Western Europe",
    happiness_score_avg: 6.0713,
    year: 2017,
  },
  {
    region: "Australia and New Zealand",
    happiness_score_avg: 7.298,
    year: 2018,
  },
  {
    region: "Central and Eastern Europe",
    happiness_score_avg: 5.3205,
    year: 2018,
  },
  {
    region: "Eastern Asia",
    happiness_score_avg: 5.5598,
    year: 2018,
  },
  {
    region: "Latin America and Caribbean",
    happiness_score_avg: 5.6649,
    year: 2018,
  },
  {
    region: "Middle East and Northern Africa",
    happiness_score_avg: 5.5004,
    year: 2018,
  },
  {
    region: "North America",
    happiness_score_avg: 7.1555,
    year: 2018,
  },
  {
    region: "Southeastern Asia",
    happiness_score_avg: 5.3144,
    year: 2018,
  },
  {
    region: "Southern Asia",
    happiness_score_avg: 4.6324,
    year: 2018,
  },
  {
    region: "Sub-Saharan Africa",
    happiness_score_avg: 4.6558,
    year: 2018,
  },
  {
    region: "Western Europe",
    happiness_score_avg: 6.084,
    year: 2018,
  },
  {
    region: "Australia and New Zealand",
    happiness_score_avg: 7.2675,
    year: 2019,
  },
  {
    region: "Central and Eastern Europe",
    happiness_score_avg: 5.3517,
    year: 2019,
  },
  {
    region: "Eastern Asia",
    happiness_score_avg: 5.5893,
    year: 2019,
  },
  {
    region: "Latin America and Caribbean",
    happiness_score_avg: 5.6909,
    year: 2019,
  },
  {
    region: "Middle East and Northern Africa",
    happiness_score_avg: 5.5254,
    year: 2019,
  },
  {
    region: "North America",
    happiness_score_avg: 7.2229,
    year: 2019,
  },
  {
    region: "Southeastern Asia",
    happiness_score_avg: 5.345,
    year: 2019,
  },
  {
    region: "Southern Asia",
    happiness_score_avg: 4.6968,
    year: 2019,
  },
  {
    region: "Sub-Saharan Africa",
    happiness_score_avg: 4.7387,
    year: 2019,
  },
  {
    region: "Western Europe",
    happiness_score_avg: 6.1042,
    year: 2019,
  },
  {
    region: "Australia and New Zealand",
    happiness_score_avg: 7.2612,
    year: 2020,
  },
  {
    region: "Central and Eastern Europe",
    happiness_score_avg: 5.3974,
    year: 2020,
  },
  {
    region: "Eastern Asia",
    happiness_score_avg: 5.6318,
    year: 2020,
  },
  {
    region: "Latin America and Caribbean",
    happiness_score_avg: 5.7396,
    year: 2020,
  },
  {
    region: "Middle East and Northern Africa",
    happiness_score_avg: 5.5695,
    year: 2020,
  },
  {
    region: "North America",
    happiness_score_avg: 7.2104,
    year: 2020,
  },
  {
    region: "Southeastern Asia",
    happiness_score_avg: 5.3996,
    year: 2020,
  },
  {
    region: "Southern Asia",
    happiness_score_avg: 4.7638,
    year: 2020,
  },
  {
    region: "Sub-Saharan Africa",
    happiness_score_avg: 4.8011,
    year: 2020,
  },
  {
    region: "Western Europe",
    happiness_score_avg: 6.1442,
    year: 2020,
  },
  {
    region: "Australia and New Zealand",
    happiness_score_avg: 7.23,
    year: 2021,
  },
  {
    region: "Central and Eastern Europe",
    happiness_score_avg: 5.4474,
    year: 2021,
  },
  {
    region: "Eastern Asia",
    happiness_score_avg: 5.6928,
    year: 2021,
  },
  {
    region: "Latin America and Caribbean",
    happiness_score_avg: 5.7667,
    year: 2021,
  },
  {
    region: "Middle East and Northern Africa",
    happiness_score_avg: 5.6059,
    year: 2021,
  },
  {
    region: "North America",
    happiness_score_avg: 7.1813,
    year: 2021,
  },
  {
    region: "Southeastern Asia",
    happiness_score_avg: 5.4487,
    year: 2021,
  },
  {
    region: "Southern Asia",
    happiness_score_avg: 4.8506,
    year: 2021,
  },
  {
    region: "Sub-Saharan Africa",
    happiness_score_avg: 4.8753,
    year: 2021,
  },
  {
    region: "Western Europe",
    happiness_score_avg: 6.164,
    year: 2021,
  },
];

// This holds the processed data. The data is splitted into multiple arrays according to regions for easier graphing
var dataProcessed = [];

export function MultipleLineChart(props) {
  const { currentRegion } = props;

  useEffect(() => {
    // Draw lines based on whether a region is selected on map
    drawChart(currentRegion);

    if (currentRegion != null && currentRegion != "") {
      // Conditional Render based on selection
      const regionIDProcessed = currentRegion.split("--")[1];
      for (let i = 0; i < allLinesAndPoints.length; i++) {
        const region = allLinesAndPoints[i];
        let result = region.includes(regionIDProcessed);
        if (result == false) {
          d3.select(allLinesAndPoints[i]).style("opacity", faintOpacity);
        } else {
          d3.select(allLinesAndPoints[i]).style("opacity", 1.0);
        }
      }
    }
  }, [dataChart, currentRegion]);

  // Node ID Generator, please don't touch the following
  let node_id = 0;
  function getNodeID() {
    node_id = node_id + 1;
    console.log("Assigning ID " + node_id);
    return node_id;
  }

  // Function below is for all mouse interactions
  function MouseDown(event, regionData, regionID, tooltip) {
    const regionIDProcessed = regionID.replace(/ /g, "_");
    // Passing the current region back to parent component
    props.func(regionIDProcessed);
    // console.log(regionIDProcessed);
    for (let i = 0; i < allLinesAndPoints.length; i++) {
      // The idea is to traverse through all lines and points on the graph, and only show their opacity to full when they include the name of the region
      const region = allLinesAndPoints[i];
      let result = region.includes(regionIDProcessed);
      if (result == false) {
        d3.select(allLinesAndPoints[i]).style("opacity", faintOpacity);
      } else {
        d3.select(allLinesAndPoints[i]).style("opacity", 1.0);
      }
    }
    // Show tooltip
    tooltip.style("visibility", "visible");
    // Position the tooltip
    tooltip
      .style("top", event.pageY + 20 + "px")
      .style("left", event.pageX + 5 + "px");
    // Change Tooltip Text
    // Remove previous text
    tooltip.selectAll("span").remove();
    // tooltip.text(regionID + "\n" + regionData.__data__.year);
    tooltip.append("span").html(function (d) {
      return (
        regionID +
        "<br/> <b>Average Happiness Score : </b> " +
        regionData.__data__.happiness_score_avg +
        "<br/> <b>Year :</b> " +
        regionData.__data__.year
      );
    });
  }

  function MouseOut(regionID, tooltip) {
    // Reset the visibility of all lines and points
    props.func("None");
    for (let i = 0; i < allLinesAndPoints.length; i++) {
      d3.select(allLinesAndPoints[i]).style("opacity", 1.0);
    }
    // Hide tooltip on mouseout
    tooltip.style("visibility", "hidden");
  }

  // Pass back data to parent component, to highlight the map

  // Function below do the processing of raw JSON data and renders the final graph
  function drawChart(currentRegion) {
    // Process the data (split into smaller json, categorized by regions)
    for (let index = 0; index < regionNames.length; index++) {
      // Allocate a sub array, manual resizing
      dataProcessed[index] = [];
      for (let i = 0; i < dataChart.length; i++) {
        if (dataChart[i].region == regionNames[index]) {
          dataProcessed[index].push(dataChart[i]);
        }
      }
    }
    // Then, generate all possible IDs, requires non-empty dataProcessed array
    autoIDGenerate();
    // This gets the minimum value for y
    var yMinValue = d3.min(dataChart, (d) => d.happiness_score_avg) - 0.2;
    // This gets the maximum value for y
    var yMaxValue = d3.max(dataChart, (d) => d.happiness_score_avg) + 0.2;

    // Min, max values for x
    const xMinValue = d3.min(dataChart, (d) => d.year);
    const xMaxValue = d3.max(dataChart, (d) => d.year);

    // Margin
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = 300;
    const height = 300;
    // Remove old chart
    d3.select("#container").selectAll("*").remove();
    // Instantiate d3
    const svg = d3
      .select("#container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    // Auto scaling according to min, max values
    const xScale = d3
      .scaleLinear()
      .domain([xMinValue, xMaxValue])
      .range([0, width]);
    const yScale = d3
      .scaleLinear()
      .range([height, 0])
      .domain([yMinValue, yMaxValue]);
    const line = d3
      .line()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.happiness_score_avg))
      .curve(d3.curveMonotoneX);
    // Add Grids, and axis ticks
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(""));
    svg
      .append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(""));
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom()
          .scale(xScale)
          .tickSize(15)
          .tickFormat(d3.format("d"))
          .ticks(dataProcessed[0].length)
      );
    svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));
    // Add Axis Labels
    svg
      .append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .style("font-size", "12px")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .text(xAxisLabel);

    svg
      .append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .style("font-size", "12px")
      .attr("y", -40)
      .attr("x", -height / 3)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text(yAxisLabel);

    // Tooltip variable
    var tooltip = d3
      .select("#container")
      .append("div")
      .style("background-color", "#ffffff")
      .style("border", "1px solid #000000")
      .style("padding", "10px")
      .style("z-index", "10000")
      .style("border-radius", "10px")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("font-size", "12px");

    // Generate Legend Text
    // Reset Color Index
    var legend_text =
      '<div style="color:#000000;font-size:1.5em;margin-bottom:5px;">Legend</div>';
    color_index = 0;
    for (let i = 0; i < dataProcessed.length; i++) {
      var currentColor = getColor();
      legend_text +=
        '<span style="color:' +
        currentColor +
        '">' +
        dataProcessed[i][0].region +
        "</span>&nbsp;|&nbsp;";
    }
    // Add Legend
    var legend = d3
      .select("#container")
      .append("div")
      .style("border-radius", "10px")
      .style("background-color", "#ffffff")
      .style("border", "1px solid #000000")
      .style("padding", "10px")
      .style("font-size", "12px")
      .html(function (d) {
        return legend_text;
      });
    // Reset Color Index (IMPORTANT)
    color_index = 0;

    // Append Lines according to regions
    for (let i = 0; i < dataProcessed.length; i++) {
      var currentColor = getColor();
      svg
        .append("path")
        .datum(dataProcessed[i])
        .attr("id", function (d, i) {
          // Generate Unique ID for each line
          // We need unique ID to display the tooltips
          return "line_" + d[0].region.replace(/ /g, "_");
        })
        .attr("fill", "none")
        .attr("stroke", currentColor)
        .attr("stroke-width", 1)
        .attr("class", "line")
        .attr("d", line);

      // Draw the dots, which are interactive
      svg
        .append("g")
        .selectAll("dot")
        .data(dataProcessed[i])
        .enter()
        .append("circle")
        .attr("id", function (d, i) {
          // Generate Unique ID for each points
          // We need unique ID to display the tooltips
          return "point_" + d.region.replace(/ /g, "_") + "_" + i;
        })
        .on("mouseover", function (d) {
          // Change cursor style to pointer
          d3.select(this).style("cursor", "pointer");
          // Call the Mouse over function
          MouseDown(d, d.target, d.target.__data__.region, tooltip);
        })
        .on("mouseout", function (d) {
          // Call the Mouse over function
          MouseOut(d.target.__data__.region, tooltip);
        })
        .attr("cx", function (d) {
          return xScale(d.year);
        })
        .attr("cy", function (d) {
          return yScale(d.happiness_score_avg);
        })
        .attr("r", 6)
        .style("fill", currentColor)
        .attr("stroke", "#000000")
        .attr("stroke-width", 1);
    }

    // This is for dynamic selection based on mouse pointer on map region
    var linetoSelect = "";
    if (currentRegion != null && currentRegion != "") {
      linetoSelect = currentRegion.split("--")[1].replace("_", " ");
    }
  }
  return (
    <div>
      <div>
        {currentRegion
          ? currentRegion.replace(/_/g, " ")
          : "No Region Selected"}
      </div>
      <div id="container" />
    </div>
  );
}