const express = require('express')
const router = express.Router();

const fetchReport = require('./report/fetchData');

router.get('/v1', (req, res) => {
    res.json({ message: "I have reached router" });
  })

router.get('/v1/fetchReport', fetchReport);

module.exports = router;