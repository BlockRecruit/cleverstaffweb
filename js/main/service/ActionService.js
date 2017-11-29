angular.module('services.action', [
    'ngResource',
    'ngCookies'
]).factory('Action', ['$resource', 'serverAddress', '$filter', '$localStorage', function($resource, serverAddress, $filter, $localStorage) {

    var action = $resource(serverAddress + '/action/:param', {param: "@param"}
        , {
            editAction: {
                method : "POST",
                headers: {'Content-type':'application/json; charset=UTF-8'},
                params: {
                    param: 'editAction'
                }
            },
            removeMessageAction: {
                method : "GET",
                headers: {'Content-type':'application/json; charset=UTF-8'},
                params: {
                    param: 'removeMessageAction'
                }
            }


        });

    return action;
}]);
