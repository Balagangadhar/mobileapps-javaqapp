angular.module('myapp').service('UtilityService', function(){
	this.pluckByField = function(obj,field){
		field = field || 'id';
		var extractFn = function(val) {
			if (angular.isObject(val)) {
				return val[field];
			} else {
				return val;
			}	 
		}
		if (angular.isArray(obj)) {
			var res = [];
			for (var i = 0; i < obj.length; i++) {
				res.push(extractFn(obj[i]));
			}
			return res;
		} else {
			return obj ? extractFn(obj) : null;
		}
	},
	this.shuffleArray = function(sourceArray){
		var targetArray = sourceArray.slice(0); 
		if(targetArray && targetArray.length>0){
			for (var n = 0; n < targetArray.length - 1; n++) {
				var k = n + Math.floor(Math.random() * (targetArray.length - n));
				var temp = targetArray[k];
				targetArray[k] = targetArray[n];
				targetArray[n] = temp;
			}
		}
		return targetArray;
	}
});