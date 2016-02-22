// app.js
var routerApp = angular.module('routerApp', ['ui.router','routeApp.controllers','LocalStorageModule','ui.bootstrap','hc.marked','angular.filter','ngSanitize','angularSpinner','smart-table','dndLists']);

routerApp.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
    

    $urlRouterProvider.otherwise('/');
    

    $stateProvider
        .state('root', {
            url: '',
            templateUrl: '../app/components/home/home.html',
            controller: 'HomeController'
        })
        .state('root.home', {
            url: '/',
            templateUrl: '../app/components/home/home.text.html',
            controller: 'HomeTextController'
        })
        .state('root.subscribe', {
            name: 'subscribe',
            url: '/subscribe?email&role&other&autosubscribe',
            templateUrl: '../app/components/subscribe/subscribe.html',
            controller: 'SubscribeController'
        })
        .state('root.privacy', {
            url: '/privacy',
            templateUrl: '../app/components/subscribe/privacy.html'
        })
        .state('root.archives', {
            url: '/archives',
            templateUrl: '../app/components/archives/archives.html',
            controller: 'ArchivesController'
        })
        .state('root.posts', {
            url: '/posts',
            templateUrl: '../app/components/posts/posts.html',
            controller: 'postController'
        })
        .state('root.mission', {
            url: '/mission',
            templateUrl: '../app/components/posts/mission.html'
        })
        .state('root.about', {
            url: '/about',
            templateUrl: '../app/components/about/about.html',
            controller: 'HomeTextController'
        })
        .state('login', {
            url: '/login',
            templateUrl: '../app/components/login/login.html',
            controller: 'loginController'
        })
        .state('admin', {
            url: '',
            templateUrl: '../app/components/admin/admin.html',
            controller: 'HomeController'
        })
        .state('admin.home', {
            url: '/admin',
            templateUrl: '../app/components/admin/admin-home.html'
        })
        .state('admin.type', {
            url: '/admin/types',
            templateUrl: '../app/components/admin/admin-types.html',
            controller: 'typeController'
        })
        .state('admin.posts', {
            url: '/admin/posts',
            templateUrl: '../app/components/admin/admin-posts.html',
            controller: 'postController'
        })
        .state('admin.history', {
            url: '/admin/history/:post_id',
            templateUrl: '../app/components/admin/admin-history.html',
            controller: 'postController'
        })
        .state('admin.newsletters', {
            url: '/admin/newsletters',
            templateUrl: '../app/components/admin/admin-newsletters.html',
            controller: 'newsletterController'
        })
        .state('admin.email', {
            url: '/admin/email',
            templateUrl: '../app/components/admin/admin-email.html',
            controller: 'emailController'
        });

        $httpProvider.interceptors.push('authInterceptorService');

        $locationProvider.html5Mode(true);
       
});


routerApp.run(['$rootScope',function($rootScope) {
    $rootScope.roles = ['Professional','Family','User','Other'];
}]);