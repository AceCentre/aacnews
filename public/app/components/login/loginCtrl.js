'use strict';
routerApp.controller('loginController', ['$scope', '$location', '$rootScope','authService', function ($scope, $location, $rootScope, authService) {

    $scope.loginData = {
        userName: "",
        password: ""
    };

    $scope.message = "";

    $scope.login = function () {
        authService.login($scope.loginData).then(function (response) {

            if(response.login) {
                $location.path('/admin');
                $rootScope.auth = {
                  isAdmin: response.role === 'admin',
                  isPublisher: response.role === 'publisher' || response.role === 'admin',
                  isEditor: response.role === 'editor' || response.role === 'admin'
                };
                console.log($scope.auth)
            }
            else
                $scope.message = "Incorrect user or password";
        },
         function (err) {
             $scope.message = "Incorrect user or password";
         });
    }
}]);
