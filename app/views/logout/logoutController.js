angular.module('app.logoutController', [])


.controller('logoutController', function($scope, $cookies, $location, toastService, $rootScope) {
  $scope.title = "Logout";
  //If there is a cookie that exists then delete it
  if($cookies.monster_cookie != null) {
    document.cookie = 'monster_cookie' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    $rootScope.isLoggedIn = false;
    $scope.isLoggedIn = false;

    $location.path("/login");
    toastService.displayToast("You have logged out");
    if(!$rootScope.$$phase) {
      $rootScope.$apply();
      $scope.$apply();
    }


  } else { //Looks like the user was not even logged in, better let them know
    $location.path("/");
    toastService.displayToast("You are already logged out");
  }
});
