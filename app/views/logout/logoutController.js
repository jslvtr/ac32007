angular.module('app.logoutController', [])
  .controller('logoutController', function($scope, $cookies, $location, toastService, $rootScope) {
      $scope.title = "Logout";

      var json_user = localStorage.getItem('user');
      $scope.sessionUser = null;
      if (json_user) {
        $scope.sessionUser  = JSON.parse(json_user);
      }

      //If there is a cookie that exists then delete it
      if($scope.sessionUser) {
        localStorage.clear();
        toastService.displayToast("You have logged out");

        if(!$rootScope.$$phase) {
          $rootScope.$apply();
          $scope.$apply();
        }

        $location.path("/");

      } else { //Looks like the user was not even logged in, better let them know
        $location.path("/");
        toastService.displayToast("You are already logged out");
      }
  }
);
