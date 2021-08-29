const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('./middleware/cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const personsRouter = require('./routes/persons');
const alertsRouter = require('./routes/alerts');
const recordsRouter = require('./routes/records');
const router = express.Router();


router.get('/', function(req,res) {
    res.sendFile(path.join(__dirname, 'views') + "/index.html");
});

router.get('/github_pattern.svg', function(req,res) {
    res.sendFile(path.join(__dirname, 'views') + "/github_pattern.svg");
});

var app = express();
dotenv.config();

// view engine setup
app.use('/', router);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/persons', personsRouter);
app.use('/api/v1/alerts', alertsRouter);
app.use('/api/v1/records', recordsRouter);

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;