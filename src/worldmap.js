import React from "react";
import { geoPath, geoEqualEarth, geoMercator } from "d3-geo";
// import { feature } from "topojson-client";

export function WorldMap(props) {
  const {
    map,
    colormap,
    projection,
    width,
    height,
    data,
    hoveredLegend,
    selectedRank,
  } = props;

  let path = geoPath(geoEqualEarth()); // the default projection
  if (projection === "geoEqualEath") {
    path = geoPath(geoEqualEarth().fitSize([width, height], map));
  }
  if (projection === "geoMercator") {
    path = geoPath(geoMercator().fitSize([width, height], map));
  }
  // -- dropdown menu -- //
  var selectedInt = 10000000;
  if (selectedRank.label) {
    selectedInt = parseInt(selectedRank.label.split(" ")[1]);
  }
  // console.log(path({type:"Sphere"}));
  // -- use income level to filter out the data that belongs to this income level: filter the data with income level the same as the selected legend -- //
  const filteredData = data.filter((d) => d.happiness_level === hoveredLegend);
  // -- control the opacity by hover legend -- //
  const opacity = hoveredLegend ? 0.5 : 1;

  if (!selectedRank.label || selectedRank.label === "none") {
    return (
      <g>
        {/* <path className={'sphere'} d={path({type: 'Sphere'})} /> */}
        {map.features.map((feature) => {
          const country = data.filter(
            (d) => d.country === feature.properties.name
          ); // Todo: apply string methods to remove spaces
          if (country[0]) {
            return (
              <path
                key={feature.properties.name + "boundary"}
                className={"boundary"}
                id={
                  country[0].country.replace(/ /g, "_") +
                  "--" +
                  country[0].region.replace(/ /g, "_")
                }
                d={path(feature)}
                opacity={opacity}
                // -- ordinal color scale -- //
                style={{ fill: colormap(country[0].happiness_level) }}
                // -- continuous color scale -- //
                //style={{fill:colormap(country[0].happiness_score)}}
              />
            );
          } else {
            return (
              <path
                key={feature.properties.name + "boundary"}
                className={"boundaryNone"}
                d={path(feature)}
                opacity={opacity}
              />
            );
          }
        })}
        {map.features.map((feature) => {
          const country = filteredData.filter(
            (d) => d.country === feature.properties.name
          );
          if (country[0]) {
            {
              /* console.log(country); */
            }
            return (
              <path
                key={feature.properties.name + "boundary"}
                className={"boundary"}
                d={path(feature)}
                style={{ fill: colormap(country[0].income_grp) }}
              />
            );
          } else {
            if (hoveredLegend === "6. Unknown") {
              const country = data.filter(
                (d) => d.country === feature.properties.name
              );
              if (!country[0]) {
                return (
                  <path
                    key={feature.properties.name + "boundary"}
                    className={"boundary"}
                    d={path(feature)}
                    style={{ fill: "blue" }}
                  />
                );
              }
            }
            return <g key={feature.properties.name + "boundary"}></g>;
          }
        })}
      </g>
    );
  } else {
    return (
      <g>
        {/* <path className={'sphere'} d={path({type: 'Sphere'})} /> */}
        {map.features.map((feature) => {
          const country = data.filter(
            (d) => d.country === feature.properties.name
          ); // Todo: apply string methods to remove spaces
          if (country[0]) {
            {
              /* // -- filter out the top X countries -- // */
            }
            if (country[0].happiness_rank <= selectedInt) {
              return (
                <path
                  key={feature.properties.name + "boundary"}
                  className={"boundary"}
                  d={path(feature)}
                  id={
                    country[0].country.replace(/ /g, "_") +
                    "--" +
                    country[0].region.replace(/ /g, "_")
                  }
                  opacity={opacity}
                  // -- ordinal color scale -- //
                  style={{ fill: colormap(country[0].happiness_level) }}
                  // -- continuous color scale -- //
                  //style={{fill:colormap(country[0].happiness_score)}}
                />
              );
            } else {
              return (
                <path
                  key={feature.properties.name + "boundary"}
                  className={"boundary"}
                  d={path(feature)}
                  opacity={opacity}
                />
              );
            }
          } else {
            return (
              <path
                key={feature.properties.name + "boundary"}
                className={"boundary"}
                d={path(feature)}
                opacity={opacity}
              />
            );
          }
        })}
        {map.features.map((feature) => {
          const country = filteredData.filter(
            (d) => d.country === feature.properties.name
          );
          if (country[0]) {
            return (
              <path
                key={feature.properties.name + "boundary"}
                className={"boundary"}
                d={path(feature)}
                style={{ fill: colormap(country[0].income_grp) }}
              />
            );
          } else {
            if (hoveredLegend === "6. Unknown") {
              const country = data.filter(
                (d) => d.country === feature.properties.name
              );
              if (!country[0]) {
                return (
                  <path
                    key={feature.properties.name + "boundary"}
                    className={"boundary"}
                    d={path(feature)}
                    style={{ fill: "blue" }}
                  />
                );
              }
            }
            return <g key={feature.properties.name + "boundary"}></g>;
          }
        })}
      </g>
    );
  }
}