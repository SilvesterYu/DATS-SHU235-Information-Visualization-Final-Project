import React from "react";

export function Legend(props) {
    const {x, y, colormap, incomeLevels} = props;
        const w = 15;
        const h = 20;
        return <g transform = {`translate(${x}, ${y})`}>
            {incomeLevels.map( (d,idx) => {
                // -- each level, represented by a rect -- //
                return <rect key={idx+"legend"} x={0} y={idx*h} width={w} height={h} 
                style={{fill:colormap(d)}} />
            } )}
            {incomeLevels.map((d, idx) => {
                return <text key={idx+"legendText"} x={20} y={idx*h+15}>
                    {d}
                </text>
            } )}
        </g>
}