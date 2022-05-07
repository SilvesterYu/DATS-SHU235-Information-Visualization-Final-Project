import * as d3 from "d3";
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell } from "recharts";

function ToolTip(props) {

    const { selectedRegion, offsetX, offsetY, data, height, width } = props;

    const [copyCountryData, setCopyCountryData] = React.useState(null);

    const [currentCountryData, setCurrentCountryData] = React.useState(null);

    useEffect(() => {
        //Runs on the first render
        //And any time any dependency value changes

        // -- data from the selected country -- //
        if (selectedRegion != "" && selectedRegion != null) {
            const countryData = data.filter(
                (d) => d.country === selectedRegion.split("--")[0].split("_").join(" ")
            );

            // console.log(countryData[0]);
            setCurrentCountryData({country: countryData[0].country,
                rank: countryData[0].happiness_rank ,
                score: countryData[0].happiness_score});

            console.log(currentCountryData);

            setCopyCountryData(
                [
                    { name: "Dystopia Residual", value: countryData[0].dystopia_residual },
                    {name: "Economy GDP per Capita", value: countryData[0].economy_GDP_per_capita },
                    { name: "Family", value: countryData[0].family },
                    { name: "Freedom", value: countryData[0].freedom },
                    { name: "Generosity", value: countryData[0].generosity },
                    { name: "Health Life Expectancy", value: countryData[0].health_life_expectancy },
                    { name: "Trust Government Corruption", value: countryData[0].trust_government_corruption }
                ]);
            // console.log(copyCountryData);
            // console.log(offsetX, offsetY);
            // --pie chart-- //
        } else {
            setCopyCountryData(null);
        }

        console.log("Hook Called");
    }, [props,selectedRegion]);

    //   Remove all containers before rendering
    // const tooltip_containers = document.querySelectorAll('.pie-tooltip-container');

    // tooltip_containers.forEach(tooltip_container => {
    //     tooltip_container.remove();
    // });

    // if (selectedRegion != "" && selectedRegion != null) {
    //     var tooltip = d3.select("body").append("div").attr('class', 'pie-tooltip-container').style("background-color", "#ffffff").style("width", "100px").style("border", "solid 1px black").style("height", "100px").style("position", "absolute").style("top", (offsetY + 30) + "px").style("left", (offsetX + 5) + "px");
    //     console.log(tooltip);
    // } else {
    //     const tooltip_containers = document.querySelectorAll('.pie-tooltip-container');

    //     tooltip_containers.forEach(tooltip_container => {
    //         tooltip_container.remove();
    //     });
    // }

    if(copyCountryData){
    return <div style={{backgroundColor:"#fff",border:"1px solid #000",paddingRight:"10px",borderRadius:"10px",paddingTop:"10px", textAlign: "center",position:"absolute",top:(offsetY + 30) + "px", left:(offsetX + 5) + "px"}}>
      { copyCountryData ? <b >{currentCountryData.country} | Rank - {currentCountryData.rank} | Score - {currentCountryData.score} </b> : <></> }
<PieChart width={730} height={250}>
        <Pie data={copyCountryData} isAnimationActive={false} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8" />
        <Pie data={copyCountryData} isAnimationActive={false} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            value,
            index
        }) => {
            // console.log(copyCountryData[index].name);
            const RADIAN = Math.PI / 180;
            // eslint-disable-next-line
            const radius = 25 + innerRadius + (outerRadius - innerRadius);
            // eslint-disable-next-line
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            // eslint-disable-next-line
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
                <text
                    x={x}
                    y={y}
                    fill="#8884d8"
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                >
                    {copyCountryData[index].name} : {value}
                </text>
            );
        }} />
    </PieChart>
    </div>;
    }
    else{
        return <></>;
    }
}

export { ToolTip };