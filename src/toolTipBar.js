import React from "react";

export function ToolTipBar(props){
    const {d, left, top} = props;
    console.log(left);
    //console.log(d);
    if (left === null) {
        return <div></div>;
    } else {
        const divStyle = {
            position: "absolute",
            textAlign: "left",
            width: "180px",
            height: "100px",
            padding: "2px",
            font: "18px Georgia",
            background: "#DAB5FFE6",
            border: "0px",
            borderRadius: "8px",
            pointerEvents: "none",
            left: `${left+10}px`,
            top: `${top}px`
        };
        return <div style={divStyle} >
            <p>{d.country} {d.year}</p>
            <ul> 
            <li>Rank: {d.happiness_rank}</li>
            <li>Score: {d.happiness_score}</li>
            </ul>
            </div>
    };  
    return <></>
}
