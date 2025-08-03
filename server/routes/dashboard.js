const express = require('express');
const router = express.Router();

router.get('/stats', (req, res) => {
  res.json({ message: 'Dashboard stats coming soon' });
});

router.get('/activity', (req, res) => {
  res.json({ message: 'Activity data coming soon' });
});

module.exports = router;