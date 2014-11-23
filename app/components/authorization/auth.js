angular.module('app.auth', ['ngRoute', 'ngCookies', 'ngMaterial'])

.factory('authService', function($http, $mdToast, $cookies, $location, $rootScope){
  return {
     checkLoggedIn: function() {
       /*
       var cookie = $cookies.monster_cookie;
       console.log(cookie);
       $.ajax({
         type: "get",
         url: backend + "/profile/userid",
         beforeSend: function (xhr) {xhr.setRequestHeader ("Authorization", cookie)},
         }).done(function(data){
           //something
         }).fail(function(data){
           console.log("service says boo");
           false;
         }).success(function(data){


           if (cookie != null) {
             if (cookie == data.access_token)  {
               console.log("valid user");
               $rootScope.isLoggedIn = true;

               $rootScope.$apply();
             } else {
               false;
               console.log("Invalid user");
             }
           }  else {
             console.log("No cookies makes me sad");
             $rootScope.isLoggedIn = false;
             $rootScope.$apply();
           }
         });
         */
     }
   }
});
