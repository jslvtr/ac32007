'use strict';

/**
 * @ngdoc overview
 * @name testApp
 * @description
 * # testApp
 *
 * Main module of the application.
 */
angular
  .module('app', [
  // Configuration
  'app.config',

  //dependencies
  'ngCookies',
  'ngMaterial',
  'ui.bootstrap',
  'angular-table',
  'app.listDialog',
  'ngAnimate',
  'ui.ace',
  'ngSanitize',
  'btford.socket-io',

  //Controllers
  'app.indexController',
  'app.homeController',
  'app.aboutController',
  'app.loginController',
  'app.registerController',
  'app.logoutController',
  'app.profileController',
  'app.listController',
  'app.projectsController',
  'app.endpointsController',

  //Services
  'app.toast',
  'app.auth',

  //Routes
  'app.routes'



  ])
  .factory('agileSocket', function (socketFactory) {
      var myIoSocket = io.connect(backend + '/activity/server');

      var agileSocket = socketFactory({
        ioSocket: myIoSocket
      });

      agileSocket.forward('error');

      return agileSocket;

      //var agileSocket = socketFactory();
      //agileSocket.forward('error');
      //return agileSocket;
  });
