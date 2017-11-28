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
            }


        });

    return candidateGroup;
}]);
