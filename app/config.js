/*
      Set the url to your domain
      Exclude http:// and do not add / at the end
*/

var domain = 'https://agileapi.herokuapp.com';
var port = ':443';

//var domain = 'http://localhost:8080';
//var port = '';

/*
        Do not touch unless developers
*/

var backend = domain;
var socketsBackend = backend + port;
angular.module('app.config', [])

    .factory('Configuration', function() {
        return {
            backend: backend,
            socketsBackend: socketsBackend
        }
    });
