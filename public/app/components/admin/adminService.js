'use strict';
routerApp.factory('adminService', ['$http', '$q', 'localStorageService', '$rootScope', function ($http, $q, localStorageService, $rootScope) {

    var adminServiceFactory = {};

    var _getTypes = function() {
        var authData = localStorageService.get('authorizationData');
        if(authData)
            $http.defaults.headers.common['X-Access-Token'] = authData.token;
        
        return $http.get('api/types');
    }

    var _getType = function(typeId) {
        var authData = localStorageService.get('authorizationData');
        if(authData)
            $http.defaults.headers.common['X-Access-Token'] = authData.token;
        
        return $http.get('api/types/' + typeId);
    }

    var _removeType = function(typeId) {
        var authData = localStorageService.get('authorizationData');
        if(authData)
            $http.defaults.headers.common['X-Access-Token'] = authData.token;
        
        return $http.delete('api/types/' + typeId);
    }

    var _saveType = function (typeData) {
        var deferred = $q.defer();
        
        if(typeData.id)
            $http.put('api/types/' + typeData.id, typeData).success(function (response) {
                deferred.resolve(response);
            }).error(function (err, status) {
                deferred.reject(err);
            });
        else
            $http.post('api/types', typeData).success(function (response) {
                deferred.resolve(response);
            }).error(function (err, status) {
                deferred.reject(err);
            });

        return deferred.promise;

    };

    var _getPosts = function() {
        var authData = localStorageService.get('authorizationData');
        if(authData)
            $http.defaults.headers.common['X-Access-Token'] = authData.token;
        
        return $http.get('api/posts');
    }

    var _getPostsPublished = function() {
        var authData = localStorageService.get('authorizationData');
        if(authData)
            $http.defaults.headers.common['X-Access-Token'] = authData.token;
        
        return $http.get('api/posts/published');
    }

    var _savePost = function (postData) {
        var deferred = $q.defer();
        if(postData.id)
            $http.put('api/posts/' + postData.id, postData).success(function (response) {
                deferred.resolve(response);
            }).error(function (err, status) {
                deferred.reject(err);
            });
        else
            $http.post('api/posts', postData).success(function (response) {
                deferred.resolve(response);
            }).error(function (err, status) {
                deferred.reject(err);
            });

        return deferred.promise;

    };

    var _bulkPublishPosts = function (ids, published) {
      var deferred = $q.defer();
      var data = {
        ids: ids,
        published: published ? 1 : 0
      };

      $http.put('api/posts/published', data).success(function (response) {
          deferred.resolve(response);
      }).error(function (err, status) {
          deferred.reject(err);
      });

      return deferred.promise;
    };

    var _bulkPromotePosts = function (ids, promoted) {
      var deferred = $q.defer();
      var data = {
        ids: ids,
        promoted: promoted ? 1 : 0
      };

      $http.put('api/posts/promoted', data).success(function (response) {
          deferred.resolve(response);
      }).error(function (err, status) {
          deferred.reject(err);
      });

      return deferred.promise;
    };

    var _getPost = function(postId) {
        var authData = localStorageService.get('authorizationData');
        if(authData)
            $http.defaults.headers.common['X-Access-Token'] = authData.token;
        
        return $http.get('api/posts/' + postId);
    }

    var _removePost = function(postId) {
        var authData = localStorageService.get('authorizationData');
        if(authData)
            $http.defaults.headers.common['X-Access-Token'] = authData.token;
        
        return $http.delete('api/posts/' + postId);
    }

    var _getNewsletters = function() {
        var authData = localStorageService.get('authorizationData');
        if(authData)
            $http.defaults.headers.common['X-Access-Token'] = authData.token;
        
        return $http.get('api/newsletters');
    }

    var _saveNewsletter = function (newsletterData) {
        var deferred = $q.defer();
        
        if(newsletterData.id)
            $http.put('api/newsletters/' + newsletterData.id, newsletterData).success(function (response) {
                deferred.resolve(response);
            }).error(function (err, status) {
                deferred.reject(err);
            });
        else
            $http.post('api/newsletters', newsletterData).success(function (response) {
                deferred.resolve(response);
            }).error(function (err, status) {
                deferred.reject(err);
            });

        return deferred.promise;

    };

    var _getNewsletter = function(newsletterId) {
        var authData = localStorageService.get('authorizationData');
        if(authData)
            $http.defaults.headers.common['X-Access-Token'] = authData.token;
        
        return $http.get('api/newsletters/' + newsletterId);
    }

    var _removeNewsletter = function(newsletterId) {
        var authData = localStorageService.get('authorizationData');
        if(authData)
            $http.defaults.headers.common['X-Access-Token'] = authData.token;
        
        return $http.delete('api/newsletters/' + newsletterId);
    }

    var _getTemplate = function() {
        var authData = localStorageService.get('authorizationData');
        if(authData)
            $http.defaults.headers.common['X-Access-Token'] = authData.token;
        console.log("getting template");
        return $http.get('api/template');
    }

    var _sendNewsletter = function (newsletterHTML,aTitle) {
        var deferred = $q.defer();
        
         $http.defaults.headers.common['Content-Type'] = 'text/html';
         $http.post('api/send', {"html":newsletterHTML,"title":aTitle}).success(function (response) {
                deferred.resolve(response);
            }).error(function (err, status) {
                deferred.reject(err);
            });

        return deferred.promise;

    };

    var _getHistoryPost = function(postId) {
        var authData = localStorageService.get('authorizationData');
        if(authData)
            $http.defaults.headers.common['X-Access-Token'] = authData.token;
        
        return $http.get('api/posts/history/' + postId);
    }

    var _getHistoryPostByVersion = function(postId,version) {
        var authData = localStorageService.get('authorizationData');
        if(authData)
            $http.defaults.headers.common['X-Access-Token'] = authData.token;
        
        return $http.get('api/posts/history/' + postId + "/" + version);
    }

    var _addPostDelicious = function(posts){
        var arrPosts = [];

        angular.forEach(posts,function(aColumn,index){
            var aType = {
                id:aColumn.id,
                name:aColumn.name
            }
            angular.forEach(aColumn.columns,function(somePosts,index){
                angular.forEach(somePosts,function(aPost,index){
                    aPost.type = aType;
                    arrPosts.push(aPost);
                    console.log(aPost);
                });
            })
        });
        var deferred = $q.defer();
        
        $http.post('api/diigo/posts', {"posts":arrPosts}).success(function (response) {
                deferred.resolve(response);
            }).error(function (err, status) {
                deferred.reject(err);
            });

        return deferred.promise;
    }

    var _addPostSlack = function(posts){
        var arrPosts = [];

        angular.forEach(posts,function(aColumn,index){
            var aType = {
                id:aColumn.id,
                name:aColumn.name
            }
            angular.forEach(aColumn.columns,function(somePosts,index){
                angular.forEach(somePosts,function(aPost,index){
                    aPost.type = aType;
                    arrPosts.push(aPost);
                    console.log(aPost);
                });
            })
        });
        var deferred = $q.defer();
        
        // disabled because is published when a new post is created
        /*
        $http.post('api/slack/posts', {"posts":arrPosts}).success(function (response) {
                deferred.resolve(response);
            }).error(function (err, status) {
                deferred.reject(err);
            });
        */
        return deferred.promise;
    }

    var _getUsers = function() {
        var authData = localStorageService.get('authorizationData');
        if(authData)
            $http.defaults.headers.common['X-Access-Token'] = authData.token;
        
        return $http.get('api/users');
    }

    var _saveUser = function (userData) {
        var deferred = $q.defer();
        if(userData.id)
            $http.put('api/users/' + userData.id, userData).success(function (response) {
                deferred.resolve(response);
            }).error(function (err, status) {
                deferred.reject(err);
            });
        else
            $http.post('api/users', userData).success(function (response) {
                deferred.resolve(response);
            }).error(function (err, status) {
                deferred.reject(err);
            });

        return deferred.promise;

    };

    var _getUser = function(userId) {
        var authData = localStorageService.get('authorizationData');
        if(authData)
            $http.defaults.headers.common['X-Access-Token'] = authData.token;
        
        return $http.get('api/users/' + userId);
    }

    var _removeUser = function(userId) {
        var authData = localStorageService.get('authorizationData');
        if(authData)
            $http.defaults.headers.common['X-Access-Token'] = authData.token;
        
        return $http.delete('api/users/' + userId);
    }

    adminServiceFactory.saveType = _saveType;
    adminServiceFactory.getTypes = _getTypes;
    adminServiceFactory.getType = _getType;
    adminServiceFactory.removeType = _removeType;
    adminServiceFactory.getPosts = _getPosts;
    adminServiceFactory.getPostsPublished = _getPostsPublished;
    adminServiceFactory.savePost = _savePost;
    adminServiceFactory.bulkPublishPosts = _bulkPublishPosts;
    adminServiceFactory.bulkPromotePosts = _bulkPromotePosts;
    adminServiceFactory.getPost = _getPost;
    adminServiceFactory.removePost = _removePost;
    adminServiceFactory.getHistoryPost = _getHistoryPost;
    adminServiceFactory.getHistoryPostByVersion = _getHistoryPostByVersion;
    adminServiceFactory.getNewsletters = _getNewsletters;
    adminServiceFactory.saveNewsletter = _saveNewsletter;
    adminServiceFactory.getNewsletter = _getNewsletter;
    adminServiceFactory.removeNewsletter = _removeNewsletter;
    adminServiceFactory.sendNewsletter = _sendNewsletter;
    adminServiceFactory.getTemplate = _getTemplate;
    adminServiceFactory.addPostDelicious = _addPostDelicious;
    adminServiceFactory.addPostSlack = _addPostSlack;
    adminServiceFactory.getUsers = _getUsers;
    adminServiceFactory.saveUser = _saveUser;
    adminServiceFactory.getUser = _getUser;
    adminServiceFactory.removeUser = _removeUser;

    return adminServiceFactory;
}]);