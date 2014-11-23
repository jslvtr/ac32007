angular.module('app.indexController', [])
    .controller('appController', function($scope, $http, $location, $timeout, $mdSidenav, $mdDialog, authService) {
        var json_user = localStorage.getItem('user');
        if (json_user !== null) {
            $scope.sessionUser = JSON.parse(json_user);
        }

        if ($scope.sessionUser != null && $scope.sessionUser.access_token != null)  {
            $scope.isLoggedIn = true;

            $http({
                url: backend + '/user/' + $scope.sessionUser.username + '/profile',
                method: 'GET',
                dataType: 'json',
                data: '',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': 'Bearer ' + $scope.sessionUser.access_token
                }

            }).error(function(data, status, headers, config) {
                console.log("service says boo");
                false;

            }).success(function (data, status, headers, config) {
                if (status === 401) { // Unauthorized
                    $scope.isLoggedIn = false;
                } else if ($scope.sessionUser.access_token == data.access_token)  {
                    $scope.isLoggedIn = true;
                } else {
                    $scope.isLoggedIn = false;
                }

                $scope.$apply();
            });

        } else  {
            console.log("boo");
        }

        $scope.toggleRight = function() {
            $mdSidenav('right').toggle();
        };

        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle();
        };

        console.log($scope.isLoggedIn);

        if ( $scope.isLoggedIn == true){
            var tabs = [];
            $scope.tabs = tabs;
            $scope.selectedIndex = 2;

        } else {
            var tabs = [];
            $scope.tabs = tabs;
            $scope.selectedIndex = 2;
        }

        if(!$scope.$$phase) {
            $scope.$apply();
        }
    })

    .controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $location) {
        $scope.close = function() {
            $mdSidenav('left').close();
        };
    })

    .controller('RightCtrl', function($scope, $timeout, $mdSidenav) {
        var showList = false;
            $scope.close = function() {
            $mdSidenav('right').close();
        };
    });

var cookie = null;
//Handles the user auth
function checkAuth(cookie)  {
    if (cookie != null){
        //$scope.isLoggedIn = true;
        return true;
    }
    return null;
}
