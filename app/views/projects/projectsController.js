'use strict';
angular.module('app.projectsController', ['ngRoute', 'ngMaterial', 'ngAnimate'])
    .controller('projectsController', function ($scope, $http, $location, $rootScope, $mdDialog, toastService) {
        $scope.message = "Projects";
        $scope.loaded = false;
        $scope.projects = [];
        $scope.showUsersForProject = -1;

        var json_user = localStorage.getItem('user');
        $scope.sessionUser = null;
        if (json_user) {
            $scope.sessionUser = JSON.parse(json_user);
        }

        var json_projects = localStorage.getItem('projects');
        if (json_projects) {
            $scope.projects = JSON.parse(json_projects);
            $scope.loaded = true;
        }

        $scope.$on('updated-projects', function (event, projects) {
            $scope.projects = projects;
        });

        refreshProjects($scope, $http, toastService);

        $scope.deleteProject = function (project, index, ev) {
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete this project?')
                .content("If you confirm, you'll be deleting the project with title `" + project.title + "`")
                .ariaLabel('Confirm Delete Project')
                .ok('Delete Project')
                .cancel('cancel')
                .targetEvent(ev);

            $mdDialog.show(confirm).then(function () {
                $http({
                    url: backend + '/user/' + project.owner + '/project/' + project.title,
                    method: 'DELETE',
                    dataType: 'json',
                    data: '',
                    headers: {
                        'Authorization': 'Bearer ' + $scope.sessionUser.access_token
                    }

                }).error(function (data, status, headers, config) {
                    if (status === 404) {
                        toastService.displayToast("Missing Project");
                    } else {
                        toastService.displayToast("Unknown Error");
                        console.error(data);
                    }

                    $scope.loaded = true;

                }).success(function (data, status, headers, config) {
                    if (status === 202) {
                        $scope.projects.splice(index, 1);
                        localStorage.setItem('projects', JSON.stringify($scope.projects));
                        refreshProjects($scope, $http, toastService);

                    } else {
                        toastService.displayToast("Error deleting this project.");
                        console.error(data);
                    }
                });

            }, function () {
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
                getProjectUsers($scope, $http, project);
            }
        };

        $scope.removeMember = function(project, memberToRemove, ev) {
            if (memberToRemove == project.owner) {
                toastService.displayToast("This member is the owner. Delete the project instead!");
            } else {
                var confirm = $mdDialog.confirm()
                    .title('Would you like to remove this member?')
                    .content("If you confirm, you'll be removing " + memberToRemove + " from `" + project.title + "`")
                    .ariaLabel('Confirm Remove Member')
                    .ok('Remove Member')
                    .cancel('cancel')
                    .targetEvent(ev);

                $mdDialog.show(confirm).then(function () {
                    $http({
                        url: backend + '/user/' + project.owner + '/project/' + project.title + '/remove/' + memberToRemove,
                        method: 'DELETE',
                        dataType: 'json',
                        data: '',
                        headers: {
                            'Authorization': 'Bearer ' + $scope.sessionUser.access_token
                        }

                    }).error(function (data, status, headers, config) {
                        if (status === 404) {
                            toastService.displayToast("Member doesn't exist!");
                        } else {
                            toastService.displayToast("Unknown Error");
                            console.error(data);
                        }

                        $scope.loaded = true;

                    }).success(function (data, status, headers, config) {
                        if (status === 202) {
                            for (var i = 0; i < $scope.projects.length; i++) {
                                if ($scope.projects[i].title == project.title) {
                                    for (var j = 0; j < $scope.projects[i].members.length; j++) {
                                        if ($scope.projects[i].members[j].username == memberToRemove) {
                                            $scope.projects[i].members = $scope.projects[i].members.splice(j, 1);
                                        }
                                    }
                                }
                            }
                            localStorage.setItem('projects', JSON.stringify($scope.projects));
                        } else {
                            toastService.displayToast("Error deleting this member.");
                            console.error(data);
                        }
                    });

                }, function () {
                });
            }
        }

        $scope.inviteMember = function(project, newMember, ev) {
            $http({
                url: backend + '/user/' + project.owner + '/project/' + project.title + '/invite/' + newMember,
                method: 'POST',
                dataType: 'json',
                data: '',
                headers: {
                    'Authorization': 'Bearer ' + $scope.sessionUser.access_token
                }

            }).error(function (data, status, headers, config) {
                if (status === 404) {
                    toastService.displayToast("Member doesn't exist!");
                } else {
                    toastService.displayToast("Unknown Error");
                    console.error(data);
                }

                $scope.loaded = true;

            }).success(function (data, status, headers, config) {
                if (status === 200) {
                    toastService.displayToast("Invitation sent to " + newMember + "!");
                    localStorage.setItem('projects', JSON.stringify($scope.projects));
                } else {
                    toastService.displayToast("Error inviting this member.");
                    console.error(data);
                }
            });
        }


        $scope.addProject = function (ev) {
            $scope.index = -1;
            $scope.action = 'add';
            $scope.title = '';
            $scope.description = '';
            $scope.owner = '';

            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'views/projects/addProjectDialog.html',
                targetEvent: ev,
                bindToController: true,
                locals: {
                    parentScope: $scope
                }
            })
                .then(function (answer) {
                    console.log(answer);
                }, function () {
                });
        };

        $scope.editProject = function (project, index, ev) {
            $scope.index = index;
            $scope.action = 'edit';
            $scope.title = project.title;
            $scope.description = project.description;
            $scope.owner = project.owner;

            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'views/projects/addProjectDialog.html',
                targetEvent: ev,
                bindToController: true,
                locals: {
                    parentScope: $scope
                }
            })
                .then(function (answer) {
                    $scope.alert = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.alert = 'You cancelled the dialog.';
                });
        };

        $scope.openEndpoint = function (event, index, endpoint) {

        };

        //Sample Data
