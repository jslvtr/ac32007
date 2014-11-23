angular.module('app.listService', ['ngRoute', 'ngCookies', 'ngMaterial'])

.factory('listService', function($http, $mdToast, $cookies, $location, $rootScope){
  return {
    getCameras: function(callback) {
      return $http({url: backend + '/camera', method:'GET',dataType:'json', headers: {
               'Content-Type': 'application/json; charset=utf-8',
               'Authorization': $cookies.monster_cookie
           }}).success(callback);
    },
    getCountries: function(callback) {
      return $http({url: backend + '/countries', method:'GET',dataType:'json', headers: {
               'Content-Type': 'application/json; charset=utf-8',
               'Authorization': $cookies.monster_cookie
           }}).success(callback);
    },
    getCustomers: function(callback) {
      return $http({url: backend + '/customer', method:'GET',dataType:'json', headers: {
               'Content-Type': 'application/json; charset=utf-8',
               'Authorization': $cookies.monster_cookie
           }}).success(callback);
    },
    getHobbies: function(callback) {
      return $http({url: backend +'/hobby', method:'GET',dataType:'json', headers: {
               'Content-Type': 'application/json; charset=utf-8',
               'Authorization': $cookies.monster_cookie
           }}).success(callback);
    },
    getLens: function(callback) {
      return $http({url: backend + '/lens', method:'GET',dataType:'json', headers: {
               'Content-Type': 'application/json; charset=utf-8',
               'Authorization': $cookies.monster_cookie
           }}).success(callback);
    },
    getProfessions: function(callback) {
      return $http({url: backend + '/profession', method:'GET',dataType:'json', headers: {
               'Content-Type': 'application/json; charset=utf-8',
               'Authorization': $cookies.monster_cookie
           }}).success(callback);
    },
    getSales: function(callback) {
      return $http({url: backend + '/sale', method:'GET',dataType:'json', headers: {
               'Content-Type': 'application/json; charset=utf-8',
               'Authorization': $cookies.monster_cookie
           }}).success(callback);
    },
    getStorages: function(callback) {
      return $http({url: backend + '/storage', method:'GET',dataType:'json', headers: {
               'Content-Type': 'application/json; charset=utf-8',
               'Authorization': $cookies.monster_cookie
           }}).success(callback);
    },

     getTypes: function(callback) {
       return $http({url: backend + '/type', method:'GET',dataType:'json', headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': $cookies.monster_cookie
            }}).success(callback);
     },

     /*

                Add new items to the database
     */



     addTypes: function(answer) {
       $.ajax({
        type:"POST",
        url: backend + "/type",
        beforeSend: function (xhr) {xhr.setRequestHeader ("Authorization", $cookies.monster_cookie)},
        data: JSON.stringify({name: answer}),
        dataType: "JSON"
        });

     },
     addStorages: function(answer)  {
       $.ajax({
        type:"POST",
        url: backend + "/storage",
        beforeSend: function (xhr) {xhr.setRequestHeader ("Authorization", $cookies.monster_cookie)},
        data: JSON.stringify({name: answer}),
        dataType: "JSON"
        });
     },
     addLens: function(answer)  {
       $.ajax({
        type:"POST",
        url: backend + "/lens",
        beforeSend: function (xhr) {xhr.setRequestHeader ("Authorization", $cookies.monster_cookie)},
        data: JSON.stringify({name: answer}),
        dataType: "JSON"
        });
     },
     addHobbies: function(answer) {
       $.ajax({
        type:"POST",
        url: backend + "/hobby",
        beforeSend: function (xhr) {xhr.setRequestHeader ("Authorization", $cookies.monster_cookie)},
        data: JSON.stringify({name: answer}),
        dataType: "JSON"
        });
     },
     addProfessions: function(answer) {
       $.ajax({
        type:"POST",
        url: backend + "/profession",
        beforeSend: function (xhr) {xhr.setRequestHeader ("Authorization", $cookies.monster_cookie)},
        data: JSON.stringify({title:answer.title, salary:answer.salary, years:answer.years}),
        dataType: "JSON"
        });
     },
     addCustomers: function(answer, id) {
       $.ajax({
        type:"POST",
        url: backend + "/customer",
        beforeSend: function (xhr) {xhr.setRequestHeader ("Authorization", $cookies.monster_cookie)},
        data: JSON.stringify({first_name: answer.first_name, last_name: answer.last_name, date_of_birth: answer.date_of_birth, gender:answer.gender, country_id:id }),
        dataType: "JSON"
        });
     }
   }
});
