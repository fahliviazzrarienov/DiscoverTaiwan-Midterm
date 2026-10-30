"use strict";

// =============================================
// DISCOVER TAIWAN — TOURISM DASHBOARD
// Official CSV first; labeled demo data if unavailable.
// =============================================

const DATASET_PAGE = "https://data.gov.tw/en/datasets/8116";

const CSV_URL =
  "https://media.taiwan.net.tw/od/01_PRD/%E6%AD%B7%E5%B9%B4%E5%9C%8B%E5%85%A7%E4%B8%BB%E8%A6%81%E8%A7%80%E5%85%89%E9%81%8A%E6%86%A9%E6%93%9A%E9%BB%9E%E9%81%8A%E5%AE%A2%E4%BA%BA%E6%95%B8%E6%9C%88%E5%88%A5%E7%B5%B1%E8%A8%88.csv";

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

const MONTH_KEYS = [
  ["1月", "一月", "January", "Jan"],
  ["2月", "二月", "February", "Feb"],
  ["3月", "三月", "March", "Mar"],
  ["4月", "四月", "April", "Apr"],
  ["5月", "五月", "May"],
  ["6月", "六月", "June", "Jun"],
  ["7月", "七月", "July", "Jul"],
  ["8月", "八月", "August", "Aug"],
  ["9月", "九月", "September", "Sep"],
  ["10月", "十月", "October", "Oct"],
  ["11月", "十一月", "November", "Nov"],
  ["12月", "十二月", "December", "Dec"]
];

const REGION_BY_COUNTY = {
  "臺北市": "North", "台北市": "North",
  "新北市": "North", "基隆市": "North",
  "桃園市": "North", "新竹市": "North",
  "新竹縣": "North",
  "苗栗縣": "Central", "臺中市": "Central",
  "台中市": "Central", "彰化縣": "Central",
  "南投縣": "Central", "雲林縣": "Central",
  "嘉義市": "South", "嘉義縣": "South",
  "臺南市": "South", "台南市": "South",
  "高雄市": "South", "屏東縣": "South",
  "宜蘭縣": "East", "花蓮縣": "East",
  "臺東縣": "East", "台東縣": "East",
  "澎湖縣": "Islands", "金門縣": "Islands",
  "連江縣": "Islands"
};

// Region color definitions
const REGION_COLORS = {
  "North": "#9b5de5",   // Shaded Purple
  "Central": "#f4d03f", // Shaded Light Yellow
  "South": "#2ecc71",   // Shaded Green
  "East": "#ff69b4",    // Shaded Pink
  "Islands": "#ff69b4", // Shaded Pink (Offshore islands included)
  "Other": "#95a5a6"
};

const ALL_TAIWAN_COLOR = "#e74c3c"; // Red for All Taiwan

const COORDINATES = {
  "台北101": [25.0339, 121.5645],
  "臺北101": [25.0339, 121.5645],
  "日月潭": [23.8654, 120.9175],
  "阿里山": [23.5108, 120.8057],
  "墾丁國家公園": [21.9497, 120.7794],
  "九份": [25.1096, 121.8443],
  "太魯閣": [24.1550, 121.6210],
  "太魯閣國家公園": [24.1550, 121.6210],
  "野柳地質公園": [25.2050, 121.6900],
  "淡水老街": [25.1678, 121.4400],
  "十分瀑布": [25.0445, 121.7830],
  "清境農場": [24.0588, 121.1600],
  "駁二藝術特區": [22.6200, 120.2810],
  "安平古堡": [23.0010, 120.1600],
  "赤崁樓": [22.9970, 120.2020],
  "國立故宮博物院": [25.1024, 121.5485],
  "陽明山國家公園": [25.1660, 121.5600]
};

