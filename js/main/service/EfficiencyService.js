 angular.module('services.efficiency', [
    'ngResource'
]).factory('Efficiency', ['$resource', 'serverAddress', function($resource, serverAddress) {
    return $resource(serverAddress + '/efficiency/:param', {param: "@param"},
        {
            get: {
                method: 'POST',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "get"
                }
            }
        });
}]);