//        $scope.projects = [
//            {
//                title : 'Sample Project',
//                description : 'Sed posuere consectetur est at lobortis. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
//                members : [
//                    {
//                        username : 'johndoe',
//                        email : 'johndoe@gmail.com'
//                    },
//                    {
//                        username : 'johndoe',
//                        email : 'johndoe@gmail.com'
//                    },
//                    {
//                        username : 'johndoe',
//                        email : 'johndoe@gmail.com'
//                    }
//                ],
//                endpoints : [
//                    {
//                        type : 'GET',
//                        title : 'Fetch Users',
//                        description : 'Euismod Pharetra Risus Tortor.',
//                        url : 'https://api.demo.com/users'
//                    },
//                    {
//                        type : 'GET',
//                        title : 'Fetch Users',
//                        description : 'Euismod Pharetra Risus Tortor.',
//                        url : 'https://api.demo.com/users'
//                    },
//                    {
//                        type : 'GET',
//                        title : 'Fetch Users',
//                        description : 'Euismod Pharetra Risus Tortor.',
//                        url : 'https://api.demo.com/users'
//                    },
//                    {
//                        type : 'GET',
//                        title : 'Fetch Users',
//                        description : 'Euismod Pharetra Risus Tortor.',
//                        url : 'https://api.demo.com/users'
//                    }
//                ]
//            },
//            {
//                title : 'Sample Project',
//                description : 'Sed posuere consectetur est at lobortis. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
//                endpoints : [
//                    {
//                        type : 'GET',
//                        title : 'Fetch Users',
//                        description : 'Euismod Pharetra Risus Tortor.',
//                        url : 'https://api.demo.com/users'
//                    },
//                    {
//                        type : 'GET',
//                        title : 'Fetch Users',
//                        description : 'Euismod Pharetra Risus Tortor.',
//                        url : 'https://api.demo.com/users'
//                    },
//                    {
//                        type : 'GET',
//                        title : 'Fetch Users',
//                        description : 'Euismod Pharetra Risus Tortor.',
//                        url : 'https://api.demo.com/users'
//                    },
//                    {
//                        type : 'GET',
//                        title : 'Fetch Users',
//                        description : 'Euismod Pharetra Risus Tortor.',
//                        url : 'https://api.demo.com/users'
//                    }
//                ]
//            }
//        ];
    }
);

