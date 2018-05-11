controller.controller('invoiceController', ['$rootScope', '$scope', 'Service', 'Invoice', 'Person', 'Account', 'Pay', '$filter', '$uibModal', 'notificationService', '$timeout',
    function($rootScope, $scope, Service, Invoice, Person, Account, Pay, $filter, $uibModal, notificationService, $timeout) {

    $scope.allPersons = [];
    $scope.accountInfo = {};
    $scope.paidUsers = [];
    $scope.invoice = { users: 0, currency: null, months: null, price: null };
    $scope.customer = { address: null, country: null, city: null, companyName: null, companyId: null, fullName: null, position: null, postalCode: null };
    $scope.validation = { invalidFields: [], checking: false};

    $scope.months = [{label:1, value:1},{label:2, value:2},{label:3, value:3},{label:4, value:4},{label:5, value:5},{label:6, value:6},{label:7, value:7},{label:8, value:8},{label:9, value:9},{label:10, value:10},{label:11, value:11},{label:12, value:12}];
    $scope.currencies = [{label:'UAH', value:'UAH'},{label:'RUB', value:'RUB'},{label:'EUR', value:'EUR'},{label:'USD', value:'USD'}];

    $scope.currenciesSigns = Invoice.getCurrenciesSigns();
    $scope.countries = Service.getAllCounties($rootScope.currentLang);


    function getTranslatedCountry(countries, argCountry) {
        let translatedCountry = {key: "", value: ""};
        Object.entries(countries).forEach(([key, country], index) => {
           if(country === argCountry) {
               translatedCountry.value = country;
               translatedCountry.key = key;
           }
           if(!translatedCountry.value && index === Object.keys(countries).length - 1) {
               const lang = $rootScope.currentLang === 'en' ? 'ru' : 'en';
               translatedCountry.key = getTranslatedCountry(Service.getAllCounties(lang), argCountry).code;
               translatedCountry.value = countries[translatedCountry.key];
           }
        });

        return { name: translatedCountry.value, code: translatedCountry.key };
    }

    $scope.generateInvoice = function() {
        $scope.validation = { invalidFields: [], checking: true};
        if(validatedCustomerForm()) openInvoiceConfirmModal();
    };

    $scope.downloadInvoice = function() {
        $rootScope.loading = true;
        Invoice.getInvoice({
            amount : parseFloat($scope.invoice.price()),
            numberOfMonths: parseInt($scope.invoice.months),
            numberOfUsers : parseInt($scope.invoice.users),
            customerName : $scope.customer.companyName,
            customerRegistrationNumber  : $scope.customer.companyId,
            customerAddress : `${$scope.customer.country};${$scope.customer.city};${$scope.customer.address};${$scope.customer.postalCode}`,
            representerPosition : $scope.customer.position,
            representerName : $scope.customer.fullName,
            currencyAsString : $scope.invoice.currency.toLowerCase()
        }).then(resp => {
            $rootScope.loading = false;
            $scope.modalInstance.close();
            const link = $('#downloadInvoice')[0];
            link.href = '/hr/' + 'getapp?id=' + resp.object;
            link.click();

        }, error => {
            $rootScope.loading = false;
            $scope.modalInstance.close();
            notificationService.error(error.message)
        });
    };

    $scope.$watch('customer', () => {
        if($scope.customerForm.$valid) {
            $scope.validation = { invalidFields: [], checking: false};
        }
    }, true);

    function validatedCustomerForm() {
        Object.entries($scope.customer).map(([key, value]) => {
            if($scope.customerForm[key].$invalid) {
                $scope.validation.invalidFields.push($filter('translate')(key));
            }
        });
        return !Boolean($scope.validation.invalidFields.length);
    }

    function openInvoiceConfirmModal() {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '../partials/modal/invoice-confirm.html',
            size: '',
            scope: $scope,
            resolve: function(){}
        });
    }

    function setInvoiceData(data) {
        $scope.invoice = {
            users: Pay.paymentInfo.countPeople || data.numberOfUsers || $scope.paidUsers.length,
            months: Pay.paymentInfo.countMonths || data.numberOfMonths || 4,
            currency: data.currency,
            price: () => ($scope.invoice.users * $scope.invoice.months * $scope.currenciesMonthRates[$scope.invoice.currency]).toFixed(2)
        };

        $scope.$apply();
    }

    function setCustomerData(data) {
        $scope.customer = {
            address: data.customerAddress.split(';')[2],
            country: getTranslatedCountry($scope.countries, data.customerAddress.split(';')[0]).name,
            city: data.customerAddress.split(';')[1],
            companyName: data.customerName,
            companyId: data.customerRegistrationNumber,
            fullName: data.representerName,
            position: data.representerPosition,
            postalCode: data.customerAddress.split(';')[3]
        };
    }

    function setUsers(allPersons) {
        Object.entries(allPersons).forEach(([personId, person], index) => {
            if (person.status === "A" && person.recrutRole !== 'client') {
                $scope.paidUsers.push({label: $scope.paidUsers.length + 1, value: $scope.paidUsers.length + 1});
            }
        });
    }

    const corporate = {
        getMonthRate: function(resp) {
            if($rootScope.me['orgParams']['tarif'] && $rootScope.me['orgParams']['tarif'] === 'corporate') {
                return 450;
            } else {
                return resp.monthRate || 25;
            }
        },
        getPrice: function() {
            let bonus = 0;
            if ($scope.invoice.months >= 12) {
                bonus = 20;
            }
            else if ($scope.invoice.months >= 4) {
                bonus = 10;
            }
            else {
                bonus = 0;
            }

            const price = Math.floor($scope.invoice.months * $scope.currenciesMonthRates[$scope.invoice.currency]);
            const bonusAmount = Math.floor((price / 100) * bonus);
            return (price - bonusAmount).toFixed(2);
        }
    };

    (() => {
        $rootScope.loading = true;
        Promise.all([
            Person.requestGetAllPersons(),
            Account.accountInfo(),
            Invoice.getCurrenciesExchangeRates(['USD', 'RUB', 'EUR']),
            Invoice.getLastInvoice()
        ]).then(([allPersons, accountInfo, currencyExchangeRates, lastInvoiceData]) => {
                accountInfo.object.monthRate = corporate.getMonthRate(accountInfo.object);
                $rootScope.loading = false;
                $scope.allPersons = allPersons.object;
                $scope.accountInfo = accountInfo.object;

                $scope.currenciesMonthRates = Invoice.getCurrenciesMonthRates(currencyExchangeRates, accountInfo.object.monthRate);

                setUsers(allPersons.object);


                if(lastInvoiceData.object) {
                    setInvoiceData(lastInvoiceData.object);
                    setCustomerData(lastInvoiceData.object);
                } else {
                    $scope.invoice = {
                        users: Pay.paymentInfo.countPeople || $scope.paidUsers.length,
                        months: Pay.paymentInfo.countMonths || 4,
                        currency: 'USD',
                        price: () => ($scope.invoice.users * $scope.invoice.months * $scope.currenciesMonthRates[$scope.invoice.currency]).toFixed(2)
                    };
                }

                if($rootScope.me['orgParams']['tarif'] && $rootScope.me['orgParams']['tarif'] === 'corporate') {
                    $scope.invoice.users = 'up to 25';
                    console.log(corporate.getPrice());
                    $scope.invoice.price = () => corporate.getPrice();
                }

                $scope.$apply();
            }).catch(error => {
                $rootScope.loading = false;
                console.error(error);
            })
    })();

}]);