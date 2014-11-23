var request = require ('request');

function getMethod(url, callback) {

    var start = new Date();
    var result = [];

    request(url, function (error, response, body) {
        var fallback = false; //If the client sends url without http it will add it and set this true so if it fails again it will check https://
        if (url.indexOf("https") == -1 && url.indexOf("http") == -1) {
            url = url + "http://";
        }
        try {
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
            }   else  if (response.statusCode == null){
                console.log("no status code");
            }   else {
                result.push({
                    status: response.statusCode,
                    time: time,
                    header: response.headers,
                    body: response.body
                })
                callback(result);
            }
        }   catch(ex)    {
            /*

                                TODO  IMPORTANT!!!

                    Please check this method when deployed to heroku
                    When querying https://localhost it breaks nodejs.
                    This method stops that query from breaking stuff.

             */
            console.log("something went wrong: " + ex);
            result.push({
                status: 404,
                dev_note: "you might want to check this out....",
                time: time
            })
            callback(result);
        }
    });



}


module.exports = {
    getMethod: getMethod
}
