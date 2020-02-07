const drawBuildings = (buildings) => {
  const toLine = b => `<strong>${b.name}</strong> <i>${b.height}</i>`;

  // const width = 400;
  // const height = 400;
  const maxHeight = _.maxBy(buildings, "height").height;

  const margin = {
    left: 100,
    right: 10,
    top: 10,
    bottom: 150
  };

  const chartSize = {
    width: 600,
    height: 400
  };

  const width = chartSize.width - margin.left - margin.right;
  const height = chartSize.height - margin.top - margin.bottom;


  const x = d3.scaleBand()
      .range([0, width])
      .domain(_.map(buildings, "name"))
      .padding(0.3);

  const y = d3.scaleLinear()
      .domain([0, 828])
      .range([0, height]);



  const svg = d3.select("#chart-data")
      .append("svg")
      .attr("width", chartSize.width)
      .attr("height", chartSize.height);


  const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

  g.append("text")
      .attr("class", "x axis-label")
      .attr("x", width/2)
      .attr("y", height+140)
      .text("tall_buildings");

  g.append("text")
      .attr("class", "y axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -height/2)
      .text("height (m)");

  const rectangles = g.selectAll("rect").data(buildings);

  const newRectangles = rectangles.enter();

  newRectangles.append("rect")
      .attr("y", 0)
      .attr("x", (b) => x(b.name))
      .attr("width", x.bandwidth)
      .attr("height", (b) => y(b.height))
      .attr("fill", "grey");

  document.querySelector('#chart-area').innerHTML = buildings.map(toLine).join('<hr/>');
};

const main = () => {
  d3.json('data/buildings.json').then(drawBuildings);
};

window.onload = main;
