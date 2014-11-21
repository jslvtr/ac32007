var calls = require('../components/calls.js');
var url = require('url');

function about (req, res) {
    res.json({
        status: 200,
        version: 0.1,
        authors: [
            'Stuart Douglas',
            'Jose Salvatierra',
            'Yago Carballo'
        ]
    });
}


function headers(req, res)  {
    calls.getMethod(req.headers.url, function(callback){
        res.send(callback);
    })

}

module.exports = {
    about       : about,
    headers     : headers
};