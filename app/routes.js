angular.module('app.routes', ['ngRoute',])

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
    .when('/query', {
      templateUrl: 'views/query/query.html',
      controller: 'queryController'
    })
    .when('/query/stats/number', {
      templateUrl: 'views/query/stats/stats.html',
      controller: 'numberController'
    })
    .when('/query/stats/earning', {
      templateUrl: 'views/query/stats/stats.html',
      controller: 'earningController'
    })
    .when('/query/stats/date', {
      templateUrl: 'views/query/stats/date.html',
      controller: 'dateController'
    })
    .when('/query/stats/popularbycountry/type', {
      templateUrl: 'views/query/stats/byCountries.html',
      controller: 'byCountryController'
    })
    .when('/query/stats/popularbycountry/camera', {
      templateUrl: 'views/query/stats/byCountries.html',
      controller: 'popularCameraByCountryController'
    })
    .when('/query/stats/monthlysales', {
      templateUrl: 'views/query/stats/stats.html',
      controller: 'monthlySalesByBrandController'
    })
    .when('/query/stats/topsold', {
      templateUrl: 'views/query/stats/topSold.html',
      controller: 'topHobbyController'
    })
    .when('/query/stats/topfeatures', {
      templateUrl: 'views/query/stats/topfeatures.html',
      controller: 'topFeaturesController'
    })
    .otherwise({
      templateUrl: 'views/404.html'
    })




});
