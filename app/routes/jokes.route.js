
// libraries
var app = require('express').Router();
const {verifyAccessToken, apiValidation } = require('../../helpers/common');
const jokesController = require('../controller/jokes.controller');

module.exports = (function () {

app.get("/random-jokes",verifyAccessToken,jokesController.random);

return app;
})();