
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Proxy: Open Charge Map (charging stations)
app.get('/api/charging-stations', async (req, res) => {
  try {
    // Example: fetch stations in the US, limit 50
    const { data } = await axios.get('https://api.openchargemap.io/v3/poi/', {
      params: {
        output: 'json',
        countrycode: req.query.countrycode || 'US',
        maxresults: req.query.maxresults || 50,
        compact: true,
        verbose: false
      },
      headers: {
        'X-API-Key': '' // Optional: add your API key if you have one
      }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch charging stations', details: err.message });
  }
});

// Proxy: EV-Database (EV models/specs)
app.get('/api/ev-models', async (req, res) => {
  try {
    const { data } = await axios.get('https://ev-database.org/cheatsheet/JSON');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch EV models', details: err.message });
  }
});

// Analytics endpoint
app.get('/api/analytics', async (req, res) => {
  try {
    // Fetch live data
    const [evRes, stationRes] = await Promise.all([
      axios.get('https://ev-database.org/cheatsheet/JSON'),
      axios.get('https://api.openchargemap.io/v3/poi/', {
        params: {
          output: 'json',
          countrycode: req.query.countrycode || 'US',
          maxresults: req.query.maxresults || 100,
          compact: true,
          verbose: false
        },
        headers: { 'X-API-Key': '' }
      })
    ]);
    const evModels = evRes.data;
    const stations = stationRes.data;

    // EV Adoption by Year
    const yearCounts = evModels.reduce((acc, m) => {
      const year = m.Year || m["Model Year"] || m["First Registration"];
      if (!year) return acc;
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {});

    // Top States by Charging Stations
    const stateCounts = stations.reduce((acc, s) => {
      const state = s.AddressInfo.StateOrProvince || "Unknown";
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

    res.json({
      yearCounts,
      topStates,
      topMakes,
      totalModels: evModels.length,
      totalStations: stations.length
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute analytics', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 