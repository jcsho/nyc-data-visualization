const ny_crime = dfjs.DataFrame.fromCSV('https://gist.githubusercontent.com/justinhodev/349f8d1f62c7568b65124e3e5065c905/raw/bb726161d66c3537e3e1e5f3e5775c3a5a4fbb43/nyc-crime-index.csv');
const Counties = ['Bronx', 'Kings', 'New York', 'Queens', 'Richmond'];
const CrimeTypes = [
    {column: 'Index Count', name: 'Total Crime'}, 
    {column: 'Firearm Count', name: 'Firearm Crime'}, 
    {column: 'Property Count', name: 'Property Crime'}, 
    {column: 'Violent Count', name: 'Violence Crime'},
];

const getCrimeByYear = async (df, year) => {
    let data = await df;
    data = data.filter(row => row.get('Year') == year);
    return data.stat.sum('Index Count');
}

// get data from csv
ny_crime.then((df) => {
    // create new DataFrame object with new specs
    let columns = ["Crime", "County", "Amount"];
    let data = [];
    Counties.map((county) => {
        // filter out data older than 2015
        let filtered = df.filter((row) => {
            return (row.get('Year') == 2015 && row.get('County') === county);
        });

        // get sum for each crime type
        CrimeTypes.map((crime) => {
            let row = {
                Crime: crime.name,
                County: county,
                Amount: parseInt(filtered.stat.sum(crime.column)),
            };
            data.push(row);
        });
    });

    let crime_data = new dfjs.DataFrame(data, columns);
    // crime_data.show(); // debug

    // change to JS object and insert into spec object (nyc)
    nyc.datasets['crime-data'] = crime_data.toCollection();

    // TODO change default settings to fit smaller screens
    // change size of graph for large screens
    if (window.innerWidth > 900) {
        nyc.concat.forEach((item) => {
            item.width = window.innerWidth / 4;
            item.height = window.innerWidth / 4;
        })
    }

    // change graph layout for smaller screens
    if (window.innerWidth < 900) {
        nyc.columns = 1;
        nyc.config.legend.orient = "top";
        nyc.config.legend.direction = "vertical";
    }

    // render the visuals
    vegaEmbed('#vis', nyc, {
        "actions": false // * disable the floating button
    }).then((result) => {
        // TODO see how to change HTML text from vega spec
        // * change first select option text (null to All)
        document.querySelector("option[value='null']").innerHTML = "All";

        // TODO add event listener for screen size changes (responsive)
        // console.log(result.view); // show vega object
        // console.dir(result.view.data('crime-data')); // see compiled data from fold operation on crime
        // console.dir(result.view.data('data_2')); // see compiled data from fold operation on crime
    }).catch(err => console.log(err));
});