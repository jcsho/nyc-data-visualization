const nyc = {
    "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
    "data": {
      "url": "https://gist.githubusercontent.com/justinhodev/bbe43324cbf228095e47bb471e5930f2/raw/632f57b671376fa8dcc3a8d5755e3004204da326/nyc_census_tracts.csv",
      "format": {"type": "csv"}
    },
    "transform": [
      {
        "lookup": "County",
        "from": {
          "data": {
            "url": "https://gist.githubusercontent.com/justinhodev/349f8d1f62c7568b65124e3e5065c905/raw/bb726161d66c3537e3e1e5f3e5775c3a5a4fbb43/nyc-crime-index.csv"
          },
          "key": "County",
          "fields": ["Index Count", "Property Count", "Violent Count", "Firearm Count"]
        }
      },
      {
        "filter": "datum.TotalPop > 0 && datum.Income > 0"
      },
      {
        "sample": 600
      }
    ],
    "columns": 2,
    "concat": [
      {
        "transform": [
          {
            "fold": ["Construction", "Office", "Production", "Professional", "Service"],
            "as": ["Industry", "Count"]
          },
          {
            "filter": { "selection": "brush" }
          }
        ],
        "encoding": {
          "x": {
            "field": "Industry",
            "type": "nominal",
          },
          "y": {
            "axis": {"title": "Number of Workers"},
            "aggregate": "sum",
            "field": "Count",
            "type": "quantitative"
          },
          "color": {
            "condition": {
              "field": "County",
              "type": "nominal",
              "selection": "click"
            },
            "value": "lightgray"
          }
        },
        "title": "Distribution of New Yorkers in the Workforce",
        "width": 400,
        "height": 300,
        "mark": "bar",
        "selection": {
          "click": {
            "encodings": ["color"],
            "type": "multi"
          }
        }
      },
      {
        "encoding": {
          "color": {
            "condition": {
              "title": "County",
              "field": "County",
              "selection": "brush",
              "type": "nominal"
            },
            "value": "lightgrey"
          },
          "x": {
            "axis": {"title": "Population"},
            "field": "TotalPop",
            "type": "quantitative"
          },
          "y": {
            "axis": {"title": "Income"},
            "field": "Income",
            "type": "quantitative"
          }
        },
        "title": "Household Income in New York",
        "width": 400,
        "height": 300,
        "mark": "point",
        "selection": {"brush": {"type": "interval"}},
        "transform": [{"filter": {"selection": "click"}}]
      },
      {
        "transform": [
          {
            "fold": ["Index Count", "Property Count", "Violent Count", "Firearm Count"],
            "as": ["Crime", "Values"]
          },
          {"filter": {"selection": "brush"}}
        ],
        "encoding": {
          "x": {
            "axis": {"title": "Type of Crime"},
            "field": "Crime",
            "type": "nominal"
          },
          "y": {
            "axis": {"title": "Number of Incidents"},
            "aggregate": "sum", 
            "field": "Values", 
            "type": "quantitative"
          },
          "color": {
            "condition": {"field": "County", "type": "nominal", "selection": "click"},
            "value": "lightgray"
          }
        },
        "title": "Record of Crime in New York",
        "width": 400,
        "height": 300,
        "mark": "bar",
        "selection": {
          "click": {
            "encodings": ["color"], 
            "type": "multi"
          }
        }
      }
    ]
  }