angular.module('app.listController', ['app.listService'])


.controller('listController', function($routeParams, $scope, $rootScope, $cookies, $location, $mdDialog, toastService , listService) {
  $scope.title = "List: Admin only";
  $scope.subject = $routeParams.query;
  if ($scope.isLoggedIn)  {
  switch($routeParams.query){
    case "camera":
      listService.getCameras(function(data)  {
        $scope.output = data.camera_camera;
        $scope.dataReady = true;
      })
    break;
    case "countries":
      listService.getCountries(function(data)  {
        $scope.output = data.countries;
        $scope.dataReady = true;
      })
    break;
    case "customer":
      listService.getCustomers(function(data)  {
        $scope.output = data.customer_customer;
        $scope.dataReady = true;
      })
    break;
    case "hobby":
      listService.getHobbies(function(data)  {
        $scope.output = data.hobby_type;
        $scope.dataReady = true;
      })
    break;
    case "lens":
      listService.getLens(function(data)  {
        $scope.output = data.lens_type;
        $scope.dataReady = true;
      })
    break;
    case "profession":
      listService.getProfessions(function(data)  {
        $scope.output = data.profession;
        $scope.dataReady = true;
      })
    break;
    case "sale":
      listService.getSales(function(data)  {
        $scope.output = data.sales;
      })
        $scope.dataReady = true;
    break;
    case "storage":
      listService.getStorages(function(data)  {
        $scope.output = data.storage_types;
        $scope.dataReady = true;
      })
    break;
    case "type":
      listService.getTypes(function(data)  {
        $scope.output = data.camera_type;
        $scope.dataReady = true;
      })
    break;
    default:
      toastService.displayToast("No results returned for " + $routeParams.query);
      $location.path("/list");
      break;
  }
  
} else {
  toastService.displayToast("You must be logged in to access this.");
  $location.path("/login");
}


$scope.announceSelected = announceSelected;
function announceSelected(tab) {
  //console.log("hey " + tab);
//$location.path("/list/" + tab);
}

});
