var express = require('express');
var router = express.Router();

router.get('/:inchar', function(req, res, next) {
    let inChar = req.params.inchar.trim()[0].toUpperCase();
    Promise.all([global.kmivcDB.kartGetFreeNum(inChar), global.mktDB.kartGetFreeNum(inChar)]).then(results => {
        let nextNum = Math.max(...results,0);
        let result = inChar+('0000'+Math.round(nextNum,0)).slice(-4);
        console.log(result);
        res.send({letter:inChar,result:result,kmivcDB:results[0],mktDB:results[1],queue:global.charMatrix[inChar]});
    });//Promise.all
});

module.exports = router;