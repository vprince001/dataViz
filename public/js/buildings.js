const drawBuildings = (buildings)=>{
  const toLine = b => `<strong>${b.name}</strong> <i>${b.height}</i>`;

  const width = 400;
  const height = 400;
  const maxHeight = _.maxBy(buildings, "height").height;

   const x = d3.scaleBand()
       .range([0, width])
      .domain(_.map(buildings, "name"))
      .padding(0.3);

  const y = d3.scaleLinear()
      .domain([0, 828])
      .range([0, height]);

  const svg = d3.select("#chart-data")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

  const rectangles = svg.selectAll("rect").data(buildings);

  const newRectangles = rectangles.enter();

  newRectangles.append("rect")
      .attr("y", 0)
      .attr("x", (b) => x(b.name))
      .attr("width", x.bandwidth)
      .attr("height", (b) => y(b.height))
      .attr("fill", "grey");

  document.querySelector('#chart-area').innerHTML = buildings.map(toLine).join('<hr/>');
};

const main = ()=>{
  d3.json('data/buildings.json').then(drawBuildings);
};

window.onload = main;
