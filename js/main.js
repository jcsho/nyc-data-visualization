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
}

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
            index: df.stat.sum('Index Count'),
            firearm: df.stat.sum('Firearm Count'),
            violence: df.stat.sum('Violent Count'),
            property: df.stat.sum('Property Count'),
        }
        return crimes;
    }));

    return counties;
}
/**
 * get crime for set year onwards
 * @param {Number} minYear - minimum year to filter by
 * @return {Array} DataFrame dictionnaries
 */
const getCrimesByYear = async (minYear) => {
    let df = await ny_crime;
    df = df.filter(row => row.get('Year') >= minYear);
    return df;
}

getAllCrimeStat(Counties).then(async (counties) => {
    let table = document.querySelector('.table--inject-data');
    
    table.innerHTML = /*html*/`
        <tr class="table__row">
            <th class="table__heading">County</th>
            <th class="table__heading">Total Crimes</th>
            <th class="table__heading">Firearm Crimes</th>
            <th class="table__heading">Violence Crimes</th>
            <th class="table__heading">Property Crimes</th>  
        </tr>
    `;

    await Promise.all(counties.map((county) => {
        let row = /*html*/`
            <tbody class="table__body">
                <tr class="table__row">
                    <td class="table__text">${county.name}</td>
                    <td class="table__text">${county.index}</td>
                    <td class="table__text">${county.firearm}</td>
                    <td class="table__text">${county.violence}</td>
                    <td class="table__text">${county.property}</td>
                </tr>
            </tbody>
        `
        table.innerHTML += row;
    }));
}).catch(err => console.log(err));