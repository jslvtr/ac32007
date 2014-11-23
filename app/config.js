/*
      Set the url to your domain
      Exclude http:// and do not add / at the end
*/

var domain = 'https://agileapi.herokuapp.com';



/*
        Do not touch unless developers
*/

var backend = domain;
angular.module('app.config', [])

    .factory('Configuration', function() {
        return {
            backend: backend
        }
    });