const COUNTY_COORDINATES = {
  "臺北市": [25.0375, 121.5637], "台北市": [25.0375, 121.5637],
  "新北市": [25.0169, 121.4628], "基隆市": [25.1276, 121.7392],
  "桃園市": [24.9937, 121.3010], "新竹市": [24.8138, 120.9675],
  "新竹縣": [24.8387, 121.0177], "苗栗縣": [24.5602, 120.8214],
  "臺中市": [24.1477, 120.6736], "台中市": [24.1477, 120.6736],
  "彰化縣": [24.0518, 120.5161], "南投縣": [23.9609, 120.9719],
  "雲林縣": [23.7092, 120.4313], "嘉義市": [23.4801, 120.4491],
  "嘉義縣": [23.4518, 120.2555], "臺南市": [22.9999, 120.2269],
  "台南市": [22.9999, 120.2269], "高雄市": [22.6273, 120.3014],
  "屏東縣": [22.5519, 120.5487], "宜蘭縣": [24.7021, 121.7378],
  "花蓮縣": [23.9911, 121.6112], "臺東縣": [22.7972, 121.1710],
  "台東縣": [22.7972, 121.1710], "澎湖縣": [23.5711, 119.5793],
  "金門縣": [24.4493, 118.3767], "連江縣": [26.1605, 119.9510]
};

const DEMO_DATA = [
  { name: "Taipei 101", county: "臺北市", region: "North", year: 2025, monthly: [120000, 135000, 145000, 138000, 150000, 155000, 170000, 165000, 148000, 175000, 190000, 220000], lat: 25.0339, lng: 121.5645 },
  { name: "Jiufen Old Street", county: "新北市", region: "North", year: 2025, monthly: [95000, 100000, 112000, 105000, 118000, 121000, 135000, 128000, 110000, 142000, 155000, 180000], lat: 25.1096, lng: 121.8443 },
  { name: "Sun Moon Lake", county: "南投縣", region: "Central", year: 2025, monthly: [88000, 94000, 105000, 99000, 115000, 108000, 125000, 132000, 103000, 130000, 145000, 165000], lat: 23.8654, lng: 120.9175 },
  { name: "Alishan National Scenic Area", county: "嘉義縣", region: "South", year: 2025, monthly: [78000, 91000, 98000, 92000, 105000, 87000, 94000, 99000, 82000, 110000, 120000, 138000], lat: 23.5108, lng: 120.8057 },
  { name: "Kenting National Park", county: "屏東縣", region: "South", year: 2025, monthly: [105000, 118000, 126000, 122000, 139000, 155000, 168000, 160000, 132000, 125000, 119000, 143000], lat: 21.9497, lng: 120.7794 },
  { name: "Taroko National Park", county: "花蓮縣", region: "East", year: 2025, monthly: [65000, 71000, 82000, 75000, 86000, 81000, 90000, 87000, 76000, 92000, 98000, 108000], lat: 24.1550, lng: 121.6210 },
  { name: "Yehliu Geopark", county: "新北市", region: "North", year: 2025, monthly: [72000, 78000, 85000, 80000, 91000, 94000, 102000, 97000, 83000, 105000, 111000, 125000], lat: 25.2050, lng: 121.6900 },
  { name: "Anping Old Fort", county: "臺南市", region: "South", year: 2025, monthly: [55000, 59000, 65000, 62000, 70000, 74000, 79000, 76000, 68000, 81000, 87000, 95000], lat: 23.0010, lng: 120.1600 },
  { name: "Qingjing Farm", county: "南投縣", region: "Central", year: 2025, monthly: [46000, 51000, 58000, 55000, 62000, 60000, 69000, 72000, 57000, 74000, 79000, 88000], lat: 24.0588, lng: 121.1600 },
  { name: "Tamsui Old Street", county: "新北市", region: "North", year: 2025, monthly: [68000, 72000, 80000, 76000, 85000, 90000, 96000, 92000, 81000, 99000, 108000, 122000], lat: 25.1678, lng: 121.4400 },
  { name: "Pier-2 Art Center", county: "高雄市", region: "South", year: 2025, monthly: [51000, 55000, 61000, 58000, 67000, 70000, 74000, 72000, 63000, 78000, 83000, 91000], lat: 22.6200, lng: 120.2810 },
  { name: "National Palace Museum", county: "臺北市", region: "North", year: 2025, monthly: [62000, 68000, 75000, 71000, 79000, 82000, 88000, 85000, 74000, 92000, 99000, 112000], lat: 25.1024, lng: 121.5485 }
].map(place => ({
  ...place,
  total: place.monthly.reduce((sum, value) => sum + value, 0)
}));

let allDestinations = [];
let destinations = [];
let selectedPlaceName = "";
let usingDemoData = false;

let map;
let markerLayer;
let barChart;
let lineChart;
let regionChart;

const numberFormat = new Intl.NumberFormat("en-US");

// ---------------------------------------------
// Helpers
// ---------------------------------------------

function el(id) {
  return document.getElementById(id);
}

