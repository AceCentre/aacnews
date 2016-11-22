'use strict';
routerApp.controller('typeController', ['$scope', '$location', '$rootScope','adminService', function ($scope, $location, $rootScope, adminService) {

    $scope.type = {
        id: null,
        name: "",
        priority: 0
    };
    $scope.types = [];
    $scope.message = "";
    $scope.message_err = "";

    getTypes();
    $scope.displayedCollection = [].concat($scope.types);

    $scope.getters={
        name: function (value) {
            //this will sort by the length of the first name string
            return value.name.length;
        }
    }

    function getTypes(){
        adminService.getTypes().then(function (response) {
            //$scope.types = response.data;
            angular.forEach(response.data, function (type) {
                var aType = {
                    _id : type._id,
                    name : type.name,
                    priority : parseFloat(type.priority)

                }
                $scope.types.push(aType);
            });
        });
    }

    $scope.editType = function(typeId){
        if(typeId==="new")
            $scope.type = {
                id: null,
                name: "",
                priority: 0
            };
        else
        {
            adminService.getType(typeId).then(function (response) {
                $scope.type = {
                    id: response.data._id,
                    name: response.data.name,
                    priority: response.data.priority
                };
            });
        }
    }

    $scope.saveType = function () {
        adminService.saveType($scope.type).then(function (response) {
            $('.modal').modal('hide');
            $scope.displayedCollection = [];
            $scope.types = [];
            getTypes();
        },
         function (err) {
             $scope.message_err = err;
         });
    }
    $scope.removeType = function(typeId){

        adminService.removeType(typeId).then(function (response) {
            $scope.displayedCollection = [];
            $scope.types = [];
            getTypes();
        },
         function (err) {
             $scope.message = err;
        });
    }
}]);

