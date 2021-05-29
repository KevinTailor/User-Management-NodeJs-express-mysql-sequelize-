
 // then in your app
var express = require('express')
const port = 3000;
var bodyParser = require('body-parser')
const logger = require('morgan');
var app = express()
app.use(logger('dev'));
// create application/json parser

app.use(bodyParser.json());


app.use(bodyParser.urlencoded({ extended: false }));

const db = require("./app/models");
db.sequelize.sync();

// API ROUTE
const user = require("./app/routes/user.route");
app.use('/api/user',user);

const jokes = require("./app/routes/jokes.route");
app.use('/api',jokes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
}); 
