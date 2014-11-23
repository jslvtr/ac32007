angular.module('app.toast', ['ngRoute', 'ngCookies', 'ngMaterial'])

.factory('toastService', function($http, $mdToast, $cookies, $location){
  return {
     displayToast: function(message) {
       $mdToast.show({
         template: '<md-toast>' + message + '</md-toast>',
         hideDelay: 6000,
         position: 'bottom left'
       });
     }
   }
});
