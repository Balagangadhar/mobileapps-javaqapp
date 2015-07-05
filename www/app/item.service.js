angular.module('myapp').factory('ItemService', function($q, DbService, DBCONFIG,UtilityService){
	var self = this;
	self.appSettings = {};
	self.appSettings.shuffle = false;
	self.currentPosition = -1;
	self.total = 0;
	self.learned = 0;
	self.items = [];
	self.getLearningStatusMsg = function(){
		return self.learned + "/" +self.total;
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
	this.getItemsBySearchString = function(searchString){
		searchString = searchString || '';
		return DbService.query("SELECT * FROM ITEM where ITEM.question like '%"+searchString+"%' or ITEM.answer like '%"+searchString+"%' or ITEM.level like '%"+searchString+"%'")
		.then(function(resultSet){
			self.items  = DbService.getData(resultSet);
			if(self.appSettings.shuffle){
				self.items = self.shuffleItems(self.items);
			}
			self.total = self.items.length;
			self.getLearned(searchString).then(function(count){
				self.learned = count;
			});
			return self.items;
		});
	}
	self.getLearned = function(searchString) {
		return DbService.query("SELECT count(*) as count FROM (select * from ITEM where ITEM.question like '%"+searchString+"%' or ITEM.answer like '%"+searchString+"%' or ITEM.level like '%"+searchString+"%') as ITEM WHERE ITEM.learningStatus = 'true'")
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
	self.toggleShuffle = function(){
		self.appSettings.shuffle = !self.appSettings.shuffle;
		if(self.appSettings.shuffle){
			self.items = self.shuffleItems(self.items.slice());
		}else{
			self.items = self.items;
		}
		return self.items;
	}
	return self;
});