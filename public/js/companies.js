const domains = ["PE", "MarketCap", "DivYld", "QNetProfit", "QSales", "ROCE", "CMP"];

const margin = {left: 100, right: 10, top: 10, bottom: 150};
const chartSize = {width: 800, height: 600};

const width = chartSize.width - margin.left - margin.right;
const height = chartSize.height - margin.top - margin.bottom;

const drawCompanies = (companies) => {
    const toLine = company => `<strong>${company.Name}</strong> <i>${company.CMP}</i>`;

    const maxHeight = _.maxBy(companies, company => company.CMP).CMP;

    const x = d3.scaleBand()
        .range([0, width])
        .domain(_.map(companies, "Name"))
        .padding(0.3);

    const y = d3.scaleLinear()
        .domain([0, maxHeight])
        .range([height, 0]);

    const y_axis = d3.axisLeft(y).tickFormat(d => d + '₹').ticks(10);
    const x_axis = d3.axisBottom(x);

    const c = d3.scaleOrdinal(d3.schemeRdPu[7]);

    const svg = d3.select("#chart-area")
        .append("svg")
        .attr("width", chartSize.width)
        .attr("height", chartSize.height);

    const companiesG = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    companiesG.append("text")
        .attr("class", "x axis-label")
        .attr("x", width / 2)
        .attr("y", height + 140)
        .text("companies");

    companiesG.append("text")
        .attr("class", "y axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -60)
        .text("CMP");

    companiesG.append("g")
        .attr("class", "y-axis")
        .call(y_axis);

    companiesG.append("g")
        .attr("class", "x-axis")
        .call(x_axis)
        .attr("transform", `translate(0, ${height})`);

    companiesG.selectAll(".x-axis text")
        .attr("x", -5)
        .attr("y", 10)
        .attr("transform", "rotate(-40)")
        .attr("text-anchor", "end");

    const rectangles = companiesG.selectAll("rect").data(companies);

    const newRectangles = rectangles.enter();

    newRectangles.append("rect")
        .attr("y", (b) => y(b.CMP))
        .attr("x", (b) => x(b.Name))
        .attr("width", x.bandwidth)
        .attr("height", (b) => y(0) - y(b.CMP))
        .attr("fill", (b) => c(b.Name));
};

const updateCompanies = (companies, domain) => {
    const svg = d3.select("#chart-area svg");
    svg.select(".y.axis-label").text(domain);

    const y = d3
        .scaleLinear()
        .domain([0, _.maxBy(companies, domain)[domain]])
        .range([height, 0]);

    const yAxis = d3
        .axisLeft(y)
        .tickFormat(d => d + '₹')
        .ticks(10);

    svg.select(".y-axis").call(yAxis);

    svg.selectAll("rect").data(companies)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr("y", c => y(c[domain]))
        .attr("height", c => y(0) - y(c[domain]))
};

const formatData = ({Name, ...numerics}) => {
    _.forEach(numerics, (v, k) => (numerics[k] = parseInt(v)));
    return {Name, ...numerics};
};

const main = () => {
    d3.csv('data/companies.csv', formatData).then((companies) => {
        drawCompanies(companies);
        let i = 0;
        setInterval(() => {
            updateCompanies(companies, domains[i % domains.length]);
            i = i + 1;
        }, 2000)
    });
};

window.onload = main;
