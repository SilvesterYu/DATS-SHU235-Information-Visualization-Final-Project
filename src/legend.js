import React from "react";

export function Legend(props) {
    const {x, y, colormap, incomeLevels, hoveredLegend, setHoveredLegend} = props;
        const w = 15;
        const h = 20;
        // const opacity = hoveredLegend && d !== hoveredLegend ? 0.5:1;
        const opacity = (d) => hoveredLegend && d !== hoveredLegend ? 0.5:1;
        return <g transform = {`translate(${x}, ${y})`}>
            {incomeLevels.map( (d, idx) => {
                return <rect key={idx+"legend"} x={0} y={h*(incomeLevels.length-1)-idx*h} width={w} height={h} 
                style={{fill:colormap(d)}} opacity={opacity(d)} 
                onMouseEnter={() => setHoveredLegend(d)} onMouseOut={() => setHoveredLegend(null)}/>
            } )}
            {incomeLevels.map((d, idx) => {
                return <text key={idx+"legendText"} x={20} y={h*(incomeLevels.length-1)-idx*h+15} opacity={opacity(d)}
                onMouseEnter={() => setHoveredLegend(d)} onMouseOut={() => setHoveredLegend(null)}>
                    {d}
                </text>
            } )}
            <g key={"unknow_rect"} >
                <rect x={0} y={h*incomeLevels.length} width={w} height={h} 
                opacity={hoveredLegend && "6. Unknown" !== hoveredLegend ? 0.5 : 1}
                style={{fill: "#9a9e9e"}} onMouseEnter={() => setHoveredLegend("6. Unknown")} onMouseOut={() => setHoveredLegend(null)} />
                <text x={20} y={incomeLevels.length*h+15} opacity={hoveredLegend && "6. Unknown" !== hoveredLegend ? 0.5 : 1}
                onMouseEnter={() => setHoveredLegend("6. Unknown")} onMouseOut={() => setHoveredLegend(null)}>
                        {"6. Unknown"}
                </text>
            </g>
        </g>
}