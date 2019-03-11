var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:inchar', function(req, res, next) {
  //console.log(req.params.inchar);
  let inChar = req.params.inchar.trim()[0].toUpperCase();
  if (inChar in global.charMatrix) {
    global.charMatrix[inChar] += 1;
  } else {
    global.charMatrix[inChar] = 1;
  }
  let result = inChar+('0000'+Math.round(global.charMatrix[inChar],0)).slice(-4);
  res.send(`${result}`);
});

module.exports = router;
