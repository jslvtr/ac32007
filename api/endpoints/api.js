var calls = require('../components/calls.js');

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
   res.send(calls.getMethod("http://www.google.com"));
}

module.exports = {
    about       : about,
    headers     : headers
};