angular.module('app.loginController', [])
  .controller('loginController', function($scope, $http, $location, toastService, authService, $rootScope){
      $rootScope.$broadcast('showTabs', true);
      $scope.message = 'Login';
      $scope.login = {};
      $scope.submit = function()  {
        var pass = $scope.login.password;
        var hash = CryptoJS.SHA512(pass).toString();

        $http({
          url: backend + '/auth/login',
          method: 'POST',
          dataType: 'json',
          data: JSON.stringify({
            username : $scope.login.username,
            password : hash
          }),
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }

        }).error(function(data, status, headers, config) {
          if (data.status === 409){
            $scope.toast = "Invalid username or Password";
          } else if(status == 403) {
            $scope.toast = "incorrect login";
          } else {
            $scope.toast = "Something went wrong";

          }

          $scope.loginStatus = data.status;
          console.error("error");

        }).success(function (data, status, headers, config) {
          if(status === 200) {
            $scope.status = status;
            $scope.access_token = data.user.access_token;
            $scope.user = data.user.user;

            localStorage.setItem('user', JSON.stringify(data.user));
            $rootScope.$broadcast('logged-in', true);
            $location.path("/profile");

          } else {
            console.log("incorrect login");
          }

        });
      }
  });
