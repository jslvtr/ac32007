angular.module('app.logoutController', [])
  .controller('logoutController', function($scope, $http, $location, toastService, $rootScope) {
      $scope.title = "Logout";

      var json_user = localStorage.getItem('user');
      $scope.sessionUser = null;
      if (json_user) {
        $scope.sessionUser  = JSON.parse(json_user);
      }

      //If there is a cookie that exists then delete it
      if($scope.sessionUser) {
          $http({
            url: backend + '/auth/logout',
            method: 'GET',
            dataType: 'json',
            data: '',
            headers: {
              'Authorization' : 'Bearer ' + $scope.sessionUser.access_token
            }

          }).error(function(data, status, headers, config) {
            console.log("Error logging user out");
            toastService.displayToast("Error, Can't logout");
            $location.path("/");

          }).success(function (data, status, headers, config) {
            localStorage.clear();
            $rootScope.$broadcast('logged-in', false);
            toastService.displayToast("You have logged out");

            $location.path("/");
          });

      } else { //Looks like the user was not even logged in, better let them know
        $rootScope.$broadcast('logged-in', false);
        $rootScope.isLoggedIn = false;
        $location.path("/");
        toastService.displayToast("You are already logged out");
      }
  }
);
