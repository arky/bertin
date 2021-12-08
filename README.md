# bertin

***An easy to use wrapper around d3js to facilitate the process of making thematic maps***

## Testing phase

> npm publish --dry-run

https://observablehq.com/d/4113b173ec452c29

## Installation

### In browser

```html
<script src="index.min.js" charset="utf-8"></script>
```

### In observable

~~~js
bertin = require("https://bundle.run/bertin@0.0.34")
~~~

## Documentation

<b>plot</b>() is the main function of the library. It allows you to make various thematic maps. It allows to display and overlay different types of layers listed below. The layers written on top are displayed first.
Plot is the main function of the library. It allows you to make various thematic maps. It allows to display and overlay different types of layers listed below. The layers written on top are displayed first.

**Global parameters**

In section *params* we define the global parameters of the map: its size, projection, background color, etc. This section is optionnal.

~~~js
bertin.plot({
  params: {
    projection: d3.geoBertin1953(),
    width: 750,
  },
  layers: [...]
})
~~~

<details><summary>See parameters</summary>

- <b>projection</b>: a function defining the map projection. Cf d3-geo-projection@4 (default: d3.geoPatterson())
- <b>width</b>: width of the map (default:1000);
- <b>extent</b>: a feature defing the extent e.g. a country (default:null)
- <b>background</b>: color of the background (default:"none")

</details>

#### Layers

**Texts**

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco. [Source](https://github.com/neocarto/bertin/blob/main/src/text.js). [Example](https://observablehq.com/d/95fcfac18b213daf?collection=@neocartocnrs/bertin).

~~~js
bertin.plot({
  layers: [
    {
      type: "text",
      text: "bottomright",
      position: "bottomright",
      fontsize: 20,
      baseline: "middle",
      frame_stroke: "red",
      margin: 4
    }
  ]
})
~~~

<details><summary>See parameters</summary>

- <b>position</b>: position of the text. It can be an array with x,y coordinates. For example [100,200]. It can be also a string defining the position. "topleft", "top", "topright", "left", "middle", "right", "bottomleft", "bottom", "bottomright" (default: "topleft")
- <b>text</b>: text to display. With the backticks, it is possible to display a text on several lines (default: "Your text here!")
- <b>fontsize</b>: text size (default: 15)
- <b>margin</b>: margin around the text (default: 0)
- <b>anchor</b>: text anchor. start, middle, end (default: "start")
- <b>baseline</b>: alignment baseline. "baseline", "middle", "hanging" (default:"hanging")
- <b>fill</b>: text color (default: "#474342")
- <b>stroke</b>: stroke color (default: "none")
- <b>frame_fill</b>: frame background color (default:"none")
- <b>frame_stroke</b>: frame stroke color (default: "none")
- <b>frame_strokewidth</b>: thickness of the frame contour (default: 1)
- <b>frame_opacity</b>: frame opacity (default: 1)

</details>

#### Legend

xxxx

_______________


#### Match() [source]() [examples]()

**match()** returns a chart showing the quality of the compatibility between the data and the basemap.

~~~js
match(geojson, geom_id, data, data_id)
~~~

with

- geojson: a geojson
- geom_id: id for geometries
- data: data file in json
- data_id: id for data

~~~js
match(countries, geom_id, maddison, data_id).unmatched_data
~~~

returs an array containing data ids that cannot be joined to the basemap.

On the same principle:

~~~js
match(geojson, geom_id, data, data_id).matched
match(geojson, geom_id, data, data_id).unmatched_geom
match(geojson, geom_id, data, data_id).unmatched_data
match(geojson, geom_id, data, data_id).matched_data
match(geojson, geom_id, data, data_id).matched_geom
~~~


### plot()

<ins>Global parameters</ins>

- width: wdth of the map (default: 1000)
- projection: map projection (default: d3.geoPatterson())
- extent: a geojson to determine the extent of the map (default:null)

*All these parameters are optional.*

<ins>type: outline</ins>

* All these parameters are optional.

<ins>type: graticule</ins>

* All these parameters are optional.*

<ins>type: header</ins>

* All these parameters are optional.*

<ins>type: footer</ins>

* All these parameters are optional.*

<ins>type: layer</ins>

* All these parameters are optional.*

Example

~~~js
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script src="http://localhost/npm_test/bertin/index.min.js"></script>
<script>
  d3.json(
  "https://gisco-services.ec.europa.eu/distribution/v2/countries/geojson/CNTR_RG_60M_2020_4326.geojson"
).then(r =>
document.body.appendChild(bertin.plot({
  layers: [{ type: "layer", geojson: r,  tooltip: ["CNTR_ID", "CNTR_NAME", ""] }]
})));
</script>
~~~

<ins>type: prop</ins>

* All these parameters are optional.*
