module.exports = (sequelize, Sequelize) => {

    const User = sequelize.define("user", {
    
    fname: {
    
    type: Sequelize.STRING
    
    },

    lname: {
    
    type: Sequelize.STRING
    
    },

    email: {
    
    type: Sequelize.STRING
    
    },
    
    password: {
    
    type: Sequelize.STRING
    
    },
    token: {
    
    type: Sequelize.STRING
    
    },
    
    });
    
    
    return User;
    
    };