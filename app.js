var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
//var logger = require('morgan');
var logger = require('winston');

var stylus = require('stylus');

var indexRouter = require('./routes/index');
var getnumRouter = require('./routes/getnum');

var config = require('config');

var app = express();

app.set('port',config.get('port'));

global.keyLetters = {
  'KeyF':"а",
  'Comma':'б',
  'KeyD':'в',
  'KeyU':'г',
  'KeyL':'д',
  'KeyT':'е',
  'Backquote':'ё',
  'Semicolon':'ж',
  'KeyP':'з',
  'KeyB':'и',
  'KeyQ':'Й',
  'KeyR':'к',
  'KeyK':'л',
  'KeyV':'м',
  'KeyY':'н',
  'KeyJ':'о',
  'KeyG':'п',
  'KeyH':'р',
  'KeyC':'с',
  'KeyN':'т',
  'KeyE':'у',
  'KeyA':'ф',
  'BracketLeft':'х',
  'KeyW':'ц',
  'KeyX':'ч',
  'KeyI':'ш',
  'KeyO':'щ',
  'KeyS':'ы',
  'Quote':'э',
  'Period':'ю',
  'KeyZ':'я',
};

global.charMatrix = {};

for (letter in global.keyLetters) {
  global.charMatrix[global.keyLetters[letter].trim()[0].toUpperCase()] = 0;
}

console.log(global.charMatrix);

const clinicDB = require('./clinicDB');

const mktConfig = config.get('mktConfig');
const kmivcConfig = config.get('kmivcConfig');

global.kmivcDB = new clinicDB(kmivcConfig);
global.mktDB = new clinicDB(mktConfig);

(async ()=>{
  await kmivcDB.dbConn();
  await mktDB.dbConn();
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/getnum', getnumRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(config.get('port'),()=>{
  console.log('App is running. Listen port '+config.get('port'));
});
module.exports = app;
