'use strict';
angular.module('app.projectsController', ['ngRoute', 'ngMaterial', 'ngAnimate'])
    .controller('projectsController', function($scope, $http, $location, $rootScope, $mdDialog, toastService) {
        $scope.message="Projects";
        $scope.loaded = false;
        $scope.projects = [];
        $scope.showUsersForProject = -1;

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

        $scope.$on('updated-projects', function(event, projects) {
            $scope.projects = projects;
        });

        refreshProjects ($scope, $http, toastService);

        $scope.deleteProject = function (project, index, ev) {
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete this project?')
                .content("If you confirm, you'll be deleting the project with title `" + project.title + "`")
                .ariaLabel('Confirm Delete Project')
                .ok('Delete Project')
                .cancel('cancel')
                .targetEvent(ev);

            $mdDialog.show(confirm).then(function() {
                $http({
                    url: backend + '/user/' + $scope.sessionUser.username + '/project/' + project.title,
                    method: 'DELETE',
                    dataType: 'json',
                    data: '',
                    headers: {
                        'Authorization' : 'Bearer ' + $scope.sessionUser.access_token
                    }

                }).error(function(data, status, headers, config) {
                    if (status === 404) {
                        toastService.displayToast("Missing Project");
                    } else {
                        toastService.displayToast("Unknown Error");
                        console.error(data);
                    }

                    $scope.loaded = true;

                }).success(function (data, status, headers, config) {
                    if (status === 204) {
                        $scope.projects.splice(index, 1);
                        localStorage.setItem('projects', JSON.stringify($scope.projects));
                        refreshProjects ($scope, $http, toastService);

                    } else {
                        toastService.displayToast("Error deleting this project.");
                        console.error(data);
                    }
                });

            }, function() {
            });
        };

        $scope.showSection = function (index) {
            if ($scope.showUsersForProject === index) {
                return 'members';
            } else {
                return 'endpoints';
            }
        };

        $scope.addEndpoint = function (project, index, ev) {

        };

        $scope.displayMembers = function (project, index, ev) {
            if ($scope.showUsersForProject === index) {
                $scope.showUsersForProject = -1;
            } else {
                $scope.showUsersForProject = index;
            }
        };

        $scope.addProject = function (ev) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'views/projects/addProjectDialog.html',
                targetEvent: ev
            })
            .then(function(answer) {
                $scope.alert = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.alert = 'You cancelled the dialog.';
            });
        };

        $scope.openEndpoint = function (event, index, endpoint) {

        };

        // Sample Data
        //$scope.projects = [
        //    {
        //        title : 'Sample Project',
        //        description : 'Sed posuere consectetur est at lobortis. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
        //        members : [
        //            {
        //                username : 'johndoe',
        //                email : 'johndoe@gmail.com'
        //            },
        //            {
        //                username : 'johndoe',
        //                email : 'johndoe@gmail.com'
        //            },
        //            {
        //                username : 'johndoe',
        //                email : 'johndoe@gmail.com'
        //            }
        //        ],
        //        endpoints : [
        //            {
        //                type : 'GET',
        //                title : 'Fetch Users',
        //                description : 'Euismod Pharetra Risus Tortor.',
        //                url : 'https://api.demo.com/users'
        //            },
        //            {
        //                type : 'GET',
        //                title : 'Fetch Users',
        //                description : 'Euismod Pharetra Risus Tortor.',
        //                url : 'https://api.demo.com/users'
        //            },
        //            {
        //                type : 'GET',
        //                title : 'Fetch Users',
        //                description : 'Euismod Pharetra Risus Tortor.',
        //                url : 'https://api.demo.com/users'
        //            },
        //            {
        //                type : 'GET',
        //                title : 'Fetch Users',
        //                description : 'Euismod Pharetra Risus Tortor.',
        //                url : 'https://api.demo.com/users'
        //            }
        //        ]
        //    },
        //    {
        //        title : 'Sample Project',
        //        description : 'Sed posuere consectetur est at lobortis. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
        //        endpoints : [
        //            {
        //                type : 'GET',
        //                title : 'Fetch Users',
        //                description : 'Euismod Pharetra Risus Tortor.',
        //                url : 'https://api.demo.com/users'
        //            },
        //            {
        //                type : 'GET',
        //                title : 'Fetch Users',
        //                description : 'Euismod Pharetra Risus Tortor.',
        //                url : 'https://api.demo.com/users'
        //            },
        //            {
        //                type : 'GET',
        //                title : 'Fetch Users',
        //                description : 'Euismod Pharetra Risus Tortor.',
        //                url : 'https://api.demo.com/users'
        //            },
        //            {
        //                type : 'GET',
        //                title : 'Fetch Users',
        //                description : 'Euismod Pharetra Risus Tortor.',
        //                url : 'https://api.demo.com/users'
        //            }
        //        ]
        //    }
        //];
    }
);

function refreshProjects ($scope, $http, toastService) {
    $http({
        url: backend + '/user/' + $scope.sessionUser.username + '/project',
        method: 'GET',
        dataType: 'json',
        data: '',
        headers: {
            'Authorization' : 'Bearer ' + $scope.sessionUser.access_token
        }

    }).error(function(data, status, headers, config) {
        if (status === 404) {
            toastService.displayToast("You don't have any project's yet");
        } else {
            toastService.displayToast("Failed to fetch user's projects");
            console.error(data);
        }

        $scope.loaded = true;

    }).success(function (data, status, headers, config) {
        $scope.projects = data.projects;
        localStorage.setItem('projects', JSON.stringify(data.projects));
        $scope.loaded = true;
    });
}

function DialogController($rootScope, $scope, $http, $mdDialog, toastService) {
    $scope.title = '';
    $scope.description = '';

    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.submitProject = function () {
        var json_user = localStorage.getItem('user');
        $scope.sessionUser = null;
        if (json_user) {
            $scope.sessionUser  = JSON.parse(json_user);
        }

        $http({
            url: backend + '/project',
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                title : $scope.title,
                description : $scope.description,
                owner : $scope.sessionUser.username
            }),
            headers: {
                'Content-Type' : 'application/json; charset=utf-8',
                'Authorization' : 'Bearer ' + $scope.sessionUser.access_token
            }

        }).error(function(data, status, headers, config) {
            if (status === 409) {
                toastService.displayToast("Can't create project");
            } else {
                toastService.displayToast("Unknown Error");
                console.error(data);
            }

            $scope.loaded = true;
            $mdDialog.hide();

        }).success(function (data, status, headers, config) {
            if (status === 201) {
                var json_projects = localStorage.getItem('projects');
                if (json_projects) {
                    $scope.projects  = JSON.parse(json_projects);
                }

                $scope.projects.splice($scope.projects.length, 0, data.project);
                localStorage.setItem('projects', JSON.stringify($scope.projects));
                $rootScope.$broadcast('updated-projects', $scope.projects);

            } else {
                toastService.displayToast("Error creating a project.");
                console.error(status + ' - ' + data);
            }

            $mdDialog.hide();
        });
    }
}
