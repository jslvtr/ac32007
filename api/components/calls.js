var request = require ('request');



function getMethod(url) {
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            return(body);
        }
    })


}


module.exports = {
    getMethod :  getMethod
};

