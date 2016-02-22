'use strict';
routerApp.controller('SubscribeController', ['$scope', '$location', '$stateParams', '$rootScope', 'subscribeService', function($scope,$location,$stateParams,$rootScope,subscribeService) {

	$scope.msg = "";
	$scope.posted = false;
	$scope.loaded = false;
	$scope.show_error = false;

	$scope.notOtherGroup = function(){
		return ($scope.subscription.otherGroup === 'N' ? true : false);
	}

	$scope.subscribe = function() {
		$scope.msg = "";
		$scope.posted = false;
		$scope.show_error = false;

		subscribeService.subscribe($scope.subscription).then(function(response){
			console.log(response);
			if(response.success){
				$scope.msg = 'Thankyou. Your email address has been added to the AACinfo newsletter. An email will be sent towards the end of each month. We hope you enjoy it!';
				$scope.posted = true;
			}
			else{
				$scope.msg = (response.error ? response.error : "There was an error subscribing that user");
				$scope.show_error = true;
			}
			$scope.loaded = true;
		});
		
	}

	// checking autosubscribe
	if($stateParams.email && $stateParams.other && $stateParams.autosubscribe){
		// checking role
		$stateParams.role = $stateParams.role ? $stateParams.role : "";
		var aRole = "";
		angular.forEach($rootScope.roles,function(value,index){
        	if(value.toUpperCase() == $stateParams.role.toUpperCase())
        		aRole = $stateParams.role;
        })

		$scope.subscription = {
			email:$stateParams.email,
			role: aRole,
			otherGroup:($stateParams.other.toUpperCase() === "YES"?'Y':'N')
		}

		if($stateParams.autosubscribe.toUpperCase() === "YES")
			$scope.subscribe();
		else
			$scope.loaded = true;
	}
	else{
		$scope.subscription = {
			email:"",
			role:"",
			otherGroup:"Y"
		}
		$scope.loaded = true;
	}

	angular.element(document).ready(function () {
		if($("#nav").find('.activemenu').length > 0){
	        $(".nav_inner").css("left","-200px");
	        $("#nav").find('.activemenu').removeClass("activemenu");
	    }
    });    

}]);