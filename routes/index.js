var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.get('host'))
  console.log(req.headers.host);
  console.log(req.hostname);
  res.json({});
});

module.exports = router;
