var express = require('express');
var router = express.Router();

router.get('/:inchar', function(req, res, next) {
  //console.log(req.params.inchar);
  let inChar = req.params.inchar.trim()[0].toUpperCase();
  let maxNum = 0;
  let nextNum = 0;
    Promise.all([global.kmivcDB.kartGetLastNum(inChar+'%'), global.mktDB.kartGetLastNum(inChar+'%')]).then(results => {
    console.log(results);
    console.log(global.charMatrix[inChar]);
    //We have to delete the numbers from matrix bellow number in DB
    maxNum = Math.max(...results,0);
    global.charMatrix[inChar]  = global.charMatrix[inChar].filter((val)=>{
      return(val>maxNum);
    });
    maxNum = Math.max(...results,...global.charMatrix[inChar]);
    nextNum = maxNum + 1;
    Promise.all([global.kmivcDB.kartExists(inChar+'%'+nextNum), global.mktDB.kartExists(inChar+'%'+nextNum)]).then(checkResults => {
      console.log(checkResults);
      if (checkResults.some((item)=>{return(item)})) {
          //The number is occupid. What should i do?
          nextNum += 1;
      }//if
      console.log(global.charMatrix[inChar]);
      console.log('maxNum:'+maxNum);
      global.charMatrix[inChar].push(nextNum);
      let result = inChar+('0000'+Math.round(nextNum,0)).slice(-4);
      console.log(result);
      res.send({letter:inChar,result:result,kmivcDB:results[0],mktDB:results[1],queue:global.charMatrix[inChar]});
    });//Promise.all
  });//Promise.all
});

module.exports = router;
