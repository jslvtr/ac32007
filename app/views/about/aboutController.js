angular.module('app.aboutController', [])


.controller('aboutController', function($scope, $timeout, $mdSidenav) {
  $scope.title = "About";
  $.ajax({
    type: "get",
    url: backend + '/'
    }).done(function(data){

    }).fail(function(data){
      //delete $window.sessionStorage.token;
      console.log("failed to get about data");
    }).success(function(data){
      $scope.profile = data.message;
      $scope.module = data.module;
      $scope.team = data.team;
      $scope.version = data.version;
      $scope.members = data.members;
      $scope.$apply();
    });
});