function setText(id, value) {
  const element = el(id);
  if (element) element.textContent = value;
}

function normalize(value) {
  return String(value ?? "")
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_\-（）()]/g, "");
}

function getColumn(row, candidates) {
  const keys = Object.keys(row);
  const normalizedCandidates = candidates.map(normalize);

  const exact = keys.find(key =>
    normalizedCandidates.includes(normalize(key))
  );

  if (exact !== undefined) return row[exact];

  return "";
}

function toNumber(value) {
  const cleaned = String(value ?? "")
    .replace(/,/g, "")
    .replace(/，/g, "")
    .replace(/[^\d.-]/g, "");

  const number = Number(cleaned);
  return Number.isFinite(number) ? number : 0;
}

function getYear(value) {
  const match = String(value ?? "").match(/\d{2,4}/);
  if (!match) return null;

  let year = Number(match[0]);

  if (year >= 1 && year <= 199) year += 1911;

  return year >= 1900 && year <= 2100 ? year : null;
}

function getCoordinates(name, county) {
  if (COORDINATES[name]) return COORDINATES[name];

  const matchingName = Object.keys(COORDINATES).find(key =>
    name.includes(key) || key.includes(name)
  );

  if (matchingName) return COORDINATES[matchingName];

  return COUNTY_COORDINATES[county] || null;
}

function regionFor(county) {
  return REGION_BY_COUNTY[county] || "Other";
}

function updateStatus(message) {
  setText("dataStatus", message);
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function hexToRgba(hex, alpha) {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

// ---------------------------------------------
// Load the official CSV
// ---------------------------------------------

async function loadOfficialData() {
  const response = await fetch(CSV_URL, {
    method: "GET",
    mode: "cors"
  });

  if (!response.ok) {
    throw new Error(`Official CSV request returned HTTP ${response.status}.`);
  }

  const csvText = await response.text();

  if (!csvText.trim()) {
    throw new Error("The CSV file was empty.");
  }

  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: header => header.replace(/^\uFEFF/, "").trim()
  });

  if (!parsed.data || parsed.data.length === 0) {
    throw new Error("No rows were found in the CSV.");
  }

  const records = parsed.data.map(row => {
    const name = String(getColumn(row, [
      "觀光遊憩區", "遊憩區名稱", "景點名稱",
      "Tourist recreation area", "Attraction"
    ]) ?? "").trim();

    const county = String(getColumn(row, [
      "縣市", "縣市別", "縣市名稱", "County/City", "County"
    ]) ?? "").trim();

    const year = getYear(getColumn(row, [
      "年別", "年度", "年份", "Year", "Yearly"
    ]));

    const monthly = MONTH_KEYS.map(keys => toNumber(getColumn(row, keys)));

    const totalFromFile = toNumber(getColumn(row, [
      "合計", "總計", "Total"
    ]));

    const monthlySum = monthly.reduce((sum, value) => sum + value, 0);
    const total = totalFromFile || monthlySum;
    const coords = getCoordinates(name, county);

    return {
      name,
      county,
      region: regionFor(county),
      year,
      monthly,
      total,
      lat: coords ? coords[0] : null,
      lng: coords ? coords[1] : null
    };
  }).filter(place =>
    place.name && place.total > 0
  );

  if (records.length === 0) {
    throw new Error(
      "CSV downloaded but the column names were not recognized. " +
      "Check the dataset's headers."
    );
  }

  return records;
}

// ---------------------------------------------
// Fallback data
// ---------------------------------------------

function useDemoData(reason) {
  usingDemoData = true;
  allDestinations = DEMO_DATA.map(place => ({ ...place }));

  const errorPanel = el("dataError");
  const errorMessage = el("errorMessage");

  if (errorPanel) errorPanel.hidden = false;

  if (errorMessage) {
    errorMessage.textContent =
      `${reason} The dashboard is using demonstration data, not official visitor statistics.`;
  }

  updateStatus("Demo data · Official CSV unavailable");
  applyFilters();
}

// ---------------------------------------------
// Filters
// ---------------------------------------------

function applyFilters() {
  const selectedRegion = el("regionFilter")?.value || "all";

  destinations = allDestinations.filter(place => {
    const matchesRegion =
      selectedRegion === "all" || place.region === selectedRegion;

    const matchesSelectedPlace =
      !selectedPlaceName || place.name === selectedPlaceName;

    return matchesRegion && matchesSelectedPlace;
  });

  destinations.sort((a, b) => b.total - a.total);

  updateDashboard();
}

