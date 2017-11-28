angular.module('services.localStorage', []
).factory('$localStorage', ['$window', function($window) {
    return (function() {
        return {
            isExist: function(name) {
                return $window.localStorage.getItem(name) != undefined;
            },
            get: function(name) {
                if (name == undefined || name == null)
                    return null;
                return $window.localStorage.getItem(name);
            },
            set: function(name, value) {
                if (angular.isObject(value)) {
                    value = JSON.stringify(value);
                }
                $window.localStorage.setItem(name, value);
            },
            remove: function(name) {
                $window.localStorage.removeItem(name);
            }
        };
    }());
}]);
