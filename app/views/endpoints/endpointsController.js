angular.module('app.endpointsController', [])
    .controller('endpointsController', function($rootScope, $scope, $http, $timeout, $mdSidenav, $location, $routeParams, toastService) {
        $rootScope.$broadcast('showTabs', false);
        $scope.title = "Endpoint";

        $scope.header = {
            key : '',
            value : ''
        };

        $scope.param = {
            key : '',
            value : ''
        };

        $scope.project = {
            title : '',
            description : '',
            endpoints : []
        };

        $scope.endpoint = {
            method_type : 'get',
            title : '',
            description : '',
            url : '',
            headers : [],
            url_params : [],
            body : "",
            body_type : 'text'
        };

        var project_owner   = $routeParams.owner;
        var project_title   = $routeParams.title;
        var endpoint_token  = $routeParams.endpoint;

        var json_user = localStorage.getItem('user');
        $scope.sessionUser = null;
        if (json_user) {
            $scope.sessionUser  = JSON.parse(json_user);
        }

        var json_projects = localStorage.getItem('projects');
        if (json_projects) {
            $scope.projects  = JSON.parse(json_projects);
            $scope.loaded = true;
        }

        openProject ($scope, $http, toastService, project_owner, project_title);

        if (endpoint_token !== 'null') {
            fetchEndpoint ($scope, $http, toastService, project_owner, project_title, endpoint_token);
        }

        $scope.openEndpoint = function (endpoint, index) {
            $location.path('/user/' + endpoint.owner_id + '/project/' + endpoint.project_id + '/endpoint/' + endpoint.token_id);
            $scope.endpoint = endpoint;
            $scope.endpoint.method_type = $scope.endpoint.method_type.toUpperCase();
        };

        $scope.saveEndpoint = function (event) {
            if ($scope.endpoint.token_id) {
                updateEndpoint($scope, $http, toastService);
            } else {
                $scope.endpoint.owner_id = project_owner;
                $scope.endpoint.project_id = project_title;
                createEndpoint($scope, $http, $location, toastService);
            }
        };

        $scope.addNewURLParam = function () {
            if ($scope.param.key) {
                $scope.endpoint.url_params.push({
                    key : $scope.param.key,
                    value : $scope.param.value
                });

                $scope.param.key = '';
                $scope.param.value = '';
            }
        };

        $scope.addNewHeader = function () {
            if ($scope.header.key) {
                $scope.endpoint.headers.push({
                    key : $scope.header.key,
                    value : $scope.header.value
                });

                $scope.header.key = '';
                $scope.header.value = '';
            }
        };

        //$scope.endpoint = {
        //    method_type : 'GET',
        //    title : 'Fetch Users',
        //    description : 'Euismod Pharetra Risus Tortor.',
        //    url : 'https://api.demo.com/users',
        //    headers : [
        //        {
        //            head : 'Content-Type',
        //            value : 'application/json; charset=utf-8'
        //        },
        //        {
        //            head : 'Authorization',
        //            value : 'Bearer 87932ee1248c284fa36476bbc82ed9f7'
        //        }
        //    ],
        //    url_params : [],
        //    body : "",
        //    body_type : 'json'
        //};
        //
        //$scope.project = {
        //    title : 'Sample Project',
        //    description : 'Sed posuere consectetur est at lobortis. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
        //    endpoints : [
        //        {
        //            type : 'GET',
        //            title : 'Fetch Users',
        //            description : 'Euismod Pharetra Risus Tortor.',
        //            url : 'https://api.demo.com/users'
        //        },
        //        {
        //            type : 'GET',
        //            title : 'Fetch Users',
        //            description : 'Euismod Pharetra Risus Tortor.',
        //            url : 'https://api.demo.com/users'
        //        },
        //        {
        //            type : 'GET',
        //            title : 'Fetch Users',
        //            description : 'Euismod Pharetra Risus Tortor.',
        //            url : 'https://api.demo.com/users'
        //        },
        //        {
        //            type : 'GET',
        //            title : 'Fetch Users',
        //            description : 'Euismod Pharetra Risus Tortor.',
        //            url : 'https://api.demo.com/users'
        //        }
        //    ]
        //};

        $scope.bodyOptions = {
            mode: $scope.endpoint.body_type.toLowerCase(),
            onLoad: function (_ace) {
                // HACK to have the ace instance in the scope...
                $scope.modeChanged = function () {
                    _ace.getSession().setMode("ace/mode/" + $scope.endpoint.body_type.toLowerCase());
                };

            }
        };
    }
);

