controller.controller('vacancyReportController', ["$rootScope", "$scope", "FileInit", "Vacancy", "Service", "$location", "Client",
    "$routeParams", "notificationService", "$filter", "$translate", 'Person', "Statistic", "vacancyStages", "Company", "vacancyReport",
    function($rootScope, $scope, FileInit, Vacancy, Service, $location, Client, $routeParams, notificationService, $filter,
             $translate, Person, Statistic, vacancyStages, Company, vacancyReport) {


        $scope.statistics = {type: 'default', user: {}};
        $scope.funnelActionUsers = [];
        $scope.vacancyGeneralHistory = [];
        $scope.mainFunnel = {};
        $scope.usersColumn = {users: [], dataArray: []};

        setFunnelData.usersDataCache = setFunnelData.usersDataCache || [];

        $scope.setStatistics = function(type = 'default', user = {}) {
            $scope.statistics = {type, user};
            if(type === 'default') {
                vacancyReport.funnel('mainFunnel', $scope.mainFunnel.data.candidateSeries);
                $scope.vacancyHistory = $scope.vacancyGeneralHistory;
                return;
            }

            setUserFunnel(user);
        };

        $scope.addUserInFunnelUsersList = function(userIndex) {
            let isMissing = true,
                actionUser = $scope.actionUsers[userIndex] || null;

            if($scope.funnelActionUsers.length >= 4) {
                notificationService.error($filter('translate')('You select up to 4 users'));
                return;
            }

            $scope.funnelActionUsers.forEach(user => {
                if(angular.equals(user,actionUser)) isMissing = false;
            });

            if(isMissing && actionUser) {
                $scope.funnelActionUsers.push(actionUser);
                $scope.actionUsers.splice(userIndex, 1);
                updateMainFunnel(actionUser);
                vacancyReport.funnel('mainFunnel', $scope.mainFunnel.data.candidateSeries);
            }
        };

        $scope.removeUserInFunnelUsersList = function(user) {
            $scope.funnelActionUsers.splice($scope.funnelActionUsers.indexOf(user),1);
            $scope.actionUsers.push(user);

            updateMainFunnel(user);
            clearUserActionsFunnelCache({user});

            if($scope.statistics.user === user) {
                $scope.setStatistics('default');
            }
        };

        $scope.updateData = function() {
            const dateFrom = $('#dateFrom').datetimepicker('getDate') ? $('#dateFrom').datetimepicker('getDate') : null,
                  dateTo = $('#dateTo').datetimepicker('getDate') ? $('#dateTo').datetimepicker('getDate') : null;

            if(dateFrom && dateTo) {
                dateFrom.setHours(0, 0, 0, 0);
                dateTo.setHours(0, 0, 0, 0);
                dateTo.setDate(dateTo.getDate() + 1);
            }

            $rootScope.loading = true;
            Statistic.getVacancyDetailInfo({"vacancyId": $scope.vacancy.vacancyId, "from": dateFrom, "to": dateTo, withCandidatesHistory: true})
                .then(vacancyInterviewDetalInfo => {
                    $scope.vacancyHistory = vacancyInterviewDetalInfo;
                    $scope.vacancyFunnelMap = validateStages(parseCustomStagesNames($scope.vacancyHistory, $scope.notDeclinedStages, $scope.declinedStages));
                    $scope.mainFunnel.data = setFunnelData($scope.vacancyFunnelMap);
                    vacancyReport.funnel('mainFunnel', $scope.mainFunnel.data.candidateSeries);
                    $scope.setStatistics('default');
                    updateUsers();
                    $scope.$apply();
                }, error => notificationService.error(error.message));
        };

        $scope.downloadPDF = function(){
            $scope.downloadPDFisPressed = !$scope.downloadPDFisPressed;

            let dateFrom = $('#dateFrom').datetimepicker('getDate')  ? $('#dateFrom').datetimepicker('getDate') : null,
                dateTo   = $('#dateTo').datetimepicker('getDate')  ? $('#dateTo').datetimepicker('getDate') : null;

            if(dateTo && dateFrom) {
                dateFrom.setHours(0, 0, 0, 0);
                dateTo.setHours(0, 0, 0, 0);
                dateTo.setDate(dateTo.getDate() + 1);
            }

            $rootScope.loading = true;
            Statistic.getVacancyInterviewDetalInfoFile({
                "vacancyId": $scope.vacancy.vacancyId,
                "from": dateFrom,
                "to": dateTo,
                withCandidatesHistory: true
            },function(resp){
                $rootScope.loading = false;
                if(resp.status == 'ok'){
                    pdfId = resp.object;
                    $('#downloadPDF')[0].href = '/hr/' + 'getapp?id=' + pdfId;
                    $('#downloadPDF')[0].click();
                    $scope.downloadPDFisPressed = false;
                }else{
                    notificationService.error(resp.message);
                }
            });
        };

        function updateUsers() {
            $scope.funnelActionUsers.forEach(user => {
                updateMainFunnel(user); // if user exist - removes it`s column to funnel
                clearUserActionsFunnelCache({user}); // removing user from cache
                updateMainFunnel(user);// if user not exist - adding it column to funnel
            });
        }

        function setUserFunnel(user) {
            if(getUserActionsFunnelCache({user})) {
                vacancyReport.funnel('userFunnel', getUserActionsFunnelCache({user}).userFunnelData.userSeries());
                $scope.userFunnelData = getUserActionsFunnelCache({user}).userFunnelData;
                $scope.vacancyHistory = getUserActionsFunnelCache({user}).userHistory;
                return;
            }

            const dateFrom = $('#dateFrom').datetimepicker('getDate') ? $('#dateFrom').datetimepicker('getDate') : null,
                dateTo = $('#dateTo').datetimepicker('getDate') ? $('#dateTo').datetimepicker('getDate') : null;

            if(dateFrom && dateTo) {
                dateFrom.setHours(0, 0, 0, 0);
                dateTo.setHours(0, 0, 0, 0);
                dateTo.setDate(dateTo.getDate() + 1);
            }

            return Statistic.getVacancyDetailInfo({
                "vacancyId": $scope.vacancy.vacancyId,
                withCandidatesHistory: true,
                personId: user.userId,
                "from": dateFrom,
                "to": dateTo
                }).then(usersActionData => {
                    const userFunnelMap = validateStages(parseCustomStagesNames(usersActionData, $scope.notDeclinedStages, $scope.declinedStages));

                    let userFunnelData = {
                        userSeries: function() { return setFunnelData(userFunnelMap).candidateSeries.map(series => Number(series)); },
                        vacancySeries: setFunnelData($scope.vacancyFunnelMap).candidateSeries,
                        userPercentSeries : function() {
                            return this.userSeries().map((userSeries, index) => {
                                return String(Math.round((userSeries / (this.vacancySeries[index])) * 100) || 0);
                            });
                        },
                        relConversion: setFunnelData(userFunnelMap).RelConversion,
                        absConversion: setFunnelData(userFunnelMap).AbsConversion
                    };
                    setUserFunnelCache({userFunnelData, userHistory: usersActionData, user});

                    $scope.userFunnelData = getUserActionsFunnelCache({user}).userFunnelData;
                    vacancyReport.funnel('userFunnel', userFunnelData.userSeries());

                    $scope.setStatistics('default');
                    $scope.$apply();

                    return Promise.resolve({candidateSeries: setFunnelData(userFunnelMap).candidateSeries, user});
                }, error => notificationService.error(error.message));
        }

        function setStages() {
            let stagesString = [];

            if($scope.vacancy && $scope.vacancy['interviewStatus']) {
                stagesString = $scope.vacancy['interviewStatus'].split(',');
            } else {
                stagesString = ['longlist','shortlist','interview','approved','notafit','declinedoffer','no_response'];
            }

            $scope.notDeclinedStages = stagesString.slice(stagesString[0], stagesString.indexOf('approved') + 1);
            $scope.declinedStages = stagesString.slice(stagesString.indexOf('approved') + 1, stagesString.length);
        }

        function initMainFunnel() {
            Statistic.getVacancyDetailInfo({ "vacancyId": $scope.vacancy.vacancyId, withCandidatesHistory: true})
                .then(vacancyInterviewDetalInfo => {
                    $scope.vacancyHistory = vacancyInterviewDetalInfo;
                    $scope.vacancyGeneralHistory = vacancyInterviewDetalInfo;
                    $scope.vacancyFunnelMap = validateStages(parseCustomStagesNames(vacancyInterviewDetalInfo, $scope.notDeclinedStages, $scope.declinedStages));
                    $scope.mainFunnel.data = setFunnelData($scope.vacancyFunnelMap);
                    vacancyReport.funnel('mainFunnel', $scope.mainFunnel.data.candidateSeries);
                    $scope.$apply();
                }, error => notificationService.error(error.message));
        }

        function updateMainFunnel(user) {
            if(!getUserActionsFunnelCache({user})) {
                setUserFunnel(user)
                    .then(userData => {
                        $scope.usersColumn.users.push(userData.user);
                        $scope.usersColumn.dataArray.push(userData.candidateSeries);
                        $scope.$apply();
                        $rootScope.loading = false;
                    }, error => console.error(error));
            } else {
                const index = $scope.usersColumn.users.indexOf(user);
                $scope.usersColumn.users.splice(index,1);
                $scope.usersColumn.dataArray.splice(index, 1);
                $scope.vacancyHistory = $scope.vacancyGeneralHistory;
            }
        }

        function parseCustomStagesNames(allStages, notDeclinedStages, declinedStages) {
            angular.forEach($scope.customStages, function(resp){
                angular.forEach(allStages, function(value){
                    if(value.key === resp.customInterviewStateId) {
                        value.key = resp.name;
                    }
                });

                angular.forEach(declinedStages, function(value, index){
                    if(value === resp.customInterviewStateId){
                        declinedStages[index] = resp.name;
                    }
                });

                angular.forEach(notDeclinedStages, function(value, index){
                    if(value === resp.customInterviewStateId){
                        notDeclinedStages[index] = resp.name;
                    }
                });
            });

            return { allStages, declinedStages, notDeclinedStages }
        }

        function validateStages({allStages, notDeclinedStages, declinedStages}) {
            let funnelMap = [];
            $scope.hasFunnelChart = false;

            if (allStages) {
                angular.forEach(allStages, (stage,index) => {
                    funnelMap[index] = { key: stage.key, value: stage.value.length };

                    angular.forEach(declinedStages, (declinedStage) => {
                        if(declinedStage === stage.key) {
                            funnelMap.splice(index,1);
                            allStages.splice(index,1);
                        }
                    });
                });

                angular.forEach(notDeclinedStages, notDeclinedStage => {
                    let missingStage = true;

                    angular.forEach(funnelMap, (stage,index) => {
                        if(missingStage) {
                            missingStage = !(funnelMap[index].key === notDeclinedStage);

                            if(index === funnelMap.length - 1 && missingStage) {
                                funnelMap[index+1] = { key: notDeclinedStage, value: 0 };
                            }
                        }
                    });
                });
            }

            return funnelMap[0] ? funnelMap : null;
        }

        function setFunnelData(funnelMap, funnelWidth = '750px', chartWidth = '1300px') {
            $scope.hasFunnelChart = true;
            let stages = [],
                candidateSeries = [],
                RelConversion = [],
                AbsConversion = [],
                lastCount = null;

            angular.forEach(funnelMap, function(stage) {
                stages.push($filter('translate')(stage.key));
                candidateSeries.push(+(stage.value));

                if (!lastCount && lastCount !== 0) {
                    RelConversion.push('100%');
                    AbsConversion.push('100%');
                } else {
                    RelConversion.push((stage.value !== 0 ? Math.round(stage.value / lastCount * 100) : 0) + '%');
                    AbsConversion.push((stage.value !== 0 ? Math.round(stage.value / funnelMap[0].value * 100) : 0) + '%');
                }

                lastCount = stage.value;
            });

            return { stages, candidateSeries, RelConversion, AbsConversion }
        }

        function getUserActionsFunnelCache({user}) {
            return setFunnelData.usersDataCache.filter(cache => {
                return cache.user.userId === user.userId;
            })[0];
        }

        function setUserFunnelCache({userFunnelData, userHistory, user}) {
            if(!getUserActionsFunnelCache({user})) {
                setFunnelData.usersDataCache.push({userFunnelData, userHistory, user});
            }
        }

        function clearUserActionsFunnelCache({user}) {
            setFunnelData.usersDataCache.forEach((cache, index) => {
                if(cache.user.userId === user.userId) {
                    setFunnelData.usersDataCache.splice(index,1);
                }
            });
        }

        function getUsersForFunnel(vacancyId) {
            Person.getFilteredPersons({vacancyId: vacancyId, types:["interview_add", "interview_add_from_advice", "interview_edit", "interview_remove"]})
                .then(response => {
                    $scope.actionUsers = response.object;
                }, error => notificationService.error(error))
        }

        function getAllVacanciesAmount(response) {
            $rootScope.objectSize = response['objects'] ? response['total'] : 0;
        }

        function getCompanyParams(response){
            $scope.companyParams = response.object;
            $rootScope.publicLink = $location.$$protocol + "://" + $location.$$host + "/i#/" + $scope.companyParams.nameAlias + "-vacancies";
        }

        function setDateTimePickers() {
            $("#dateFrom").datetimepicker({
                format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy" : "mm/dd/yyyy",
                startView: 2,
                minView: 2,
                autoclose: true,
                startDate: $scope.vacancy.dc ? new Date($scope.vacancy.dc) : new Date(),
                endDate: new Date(),
                weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                language: $translate.use()
            }).on('changeDate', function (date) {
                if(date.date > $("#dateTo").datetimepicker("getDate")) {
                    let d = new Date();
                    d.setHours(0, 0, 0, 0);
                    $("#dateTo").datetimepicker("setDate", new Date(d.getFullYear(),d.getMonth(),d.getDate()));
                }
            });

            $("#dateTo").datetimepicker({
                format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy" : "mm/dd/yyyy",
                startView: 2,
                minView: 2,
                autoclose: true,
                startDate: $scope.vacancy.dc ? new Date($scope.vacancy.dc) : new Date(),
                endDate: new Date(),
                weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                language: $translate.use()
            }).on('changeDate', function (date) {
                if(date.date < $("#dateFrom").datetimepicker("getDate")) {
                    console.log('yep');
                    let d = new Date();
                    d.setHours(0, 0, 0, 0);
                    $("#dateFrom").datetimepicker("setDate", new Date($scope.vacancy.dc));
                }
            });

            let d = new Date();
            d.setHours(0, 0, 0, 0);
            $("#dateTo").datetimepicker("setDate", new Date(d.getFullYear(),d.getMonth(),d.getDate()));
            $("#dateFrom").datetimepicker("setDate", new Date($scope.vacancy.dc));
        }

        function getVacancyStages(response) {
            $scope.customStages = response.object.interviewStates;
        }

        function getVacancy(response) {
            $scope.vacancy = response;
        }

        function Init() {
            Promise.all([
                Vacancy.getAllVacanciesAmount(),
                Vacancy.getVacancy({localId: $routeParams.id}),
                vacancyStages.requestVacancyStages(),
                Company.params()
            ]).then(([vacanciesAmount, vacancy, vacancyStages, companyParams]) => {
                getAllVacanciesAmount(vacanciesAmount);
                getVacancyStages(vacancyStages);
                getCompanyParams(companyParams);
                getVacancy(vacancy.object);
                getUsersForFunnel(vacancy.object.vacancyId);
                setStages();
                setDateTimePickers();
                initMainFunnel();
            }, error => notificationService.error(error.message));
        }

        Init();

}]);
