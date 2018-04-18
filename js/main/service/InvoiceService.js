angular.module('services.invoice', [
        'ngResource'
    ]
).factory('Invoice', ['$resource', 'serverAddress', function($resource, serverAddress) {
    const invoice = $resource(serverAddress + '/notice/:param', {param: "@param"},
        {
        });


    invoice.test = () => 'test';

    return invoice;
}]);