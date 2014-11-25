angular.module('app.endpointsController', [])
    .controller('endpointsController', function($rootScope, $scope, $http, $timeout, $mdSidenav) {
      $rootScope.$broadcast('showTabs', false);
      $scope.title = "Endpoint";
    }
);
