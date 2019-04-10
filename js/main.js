const ny_crime = dfjs.DataFrame.fromCSV('https://gist.githubusercontent.com/justinhodev/349f8d1f62c7568b65124e3e5065c905/raw/bb726161d66c3537e3e1e5f3e5775c3a5a4fbb43/nyc-crime-index.csv');
const Counties = ['Bronx', 'Kings', 'New York', 'Queens', 'Richmond'];

/**
 * get crime types for 2015 onwards
 * @param {String} county - any New York County from csv
 * @return {Object} DataFrame object
 */
const getCrimesByCounty = async (county) => {
    let df = await ny_crime;
    df = df.chain(
        row => row.get('Year') >= 2015,
        row => row.get('County') == county,
    );
    return df;
};

/**
 * Get all crime data for specified New York county
 * @param {Array} counties - List of New York counties to get crime data for
 * @return {Array[Object]} crime statistics for input counties
 */
const getAllCrimeStat = async (counties) => {
    counties = await Promise.all(counties.map(async (county) => {
        let df = await getCrimesByCounty(county);
        let crimes = {
            name: county,
            index: parseFloat(df.stat.mean('Index Count').toPrecision(3)),
            firearm: parseFloat(df.stat.mean('Firearm Count').toPrecision(3)),
            violence: parseFloat(df.stat.mean('Violent Count').toPrecision(3)),
            property: parseFloat(df.stat.mean('Property Count').toPrecision(3)),
        }
        return crimes;
    }));

    return counties;
};

/**
 * get crime for set year onwards
 * @param {Number} minYear - minimum year to filter by
 * @return {Array} DataFrame dictionnaries
 */
const getCrimesByYear = async (minYear) => {
    let df = await ny_crime;
    df = df.filter(row => row.get('Year') >= minYear);
    return df;
};

// create tabular data from graphs
// getAllCrimeStat(Counties).then((counties) => {
//     let table = document.querySelector('.table--inject-data');

//     table.innerHTML = /*html*/ `
//         <tr class="table__row">
//             <th class="table__heading">County</th>
//             <th class="table__heading">Total Crimes</th>
//             <th class="table__heading">Firearm Crimes</th>
//             <th class="table__heading">Violence Crimes</th>
//             <th class="table__heading">Property Crimes</th>  
//         </tr>
//     `;

//     counties.map((county) => {
//         let row = /*html*/ `
//             <tbody class="table__body">
//                 <tr class="table__row">
//                     <td class="table__text">${county.name}</td>
//                     <td class="table__text">${county.index}</td>
//                     <td class="table__text">${county.firearm}</td>
//                     <td class="table__text">${county.violence}</td>
//                     <td class="table__text">${county.property}</td>
//                 </tr>
//             </tbody>
//         `
//         table.innerHTML += row;
//     });
// }).catch(err => console.log(err));

// get data from csv
ny_crime.then((df) => {
    // filter out data that's not used (older than 2015 and not the 5 specified counties)
    df = df.filter((row) => {
        return (
            row.get('Year') >= 2015 &&
            (row.get('County') === 'Bronx' || 
            row.get('County') === 'Kings' || 
            row.get('County') === 'New York' || 
            row.get('County') === 'Queens' || 
            row.get('County') === 'Richmond')
        );
    });

    // df.show(); // show filtered data

    // change to JS object and insert into spec object (nyc)
    let crime_data = df.toCollection();
    nyc.transform[0].from.data.values = crime_data;

    // render the visuals
    vegaEmbed('#vis', nyc, {
        "actions": false
    }).then((result) => {
        // TODO see how to change HTML text from vega spec
        // change first select option text (null to All)
        document.querySelector("option[value='null']").innerHTML = "All";
        // console.log(result.view); // show vega object
    }).catch(err => console.log(err));
});