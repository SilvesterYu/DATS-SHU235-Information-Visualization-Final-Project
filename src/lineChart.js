import React from "react";
import { scaleLinear, scaleBand, area, max, curveBasis } from "d3";

function liMultipleLineChart(props){
    const {x, y, width, height, data} = props;
    const regions = ["Australia and New Zealand", "Central and Eastern Europe", "Eastern Asia", "Latin America and Caribbean", "Middle East and Northern Africa", "North America", "Southeastern Asia", "Southern Asia", "Sub-Saharan Africa", "Western Europe"];
    const xScale =  d3.scaleBand().range([0, width]).domain(regions);
    const yScale = d3.scaleLinear().range([height, 0]).domain([0, d3.max(data, d => d.happiness_score_avg)]).nice();
    const line = d3.line().x(d => xScale(d.date)).y(d => yScale(d.happiness_score_avg));
    const xTicks = xScale.domain();
    const yTicks = yScale.ticks();
    
}