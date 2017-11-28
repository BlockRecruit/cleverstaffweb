controller.controller('ContactsController',["$scope", "ngTableParams", "Contacts", "$location", "Client", "$rootScope", "$filter", function($scope, ngTableParams, Contacts, $location, Client, $rootScope, $filter) {

    $rootScope.searchCheckContacts = $rootScope.searchCheckContacts == undefined ? false : $rootScope.searchCheckContacts;
    $scope.contactsShow = null;
    $scope.regionId = null;
    $scope.loader = false;
    $scope.isSearched = false;

    $scope.searchParam = {
        firstName: "",
        lastName: "",
        clientId: Contacts.searchOptions().clientId,
        value: "",
        pages: {count: 15}
    };

    if ($rootScope.previousLocation == '/contacts/:id') {
        if ($rootScope.searchParamInContacts != undefined) {
            $scope.searchParam = $rootScope.searchParamInContacts;
            $rootScope.searchParamInContacts = null;
        }
    }
    Client.all(Client.searchOptions(), function(response) {
        $scope.clients = response.objects;
    });
    $scope.toAdd = function() {
        $location.path('contact/add');
    };

    $scope.toContact = function(contact) {
        $location.path('/contacts/' + contact.localId);
    };

    listenerForScope($scope, $rootScope);
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: $scope.searchParam.pages.count
    }, {
        total: 0,
        getData: function($defer, params) {
            Contacts.setOptions("page", {number: (params.$params.page - 1), count: params.$params.count});
            $scope.searchParam.pages.count = params.$params.count;
            Contacts.setOptions("firstName", $scope.searchParam['firstName'] ? $scope.searchParam['firstName'] : null);
            Contacts.setOptions("lastName", $scope.searchParam['lastName'] ? $scope.searchParam['lastName'] : null);
            Contacts.setOptions("clientId", $scope.searchParam['clientId'] ? $scope.searchParam['clientId'] : null);
            Contacts.setOptions("regions", $scope.regionId ? [$scope.regionId] : null);
            Contacts.setOptions("value", $scope.searchParam['value'] ? $scope.searchParam['value'] : null);
            Contacts.setOptions("personId", $rootScope.onlyMe ? $rootScope.userId : null);
            $scope.loading = true;
            Contacts.all(Contacts.searchOptions(), function(response) {
                $scope.objectSize = response['objects'] != undefined ? response['total'] : undefined;
                params.total(response['total']);
                $rootScope.searchParamInClients = $scope.searchParam;
                $scope.contactsShow = response['total'] >= 1;
                $defer.resolve($filter('orderBy')(response['objects'], params.orderBy()));
                Contacts.init();
                $scope.loading = false;
            });
            $rootScope.searchParamInContacts = $scope.searchParam;
        }
    });

    $scope.clickSearch = function() {
        $scope.loader = true;
        if ($scope.searchParam['firstName'] ||
            $scope.searchParam['lastName'] ||
            $scope.searchParam['clientId'] ||
            $scope.searchParam['value']) {
            $scope.tableParams.reload();
            $rootScope.searchCheckContacts = true;
        } else if ($rootScope.searchCheckContacts) {
            $scope.tableParams.reload();
            $rootScope.searchCheckContacts = false;
        }
        $scope.loader = false;
        $scope.isSearched = true;
    };


    $scope.toEditContact = function(id) {
        $location.path("/contact/edit/" + id);
    };

}]);
