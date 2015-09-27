angular.module('myapp').controller('HomeCtrl', function($rootScope,$scope,ItemService,$location,DbService,$http,$ionicLoading,$ionicModal,GLOBAL,$location) {
	var init = function(){
		console.log('initialized');
	}
	$scope.search = {};
	$scope.search.value = '';
	$scope.data = {
		learningStatus: 'statusAll',
		level : 'levelAll'
	};

	$scope.learningStatusList = [
	{ text: "All", value: "statusAll" },
	{ text: "Learned", value: "learned" },
	{ text: "Learning", value: "learning" }
	];

	$scope.levelList = [
	{ text: "All", value: "levelAll" },
	{ text: "Basic", value: "basic" },
	{ text: "Intermediate", value: "intermediate"},
	{ text: "Advanced", value: "advanced" }
	]


	$rootScope.$on('onHomeViewInitialize',function(){
		$scope.getItemsByCriteria();
	})
	$scope.loadItems = function(){
		$scope.getItemsByCriteria();
	}
	$scope.loadingIndicator = $ionicLoading.show({
			content: 'Loading Data',
			animation: 'fade-in',
			showBackdrop: false,
			maxWidth: 200,
			showDelay: 500
		});
	$scope.getItemsByCriteria = function(){
		console.log('$scope.search.value',$scope.search.value);

		ItemService.getItemsByCriteria($scope.search.value).then(function(items){
			$ionicLoading.hide();
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
		//TODO Need to fix following issue
		return item.learningStatus === 'false' ? "ion-ios-book-outline wrap-text" : "ion-android-done-all wrap-text";
	};

	
	$scope.getItemsBySearchString = function(searchString){
		ItemService.getItemsByCriteria(searchString).then(function(items){
			$scope.items = items;
		})
	}
	$scope.clearSearch = function(){
		$scope.search.value = '';
		$scope.getItemsByCriteria();
	}
	$scope.getShuffleStatus = function(){
		return ItemService.getShuffleStatus();
	}
	$scope.toggleShuffle = function(){
		ItemService.toggleShuffle($scope.search.value).then(function(items){
			$scope.items = items;
		});
	}
	$scope.updateLevel = function(updatedLevel){
		console.log('value',updatedLevel);
		ItemService.updateLevel($scope.search.value,updatedLevel).then(function(items){
			$scope.items = items;
		});
	}
	
	$scope.updateLearningStatus = function(updatedLearningStatus){
		console.log('updatedLearningStatus',updatedLearningStatus)
		ItemService.updateLearningStatus($scope.search.value,updatedLearningStatus).then(function(items){
			$scope.items = items;
		});
	}
	$scope.synchronizeDataWithServer = function(){
		alert('Synchronizing the data with server...')
		$http.get('https://raw.githubusercontent.com/Balagangadhar/mobileapps-javaqapp/master/www/data/content.json')
		.success(function(data, status, headers, config) {
			DbService.loadData('ITEM',data);
			alert('Synchronizing completed successfully.')
			$rootScope.$broadcast("onHomeViewInitialize");       
		})
		.error(function(data, status, headers, config) {
			alert(status)
			alert('Please check your connection and try again...')
		})
	}
	$scope.getJsonData = function(){
		console.log('getJsonData',angular.toJson($scope.items, true));
	}
	$scope.$on('$ionicView.enter', function (viewInfo, state) {
		$scope.getItemsByCriteria();
	});

	// $scope.loadingIndicator = $ionicLoading.show({
	// 	content: 'Loading Data',
	// 	animation: 'fade-in',
	// 	showBackdrop: false,
	// 	maxWidth: 200,
	// 	showDelay: 500
	// });
	$ionicModal.fromTemplateUrl('app/item/itemCreate.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	$scope.openCreateItemPanel = function(){
		// $scope.modal.show();
		$location.path('/create');
	}
	$scope.initializeItem = function(){
		//TODO : Fix this function
		$scope.item={question:"", answer : "",tags : "", versions : "", level : "",learningStatus: false};
		// return true;
	}
	$scope.closeCreateItemPanel = function(){
		// $scope.modal.hide();
		$location.path('/home');
	}
	$scope.submitItem = function(){
			console.log('admin',$scope.isAdmin())
		
		var item = $scope.item;
		console.log('item',item);
		if(item.question && item.answer && item.level && item.tags){
			ItemService.getMaxId().then(function(maxId){
			$scope.item.id = parseInt(maxId)+1;
			DbService.createItem('ITEM',$scope.item);
			alert('Item saved successfully.');
			$location.path('/home')
		});
		
		}else{
			alert('All the fields are mandatory')
		}
		
	}
	$scope.isAdmin = function(){
		return GLOBAL.admin;
	}
	$scope.updateDevOps = function(){
		console.log('updateDevOps')
		GLOBAL.noOfClicks = GLOBAL.noOfClicks+1;
		if(GLOBAL.noOfClicks===8){
			console.log('four clicks'); 
			GLOBAL.admin=!GLOBAL.admin;
			GLOBAL.noOfClicks = 0;
		}
	}
	$scope.resetDevOps = function(){
		GLOBAL.noOfClicks = 0;
	}
	$scope.$on('$stateChangeSuccess', function (a,b,c) {
		if(b.name==='create'){
			$scope.initializeItem();
		}
	});
});