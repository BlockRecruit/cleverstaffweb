controller.controller('invoiceController', ['$rootScope', '$scope', 'Service', 'Invoice', 'Person', 'Account', '$filter', '$uibModal',
    function($rootScope, $scope, Service, Invoice, Person, Account, $filter, $uibModal) {

    $scope.allPersons = [];
    $scope.accountInfo = {};
    $scope.invoice = {};
    $scope.customer = { address: null, country: null, city: null, companyName: null, companyId: null, fullName: null, position: null, postalCode: null };
    $scope.validation = { invalidFields: [], checking: false};

    $scope.currenciesSigns = Invoice.getCurrenciesSigns();
    $scope.countries = Service.getAllCounties($rootScope.currentLang);

    $scope.generateInvoice = function() {
        $scope.validation = { invalidFields: [], checking: true};
        if(validatedCustomerForm()) openInvoiceConfirmModal();
    };

    $scope.downloadInvoice = function() {
        $rootScope.loading = true;
        Invoice.getInvoice({
            amount : parseFloat($scope.invoice.price()),
            customerName : $scope.customer.companyName,
            customerRegistrationNumber  : $scope.customer.companyId,
            customerAddress : `${$scope.customer.country},${$scope.customer.city},${$scope.customer.address},${$scope.customer.postalCode}`,
            representerPosition : $scope.customer.position,
            representerName : $scope.customer.fullName,
            currencyAsString : $scope.invoice.currency.toLowerCase()
        }).then(resp => {
            $rootScope.loading = false;
            console.log(resp);
            $scope.modalInstance.close();
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
        console.log($scope.validation.invalidFields);
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


    (() => {
        $rootScope.loading = true;
        Promise.all([
            Person.requestGetAllPersons(),
            Account.accountInfo(),
            Invoice.getCurrenciesExchangeRates(['USD', 'RUB', 'EUR'])
        ]).then(([allPersons, accountInfo, currencyExchangeRates]) => {
                $rootScope.loading = false;
                $scope.allPersons = allPersons.object;
                $scope.accountInfo = accountInfo.object;

                $scope.currenciesMonthRates = Invoice.getCurrenciesMonthRates(currencyExchangeRates, accountInfo.object.monthRate);

                $scope.months = [1,2,3,4,5,6,7,8,9,10,11,12];
                $scope.currencies = ['UAH', 'RUR', 'EUR', 'USD'];
                $scope.invoice = {
                    users: Object.keys(allPersons.object).length,
                    month: $scope.months.length,
                    currency: 'USD',
                    price: () => ($scope.invoice.users * $scope.invoice.month * $scope.currenciesMonthRates[$scope.invoice.currency]).toFixed(2)
                };
                $scope.$apply();
            }).catch(error => {
                $rootScope.loading = false;
                console.log(error);
            })
    })();

}]);