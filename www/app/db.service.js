angular.module('myapp').factory('DbService', function($q, DBCONFIG) {
	var self = this;
	self.db = null;
	self.init = function () {
		if (window.sqlitePlugin)
			self.db = window.sqlitePlugin.openDatabase({name: DBCONFIG.NAME});
		else if (window.openDatabase)
			self.db = window.openDatabase(DBCONFIG.NAME, '1.0', 'database', -1);

		for (var tableName in DBCONFIG.TABLES) {
			var defs = [];
			var columns = DBCONFIG.TABLES[tableName];
			for (var columnName in columns) {
				var type = columns[columnName];
				defs.push(columnName + ' ' + type);
			}
			var sql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + defs.join(', ') + ')';
			self.query(sql);
		}
		self.loadData('ITEM', [ {
			id : "1",
			question : 'What is inheritance?',
			answer : 'Different kinds of objects often have a certain amount in common with each other. Mountain bikes, road bikes, and tandem bikes, for example, all share the characteristics of bicycles (current speed, current pedal cadence, current gear). Yet each also defines additional features that make them different: tandem bicycles have two seats and two sets of handlebars; road bikes have drop handlebars; some mountain bikes have an additional chain ring, giving them a lower gear ratio....',
			tags : 'oops',
			versions : 'Java-1.6,Java-1.7',
			level : 'advanced',
			learningStatus : 'false'
		}, {
			id : "2",
			question : 'What is an interface?',
			answer : 'As you\'ve already learned, objects define their interaction with the outside world through the methods that they expose. Methods form the object\'s interface with the outside world; the buttons on the front of your television set, for example, are the interface between you and the electrical wiring on the other side of its plastic casing. You press the "power" button to turn the television on and off....',
			tags : 'oops',
			versions : 'Java-1.6,Java-1.7',
			level : 'basic',
			learningStatus : 'false'
		}, {
			id : "3",
			question : 'What is package?',
			answer : 'A package is a namespace that organizes a set of related classes and interfaces. Conceptually you can think of packages as being similar to different folders on your computer. You might keep HTML pages in one folder, images in another, and scripts or applications in yet another. Because software written in the Java programming language can be composed of hundreds or thousands of individual classes, it makes sense to keep things organized by placing related classes and interfaces into packages...',
			tags : 'oops',
			versions : 'Java-1.6,Java-1.7',
			level : 'basic',
			learningStatus : 'true'
		}, {
			id : "4",
			question : 'What Is an Object?',
			answer : 'An object is a software bundle of related state and behavior. Software objects are often used to model the real-world objects that you find in everyday life. This lesson explains how state and behavior are represented within an object, introduces the concept of data encapsulation, and explains the benefits of designing your software in this manner.',
			tags : 'oops',
			versions : 'Java-1.6,Java-1.7',
			level : 'advanced',
			learningStatus : 'false'
		}, {
			id : "5",
			question : 'What Is a Class?',
			answer : 'A class is a blueprint or prototype from which objects are created. This section defines a class that models the state and behavior of a real-world object. It intentionally focuses on the basics, showing how even a simple class can cleanly model state and behavior.',
			tags : 'oops',
			versions : 'Java-1.6,Java-1.7',
			level : 'exper',
			learningStatus : 'true'
		},{
			id : "6",
			question : 'What Is a Package?',
			answer : 'A package is a namespace for organizing classes and interfaces in a logical manner. Placing your code into packages makes large software projects easier to manage. This section explains why this is useful, and introduces you to the Application Programming Interface (API) provided by the Java platform.A package is a namespace for organizing classes and interfaces in a logical manner. Placing your code into packages makes large software projects easier to manage. This section explains why this is useful, and introduces you to the Application Programming Interface (API) provided by the Java platform.A package is a namespace for organizing classes and interfaces in a logical manner. Placing your code into packages makes large software projects easier to manage. This section explains why this is useful, and introduces you to the Application Programming Interface (API) provided by the Java platform.',
			tags : 'oops',
			versions : 'Java-1.6,Java-1.7',
			level : 'basic',
			learningStatus : 'false'
		},{
			id : "7",
			question : 'Why Use Generics?	',
			answer : 'In a nutshell, generics enable types (classes and interfaces) to be parameters when defining classes, interfaces and methods. Much like the more familiar formal parameters used in method declarations, type parameters provide a way for you to re-use the same code with different inputs. The difference is that the inputs to formal parameters are values, while the inputs to type parameters are types.',
			tags : 'oops',
			versions : 'Java-1.6,Java-1.7',
			level : 'basic',
			learningStatus : 'false'
		}]);
};

self.loadData = function(tableName, data) {
	var columns = [],
	bindings = [];
	for (var columnName in DBCONFIG.TABLES[tableName]) {
		columns.push(columnName);
		bindings.push('?');
	}

	var sql = 'INSERT INTO ' + tableName + ' (' + columns.join(', ') + ') VALUES (' + bindings.join(', ') + ')';

	for (var i = 0; i < data.length; i++) {
		var values = [];
		for (var j = 0; j < columns.length; j++) {
			values.push(data[i][columns[j]]);
		}
		self.query(sql, values);
	}
};

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