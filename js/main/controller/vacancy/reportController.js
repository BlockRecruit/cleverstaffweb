controller.controller('vacancyReportController', ["$rootScope", "$scope", "FileInit", "Vacancy", "Service", "$location", "Client",
    "$routeParams", "notificationService", "$filter", "$translate", 'Person', "Statistic", "vacancyStages", "Company",
    function($rootScope, $scope, FileInit, Vacancy, Service, $location, Client, $routeParams, notificationService, $filter,
             $translate, Person, Statistic, vacancyStages, Company) {
        var chartHeight = 0;
        $scope.lang = $translate;
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
                endDate: $scope.vacancy.dateFinish != undefined ? new Date($scope.vacancy.dateFinish) : new Date(),
                weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                language: $translate.use()
            });

            if ($scope.vacancy.dateFinish != undefined) {
                $("#dateTo").datetimepicker("setDate", new Date($scope.vacancy.dateFinish));
            } else {
                var d = new Date();
                d.setHours(0, 0, 0, 0);
                $("#dateTo").datetimepicker("setDate", d);
            }

            let stagesString = [];

            if($scope.vacancy && $scope.vacancy['interviewStatus']) {
                stagesString = $scope.vacancy['interviewStatus'].split(',');
            } else {
                stagesString = ['longlist','shortlist','interview','approved','notafit','declinedoffer','no_response'];
            }

            $scope.notDeclinedStages = stagesString.slice(stagesString[0], stagesString.indexOf('approved') + 1);
            $scope.declinedStages = stagesString.slice(stagesString.indexOf('approved') + 1, stagesString.length);


            Statistic.getVacancyInterviewDetalInfo(
                {
                    "vacancyId": $scope.vacancy.vacancyId,
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

                    angular.forEach($scope.customStages, function(resp){
                        angular.forEach($scope.detailInterviewInfo, function(value){
                            if(value.key === resp.customInterviewStateId){
                                value.key = resp.name;
                            }
                        });

                        angular.forEach($scope.declinedStages, function(value, index){
                            if(value === resp.customInterviewStateId){
                                $scope.declinedStages[index] = resp.name;
                            }
                        });

                        angular.forEach($scope.notDeclinedStages, function(value, index){
                            if(value === resp.customInterviewStateId){
                                $scope.notDeclinedStages[index] = resp.name;
                            }
                        });
                    });
                }
                initSalesFunnel(null, null);
            });
        });

        function initSalesFunnel(dateFrom, dateTo) {
            $scope.funnelMap = [];
            $scope.hasFunnelChart = false;

            if ($scope.detailInterviewInfo) {
                angular.forEach($scope.detailInterviewInfo, (stage,index) => {
                    $scope.funnelMap[index] = { key: stage.key, value: stage.value.length };

                    angular.forEach($scope.declinedStages, (declinedStage) => {
                        if(declinedStage === stage.key) {
                            $scope.funnelMap.splice(index,1);
                        }
                    });

                });

                angular.forEach($scope.notDeclinedStages, (notDeclinedStage) => {
                    let missingStage = true;

                    angular.forEach($scope.funnelMap, (stage,index) => {
                        // console.log($scope.funnelMap[index].key, notDeclinedStage);
                        if(missingStage) {
                            // console.log($scope.funnelMap[index].key, notDeclinedStage);
                            if($scope.funnelMap[index].key === notDeclinedStage) {
                                console.log('exist',notDeclinedStage);
                                missingStage = false;
                            } else {
                                missingStage = true;
                            }

                            if(index === $scope.funnelMap.length - 1 && missingStage) {
                                console.log("not-exist",notDeclinedStage);
                                $scope.funnelMap[index+1] = { key: notDeclinedStage, value: 0 };
                            }

                        }
                    });
                    console.log('-------------------');
                });


                if(!$scope.funnelMap[0]) {
                    return;
                }
            }
            // $scope.funnelMap.map((item) => {
            //     console.log(item);
            // });
            console.log($scope.funnelMap);

            var myChart = {};
            if ($scope.detailInterviewInfo) {
                $scope.hasFunnelChart = true;
                chartHeight = 30*($scope.funnelMap.length + 1);
                var series = [];
                var values = [];
                var values2 = [];
                var values3 = [];
                var values4 = [];
                var lastCount = null;

                angular.forEach($scope.funnelMap, function(stage) {
                    console.log(stage.value,stage.key);
                    series.push({
                        "values": [stage.value]
                    });
                    values.push($filter('translate')(stage.key));
                    values2.push(stage.value.toString());
                    if (lastCount == null) {
                        values3.push('100%');
                    } else {
                        values3.push((stage.value != 0 ? Math.round(stage.value / lastCount * 100) : 0) + '%');
                    }
                    if(lastCount == null) {
                        values4.push('100%');
                    } else{
                        values4.push((stage.value != 0 ? Math.round(stage.value / $scope.funnelMap[0].value * 100) : 0) + '%');
                    }
                    lastCount = stage.value;
                });

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
                    "plot": {
                        // "offset-x": '60px'
                    },
                    plotarea: {
                        margin: '40px 0 0 20%'
                    },
                    "scale-x": {"values": [""]},
                    labels: [{
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
            } else {
                chartHeight = 350;
                myChart = {
                    "type": "funnel",
                    "width":'410px',
                    "series": [
                        {
                            "values": [$scope.funnelMap['longlist']]
                        }, {
                            "values": [$scope.funnelMap['shortlist']]
                        }, {
                            "values": [$scope.funnelMap['interview']]
                        }, {
                            "values": [$scope.funnelMap['approved']]
                        }
                    ],
                    "tooltip": {
                        "visible": true
                    },
                    "scale-y": {
                        "values": [$filter('translate')('long_list'),
                            $filter('translate')('short_list'),
                            $filter('translate')('interview'),
                            $filter('translate')('approved')],
                        "item": {
                            fontSize: 12,
                            "offset-x": 35
                        }
                    },
                    "scale-y-2": {
                        "values": [$scope.funnelMap['longlist'] + '',
                            $scope.funnelMap['shortlist'] + '',
                            $scope.funnelMap['interview'] + '',
                            $scope.funnelMap['approved'] + ''],
                        "item": {
                            fontSize: 12,
                            "offset-x": 0
                        }
                    },
                    "scale-y-3": {
                        "values": ['100%',
                            Math.round($scope.funnelMap['shortlist'] / $scope.funnelMap['longlist'] * 100) + '%',
                            ($scope.funnelMap['shortlist'] != 0 ? Math.round($scope.funnelMap['interview'] / $scope.funnelMap['shortlist'] * 100) : 0) + '%',
                            ($scope.funnelMap['interview'] != 0 ? Math.round($scope.funnelMap['approved'] / $scope.funnelMap['interview'] * 100) : 0) + '%'],
                        "item": {
                            fontSize: 12,
                            "offset-x": -10
                        }
                    },
                    "scale-y-4": {
                        "values": ['100%',
                            Math.round($scope.funnelMap['shortlist'] / $scope.funnelMap['longlist'] * 100) + '%',
                            ($scope.funnelMap['interview'] != 0 ? Math.round($scope.funnelMap['interview'] / $scope.funnelMap['longlist'] * 100) : 0) + '%',
                            ($scope.funnelMap['approved'] != 0 ? Math.round($scope.funnelMap['approved'] / $scope.funnelMap['longlist'] * 100) : 0) + '%'],
                        "item": {
                            fontSize: 12,
                            "offset-x": 115
                        }
                    },
                    "scale-x": {
                        "values": [""]
                    },
                    labels: [
                        {
                            text: $filter('translate')('Relative conversion'),
                            fontWeight: "bold",
                            fontSize: 12,
                            offsetX: 570,
                            offsetY: 20
                        },
                        {
                            text: $filter('translate')('Absolute conversion'),
                            fontWeight: "bold",
                            fontSize: 12,
                            offsetX: 570,
                            offsetY: 20
                        },
                        {
                            text: $filter('translate')('Count'),
                            fontWeight: "bold",
                            fontSize: 12,
                            offsetX: $translate.use() != 'en' ? 485 : 505,
                            offsetY: 20
                        },
                        {
                            text: $filter('translate')('status'),
                            fontWeight: "bold",
                            fontSize: 12,
                            offsetX: 80,
                            offsetY: 20
                        }
                    ],
                    "backgroundColor": "#FFFFFF",
                    "gui": {
                        "behaviors": [
                            {
                                "id": "DownloadPDF",
                                "enabled": "none"
                            }, {
                                "id": "Reload",
                                "enabled": "none"
                            }, {
                                "id": "Print",
                                "enabled": "none"
                            }, {
                                "id": "DownloadSVG",
                                "enabled": "none"
                            }, {
                                "id": "LogScale",
                                "enabled": "none"
                            }, {
                                "id": "About",
                                "enabled": "none"
                            }, {
                                "id": "FullScreen",
                                "enabled": "none"
                            }, {
                                "id": "BugReport",
                                "enabled": "none"
                            }, {
                                "id": "ViewSource",
                                "enabled": "none"
                            }, {
                                "id": "FullScreen",
                                "enabled": "none"
                            }, {
                                "id": "FullScreen",
                                "enabled": "none"
                            }
                        ]
                    }
                };
            }
            zingchart.render({
                id: "myChartDiv",
                data: myChart,
                height: chartHeight,
                width: 1290,
                output: "html5"
            });
        }

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
                        $scope.detailInterviewInfo =vacancyInterviewDetalInfo;
                        angular.forEach($scope.detailInterviewInfo, function(value){
                            angular.forEach($scope.customStages, function(resp){
                                if(value.key == resp.customInterviewStateId){
                                    value.key = resp.name;
                                }
                            })
                        });
                    }
                });
            initSalesFunnel(dateFrom, dateTo);

            zingchart.exec('myChartDiv', 'reload');
        };

        $scope.inDevelopmentMessage = function() {
            //notificationService.error('This is total bullshit');
            notificationService.error($filter('translate')('This function is in development, you can use it soon'));
        };
        $scope.dawnloadPDF = function(){
            $scope.downloadPDFisPressed = !$scope.downloadPDFisPressed;
            var dateFrom = $('#dateFrom').datetimepicker('getDate') != null ? $('#dateFrom').datetimepicker('getDate') : null;
            var dateTo = $('#dateTo').datetimepicker('getDate') != null ? $('#dateTo').datetimepicker('getDate') : null;
            dateFrom.setHours(0, 0, 0, 0);
            dateTo.setHours(0, 0, 0, 0);
            dateTo.setDate(dateTo.getDate() + 1);
            Statistic.getVacancyInterviewDetalInfoFile({
                "vacancyId": $scope.vacancy.vacancyId,
                "from": dateFrom,
                "to": dateTo,
                withCandidatesHistory: true
            },function(resp){
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
    }

]);



