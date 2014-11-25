angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/home/home.html',
      controller: 'homeController'
    })
    .when('/about', {
      templateUrl: 'views/about/about.html',
      controller: 'aboutController'
    })
    .when('/login', {
      templateUrl: 'views/login/login.html',
      controller: 'loginController'
    })
    .when('/register', {
      templateUrl: 'views/register/register.html',
      controller: 'registerController'
    })
    .when('/logout', {
      templateUrl: 'views/logout/logout.html',
      controller: 'logoutController'
    })
    .when('/profile', {
      templateUrl: 'views/profile/profile.html',
      controller: 'profileController'
    })
    .when('/countries', {
      templateUrl: 'views/countries.html',
      controller: 'countriesController'
    })
    .when('/list/:query', {
      templateUrl: 'views/list/list.html',
      controller: 'listController'
    })
    .when('/list', {
      templateUrl: 'views/list/list.html',
      controller: 'listController'
    })
    .when('/projects', {
      templateUrl: 'views/projects/projects.html',
      controller: 'projectsController'
    })
    .otherwise({
      templateUrl: 'views/404.html'
    })




});