routerApp.controller('postController', ['$scope', '$location', '$rootScope','adminService', '$stateParams', function ($scope, $location, $rootScope, adminService, $stateParams) {

    if($stateParams.post_id){
        getHistoryPost($stateParams.post_id);
    }

    $scope.post = {
        title:"",
        text:"",
        type:"",
        date:new Date(),
        link:"",
        published:0,
        promoted:0,
        author:"",
        priority:0
    }

    function getDate(aDate){
        var dt = aDate;
        return [pad(dt.getDate()), pad(dt.getMonth()+1), dt.getFullYear()].join('/');
        function pad(s) { return (s < 10) ? '0' + s : s; }
    }

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    $scope.dateOptions = {
        format: 'dd/mm/yyyy',
        autoclose: true,
        weekStart: 0
    };

    $scope.type = {
        id: null,
        name: "",
        priority: 0
    };

    $scope.bulkSelect = true;
    $scope.filters = {
      published: true,
      notPublished: true,
      interval: ''
    };
    $scope.posts = [];
    $scope.posts_history = [];
    $scope.message = "";
    $scope.types = [];
    $scope.posted = false;
    $scope.markdown = true;
    $scope.markdown_hist = true;
    $scope.displayedCollection = [].concat($scope.posts);

    adminService.getTypes().then(function (response) {
        $scope.types = response.data;
    });

    getPosts();

    function getPosts(){
        adminService.getPosts().then(function (response) {
            $scope.posts = response.data;
        });
    }

    $scope.editPost = function(postId){
        $scope.types = [];

        adminService.getTypes().then(function (response) {
            $scope.types = response.data;
        });

        if(postId==="new")
            $scope.post = {
                title:"",
                text:"",
                type:"",
                date:new Date(),
                link:"",
                published:0,
                promoted:0,
                author:"",
                priority:0
            }
        else
        {
            adminService.getPost(postId).then(function (response) {
                $scope.post = {
                    id: response.data._id,
                    title:response.data.title,
                    text:response.data.text,
                    type:response.data.type,
                    date:new Date(response.data.date),
                    link:response.data.link,
                    published:(response.data.published ? true : false),
                    promoted:(response.data.promoted ? true : false),
                    author:response.data.author,
                    priority:response.data.priority
                }
            });
        }
    }

    $scope.savePost = function () {
        if($scope.post.date)
            $scope.post.date = getDate($scope.post.date);
        if($scope.post.promoted)
            $scope.post.promoted = 1;
        else
            $scope.post.promoted = 0;
        if($scope.post.published)
            $scope.post.published = 1;
        else
            $scope.post.published = 0;

        adminService.savePost($scope.post).then(function (response) {
            $('.modal').modal('hide');
            $scope.markdown = true;
            $scope.markdown_hist = true;
            $scope.posted = true;
            $scope.posts = [];
            $scope.displayedCollection = [];
            getPosts();
            if($stateParams.post_id){
                $location.path("/admin/posts");
            }
        },
         function (err) {
             $scope.message = err;
         });
    }

    $scope.removePost = function(postId){
        adminService.removePost(postId).then(function (response) {
            $scope.posts = [];
            $scope.displayedCollection = [];
            getPosts();
        },
         function (err) {
            $scope.message = err;
        });
    }

    $scope.applyFilters = function() {
      var filters = $scope.filters;
      var filterPublish = -1;
      var minDate = -1;

      if(filters.published && !filters.notPublished) {
        filterPublish = 1;
      }
      else if(!filters.published && filters.notPublished) {
        filterPublish = 0;
      }

      if(filters.interval !== '') {
        var parsed = filters.interval.split(' ');
        var value = parseInt(parsed[0]);
        minDate = moment().subtract(value, parsed[1])
      }

      adminService.getPosts().then(function (response) {
          $scope.posts = response.data.filter(function(post) {
            var pred = true;
            if(filterPublish != -1) {
              pred = pred && (post.published == filterPublish);
            }

            if(minDate != -1) {
              pred = pred && (moment(post.date) >= minDate);
            }

            return pred;
          });
      });
    }

    function getSelectedPostsIds() {
      return $scope.displayedCollection.filter(function(post) {
        return post.selected;
      }).map(function(post) {
        return post._id;
      });
    }

    $scope.setSelectedPublished = function (published) {
      var ids = getSelectedPostsIds();

      adminService.bulkPublishPosts(ids, published).then(function (response) {
          $scope.displayedCollection = [];
          getPosts();
      },
       function (err) {
           $scope.message = err;
       });
    }

    $scope.setSelectedPromoted = function (promoted) {
      var ids = getSelectedPostsIds();

      adminService.bulkPromotePosts(ids, promoted).then(function (response) {
          $scope.displayedCollection = [];
          getPosts();
      },
       function (err) {
           $scope.message = err;
       });
    }

    function getHistoryPost(postId){
        adminService.getHistoryPost(postId).then(function(response){
            if(response.data.length > 0)
                $scope.title = response.data[0].title;
            $scope.displayedCollection = [];
            $scope.posts_history = response.data;
        });
    }

    $scope.getHistoryByPost = function(postId,version){
        adminService.getHistoryPostByVersion(postId,version).then(function (response) {
            $scope.post = {
                id: response.data.id_post,
                title:response.data.title,
                text:response.data.text,
                type:response.data.type,
                date:new Date(response.data.date),
                link:response.data.link,
                published:(response.data.published ? true : false),
                promoted:(response.data.promoted ? true : false),
                author:response.data.author,
                priority:response.data.priority
            }
        });
    }

    $scope.changeToHTML = function() {
        $scope.markdown = false;
        $scope.markdown_hist = false;
    }
    $scope.changeToMarkdown = function() {
        $scope.markdown = true;
        $scope.markdown_hist = true;
    }
    angular.element(document).ready(function () {
        if($("#nav").find('.activemenu').length > 0){
            $(".nav_inner").css("left","-200px");
            $("#nav").find('.activemenu').removeClass("activemenu");
        }
    });

}]);


