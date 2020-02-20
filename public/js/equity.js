const chartSize = { width: 1300, height: 720 };
const margin = { left: 100, right: 10, top: 20, bottom: 150 };
const height = chartSize.height - margin.top - margin.bottom;
const width = chartSize.width - margin.left - margin.right;
const percentageFormat = d => `${d}%`;
const kCroresFormat = d => `${d / 1000}k Cr ₹`;
const rupeeFormat = d => d + " ₹";
const formats = {
    MarketCap: kCroresFormat,
    DivYld: percentageFormat,
    ROCE: percentageFormat,
    QNetProfit: kCroresFormat,
    QSales: kCroresFormat,
    CMP: rupeeFormat
};
const color = d3.scaleOrdinal(d3.schemeCategory10);
const getIndex = function(i) {
    if (i - 100 <= 0) {
        return 0;
    } else {
        return i - 100;
    }
};
const movingAverage = function(quotes, period, date) {
    let index = _.findIndex(quotes, x => x.Date === date);
    let quotesForPeriod = quotes.slice(getIndex(index), index);
    const sumCloses = (x, y) => x + y.Close;
    return quotesForPeriod.reduce(sumCloses, 0) / (quotesForPeriod.length - 1);
};
const addAverage = function(quotes) {
    return quotes.map(function ({Date, ...Fields}) {
        return {Avg: movingAverage(quotes, 100, Date), Date, ...Fields};
    });
};
const getSelectedRange = function(quotes, range) {
    const startIndex = ((quotes.length - 1) / 100) * range.begin;
    const endIndex = ((quotes.length - 1) / 100) * range.end;
    return quotes.slice(startIndex, endIndex);
};
const initChart = function() {
    const svg = d3
        .select("#chart-area")
        .append("svg")
        .attr("height", chartSize.height)
        .attr("width", chartSize.width);
    const equityG = svg
        .append("g")
        .attr("class", "equity")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    equityG.append("path").attr("class", "close");
    equityG.append("path").attr("class", "avg");
    equityG
        .append("text")
        .attr("x", width / 2)
        .attr("y", height + 140)
        .text("time")
        .attr("class", "x axis-label");
    equityG
        .append("text")
        .text("close")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -60)
        .attr("class", "y axis-label");
    equityG.append("g").attr("class", "y-axis");
    equityG.append("g").attr("class", "x-axis");
    equityG
        .selectAll(".x-axis text")
        .attr("text-anchor", "end")
        .attr("x", -5)
        .attr("y", 10)
        .attr("transform", "rotate(-40)");
};
const drawEquity = quote => {
    initChart();
    d3.select("#range-label").text(
        `${_.first(quote).Date} - ${_.last(quote).Date}`
    );
    let slider = createD3RangeSlider(0, 100, "#slider-container");
    slider.range(0, 100);
    slider.onChange(function(newRange) {
        const newQuote = getSelectedRange(quote, newRange);
        d3.select("#range-label").text(
            `${_.first(newQuote).Date} - ${_.last(newQuote).Date}`
        );
        updateEquity(newQuote);
    });
    updateEquity(quote);
};
const updateEquity = function(quote) {
    quote = addAverage(quote);
    const [firstDate, lastDate] = [_.first(quote).Time, _.last(quote).Time];
    const close = quote.map(data => data.Close);
    const y = d3
        .scaleLinear()
        .domain([_.minBy(close), _.maxBy(close)])
        .range([height, 0]);
    const x = d3
        .scaleTime()
        .range([0, width])
        .domain([firstDate, lastDate]);
    const line = d3
        .line()
        .x(q => x(new Date(q.Date)))
        .y(q => y(q.Close));
    const avgLine = d3
        .line()
        .x(q => x(new Date(q.Date)))
        .y(q => y(q.Avg));
    d3.select(".close").attr("d", line(quote));
    d3.select(".avg").attr("d", avgLine(quote.slice(25)));
    const yAxis = d3
        .axisLeft(y)
        .tickFormat(formats["Date"])
        .ticks(10);
    d3.select(".y-axis").call(yAxis);
    const xAxis = d3.axisBottom(x);
    d3.select(".x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
};
const parseNumerics = ({ Date, AdjClose, Volume, ...numericFields }) => {
    _.forEach(numericFields, (v, k) => (numericFields[k] = +v));
    return { Date, Time: new window.Date(Date), ...numericFields };
};
const makeTransactions = (quotes) => {
    quotes.map()
};

const main = () => {
    d3.csv("data/nsei.csv", parseNumerics).then(quotes => {
        drawEquity(quotes);
        makeTransactions(quotes);
    });
};
window.onload = main;
