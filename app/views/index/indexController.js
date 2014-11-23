angular.module('app.indexController', [])
    .controller('appController', function($scope, $http, $location, $timeout, $mdSidenav, $mdDialog, authService) {
        $scope.isLoggedIn = false;

        var json_user = localStorage.getItem('user');
        if (json_user !== null) {
            $scope.sessionUser = JSON.parse(json_user);
        }

        if ($scope.sessionUser != null && $scope.sessionUser.access_token != null)  {
            $scope.isLoggedIn = true;
        } else  {
            $scope.isLoggedIn = false;
        }

        $scope.$on('logged-in', function(event, isLoggedIn) {
            $scope.isLoggedIn = isLoggedIn;
        });

        $scope.toggleRight = function() {
            $mdSidenav('right').toggle();
        };

        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle();
        };

        $scope.checkLoggedIn = function () {
            var json_user = localStorage.getItem('user');
            if (json_user !== null) {
                $scope.sessionUser = JSON.parse(json_user);
            }

            if ($scope.sessionUser != null && $scope.sessionUser.access_token != null) {
                $scope.isLoggedIn = true;
            } else {
                $scope.isLoggedIn = false;
            }

            return $scope.isLoggedIn;
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
