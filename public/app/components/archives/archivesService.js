'use strict';
routerApp.factory('archivesService', ['$http', '$q', 'localStorageService', '$rootScope', function ($http, $q, localStorageService, $rootScope) {

    var archivesServiceFactory = {};

    var _getCampaigns = function () {

        return $http.get('api/campaigns');

    };

    archivesServiceFactory.getCampaigns = _getCampaigns;
    

    return archivesServiceFactory;
}]);