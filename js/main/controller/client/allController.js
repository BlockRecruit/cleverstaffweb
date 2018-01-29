controller.controller('ClientsController', ["$scope", "$location", "Client", "ngTableParams", "$rootScope", "$filter", 'Person', 'ScopeService','notificationService', 'serverAddress', 'Service', '$timeout', '$anchorScroll',
    function($scope, $location, Client, ngTableParams, $rootScope, $filter, Person, ScopeService, notificationService, serverAddress, Service, $timeout, $anchorScroll) {
        $scope.status = Client.getStatusAssociated();
        $rootScope.searchCheckClient = $rootScope.searchCheckClient == undefined ? false : $rootScope.searchCheckClient;
        $scope.regionId = null;
        $scope.clientsFound = null;
        $scope.a = {};
        let sortDirection = 'desc';
        let previousSortParam = '';
        $scope.a.searchNumber = 1;
        $scope.previousFlag = true;
        $scope.serverAddress = serverAddress;
        $scope.loader = false;
        $scope.isSearched = false;
        $scope.client = {logoId: null};
        $scope.industries = Service.getIndustries();


    $scope.status = [
        {value: "future", name: "future"},
        {value: "in_work", name: "in work"},
        {value: "all_done", name: "all done"},
        {value: "canceled", name: "canceled"},
        {value: "deleted", name: "deleted"}
    ];
    $rootScope.toAdd = function() {
        $location.url('/client/add/');
        $location.path('/client/add/');
    };
    $scope.toClient = function(client) {
        $location.path('clients/' + client.localId);
    };
    if(localStorage.countClient){
        $scope.startPagesShown = localStorage.countClient;
    } else{
        $scope.startPagesShown = 15;
    }
    $scope.searchParam = {
        words: "",
        state: "",
        pages: {count: $scope.startPagesShown}
    };

    function scope_update(val) {
        $scope.tableParams.reload();
    }

    ScopeService.setCurrentControllerUpdateFunc(scope_update);
        Person.getAllPersons(function (resp) {
            $scope.persons = [];
            $rootScope.persons = [];
            $rootScope.personsNotChanged = [];
            $scope.associativePerson = resp.object;
            angular.forEach($scope.associativePerson, function (val, key) {
                $scope.persons.push($scope.associativePerson[key]);
                $rootScope.persons.push($scope.associativePerson[key]);
                $rootScope.personsNotChanged.push($scope.associativePerson[key]);
            });
        });
    $scope.clickSearch = function() {
        $scope.tableParams.$params.page = 1;

        if($scope.searchParam.words && $scope.searchParam.words.length == 1){
            notificationService.error($filter('translate')('Enter more data for search'));
            return;
        }

        if($scope.searchParam.state.length == 0 && $scope.searchParam.words.length == 0 &&
            $scope.searchParam.name == null && $scope.searchParam.responsible == 'null' &&
            $scope.searchParam.industry == 'null' && $scope.searchParam.regionIdCity == 'null'){
            notificationService.error($filter('translate')('Enter the data'));
        }else{
            $scope.loader = true;
            if ($scope.searchParam['words'] || $scope.searchParam['responsible'] || $scope.searchParam['state'] || $scope.searchParam['']) {
                $scope.tableParams.reload();
                $rootScope.searchCheckClient = true;
            } else if ($rootScope.searchCheckClient) {
                $scope.tableParams.reload();
                $rootScope.searchCheckClient = false
            }
            $scope.isSearched = true;
        }
    };
        Service.getRegions2(function (countries,cities) {
            $scope.countries = countries;
            $scope.cities = cities;
            var optionsHtml = '<option value="null" style="color:#999">'+$filter('translate')('region')+'</option>';
            var optionsHtmlCity = '<option value="null" style="color:#999">'+$filter('translate')('city')+'</option>';
            angular.forEach($scope.countries, function (value) {
                optionsHtml += "<option style='color: #000000' value='" + JSON.stringify(value).replace(/\'/gi,"") + "'>" + value.name + "</option>";
            });
            angular.forEach($scope.cities, function (value) {
                optionsHtmlCity += "<option style='color: #000000' value='" + JSON.stringify(value).replace(/\'/gi,"") + "'>" + value.name + "</option>";
            });
            $('#cs-region-filter-select, #cs-region-filter-select-for-linkedin').html(optionsHtml);
            $('#cs-region-filter-select-cities, #cs-region-filter-select-for-linkedin-cities').html(optionsHtmlCity);
        });
        $scope.setSearchedRegion = function(){
            $scope.searchParam.regionIdCity = null;
            var obj = JSON.parse($scope.searchParam.regionId);
            if(obj.type == 'country'){
                $scope.searchedRegion = JSON.parse($scope.searchParam.regionId);
                $('#cs-region-filter-select-cities').find('option').remove();
                var optionsHtmlCity = '<option value="null" style="color:#999">'+$filter('translate')('city')+'</option>';
                angular.forEach($scope.cities, function (value) {
                    if(value.type == 'city' && value.country == $scope.searchedRegion.country){
                        optionsHtmlCity += "<option style='color: #000000' value='" + JSON.stringify(value).replace(/\'/gi,"") + "'>" + value.name + "</option>";
                    }
                });
                // $('#cs-region-filter-select-cities').find('option').remove();
                console.log($('#cs-region-filter-select-cities option'));
                $('#cs-region-filter-select-cities, #cs-region-filter-select-for-linkedin-cities').html(optionsHtmlCity);
            }else{
                $scope.searchedRegionCity = JSON.parse($scope.searchParam.regionIdCity);
            }
        };
        let pageNumber = 0;
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: $scope.searchParam.pages.count
    }, {
        total: 0,
        getData: function($defer, params) {
            $rootScope.loading = true;
            if ($rootScope.previousLocation == '/clients/:id') {
                if ($rootScope.searchParamInClients != undefined) {
                    $scope.searchParam = $rootScope.searchParamInClients;
                    $rootScope.searchParamInClients = null;
                }
                if($scope.previousFlag){
                    $scope.tableParams.page($rootScope.previousSearchNumber);
                    pageNumber = $rootScope.previousSearchNumber;
                    $scope.previousFlag = !$scope.previousFlag;
                }
            }
            if (ScopeService.isInit()) {
                var activeParam = ScopeService.getActiveScopeObject();
                $scope.activeScopeParam = activeParam;
                Client.setOptions("page", {number: (params.$params.page - 1), count: params.$params.count});
                if(params.$params.count <= 120) {
                    localStorage.countClient = params.$params.count;
                } else {
                    localStorage.countClient = 15;
                }
                $scope.searchParam.pages.count = params.$params.count;
                if ($scope.searchParam['regionId'] && $scope.searchParam['regionId'] != 'null') {
                    if($scope.searchParam['regionIdCity'] && $scope.searchParam['regionIdCity'] != 'null'){
                        var json = JSON.parse($scope.searchParam['regionIdCity']);
                        if (json && json.type) {
                            Client.setOptions("city", json.value);
                        }
                    }else{
                        var json = JSON.parse($scope.searchParam['regionId']);
                        Client.setOptions("country", json.value);
                    }
                } else {
                    Client.setOptions("country", activeParam.name == 'region' && activeParam.value.type == "country" ? activeParam.value.value : null);
                    Client.setOptions("city", activeParam.name == 'region' && activeParam.value.type == "city" ? activeParam.value.value : null);
                }
                Client.setOptions("industry", isNotBlank($scope.searchParam['industry']) ? $scope.searchParam['industry'] : null);
                Client.setOptions("personId", activeParam.name == 'onlyMy' ? $rootScope.userId : null);
                Client.setOptions("responsible", $scope.searchParam.responsible && $scope.searchParam.responsible != 'null' ? $scope.searchParam.responsible : null);
                Client.setOptions("name", $scope.searchParam['name'] ? $scope.searchParam['name'] : null);
                Client.setOptions("words", $scope.searchParam['words'] ? $scope.searchParam['words'] : null);
                Client.setOptions("state", isNotBlank($scope.searchParam['state']) ? $scope.searchParam['state'] : null);

                function getClients(page,count) {
                    if(page || count) {
                        Client.setOptions("page", {number: page, count: count});
                        pageNumber = page;
                    } else {
                        $scope.isShowMore = false;
                        pageNumber = Client.searchOptions().page.number;
                        if(document.getElementById('scrollup'))
                            document.getElementById('scrollup').style.display = 'none';
                        $timeout(function() {
                            $anchorScroll('mainTable');
                        });
                    }
                    Client.all(Client.searchOptions(), function(response) {
                        $rootScope.objectSize = response['objects'] != undefined ? response['total'] : 0;
                        if(page) {
                            $scope.clients = $scope.clients.concat(response['objects'])
                        } else {
                            $scope.clients = response['objects'];
                        }
                        $scope.paginationParams = {
                            currentPage: Client.searchOptions().page.number,
                            totalCount: $rootScope.objectSize
                        };
                        let pagesCount = Math.ceil(response['total']/Client.searchOptions().page.count);
                        if(pagesCount == Client.searchOptions().page.number + 1) {
                            $('#show_more').hide();
                        } else {
                            $('#show_more').show();
                        }
                        $scope.clientsFound = response['total'] >= 1;
                        params.total(response['total']);
                        $defer.resolve($scope.clients);
                        $rootScope.loading = false;
                    });
                }
                getClients();
                $scope.showMore = function () {
                    $scope.isShowMore = true;
                    Service.dynamicTableLoading(params.total(), pageNumber, params.$params.count, getClients)
                };
                $rootScope.searchParamInClients = $scope.searchParam;
                $scope.a.searchNumber = $scope.tableParams.page();
                $rootScope.previousSearchNumber = $scope.a.searchNumber;
            }
        }
    });
        $scope.changeInputPage = function(params,searchNumber){
            var searchNumber = Math.round(searchNumber);
            var maxValue = $filter('roundUp')(params.settings().total/params.count());
            if(searchNumber){
                if(searchNumber >= 1 && searchNumber <= maxValue){
                    params.page(searchNumber);
                    $scope.a.searchNumber = searchNumber;
                    pageNumber = searchNumber;
                }
            }
        };
    $scope.showAdvancedSearchFunc = function() {
        $scope.showAdvancedSearch = !$scope.showAdvancedSearch;
    };
    $scope.showAdvancedSearchFuncHide = function(){
        $scope.showAdvancedSearch = !$scope.showAdvancedSearch;
    };
    $scope.addShortClient = function(){
        if($scope.shortAddClient.$valid){
            Client.add($scope.client, function(resp) {
                if(resp.status =='ok'){
                    $scope.tableParams.reload();
                    notificationService.success($filter('translate')("client_save_1") + " " + $scope.client.name + $filter('translate')("client_save_2"));
                }else{
                    notificationService.error(resp.message);
                }
            });
        }else{
            notificationService.error($filter('translate')('Please fill in all fields'));
        }
    };
        $scope.getFirstLetters = function(str){
            return firstLetters(str)
        };
    $(document).click(function (){
        if($(".advancedSearch").css('display') != 'none'){
            $scope.showAdvancedSearchFuncHide();
            $scope.$apply();
        }
    });
    $scope.sortTable = function (sortParam) {
        let parentObject = '';
        if (sortParam && $scope.clients) {
            if( sortDirection == 'desc') {
                ascSort();
            } else {
                descSort();
            }
            previousSortParam = sortParam;
        }

        function descSort() {
            $scope.clients.sort((a,b) => {
                if(parentObject && a[parentObject] && b[parentObject]) {
                    if(a[parentObject][sortParam] > b[parentObject][sortParam] || !a[parentObject][sortParam]) {
                        return 1;
                    }
                    if(a[parentObject][sortParam] < b[parentObject][sortParam] || !b[parentObject][sortParam]) {
                        return -1;
                    }
                } else {
                    if(a[sortParam] > b[sortParam] || !a[sortParam]) {
                        return 1;
                    }
                    if(a[sortParam] < b[sortParam] || !b[sortParam]) {
                        return -1;
                    }
                }
                return 0;
            });
            sortDirection = 'desc';
        }

        function ascSort() {
            $scope.clients.sort((a,b) => {
                if(parentObject && a[parentObject] && b[parentObject]) {
                    if(a[parentObject][sortParam] > b[parentObject][sortParam] || !a[parentObject][sortParam]) {
                        return -1;
                    }
                    if(a[parentObject][sortParam] < b[parentObject][sortParam] || !b[parentObject][sortParam]) {
                        return 1;
                    }
                } else {
                    if(a[sortParam] > b[sortParam] || !a[sortParam]) {
                        return -1;
                    }
                    if(a[sortParam] < b[sortParam] || !b[sortParam]) {
                        return 1;
                    }
                }
                return 0;
            });
            sortDirection = 'asc';
        }
    };
}]);
