controller.controller('invoiceController', ['$rootScope', '$scope', 'Invoice', 'Person', 'Account', function($rootScope, $scope, Invoice, Person, Account) {

    $scope.allPersons = [];
    $scope.accountInfo = {};
    $scope.invoice = {};
    $scope.customer = { address: null, country: null, city: null, company: null, companyId: null, fullName: null, position: null, postalCode: null };

    // $scope.$watch('customer', () => {
    //     $scope.
    // }, true);

    $scope.generateInvoice = function() {
        Object.entries($scope.customer).map(([key, value]) => {
            console.log(key, $scope.customerForm[key].$viewValue);
        });
    };

    (() => {
        $rootScope.loading = true;
        Promise.all([
            Person.requestGetAllPersons(),
            Account.accountInfo()
        ]).then(([allPersons, accountInfo]) => {
                $scope.allPersons = allPersons.object;
                $scope.accountInfo = accountInfo.object;

                $scope.months = [1,2,3,4,5,6,7,8,9,10,11,12];
                $scope.invoice = {
                    users: Object.keys(allPersons.object).length,
                    month: 12,
                    price: () => $scope.invoice.users * $scope.invoice.month * $scope.accountInfo.monthRate
                };
                $rootScope.loading = false;
            }).catch(error => {
                $rootScope.loading = false;
                console.log(error);
            })
    })();

}]);