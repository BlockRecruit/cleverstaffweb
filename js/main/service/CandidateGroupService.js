angular.module('services.candidateGroup', [
    'ngResource',
    'ngCookies'
]).factory('CandidateGroup', ['$resource', 'serverAddress', '$filter', '$localStorage', function($resource, serverAddress, $filter, $localStorage) {
    var options;

    var candidateGroup = $resource(serverAddress + '/candidateGroup/:param', {param: "@param"}
        , {
            getGroups: {
                method : "GET",
                headers: {'Content-type':'application/json; charset=UTF-8'},
                params: {
                    param: 'getGroups'
                }
            },
            add: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "add"
                }
            },
            addList: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "addList"
                }
            },
            editGroup: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "editGroup"
                }
            },
            remove : {
                method : "POST",
                headers : {'Content-type' : 'application/json'},
                params: {
                    param : "remove"
                }
            },
            removeGroup : {
                method : "GET",
                headers : {'Content-type' : 'application/json'},
                params: {
                    param : "removeGroup"
                }
            }
        });

    candidateGroup.removeGroupFromAccount = function(params) {
        return new Promise((resolve, reject) => {
            candidateGroup.removeGroup(params, resp => {
                if(resp.status === 'ok') {
                    resolve(resp);
                } else {
                    reject(resp);
                }
            }, error => reject(error));
        });
    };

    return candidateGroup;
}]);
