const drawCompanies = (companies) => {
    const toLine = company => `<strong>${company.Name}</strong> <i>${company.CMP}</i>`;

    const maxHeight = _.maxBy(companies, company => +company.CMP).CMP;

    const margin = {
        left: 100,
        right: 10,
        top: 10,
        bottom: 150
    };

    const chartSize = {
        width: 800,
        height: 600
    };

    const width = chartSize.width - margin.left - margin.right;
    const height = chartSize.height - margin.top - margin.bottom;

    const x = d3.scaleBand()
        .range([0, width])
        .domain(_.map(companies, "Name"))
        .padding(0.3);

    const y = d3.scaleLinear()
        .domain([0, maxHeight])
        .range([height, 0]);

    const y_axis = d3.axisLeft(y).tickFormat(d => d + '₹').ticks(10);
    const x_axis = d3.axisBottom(x);

    const c = d3.scaleOrdinal(d3.schemeTableau10);

    const svg = d3.select("#chart-data")
        .append("svg")
        .attr("width", chartSize.width)
        .attr("height", chartSize.height);

    const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    g.append("text")
        .attr("class", "x axis-label")
        .attr("x", width/2)
        .attr("y", height+140)
        .text("companies");

    g.append("text")
        .attr("class", "y axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height/2)
        .attr("y", -60)
        .text("CMP (INR)");

    g.append("g")
        .attr("class", "y-axis")
        .call(y_axis);

    g.append("g")
        .attr("class", "x-axis")
        .call(x_axis)
        .attr("transform", `translate(0, ${height})`);

    g.selectAll(".x-axis text")
        .attr("x", -5)
        .attr("y", 10)
        .attr("transform", "rotate(-40)")
        .attr("text-anchor", "end");

    const rectangles = g.selectAll("rect").data(companies);

    const newRectangles = rectangles.enter();

    newRectangles.append("rect")
        .attr("y", (b) => y(b.CMP))
        .attr("x", (b) => x(b.Name))
        .attr("width", x.bandwidth)
        .attr("height", (b) => y(0) - y(b.CMP))
        .attr("fill", (b) => c(b.Name));

    document.querySelector('#chart-area').innerHTML = companies.map(toLine).join('<hr/>');
};

const main = () => {
    d3.csv('data/companies.csv').then(drawCompanies);
};

window.onload = main;
