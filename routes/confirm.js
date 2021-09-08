var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  // LD Demo: Track that checkout has been completed when the user vists the confirmation page
  res.locals.ldTracker('checkout-complete', {metricValue: 20});
  res.render('confirm');
});

module.exports = router;
