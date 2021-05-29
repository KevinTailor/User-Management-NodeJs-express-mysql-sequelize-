
// libraries
var app = require('express').Router();
const { validationResult } = require('express-validator');
const {verifyAccessToken, apiValidation } = require('../../helpers/common');

const userController = require('../controller/user.controller');
const userVal = require("../validation/user.controller.validater");
module.exports = (function () {

app.post("/signup",userVal.validate('signup'),apiValidation,userController.signup);//User signup
app.post("/login",userVal.validate('login'),apiValidation,userController.login);//User login
app.get("/profile/:id",verifyAccessToken,userController.user_profile);//User profile
app.get("/logout",verifyAccessToken,userController.logout);//User Logout


return app;
})();