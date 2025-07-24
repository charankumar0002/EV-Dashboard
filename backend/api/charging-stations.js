const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const { data } = await axios.get('https://api.openchargemap.io/v3/poi/', {
      params: {
        output: 'json',
        countrycode: req.query.countrycode || 'US',
        maxresults: req.query.maxresults || 50,
        compact: true,
        verbose: false,
        key: process.env.OCP_API_KEY || ''
      },
      headers: {
        'X-API-Key': process.env.OCP_API_KEY || ''
      }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch charging stations', details: err.message });
  }
};
