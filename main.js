const url = "https://gist.githubusercontent.com/justinhodev/bbe43324cbf228095e47bb471e5930f2/raw/632f57b671376fa8dcc3a8d5755e3004204da326/nyc_census_tracts.csv";

const margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
},
width = window.innerWidth - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

// setup x
const xScale = d3.scaleLinear().range([0, width]);

// setup y
const yScale = d3.scaleLinear().range([height, 0]);

// add graph to DOM
const svg = d3.select("#scatter-plot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// setup color
const color = d3.scaleOrdinal(d3.schemeCategory10);

// add tool tip
const tooltip = d3.select("#scatter-plot").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "#FFFFFF")
    .style("padding", "0.4em")
    .style("border", "1px solid #EEEEEE")
    .style("font-size", "0.8em");

d3.csv(url).then((data) => {

    data.forEach((d) => {
        d.Income = +d.Income,
        d.TotalPop = +d.TotalPop,
        d.County = d.County
    });

    // buffer to stop points overlapping axis
    xScale.domain(d3.extent(data, (d) => { return d.TotalPop })).nice();
    yScale.domain(d3.extent(data, (d) => { return d.Income })).nice();

    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale))
        .append("text")
            .attr("class", "label")
            .attr("x", width / 2)
            .attr("y", height + 20)
            .style("text-anchor", "center")
            .style("fill", "black")
            .text("Population");

    // y-axis
    svg.append("g")
        .attr("class", "y axis")
            .call(d3.axisLeft(yScale))
        .append("text")
            .attr("class", "label")
            .attr("x", 60)
            .attr("y", 10)
            .style("fill", "black")
            .style("font-size", "1.5em")
            .text("Income");

    // draw dots
    svg.selectAll(".point")
        .data(data)
        .enter().append("path")
        .attr("class", "point")
        .attr("d", d3.symbol().type(d3.symbolCircle))
        .attr("transform", (d) => { return `translate(${xScale(d.TotalPop)}, ${yScale(d.Income)})` })
        .style("fill", (d) => { return color(d.County) })
        .on("mouseover", (d) => {
            tooltip.transition().duration(200).style("opacity", 1);
            tooltip.html(`${d.County} <br /> Population: ${d.TotalPop} <br /> Income: ${d.Income}`)
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
        })
        .on ("mouseout", (d) => {
            tooltip.transition().duration(500).style("opacity", 0);
        });

    // draw legend
    svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => { return `translate(0, ${i * 20})` })
        // color identifier
        .append("rect")
            .attr("x", width - 60)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color)
        // County name
        .append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .style("text-anchor", "end")
            .style("fill", "black")
            .text((d) => { return d.County });
});
