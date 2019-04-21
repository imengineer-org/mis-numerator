var express = require('express');
var router = express.Router();
var config = require('config');

router.get('/', function(req, res, next) {
    //const result = config.get('keyLetters');
    res.send({keyLetters:config.get('keyLetters'),reservationTimeout:config.get('reservationTimeout')});
});

module.exports = router;