function resetFilters() {
  if (el("regionFilter")) el("regionFilter").value = "all";
  selectedPlaceName = "";
  applyFilters();
}

// ---------------------------------------------
// Update all dashboard sections
// ---------------------------------------------

function updateDashboard() {
  updateSummaryCards();
  updateBarChart();
  updateLineChart();
  updateRegionChart();
  updateMap();
  updateDestinationTable();
  updateInsights();

  setText("resultCount", `${numberFormat.format(destinations.length)} matching destinations`);
}

function updateSummaryCards() {
  const total = destinations.reduce((sum, place) => sum + place.total, 0);
  const counties = new Set(destinations.map(place => place.county).filter(Boolean));
  const top = [...destinations].sort((a, b) => b.total - a.total)[0];

  setText("totalVisitors", numberFormat.format(total));
  setText("totalDestinations", numberFormat.format(destinations.length));
  setText("totalRegions", numberFormat.format(counties.size));
  setText("topDestination", top ? top.name : "No results");
  setText(
    "topDestinationVisitors",
    top ? `${numberFormat.format(top.total)} recorded visits` : "Try another filter"
  );
  setText("tableCount", `${destinations.length} RECORDS`);
}

// ---------------------------------------------
// Chart 1: Top destinations (Bar Chart colored by region)
// ---------------------------------------------

function updateBarChart() {
  if (!barChart) return;

  const top = [...destinations]
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
    .reverse();

  barChart.setOption({
    animationDuration: 500,
    grid: { left: 135, right: 45, top: 15, bottom: 25 },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: params => {
        const item = params[0];
        const placeObj = top[item.dataIndex];
        return `${escapeHTML(item.name)} (${placeObj ? placeObj.region : ''})<br>Visitors: ${numberFormat.format(item.value)}<br><small style="color:#aaa;">(Click bar to filter)</small>`;
      }
    },
    xAxis: {
      type: "value",
      axisLabel: { formatter: value => numberFormat.format(value) },
      splitLine: { lineStyle: { color: "#edf0eb" } }
    },
    yAxis: {
      type: "category",
      data: top.map(place => place.name),
      axisLabel: { width: 120, overflow: "truncate", color: "#56625b" },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    series: [{
      type: "bar",
      data: top.map(place => place.total),
      barMaxWidth: 20,
      cursor: "pointer",
      itemStyle: {
        color: params => {
          const placeObj = top[params.dataIndex];
          const reg = placeObj ? placeObj.region : "Other";
          return REGION_COLORS[reg] || "#397c61";
        },
        borderRadius: [0, 6, 6, 0]
      },
      label: {
        show: true,
        position: "right",
        color: "#526159",
        fontSize: 10,
        formatter: params => numberFormat.format(params.value)
      }
    }]
  }, true);
}

// ---------------------------------------------
// Chart 2: Monthly trend (Line Chart colored by region or All Taiwan Red)
// ---------------------------------------------

function updateLineChart() {
  if (!lineChart) return;

  const totals = MONTHS.map((_, index) =>
    destinations.reduce((sum, place) => sum + (place.monthly[index] || 0), 0)
  );

  const selectedRegion = el("regionFilter")?.value || "all";
  let lineColor = ALL_TAIWAN_COLOR; // Default Red for All Taiwan
  let areaColor = hexToRgba(ALL_TAIWAN_COLOR, 0.12);

  if (selectedRegion !== "all" && REGION_COLORS[selectedRegion]) {
    lineColor = REGION_COLORS[selectedRegion];
    areaColor = hexToRgba(lineColor, 0.15);
  } else {
    const uniqueRegions = [...new Set(destinations.map(p => p.region))];
    if (uniqueRegions.length === 1 && REGION_COLORS[uniqueRegions[0]]) {
      lineColor = REGION_COLORS[uniqueRegions[0]];
      areaColor = hexToRgba(lineColor, 0.15);
    }
  }

  lineChart.setOption({
    animationDuration: 500,
    grid: { left: 65, right: 25, top: 20, bottom: 40 },
    tooltip: {
      trigger: "axis",
      formatter: params => {
        const item = params[0];
        return `${item.axisValue}<br>Visitors: ${numberFormat.format(item.value)}`;
      }
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: MONTHS.map(month => month.slice(0, 3)),
      axisLine: { lineStyle: { color: "#dfe5dd" } },
      axisTick: { show: false }
    },
    yAxis: {
      type: "value",
      axisLabel: { formatter: value => numberFormat.format(value) },
      splitLine: { lineStyle: { color: "#edf0eb" } }
    },
    series: [{
      name: "Visitors",
      type: "line",
      smooth: true,
      symbolSize: 7,
      data: totals,
      lineStyle: { width: 3, color: lineColor },
      itemStyle: { color: lineColor },
      areaStyle: { color: areaColor }
    }]
  }, true);
}

