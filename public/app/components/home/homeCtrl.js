var app= angular.module('routeApp.controllers',[]);

app.controller('HomeController', ['$scope', '$location', '$rootScope', 'authService', function($scope, $location, $rootScope, authService) {

  try {
    var userId = authService.getUserId();
    var role = authService.getRole();
    if (!!userId && !!role) {
      $rootScope.auth = {
        isAdmin: role === 'admin',
        isPublisher: role === 'publisher' || role === 'admin',
        isEditor: role === 'editor' || role === 'publisher' || role === 'admin'
      };
    }
  } catch (err) {
    // pass
  }


	$scope.getClassMenu = function(path) {
		if($location.path() == "/" && path == "home")
			return "active";
	    if ($location.path().indexOf(path) > 0) {
	      return "active"
	    } else {
	      return ""
	    }
	}

	angular.element(document).ready(function () {
        $("#nav a.menu_res").click(function (e) {
            e.preventDefault();
            
            if($("#nav").find('.activemenu').length > 0){
                $(".nav_inner").css("left","-200px");
                $(this).removeClass("activemenu");
            } else {
                $(".nav_inner").css("left","0");
                $(this).addClass("activemenu");
            }           
            $(".nav_inner").addClass("done");
            $("body").addClass("bigsize");
            
        });
    });

}]);

app.controller('HomeTextController', ['$scope', '$location', function($scope,$location) {
	angular.element(document).ready(function () {
		if($("#nav").find('.activemenu').length > 0){
	        $(".nav_inner").css("left","-200px");
	        $("#nav").find('.activemenu').removeClass("activemenu");
	    }
    });
}]);	
