 angular.module('services.sticker', [
    'ngResource'
]).factory('Sticker', ['$resource', 'serverAddress', function($resource, serverAddress) {
    return $resource(serverAddress + '/sticker/:param', {param: "@param"},
        {
            all: {
                method: 'POST',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "get"
                }
            },
            save: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "save"
                }
            }
        });
}]);