// ---------------------------------------------
// Chart 3: Region share (Pie Chart with custom colors)
// ---------------------------------------------

function updateRegionChart() {
  if (!regionChart) return;

  const totals = {};

  destinations.forEach(place => {
    totals[place.region] = (totals[place.region] || 0) + place.total;
  });

  const data = Object.entries(totals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  regionChart.setOption({
    tooltip: {
      trigger: "item",
      formatter: params =>
        `${escapeHTML(params.name)}<br>${numberFormat.format(params.value)} visits (${params.percent}%)<br><small style="color:#aaa;">(Click region to filter)</small>`
    },
    legend: {
      bottom: 0,
      left: "center",
      type: "scroll",
      textStyle: { color: "#68736c", fontSize: 10 }
    },
    series: [{
      type: "pie",
      radius: ["42%", "68%"],
      center: ["50%", "43%"],
      avoidLabelOverlap: true,
      cursor: "pointer",
      data,
      label: { formatter: "{b}\n{d}%", fontSize: 10 },
      itemStyle: {
        borderColor: "#ffffff",
        borderWidth: 3,
        color: params => REGION_COLORS[params.name] || "#397c61"
      }
    }]
  }, true);
}

// ---------------------------------------------
// Map (Pin points colored by region with click filtering)
// ---------------------------------------------

function initializeMap() {
  const mapElement = el("map");
  if (!mapElement || !window.L) return;

  map = L.map(mapElement, {
    scrollWheelZoom: false
  }).setView([23.7, 120.9], 7);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  markerLayer = L.layerGroup().addTo(map);
}

let isZoomingFromMapClick = false;

function updateMap() {
  if (!map || !markerLayer) return;

  if (isZoomingFromMapClick) {
    isZoomingFromMapClick = false;
    return;
  }

  markerLayer.clearLayers();

  const mapped = destinations.filter(place =>
    Number.isFinite(place.lat) && Number.isFinite(place.lng)
  );

  mapped.forEach(place => {
    const pinColor = REGION_COLORS[place.region] || "#2d725a";

    const marker = L.circleMarker([place.lat, place.lng], {
      radius: 8,
      color: "#ffffff",
      weight: 2,
      fillColor: pinColor,
      fillOpacity: 0.95,
      cursor: "pointer"
    });

    marker.on("click", () => {
      isZoomingFromMapClick = true;
      map.setView([place.lat, place.lng], 13, { animate: true });

      selectedPlaceName = place.name;
      applyFilters();
    });

    marker.bindPopup(
      `<div class="map-popup">
        <strong>${escapeHTML(place.name)}</strong><br>
        ${escapeHTML(place.county)} (${escapeHTML(place.region)})<br>
        <span>Visitors: ${numberFormat.format(place.total)}</span><br>
        <small style="color:#2d725a; font-weight:bold;">(Click pin to focus)</small>
      </div>`
    );

    marker.addTo(markerLayer);
  });

  if (mapped.length > 0) {
    const bounds = L.latLngBounds(mapped.map(place => [place.lat, place.lng]));

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [25, 25], maxZoom: 9 });
    }
  } else {
    map.setView([23.7, 120.9], 7);
  }
}

// ---------------------------------------------
// Destination table
// ---------------------------------------------

