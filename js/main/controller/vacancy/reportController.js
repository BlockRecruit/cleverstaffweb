controller.controller('vacancyReportController', ["$rootScope", "$scope", "FileInit", "Vacancy", "Service", "$location", "Client",
    "$routeParams", "notificationService", "$filter", "$translate", 'Person', "Statistic", "vacancyStages", "Company",
    function($rootScope, $scope, FileInit, Vacancy, Service, $location, Client, $routeParams, notificationService, $filter,
             $translate, Person, Statistic, vacancyStages, Company) {
        var chartHeight = 0;
        $scope.statisticsType = 'default';
        $scope.lang = $translate;
        $scope.funnelActionUsersList = [];
        vacancyStages.get(function(resp){
            $scope.customStages = resp.object.interviewStates;
        });

        Vacancy.one({"localId": $routeParams.id}, function(resp) {
            $scope.vacancy = resp.object;

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

            var d = new Date();
            d.setHours(0, 0, 0, 0);
            $("#dateTo").datetimepicker("setDate", d);

            let stagesString = [];

            if($scope.vacancy && $scope.vacancy['interviewStatus']) {
                stagesString = $scope.vacancy['interviewStatus'].split(',');
            } else {
                stagesString = ['longlist','shortlist','interview','approved','notafit','declinedoffer','no_response'];
            }

            $scope.notDeclinedStages = stagesString.slice(stagesString[0], stagesString.indexOf('approved') + 1);
            $scope.declinedStages = stagesString.slice(stagesString.indexOf('approved') + 1, stagesString.length);

            getActionUsers();
            Statistic.getVacancyDetailInfo({ "vacancyId": $scope.vacancy.vacancyId, withCandidatesHistory: true})
                .then(vacancyInterviewDetalInfo => {
                    $scope.detailInterviewInfo = vacancyInterviewDetalInfo;

                    let stages = validatedStages($scope.detailInterviewInfo, $scope.notDeclinedStages, $scope.declinedStages);

                    $scope.vacancyFunnelMap = initSalesFunnel(stages.allStages, stages.notDeclinedStages, stages.declinedStages);
                    drawFunnel($scope.vacancyFunnelMap, funnelConfig($scope.vacancyFunnelMap), "myChartDiv",  null, null, null);
                    $scope.$apply();
                }, error => notificationService.error(error.message));
        });

        /*
            1. - validateStages  --- transform custom stages names like 1erg234erfwf43 to valid custom names
            2. - initSalesFunnel --- add non-existing required vacancy stages, and removing refusals
            3. - funnelConfig    --- parsing data from request format to zingchart data format, calculating ABS and REL conversion
            4. - drawFunnel      --- drawing funnel
        */

        function validatedStages(allStages, notDeclinedStages, declinedStages) {
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

        function initSalesFunnel(stages, notDeclinedStages, declinedStages) {

            let funnelMap = [];
            $scope.hasFunnelChart = false;

            if (stages) {
                angular.forEach(stages, (stage,index) => {
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

        function funnelConfig(funnelMap) {
            $scope.hasFunnelChart = true;
            chartHeight = 30*(funnelMap.length + 1);
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

            return { chartHeight, series, stages, candidateSeries, RelConversion, AbsConversion, values5 }
        }

        function drawFunnel(funnelMap, config, id, assignObj) {

            let myChart = {},
                chartHeight = config.chartHeight,
                series = config.series,
                values = config.stages,
                values2 = config.candidateSeries,
                values3 = config.RelConversion,
                values4 = config.AbsConversion;

            myChart = {
                "type": "funnel",
                "width":'900px',
                "series": series,
                tooltip: {visible: true, shadow: 0},
                "scale-y": {"values": values, "item": {fontSize: 11, "offset-x": 75}},
                "scale-y-2": {"values": values2, "item": {fontSize: 12, "offset-x": -60}},
                "scale-y-3": {
                    "values": values3, "item": {fontSize: 12,"offset-x": 25}
                },
                "scale-y-4": {
                    "values": values4, "item": {fontSize: 12,"offset-x": 107}
                },
                plotarea: {
                    margin: '40px 0 0 20%'
                },
                "scale-x": {"values": [""]},
                labels: [
                    {
                    text: $filter('translate')('Relative conversion'),
                    fontWeight: "bold",
                    fontSize: 12,
                    // offsetX: $translate.use() != 'en' ?  775 : 785,
                    offsetX: $translate.use() != 'en' ?  895 : 905,
                    offsetY: 0
                    },
                    {
                        text: $filter('translate')('Absolute conversion'),
                        fontWeight: "bold",
                        fontSize: 12,
                        // offsetX: 870,
                        offsetX: 990,
                        offsetY: 0
                    },
                    {
                        text: $filter('translate')('Candidates'),
                        fontWeight: "bold",
                        fontSize: 12,
                        // offsetX: $translate.use() != 'en' ? 700 : 710,
                        offsetX: $translate.use() != 'en' ? 815 : 825,
                        offsetY: 0
                    },
                    {
                        text: $filter('translate')('status'),
                        fontWeight: "bold",
                        fontSize: 12,
                        offsetX: 210,
                        offsetY: 0
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
                width: 1290,
                output: "html5"
            });
        }

        $scope.setStatisticsType = function(type = 'default', user) {
            $scope.statisticsType = type;
            if(type === 'default') return;

            setActionUserFunnel(user);
        };

        $scope.pushUserInFunnelActionUsersList = function(user) {
            if(user.selected) {
                $scope.funnelActionUsersList.push(user);
            } else {
                $scope.funnelActionUsersList.splice($scope.funnelActionUsersList.indexOf(user));
            }
        };

        $scope.updateData = function() {
            var dateFrom = $('#dateFrom').datetimepicker('getDate') != null ? $('#dateFrom').datetimepicker('getDate') : null;
            var dateTo = $('#dateTo').datetimepicker('getDate') != null ? $('#dateTo').datetimepicker('getDate') : null;
            dateFrom.setHours(0, 0, 0, 0);
            dateTo.setHours(0, 0, 0, 0);
            dateTo.setDate(dateTo.getDate() + 1);
            Statistic.getVacancyInterviewDetalInfo(
                {
                    "vacancyId": $scope.vacancy.vacancyId,
                    "from": dateFrom,
                    "to": dateTo,
                    withCandidatesHistory: true
                }, function(detailResp) {
                    if (detailResp != undefined) {
                        var vacancyInterviewDetalInfo = [];
                        angular.forEach(detailResp.vacancyInterviewDetalInfo, function(value, key){
                            vacancyInterviewDetalInfo.push({
                                key: key,
                                value: value
                            });
                        });
                        $scope.detailInterviewInfo = vacancyInterviewDetalInfo;
                        angular.forEach($scope.detailInterviewInfo, function(value){
                            angular.forEach($scope.customStages, function(resp){
                                if(value.key == resp.customInterviewStateId){
                                    value.key = resp.name;
                                }
                            })
                        });
                    }
                });

            let stages = validatedStages($scope.detailInterviewInfo, $scope.notDeclinedStages, $scope.declinedStages);
            $scope.vacancyFunnelMap = initSalesFunnel(stages.allStages, stages.notDeclinedStages, stages.declinedStages);
            drawFunnel($scope.vacancyFunnelMap, funnelConfig($scope.vacancyFunnelMap), "myChartDiv", null);

            $scope.statisticsType = 'default';

            zingchart.exec('myChartDiv', 'reload');
        };

        $scope.dawnloadPDF = function(){
            $scope.downloadPDFisPressed = !$scope.downloadPDFisPressed;
            var dateFrom = $('#dateFrom').datetimepicker('getDate') != null ? $('#dateFrom').datetimepicker('getDate') : null;
            var dateTo = $('#dateTo').datetimepicker('getDate') != null ? $('#dateTo').datetimepicker('getDate') : null;
            dateFrom.setHours(0, 0, 0, 0);
            dateTo.setHours(0, 0, 0, 0);
            dateTo.setDate(dateTo.getDate() + 1);
            Statistic.getVacancyDetailInfo({
                "vacancyId": $scope.vacancy.vacancyId,
                "from": dateFrom,
                "to": dateTo,
                withCandidatesHistory: true
            }).then(resp => {
                pdfId = resp.object;
                $('#downloadPDF')[0].href = '/hr/' + 'getapp?id=' + pdfId;
                $('#downloadPDF')[0].click();
                $scope.downloadPDFisPressed = false;
            }, error => notificationService.error(error.message));
        };

        Vacancy.all(Vacancy.searchOptions(), function(response) {
            $rootScope.objectSize = response['objects'] != undefined ? response['total'] : 0;
        });
        $scope.getCompanyParams = function(){
            Company.getParams(function(resp){
                $scope.companyParams = resp.object;
                $rootScope.publicLink = $location.$$protocol + "://" + $location.$$host + "/i#/" + $scope.companyParams.nameAlias + "-vacancies";
            });
        };
        $scope.getCompanyParams();


        function setActionUserFunnel(user) {
            Statistic.getVacancyDetailInfo({ "vacancyId": $scope.vacancy.vacancyId, withCandidatesHistory: true, userId: user.userId})
                .then(actionUserValues => {

                    let stages = validatedStages(actionUserValues, $scope.notDeclinedStages, $scope.declinedStages);

                    $scope.userFunnelMap = initSalesFunnel(stages.allStages, stages.notDeclinedStages, stages.declinedStages);

                    const actionUserFunnelData = {
                        candidateSeriesToDisplay: funnelConfig($scope.vacancyFunnelMap).candidateSeries,
                        userSeries: funnelConfig($scope.userFunnelMap).series,
                        userSeriesToDisplay: funnelConfig($scope.userFunnelMap).candidateSeries,
                        username: user.name
                    };

                    drawFunnel($scope.userFunnelMap, funnelConfig($scope.userFunnelMap), "myChartDiv2", ActionUserFunnelConfig(actionUserFunnelData));
                }, error => notificationService.error(error.message));
        }

        function ActionUserFunnelConfig(actionUserFunnelData) {
            return {
                "series": actionUserFunnelData.userSeries,
                "scale-y-2": {"values": actionUserFunnelData.candidateSeriesToDisplay, "item": {fontSize: 12, "offset-x": -60}},
                "scale-y-5": {"values": actionUserFunnelData.userSeriesToDisplay, "item": {fontSize: 12,"offset-x": 190}},
                labels: [
                    {
                        text: $filter('translate')(actionUserFunnelData.username),
                        fontWeight: "bold",
                        fontSize: 12,
                        // offsetX: $translate.use() != 'en' ?  775 : 785,
                        offsetX: $translate.use() != 'en' ?  1070 : 1065,
                        offsetY: 0
                    },
                    {
                        text: $filter('translate')('Relative conversion'),
                        fontWeight: "bold",
                        fontSize: 12,
                        // offsetX: $translate.use() != 'en' ?  775 : 785,
                        offsetX: $translate.use() != 'en' ?  895 : 905,
                        offsetY: 0
                    },
                    {
                        text: $filter('translate')('Absolute conversion'),
                        fontWeight: "bold",
                        fontSize: 12,
                        // offsetX: 870,
                        offsetX: 990,
                        offsetY: 0
                    },
                    {
                        text: $filter('translate')('Candidates'),
                        fontWeight: "bold",
                        fontSize: 12,
                        // offsetX: $translate.use() != 'en' ? 700 : 710,
                        offsetX: $translate.use() != 'en' ? 815 : 825,
                        offsetY: 0
                    },
                    {
                        text: $filter('translate')('status'),
                        fontWeight: "bold",
                        fontSize: 12,
                        offsetX: 210,
                        offsetY: 0
                    }
                ]
            };
        }

        function getActionUsers() {
            Person.getFilteredPersons(
                {
                    vacancyId: $scope.vacancy.vacancyId,
                    types:["interview_add", "interview_add_from_advice", "interview_edit", "interview_remove"]
                }).then(resp => {
                    $scope.actionUsers = resp.object;
                }, error => notificationService.error(error.message));
        }
}]);
