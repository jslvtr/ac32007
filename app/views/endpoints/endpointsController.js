angular.module('app.endpointsController', [])
    .controller('endpointsController', function($rootScope, $scope, $http, $timeout, $mdSidenav) {
      $rootScope.$broadcast('showTabs', false);
      $scope.title = "Endpoint";

      $scope.endpoint = {
          type : 'GET',
          title : 'Fetch Users',
          description : 'Euismod Pharetra Risus Tortor.',
          url : 'https://api.demo.com/users',
          heads : [
              {
                  head : 'Content-Type',
                  value : 'application/json; charset=utf-8'
              },
              {
                  head : 'Authorization',
                  value : 'Bearer 87932ee1248c284fa36476bbc82ed9f7'
              }
          ],
          url_params : [],
          body : ""
      };

      $scope.project = {
          title : 'Sample Project',
          description : 'Sed posuere consectetur est at lobortis. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
          endpoints : [
              {
                  type : 'GET',
                  title : 'Fetch Users',
                  description : 'Euismod Pharetra Risus Tortor.',
                  url : 'https://api.demo.com/users'
              },
              {
                  type : 'GET',
                  title : 'Fetch Users',
                  description : 'Euismod Pharetra Risus Tortor.',
                  url : 'https://api.demo.com/users'
              },
              {
                  type : 'GET',
                  title : 'Fetch Users',
                  description : 'Euismod Pharetra Risus Tortor.',
                  url : 'https://api.demo.com/users'
              },
              {
                  type : 'GET',
                  title : 'Fetch Users',
                  description : 'Euismod Pharetra Risus Tortor.',
                  url : 'https://api.demo.com/users'
              }
          ]
      };
    }
);
