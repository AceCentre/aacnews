'use strict';
routerApp.factory('authService', ['$http', '$q', 'localStorageService', '$rootScope', function ($http, $q, localStorageService, $rootScope) {

    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName: ""

    };

    var _login = function (loginData) {
        console.log(loginData);
        var data = {username:loginData.username, password:loginData.password};
        var deferred = $q.defer();
        
        $http.post('api/login', data).success(function (response) {
            console.log(response);
            if(response.login){
                localStorageService.set('authorizationData', { token: response.token, user_id: response.user_id, role: response.role, school: response.school });
                _authentication.isAuth = true;
                _authentication.userName = loginData.usernam; 
            }
            else{
                _logOut();
               
            }
            deferred.resolve(response);
        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

    var _logOut = function () {

        localStorageService.remove('authorizationData');

        _authentication.isAuth = false;
        _authentication.userName = "";
    };

    var _fillAuthData = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;
        }

    };


    var _getUserId = function() {
        var authData = localStorageService.get('authorizationData');
        return authData.user_id;
    }

    var _getRole = function() {
        var authData = localStorageService.get('authorizationData');
        return authData.role;
    }


    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.getUserId = _getUserId;
    authServiceFactory.getRole = _getRole;

    return authServiceFactory;
}]);