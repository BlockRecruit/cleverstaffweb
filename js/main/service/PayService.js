angular.module('services.pay', [
    'ngResource',
    'ngCookies'
]).factory('Pay', ['$resource', 'serverAddress', '$filter', '$localStorage', 'notificationService',
    function ($resource, serverAddress, $filter, $localStorage, notificationService) {

        var Pay = $resource(serverAddress + '/pay/:param', {param: "@param"},
            {
                getPayments: {
                    method: "GET",
                    params: {
                        param: "getPayments"
                    },
                    isArray: true
                },
                createPaymentUsage: {
                    method: "GET",
                    params: {
                        param: "createPaymentUsage"
                    }
                },
                createPaymentHrModule: {
                    method: "GET",
                    params: {
                        param: "createPaymentHrModule"
                    }
                },
                removePayment: {
                    method: "GET",
                    params: {
                        param: "removePayment"
                    }
                }
            });
        return Pay;
    }]);