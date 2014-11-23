angular.module('app.loginController', [])

.controller('loginController', function($scope, $cookies, $location, toastService, authService, $rootScope){
    $scope.message = 'Login';
    $scope.login={};
    //$scope.login.password = CryptoJS.SHA512($scope.login.password);
    $scope.submit = function()  {

      var pass = $scope.login.password;
      console.log(pass);
      var hash = CryptoJS.SHA512(pass).toString();
      console.log(hash);
      $.ajax({
        type: "POST",
        url: backend + "/login",
        data: JSON.stringify({username: $scope.login.username, password: hash}),
        dataType: "JSON"
        }).done(function(data){

        $scope.status=data.status;
        $scope.access_token = data.access_token;
        console.log(JSON.stringify(data, null, 5));
        //alert(JSON.stringify(data, null, 4));
      }).error(function(data){
        $scope.toast = "Something went wrong";
        $scope.loginStatus = data.status;
          //should delete cookie
        }).success(function(data){
        if(data.status == "200"){
          authService.checkLoggedIn();
          cookie = data.user.access_token;
          $cookies.monster_cookie = cookie;
          $rootScope.isLoggedIn = true;
          $location.path("/");

        } else if(data.status == "403") {
          console.log("incorrect login");
        }

        $.ajax({
          type: "get",
          url: backend + "/profile/userid",
          beforeSend: function (xhr) {xhr.setRequestHeader ("Authorization", $cookies.monster_cookie)},
          }).done(function(data){
            //something
          }).fail(function(data){
            console.log("service says boo");
            false;
          }).success(function(data){
              if ($cookies.monster_cookie == data.access_token)  {
                //console.log("valid user");
                if (data.group_name == "admins"){
                  $rootScope.isAdmin = true;
                  //console.log("is admin");

                } else {
                  $rootScope.isAdmin = false;
                }
                $scope.isLoggedIn = true;
                isLoggedIn = true;
                $rootScope.$apply();

                $scope.$apply();
              } else {
                //console.log("Invalid user");
                isLoggedIn = false;
              }
          });


          toastService.displayToast(data.message);
        $scope.$apply();
        if(!$rootScope.$$phase) {
          $rootScope.$apply();
        }
      });
    }

});
