import { grid } from "../helpers/grid.js";
import { geoIdentity, geoPath } from "d3-geo";
import { contourDensity } from "d3-contour";
import { scaleSequentialQuantile } from "d3-scale";
import * as d3scalechromatic from "d3-scale-chromatic";
import { map, sum } from "d3-array";

const d3 = Object.assign({}, d3scalechromatic, {
  sum,
  contourDensity,
  geoIdentity,
  geoPath,
  scaleSequentialQuantile,
});

export function smooth(
  selection,
  projection,
  options = {},
  clipid,
  width,
  height
) {
  // Variables
  let display = options.display == false ? false : true;
  let reverse = options.reverse == undefined ? false : options.reverse;
  let fill = options.fill ? options.fill : "RdYlGn";
  let strokeLinecap = options.strokeLinecap ? options.strokeLinecap : "round";
  let strokeLinejoin = options.strokeLinejoin
    ? options.strokeLinejoin
    : "round";
  let strokeDasharray =
    options.strokeDasharray != undefined ? options.strokeDasharray : "none";
  let stroke = options.stroke ? options.stroke : "none";
  let strokeWidth =
    options.strokeWidth != undefined ? options.strokeWidth : 0.5;
  let fillOpacity =
    options.fillOpacity != undefined ? options.fillOpacity : 0.5;
  let strokeOpacity =
    options.strokeOpacity != undefined ? options.strokeOpacity : 1;

  let remove = options.remove != undefined ? options.remove : 0;
  let thresholds = options.thresholds != undefined ? options.thresholds : 100;
  let bandwidth = options.bandwidth != undefined ? options.bandwidth : 5;
  let cellsize = options.cellSize != undefined ? options.cellSize : 1;
  let colorcurve = options.colorcurve != undefined ? options.colorcurve : 2;

  if (display) {
    let data;

    if (options.grid_step != undefined || options.grid_blur != undefined) {
      let grid_step = options.grid_step != undefined ? options.grid_step : 20;
      let grid_blur = options.grid_blur != undefined ? options.grid_blur : 0;

      options.geojson = grid({
        geojson: options.geojson,
        projection: projection,
        width: width,
        height: height,
        step: grid_step,
        values: options.values,
        blur: grid_blur,
      });

      data = decompose(options.geojson, "value", 1000, d3.geoIdentity());

      // console.log("GRID");
      // console.log(data);
    } else {
      data = decompose(options.geojson, options.values, 1000, projection);

      // console.log("PAS GRID");
      // console.log(data);
    }

    let contour = d3
      .contourDensity()
      .x((d) => d[0])
      .y((d) => d[1])
      .size([width, height])
      .bandwidth(bandwidth)
      .thresholds(thresholds)
      .cellSize(cellsize);

    let contours = contour(data);

    let pal = new Map([
      ["Blues", d3.interpolateBlues],
      ["Greens", d3.interpolateGreens],
      ["Greys", d3.interpolateGreys],
      ["Oranges", d3.interpolateOranges],
      ["Purples", d3.interpolatePurples],
      ["Reds", d3.interpolateReds],
      ["BrBG", d3.interpolateBrBG],
      ["PRGn", d3.interpolatePRGn],
      ["PiYG", d3.interpolatePiYG],
      ["PuOr", d3.interpolatePuOr],
      ["RdBu", d3.interpolateRdBu],
      ["RdYlBu", d3.interpolateRdYlBu],
      ["RdYlGn", d3.interpolateRdYlGn],
      ["Spectral", d3.interpolateSpectral],
      ["Turbo", d3.interpolateTurbo],
      ["Viridis", d3.interpolateViridis],
      ["Inferno", d3.interpolateInferno],
      ["Magma", d3.interpolateMagma],
      ["Plasma", d3.interpolatePlasma],
      ["Cividis", d3.interpolateCividis],
      ["Warm", d3.interpolateWarm],
      ["Cool", d3.interpolateCool],
      ["CubehelixDefault", d3.interpolateCubehelixDefault],
      ["BuGn", d3.interpolateBuGn],
      ["BuPu", d3.interpolateBuPu],
      ["GnBu", d3.interpolateGnBu],
      ["OrRd", d3.interpolateOrRd],
      ["PuBuGn", d3.interpolatePuBuGn],
      ["PuBu", d3.interpolatePuBu],
      ["PuRd", d3.interpolatePuRd],
      ["RdPu", d3.interpolateRdPu],
      ["YlGnBu", d3.interpolateYlGnBu],
      ["YlGn", d3.interpolateYlGn],
      ["YlOrBr", d3.interpolateYlOrBr],
      ["YlOrRd", d3.interpolateYlOrRd],
      ["Rainbow", d3.interpolateRainbow],
      ["Sinebow", d3.interpolateSinebow],
    ]);

    let color;

    if (reverse) {
      color = d3.scaleSequentialQuantile(
        [...contours.map((d) => d.value)],
        (t) => pal.get(fill)(Math.pow(0.01 + t, 1 / colorcurve))
      );
    } else {
      color = d3.scaleSequentialQuantile(
        [...contours.map((d) => d.value)],
        (t) => pal.get(fill)(1 - Math.pow(0.01 + t, 1 / colorcurve))
      );
    }

    contours.splice(0, remove);

    selection
      .append("g")
      .attr("clip-path", clipid == null ? `none` : `url(#clip_${clipid})`)
      .selectAll("path")
      .data(contours)
      .join("path")
      .attr("d", d3.geoPath())
      .attr("fill", (d) => color(d.value))
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth)
      .attr("fill-opacity", fillOpacity)
      .attr("stroke-opacity", strokeOpacity)
      .attr("stroke-linecap", strokeLinecap)
      .attr("stroke-linejoin", strokeLinejoin)
      .attr("stroke-dasharray", strokeDasharray);

    //   console.log(options.geojson);

    //   simple(selection, geoIdentity(), options, clipid, width, height);
  }
}

function decompose(geojson, values, nb = 10000, projection) {
  // number of dots
  let k = 1;
  let total = d3.sum(geojson.features.map((d) => d.properties[values]));
  if (total > nb) {
    k = total / nb;
  }

  let result = [];
  geojson.features.forEach((d) => {
    let coords = projection(d.geometry.coordinates);

    let nb = Math.round(d.properties[values] / k);
    for (let i = 0; i <= nb; i++) {
      result.push(coords);
    }
  });

  return result;
}
