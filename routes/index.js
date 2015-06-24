var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Choose Your 2016 U.S.A Election Candidate' });
});

module.exports = router;
