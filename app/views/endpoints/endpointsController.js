angular.module('app.endpointsController', [])
    .controller('endpointsController', function($rootScope, $scope, $http, $timeout, $mdSidenav, $routeParams, toastService) {
        $rootScope.$broadcast('showTabs', false);
        $scope.title = "Endpoint";

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
            body_type : 'raw'
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

        openProject ($scope, $http, toastService, $routeParams.owner, $routeParams.title);

        if (endpoint_token !== 'null') {
            fetchEndpoint ($scope, $http, toastService, $routeParams.owner, $routeParams.title);
        }

        $scope.openEndpoint = function (endpoint, index) {
            $scope.endpoint = endpoint;
            $scope.endpoint.method_type = $scope.endpoint.method_type.toUpperCase();
        };

        $scope.endpoint = {
            method_type : 'GET',
            title : 'Fetch Users',
            description : 'Euismod Pharetra Risus Tortor.',
            url : 'https://api.demo.com/users',
            headers : [
                {
                    head : 'Content-Type',
                    value : 'application/json; charset=utf-8'
                },
                {
                    head : 'Authorization',
                    value : 'Bearer 87932ee1248c284fa36476bbc82ed9f7'
                }
            ],
            url_params : [],
            body : "",
            body_type : 'json'
        };

        $scope.project = {
            title : 'Sample Project',
            description : 'Sed posuere consectetur est at lobortis. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
            endpoints : [
                {
                    type : 'GET',
                    title : 'Fetch Users',
                    description : 'Euismod Pharetra Risus Tortor.',
                    url : 'https://api.demo.com/users'
                },
                {
                    type : 'GET',
                    title : 'Fetch Users',
                    description : 'Euismod Pharetra Risus Tortor.',
                    url : 'https://api.demo.com/users'
                },
                {
                    type : 'GET',
                    title : 'Fetch Users',
                    description : 'Euismod Pharetra Risus Tortor.',
                    url : 'https://api.demo.com/users'
                },
                {
                    type : 'GET',
                    title : 'Fetch Users',
                    description : 'Euismod Pharetra Risus Tortor.',
                    url : 'https://api.demo.com/users'
                }
            ]
        };

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
            endpoints : data.projects
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
    });
}
