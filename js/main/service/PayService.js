angular.module('services.pay', [
    'ngResource',
    'ngCookies'
]).factory('Pay', ['$resource', 'serverAddress', '$filter', '$localStorage', 'notificationService',
    function ($resource, serverAddress, $filter, $localStorage, notificationService) {

        var pay = $resource(serverAddress + '/pay/:param', {param: "@param"},
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


        pay.paymentInfo = {
            _countPeople: 0,
            _countMonths: 0,

            set countPeople(value) {
                this._countPeople = value;
            },
            get countPeople() {
              return this._countPeople;
            },

            set countMonths(value) {
                this._countMonths = value;
            },
            get countMonths() {
                return this._countMonths;
            }
        };

        return pay;
    }]);