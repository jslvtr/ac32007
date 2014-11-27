angular.module('app.indexController', [])
    .controller('appController', function($scope, $http, $location, $timeout, $mdSidenav, $mdDialog, authService) {
        $scope.showTabs = true;
        $scope.isLoggedIn = false;
        $scope.tabs = [];

        var route = window.location.href.substring(window.location.href.indexOf('#'));
        if (route === '#/login' || route === '#/profile') {
            $scope.$root.selectedIndex = 0;
        } else if (route === '#/register' || route === '#/projects') {
            $scope.$root.selectedIndex = 1;
        } else if (route === '#/login' || route === '#/about') {
            $scope.$root.selectedIndex = 2;
        }

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
            loadTabs ($scope)
        });

        $scope.$on('showTabs', function(event, showTabs) {
            $scope.showTabs = showTabs;
        });

        $scope.$root.openTab = function (index) {
            $scope.$root.selectedIndex = index;
            $timeout(function () {
                window.location = $scope.tabs[index].url;
            }, 50);
        };

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

        $scope.next = function() {
            console.log('Next');
            $scope.$root.openTab(Math.min($scope.$root.selectedIndex + 1, $scope.tabs.length - 1));
        };
        $scope.previous = function() {
            console.log('Prev');
            $scope.$root.openTab(Math.max($scope.$root.selectedIndex - 1, 0));
        };

        $scope.openTab = function (tab) {
            $location = tab.url;
        };

        if(!$scope.$$phase) {
            $scope.$apply();
        }

        loadTabs ($scope)
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

function loadTabs ($scope, $location) {
    $scope.tabs = [];

    $scope.tabs.push({
        name: 'home',
        url: '#/',
        title: 'Home'
    });

    if ($scope.isLoggedIn == false) {
        $scope.tabs.push({
            name: 'login',
            url: '#/login',
            title: 'Login'
        });

        $scope.tabs.push({
            name: 'register',
            url: '#/register',
            title: 'Register'
        });
    } else {
        $scope.tabs.push({
            name: 'profile',
            url: '#/profile',
            title: 'Profile'
        });

        $scope.tabs.push({
            name: 'projects',
            url: '#/projects',
            title: 'Projects'
        });
    }

    $scope.tabs.push({
        name: 'about',
        url: '#/about',
        title: 'About'
    });
}