 angular.module('services.contacts', [
    'ngResource'
]).factory('Contacts', ['$resource', 'serverAddress', function($resource, serverAddress) {
    var options;
    var contacts = $resource(serverAddress + '/contact/:action', {action: "@action"}, {
        add: {
            method: "PUT",
            params: {
                action: "addContact"
            }
        },
        addContactAndSignUp: {
            method: "PUT",
            params: {
                action: "addContactAndSignUp"
            }
        },
        edit: {
            method: "PUT",
            params: {
                action: "editContact"
            }
        },
        all: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                action: "get"
            }
        },
        one: {
            method: "GET",
            params: {
                action: "get"
            }
        }
    });
    contacts.searchOptions = function() {
        return options;
    };
    contacts.setOptions = function(name, value) {
        options[name] = value;
    };
    contacts.init = function() {
        options = {
            firstName: "",
            lastName: "",
            clientId: "",
            value: "",
            "page": {"number": 0, "count": 100}
        };
    };
    contacts.init();
    return contacts;

}]);
