controller.controller('vacancyReportController', ["$rootScope", "$scope", "FileInit", "Vacancy", "Service", "$location", "Client",
    "$routeParams", "notificationService", "$filter", "$translate", 'Person', "Statistic", "vacancyStages", "Company",
    function($rootScope, $scope, FileInit, Vacancy, Service, $location, Client, $routeParams, notificationService, $filter,
             $translate, Person, Statistic, vacancyStages, Company) {

        $scope.statistics = {type: 'default', user: {}};
        $scope.funnelActionUsersList = [];
        $scope.vacancyGeneralHistory = [];
        userFunnelConfig.usersFunnelCache = userFunnelConfig.usersFunnelCache || [];

        const activeFunnelLabelsLength = 4; // amount of funnel columns with data

        /* -- funnel general algorithm
            1. - parseCustomStagesNames  --- transform custom stages id`s to valid custom names
            2. - validateStages --- add non-existing required vacancy stages, and removing refusals
            3. - funnelConfig    --- parsing data from request format to zingchart data format, calculating ABS and REL conversion
            4. - drawFunnel      --- drawing funnel
        */

        $scope.setStatistics = function(type = 'default', user = {}) {
            $scope.statistics = {type, user};
            if(type === 'default') {
                $scope.vacancyHistory = $scope.vacancyGeneralHistory;
                return;
            }

            setUserFunnel(user);
        };

        $scope.addUserInFunnelUsersList = function(userIndex) {
            let isMissing = true,
                actionUser = $scope.actionUsers[userIndex] || null;

            if($scope.funnelActionUsersList.length >= 4) {
                notificationService.error($filter('translate')('You select up to 4 users'));
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

        $scope.removeUserInFunnelUsersList = function(user) {
            $scope.funnelActionUsersList.splice($scope.funnelActionUsersList.indexOf(user),1);

            updateMainFunnel(user);
            clearUserActionsFunnelCache(user);

            if($scope.statistics.user === user) {
                $scope.statistics = {type: 'default', user: {}};
            }
        };

        $scope.updateData = function() {
            const dateFrom = $('#dateFrom').datetimepicker('getDate') ? $('#dateFrom').datetimepicker('getDate') : null,
                  dateTo = $('#dateTo').datetimepicker('getDate') ? $('#dateTo').datetimepicker('getDate') : null;

            dateFrom.setHours(0, 0, 0, 0);
            dateTo.setHours(0, 0, 0, 0);
            dateTo.setDate(dateTo.getDate() + 1);

            Statistic.getVacancyDetailInfo({"vacancyId": $scope.vacancy.vacancyId, "from": dateFrom, "to": dateTo, withCandidatesHistory: true})
                .then(vacancyInterviewDetalInfo => {
                    $scope.vacancyHistory = vacancyInterviewDetalInfo;
                    $scope.vacancyFunnelMap = validateStages(parseCustomStagesNames($scope.vacancyHistory, $scope.notDeclinedStages, $scope.declinedStages));
                    updateUsers();
                    drawFunnel({config:setFunnelData($scope.vacancyFunnelMap, '600px', '1000px'), id:"myChartDiv"});
                    $scope.statistics = {type : 'default', user: {}};
                    $scope.$apply();
                }, error => notificationService.error(error.message));
        };

        $scope.downloadPDF = function(){
            $scope.downloadPDFisPressed = !$scope.downloadPDFisPressed;

            let dateFrom = $('#dateFrom').datetimepicker('getDate')  ? $('#dateFrom').datetimepicker('getDate') : null,
                dateTo   = $('#dateTo').datetimepicker('getDate')  ? $('#dateTo').datetimepicker('getDate') : null;
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

        function updateUsers() {
            $scope.funnelActionUsersList.forEach(user => {
                updateMainFunnel(user); // if user exist - removes it`s column to funnel
                clearUserActionsFunnelCache(user); // removing user from cache
                updateMainFunnel(user);// if user is not existing - adding it column to funnel
            });
        }

        function setUserFunnel(user) {
            if(getUserActionsFunnelCache(user)) {
                drawFunnel({...getUserActionsFunnelCache(user)});
                $scope.vacancyHistory = getUserActionsFunnelCache(user).usersActionData;
                return;
            }

            return Statistic.getVacancyDetailInfo({ "vacancyId": $scope.vacancy.vacancyId, withCandidatesHistory: true, personId: user.userId})
                .then(usersActionData => {

                    const userFunnelMap = validateStages(parseCustomStagesNames(usersActionData, $scope.notDeclinedStages, $scope.declinedStages)),
                        userActionsFunnelData = {
                        userSeries: setFunnelData(userFunnelMap).series,
                        userSeriesArray: setFunnelData(userFunnelMap).candidateSeries,
                        candidateSeriesArray: setFunnelData($scope.vacancyFunnelMap).candidateSeries,
                        userSeriesToDisplay: function() {
                            return this.userSeriesArray.map((userSeries, index) => {
                                return `${userSeries}(${this.candidateSeriesArray[index]})`;
                            });
                        },
                        userPercentToDisplay : function() {
                            return this.userSeriesArray.map((userSeries, index) => {
                                return String(Math.round((userSeries / (this.candidateSeriesArray[index])) * 100) || 0);
                            });
                        },
                        RelConversion: setFunnelData(userFunnelMap).RelConversion,
                        AbsConversion: setFunnelData(userFunnelMap).AbsConversion,
                        username: user.name,
                    },
                    finalFunnelObject = {config:setFunnelData(userFunnelMap), id:"myChartDiv2", assignObj:userFunnelConfig(userActionsFunnelData), usersActionData:usersActionData, user:user};


                    drawFunnel(finalFunnelObject);
                    setUserFunnelCache(finalFunnelObject);
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
                    $scope.vacancyHistory = vacancyInterviewDetalInfo;
                    $scope.vacancyGeneralHistory = vacancyInterviewDetalInfo;
                    $scope.vacancyFunnelMap = validateStages(parseCustomStagesNames(vacancyInterviewDetalInfo, $scope.notDeclinedStages, $scope.declinedStages));
                    drawFunnel({config:setFunnelData($scope.vacancyFunnelMap, '600px', '1000px'), id:"myChartDiv"});
                    $scope.$apply();
                }, error => notificationService.error(error.message));
        }

        function updateMainFunnel(user) {
            const graphset = zingchart.exec('myChartDiv', 'getdata').graphset[0],
                username = user.name.split(' ').join('<br>'),
                labelOffset = 85,
                scaleOffset = 85;

            if(!getUserActionsFunnelCache(user)) {
                setUserFunnel(user)
                    .then(resp => {
                        const columnToAdd = addUserColumn({username, scaleOffset, labelOffset, candidateSeries: resp.config.candidateSeries});
                        drawFunnel({config:setFunnelData($scope.vacancyFunnelMap, '600px', '100%'), id:"myChartDiv",  assignObj:columnToAdd});
                        checkForTotalCandidatesColumn({scaleOffset, labelOffset})
                    }, error => console.error(error));
            } else {
                const columnToRemove = removeUserColumn({username, scaleOffset, labelOffset});
                drawFunnel({config:setFunnelData($scope.vacancyFunnelMap, '600px', '100%'), id:"myChartDiv",  assignObj:columnToRemove});
            }
        }

        function addUserColumn({username, scaleOffset, labelOffset, candidateSeries}) {
            let graphset = zingchart.exec('myChartDiv', 'getdata').graphset[0];

            // const scaleX = graphset["scale-y-" + (graphset.labels.length)]['item'].static ? graphset["scale-y-" + (graphset.labels.length)]['item']['offset-x'] + 135 :
            //                graphset["scale-y-" + (graphset.labels.length)]['item']['offset-x'] + scaleOffset,
                  let labelX = graphset.labels[graphset.labels.length - 1].static ? graphset.labels[graphset.labels.length - 1]['offset-x'] + 125 :
                           graphset.labels[graphset.labels.length - 1]['offset-x'] + labelOffset;
            let scaleX = -13131313;
            graphset.labels.push({
                text: username,
                fontWeight: "bold",
                fontSize: 12,
                offsetX: labelX,
                offsetY: 48,
                "border-width":1,
                "border-color":"lightgray",
                "border-radius":"5px",
                "height":"100%",
                "vertical-align":"top",
                "padding":"10%",
                "width":"80px"
            });
            graphset["scale-y-" + graphset.labels.length] = {"values": candidateSeries, "item": {fontSize: 12,"offset-x": scaleX},
                     "guide":{
                         "lineWidth":"1px",
                         "line-gap-size":"5000px",
                         "lineSegmentSize":"450px"
                     }};

            return graphset;
        }

        function removeUserColumn({username, scaleOffset, labelOffset}) {
            let graphset = zingchart.exec('myChartDiv', 'getdata').graphset[0];

            let removedColumnIndex;
            graphset.labels.forEach((label, index) => {
                if(label.text === username) {
                    removedColumnIndex = index;
                    delete graphset["scale-y-" + (index + 1)];
                    graphset.labels.splice(index, 1);
                }
            });

            for(let i = removedColumnIndex; i < graphset.labels.length; i++) {
                graphset["scale-y-" + (i + 1)] = graphset["scale-y-" + (i + 2)];
                graphset["scale-y-" + (i + 2)] = graphset["scale-y-" + (i + 3)];
            }

            for(let i = removedColumnIndex; i < graphset.labels.length; i++) {
                graphset["scale-y-" + (i + 1)]['item']['offset-x'] -= scaleOffset;
                graphset.labels[i]['offset-x'] -= labelOffset;
            }

            return graphset;
        }

        function checkForTotalCandidatesColumn({scaleOffset, labelOffset}) {
                let graphset = zingchart.exec('myChartDiv', 'getdata').graphset[0];

            const labelX = graphset.labels[graphset.labels.length - 1]['offset-x'] + labelOffset,
                scaleX = graphset["scale-y-" + graphset.labels.length]['item']['offset-x'] + scaleOffset;


            if($scope.funnelActionUsersList.length === 1) {
                graphset.labels.push({
                    text: $filter('translate')('Total in vacancy'),
                    fontWeight: "bold",
                    fontSize: 12,
                    offsetX: labelX,
                    offsetY: 48,
                    "border-width":1,
                    "border-color":"lightgray",
                    "border-radius":"5px",
                    "height":"100%",
                    "vertical-align":"top",
                    "padding":"10%",
                    "width":"80px"
                });
                graphset["scale-y-" + graphset.labels.length + 1] = {"values": graphset['scale-y-2']['values'], "item": {fontSize: 12,"offset-x": scaleX},
                    "guide":{
                        "lineWidth":"1px",
                        "line-gap-size":"5000px",
                        "lineSegmentSize":"450px"
                    }};
                drawFunnel({config:setFunnelData($scope.vacancyFunnelMap, '600px', '100%'), id:"myChartDiv",  assignObj:graphset});
            } else {
                graphset["scale-y-" + graphset.labels.length]['item']['offset-x'] += scaleOffset;
                graphset.labels[graphset.labels.length - 1]['offset-x'] += labelOffset;
                drawFunnel({config:setFunnelData($scope.vacancyFunnelMap, '600px', '100%'), id:"myChartDiv",  assignObj:graphset});
            }
            console.log(graphset);
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

        function setFunnelData(funnelMap, funnelWidth = '750px', chartWidth = '1300px') {
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

                if (!lastCount && lastCount !== 0) {
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

        function drawFunnel({config, id, assignObj = {}}) {

            let myChart = {},
                chartHeight = config.chartHeight,
                series = config.series,
                values = config.stages,
                values2 = config.candidateSeries,
                values3 = config.RelConversion,
                values4 = config.AbsConversion,
                funnelWidth = config.funnelWidth,
                chartWidth = config.chartWidth;

            const guide = {
                "guide":{
                        "lineWidth":"1px",
                        "line-gap-size":"5000px",
                        "lineSegmentSize":"450px"
                }
            };
            myChart = {
                "type": "funnel",
                "width": funnelWidth,
                "series": series,
                tooltip: {visible: true, shadow: 0},
                "scale-y": {"values": values, "item": {fontSize: 11, "offset-x": 50}, "guide":guide.guide},
                "scale-y-2": {"values": values2, "item": {fontSize: 12, "offset-x": 5}, "guide":guide.guide},
                "scale-y-3": {"values": values3, "item": {fontSize: 12,"offset-x": 95}, "guide":guide.guide},
                "scale-y-4": {"values": values4, "item": {fontSize: 12,"offset-x": 190, static: true}, "guide":guide.guide},
                "scale-y-5": {"values": [],"item": {fontSize: 12,"offset-x": 190, static: true}, "guide":guide.guide},
                plotarea: { margin: '100px 0 0 100px' },
                "scale-x": {"values": [""]},
                labels: [
                    {
                        text: $filter('translate')('Stages'),
                        fontWeight: "bold",
                        fontSize: 12,
                        offsetX: 100,
                        offsetY: 55
                    },
                    {
                        text:$filter('translate')('Conversion for vacancy'),
                        fontSize: 14,
                        color:"#707070",
                        offsetX: $translate.use() != 'en' ? 570 : 825,
                        offsetY: 0,
                        "border-width":1,
                        "border-color":"lightgray",
                        "border-radius":"5px",
                        "height":"100%",
                        "vertical-align":"top",
                        "padding":"20px 48px",
                    },
                    {
                        text: $filter('translate')('Candidates'),
                        fontWeight: "bold",
                        fontSize: 12,
                        offsetX: $translate.use() != 'en' ? 560 : 825,
                        offsetY: 50,
                        "border-top":"1px solid lightgray",
                        "border-color":"lightgray",
                        "padding":"7px 207px 0 12px",
                        "margin":"0 0 0 10px"
                    },
                    {
                        text: $filter('translate')('Relative conversion'),
                        fontWeight: "bold",
                        fontSize: 12,
                        offsetX: $translate.use() != 'en' ?  665 : 905,
                        offsetY: 55
                    },                    {
                        text: $filter('translate')('Absolute conversion'),
                        fontWeight: "bold",
                        fontSize: 12,
                        offsetX: 770,
                        offsetY: 55,
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

            zingchart.render({
                id: id,
                data: Object.assign(myChart, assignObj),
                height: chartHeight,
                width: chartWidth,
                output: "html5"
            });
        }

        function getUserActionsFunnelCache(user) {
            return userFunnelConfig.usersFunnelCache.filter(cache => {
                return cache.user.userId === user.userId;
            })[0];
        }

        function setUserFunnelCache(cache) {
            if(!getUserActionsFunnelCache(cache.user)) {
                userFunnelConfig.usersFunnelCache.push(cache);
            }
        }

        function clearUserActionsFunnelCache(user) {
            userFunnelConfig.usersFunnelCache.forEach((cache, index) => {
                if(cache.user.userId === user.userId) {
                    userFunnelConfig.usersFunnelCache.splice(index,1);
                }
            });
        }

        function userFunnelConfig(userActionsFunnelData) {
            const guide = {
                "guide":{
                    "lineWidth":"1px",
                    "line-gap-size":"5000px",
                    "lineSegmentSize":"450px"
                }
            };
            return {
                "series": userActionsFunnelData.userSeries,
                "scale-y-2": {"values": userActionsFunnelData.userSeriesToDisplay(), "item": {fontSize: 12,"offset-x": -55}, "guide":guide.guide},
                "scale-y-3": {"values": userActionsFunnelData.userPercentToDisplay(), "item": {fontSize: 12,"offset-x": 5},"guide":guide.guide},
                "scale-y-4": {"values": userActionsFunnelData.RelConversion, "item": {fontSize: 12,"offset-x": 65},"guide":guide.guide},
                "scale-y-5": {"values": userActionsFunnelData.AbsConversion, "item": {fontSize: 12,"offset-x": 147},"guide":guide.guide},
                plotarea: {
                    margin: '60px 0 0 100px'
                },
                "labels": [
                    {
                        text: $filter('translate')('Conversion'),
                        fontWeight: "bold",
                        fontSize: 12,
                        offsetX: $translate.use() != 'en' ?  845 : 765,
                        offsetY: 0
                    },
                    {
                        text: $filter('translate')('Relative'),
                        fontWeight: "bold",
                        fontSize: 12,
                        offsetX: $translate.use() != 'en' ?  795 : 765,
                        offsetY: 20
                    },
                    {
                        text: $filter('translate')('Absolute'),
                        fontWeight: "bold",
                        fontSize: 12,
                        offsetX: $translate.use() != 'en' ?  895 : 840,
                        offsetY: 20
                    },
                    {
                        text: $filter('translate')('Candidates'),
                        fontWeight: "bold",
                        fontSize: 12,
                        offsetX: $translate.use() != 'en' ? 700 : 670,
                        offsetY: 0
                    },
                    {
                        text: $filter('translate')('Amount_2'),
                        fontWeight: "bold",
                        fontSize: 12,
                        offsetX: $translate.use() != 'en' ? 680 : 670,
                        offsetY: 20
                    },
                    {
                        text: '%',
                        fontWeight: "bold",
                        fontSize: 12,
                        offsetX: $translate.use() != 'en' ? 760 : 670,
                        offsetY: 20
                    },
                    {
                        text: $filter('translate')('Stages'),
                        fontWeight: "bold",
                        fontSize: 12,
                        offsetX: 110,
                        offsetY: 0
                    }
                ]
            };
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
                setDateTimePickers(vacancy.object);
                setStages();
                initMainFunnel();
            }, error => notificationService.error(error.message));
        }

        Init();
}]);