routerApp.controller('newsletterController', ['$scope', '$location', '$rootScope','adminService', function ($scope, $location, $rootScope, adminService) {

    $scope.newsletter = {
        title:"",
        preamble:"",
        spoiler:"",
        date:new Date(),
        campaign_id:""
    }

    function getDate(aDate){
        var dt = aDate;
        return [pad(dt.getDate()), pad(dt.getMonth()+1), dt.getFullYear()].join('/');
        function pad(s) { return (s < 10) ? '0' + s : s; }
    }

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    $scope.dateOptions = {
        format: 'dd/mm/yyyy',
        autoclose: true,
        weekStart: 0
    };

    $scope.newsletters = [];
    $scope.message = "";
    $scope.markdown = true;

    getNewsletters();
    $scope.displayedCollection = [].concat($scope.types);

    function getNewsletters(){
        adminService.getNewsletters().then(function (response) {
            angular.forEach(response.data,function(news){
                var aNewsletter = {
                    _id:news._id,
                    title:news.title,
                    preamble:news.preamble,
                    spoiler:news.spoiler,
                    date:news.date
                }
                $scope.newsletters.push(aNewsletter);
            });
        });
    }

    $scope.editNewsletter = function(newsletterId){

        if(newsletterId==="new")
            $scope.newsletter = {
                title:"",
                preamble:"",
                spoiler:"",
                date:new Date(),
                campaign_id:""
            }
        else
        {
            adminService.getNewsletter(newsletterId).then(function (response) {

                $scope.newsletter = {
                    id: response.data._id,
                    title:response.data.title,
                    preamble:response.data.preamble,
                    spoiler:response.data.spoiler,
                    date:new Date(response.data.date),
                    campaign_id:response.data.campaign_id
                }
                console.log($scope.newsletter);
            });
        }
    }

    $scope.saveNewsletter = function () {
        if($scope.newsletter.date)
            $scope.newsletter.date = getDate($scope.newsletter.date);

        adminService.saveNewsletter($scope.newsletter).then(function (response) {
            $scope.newsletters = [];
            $scope.displayedCollection = [];
            $scope.markdown = true;
            getNewsletters();
        },
         function (err) {
             $scope.message = err;
         });
    }
    $scope.removeNewsletter = function(newsletterId){

        adminService.removeNewsletter(newsletterId).then(function (response) {
            $scope.newsletters = [];
            $scope.displayedCollection = [];
            getNewsletters();
        },
         function (err) {
             $scope.message = err;
        });
    }

    $scope.changeToHTML = function() {
        $scope.markdown = false;
    }
    $scope.changeToMarkdown = function() {
        $scope.markdown = true;
    }
}]);

