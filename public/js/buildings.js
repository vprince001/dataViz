const drawBuildings = (buildings)=>{
  const toLine = b => `<strong>${b.name}</strong> <i>${b.height}</i>`;
  document.querySelector('#chart-area').innerHTML = buildings.map(toLine).join('<hr/>');
}
const main = ()=>{
  d3.json('data/buildings.json').then(drawBuildings);
}
window.onload = main;