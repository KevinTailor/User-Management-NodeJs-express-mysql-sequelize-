const { body,Params } = require('express-validator');

exports.validate = (req) => {
	switch (req) {

		case 'signup': {
			return [
                body('fname', "Please enter first name.").exists({ checkFalsy: true }),
                body('lname', "Please enter last name.").exists({ checkFalsy: true }),
                body('email', "Please enter valid email id.").exists().isEmail(),
                body('password', "Please enter password.").isLength({ min: 5 }),
            ]
		}

		case 'login': {
			return [
                body('email', "Please enter valid email id.").exists().isEmail(),
                body('password', "Please enter password.").exists(),
			]
		}
	 
		
	}
}