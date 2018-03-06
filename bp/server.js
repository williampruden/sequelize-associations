var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var models = require('./models/');

var routes = require('./routes/index');
var tasks = require('./routes/tasks');
var users = require('./routes/users');
var projects = require('./routes/projects');
var teachers = require('./routes/teachers');
var students = require('./routes/students');

var app = express();
app.use(compression());

require('dotenv').load()

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/tasks', tasks);
app.use('/users', users);
app.use('/projects', projects);
app.use('/teachers', teachers);
app.use('/students', students);

models.sequelize
  .authenticate()
  .then(function () {
    console.log('Connection successful');
  })
  .catch(function(error) {
    console.log("Error creating connection:", error);
  });

module.exports = app;
