var express = require('express');
var router = express.Router();

router.get('/:inchar', function(req, res, next) {
  //console.log(req.params.inchar);
  let inChar = req.params.inchar.trim()[0].toUpperCase();
  Promise.all([global.kmivcDB.kartGetLastNum(inChar+'%'), global.mktDB.kartGetLastNum(inChar+'%')]).then(results => {
    console.log(results);
    let maxNum = Math.max(...results,global.charMatrix[inChar]);
    global.charMatrix[inChar] = maxNum+1;
    let result = inChar+('0000'+Math.round(global.charMatrix[inChar],0)).slice(-4);
    console.log(result);
    res.send(`${result}`);
  });
});

module.exports = router;
