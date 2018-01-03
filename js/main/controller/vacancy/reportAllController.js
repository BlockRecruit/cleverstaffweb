controller.controller('reportAllController', ["$rootScope", "$scope", "Vacancy", "Service", "$location",
    "$routeParams", "notificationService", "$filter", "$translate", "vacancyStages","Stat", "Company", "Person", "$uibModal",
    function($rootScope, $scope, Vacancy, Service, $location, $routeParams, notificationService, $filter,
             $translate, vacancyStages, Stat, Company, Person, $uibModal) {
        $rootScope.loading = true;
        $scope.regions = [];
        $scope.firstTimeLoading = 0;
        $scope.vacancysStatusesParam =[];
        $scope.inVacancysStatusesParam =[];
        $scope.emptyAccount = true;
        $scope.choosenPersons = [];
        $scope.leastChosen = false;
        $scope.customStagesActive =[];
        $scope.activeInVacancyStatuses = [];
        $scope.vacancyStatuses =[
            {
                value: "open",
                added: true,
                count: 0
            },
            {
                value: "expects",
                added: false,
                count: 0
            },
            {
                value: "inwork",
                added: true,
                count: 0
            },
            {
                value: "payment",
                added: true,
                count: 0
            },
            {
                value: "completed",
                added: true,
                count: 0
            },
            {
                value: "canceled",
                added: false,
                count: 0
            }
        ];
        $scope.inVacancyStatuses =[
            {
                value: "longlist",
                added: true,
                count: 0
            },
            {
                value: "shortlist",
                added: true,
                count: 0
            },
            {
                value: "test_task",
                added: true,
                count: 0
            },
            {
                value: "interview",
                added: true,
                count: 0
            },
            {
                value: "interview_with_the_boss",
                added: true,
                count: 0
            },
            {
                value: "security_check",
                added: true,
                count: 0
            },
            {
                value: "tech_screen",
                added: true,
                count: 0
            },
            {
                value: "hr_interview",
                added: true,
                count: 0
            },
            {
                value: "tech_interview",
                added: true,
                count: 0
            },
            {
                value: "interview_with_the_client",
                added: true,
                count: 0
            },
            {
                value: "sent_offer",
                added: true,
                count: 0
            },
            {
                value: "accept_offer",
                added: true,
                count: 0
            },
            {
                value: "approved",
                added: true,
                count: 0
            },
            {
                value: "notafit",
                added: true,
                count: 0
            },
            {
                value: "declinedoffer",
                added: true,
                count: 0
            },
            {
                value: "offer_declined",
                added: true,
                count: 0
            },
            {
                value: "no_response",
                added: true,
                count: 0
            },
            {
                value: "no_contacts",
                added: true,
                count: 0
            },
        ];

        function responseSetInView(data) {
            data.forEach(item => {
                if(item['request'] == 'stagesOrCount'){
                    angular.forEach(item.object, function(r){
                        angular.forEach($scope.inVacancyStatuses, function(res){
                            if (res.value == r.item){
                                res.count = r.count;
                            }
                        });
                        angular.forEach($scope.customStages, function(customS){
                            if (customS.customInterviewStateId == r.item){
                                customS.count = r.count;
                            }
                        });
                    });
                }else if(item['request'] == 'Statistic2') {
                    $scope.mainData = item.object['entryList'];

                    angular.forEach($scope.mainData, function (data) {
                        angular.forEach(data.info, function (res) {
                            // res.candidate.languages = Service.langTranslator(res.candidate.languages);
                            angular.forEach(item.object.persons, function (val) {
                                if (res.interview.creatorId == val.userId) {
                                    res.interview.creatorCutFullName = val.cutFullName;
                                }
                            });

                            $scope.regions = item.object.regions;
                            angular.forEach(item.object.regions, function (valRegion) {
                                if (res.candidate.regionId == valRegion.regionId) {
                                    res.candidate.regionfullName = valRegion.displayFullName;
                                }
                            });

                            angular.forEach($scope.customStagesFull.interviewStates, function (customStatus) {
                                if (res.action.stateOld == customStatus.customInterviewStateId || res.action.stateNew === customStatus.customInterviewStateId) {
                                    res.interview.state = customStatus.name;
                                }
                            });

                        });
                    });
                }
            });
        }

        $rootScope.closeModal = function(){
            $rootScope.modalInstance.close();
        };
        angular.forEach($scope.vacancyStatuses, function(resp){
            if(resp.added){
                $scope.vacancysStatusesParam.push(resp.value);
            }
        });
        angular.forEach($scope.inVacancyStatuses, function(resp){
            if(resp.added){
                $scope.inVacancysStatusesParam.push(resp.value);
            }
        });
        vacancyStages.get(function(resp){
            var array = [];
            $scope.customStages =resp.object.interviewStates;
            angular.forEach($scope.customStages, function(res){
                res.added = false;
                res.count = 0;
                if(res.status != "D"){
                    array.push(res);
                }
            });
            $scope.customStages = array;
            $scope.customStagesFull =resp.object.interviewStates;
            $scope.getVacancyStages();
        });

        Person.getAllPersons(function (resp) {
            $scope.associativePerson = resp.object;
            angular.forEach($scope.associativePerson, function(res){
                if(res.status != 'N'){
                    $scope.choosenPersons.push(res.userId)
                }
                res.added = true;
            });
        });
        $scope.regionIdToName = function (regionId) {
            var location = '';
            angular.forEach($scope.regions, function(regVal){
                if(regionId == regVal.regionId){
                    location = regVal.fullName;
                }
            });
            return location;
        };
        $scope.inHover = function () {
          $('.info-content').show();
        };
        $scope.outHover = function () {
          $('.info-content').hide();
        };
        $scope.updateReport = function(){
            Company.requestGetInfo({
                name:'firstDateVacancy'
            })
                .then(resp => {
                    $scope.emptyAccount = false;

                    if(!resp.object){
                        $scope.emptyAccount = true;
                        return;
                    }
                    if($scope.firstTimeLoading == 0){
                        if(!$scope.startVacancyDate){
                            $scope.startVacancyDate = resp.object;
                            $(".startDate").datetimepicker("setDate", new Date(angular.copy($scope.startVacancyDate)));
                        }

                        if(!$scope.endDate){
                            var today = new Date();
                            $scope.endDate = today.getTime();
                            $(".endDate").datetimepicker("setDate", new Date(angular.copy($scope.endDate)));
                        }
                    }else{
                        var selectDate = new Date(angular.copy($scope.endDate));
                        var nowDate = new Date();

                        if(selectDate.getFullYear() == nowDate.getFullYear() && selectDate.getMonth() == nowDate.getMonth() && selectDate.getDate() == nowDate.getDate()) {
                            var today = new Date();
                            $scope.endDate = today.getTime();
                        }

                        if(!$scope.startVacancyDate || !$scope.endDate){
                            notificationService.error($filter('translate')('Please fill in all date fields'));
                        }
                    }
                    return true;
                })
                .then(resp => {
                    if($scope.startVacancyDate && $scope.endDate){
                        $scope.firstTimeLoading = $scope.firstTimeLoading + 1;

                        return Stat.requestGetCountVacancyForActualVacancyStatistic({
                            "from":$scope.startVacancyDate,
                            "to":$scope.endDate,
                            "interviewCreatorIds": $scope.choosenPersons
                        })
                    }
                    return false;

                })
                .then(resp =>{
                    if(resp) {
                        var array = [];
                        $scope.totalVacancyStatusesCount = resp.object;

                        angular.forEach($scope.totalVacancyStatusesCount, function (r) {
                            angular.forEach($scope.vacancyStatuses, function (res) {
                                if (res.value == r.item) {
                                    res.count = r.count;
                                }
                            });
                        });

                        if ($scope.firstTimeLoading == 1) {
                            angular.forEach($scope.vacancyStatuses, function (res) {
                                if (res.count != 0 && (res.value != 'canceled' && res.value != 'expects')) {
                                    res.added = true;
                                    array.push(res.value);
                                } else {
                                    res.added = false
                                }
                            });

                            $scope.vacancysStatusesParam = array;

                            return Stat.requestGetCountInterviewForActualVacancyStatistic({
                                "from": $scope.startVacancyDate,
                                "to": $scope.endDate,
                                "vacancyStatuses": $scope.vacancysStatusesParam,
                                "interviewCreatorIds": $scope.choosenPersons
                            });
                        }
                    }
                    return false;
                })
                .then(resp =>{
                    if(resp) {
                        var arrayCustom = [];

                        angular.forEach(resp.object, function (r) {
                            angular.forEach($scope.inVacancyStatuses, function (res) {
                                if (res.value == r.item) {
                                    res.count = r.count;
                                }
                            });
                            angular.forEach($scope.customStages, function (customS) {
                                if (customS.customInterviewStateId == r.item) {
                                    customS.count = r.count;
                                }
                            });
                        });
                        angular.forEach($scope.inVacancyStatuses, function (res) {
                            if (res.count != 0) {
                                arrayCustom.push(res.value);
                                $scope.activeInVacancyStatuses.push(res);
                            } else {
                                res.added = false;
                            }
                        });
                        angular.forEach($scope.customStages, function (res) {
                            if (res.count != 0) {
                                arrayCustom.push(res.customInterviewStateId);
                                res.added = true;
                                $scope.customStagesActive.push(res);
                            } else {
                                res.added = false;
                            }
                        });
                        $scope.inVacancysStatusesParam = arrayCustom;
                    }
                    return true;

                })
                .then(resp => {
                    if($scope.firstTimeLoading != 1 && $scope.startVacancyDate && $scope.endDate){
                        Promise.all([
                            Stat.requestGetCountInterviewForActualVacancyStatistic({
                                "from":$scope.startVacancyDate,
                                "to":$scope.endDate,
                                "vacancyStatuses": $scope.vacancysStatusesParam,
                                "interviewCreatorIds": $scope.choosenPersons
                            }),
                            Stat.requestGetActualVacancyStatistic2({
                                "from":$scope.startVacancyDate,
                                "to":$scope.endDate,
                                "types":null,
                                "vacancyId":null,
                                "vacancyStatuses": $scope.vacancysStatusesParam,
                                "interviewStatuses":$scope.inVacancysStatusesParam,
                                "interviewCreatorIds": $scope.choosenPersons,
                                "vacancyFields": ["client","salary","location","status","dateFinish",
                                    "budget","candidatesAdded","candidatesApproved","daysInWork","responsibles","dc",
                                    "datePayment","employmentType","candidatesRefused","candidatesInWork"],
                                "withCandidates": true
                            }, false),
                        ])
                            .then(resp => {
                                responseSetInView(resp);
                                $rootScope.loading  = false;
                                $scope.$apply();
                            });
                    }else{
                        $rootScope.loading  = false;
                        $scope.$apply();
                    }
                });
        };
        $scope.updateReport();

        $(window).scroll(function () {
            var sticky = $('.report-first');
            var aboveElement = $('.payButtonOuter');
            var topPosition = aboveElement.position().top;
            var scroll = $(window).scrollTop();
            var topPosition = scroll - aboveElement.position().top;
                if (topPosition >= 50) {
                    sticky.addClass('fixed-header');
                } else {
                    sticky.removeClass('fixed-header');
                }
        });

        $scope.loadingExcel = false;
        $scope.downloadReport = function () {
            $rootScope.loading = true;

            if($scope.loadingExcel == false){
                $scope.loadingExcel = true;
                Stat.createVacancyStatisticExcel({
                    "from":$scope.startVacancyDate,
                    "to":$scope.endDate,
                    "types":null,
                    "vacancyId":null,
                    "vacancyStatuses": $scope.vacancysStatusesParam,
                    "interviewStatuses":$scope.inVacancysStatusesParam,
                    "interviewCreatorIds": $scope.choosenPersons,
                    "withCandidates": true,
                    "vacancyFields":[],
                }, function (resp) {
                    if (resp.status == 'ok') {
                        var sr = $rootScope.frontMode == "war" ? "/hr/" : "/hrdemo/";
                        $('#downloadReport')[0].href = sr + 'getapp?id=' + resp.object;
                        $('#downloadReport')[0].click();
                    }
                    $scope.loadingExcel = false;
                    $rootScope.loading = false;
                });
            }
        };
        $scope.getPersonFullName = function (id) {
            var fullName = '';
            angular.forEach($scope.associativePerson, function (resp) {
                if(resp.userId == id) {
                    fullName = resp.cutFullName;
                }
            });
            return fullName;
        };

        $scope.changeVacancyStatuses = function(status){
            if($scope.vacancysStatusesParam.length > 1){
                if(status.added){
                    status.added = false;
                    var array =[];
                    angular.forEach($scope.vacancyStatuses, function(resp){
                        if(resp.added){
                            array.push(resp.value);
                        }
                    });
                    $scope.vacancysStatusesParam = array;
                }else{
                    status.added = true;
                    $scope.vacancysStatusesParam.push(status.value);
                }
            }else{
                if(status.added){
                    notificationService.error($filter('translate')('It is necessary to select at least one status'));
                }else{
                    status.added = true;
                    $scope.vacancysStatusesParam.push(status.value);
                }
            }
        };
        $scope.allStatuses = {
            standard: false,
            reasons: false,
            custom: false
        };
        $scope.vacancyStandardStages = [];
        $scope.vacancyReasonsForRefusal = [];
        $scope.vacancyCustomStages = [];

        $scope.getVacancyStages = function(){
            angular.forEach($scope.inVacancyStatuses, function(resp){
                if(resp.value != 'no_contacts' && resp.value != 'notafit' && resp.value != 'declinedoffer'
                    && resp.value != 'no_response'){
                    $scope.vacancyStandardStages.push(resp);
                }
                else {
                    $scope.vacancyReasonsForRefusal.push(resp);
                }
            });
            angular.forEach($scope.customStages, function(resp){
                if(resp.type != 'refuse'){
                    $scope.vacancyCustomStages.push(resp);
                }
                else if(resp.type == 'refuse'){
                    $scope.vacancyReasonsForRefusal.push(resp);
                }
            });
        };
        $scope.checkAllChooseStatuses = function(){
            $scope.allStatuses.standard = $scope.checkStatuses($scope.vacancyStandardStages);
            $scope.allStatuses.reasons = $scope.checkStatuses($scope.vacancyReasonsForRefusal);
            $scope.allStatuses.custom = $scope.checkStatuses($scope.vacancyCustomStages);
        };
        $scope.checkStatuses = function(blockStatuses){
            var number = 0;

            angular.forEach(blockStatuses, function(resp){
                if(!resp.added){
                    number++;
                    return false;
                }
            });
            if(number == 0){
                return true;
            }
        };

        $scope.changeButtonForAllStatuses = function(status) {
            for(var key in $scope.allStatuses){
                if(key == status){
                    if($scope.allStatuses[key]){
                        $scope.allStatuses[key] = false;
                        return false;
                    } else {
                        $scope.allStatuses[key] = true;
                        return true;
                    }
                }
            }
        };
        $scope.addAll = false;
        $scope.changeAllVacancyStatuses = function(nameBlockStatuses){
            var add = $scope.changeButtonForAllStatuses(nameBlockStatuses);

            if(nameBlockStatuses == 'standard'){

                angular.forEach($scope.inVacancyStatuses,function(resp){
                    $scope.addAll = true;
                    if(!resp.added && resp.value != 'no_contacts' && resp.value != 'notafit' && resp.value != 'declinedoffer'
                    && resp.value != 'no_response' && add){
                        $scope.changeInVacancyStatuses(resp);
                    } else if(resp.added && resp.value != 'no_contacts' && resp.value != 'notafit' && resp.value != 'declinedoffer'
                        && resp.value != 'no_response' && !add){
                        $scope.changeInVacancyStatuses(resp);
                    } else {
                        $scope.addAll = false;
                    }
                })

            } else if(nameBlockStatuses == 'reasons'){
                angular.forEach($scope.inVacancyStatuses,function(resp){
                    $scope.addAll = true;
                    if((!resp.added && add) && (resp.value == 'no_contacts' || resp.value == 'notafit' || resp.value == 'declinedoffer' || resp.value == 'no_response')){
                        $scope.changeInVacancyStatuses(resp);
                    } else if((resp.added && !add) && (resp.value == 'no_contacts' || resp.value == 'notafit' || resp.value == 'declinedoffer' || resp.value == 'no_response')){
                        $scope.changeInVacancyStatuses(resp);
                    } else {
                        $scope.addAll = false;
                    }
                });
                angular.forEach($scope.customStages, function(resp){
                    $scope.addAll = true;
                    if(!resp.added && resp.type == 'refuse' && add){
                        $scope.changeInVacancyStatuses(resp);
                    } else if(resp.added && resp.type == 'refuse' && !add){
                        $scope.changeInVacancyStatuses(resp);
                    } else {
                        $scope.addAll = false;
                    }
                });
            } else if(nameBlockStatuses == 'custom'){
                angular.forEach($scope.customStages, function(resp){
                    $scope.addAll = true;
                    if(!resp.added && resp.type != 'refuse' && add){
                        $scope.changeInVacancyStatuses(resp);
                    } else if(resp.added && resp.type != 'refuse' && !add){
                        $scope.changeInVacancyStatuses(resp);
                    } else {
                        $scope.addAll = false;
                    }
                });
            }
        };

        $scope.changeInVacancyStatuses = function(status){

            if($scope.inVacancysStatusesParam.length > 1){
                if(status.added){
                    if(status.customInterviewStateId){
                        $scope.customStagesActive.splice($scope.customStagesActive.indexOf(status), 1);
                    }else{
                        $scope.activeInVacancyStatuses.splice($scope.activeInVacancyStatuses.indexOf(status), 1);
                    }
                    status.added = false;
                    var array =[];
                    angular.forEach($scope.inVacancyStatuses, function(resp){
                        if(resp.added){
                            array.push(resp.value);
                        }
                    });
                    angular.forEach($scope.customStages, function(resp){
                        if(resp.added){
                            array.push(resp.customInterviewStateId);
                        }
                    });
                    $scope.inVacancysStatusesParam = array;
                }else{
                    status.added = true;
                    if(status.customInterviewStateId){
                        $scope.inVacancysStatusesParam.push(status.customInterviewStateId);
                        $scope.customStagesActive.push(status);
                    }else{
                        $scope.inVacancysStatusesParam.push(status.value);
                        $scope.activeInVacancyStatuses.push(status);
                    }
                }
            }else{
                if(status.added){
                    notificationService.error($filter('translate')('It is necessary to select at least one stage'));
                }else{
                    status.added = true;
                    if(status.customInterviewStateId){
                        $scope.inVacancysStatusesParam.push(status.customInterviewStateId);
                        $scope.customStagesActive.push(status);
                    }else{
                        $scope.inVacancysStatusesParam.push(status.value);
                        $scope.activeInVacancyStatuses.push(status);
                    }
                }
            }
            if(!$scope.addAll){
                $scope.checkAllChooseStatuses();
            }
            $scope.addAll = false;
        };

        $scope.changePersonAdd = function(person){
            $scope.leastChosen = false;
           if(!person.added){
               person.added = true;
               $scope.choosenPersons.push(person.userId)
           }else{
               person.added = false;
               $scope.choosenPersons.splice($scope.choosenPersons.indexOf(person.userId), 1);
           }
            angular.forEach($scope.associativePerson,function(resp){
                if(resp.added){
                    $scope.leastChosen = true;
                }
            });
        };
        $(".startDate").datetimepicker({
            format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy" : "mm/dd/yyyy",
            startView: 4,
            minView: 2,
            autoclose: true,
            weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
            language: $translate.use()
        }).on('changeDate', function(data) {
            $scope.startVacancyDate = data.date.getTime();
        }).on('hide', function() {
            if ($('.startDate').val() == "") {
                $scope.startVacancyDate = null;
            }
        });

        $(".endDate").datetimepicker({
            format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy" : "mm/dd/yyyy",
            startView: 4,
            minView: 2,
            autoclose: true,
            weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
            language: $translate.use()
        }).on('changeDate', function(data) {
            $scope.endDate = data.date.getTime();
        }).on('hide', function() {
            if ($('.endDate').val() == "") {
                $scope.endDate = null;
            }
        });
        $scope.showChoosingMenu = function(){
            if($('.chooseStatusMenu').css('display') == 'none'){
                $('.chooseStatusMenu').show('500');
                $('body').mouseup(function(e) {
                    if ($('.chooseStatusMenu').has(e.target).length === 0) {
                        $('.chooseStatusMenu').hide("500");
                        $(document).off('mouseup');
                    }
                });
            }else{
                $('body').unbind('mouseup');
                $('.chooseStatusMenu').hide("500");
            }
        };
        $scope.showChoosingMenuStages = function(){
            if($('.chooseStagesMenu').css('display') == 'none'){
                $('.chooseStagesMenu').show('500');
                $('body').mouseup(function(e) {
                    if ($('.chooseStagesMenu').has(e.target).length === 0) {
                        $('.chooseStagesMenu').hide("500");
                        $(document).off('mouseup');
                    }
                });
            }else{
                $('body').unbind('mouseup');
                $('.chooseStagesMenu').hide("500");
            }
        };
        $scope.showPersonMenu = function(){
            if($('.choosePersonMenu').css('display') == 'none'){
                $('.choosePersonMenu').show('500');
                $('body').mouseup(function(e) {
                    if ($('.choosePersonMenu').has(e.target).length === 0) {
                        $('.choosePersonMenu').hide("500");
                        $(document).off('mouseup');
                    }
                });
            }else{
                $('body').unbind('mouseup');
                $('.choosePersonMenu').hide("500");
            }
        };
        $scope.popup = function(){
        $('.commentBlog').popup({
                position : 'right center'
            });
        };
        $scope.popup();


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
        $scope.inviteHiringManager = function(){
            $rootScope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'partials/modal/invite-new-user.html',
                size: '',
                resolve: function(){

                }
            });
            $rootScope.modalInstance.opened.then(function(){
                $rootScope.inviteUser.role = 'client';
            });
            $rootScope.modalInstance.closed.then(function() {
                $rootScope.inviteUser.role = null;
                $rootScope.inviteUser.email = null;
            });
        };
    }
]);


