angular.module('services.invoice', [
    'ngResource',
    'ngCookies'
    ]
).factory('Invoice', ['$resource', 'serverAddress', '$http', function($resource, serverAddress, $http) {
    const invoice = $resource(serverAddress + '/:param', {param: "@param"},
        {
            getInv: {
                method : "POST",
                headers: {'Content-type':'application/json; charset=UTF-8'},
                params: {
                    param: 'getInvoice'
                }
            }
        });

    invoice.getCurrenciesSigns = () => ({ EUR: '€',  USD: '$', UAH : '₴', RUR: '₽'});

    invoice.getInvoice = function(params) {
        return new Promise((resolve, reject) => {
           invoice.getInv(params, resp => {
               if(resp.status === 'ok') {
                   resolve(resp);
               } else {
                   reject(resp);
               }
           }, error => reject(error))
        });
    };

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

    invoice.getCurrenciesMonthRates = function(currencies, USDrate) {
        let monthRates = {};
        Object.entries(currencies).forEach(([key, value]) => {
            monthRates[value.cc] = (USDrate * currencies['USD'].rate) / value.rate ;
        });

        monthRates['RUR'] = monthRates['RUB'];
        return monthRates;
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

        currencies['UAH'] = { cc: 'UAH', rate: currencies['USD'].rate / currencies['USD'].rate};
        currencies['RUR'] = currencies['RUB'];

        return currencies;
    }
    return invoice;
}]);