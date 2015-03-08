'use strict';
routerApp.factory('subscribeService', ['$http', '$q', 'localStorageService', '$rootScope', function ($http, $q, localStorageService, $rootScope) {

    var subscribeServiceFactory = {};

    var _subscribe = function (subscribeData) {
        var deferred = $q.defer();
        
        $http.post('api/subscribe', subscribeData).success(function (response) {
            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
        });

        return deferred.promise;

    };

    subscribeServiceFactory.subscribe = _subscribe;
    

    return subscribeServiceFactory;
}]);