routerApp.controller('emailController', ['$scope', '$location', '$rootScope', '$filter', 'filterFilter', 'adminService', '$sce', 'usSpinnerService', '$compile', '$window', function ($scope, $location, $rootScope, $filter, filterFilter, adminService,$sce, usSpinnerService, $compile, $window) {

    $scope.email = {
        title:"",
        preamble:"",
        spoiler:"",
        posts:{}
    }
    $scope.builder = true;

    function getDate(aDate){
        var dt = aDate;
        return [pad(dt.getDate()), pad(dt.getMonth()+1), dt.getFullYear()].join('/');
        function pad(s) { return (s < 10) ? '0' + s : s; }
    }

    $scope.posts = [];
    $scope.drafts = [];
    $scope.draft_id = null;
    $scope.message = null;
    $scope.message_err = null;
    $scope.posted = false;
    $scope.markdown = true;
    $scope.isSending = false;
    $scope.isSaving = false;
    $scope.show_json = false;

    getPosts();
    getDrafts();

    function getPosts(){
        adminService.getPostsPublished().then(function (response) {
            $scope.posts = response.data;

            // ordering by categories
            // creating unique types/groups
            var groups = {};

            // adding posts foreach type
            angular.forEach(response.data,function(aPost,index){

                if(!groups[aPost.type.name]){
                    groups[aPost.type.name] = {
                        group_priority : aPost.type.priority,
                        id : aPost.type._id,
                        posts : []
                    }
                }

                var typeName = aPost.type.name;
                aPost.type = "item";
                aPost.id = aPost._id;
                aPost.text = marked(aPost.text);
                aPost.text = aPost.text.replace(/(<p>|<\/p>)/g, "");
                if(aPost.link)
                    aPost.link_name = getHostName(aPost.link);

                aPost.author_original = aPost.author;
                if(aPost.author.indexOf("@") == 0) // twitter user
                    aPost.author='Shared by ' + addTwitterLinks(aPost.author);
                else{
                    if(aPost.author.match("\w[\w\.-]*@\w[\w\.-]+\.\w+")) // email
                        aPost.author = 'Shared by <a href="mailto:' + aPost.author + '">' + aPost.author + '</a>';
                    else
                        aPost.author = 'Shared by ' + aPost.author;
                }
                groups[typeName].posts.push(aPost);
            });

            // creating group array
            var types = []
            for (var k in groups) {
                groups[k].name = k;
                types.push(groups[k]);
            }
            // sorting by type priority
            types.sort(function (a, b) {
              return parseInt(b.group_priority) - parseInt(a.group_priority);
            });

            $scope.posts_builder = [];
            angular.forEach(types,function(aType){
                var entry = {}
                entry['type'] = "container";
                entry['id'] = aType.id;
                entry['name'] = aType.name;
                entry['columns'] = [];
                entry['columns'].push(aType.posts);
                $scope.posts_builder.push(entry)
            });
            $scope.models_post = {
                selected: null,
                templates: [
                    {type: "item", id: 2},
                    {type: "container", id: 1, columns: [[]]}
                ],
                dropzones: {
                    "1. Posts to be published": $scope.posts_builder
                    ,
                    "2. Newsletter structure": [
                    ]
                }
            }
        });
    }

    function getDrafts(){
        adminService.getDrafts().then(function (response) {
            $scope.drafts = response.data;
        });
    }

    $scope.checkAll = function(){

        if($scope.checkedAll)
            angular.forEach($scope.posts,function(post){
                post.selected = true;
            });
        else
            angular.forEach($scope.posts,function(post){
                post.selected = false;
            });
    }

    $scope.preview = function(){
        $scope.builder = false;
        usSpinnerService.spin('spinner-1');
        $scope.spoiler = $scope.email.spoiler;
        $scope.title = $scope.email.title;
        $scope.preamble = marked($scope.email.preamble);
        $scope.markdown = true;
        $scope.unsuscribe_list_mark = "*|UNSUB|*";
        $scope.unsuscribe_modify_preferences_mark = "*|UPDATE_PROFILE|*";
        $scope.email_addr = "*|EMAIL|*";
        $scope.archive_url = "*|ARCHIVE|*";
        $scope.posts_selected = $scope.models_post.dropzones["2. Newsletter structure"];
        adminService.getTemplate().then(function(aHTML){
            $scope.html = aHTML.data;
            usSpinnerService.stop('spinner-1');
        });
    }

    function addTwitterLinks(text) {
        return text.replace(/[\@\#]([a-zA-z0-9_]*)/g,
            function(m,m1) {
                var t = '<a href="http://twitter.com/';
                if(m.charAt(0) == '#')
                    t += 'hashtag/';
                return t + encodeURI(m1) + '" target="_blank">' + m + '</a>';
            });
    }

    function getHostName(url) {
        var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
        if (match != null && match.length > 2 &&
            typeof match[2] === 'string' && match[2].length > 0) {
        return match[2];
        }
        else {
            return null;
        }
    }

    $scope.back = function(){
        $scope.builder = true;
    }

    $scope.send = function(){

        $scope.isSending = true;
        var htmlCompiled =  document.getElementById("content").innerHTML;

        adminService.sendNewsletter(htmlCompiled,$scope.title).then(function(response){
            // adding newsletter
            $scope.newsletter = {
                title:$scope.email.title,
                preamble:$scope.email.preamble,
                spoiler:$scope.email.spoiler,
                html:htmlCompiled,
                campaign_id:response.campaign_id
            }
            adminService.saveNewsletter($scope.newsletter).then(function (response) {
                adminService.addPostDelicious($scope.posts_selected);
                adminService.addPostSlack($scope.posts_selected);
                $scope.message = "Sent";
                $scope.isSending = false;
            },
             function (err) {
                $scope.message_err = err;
            });
        });
    }

    $scope.saveDraft = function(draft_id) {
        var emailData = {
            _id: draft_id,
            title:$scope.email.title,
            preamble:$scope.email.preamble,
            spoiler:$scope.email.spoiler
        };

        $scope.isSaving = true;

        adminService.saveDraft(emailData).then(function(response){
          getDrafts();
          $scope.draft_id = response.data._id;
          $scope.isSaving = false;
        });
    }

    $scope.newDraft = function(){
      $scope.draft_id = null;
      $scope.email.title = '';
      $scope.email.preamble = '';
      $scope.email.spoiler = '';
    }

    $scope.openDraft = function(draft){
      $scope.draft_id = draft._id;
      $scope.email.title = draft.title;
      $scope.email.preamble = draft.preamble;
      $scope.email.spoiler = draft.spoiler;
    }

    $scope.changeToHTML = function() {
        $scope.markdown = false;
    }
    $scope.changeToMarkdown = function() {
        $scope.markdown = true;
    }

    $scope.$watch('models_post.dropzones', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

}]);

routerApp.controller('adminUsersController', ['$scope', '$location', '$rootScope','adminService', '$stateParams', function ($scope, $location, $rootScope, adminService, $stateParams) {

    $scope.post = {
        username:"",
        role:""
    }

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    $scope.users = [];
    getUsers();

    function getUsers(){
        adminService.getUsers().then(function (response) {
            $scope.users = response.data;
            $scope.displayedCollection = [].concat($scope.users);
        });
    }

    $scope.editUser = function(userId){
        $scope.roles = ['publisher', 'editor', 'admin'];

        if(userId==="new")
            $scope.user = {
                username:"",
                role:"",
                password:""
            }
        else
        {
            adminService.getUser(userId).then(function (response) {
              console.log(response)
                $scope.user = {
                    id: response.data._id,
                    username:response.data.username,
                    role:response.data.role,
                    password: ""
                }
            });
        }
    }

    $scope.saveUser = function () {
        adminService.saveUser($scope.user).then(function (response) {
            $('.modal').modal('hide');
            $scope.displayedCollection = [];
            getUsers();
            if($stateParams.user_id){
                $location.path("/admin/users");
            }
        },
         function (err) {
             $scope.message = err;
         });
    }

    $scope.removeUser = function(userId){

        adminService.removeUser(userId).then(function (response) {
            $scope.users = [];
            $scope.displayedCollection = [];
            getUsers();
        },
         function (err) {
             $scope.message = err;
        });
    }

    angular.element(document).ready(function () {
        if($("#nav").find('.activemenu').length > 0){
            $(".nav_inner").css("left","-200px");
            $("#nav").find('.activemenu').removeClass("activemenu");
        }
    });

}]);

routerApp.filter( 'short_url', function () {
  return function ( input ) {
    if(input && input.length > 30){
        return input.substr(0,30) + "...";
    }
    else
        return input;
  };
});

routerApp.config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
    usSpinnerConfigProvider.setDefaults({color: '#5dcff3'});
}]);

routerApp.directive('datepickerPopup', function (dateFilter, datepickerPopupConfig) {
    return {
        restrict: 'A',
        priority: 1,
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {
            var dateFormat = attr.datepickerPopup || datepickerPopupConfig.datepickerPopup;
            ngModel.$formatters.push(function (value) {
                return dateFilter(value, dateFormat);
            });
        }
    };
});

routerApp.directive('dynamic', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.dynamic, function(html) {
        ele.html(html);
        $compile(ele.contents())(scope);
      });
    }
  };
});
