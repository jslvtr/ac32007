angular.module('app.listDialog', ['app.listService'])

.controller('listDialog', function($routeParams, $scope, $cookies, $location, $mdDialog, listService, listService, toastService, $rootScope) {
  if ($cookies.monster_cookie != null)  {
    $scope.dialogAdd = function(ev) {
      switch($routeParams.query){
          case "camera":
            $mdDialog.show({
              templateUrl: 'app/views/list/input/camera.html',
              targetEvent: ev,
              controller: DialogController
            });
          break;
          case "customer":
            $mdDialog.show({
              templateUrl: 'app/views/list/input/customer.html',
              targetEvent: ev,
              controller: DialogController
            });
          break;
          case "hobby":
            $mdDialog.show({
              templateUrl: 'app/views/list/input/hobbies.html',
              targetEvent: ev,
              controller: DialogController
            });
          break;
          case "lens":
            $mdDialog.show({
              templateUrl: 'app/views/list/input/lens.html',
              targetEvent: ev,
              controller: DialogController
            });
          break;
          case "profession":
            $mdDialog.show({
              templateUrl: 'app/views/list/input/profession.html',
              targetEvent: ev,
              controller: DialogController
            });
          break;
          case "sale":
            $mdDialog.show({
              templateUrl: 'app/views/list/input/sale.html',
              targetEvent: ev,
              controller: DialogController
            });
          break;
          case "storage":
            $mdDialog.show({
              templateUrl: 'app/views/list/input/storage.html',
              targetEvent: ev,
              controller: DialogController
            });
          break;
          case "type":
            $mdDialog.show({
              templateUrl: 'app/views/list/input/type.html',
              targetEvent: ev,
              controller: DialogController
            });
            //window.location.reload(true);
          break;
        }
  };





  function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };


  $scope.submitNewType = function(answer)  {
    console.log("user wanted to add something");
    switch($routeParams.query){
        case "camera":
          listService.addCameras(answer);
        break;
        case "countries":
          listService.addCountries(answer);
        break;
        case "customer":
          console.log(answer);
          //listService.addCustomers(answer);
        break;
        case "hobby":
          listService.addHobbies(answer);
        break;
        case "lens":
          listService.addLens(answer);
        break;
        case "profession":
          listService.addProfessions(answer);
        break;
        case "sale":
          listService.addSales(answer);
        break;
        case "storage":
          listService.addStorages(answer);

        break;
        case "type":
          listService.addTypes(answer);

        break;
      }
      //window.location.reload(true);
    }
  }
} else {
    $scope.title="You must be logged in";
    toastService.displayToast("You must be logged in to access in");
    //$location.path("/login");
  //  $rootScope.$Apply();
  }
})
