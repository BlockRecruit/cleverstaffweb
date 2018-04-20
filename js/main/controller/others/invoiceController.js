controller.controller('invoiceController', ['$rootScope', '$scope', 'Service', 'Invoice', 'Person', 'Account', '$filter', '$uibModal', 'notificationService', '$timeout',
    function($rootScope, $scope, Service, Invoice, Person, Account, $filter, $uibModal, notificationService, $timeout) {

    $scope.allPersons = [];
    $scope.accountInfo = {};
    $scope.users = [];
    $scope.invoice = { users: 0, currency: null, months: null, price: null };
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
            users: String(data.numberOfUsers),
            months: String(data.numberOfMonths),
            currency: data.currency,
            price: () => ($scope.invoice.users * $scope.invoice.months * $scope.currenciesMonthRates[$scope.invoice.currency]).toFixed(2)
        };

        $scope.$apply();
    }

    function setCustomerData(data) {
        $scope.customer = {
            address: data.customerAddress.split(';')[2],
            country: data.customerAddress.split(';')[0],
            city: data.customerAddress.split(';')[1],
            companyName: data.customerName,
            companyId: data.customerRegistrationNumber,
            fullName: data.representerName,
            position: data.representerPosition,
            postalCode: Number(data.customerAddress.split(';')[3])
        };
    }

    function setUsers(allPersons) {
        Object.entries(allPersons).forEach(([personId, person], index) => {
            if (person.status === "A" && person.recrutRole !== 'client') {
                $scope.users.push(String($scope.users.length + 1));
            }
        });
    }

    (() => {
        $rootScope.loading = true;
        Promise.all([
            Person.requestGetAllPersons(),
            Account.accountInfo(),
            Invoice.getCurrenciesExchangeRates(['USD', 'RUB', 'EUR']),
            Invoice.getLastInvoice()
        ]).then(([allPersons, accountInfo, currencyExchangeRates, lastInvoiceData]) => {
                accountInfo.object.monthRate = accountInfo.object.monthRate || 25;
                $rootScope.loading = false;
                $scope.allPersons = allPersons.object;
                $scope.accountInfo = accountInfo.object;

                $scope.currenciesMonthRates = Invoice.getCurrenciesMonthRates(currencyExchangeRates, accountInfo.object.monthRate);
                $scope.currencies = ['UAH', 'RUR', 'EUR', 'USD'];
                $scope.months = ['1','2','3','4','5','6','7','8','9','10','11','12'];

                setUsers(allPersons.object);


                if(lastInvoiceData.object) {
                    setInvoiceData(lastInvoiceData.object);
                    setCustomerData(lastInvoiceData.object);
                } else {
                    $scope.invoice = {
                        users: String($scope.users.length),
                        months: '4',
                        currency: 'USD',
                        price: () => ($scope.invoice.users * $scope.invoice.months * $scope.currenciesMonthRates[$scope.invoice.currency]).toFixed(2)
                    };
                }

                console.log($scope.invoice, $scope.invoice.users);
                $scope.$apply();
            }).catch(error => {
                $rootScope.loading = false;
                console.error(error);
            })
    })();

}]);