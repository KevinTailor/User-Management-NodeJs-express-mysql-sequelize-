
// Define NodeJS Module

const uuid4 = require('uuid4');
const { validationResult } = require('express-validator');
const db = require("../app/models");
const User = db.user;
const jwt = require('jsonwebtoken');
module.exports = {
	// -------------------------------------------------------------
	// Purpose : Generate Access Token for Mobile Access & Cloud Access
	// -------------------------------------------------------------
	generateAccessToken: function (emailid) {
		return new Promise((resolve, reject) => {
			let get_access_token = this.encrptToken(emailid);
			resolve(get_access_token);
		})
    },
    encrptToken: function (pass) {
		var user_token = uuid4(pass);
		return user_token;
	},
	// ------------------------------------------------------------
	//Purpose : verify Access token
	// ------------------------------------------------------------
	verifyAccessToken: async function (req, res, next) {

		var token = req.headers['authorization'];
	    if (!token) return res.status(401).send({ status: 0, data: 'No token provided.' });

	    jwt.verify(token,'secret', function(err, decoded) {
	        if (err) return res.status(401).send({ status: 0, data: 'Failed to authenticate token.' });
			req.user = decoded;
			
			let getiAccessToken = req.headers['access_key'];
		
		if (!getiAccessToken) {
			res.status(400).json({ status: false, code: 400, message: 'No Access Token Provided' });
		}
		else {
			let where = {id:req.user.id,token:getiAccessToken};
			
		    User.findAll({ where: where })
            .then(data => {
                if(data.length > 0){
                    req.user = data[0];
					next();
                }else{
					res.status(400).json({ status: false, code: 400, message: 'Access Token is not match' });
                }
            })
            .catch(err => {
                res.status(500).send({
                    status:0,
                    data:null,
                    message:
                    err.message || "Some error occurred while creating the Tutorial."
                });
			});
		}
	       
	    });
		
	},
	// ------------------------------------------------------------
	// Purpose :  API Validation 
	// ------------------------------------------------------------
	apiValidation: function (req, res, next) {
		let error = validationResult(req);
		//console.log(error,'error')
		if (!error.isEmpty()) {
			res.status(200).json({ status: false, code: 400, message: error.errors[0].msg });
		}
		else {
			next();
		}
	},
};


