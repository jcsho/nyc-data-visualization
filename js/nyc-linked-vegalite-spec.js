const nyc = {
  "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
  "datasets": {
    "crime-data": [],
  },
  "data": {
    "name": "census-data",
    "url": "https://gist.githubusercontent.com/justinhodev/bbe43324cbf228095e47bb471e5930f2/raw/632f57b671376fa8dcc3a8d5755e3004204da326/nyc_census_tracts.csv",
    "format": {
      "type": "csv"
    }
  },
  "transform": [
    {
      "filter": "datum.TotalPop > 0 && datum.Income > 0"
    },
    {
      "sample": 1000
    }
  ],
  "config": {
    "style": {
      "guide-label": {
        "fill": "#525253",
      },
      "guide-title": {
        "fill": "#525253",
        "titlePadding": 30,
      }
    },
    "title": {
      "color": "#525253",
      "offset": "20",
    },
    "legend": {
      "orient": "left",
      "offset": "35",
    }
  },
  "columns": 2,
  "concat": [{
      "data": {"name": "census-data"},
      "encoding": {
        "color": {
          "condition": {
            "field": "County",
            "selection": {"or": ["input", "brush"]},
            "type": "nominal",
            "scale": {
              "scheme": "tableau10"
            },
          },
          "value": "lightgrey"
        },
        "x": {
          "axis": {
            "title": "Population",
          },
          "field": "TotalPop",
          "type": "quantitative"
        },
        "y": {
          "axis": {
            "title": "Income"
          },
          "field": "Income",
          "type": "quantitative"
        }
      },
      "title": "Household Income in New York",
      "mark": "point",
      "selection": {
        "brush": {
          "type": "interval",
          "resolve": "global",
        },
        "input": {
          "type": "single",
          "fields": ["County"],
          "bind": {
            "name": "County",
            "input": "select",
            "options": [null, "Bronx", "Kings", "New York", "Queens", "Richmond"]
          }
        }
      }
    },
    {
      "data": {"name": "census-data"},
      "transform": [
        {
          "filter": {
            "selection": "brush",
          }
        },
        {
        "fold": ["Construction", "Office", "Production", "Professional", "Service"],
        "as": ["Industry", "Count"]
        }
      ],
      "encoding": {
        "x": {
          "field": "Industry",
          "type": "nominal",
          "axis": {
            "title": "Industry",
            "labelAngle": "45",
          }
        },
        "y": {
          "axis": {
            "title": "Number of Workers"
          },
          "aggregate": "sum",
          "field": "Count",
          "type": "quantitative"
        },
        "color": {
          "condition": {
            "field": "County",
            "type": "nominal",
            "selection": "input",
            "scale": {
              "scheme": "tableau10"
            },
          },
          "value": "lightgray",
        }
      },
      "title": "Distribution of New Yorkers in the Workforce",
      "mark": "bar",
      "selection": {
        "click": {
          "encodings": ["color"],
          "type": "multi"
        }
      }
    },
    {
      "data": {"name": "crime-data"},
      "encoding": {
        "x": {
          "axis": {
            "title": "Type of Crime",
            "labelAngle": "45",
          },
          "field": "Crime",
          "type": "nominal"
        },
        "y": {
          "axis": {
            "title": "Number of Incidents"
          },
          "field": "Amount",
          "type": "quantitative"
        },
        "color": {
          "condition": {
            "field": "County",
            "type": "nominal",
            "selection": "input",
            "scale": {
              "scheme": "tableau10"
            },
          },
          "value": "lightgray",
        }
      },
      "title": "Record of Crime in New York",
      "mark": "bar",
    }
  ]
}