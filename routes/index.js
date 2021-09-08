var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  // LD Demo: Get the current value of our paypal-checkout flag and pass it to our view for conditional rendering
  var usePayPal = res.locals.flags['paypal-checkout']
  res.render('index', { usePayPal: usePayPal });
});

module.exports = router;
