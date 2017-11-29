angular.module('services.achieve', [
    'ngResource',
    'ngCookies'
]).factory('Achieve', ['$resource', 'serverAddress', function($resource, serverAddress) {

    var achieve = $resource(serverAddress + '/achieve/:param', {param: "@param"}
        , {
            get:{
                method:"POST",
                params:{
                    param:"get"
                }
            }


        });

    return achieve;
}]);
