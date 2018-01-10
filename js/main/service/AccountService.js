angular.module('services.account', [
    'ngResource',
    'ngCookies'
]).factory('Account', ['$resource', 'serverAddress', function($resource, serverAddress) {

    var account = $resource(serverAddress + '/account/:param', {param: "@param"}, {

        getAccountInfo: {
            method : "GET",
            headers: {'Content-type':'application/json; charset=UTF-8'},
            params: {
                param: 'getAccountInfo'
            }
        },
        getExpenses: {
            method : "POST",
            headers: {'Content-type':'application/json; charset=UTF-8'},
            params: {
                param: 'getExpenses'
            }
        },
        getAccountHistory: {
            method : "POST",
            headers: {'Content-type':'application/json; charset=UTF-8'},
            params: {
                param: 'getAccountHistory'
            }
        },
        getAccountsInfo: {
            method : "GET",
            headers: {'Content-type':'application/json; charset=UTF-8'},
            params: {
                param: 'getAccountsInfo'
            }
        },
        getTransactions:{
            method:"POST",
            headers:{'Content-type':'application/json; charset=UTF-8'},
            params:{
                param:'getTransactions'
            }
        },
        addTransactionForFinancier: {
            method: "POST",
            headers:{'Content-type':'application/json; charset=UTF-8'},
            params:{
                param:'addTransactionForFinancier'
            }
        }


    });

    return account;
}]);
