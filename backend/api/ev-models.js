const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const { data } = await axios.get('https://ev-database.org/cheatsheet/JSON');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
  } catch (err) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(500).json({ error: 'Failed to fetch EV models', details: err.message });
  }
};
