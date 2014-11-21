var request = require ('request');

var usingItNow = function(callback)   {
    callback(calls.getMethod());
}


function getMethod(url, callback) {

    var start = new Date();
    var result = [];

    request(url, function (error, response, body) {
    if (url.indexOf("http") > -1) {
        var time = (new Date() - start);
        if (!error && response.statusCode == 200) {



            result.push({
                status: response.statusCode,
                time: time,
                header: response.headers,
                body: response.body
            })
            console.log("got json");
            callback(result);
        }   else {
            result.push({
                status  :   "URL NOT FOUND",
                time: time,
                header: response.headers
            })
            callback(result);
        }
    }   else if (error) {

    }  else  {
        if (response.statusCode == null){
            console.log("no status code");
        }


    }


    });



}


module.exports = {
    getMethod: getMethod,
    usingItNow: usingItNow
}
