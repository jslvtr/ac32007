angular.module('app.profileController', [])
  .controller('profileController', function($scope, $http, $location, toastService) {
      $scope.title = 'Profile';
      $scope.$$phase || $scope.$apply();

      var json_user = localStorage.getItem('user');
      $scope.sessionUser = null;
      if (json_user) {
        $scope.sessionUser  = JSON.parse(json_user);
      }

      if ($scope.sessionUser) {
        $http({
          url: backend + '/user/' + $scope.sessionUser.username + '/profile',
          method: 'GET',
          dataType: 'json',
          data: '',
          headers: {
            'Authorization' : 'Bearer ' + $scope.sessionUser.access_token
          }

        }).error(function(data, status, headers, config) {
          console.log("Error fetching profile info");

        }).success(function (data, status, headers, config) {
          $scope.profileUsername = data.user.username;
          $scope.profileMessage = data.message;
        });

      } else {
        toastService.displayToast("You must be logged in to view this!");
        $location.path("/login");
      }
  }
);