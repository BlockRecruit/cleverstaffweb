controller.controller('reportsController',["$scope", "$rootScope", "$location", "localStorageService", "Vacancy", "ngTableParams", "Client", "$filter", "Service",
    "ScopeService", "Company", "notificationService", "serverAddress", "$timeout", "Person", "$uibModal", "$anchorScroll","Stat", function($scope, $rootScope, $location, localStorageService, Vacancy, ngTableParams, Client, $filter, Service, ScopeService, Company, notificationService,
                                                                                                      serverAddress, $timeout, Person, $uibModal, $anchorScroll, Stat) {

    if($location.path() == '/reports/vacancy') {
        $scope.vacanciesFound = null;
        $rootScope.searchCheckVacancy = $rootScope.searchCheckVacancy == undefined ? false : $rootScope.searchCheckVacancy;
        $scope.onlyMe = $rootScope.onlyMe;
        $scope.salaryObject = Service.getSalary();
        $scope.previousFlag = true;
        $scope.a = {};
        $scope.a.searchNumber = 1;
        $scope.status = Vacancy.status();
        $scope.employmentType = Service.employmentType();
        $scope.regionId = null;
        $scope.loader = false;
        $scope.searchStatus = '';
        $scope.chosenStatuses = [];
        $scope.currentStatus = null;
        $scope.isSearched = false;
        $rootScope.changeStateObject = {status: "", comment: "", placeholder: null};
        $rootScope.closeModal = function(){
            $scope.modalInstance.close();
        };
        $scope.vacancy = {
            accessType: 'public',
            currency: "USD",
            dateFinish: null,
            datePayment: null,
            descr: "",
            sex:null,
            langs: '',
            status: "open",
            clientId: {
                clientId: $rootScope.addVacancyClientId
            }
        };
        $rootScope.addVacancyClientId = null;

        $scope.toVacancyReport = function (localId) {
            $location.path('reports/vacancy/' + localId);
        };

        if($rootScope.me.personParams.clientAccessLevel != 'hide') {
            Client.all(Client.searchOptions(), function(response) {
                $scope.clients = response.objects;
                var optionsHtml = '<option ng-selected="true" value="" selected style="color:#999">'+$filter('translate')('chose_customer')+'</option>';
                angular.forEach($scope.clients, function (value) {
                    optionsHtml += "<option style='color: #000000' value='" + value.clientId + "'>" + value.name + "</option>";
                });
                $('#client-select').html(optionsHtml);
            });
        }
        Service.getRegions2(function (resp) {
            $scope.regions = resp;
            var optionsHtml = '<option ng-selected="true" value="" selected style="color:#999">'+$filter('translate')('region')+'</option>';
            console.log($scope.searchParam['regionId']);
            angular.forEach($scope.regions, function (value) {
                if(JSON.stringify(value).replace(/\'/gi,"") == $scope.searchParam['regionId']){
                    optionsHtml += "<option style='color: #000000' selected value='" + JSON.stringify(value).replace(/\'/gi,"") + "'>" + value.name + "</option>";
                }else{
                    optionsHtml += "<option style='color: #000000' value='" + JSON.stringify(value).replace(/\'/gi,"") + "'>" + value.name + "</option>";
                }
            });
            $('#cs-region-filter-select').html(optionsHtml);
        });
        if ($rootScope.curentOnlyMenWatch !== undefined) {
            $rootScope.curentOnlyMenWatch();
        }
        if ($rootScope.curentRegionWatch !== undefined) {
            $rootScope.curentRegionWatch();
        }

        function scope_update(val) {
            $scope.tableParams.reload();
        }

        ScopeService.setCurrentControllerUpdateFunc(scope_update);

        $rootScope.statusInter = Vacancy.getInterviewStatus();
        /************************Параметры при загрузке страницы*******************************/
        if(localStorage.countVacancy){
            $scope.startPagesShown = localStorage.countVacancy;
        } else{
            $scope.startPagesShown = 15;
        }
        $scope.searchParam = {
            searchCs: true,
            salary: "",
            status: "",
            regionId: null,
            words: "",
            personId: 'null',
            clientId: "",
            personNameWhoSearching: $rootScope.usernameThatIsSearching,
            pages: {count: $scope.startPagesShown}
        };

        //This function must be after init searchParam
        if ($rootScope.previousLocation == '/vacancies/:id') {
            if ($rootScope.searchParamInVacancies != undefined) {
                $scope.searchParam = $rootScope.searchParamInVacancies;
                if($scope.searchParam.clientId){
                    $scope.$watch('setClientAutocompleterValue',function(newVal, oldVal){
                        if(newVal != undefined){
                            $scope.setClientAutocompleterValue($scope.searchParam.clientName, $scope.searchParam.clientId);
                        }
                    })
                }
                $rootScope.searchParamInVacancies = null;
            }
        }else if ($rootScope.previousLocation == '/clients/:id' && $rootScope.allClientsVacancies == true){
            $scope.searchParam = {
                searchCs: true,
                salary: "",
                status: "",
                regionId: null,
                words: "",
                personId: Vacancy.searchOptions().personId,
                clientId: "",
                personNameWhoSearching: $rootScope.usernameThatIsSearching,
                pages: {count: $scope.startPagesShown}
            };
            $scope.searchParam.clientId = $rootScope.searchParamInVacancies.clientId;
            $scope.searchParam.clientName = $rootScope.searchParamInVacancies.clientName;
            if($rootScope.searchParamInVacancies.status != undefined) {
                $scope.searchParam.status = $rootScope.searchParamInVacancies.status;
                $scope.chosenStatuses = ['expects', 'payment', 'completed', 'canceled', 'deleted'];
            }
            $scope.$watch('setClientAutocompleterValue',function(newVal, oldVal){
                if(newVal != undefined){
                    $scope.setClientAutocompleterValue($scope.searchParam.clientName, $scope.searchParam.clientId);
                }
            })
        }
        $scope.deleteSearchByUser = function() {
            $scope.searchParam.personId = null;
            $scope.searchParam.personNameWhoSearching = null;
            $scope.tableParams.reload();
        };

        $scope.addSearchStatus = function (status) {
            console.log('status', status);
            if(status != 'null') {
                if($scope.chosenStatuses.indexOf(status) != -1){
                    notificationService.error($filter('translate')('the status is already selected'));
                } else{
                    $scope.chosenStatuses.push(status);
                    $scope.updateSearchStatuses();
                }
                console.log('statuses:', $scope.chosenStatuses);
            }
        };
        $scope.updateSearchStatuses = function () {
            $scope.searchParam.status = '';
            if($scope.chosenStatuses.length != 1) {
                angular.forEach($scope.chosenStatuses, function (status) {
                    $scope.searchParam.status = $scope.searchParam.status + status + ',';
                });
                $scope.searchParam.status = $scope.searchParam.status.replace(/,$/, "");
            }else {
                $scope.searchParam.status = $scope.chosenStatuses[0];
            }
        };
        $scope.deleteSearchStatus = function (selectedStatus) {
            $scope.chosenStatuses.splice(selectedStatus, 1);
            $scope.currentStatus = 'null';
            $scope.updateSearchStatuses();
        };
        $scope.clickSearch = function() {
            if($scope.searchParam['salaryName'] == null && $scope.searchParam.states == null &&
                $scope.searchParam.state == null && $("#clientAutocompleater").select2('data') == null &&
                $scope.searchParam.words.length == 0 && $scope.searchParam.name == null &&
                $scope.searchParam.position == null && $scope.searchParam.candidateGroups == null &&
                $scope.searchParam.regionId == null && $scope.searchParam.candidateGroupIds == null &&
                $scope.searchParam.searchFullTextType == null && $scope.searchParam['responsibleId'] == null &&
                $scope.searchParam['personId'] == 'null'){
                notificationService.error($filter('translate')('Enter the data'));
            }else{
                $rootScope.loading = true;
                if ($scope.searchParam['salaryName'] ||
                    $scope.searchParam['status'] ||
                    $("#clientAutocompleater").select2('data') !== null ||
                    $scope.searchParam['regionId'] ||
                    $scope.searchParam['responsibleId'] ||
                    $scope.searchParam['personId'] ||
                    $scope.searchParam['words']) {
                    if ($scope.searchParam['salaryName']) {
                        angular.forEach($scope.salaryObject, function(resp){
                            if(resp.name == $scope.searchParam.salaryName){
                                $scope.searchParam['salary'] = resp;
                            }
                        });
                        //$scope.searchParam['salary'] = angular.fromJson($scope.searchParam['salary']);
                    }
                    console.log($scope.searchParam['regionId']);
                    if ($("#clientAutocompleater").select2('data') !== null) {
                        $scope.searchParam['clientId'] =$("#clientAutocompleater").select2('data').id;
                        $scope.searchParam['clientName'] = $("#clientAutocompleater").select2('data').name
                    }
                    $scope.tableParams.$params.page = 1;
                    $scope.tableParams.reload();
                    $rootScope.searchCheckVacancy = true;
                    // console.log("CLICK TRU E")
                } else if ($rootScope.searchCheckVacancy) {
                    // console.log("CLIK TRUE");
                    $scope.tableParams.$params.page = 1;
                    $scope.tableParams.reload();
                    $rootScope.searchCheckVacancy = false;
                }
                $scope.isSearched = true;
            }
        };

        let currentPage = $scope.searchParam.pages.number;
        $scope.tableParams = new ngTableParams({
            page: 1,
            count: $scope.searchParam.pages.count
        }, {
            total: 0,
            getData: function($defer, params) {
                $rootScope.loading = true;
                if ($rootScope.previousLocation == '/vacancies/:id') {
                    if($scope.previousFlag){
                        $scope.tableParams.page($rootScope.previousSearchNumber);
                        $scope.previousFlag = !$scope.previousFlag;
                    }
                }
                if (ScopeService.isInit()) {
                    var activeParam = ScopeService.getActiveScopeObject();
                    $scope.activeScopeParam = activeParam;
                    Vacancy.setOptions("page", {number: (params.$params.page - 1), count: params.$params.count});
                    localStorage.countVacancy = params.$params.count;
                    $scope.searchParam.pages.count = params.$params.count;
                    $scope.searchParam.personId = $scope.searchParam.personId == 'null' ? null: $scope.searchParam.personId;
                    Vacancy.setOptions("personId", $scope.searchParam.personId != undefined ? $scope.searchParam.personId : activeParam.name == 'onlyMy' ? $rootScope.userId : null);
                    Vacancy.setOptions("salaryFrom", $scope.searchParam['salary'] ? $scope.searchParam['salary'].salaryFrom : null);
                    Vacancy.setOptions("salaryTo", $scope.searchParam['salary'] ? $scope.searchParam['salary']["salaryTo"] : null);
                    Vacancy.setOptions("state", isNotBlank($scope.searchParam['status']) && $scope.chosenStatuses.length == 1 ? $scope.searchParam['status'] : null);
                    Vacancy.setOptions("states", $scope.chosenStatuses.length > 1 ? $scope.chosenStatuses : null);
                    Vacancy.setOptions("words", $scope.searchParam['words'] ? $scope.searchParam['words'] : null);
                    Vacancy.setOptions("clientId", isNotBlank($scope.searchParam['clientId']) ? $scope.searchParam['clientId'] : null);
                    Vacancy.setOptions("responsibleId", isNotBlank($scope.searchParam['responsibleId']) ? $scope.searchParam['responsibleId'] : null);
                    if ($scope.searchParam['regionId']) {
                        var json = JSON.parse($scope.searchParam['regionId']);
                        if (json.type == 'country') {
                            Vacancy.setOptions("country", json.value);
                        } else if (json.type == 'city') {
                            Vacancy.setOptions("city", json.value);
                        }
                    } else {
                        Vacancy.setOptions("country", activeParam.name == 'region' && activeParam.value.type == "country" ? activeParam.value.value : null);
                        Vacancy.setOptions("city", activeParam.name == 'region' && activeParam.value.type == "city" ? activeParam.value.value : null);
                    }

                    function getVacancies(page, count) {
                        if(page || count) {
                            currentPage = page;
                            Vacancy.setOptions("page", {number: page, count: count});
                        } else {
                            $scope.isShowMore = false;
                            currentPage = Vacancy.searchOptions().page.number;
                            if(document.getElementById('scrollup'))
                                document.getElementById('scrollup').style.display = 'none';
                            $timeout(function() {
                                $anchorScroll('mainTable');
                            });
                        }
                        Vacancy.all(Vacancy.searchOptions(), function(response) {
                            $rootScope.objectSize = response['objects'] != undefined ? response['total'] : undefined;
                            $scope.paginationParams = {
                                currentPage: Vacancy.searchOptions().page.number,
                                totalCount: $rootScope.objectSize
                            };
                            let pagesCount = Math.ceil(response['total']/Vacancy.searchOptions().page.count);
                            if(pagesCount == Vacancy.searchOptions().page.number + 1) {
                                $('#show_more').hide();
                            } else {
                                $('#show_more').show();
                            }
                            params.total(response['total']);
                            angular.forEach(response['objects'], function(val) {
                                if (val.region) {
                                    if (val.region.city) {
                                        val.regionShort = val.region.displayCity;
                                    } else if (val.region.country)
                                        val.regionShort = val.region.displayCountry;
                                }
                            });

                            if(page) {
                                $scope.vacancies = $scope.vacancies.concat(response['objects'])
                            } else {
                                $scope.vacancies = response['objects'];
                            }
                            $scope.vacanciesFound = response['total'] >= 1;
                            $defer.resolve($scope.vacancies);
                            Vacancy.init();
                            $scope.searchParam.personId = $scope.searchParam.personId == null ? 'null': $scope.searchParam.personId;
                            $rootScope.loading = false;

                        });
                    }
                    getVacancies();
                    $scope.showMore = function () {
                        $scope.isShowMore = true;
                        Service.dynamicTableLoading(params.total(), currentPage, $scope.tableParams.count(), getVacancies)
                    };
                    $rootScope.searchParamInVacancies = $scope.searchParam;
                    $scope.a.searchNumber = $scope.tableParams.page();
                    $rootScope.previousSearchNumber = $scope.a.searchNumber;
                    $rootScope.allClientsVacancies = false;
                }
            }
        });
        Client.init();
        $scope.changeInputPage = function(params,searchNumber){
            var searchNumber = Math.round(searchNumber);
            var maxValue = $filter('roundUp')(params.settings().total/params.count());
            if(searchNumber){
                if(searchNumber >= 1 && searchNumber <= maxValue){
                    params.page(searchNumber);
                    $scope.a.searchNumber = searchNumber;
                }
            }
        };
        $scope.toOneObject = function(localId) {
            $location.path('/vacancies/' + localId);
        };
        $scope.toAdd = function() {
            $location.path('/vacancy/add');
        };
        if($rootScope.searchedClientId){
            $scope.searchParam['clientId'] = $rootScope.searchedClientId;
            $scope.tableParams.reload();
            $rootScope.searchedClientId = '';
        }
        $scope.getCompanyParams = function(){
            Company.getParams(function(resp){
                $scope.companyParams = resp.object;
                $rootScope.publicLink = $location.$$protocol + "://" + $location.$$host + "/i#/" + $scope.companyParams.nameAlias + "-vacancies";
            });
        };
        $scope.getCompanyParams();

        $scope.showAdvancedSearchFunc = function() {
            $scope.showAdvancedSearch = !$scope.showAdvancedSearch;
        };
        $scope.showAdvancedSearchFuncHide = function(){
            $scope.showAdvancedSearch = !$scope.showAdvancedSearch;
        };
        $scope.getFirstLetters = function(str){
            return firstLetters(str)
        };
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
        $(document).click(function (){
            if($(".advancedSearch").css('display') != 'none'){
                $scope.showAdvancedSearchFuncHide();
                $scope.$apply();
            }
        });
        $scope.showChangeStatusOfVacancy = function (status, vacancy) {
            $scope.oneVacancy = vacancy;
            $rootScope.changeStateObject.status_old = $scope.oneVacancy.status;
            $rootScope.changeStateObject.status = status;
            $rootScope.changeStateObject.placeholder = $filter('translate')('Write_a_comment_why_do_you_change_vacancy_status');
            $scope.numberOfCandidatesInDifferentStates = function () {
                var totalCount = 0;
                Vacancy.getCounts({
                    vacancyId: vacancy.vacancyId
                },function(statusesCount){
                    console.log(statusesCount);
                    $scope.statusesCount = statusesCount.object;
                    angular.forEach($scope.VacancyStatusFiltered, function (val) {
                        val.count = 0;
                    });
                    angular.forEach($scope.statusesCount, function (item) {
                        //if (item.state == 'approved') {
                        //    //$scope.activeName = 'approved';
                        //    //$scope.paramForExcell.interviewState = 'approved';
                        //}
                        angular.forEach($scope.VacancyStatusFiltered, function (valS) {
                            if (valS.name) {
                                valS.value = valS.name;
                            }
                            if (item.item == valS.value) {
                                valS.count = item.count;
                                totalCount = totalCount + item.count;
                            }
                            if (item.item == valS.customInterviewStateId) {
                                valS.count = item.count;
                                totalCount = totalCount + item.count;
                            }
                        });
                    });
                    $scope.numberAllCandidateInVacancy = totalCount;
                });
            };
            if (status == 'completed') {
                $scope.numberOfCandidatesInDifferentStates();
                setTimeout(function () {
                    var hasApproved = false;
                    angular.forEach($scope.statusesCount, function (i) {
                        if (i.item == "approved") {
                            hasApproved = true;
                        }
                    });
                    if (!hasApproved) {
                        notificationService.error($filter('translate')('You must move one of the candidates to status Approved'));
                    } else {
                        $scope.modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: '../partials/modal/vacancy-change-status.html',
                            size: '',
                            resolve: function(){

                            }
                        });
                    }
                }, 500);
            } else {
                if (status != 'inwork') {
                    $scope.modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '../partials/modal/vacancy-change-status.html',
                        size: '',
                        resolve: function(){

                        }
                    });
                } else if (status == 'inwork' && (vacancy.responsiblesPerson != undefined && vacancy.responsiblesPerson.length > 0)) {
                    $scope.modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '../partials/modal/vacancy-change-status.html',
                        size: '',
                        resolve: function(){

                        }
                    });
                } else if ($scope.needAutoSetResponsible && vacancy.status == 'inwork') {
                    $rootScope.changeResponsibleInVacancy.id = $rootScope.me.userId;
                    $rootScope.changeResponsibleInVacancy.comment = 'Поскольку вы являетесь единственным пользователем Вашей компании, мы назначили Вас ответственным';
                    $rootScope.saveResponsibleUserInVacancy();
                    $scope.modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '../partials/modal/vacancy-change-status.html',
                        size: '',
                        resolve: function(){

                        }
                    });
                } else if (status == 'inwork' && !$scope.needAutoSetResponsible) {
                    notificationService.error($filter('translate')('You must set a responsible') + '!');
                }
            }
        };
        $rootScope.saveVacancyStatus = function () {
            if (!$rootScope.clickedSaveVacancyStatus) {
                $rootScope.clickedSaveVacancyStatus = true;
                // console.log("DELETE IN VACANCY");
                $rootScope.closeModal();
                Vacancy.changeState({
                    vacancyId: $scope.oneVacancy.vacancyId,
                    comment: $rootScope.changeStateObject.comment,
                    vacancyState: $rootScope.changeStateObject.status
                }, function (resp) {
                    if (resp.status == "ok") {
                        $scope.vacancy.status = $rootScope.changeStateObject.status;
                        $rootScope.changeStateObject.comment = "";
                        //$rootScope.changeStateObject.status = null;
                        notificationService.success($filter('translate')('vacancy change status'));
                        $scope.tableParams.reload();
                    } else if (resp.message) {
                        notificationService.error(resp.message);
                    }
                    $rootScope.clickedSaveVacancyStatus = false;
                }, function (err) {
                    $rootScope.clickedSaveVacancyStatus = false;
                    //notificationService.error($filter('translate')('service temporarily unvailable'));
                });
            }
        };


    }
}]);