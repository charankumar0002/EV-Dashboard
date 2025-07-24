const axios = require('axios');

module.exports = async (req, res) => {
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
          verbose: false,
          key: process.env.OCP_API_KEY || ''
        },
        headers: { 'X-API-Key': process.env.OCP_API_KEY || '' }
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
};
