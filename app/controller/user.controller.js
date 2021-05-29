const db = require("../models");
const User = db.user;
const bcrypt = require('bcrypt');
const common = require('../../helpers/common');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {

	try {
        const where = {email:req.body.email};
        User.findAll({ where: where })
            .then(async data => {
               
                if(data.length > 0){
                    res.status(409).json({ status: 0, data: null, message: 'Emailid is already register.' });
                }else{

                    let paasword  = await hashPassword(req.body.password);


                        const insert_data = {
                            fname: req.body.fname,
                            lname: req.body.lname,
                            email: req.body.email,
                            password: paasword.password
                        };
                   
                        User.create(insert_data)
                        .then(async data => {
                            let token = await common.generateAccessToken(data.email);
                            update_token(data.id,token);

                            const JWTToken = jwt.sign({id:data.id,fname:data.fname,lname:data.lname,email:data.email},
                             'secret',
                                {
                                   expiresIn: '2h'
                                }); 
                            let user_details =  {id:data.id,fname:data.fname,lname:data.lname,email:data.email,token:JWTToken,access_key:token};
                            res.status(200).json({ status: 1, data: user_details, message: 'You have Successfully Registered.' });
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
            
            })
            .catch(err => {
                res.status(500).send({
                    status:0,
                    data:null,
                    message:
                    err.message || "Some error occurred while signup."
                });
            });
    }catch(e){
        res.status(500).send({status:0,data:null,message:"Something went Wrong  "+e});
    }
}  

async function hashPassword(password){
    try{
        return new Promise(resolve => {
            let encrypt;
            bcrypt.genSalt(10, function(err, salt) {
               bcrypt.hash(password, salt, function(err, hash) {
                  // console.log(err,hash);
                   if(err){
                       encrypt = {status:0};
                   }else{
                       encrypt = {status:1,password:hash}; 
                   }
                   resolve(encrypt);
               });

           });
          
        });
       
    }catch(e){
        console.log(e,' Error in hashPassword');        
    }
}


exports.login = async (req, res) => {

	try {
        const where = {email:req.body.email};
        User.findAll({ where: where })
            .then(async data => {
               // console.log();
                if(data.length > 0){
                    let check_data = data[0];
                    bcrypt.compare(req.body.password, check_data.password).then(async function(result) {
                       if(result){
                        let token = await common.generateAccessToken(check_data.email);   
                        update_token(check_data.id,token);
                        const JWTToken = jwt.sign({id:check_data.id,fname:check_data.fname,lname:check_data.lname,email:check_data.email},
                            'secret',
                               {
                                  expiresIn: '2h'
                               }); 

                        let user_details =  {id:check_data.id,fname:check_data.fname,lname:check_data.lname,email:check_data.email,token:JWTToken,access_key:token};
                        res.status(200).send({
                            status:0,
                            data:user_details,
                            message:"Login Success"
                        });
                       }else{
                        res.status(403).send({
                            status:0,
                            data:null,
                            message:"email id and password is incorrect"
                        });  
                       }
                    });
                }else{
                    res.status(404).send({
                        status:0,
                        data:null,
                        message:"email id and password is incorrect"
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    status:0,
                    data:null,
                    message:
                    err.message || "Some error occurred login."
                });
            });
    }catch(e){
        res.status(500).send({status:0,data:null,message:"Something went Wrong  "+e});
    }
}

function update_token(id,token){

    let update_data = {token:token}
    User.update(update_data, {
        where: { id: id }
    }).then(data => {
        console.log(data,'update token');
    })
    .catch(err => {
        
    });
}

exports.logout  = async (req, res) => {
    try{

   
        let update_data = {token:''}
        User.update(update_data, {
            where: { id: req.user.id }
        }).then(data => {
            res.status(200).send({
                status:1,
                data:null,
                message:"Logout Success."
            });
        })
        .catch(err => {
            res.status(404).send({
                status:0,
                data:null,
                message:"Something went Wrong"
            });
        });
    }catch(e){
        res.status(500).send({status:0,data:null,message:"Something went Wrong  "+e});
    }
};

exports.user_profile = async (req, res) => {
   
   
	try {
       const id = req.params.id;
        User.findByPk(id)
            .then(data => {
                if(data){
                    let user_details =  {id:data.id,fname:data.fname,lname:data.lname,email:data.email};
                    res.status(200).send({
                        status:1,
                        data:user_details,
                        message:"Success!"
                    });

                }else{
                    res.status(404).send({
                        status:0,
                        data:null,
                        message:"User not Found"
                    });
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
    }catch(e){
        res.status(500).send({status:0,data:null,message:"Something went Wrong  "+e});
    }
}
