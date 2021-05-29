var request = require('request'); 
exports.random = async (req, res) => {
   
   
	try {

        request('https://api.chucknorris.io/jokes/random', 
        function (error, response, body)
        { 
            if(error){
                res.status(400).json({ status: 0, data: null, message: 'Data not found.' });
            }else{
                res.status(200).json({ status: 1, data: JSON.parse(body), message: 'Success' });
            }
        }); 

       
    }catch(e){
        console.log(e,'error in user add ')
    }
}   