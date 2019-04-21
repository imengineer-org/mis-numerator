var express = require('express');
var router = express.Router();

router.get('/:inchar', function(req, res, next) {
  //console.log(req.params.inchar);
  let inChar = req.params.inchar.trim()[0].toUpperCase();
  let maxNum = 0;
    Promise.all([global.kmivcDB.kartGetLastNum(inChar+'%'), global.mktDB.kartGetLastNum(inChar+'%')]).then(results => {
    console.log(results);
    console.log(global.charMatrix[inChar]);
    //We have to delete the numbers from matrix bellow number in DB
    maxNum = Math.max(...results,0);
    global.charMatrix[inChar]  = global.charMatrix[inChar].filter((val)=>{
      return(val>maxNum);
    });
    maxNum = Math.max(...results,...global.charMatrix[inChar]);
    console.log(global.charMatrix[inChar]);
    console.log('maxNum:'+maxNum);
    global.charMatrix[inChar].push(maxNum+1);
    let result = inChar+('0000'+Math.round(maxNum+1,0)).slice(-4);
    console.log(result);
    res.send({letter:inChar,result:result,kmivcDB:results[0],mktDB:results[1],queue:global.charMatrix[inChar]});
  });
});

module.exports = router;
