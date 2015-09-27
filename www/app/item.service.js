angular.module('myapp').factory('ItemService', function($q, DbService, DBCONFIG,UtilityService){
	var self = this;
	self.appSettings = {};
	self.appSettings.shuffle = false;
	self.appSettings.level = 'levelAll';
	self.appSettings.learningStatus='statusAll';
	self.currentPosition = -1;
	self.total = 0;
	self.learned = 0;
	self.items = [];
	self.getLearningStatusMsg = function(){
		if(self.appSettings.learningStatus==='statusAll'){
			return self.learned + "/" +self.total;
		}else{
			return self.total;
		}
	};
	// self.getItems = function(){
	// 	return self.items;
	// }
	self.getItemById = function(itemId){
		return DbService.query("SELECT * FROM ITEM WHERE ITEM.id = "+itemId)
		.then(function(resultSet){
			var data  = DbService.getData(resultSet);
			if(data.length>0){
				return data[0]; 
			}else{
				return null;
			}
		});
	}
	self.getMaxId = function(){
		return DbService.query("SELECT MAX(id) as max FROM ITEM")
		.then(function(resultSet){
			var data  = DbService.getData(resultSet);
			if(data.length>0){
				return data[0].max; 
			}else{
				return null;
			}
		});
	}
	self.toggleLearningStatus = function(itemId){
		var self = this;
		DbService.query("SELECT * FROM ITEM WHERE ITEM.id = "+itemId)
		.then(function(resultSet){
			var data = DbService.getData(resultSet);
			if(data.length>0){
				var lStatus; 
				if(data[0].learningStatus==='true'){
					lStatus = 'false';
					self.learned--; 
				}else{
					lStatus = 'true';
					self.learned++; 
				}
				DbService.query("UPDATE ITEM SET learningStatus = '" + lStatus +"' WHERE ITEM.id = "+itemId); 
			}
		})
	}
	self.getFirstItem = function(){
		return self.items[0]; 
	};
	self.getNextItem = function(){
		if(self.currentPosition<self.items.length){
			return self.items[self.currentPosition+1];
		}else{
			return null;
		}
	}
	self.getPreviousItem = function(){
		if(self.currentPosition>0){
			return self.items[self.currentPosition-1];
		}else{
			return null;
		}
	}

	self.setCurrentPosition = function(pos){
		self.currentPosition = pos;
	};

	self.incrementCurrentPosition = function(){
		self.currentPosition++;
	};

	self.decrementCurrentPosition = function(){
		self.currentPosition--;
	};

	self.resetCurrentPosition = function(){
		self.currentPosition = -1;
	}
	this.getItemsByCriteria = function(searchString,learningStatus,level){
		var searchString = searchString || '';
		var selectSql = "SELECT * FROM ITEM where "; 
		var queryString = "";
		var searchStringCriteria = "(ITEM.question like '%"+searchString+"%' or ITEM.answer like '%"+searchString+"%' or ITEM.level like '%"+searchString+"%')"; 
		queryString +=searchStringCriteria; 

		var learningStatus = learningStatus || self.appSettings.learningStatus;
		if(learningStatus =='learned'){
			queryString +=" and " + "(ITEM.learningStatus = 'true')"; 
		}else if(learningStatus=='learning'){
			queryString +=" and " + "(ITEM.learningStatus = 'false')"; 
		}

		var level = level || self.appSettings.level;
		if(level!=='levelAll'){
			queryString+=" and " + "(ITEM.level = '"+level+"')"; 
		}
		// var levelCriteria = 
		// var queryString = ; 
		return DbService.query(selectSql+queryString)
		.then(function(resultSet){
			self.items  = DbService.getData(resultSet);
			if(self.appSettings.shuffle){
				self.items = self.shuffleItems(self.items);
			}
			self.total = self.items.length;
			self.getLearned(queryString+" and ITEM.learningStatus = 'true'").then(function(count){
				self.learned = count;
			});
			return self.items;
		});
	}
	self.getLearned = function(queryString) {
		var countSql = "SELECT COUNT(*) as count FROM ITEM where "; 
		return DbService.query(countSql+ queryString)
		.then(function(resultSet){
			var data  = DbService.getData(resultSet);
			return data[0].count;
		});
	};
	self.shuffleItems = function(){
		return UtilityService.shuffleArray(self.items);
	}
	
	self.getShuffleStatus = function(){
		return self.appSettings.shuffle;
	}
	self.toggleShuffle = function(searchString){
		var deferred = $q.defer();
		self.appSettings.shuffle = !self.appSettings.shuffle;
		deferred.resolve(self.getItemsByCriteria(searchString,self.appSettings.learningStatus,self.appSettings.level)); 
		return deferred.promise;
	}
	self.updateLevel = function(searchString,updatedLevel){
		var deferred = $q.defer();
		self.appSettings.level = updatedLevel;
		deferred.resolve(self.getItemsByCriteria(searchString,self.appSettings.learningStatus,self.appSettings.level)); 
		return deferred.promise;
	}
	self.updateLearningStatus = function(searchString,updatedLearningStatus){
		var deferred = $q.defer();
		self.appSettings.learningStatus = updatedLearningStatus;
		deferred.resolve(self.getItemsByCriteria(searchString,self.appSettings.learningStatus,self.appSettings.level)); 
		return deferred.promise;
	}
	return self;
});