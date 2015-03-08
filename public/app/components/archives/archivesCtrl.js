'use strict';
routerApp.controller('ArchivesController', ['$scope', '$location', 'archivesService', function($scope,$location,archivesService) {

	$scope.campaigns = [];
	
	getCampaigns();

	function getCampaigns() {
		
		archivesService.getCampaigns().then(function(response){
			if(response.data){
				angular.forEach(response.data,function(aCampaign,index){
					var camp = {
						archive_url : aCampaign.archive_url,
						date : aCampaign.date,
						title : aCampaign.title
					}
					$scope.campaigns.push(camp);
				});
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