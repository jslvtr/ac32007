'use strict';
angular.module('app.registerController', ['ngRoute', 'ngCookies'])
    .controller('registerController', function($scope, $http, $location){
        $scope.message="Register";
        $scope.submit = function(){
            var password    = $scope.form.password;
            var hash        = CryptoJS.SHA512(password).toString();

            $http({
                url: backend + '/auth/register',
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify({
                    full_name: $scope.form.full_name,
                    email    : $scope.form.email,
                    username : $scope.form.username,
                    password : hash
                }),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }

            }).error(function(data, status, headers, config) {
                if(status === 403) {
                    $scope.registerError = status;

                }  else if (data.status === 409){
                    $scope.formError = status + " - Username already exists.";
                }

                //console.log("oh it failed " + data.status);
                $scope.registerStatus = status;
                console.log("error");

            }).success(function (data, status, headers, config) {
                if(status === 201){
                    $scope.registerSuccess = status;
                    localStorage.setItem('user', JSON.stringify(data.user));
                    $location.path("/profile");

                } else if(status === 204){
                    $scope.formError = status + " - Username already exists.";
                }

                console.log(status);
            });
        }
    }
);
