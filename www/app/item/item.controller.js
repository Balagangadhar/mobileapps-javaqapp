	angular.module('myapp').controller('ItemCtrl', function($rootScope,$scope,ItemService,UtilityService,$stateParams,$location,$cordovaSocialSharing, $filter) {
		
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
			console.log('shareSocially')
			var answerToBeShared = $scope.item.answer ? String($scope.item.answer).replace(/<[^>]+>/gm, '') : '';
			var questionToBeShared = $scope.item.question ? String($scope.item.question).replace(/<[^>]+>/gm, '') : '';
			console.log('answerToBeShared',answerToBeShared)
			
			window.plugins.socialsharing.
			share(questionToBeShared+"\n\n"+answerToBeShared+"\nShared via JavaQApp...",null, null, "");
		}

		$scope.initializeTextEditor = function(){
				 // angular.element("input").cleditor();
		}
		// $scope.orightml = '<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li>Super Easy <b>Theming</b> Options</li><li style="color: green;">Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li class="text-danger">Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE8+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p>';
		// $scope.htmlcontent = $scope.orightml;
		$scope.disabled = false;
		

			});