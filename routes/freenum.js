var express = require('express');
var router = express.Router();

router.get('/:instr', function(req, res, next) {
    let inStr = req.params.instr.trim().toUpperCase();
    let result = '';
    inChar = ''+inStr[0];
    inNum = 1*parseInt(inStr.slice(1));
    global.charMatrix[inChar] = global.charMatrix[inChar].filter((val)=>{
        return(val!=inNum);
    });
    res.send({instr:inStr,letter:inChar,inNum:inNum,result:result,queue:global.charMatrix[inChar]});
});

module.exports = router;