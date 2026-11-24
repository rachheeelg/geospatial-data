// 1. Make the map, centered on Johor. zoomControl moves to bottom-right so the card doesn't cover it.
const map = L.map("map", { zoomControl: false }).setView([1.55, 103.68], 9);
L.control.zoom({ position: "bottomright" }).addTo(map);

// 2. Add the grey basemap (free, no API key)
L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
  { attribution: "Tiles © Esri — Esri, DeLorme, NAVTEQ", maxZoom: 16 }
).addTo(map);

// 3. Add the place-name labels on top
L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
  { maxZoom: 16 }
).addTo(map);

// 4. Fill the card with one data center's info
function showCard(d) {
  document.getElementById("card-name").textContent = d.name;
  document.getElementById("card-status").textContent = d.status;
  document.getElementById("card-location").textContent = d.location;
  document.getElementById("card-notes").textContent = d.notes;
  document.getElementById("card-homes").textContent =
    "Could have powered " + d.homes.toLocaleString("en-US") + " homes";
}

// 5. Make a black dot for every data center, and keep a list of them
//    so the slider can show/hide them later
const markers = dataCenters.map(d => {
  const dot = L.circleMarker([d.lat, d.lng], {
    radius: 5,              // dot size: lower = smaller
    weight: 0,              // no outline
    fillColor: "#000",
    fillOpacity: 1,
  })
    .addTo(map)
    .on("click", () => showCard(d));

  return { data: d, dot: dot };
});

// 6. The slider: only show data centers that could power at least X homes
const slider = document.getElementById("homes-slider");
const label = document.getElementById("filter-label");

function updateFilter() {
  const minHomes = Number(slider.value);
  let count = 0;

  markers.forEach(m => {
    if (m.data.homes >= minHomes) {
      m.dot.addTo(map);     // show it
      count++;
    } else {
      m.dot.remove();       // hide it
    }
  });

  label.innerHTML =
    '<span class="num">' + count + '</span> data centers that could power ' +
    '<span class="num">' + minHomes.toLocaleString("en-US") + '+</span> homes';
}

slider.addEventListener("input", updateFilter);   // runs every time the slider moves
updateFilter();                                   // run once on load

// 7. Show the first one when the page opens
showCard(dataCenters[0]);