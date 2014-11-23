var calls = require('../components/calls.js');
var url = require('url');
var bodyparser = require('body-parser');


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


function methodGet(req, res)  {
    calls.getMethod(req.headers.url, function(callback){
        res.send(callback);
    })

}


function do_dododo(req, res)    {
    var html = '<html><img src="http://i.imgur.com/V7r85qg.gif"/><iframe width="0" height="0" src="//www.youtube.com/embed/nqLArgCbh70?autoplay=1" frameborder="0" allowfullscreen></iframe><style>iframe{display:none;}img{position: absolute;top: 50%;left: 0%;}</style></html>';
    res.send(html);
}

module.exports = {
    about       : about,
    methodGet     : methodGet,
    do_dododo   : do_dododo
};