function updateDestinationTable() {
  const tbody = el("destinationTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (destinations.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = '<td colspan="5" class="empty-cell">No destinations match your filters.</td>';
    tbody.appendChild(row);
    setText("tableNote", "Try changing your filters.");
    return;
  }

  destinations.slice(0, 100).forEach((place, index) => {
    const row = document.createElement("tr");

    const values = [
      index + 1,
      place.name,
      place.county || "—",
      place.region,
      numberFormat.format(place.total)
    ];

    values.forEach((value, columnIndex) => {
      const cell = document.createElement("td");
      cell.textContent = value;

      if (columnIndex === 0) {
        cell.style.color = "#7b8580";
      }

      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });

  setText(
    "tableNote",
    `Showing ${Math.min(destinations.length, 100)} of ${destinations.length} matching records.`
  );
}

// ---------------------------------------------
// Key insights
// ---------------------------------------------

function updateInsights() {
  const container = el("insights");
  if (!container) return;

  container.innerHTML = "";

  if (destinations.length === 0) {
    container.textContent = "No matching data. Try changing your filters.";
    return;
  }

  const total = destinations.reduce((sum, place) => sum + place.total, 0);
  const sorted = [...destinations].sort((a, b) => b.total - a.total);
  const top = sorted[0];

  const regionTotals = {};
  destinations.forEach(place => {
    regionTotals[place.region] =
      (regionTotals[place.region] || 0) + place.total;
  });

  const topRegion = Object.entries(regionTotals)
    .sort((a, b) => b[1] - a[1])[0];

  const monthlyTotals = MONTHS.map((_, index) =>
    destinations.reduce((sum, place) => sum + (place.monthly[index] || 0), 0)
  );

  const hasMonthlyData = monthlyTotals.some(value => value > 0);
  const peakMonthIndex = monthlyTotals.indexOf(Math.max(...monthlyTotals));

  const insights = [
    `The leading destination in this selection is ${top.name}, with ${numberFormat.format(top.total)} recorded visits.`,
    `${topRegion[0]} has the highest total among the represented regions, with ${numberFormat.format(topRegion[1])} visits.`,
    `The selected records contain ${numberFormat.format(total)} visits in total. This is a sum of records, not necessarily unique people.`,
    hasMonthlyData
      ? `${MONTHS[peakMonthIndex]} has the highest combined monthly count in this selection (${numberFormat.format(monthlyTotals[peakMonthIndex])}).`
      : "Monthly values are unavailable for this selection."
  ];

  if (usingDemoData) {
    insights.push("Demo mode is active. These values are illustrative and should not be presented as official tourism findings.");
  }

  const list = document.createElement("ul");

  insights.forEach(message => {
    const item = document.createElement("li");
    item.textContent = message;
    list.appendChild(item);
  });

  container.appendChild(list);
}

// ---------------------------------------------
// Initialize
// ---------------------------------------------

function initializeCharts() {
  if (!window.echarts) {
    updateStatus("Chart library failed to load. Check your internet connection.");
    return;
  }

  const barElement = el("barChart");
  const lineElement = el("lineChart");
  const regionElement = el("regionChart");

  if (barElement) {
    barChart = echarts.init(barElement);

    barChart.on("click", params => {
      if (params.componentType === "series" && params.name) {
        selectedPlaceName = params.name;
        isZoomingFromMapClick = false;
        applyFilters();
      }
    });
  }

  if (lineElement) lineChart = echarts.init(lineElement);

  if (regionElement) {
    regionChart = echarts.init(regionElement);

    regionChart.on("click", params => {
      if (params.componentType === "series" && params.name) {
        const regionFilter = el("regionFilter");
        if (regionFilter) {
          regionFilter.value = params.name;
          selectedPlaceName = "";
          isZoomingFromMapClick = false;
          applyFilters();
        }
      }
    });
  }
}

function connectControls() {
  el("regionFilter")?.addEventListener("change", () => {
    selectedPlaceName = "";
    isZoomingFromMapClick = false;
    applyFilters();
  });
  el("resetButton")?.addEventListener("click", () => {
    isZoomingFromMapClick = false;
    resetFilters();
  });
}

window.addEventListener("resize", () => {
  barChart?.resize();
  lineChart?.resize();
  regionChart?.resize();
  map?.invalidateSize();
});

document.addEventListener("DOMContentLoaded", async () => {
  initializeCharts();
  initializeMap();
  connectControls();

  try {
    updateStatus("Connecting to official Taiwan tourism data...");

    allDestinations = await loadOfficialData();
    usingDemoData = false;

    const errorPanel = el("dataError");
    if (errorPanel) errorPanel.hidden = true;

    updateStatus(`Official data loaded · ${allDestinations.length} records`);

    applyFilters();
  } catch (error) {
    console.error("Could not load official tourism data:", error);
    useDemoData(error.message || "The official dataset could not be reached.");
  }
});