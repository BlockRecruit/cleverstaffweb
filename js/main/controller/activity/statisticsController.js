controller.controller('ActivityStatisticsController', ["$scope", "$rootScope", "Service", "Statistic", "Person", "$translate", "ngTableParams", "$filter", "frontMode", "Company", "notificationService", function($scope, $rootScope, Service, Statistic, Person, $translate, ngTableParams, $filter, frontMode, Company, notificationService) {
    $scope.countRowShow = false;
    $scope.selectedDate = null;
    $scope.selectedDateTo = null;
    $scope.selectedDateFrom = null;
    $scope.candWithoutContacts = false;
    $rootScope.loading = true;
    $scope.a = {};
    $scope.a.searchNumber = 1;
    $scope.statisticParam = {
        page: 0,
        count: 0
    };
    var statWithCandCont = ['actionCount', 'clientCount', 'candidateCount', 'vacancyCount', 'vacancyCompletedCount', 'interviewCount', 'vacancyCreatorStat', 'vacancyResponsibleCompletedStat', 'candidateCreatorStat', 'toInterviewPersonStat', 'vacancyResponsibleCompletedTimeStat'];

    var statWithoutCandCont = ['actionCount', 'clientCount', 'candidateCount', 'vacancyCount', 'vacancyCompletedCount', 'interviewCount', 'vacancyCreatorStat', 'vacancyResponsibleCompletedStat', 'candidateCreatorStat', 'toInterviewPersonStat', 'vacancyResponsibleCompletedTimeStat', 'addedCandidatesWithoutNameOrContacts'];
    var withoutContactsLoaded = false;
    $(".dateOptionsYearMonthWeek").datetimepicker({
        format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd MM yyyy" : "MM dd yyyy",
        showMeridian: true,
        autoclose: true,
        todayBtn: false,
        weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
        minView: 2,
        startView: 2,
        language: $translate.use()
    }).on('changeDate',
        function(dateTex) {
            // $scope.loading = true;
            if (dateTex.date != undefined) {
                $scope.activeSearchName = "week";
                $(".dateOptionsYearMonthWeek").datetimepicker('hide');
                $scope.selectedDate = dateTex.date;
                var day = $scope.selectedDate.getDate();
                var month = $scope.selectedDate.getMonth();
                var year = $scope.selectedDate.getFullYear();
                $scope.selectedDateTo = new Date(year, month, day + 7, 23, 59, 59);
                //$scope.selectedDateTo.setDate(parseInt($filter('date')($scope.selectedDate, 'dd')) + 7 - $scope.selectedDate.getDay());
                $scope.selectedDateFrom = new Date(year, month, day);
                //$scope.selectedDateFrom.setDate(parseInt($filter('date')($scope.selectedDate, 'dd')) - $scope.selectedDate.getDay() + 1);
                if ($filter('date')($scope.selectedDateFrom, 'MM') != $filter('date')($scope.selectedDateTo, 'MM')) {
                    $("#searchText").html($filter('date')($scope.selectedDateFrom, 'dd MMMM') + " - " + $filter('date')($scope.selectedDateTo, 'dd MMMM yyyy'));
                } else {
                    $("#searchText").html($filter('date')($scope.selectedDateFrom, 'dd') + " - " + $filter('date')($scope.selectedDateTo, 'dd MMMM yyyy'));
                }
                $scope.search();
            }
        }
    ).on('show', function() {
            $(".table-condensed").addClass("tr_hover");
        }).on('hide', function() {
            $(".table-condensed").removeClass("tr_hover");
        });
    $(".my_widget").datetimepicker({
        format: "mm-yyyy",
        minView: 3,
        startView: 3,
        weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
        language: $translate.use()
    }).on('changeDate',
        function(dateTex) {
            // $rootScope.loading = true;
            var selectedDate = dateTex.date;
            if (selectedDate != undefined) {
                $scope.activeSearchName = "month";
                $(".my_widget").datetimepicker('hide');
                var month = selectedDate.getMonth();
                var year = selectedDate.getFullYear();
                if (month !== null && year !== null) {
                    $scope.selectedDate = new Date(year, month, 1);
                    $scope.searchDate = null;
                    $scope.selectedDateFrom = new Date(year, month, 1);
                    $scope.selectedDateTo = new Date(year, parseInt(month) + 1, 0, 23, 59, 59);
                    $("#searchText").html($filter('date')($scope.selectedDateFrom, 'dd') + " - " + $filter('date')($scope.selectedDateTo, 'dd') + " " + $filter('date')($scope.selectedDateTo, 'MMMM yyyy'));
                    $scope.search();
                }

            }
        });
    $scope.changeToYear = function(val) {
        $scope.changeParOfSearch("year");
        // $scope.loading = true;
        $('.ui.dropdown').dropdown('hide');
        var year = val;
        if (year == '') {
            year = 2017;
        }
        if (year !== null) {
            $scope.selectedDateFrom = new Date(year, 0, 1);
            $scope.selectedDateTo = new Date(year, 12, 0, 23, 59, 59);
            $("#searchText").html($filter('date')($scope.selectedDateFrom, 'dd MMMM') + " - " + $filter('date')($scope.selectedDateTo, 'dd MMMM') + " " + $filter('date')($scope.selectedDateTo, 'yyyy'));
            $scope.search();
        }
    };
    $scope.changeParOfSearch = function(name) {
        if ($scope.activeSearchName !== name) {
            $scope.activeSearchName = name;
        }
        $('#dateOptionsYearMonthWeek').datetimepicker("setDate", null);
        $('#dateOptionsYearMonth').datetimepicker("setDate", null);
        switch (name) {
            case "week":
                $("#dateOptionsYearMonthWeek").datetimepicker("show");
                break;
            case "month":
                $('#my_widget').monthpicker('show');
                break;
            case "year":
                break;
            case "Forever":
                $("#searchText").html($filter('translate')("All time"));
                $scope.search();
                break;
        }
        $scope.selectedDateTo = null;
        $scope.selectedDateFrom = null;

    };
    $scope.years = [];
    var date = new Date();
    var year = 2014;
    function setYears(){
        if(year < new Date().getFullYear()){
            date.setFullYear(year, 1, 1);
            $scope.years.push(date.getFullYear());
            year += 1;
            setYears()
        }
    }
    setYears();

    $scope.years.push(new Date().getFullYear());

    $('.ui.dropdown').dropdown();
    $(".monthPicker").focus(function() {
        $("#ui-datepicker-div").position({
            my: "center top",
            at: "right bottom",
            of: $(this)
        });
    });

    function tableInit() {
        $scope.tableParams = new ngTableParams({page: 1, count: 15}, {
            total: 14,
            getData: function($defer, params) {
                // $rootScope.loading = true;
                $scope.statisticParam.number = params.$params.page - 1;
                $scope.statisticParam.count = params.$params.count - 1;
                $scope.statisticParam.page = {number: params.$params.page, count: params.$params.count};

                Person.getAllPersons($scope.statisticParam, function(resp) {
                    $scope.persons = [];
                    $scope.associativePerson = resp.object; // этот "!!
                    $scope.vacancyCreatorStatCount = 0;
                    $scope.vacancyResponsibleCompletedStatCount = 0;
                    $scope.vacancyResponsibleCompletedTimeStatSum = 0;
                    $scope.vacancyResponsibleCompletedTimeStatCount = 0;
                    $scope.candidateCreatorStatCount = 0;
                    $scope.vacancyCreatedInterviewCount = 0;
                    var iter = 0;
                    $scope.seriesVac = [];
                    $scope.seriesInt = [];
                    $scope.seriesRes = [];
                    $scope.seriesCan = [];
                    $scope.sortType = 'firstName';
                    $scope.sortReverse = true;
                    angular.forEach($scope.associativePerson, function(val, key) {
                        iter++;
                        var person = $scope.associativePerson[key];
                        var check = false;
                        if($scope.stat && (person.userId !== undefined)){
                            angular.forEach($scope.stat.vacancyCreatorStat, function(val) {
                                if (val.person.userId === person.userId) {
                                    person.vacancyCreatorStat = val;
                                    check = true;
                                    $scope.vacancyCreatorStatCount += val.count;
                                    if (frontMode === 'demo') {
                                        var compl = angular.copy(val);
                                        compl.count = ((compl.count - 1) > 0) ? compl.count - 1 : "";
                                        person.vacancyResponsibleCompletedStat = compl;
                                        $scope.vacancyResponsibleCompletedStatCount = 7;
                                        var vactime = angular.copy(compl);
                                        vactime.count = vactime.count * 3600 * 147;
                                        person.vacancyResponsibleCompletedTimeStat = vactime;
                                        check = true;
                                        $scope.vacancyResponsibleCompletedTimeStatSum += vactime.count;
                                        if (vactime.count > 0) {
                                            $scope.vacancyResponsibleCompletedTimeStatCount++;
                                        }
                                    }
                                    $scope.seriesVac.push({text: person.firstName + " " + Math.round(val.count * 100 / $scope.stat.vacancyCount) + "%  (" + val.count + ")", values: [val.count]});
                                }
                            });
                            angular.forEach($scope.stat.toInterviewStateStat, function(val) {
                                if (val.person.userId === person.userId) {
                                    person.vacancyCreatedInterview = val;
                                    check = true;
                                    $scope.vacancyCreatedInterviewCount += val.count;
                                    $scope.seriesInt.push({text: person.firstName + " " + Math.round(val.count * 100 / $scope.stat.interviewCount) + "% (" + val.count + ")", values: [val.count]});
                                }
                            });
                            angular.forEach($scope.stat.vacancyResponsibleCompletedStat, function(val) {
                                if (val.person.userId === person.userId) {
                                    person.vacancyResponsibleCompletedStat = val;
                                    check = true;
                                    $scope.vacancyResponsibleCompletedStatCount += val.count;
                                    $scope.seriesRes.push({text: person.firstName + " " + Math.round(val.count * 100 / $scope.stat.vacancyCompletedCount) + "% (" + val.count + ")", values: [val.count]});
                                }
                            });
                            angular.forEach($scope.stat.vacancyResponsibleCompletedTimeStat, function(val) {
                                if (val.person.userId === person.userId) {
                                    person.vacancyResponsibleCompletedTimeStat = val;
                                    check = true;
                                    $scope.vacancyResponsibleCompletedTimeStatSum += val.count;
                                    $scope.vacancyResponsibleCompletedTimeStatCount++;
                                }
                            });
                            angular.forEach($scope.stat.candidateCreatorStat, function(val) {
                                if (val.person.userId === person.userId) {
                                    person.candidateCreatorStat = val;
                                    check = true;
                                    $scope.candidateCreatorStatCount += val.count;
                                    $scope.seriesCan.push({text: person.firstName + " " + Math.round(val.count * 100 / $scope.stat.candidateCount) + "% (" + val.count + ")", values: [val.count]});
                                }
                            });
                            angular.forEach($scope.stat.addedCandidatesWithoutNameOrContacts, function (val) {
                                if(val.person.userId === person.userId) {
                                    person.addedCandidatesWithoutNameOrContacts = val.count;
                                }
                            });
                            angular.forEach($scope.stat.percentOfAddedCandidatesWithoutNameOrContacts, function (val) {
                                if(val.person.userId === person.userId) {
                                    person.percentOfAddedCandidatesWithoutNameOrContacts = val.count + '%';
                                }
                            });
                            angular.forEach($scope.stat.vacancyResponsibleInWorkStat, function (val) {
                                if(val.person.userId === person.userId) {
                                    person.vacancyResponsibleInWorkStat = val.count;
                                }
                            });
                        }
                        if (check)
                            $scope.persons.push($scope.associativePerson[key]);
                    });
                    angular.forEach($scope.persons,function(person){
                        if(person.candidateCreatorStat && person.candidateCreatorStat.count){
                            person.candidateCreatorPercent= Math.round(person.candidateCreatorStat.count * 100 / $scope.candidateCreatorStatCount) + '%';
                        } else {
                            person.candidateCreatorStat = {};
                            person.candidateCreatorStat.count = 0;
                            person.candidateCreatorPercent = '0%';
                        }
                    });
                    angular.forEach($scope.persons,function(person){
                        if(person.vacancyCreatedInterview && person.vacancyCreatedInterview.count){
                            person.vacancyCreatedInterviewPercent= Math.round(person.vacancyCreatedInterview.count * 100 / $scope.vacancyCreatedInterviewCount) + '%';
                        }else {
                            person.vacancyCreatedInterview = {};
                            person.vacancyCreatedInterview.count = 0;
                            person.vacancyCreatedInterviewPercent = '0%';
                        }
                    });
                    angular.forEach($scope.persons,function(person){
                        if(person.vacancyCreatorStat && person.vacancyCreatorStat.count){
                            person.vacancyCreatorStatPercent= Math.round(person.vacancyCreatorStat.count * 100 / $scope.vacancyCreatorStatCount) + '%';
                        }else {
                            person.vacancyCreatorStat = {};
                            person.vacancyCreatorStat.count = 0;
                            person.vacancyCreatorStatPercent = '0%';
                        }
                    });
                    angular.forEach($scope.persons,function(person){
                        if(person.vacancyResponsibleCompletedStat && person.vacancyResponsibleCompletedStat.count){
                            person.vacancyResponsibleCompletedStatPercent= Math.round(person.vacancyResponsibleCompletedStat.count * 100 / $scope.vacancyResponsibleCompletedStatCount) + '%';
                        }else {
                            person.vacancyResponsibleCompletedStat = {};
                            person.vacancyResponsibleCompletedStat.count = 0;
                            person.vacancyResponsibleCompletedStatPercent = '0%';
                        }
                    });
/*******************************************************************hide navigation bar********************/

                    var data = $filter('orderBy')($scope.persons, params.orderBy());
                    $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    $scope.tableParams.$params.total = $scope.persons.length;
                    params.total($scope.persons.length);
                    $rootScope.objectSize = $scope.persons.length;
                    $scope.paginationParams = {
                        currentPage: $scope.statisticParam.page.number,
                        totalCount: $rootScope.objectSize
                    };
                    $defer.resolve($filter('orderBy')(angular.copy($scope.persons), params.orderBy()));
                    $scope.countRowShow = true;
                    $scope.a.searchNumber = $scope.tableParams.page();
                });
            }
        });
    }
    tableInit();
    $scope.pageInfo = function(stat, isReloadTable) {
        $scope.stat = stat;
        function getName(person) {
            if (person === undefined) {
                return 'Нет';
            }
            return person.cutFullName;
        }
        $scope.tableParams.reload();
    };

    var getStatFirstTime = function () {
        $scope.selectedDateTo = new Date();
        $scope.selectedDateTo.setHours(23, 59, 59, 0);
        $scope.selectedDateTo = Date.parse($scope.selectedDateTo);
        Statistic.getOrgInfoWithParams({
            from: $rootScope.me.org.dc,
            to: $scope.selectedDateTo,
            personId: $rootScope.onlyMe ? $rootScope.userId : null,
            types: $scope.candWithoutContacts ? statWithoutCandCont : statWithCandCont
        }, function(resp) {
            $rootScope.loading = false;
            $scope.pageInfo(resp, true);

        });
    };
    getStatFirstTime();

    $scope.search = function() {
        if ($scope.activeSearchName === 'Forever') {
            $scope.selectedDateTo = new Date();
            $scope.selectedDateTo.setHours(23, 59, 59, 0);
            $scope.selectedDateTo = Date.parse($scope.selectedDateTo);
            $rootScope.loading = true;
            $scope.selectedDate = null;
            Statistic.getOrgInfoWithParams({
                from: $rootScope.me.org.dc,
                to: $scope.selectedDateTo,
                personId: $rootScope.onlyMe ? $rootScope.userId : null,
                types: $scope.candWithoutContacts ? statWithoutCandCont : statWithCandCont
            }, function(resp) {
                $rootScope.loading = false;
                $scope.pageInfo(resp, true);
                $scope.tableParams.reload();
            });
        } else if ($scope.selectedDateFrom !== null && $scope.selectedDateTo !== null) {
            $rootScope.loading = true;
            Statistic.getOrgInfoWithParams({
                personId: $rootScope.onlyMe ? $rootScope.userId : null,
                types: $scope.candWithoutContacts ? statWithoutCandCont : statWithCandCont,
                "from": $scope.selectedDateFrom.getTime(),
                "to": $scope.selectedDateTo.getTime()
            }, function(resp) {
                $scope.pageInfo(resp, true);
                $rootScope.loading = false;
            });
        } else {
            $rootScope.loading = true;
            Statistic.getOrgInfoWithParams({
                from: $rootScope.me.org.dc,
                to: $scope.selectedDateTo,
                personId: $rootScope.onlyMe ? $rootScope.userId : null,
                types: $scope.candWithoutContacts ? statWithoutCandCont : statWithCandCont
            }, function(resp) {
                $rootScope.loading = false;
                $scope.candWithoutContacts = 'loaded';
                withoutContactsLoaded = true;
                $scope.pageInfo(resp, true);

            });
        }
    };
    listenerForScopeLight($scope, $rootScope);

    $scope.candidatesWithoutContacts = function () {

        if(!$scope.candWithoutContacts) {
            if(!withoutContactsLoaded) {
                $scope.candWithoutContacts = true;
                $scope.search();
            } else {
                $scope.candWithoutContacts = 'loaded';
            }
        } else {
            $scope.candWithoutContacts = false;
        }
    };
    $scope.callbackAddLogo = function(photo) {
        $rootScope.companyLogo = photo;
        $rootScope.logoLink = $scope.serverAddress + "/getapp?id=" + $rootScope.companyLogo + "&d=true";
    };

    $scope.callbackErr = function(err) {
        notificationService.error(err);
    };
    $scope.getFirstLetters = function(str){
        return firstLetters(str)
    };
    
}]);
