angular.module('myapp').factory('DbService', function($rootScope,$q,$http, DBCONFIG) {
	var self = this;
	self.db = null;
	self.init = function () {
		var deferred = $q.defer();
		if (window.sqlitePlugin){
			self.db = window.sqlitePlugin.openDatabase({name: DBCONFIG.NAME});
		}
		else if (window.openDatabase){
			self.db = window.openDatabase(DBCONFIG.NAME, '1.0', 'database', -1);
		}
		
		var tableName = 'ITEM'; 
		var tableExistsSql = "SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='ITEM'";
		self.query(tableExistsSql).then(function(resultSet){
			var tableExists = self.getData(resultSet)[0].count;
			if(!tableExists){
				console.log('Table Doest exist');
				var defs = [];
				var columns = DBCONFIG.TABLES[tableName];
				for (var columnName in columns) {
					var type = columns[columnName];
					defs.push(columnName + ' ' + type);
				}
				var createTableSql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + defs.join(', ') + ')';
				self.query(createTableSql);
				$http.get('data/content.json')
				.then(function(res){
					console.log('res.data',res.data)   
					self.loadData('ITEM',res.data);    
					deferred.resolve("done");
					$rootScope.$broadcast("onHomeViewInitialize");       
				});
			}else{
				deferred.resolve("done");
				$rootScope.$broadcast("onHomeViewInitialize");
			}
		})
		return deferred.promise;
	};

	self.loadData = function(tableName, data) {
		var deferred = $q.defer();
		var columns = [],
		bindings = [];
		for (var columnName in DBCONFIG.TABLES[tableName]) {
			columns.push(columnName);
			bindings.push('?');
		}

		var sql = 'INSERT OR REPLACE INTO ' + tableName + ' (' + columns.join(', ') + ') VALUES (' + bindings.join(', ') + ')';

		for (var i = 0; i < data.length; i++) {
			var values = [];
			for (var j = 0; j < columns.length; j++) {
				values.push(data[i][columns[j]]);
			}
			self.query(sql, values);
		}
		deferred.resolve("done");
	};
	self.createItem = function(tableName, item){
			var deferred = $q.defer();
			var columns = [],
			bindings = [];
			for (var columnName in DBCONFIG.TABLES[tableName]) {
				columns.push(columnName);
				bindings.push('?');
			}

			var sql = 'INSERT OR REPLACE INTO ' + tableName + ' (' + columns.join(', ') + ') VALUES (' + bindings.join(', ') + ')';

				var values = [];
				for (var j = 0; j < columns.length; j++) {
					values.push(item[columns[j]]);
				}
				console.log('sql',values)
				self.query(sql, values);

			deferred.resolve("done");
	}
	self.query = function (sql, bindings) {
		console.log('sql',sql)
		bindings = typeof bindings !== 'undefined' ? bindings : [];
		var deferred = $q.defer();

		self.db.transaction(function (transaction) {
			transaction.executeSql(sql, bindings, function (transaction, resultSet) {
				deferred.resolve(resultSet);
			}, function (transaction, error) {
				deferred.reject(error);
			});
		});

		return deferred.promise;
	};

	self.getData = function (resultSet) {
		var output = [];
		for (var i = 0; i < resultSet.rows.length; i++) {
			output.push(resultSet.rows.item(i));
		}
		return output;
	};

	return self;
})