function getProjects($scope, $http) {
    $http({
        url: backend + '/user/' + $scope.sessionUser.username + '/project',
        method: 'GET',
        dataType: 'json',
        data: '',
        headers: {
            'Authorization': 'Bearer ' + $scope.sessionUser.access_token
        }

    }).error(function (data, status, headers, config) {
        if (status === 404) {
            return 404;
        } else {
            return 409;
        }

    }).success(function (data, status, headers, config) {
        $scope.projects = data.projects;
    });
}

function getProjectUsers($scope, $http, project) {
    $http({
        // /user/:owner/project/:project/members
        url: backend + '/user/' + project.owner + '/project/' + project.title + '/members',
        method: 'GET',
        dataType: 'json',
        data: '',
        headers: {
            'Authorization': 'Bearer ' + $scope.sessionUser.access_token
        }

    }).error(function (data, status, headers, config) {
        if (status === 404) {
            return 404;
        } else {
            return 409;
        }

    }).success(function (data, status, headers, config) {
        // Not sure if data.users is what we want to return here.
        for (var j = 0; j < $scope.projects.length; j++) {
            if ($scope.projects[j].title == project.title) {
                if (data.members) {
                    $scope.projects[j].members = data.members.slice();
                    // localStorage.setItem()
                    // Need to add projectUsers to $project
                    // Are lists/dictionaries immutable in JavaScript?
                }
            }
        }
    });
}

function refreshProjects($scope, $http, toastService) {
    getProjects($scope, $http);
    if ($scope.projects && typeof $scope.projects === "object") {
        localStorage.setItem('projects', JSON.stringify($scope.projects));
    } else {
        if ($scope.projects === 404 || !$scope.projects) {
            toastService.displayToast("You don't have any project's yet");
        } else {
            toastService.displayToast("Failed to fetch user's projects");
        }
    }
    $scope.loaded = true;

//    $http({
//        url: backend + '/user/' + $scope.sessionUser.username + '/project',
//        method: 'GET',
//        dataType: 'json',
//        data: '',
//        headers: {
//            'Authorization' : 'Bearer ' + $scope.sessionUser.access_token
//        }
//
//    }).error(function(data, status, headers, config) {
//        if (status === 404) {
//            toastService.displayToast("You don't have any project's yet");
//        } else {
//            toastService.displayToast("Failed to fetch user's projects");
//            console.error(data);
//        }
//
//        $scope.loaded = true;
//
//    }).success(function (data, status, headers, config) {
//        $scope.projects = data.projects;
//        localStorage.setItem('projects', JSON.stringify(data.projects));
//        $scope.loaded = true;
//    });
}

function DialogController($rootScope, $scope, $http, $mdDialog, toastService, parentScope) {
    $scope.index = parentScope.index;
    $scope.owner = parentScope.owner;
    $scope.action = parentScope.action;
    $scope.title = parentScope.title;
    $scope.description = parentScope.description;

    var url = '/project';
    if ($scope.action == 'edit') {
        url = '/user/' + project.owner + '/project/' + $scope.title;
    }

    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.submitProject = function () {
        $http({
            url: backend + url,
            method: ($scope.action == 'add') ? 'POST' : 'PUT',
            dataType: 'json',
            data: JSON.stringify({
                title: $scope.title,
                description: $scope.description,
                owner: parentScope.sessionUser.username
            }),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + parentScope.sessionUser.access_token
            }

        }).error(function (data, status, headers, config) {
            if (status === 409) {
                toastService.displayToast("Can't " + $scope.action + " project");
            } else {
                toastService.displayToast("Unknown Error");
                console.error(data);
            }

            $scope.loaded = true;
            $mdDialog.hide();

        }).success(function (data, status, headers, config) {
            if (status === 201 || status === 202) {
                if ($scope.action == 'add') {
                    parentScope.projects.splice(parentScope.projects.length, 0, data.project);
                    localStorage.setItem('projects', JSON.stringify(parentScope.projects));
                } else {
                    parentScope.projects[$scope.index].title = $scope.title;
                    parentScope.projects[$scope.index].description = $scope.description;
                }

            } else {
                toastService.displayToast("Error " + $scope.action + "ing a project.");
                console.error(status + ' - ' + data);
            }

            $mdDialog.hide();
        });
    }
}
