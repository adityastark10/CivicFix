const express = require('express');
const router = express.Router();

// Landing page
router.get('/', (req, res) => {
  res.render('pages/home', {
    pageTitle: 'CivicFix | Civic Engagement & Municipal Accountability'
  });
});

module.exports = router;
