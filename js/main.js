const ny_crime = dfjs.DataFrame.fromCSV('https://gist.githubusercontent.com/justinhodev/349f8d1f62c7568b65124e3e5065c905/raw/bb726161d66c3537e3e1e5f3e5775c3a5a4fbb43/nyc-crime-index.csv');
const Counties = ['Bronx', 'Kings', 'New York', 'Queens', 'Richmond'];
const CrimeTypes = [
    {column: 'Index Count', name: 'Total Crime'}, 
    {column: 'Firearm Count', name: 'Firearm Crime'}, 
    {column: 'Property Count', name: 'Property Crime'}, 
    {column: 'Violent Count', name: 'Violence Crime'},
];

// get data from csv
ny_crime.then((df) => {
    // create new DataFrame object with new specs
    let columns = ["Crime", "County", "Amount"];
    let data = [];
    Counties.map((county) => {
        let filtered = df.filter((row) => {
            return (row.get('Year') >= 2015 && row.get('County') === county);
        });

        CrimeTypes.map((crime) => {
            let row = {
                Crime: crime.name,
                County: county,
                Amount: filtered.stat.sum(crime.column),
            };
            data.push(row);
        });
    });

    let crime_data = new dfjs.DataFrame(data, columns);
    crime_data.show();

    // change to JS object and insert into spec object (nyc)
    nyc.datasets['crime-data'] = crime_data.toCollection();

    // render the visuals
    vegaEmbed('#vis', nyc, {
        // "actions": false // disable the floating button
    }).then((result) => {
        // TODO see how to change HTML text from vega spec
        // change first select option text (null to All)
        document.querySelector("option[value='null']").innerHTML = "All";
        // console.log(result.view); // show vega object
        // console.dir(result.view.data('crime-data')); // see compiled data from fold operation on crime
        console.dir(result.view.data('data_2')); // see compiled data from fold operation on crime
    }).catch(err => console.log(err));
});