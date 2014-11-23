angular.module('app.homeController', [])


.controller('homeController', function($scope, $http) {
  $scope.title = "Home";
  $.ajax({
          type: "get",
          url: backend + "/",
          //beforeSend: function (xhr) {xhr.setRequestHeader ("Authorization", $cookies.monster_cookie)},
          }).done(function(data){
            //something
          }).fail(function(data){
            console.log("service says boo");
            false;
          }).success(function(data){
  			$scope.data = data;
                $scope.online = true;
          });
});
