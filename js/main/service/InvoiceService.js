angular.module('services.invoice', [
    'ngResource'
    ]
).factory('Invoice', ['$resource', 'serverAddress', '$http', function($resource, serverAddress, $http) {
    const invoice = $resource(serverAddress + '/notice/:param', {param: "@param"},
        {
        });

    invoice.getCurrenciesExchangeRates = function(invoiceCurrencies) {
        return new Promise ((resolve, reject) => {
            $http.get('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
                .then(response => {
                    if(response.status === 200) resolve(filterRequiredCurrencies(response.data, invoiceCurrencies));
                }, error => {
                    reject(error);
                });
        })
    };

    function filterRequiredCurrencies(allCurrencies, invoiceCurrencies) {
        let currencies = {};

        for(let i = 0; i < allCurrencies.length; i++ ) {
            for( let j = 0; j < invoiceCurrencies.length; j++ ) {
                if(invoiceCurrencies[j].toLowerCase() === allCurrencies[i].cc.toLowerCase()) {
                    currencies[allCurrencies[i].cc] = allCurrencies[i];
                }
            }
        }

        return currencies;
    }
    return invoice;
}]);