function openProject ($scope, $http, toastService, owner, project_id) {
    $http({
        url: backend + '/user/' + owner + '/project/' + project_id + '/endpoint',
        method: 'GET',
        dataType: 'json',
        data: '',
        headers: {
            'Authorization' : 'Bearer ' + $scope.sessionUser.access_token
        }

    }).error(function(data, status, headers, config) {
        if (status === 404) {
            toastService.displayToast("That project doesn't exist");
        } else {
            toastService.displayToast("Failed to fetch that project");
            console.error(data);
        }

        $scope.loaded = true;

    }).success(function (data, status, headers, config) {
        $scope.project = {
            title : project_id,
            owner : owner,
            endpoints : data.endpoints
        };
        $scope.loaded = true;
    });
}

function fetchEndpoint ($scope, $http, toastService, owner, project_id, endpoint_token) {
    $http({
        url: backend + '/user/' + owner + '/project/' + project_id + '/endpoint/' + endpoint_token,
        method: 'GET',
        dataType: 'json',
        data: '',
        headers: {
            'Authorization' : 'Bearer ' + $scope.sessionUser.access_token
        }

    }).error(function(data, status, headers, config) {
        if (status === 404) {
            toastService.displayToast("That endpoint doesn't exist");
        } else {
            toastService.displayToast("Failed to fetch that endpoint");
            console.error(data);
        }

        $scope.loaded = true;

    }).success(function (data, status, headers, config) {
        $scope.endpoint = data.endpoint;
        $scope.endpoint.method_type = $scope.endpoint.method_type.toUpperCase();
        $scope.loaded = true;
        $scope.modeChanged();
    });
}

function createEndpoint ($scope, $http, $location, toastService) {
    var owner = $scope.endpoint.owner_id;
    var project = $scope.endpoint.project_id;

    $http({
        url: backend + '/user/' + owner + '/project/' + project + '/endpoint/',
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify($scope.endpoint),
        headers: {
            'Content-Type' : 'application/json; charset=utf-8',
            'Authorization' : 'Bearer ' + $scope.sessionUser.access_token
        }

    }).error(function(data, status, headers, config) {
        if (status === 404) {
            toastService.displayToast("That endpoint doesn't exist");
        } else {
            toastService.displayToast("Failed to fetch that endpoint");
            console.error(data);
        }

        $scope.loaded = true;

    }).success(function (data, status, headers, config) {
        if (status === 201) {
            $location.path('/user/' + owner + '/project/' + project + '/endpoint/' + data.token);
        }
        //$scope.endpoint = data.endpoint;
        //$scope.endpoint.method_type = $scope.endpoint.method_type.toUpperCase();
        $scope.loaded = true;
    });
}

function updateEndpoint ($scope, $http, $location, toastService) {
    var owner = $scope.endpoint.owner_id;
    var project = $scope.endpoint.project_id;

    $http({
        url: backend + '/user/' + owner + '/project/' + project + '/endpoint/' + $scope.endpoint.token_id,
        method: 'PUT',
        dataType: 'json',
        data: JSON.stringify($scope.endpoint),
        headers: {
            'Content-Type' : 'application/json; charset=utf-8',
            'Authorization' : 'Bearer ' + $scope.sessionUser.access_token
        }

    }).error(function(data, status, headers, config) {
        if (status === 404) {
            toastService.displayToast("That endpoint doesn't exist");
        } else {
            toastService.displayToast("Failed to fetch that endpoint");
            console.error(data);
        }

        $scope.loaded = true;

    }).success(function (data, status, headers, config) {
        if (status === 201) {
            //toastService.displayToast("Endpoint Updated.");
            //$location.path('/user/' + owner + '/project/' + project + '/endpoint/' + data.token);
        }
        //$scope.endpoint = data.endpoint;
        //$scope.endpoint.method_type = $scope.endpoint.method_type.toUpperCase();
        $scope.loaded = true;
    });
}