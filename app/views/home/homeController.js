angular.module('app.homeController', [])
    .controller('homeController', function($rootScope, $scope, $http) {
        $rootScope.$broadcast('showTabs', true);
        $scope.title = "Home";

        $http({
            url: backend + '/',
            method: 'GET',
            dataType: 'json',
            data: '',
            headers: {}

        }).error(function(data, status, headers, config) {
            console.log("service says boo");
            false;

        }).success(function (data, status, headers, config) {
            $scope.data = data;
            $scope.online = true;
        });
    }
);
