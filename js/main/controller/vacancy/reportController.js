controller.controller('vacancyReportController', ["$rootScope", "$scope", "FileInit", "Vacancy", "Service", "$location", "Client",
    "$routeParams", "notificationService", "$filter", "$translate", 'Person', "Statistic", "vacancyStages", "Company",
    function($rootScope, $scope, FileInit, Vacancy, Service, $location, Client, $routeParams, notificationService, $filter,
             $translate, Person, Statistic, vacancyStages, Company) {

        $scope.statistics = {type: 'default', user: {}};
        $scope.funnelActionUsersList = [];

        /* -- funnel general algorithm
            1. - parseCustomStagesNames  --- transform custom stages id`s to valid custom names
            2. - validateStages --- add non-existing required vacancy stages, and removing refusals
            3. - funnelConfig    --- parsing data from request format to zingchart data format, calculating ABS and REL conversion
            4. - drawFunnel      --- drawing funnel
        */

        $scope.setStatistics = function(type = 'default', user = {}) {
            $scope.statistics = {type, user};
            if(type === 'default') return;

            setUserActionsFunnel(user);
        };

        $scope.addUserInFunnelActionUsersList = function(userIndex) {
            let isMissing = true,
                actionUser = $scope.actionUsers[userIndex] || null;

            console.log($scope.funnelActionUsersList.length);
            if($scope.funnelActionUsersList.length >= 5) {
                notificationService.error($filter('translate')('You select up to 5 users'));
                return;
            }

            $scope.funnelActionUsersList.forEach(user => {
                if(angular.equals(user,actionUser)) isMissing = false;
            });

            if(isMissing && actionUser) {
                $scope.funnelActionUsersList.push(actionUser);
                updateMainFunnel(actionUser);
            }
        };

        $scope.removeUserInFunnelActionUsersList = function(user) {
            $scope.funnelActionUsersList.splice($scope.funnelActionUsersList.indexOf(user),1);

            updateMainFunnel(user);
            clearUserActionsFunnelCache(user);

            if($scope.statistics.user === user) {
                $scope.statistics = {type: 'default', user: {}};
            }
        };

        $scope.updateData = function() {
            var dateFrom = $('#dateFrom').datetimepicker('getDate') != null ? $('#dateFrom').datetimepicker('getDate') : null;
            var dateTo = $('#dateTo').datetimepicker('getDate') != null ? $('#dateTo').datetimepicker('getDate') : null;
            dateFrom.setHours(0, 0, 0, 0);
            dateTo.setHours(0, 0, 0, 0);
            dateTo.setDate(dateTo.getDate() + 1);

            Statistic.getVacancyDetailInfo({"vacancyId": $scope.vacancy.vacancyId, "from": dateFrom, "to": dateTo, withCandidatesHistory: true})
                .then(vacancyInterviewDetalInfo => {
                    $scope.detailInterviewInfo = vacancyInterviewDetalInfo;

                    $scope.vacancyFunnelMap = validateStages(parseCustomStagesNames($scope.detailInterviewInfo, $scope.notDeclinedStages, $scope.declinedStages));
                    drawFunnel({config:setFunnelData($scope.vacancyFunnelMap, '600px', '100%'), id:"myChartDiv", assignObj:null});

                    $scope.statistics = {type : 'default', user: {}};
                    $scope.$apply();

                    zingchart.exec('myChartDiv', 'reload');
                }, error => notificationService.error(error.message));
        };

        $scope.downloadPDF = function(){
            $scope.downloadPDFisPressed = !$scope.downloadPDFisPressed;

            let dateFrom = $('#dateFrom').datetimepicker('getDate')  ? $('#dateFrom').datetimepicker('getDate') : null,
                dateTo   = $('#dateTo').datetimepicker('getDate')  ? $('#dateTo').datetimepicker('getDate') : null;
            dateFrom.setHours(0, 0, 0, 0);
            dateTo.setHours(0, 0, 0, 0);
            dateTo.setDate(dateTo.getDate() + 1);

            Statistic.getVacancyDetailInfo({ "vacancyId": $scope.vacancy.vacancyId, "from": dateFrom, "to": dateTo, withCandidatesHistory: true})
                .then(resp => {
                    pdfId = resp.object;
                    $('#downloadPDF')[0].href = '/hr/' + 'getapp?id=' + pdfId;
                    $('#downloadPDF')[0].click();
                    $scope.downloadPDFisPressed = false;
                }, error => notificationService.error(error.message));
        };


        function setUserActionsFunnel(user) {
            if(getUserActionsFunnelCache(user)) {
                drawFunnel({...getUserActionsFunnelCache(user)});
                return;
            }

            return Statistic.getVacancyDetailInfo({ "vacancyId": $scope.vacancy.vacancyId, withCandidatesHistory: true, personId: user.userId})
                .then(usersActionValues => {

                    let userFunnelMap = validateStages(parseCustomStagesNames(usersActionValues, $scope.notDeclinedStages, $scope.declinedStages));

                    const userActionsFunnelData = {
                        userSeries: setFunnelData(userFunnelMap).series,
                        userSeriesArray: setFunnelData(userFunnelMap).candidateSeries,
                        candidateSeriesArray: setFunnelData($scope.vacancyFunnelMap).candidateSeries,
                        userSeriesToDisplay: function() {
                            return this.userSeriesArray.map((userSeries, index) => {
                                let percent = Math.round((userSeries / (this.candidateSeriesArray[index])) * 100) || 0;

                                return `${userSeries}(${this.candidateSeriesArray[index]})/${percent}%`;
                            });
                        },
                        username: user.name
                    },
                    finalFunnelObject = {config:setFunnelData(userFunnelMap), id:"myChartDiv2", assignObj:userActionsFunnelConfig(userActionsFunnelData), user:user};

                    drawFunnel(finalFunnelObject);
                    setUserActionsFunnelCache(finalFunnelObject);
                    $scope.statistics = {type: 'default', user: {}};
                    $scope.$apply();

                    return Promise.resolve(finalFunnelObject);
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
                    $scope.detailInterviewInfo = vacancyInterviewDetalInfo;
                    $scope.vacancyFunnelMap = validateStages(parseCustomStagesNames($scope.detailInterviewInfo, $scope.notDeclinedStages, $scope.declinedStages));
                    drawFunnel({config:setFunnelData($scope.vacancyFunnelMap, '600px', '1000px'), id:"myChartDiv",  assignObj:null});
                    $scope.$apply();
                }, error => notificationService.error(error.message));
        }

        function updateMainFunnel(user) {
            userActionsFunnelConfig.usersFunnelCache = userActionsFunnelConfig.usersFunnelCache || [];

            let graphset = zingchart.exec('myChartDiv', 'getdata').graphset,
                username = user.name.split(' ').join('<br>'),
                labelOffsetX = graphset[0].labels[graphset[0].labels.length - 1].static ? 85 + graphset[0].labels[graphset[0].labels.length - 1]['offset-x'] :
                                                                                     graphset[0].labels[graphset[0].labels.length - 1]['offset-x'] + 60,
                scaleYOffsetX = graphset[0]["scale-y-" + graphset[0].labels.length]['item']['static'] ? graphset[0]["scale-y-" + (graphset[0].labels.length)]['item']['offset-x'] + 80:
                                                                                                          graphset[0]["scale-y-" + (graphset[0].labels.length)]['item']['offset-x'] + 60;

            if(!getUserActionsFunnelCache(user)) {
                setUserActionsFunnel(user)
                    .then(resp => {
                        graphset[0].labels.push({
                            text: username,
                            fontWeight: "bold",
                            fontSize: 12,
                            offsetX: labelOffsetX,
                            offsetY: 0,
                            "background-color":"blue #29A2CC"
                        });
                        graphset[0]["scale-y-" + graphset[0].labels.length] = {"values": resp.config.candidateSeries, "item": {fontSize: 12,"offset-x": scaleYOffsetX}};

                        drawFunnel({config:setFunnelData($scope.vacancyFunnelMap, '600px', '100%'), id:"myChartDiv",  assignObj:graphset[0]});
                    }, error => console.error(error));
            } else {
                delete graphset[0]["scale-y-" + graphset[0].labels.length];
                graphset[0].labels.forEach((label, index) => {
                    if(label.text === username) graphset[0].labels.splice(index, 1);
                });

                drawFunnel({config:setFunnelData($scope.vacancyFunnelMap, '600px', '100%'), id:"myChartDiv",  assignObj:graphset[0]});
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

        function setFunnelData(funnelMap, funnelWidth = '750px', chartWidth = '1100px') {
            $scope.hasFunnelChart = true;
            let chartHeight = 30*(funnelMap.length + 1);
            let series = [],
                stages = [],
                candidateSeries = [],
                RelConversion = [],
                AbsConversion = [],
                values5 = [],
                lastCount = null;

            angular.forEach(funnelMap, function(stage) {
                series.push({
                    "values": [stage.value]
                });

                stages.push($filter('translate')(stage.key));
                candidateSeries.push(stage.value.toString());

                if (!lastCount) {
                    RelConversion.push('100%');
                    AbsConversion.push('100%');
                } else {
                    RelConversion.push((stage.value != 0 ? Math.round(stage.value / lastCount * 100) : 0) + '%');
                    AbsConversion.push((stage.value != 0 ? Math.round(stage.value / funnelMap[0].value * 100) : 0) + '%');
                }

                lastCount = stage.value;
            });

            return { chartHeight, series, stages, candidateSeries, RelConversion, AbsConversion, values5, funnelWidth, chartWidth }
        }

        function drawFunnel({config, id, assignObj}) {

            let myChart = {},
                chartHeight = config.chartHeight,
                series = config.series,
                values = config.stages,
                values2 = config.candidateSeries,
                values3 = config.RelConversion,
                values4 = config.AbsConversion,
                funnelWidth = config.funnelWidth,
                chartWidth = config.chartWidth;

            myChart = {
                "type": "funnel",
                "width": funnelWidth,
                "series": series,
                tooltip: {visible: true, shadow: 0},
                "scale-y": {"values": values, "item": {fontSize: 11, "offset-x": 75}},
                "scale-y-2": {"values": values2, "item": {fontSize: 12, "offset-x": -60}},
                "scale-y-3": {
                    "values": values3, "item": {fontSize: 12,"offset-x": 25}
                },
                "scale-y-4": {
                    "values": values4, "item": {fontSize: 12,"offset-x": 107, static: true}
                },
                plotarea: {
                    margin: '40px 0 0 0'
                },
                "scale-x": {"values": [""]},
                labels: [
                    {
                        text: $filter('translate')('Stages'),
                        fontWeight: "bold",
                        fontSize: 12,
                        offsetX: 20,
                        offsetY: 0
                    },
                    {
                        text: $filter('translate')('Candidates'),
                        fontWeight: "bold",
                        fontSize: 12,
                        offsetX: $translate.use() != 'en' ? 515 : 825,
                        offsetY: 0
                    },
                    {
                        text: $filter('translate')('Relative conversion'),
                        fontWeight: "bold",
                        fontSize: 12,
                        offsetX: $translate.use() != 'en' ?  595 : 905,
                        offsetY: 0
                    },                    {
                        text: $filter('translate')('Absolute conversion'),
                        fontWeight: "bold",
                        fontSize: 12,
                        offsetX: 690,
                        offsetY: 0,
                        static: true
                    }
                ],
                "backgroundColor": "#FFFFFF",
                "gui": {
                    "behaviors": [
                        {"id": "DownloadPDF", "enabled": "none"},
                        {"id": "Reload", "enabled": "none"},
                        {"id": "Print", "enabled": "none"},
                        {"id": "DownloadSVG", "enabled": "none"},
                        {"id": "LogScale", "enabled": "none"},
                        {"id": "About", "enabled": "none"},
                        {"id": "FullScreen", "enabled": "none"},
                        {"id": "BugReport", "enabled": "none"},
                        {"id": "ViewSource", "enabled": "none"},
                        {"id": "FullScreen", "enabled": "none"},
                        {
                            "id": "FullScreen", "enabled": "none"
                        }
                    ]
                }
            };

            if(assignObj) {
                Object.assign(myChart, assignObj);
            }

            zingchart.render({
                id: id,
                data: myChart,
                height: chartHeight,
                width: chartWidth,
                output: "html5"
            });
        }

        function getUserActionsFunnelCache(user) {
            return userActionsFunnelConfig.usersFunnelCache.filter(cache => {
                return cache.user.userId === user.userId;
            })[0];
        }

        function setUserActionsFunnelCache(cache) {
            if(!getUserActionsFunnelCache(cache.user)) {
                userActionsFunnelConfig.usersFunnelCache.push(cache);
            }
        }

        function clearUserActionsFunnelCache(user) {
            userActionsFunnelConfig.usersFunnelCache.forEach((cache, index) => {
                if(cache.user.userId === user.userId) {
                    userActionsFunnelConfig.usersFunnelCache.splice(index,1);
                }
            });
        }

        function userActionsFunnelConfig(userActionsFunnelData) {
            return {
                "series": userActionsFunnelData.userSeries,
                "scale-y-2": {"values": userActionsFunnelData.userSeriesToDisplay(), "item": {fontSize: 12,"offset-x": -85}},
                "labels": [
                    {
                        text: $filter('translate')('Relative conversion'),
                        fontWeight: "bold",
                        fontSize: 12,
                        offsetX: $translate.use() != 'en' ?  745 : 765,
                        offsetY: 0
                    },
                    {
                        text: $filter('translate')('Absolute conversion'),
                        fontWeight: "bold",
                        fontSize: 12,
                        offsetX: $translate.use() != 'en' ?  845 : 840,
                        offsetY: 0
                    },
                    {
                        text: $filter('translate')('Candidates'),
                        fontWeight: "bold",
                        fontSize: 12,
                        offsetX: $translate.use() != 'en' ? 660 : 670,
                        offsetY: 0
                    },
                    {
                        text: $filter('translate')('Stages'),
                        fontWeight: "bold",
                        fontSize: 12,
                        offsetX: 20,
                        offsetY: 0
                    }
                ]
            };
        }

        function getActionUsers(vacancyId) {
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
                startDate: $scope.vacancy.dc != undefined ? new Date($scope.vacancy.dc) : new Date(),
                weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                language: $translate.use()
            });

            $("#dateFrom").datetimepicker("setDate", new Date($scope.vacancy.dc));

            $("#dateTo").datetimepicker({
                format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy" : "mm/dd/yyyy",
                startView: 2,
                minView: 2,
                autoclose: true,
                endDate: new Date(),
                weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                language: $translate.use()
            });

            let d = new Date();
            d.setHours(0, 0, 0, 0);
            $("#dateTo").datetimepicker("setDate", d);
        }

        function getVacancyStages(response) {
            $scope.customStages = response.object.interviewStates;
        }

        function getVacancy(response) {
            $scope.vacancy = response;
        }

        function Main() {
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
                getActionUsers(vacancy.object.vacancyId);
                setDateTimePickers(vacancy.object);
                setStages();
                initMainFunnel();
            }, error => notificationService.error(error.message));
        }

        Main();
}]);
