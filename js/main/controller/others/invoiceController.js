controller.controller('invoiceController', ['$rootScope', '$scope', 'Invoice', 'Person', 'Account', '$filter', '$uibModal',
    function($rootScope, $scope, Invoice, Person, Account, $filter, $uibModal) {

    $scope.allPersons = [];
    $scope.accountInfo = {};
    $scope.invoice = {};
    $scope.customer = { address: null, country: null, city: null, companyName: null, companyId: null, fullName: null, position: null, postalCode: null };
    $scope.validation = { invalidFields: [], checking: false};

    $scope.generateInvoice = function() {
        $scope.validation = { invalidFields: [], checking: true};
        if(validatedCustomerForm()) openInvoiceConfirmModal();
    };

    $scope.downloadInvoice = function() {
      console.log('loading...');
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
                $scope.allPersons = allPersons.object;
                $scope.accountInfo = accountInfo.object;
                $scope.currenciesExchangeRates = currencyExchangeRates;

                $scope.months = [1,2,3,4,5,6,7,8,9,10,11,12];
                $scope.currencies = ['USD', 'RUB', 'EUR'];
                $scope.invoice = {
                    users: Object.keys(allPersons.object).length,
                    month: $scope.months.length,
                    currency: 'USD',
                    price: () => $scope.invoice.users * $scope.invoice.month * $scope.accountInfo.monthRate
                };
                $rootScope.loading = false;
            }).catch(error => {
                $rootScope.loading = false;
                console.log(error);
            })
    })();

}]);