var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var stylus = require('stylus');

var indexRouter = require('./routes/index');
var getnumRouter = require('./routes/getnum');

var app = express();

global.charMatrix = {};

const sql = require('mssql');

async () => {
  try {
    await sql.connect('mssql://sa:kmivc@10.8.9.1/SQLEXPR2008/polic07008');
    const result = await sql.query`select * from deptype`;
    console.dir(result)
  } catch (err) {
    console.dir(err)
  }
};

const config = {
  user: 'sa',
  password: 'rvbdw',
  server: '10.8.9.1',
  database: 'polic07008',
  options : {
    encrypt: false,
    instanceName: 'SQLEXPR2008'
  }
};

// connect to your database
sql.connect(config, function (err) {

  if (err) console.log(err);

  // create Request object
  var request = new sql.Request();

  // query to the database and get the records
  queryStr = 'SELECT [KARTA]\n' +
      '      ,[FAM]\n' +
      '      ,[IM]\n' +
      '      ,[OTCH]\n' +
      '      ,[DATR]\n' +
      '  FROM [polic07008].[dbo].[KARTA]\n' +
      '  WHERE [KARTA] like \'%Ф%\';';
  request.query(queryStr, function (err, recordset) {

    if (err) console.log(err);
    // send records as a response
    //console.dir(recordset);
    //extract numbers from the KARTA field
    const nums = recordset.recordset.map((rec)=>parseInt(rec.KARTA.replace(/\D+/g,"")));
    console.dir(nums.sort((a,b)=>a-b));
    console.log(Math.max.apply(null,nums));
    console.log(Math.min.apply(null,nums));
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
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

module.exports = app;
