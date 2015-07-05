angular.module('myapp').controller('HomeCtrl', function($rootScope,$scope,ItemService,$location) {

	$scope.search = {};
	$scope.search.value = '';
	$rootScope.$on('onHomeViewInitialize',function(){
		$scope.getItemsBySearchString();
	})
	$scope.loadItems = function(){
		$scope.getItemsBySearchString();
	}
	$scope.getItemsBySearchString = function(){
		debugger;
		console.log('$scope.search.value',$scope.search.value)
		ItemService.getItemsBySearchString($scope.search.value).then(function(items){
			$scope.items = items;
		})
	}
	$scope.getLearningStatusMsg = function(){
		return ItemService.getLearningStatusMsg();
	};

	$scope.openFirstItem = function(){
		var item = ItemService.getFirstItem(); 
		if(item && item.id){
			$location.path('/item/'+item.id);
			ItemService.incrementCurrentPosition();
		}else{
			$location.path('/');
			ItemService.resetCurrentPosition();
		}
	};

	$scope.openItem = function(item,index){
		ItemService.setCurrentPosition(index);
		$location.path('/item/'+item.id)
	};

	$scope.getLearningStatusIcon = function(item){
		return item.learningStatus === 'false' ? "ion-ios-book-outline" : "ion-android-done-all";
	};

	
	$scope.getItemsBySearchString = function(searchString){
		// $scope.items = ItemService.getItemsBySearchString(str);
		ItemService.getItemsBySearchString(searchString).then(function(items){
			$scope.items = items;
		})
	}
	$scope.clearSearch = function(){
		$scope.search.value = '';
		$scope.getItemsBySearchString();
	}
	$scope.getShuffleStatus = function(){
		return ItemService.getShuffleStatus();
	}
	$scope.toggleShuffle = function(){
		$scope.items = ItemService.toggleShuffle();
		// for (var i = 0; i < $scope.items.length; i++) {
		// 	console.log('',$scope.items[i].id)
		// };
	}

});