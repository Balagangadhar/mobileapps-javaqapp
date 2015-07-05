angular.module('myapp').controller('ItemCtrl', function($rootScope,$scope,ItemService,UtilityService,$stateParams,$location,$cordovaSocialSharing) {
	
	ItemService.getItemById($stateParams.itemId).then(function(item){
		$scope.item = item;
	})

	$scope.getTagsAsString = function(){
		if($scope.item){
			return $scope.item.tags;
		}
		return "";
	};

	$scope.getVersionsAsString = function(){
		if($scope.item){
			return $scope.item.versions;
		}
		return "";
	};

	$scope.getLearningStatusMsg = function(){
		return ItemService.getLearningStatusMsg();
	};

	$scope.getLearningStatusIcon = function(){
		if($scope.item){
			return $scope.item.learningStatus === 'false' ? "ion-ios-book-outline" : "ion-android-done-all";
		}else{
			return "";
		}
	};
	$scope.getLearningStatus = function(){
		if($scope.item){
			return $scope.item.learningStatus === 'false' ? false : true;
		}else{
			return "";
		}
	}

	
	$scope.toggleLearningStatus = function(){
		if($scope.item){
			ItemService.toggleLearningStatus($scope.item.id);
			$scope.item.learningStatus = $scope.item.learningStatus==='true' ? 'false' : 'true'; 
		}
	};

	$scope.openPreviousItem = function(){
		var item = ItemService.getPreviousItem();
		if(item && item.id){
			$location.path('/item/'+item.id);
			ItemService.decrementCurrentPosition();
		}else{
			$location.path('/');
			ItemService.resetCurrentPosition();
		}
	};

	$scope.openNextItem = function(){
		var item = ItemService.getNextItem(); 
		if(item && item.id){
			$location.path('/item/'+item.id);
			ItemService.incrementCurrentPosition();
		}else{
			$scope.gotoHome();
		}
		
	};

	$scope.gotoHome = function(){
		$location.path('/');
		ItemService.resetCurrentPosition();
	}

	$scope.shareSocially = function(){
		window.plugins.socialsharing.
		share($scope.item.question+"\n\n"+$scope.item.answer+"\nShared via JavaQApp...","", "", "");
	}

});