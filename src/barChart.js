
import React from "react";
import { scaleLinear, scaleBand, max, map, descending } from "d3";

const csvUrl = 'https://raw.githubusercontent.com/SilvesterYu/DATS-SHU235-Information-Visualization-Final-Project/main/src/data/binnined_final_version_data.csv';

const mouseEnter = (d, event) => {
    console.log("Enter");
}
const mouseOut = (event) => {
    console.log("Out");
}


function BarChart(props) {
    const { offsetX, offsetY, data, height, width, selectedStation, setSelectedStation, selectedRank } = props;
    console.log("plotting barChart");

    // -- Q2.6 make bars sorted (May) -- //
    // -- Q2.6 make bars sorted (May) -- //
    let maySort = data.sort(function (x, y) {
        return descending(x.happiness_score, y.happiness_score);
    })

    //   const xScale = Scales.band(maySort.map(d => `${d.happiness_score}`), 0, width);


    var selectedInt = 10000000;
    if (selectedRank.label) {
        selectedInt = parseInt(selectedRank.label.split(" ")[1]);
    }



    const filteredCountry = maySort.filter(
        (d) => d.happiness_rank <= selectedInt
    ); // Todo: apply string methods to remove spaces



    const xScale = scaleBand().range([0, width]).domain(map(filteredCountry, d => d.happiness_score));
    const yScale = scaleLinear().range([height, height * 0.1]).domain([0, max(filteredCountry, d => d.happiness_score)]).nice();

    if (selectedInt >= 1) {

        return (
            <svg width={width + 10} height={height + 10}>
                <text style={{ fontSize: '15px' }} transform={`translate(${(width / 2) - 10}, 13)`} fill={"black"}>Displaying {selectedInt <= 1000 ? 'top ' : ''}{selectedInt <= 1000 ? selectedInt : 'all'} countries</text>
                <line x1={0} x2={0} y1={0} y2={height} stroke="black" />
                <line x1={0} x2={width} y1={height} y2={height} stroke='black' />

                {yScale.ticks(5).map(tickValue =>
                    <g key={tickValue} transform={`translate(-10, ${yScale(tickValue)})`}>
                        <line x2={10} stroke='black' />
                        <text style={{ textAnchor: 'end', fontSize: '10px' }} >
                            {tickValue}
                        </text>
                    </g>)}



                {filteredCountry.map(d => {
                    return (
                        <rect stroke={"black"} key={d.year + "_" + d.country} x={xScale(d.happiness_score)} y={yScale(d.happiness_score)}
                            height={height - yScale(d.happiness_score)} fill={'#7b1fa2'} width={xScale.bandwidth()}
                            onMouseEnter={(event) => mouseEnter(d, event)} onMouseOut={(event) => mouseOut(event)}></rect>
                    )
                })}

{xScale.domain().map(tickValue =>
                <g key={tickValue+'B'} transform={`translate(${xScale(tickValue)}, 0)`}>
                    <line y2={height} />
                    <text style={{textAnchor: 'country', fontSize:'10px' }} y={height+3} transform={`rotate(75, 0, ${height+3})`}>
                        {tickValue}
                    </text>
                </g>
            )}
                Sorry, your browser does not support inline SVG.
            </svg>
        );
    } else {
        return <div>No countries selected. Please select the dropdown menu for bar chart.</div>;
    };


}

export { BarChart };