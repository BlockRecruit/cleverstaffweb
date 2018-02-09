angular.module('services.customField', [
    'ngResource',
    'ngCookies'
]).factory('CustomField', ['$resource', 'serverAddress','$rootScope', function($resource, serverAddress, $rootScope) {

    var customField = $resource(serverAddress + '/customField/:param', {param: "@param"}, {

        addField: {
            method : "POST",
            params: {
                param: 'addField'
            }
        },
        removeField: {
            method : "POST",
            params: {
                param: 'removeField'
            }
        },
        getField: {
            method : "GET",
            params: {
                param: 'getField'
            }
        },
        getFullField: {
            method : "GET",
            params: {
                param: 'getFullField'
            }
        },
        getFullFields: {
            method : "GET",
            params: {
                param: 'getFullFields'
            }
        },
        getFieldParam: {
            method : "GET",
            params: {
                param: 'getFieldParam'
            }
        },
        addFieldParam: {
            method : "GET",
            params: {
                param: 'addFieldParam'
            }
        },
        addFieldParams: {
            method : "POST",
            params: {
                param: 'addFieldParams'
            }
        },
        addFieldList: {
            method : "POST",
            params: {
                param: 'addFieldList'
            }
        },
        editField: {
            method : "GET",
            params: {
                param: 'editField'
            }
        },
        deleteFieldParam: {
            method : "POST",
            params: {
                param: 'deleteFieldParam'
            }
        },
        getFieldsTitles: {
            method : "GET",
            params: {
                param: 'getFieldsTitles'
            }
        }
    });

    customField.requestGetFieldsTitles = function () {
        $rootScope.loading = true;
        return new Promise((resolve, reject) => {
            customField.getFieldsTitles({objectType: "vacancy"}, resp => resolve(resp, resp['request'] = 'customField'),error => reject(error));
        });
    };

    customField.getCustomFields = function(type) {
        return new Promise((resolve, reject) => {
            customField.getFullFields({ objectType: type }, resp => resolve(resp), error => reject(error));
        });
    };

    return customField;
}]);