angular.module('app.profileController', [])


.controller('profileController', function($scope, $cookies, $location, toastService) {
  $scope.title = 'Profile';

  $scope.$$phase || $scope.$apply();
  if(checkAuth($cookies.monster_cookie)) {
    $.ajax({
      type: "get",
      url: backend + "/profile/userid",
      beforeSend: function (xhr) {xhr.setRequestHeader ("Authorization", $cookies.monster_cookie)},
      }).done(function(data){
        console.log(data);
      console.log("done");
      }).fail(function(data){
        console.log("Error fetching profile info");
      }).success(function(data){
        $scope.profileUsername = data.username;
        $scope.profileGroup = data.group_name;

        $scope.$apply();
      });
  } else {

  toastService.displayToast("You must be logged in to view this!");

  $location.path("/login");

  }
});
