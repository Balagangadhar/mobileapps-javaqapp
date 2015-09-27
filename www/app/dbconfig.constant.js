angular.module('myapp').constant('DBCONFIG', {
    NAME: 'JAVAQAPP',
    TABLES: {
        ITEM: {
            id: 'integer primary key',
            question: 'text',
            answer: 'text',
            tags: 'text',
            versions: 'text',
            level: 'text',
            learningStatus: 'text'
        }
    }
}).constant('GLOBAL',{
    admin : false,
    noOfClicks : 0
})