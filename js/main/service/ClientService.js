 angular.module('services.client', [
    'ngResource'
]).factory('Client', ['$resource', 'serverAddress', function($resource, serverAddress) {
    var options;
    var client = $resource(serverAddress + '/client/:param', {param: "@param"}
        , {
            all: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "get"
                }
            },
            add: {
                method: "PUT",
                params: {
                    param: "add"
                }
            },
            edit: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "edit"
                }
            },
            one: {
                method: "GET",
                params: {
                    param: "get"
                }
            },
            addLink: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "addLink"
                }
            },
            removeFile: {
                method: "GET",
                params: {
                    param: "removeFile"
                }
            },
            changeState: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "changeState"
                }
            }, setMessage: {
                method: "POST",
                params: {
                    param: "setMessage"
                }
            },
            addResponsible: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "setResponsible"
                }
            },
            removeResponsible: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "removeResponsible"
                }
            }

        });
    client.getState = function() {
        return [
            {value: "future", name: "future"},
            {value: "in_work", name: "in work"},
            {value: "all_done", name: "all done"},
            {value: "canceled", name: "canceled"},
            {value: "deleted", name: "deleted"}
        ];
    };
    client.getStatusAssociated = function() {
        return {
            "future": "future",
            "in_work": "in work",
            "all_done": "all done",
            "canceled": "canceled",
            "deleted": "deleted"
        };
    };
    client.searchOptions = function() {
        return options;
    };
    client.setOptions = function(name, value) {
        options[name] = value;
    };
    client.init = function() {
        options = {
            country: null,
            city: null,
            name: null
        };
    };
    client.init();
    return client;
}
]);