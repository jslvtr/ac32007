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

  //Services
  'app.toast',
  'app.auth',

  //Routes
  'app.routes'



  ]);
