// Utility functions to fetch data from external APIs directly from the frontend
import axios from 'axios';

// Fetch charging stations from Open Charge Map
export async function fetchChargingStations({ countrycode = 'US', maxresults = 50, apiKey = '' } = {}) {
  const response = await axios.get('https://api.openchargemap.io/v3/poi/', {
    params: {
      output: 'json',
      countrycode,
      maxresults,
      compact: true,
      verbose: false,
      key: apiKey
    },
    headers: {
      'X-API-Key': apiKey
    }
  });
  return response.data;
}

// Fetch EV models from EV Database
export async function fetchEVModels() {
  const response = await axios.get('https://ev-database.org/cheatsheet/JSON');
  return response.data;
}

// Fetch analytics (EV adoption, top states, top makes)
export async function fetchAnalytics({ countrycode = 'US', maxresults = 100, apiKey = '' } = {}) {
  const [evModels, stations] = await Promise.all([
    fetchEVModels(),
    fetchChargingStations({ countrycode, maxresults, apiKey })
  ]);

  // EV Adoption by Year
  const yearCounts = evModels.reduce((acc, m) => {
    const year = m.Year || m['Model Year'] || m['First Registration'];
    if (!year) return acc;
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  // Top States by Charging Stations
  const stateCounts = stations.reduce((acc, s) => {
    const state = s.AddressInfo.StateOrProvince || 'Unknown';
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
