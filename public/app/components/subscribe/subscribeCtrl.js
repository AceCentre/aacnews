'use strict';
routerApp.controller('SubscribeController', ['$scope', '$location', 'subscribeService', function($scope,$location,subscribeService) {

	$scope.subscription = {
		email:"",
		role:"",
		otherGroup:"Y"
	}
	$scope.msg = "";
	$scope.posted = false;
	$scope.show_error = false;

	$scope.notOtherGroup = function(){

		return ($scope.subscription.otherGroup === 'N' ? true : false);
	}

	$scope.subscribe = function() {
		console.log($scope.subscription);
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
		});
		
	}

	angular.element(document).ready(function () {
		if($("#nav").find('.activemenu').length > 0){
	        $(".nav_inner").css("left","-200px");
	        $("#nav").find('.activemenu').removeClass("activemenu");
	    }
    });

}]);