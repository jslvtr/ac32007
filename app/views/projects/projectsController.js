'use strict';
angular.module('app.projectsController', ['ngRoute'])
    .controller('projectsController', function($scope, $http, $location, $rootScope) {
        $scope.message="Projects";
        $scope.projects = [];

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
