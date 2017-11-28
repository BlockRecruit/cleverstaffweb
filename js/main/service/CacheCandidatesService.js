angular.module('services.cacheCandidates',[]).factory('CacheCandidates', function() {
    var candidate = [];
    return (function() {
        return {
            add: function(candidateObject) {
                candidate[candidateObject.localId] = candidateObject;
            },
            get: function(localId) {
                return candidate[localId];
            },
            isExist: function(localId) {
                return candidate[localId] != undefined;
            },
            update: function(candidateObject) {
                if (candidate[candidateObject.localId]) {
                    candidate = candidateObject;
                }
            },
            updateLastHistory: function(historyObject) {
                if (historyObject.candidate && candidate[historyObject.candidate.localId]) {
                    candidate[historyObject.candidate.localId].actions.objects[0] = historyObject;
                }
            }
        };
    }());


});