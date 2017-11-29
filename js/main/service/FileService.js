angular.module('services.file', [
    'ngResource',
    'ngCookies'
]).factory('File', ['$resource', 'serverAddress', '$filter', '$localStorage', function($resource, serverAddress, $filter, $localStorage) {

    var file = $resource(serverAddress + '/file/:param', {param: "@param"}
        , {
            changeFileName: {
                method : "POST",
                headers: {'Content-type':'application/json; charset=UTF-8'},
                params: {
                    param: 'changeFileName'
                }
            }


        });

    return file;
}]);
