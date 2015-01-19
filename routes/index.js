var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('add', { title: "Welcome to the CMS!", message: "<a href=users>Look at the users</a><br><a href=songs>Look at songs</a>" });
});

module.exports = router;