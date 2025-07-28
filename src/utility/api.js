// Utility functions to fetch data from local EVPopulationData.json
import axios from "axios";

const LOCAL_DATA_URL = "/EVPopulationData.json";
const OPEN_CHARGEMAP_API = "https://api.openchargemap.io/v3/poi/";

// Fetch all data from local JSON
export async function fetchLocalData() {
  const response = await axios.get(LOCAL_DATA_URL);
  return response.data;
}

// Fetch charging stations from Open Charge Map API via Vite proxy
export async function fetchChargingStations({ countrycode = "US", maxresults = 50 } = {}) {
  const response = await axios.get("/api/charging-stations", {
    params: {
      output: "json",
      countrycode,
      maxresults,
      compact: true,
      verbose: false,
      key: "62e4872d-a41c-47d6-8728-03c09eeb95af"
    },
    headers: {
      "X-API-Key": "62e4872d-a41c-47d6-8728-03c09eeb95af"
    }
  });
  return response.data;
}

// Fetch EV models from local data
export async function fetchEVModels() {
  const data = await fetchLocalData();
  return data.evModels || [];
}

// Fetch analytics (process local data and charging stations from API)
export async function fetchAnalytics({ countrycode = "US", maxresults = 100, apiKey = "" } = {}) {
  const [evModels, stations] = await Promise.all([
    fetchEVModels(),
    fetchChargingStations({ countrycode, maxresults, apiKey })
  ]);

  // EV Adoption by Year
  const yearCounts = evModels.reduce((acc, m) => {
    const year = m.Year || m["Model Year"] || m["First Registration"];
    if (!year) return acc;
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  // Top States by Charging Stations
  const stateCounts = stations.reduce((acc, s) => {
    const state = s.AddressInfo?.StateOrProvince || "Unknown";
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {});
  const topStates = Object.entries(stateCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([state, count]) => ({ state, count }));

  // Most Popular Makes
  const makeCounts = evModels.reduce((acc, m) => {
    acc[m.Make] = (acc[m.Make] || 0) + 1;
    return acc;
  }, {});
  const topMakes = Object.entries(makeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([make, count]) => ({ make, count }));

  return {
    yearCounts,
    topStates,
    topMakes,
    totalModels: evModels.length,
    totalStations: stations.length
  };
}
