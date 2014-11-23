'use strict';
angular.module('app.projectsController', ['ngRoute', 'ngMaterial'])
    .controller('projectsController', function($scope, $http, $location, $rootScope, $mdDialog, toastService) {
        $scope.message="Projects";
        $scope.loaded = false;
        $scope.projects = [];

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

        //$http({
        //    url: backend + '/user/' + $scope.sessionUser.username + '/project',
        //    method: 'GET',
        //    dataType: 'json',
        //    data: '',
        //    headers: {
        //        'Authorization' : 'Bearer ' + $scope.sessionUser.access_token
        //    }
        //
        //}).error(function(data, status, headers, config) {
        //    if (status === 404) {
        //        toastService.displayToast("You don't have any project's yet");
        //    } else {
        //        toastService.displayToast("Failed to fetch user's projects");
        //        console.error(data);
        //    }
        //
        //    $scope.loaded = true;
        //
        //}).success(function (data, status, headers, config) {
        //    $scope.projects = data.projects;
        //    localStorage.setItem('projects', JSON.stringify(data.projects));
        //    $scope.loaded = true;
        //});

        $scope.deleteProject = function (project, ev) {

            $mdDialog.show(
                $mdDialog.alert()
                    .title('This is an alert title')
                    .content('You can specify some description text in here.')
                    .ariaLabel('Password notification')
                    .ok('Got it!')
                    .targetEvent(ev)
            );

            //var confirm = $mdDialog.confirm()
            //    .title('Would you like to delete this project?')
            //    .content("If you confirm, you'll be deleting the project with title `" + project.title + "`")
            //    .ariaLabel('Confirm Delete Project')
            //    .ok('Delete Project')
            //    .cancel('cancel')
            //    .targetEvent(ev);
            //
            //$mdDialog.show(confirm).then(function() {
            //    // TODO: Delete Project
            //
            //}, function() {
            //});
        };

        $scope.addEndpoint = function (project) {

        };

        $scope.projects = [
            {
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
                        type : 'POST',
                        title : 'Fetch Users',
                        description : 'Euismod Pharetra Risus Tortor.',
                        url : 'https://api.demo.com/users'
                    },
                    {
                        type : 'PUT',
                        title : 'Fetch Users',
                        description : 'Euismod Pharetra Risus Tortor.',
                        url : 'https://api.demo.com/users'
                    },
                    {
                        type : 'PATCH',
                        title : 'Fetch Users',
                        description : 'Euismod Pharetra Risus Tortor.',
                        url : 'https://api.demo.com/users'
                    }
                ]
            },
            {
                title : 'Sample Project',
                description : 'Sed posuere consectetur est at lobortis. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
                endpoints : [
                    {
                        type : 'DELETE',
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
            }
        ];
    }
);
