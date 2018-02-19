
controller.controller('constructorReports', ["$rootScope", "$scope", "Vacancy", "Service", "$location",
    "$routeParams", "notificationService", "$filter","translateWords", "$translate", "vacancyStages","Stat", "Company", "vacancyStages", "Person", "$uibModal","CustomField",
    function($rootScope, $scope, Vacancy, Service, $location, $routeParams, notificationService, $filter,translateWords,
             $translate, vacancyStages, Stat, Company, vacancyStages, Person, $uibModal, CustomField, CustomReportsService) {
        let activeBlocks = [];
        $rootScope.loading = true;
        $scope.regions = [];
        $scope.timeMaxZone = false;
        $scope.timeMaxZone2 = false;
        $scope.updateReportBtn = false;
        $scope.fieldsVacancyList = [];
        $scope.firstTimeLoading = 0;
        $scope.inVacancysStatusesParam =[];
        $scope.emptyAccount = true;
        $scope.build = false;
        $scope.disabled = false;
        $scope.choosenPersons = [];
        $scope.leastChosen = false;
        $scope.customStagesActive =[];
        $scope.activeInVacancyStatuses = [];
        $rootScope.modalInstance = undefined;
        $scope.withCandidates = false;
        $scope.checkListFields = ["client","salary","location","responsibles","status","dc", "daysInWork"];
        $scope.checkCustomListFields = [];
        $scope.dateRange = ['currentWeek','previousWeek','currentMonth', 'previousMonth', 'currentYear', 'previousYear', 'customRange'];
        $scope.selectVacancy = [];
        $scope._vacancyStatuses = [];
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

        function resetAngularContext() {
            $rootScope.loading = false;
            $scope.$apply();
        }

        $scope.checkFields =  function (field, event) {
            var i, target = event.target;

            if($scope.checkListFieldsLength){
                $scope.checkListFieldsLength = false;
            }

            while(target.tagName !== 'UL'){
                if(target.tagName == 'LI'){
                    $(target).find('.fa').toggleClass('checkmark');
                    break;
                }
                target = target.parentNode;
            }
            if($scope.checkListFields.indexOf(field.value) == -1 && !field.id){
                field.visiable = true;
                $scope.checkListFields.push(field.value);
            }else if(!field.id){
                field.visiable = false;
                $scope.checkListFields.splice($scope.checkListFields.indexOf(field.value), 1);
            }

            if($scope.checkCustomListFields.indexOf(field.id) == -1 && field.id){
                field.visiable = true;
                $scope.checkCustomListFields.push(field.id);
            }else if(field.id){
                field.visiable = false;
                $scope.checkCustomListFields.splice($scope.checkCustomListFields.indexOf(field.id), 1);
            }

            if($scope.checkListFields.length == 0 && $scope.checkCustomListFields.length == 0) {
                $scope.checkListFieldsLength = true;
            }

            if($scope.build && !$scope.withCandidates) $scope.createReport(true);
        };


        $scope.saveCustomReport = function (reportsSave, formSaveCustomReport) {
            console.log( $scope.fieldsVacancyList, ' $scope.fieldsVacancyList')
            if(formSaveCustomReport.$valid) {
                translateWords.getTranslete("Report saved", $scope, 'reportSaved');
                var params = {
                    "from": createCorrectDate($scope.startVacancyDate, ['00','00','00']),
                    "to": createCorrectDate($scope.endDate,['23','59','59']),
                    "types": null,
                    "vacancyIds": $scope.fieldsVacancyList.filter(item => item.check).map(vacancy => vacancy.vacancyId),
                    "vacancyStatuses":  $scope._vacancyStatuses.filter(item => item.added).map(status => status.item),
                    "interviewStatuses": $scope.inVacancysStatusesParam,
                    "interviewCreatorIds": $scope.choosenPersons,
                    "vacancyFields": $scope.checkListFields,
                    "withCandidates": $scope.withCandidates,
                    "customVacancyFields":$scope.checkCustomListFields,
                    "customReportName": reportsSave.name,
                    "descr": (reportsSave.description)? reportsSave.description : ""
                };

                Stat.requestSaveCustomVacancyReport(params)
                    .then((resp) => {
                        if(resp.status == "error"){
                            notificationService.error(resp.message);
                            $rootScope.loading = false;
                            $scope.$apply();
                            return;
                        }
                        notificationService.success($scope['reportSaved']);
                        $rootScope.closeModal();
                        $rootScope.modalInstance = undefined;
                        $location.path('/reports')
                    }, (error) => {
                        translateWords.getTranslete(error.text, $scope, 'error');
                        notificationService.error($scope.error)
                    });
            }
        };

        $scope.canselCustomReport = function () {
            $rootScope.closeModal();
        };

        $scope.btnSaveCustomVacancyReport = function () {
            $rootScope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/save-custom-report-model.html?b1',
                backdrop: 'static',
                scope: $scope
            });
        };


        $rootScope.closeModal = function(){
            $rootScope.modalInstance.close();
        };


        angular.forEach($scope.inVacancyStatuses, function(resp){
            if(resp.added){
                $scope.inVacancysStatusesParam.push(resp.value);
            }
        });

        vacancyStages.get(function(resp){
            var array = [];
            $scope.customStages = resp.object.interviewStates;
            angular.forEach($scope.customStages, function(res){
                res.added = false;
                res.count = 0;
                if(res.status != "D"){
                    array.push(res);
                }
            });
            $scope.customStages = array;
            $scope.customStagesFull =resp.object;
            $scope.getVacancyStages();
        });

        Person.getAllPersons(function (resp) {
            $scope.associativePerson = resp.object;
            angular.forEach($scope.associativePerson, function(res){
                res.added = false;
            });
        });

        $scope.regionIdToName = function (regionId) {
            var location = '-';
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
        $scope.fieldsList = [
            {value:"client",visiable:true},
            {value:"salary",visiable:true},
            {value:"location",visiable:true},
            {value:"responsibles",visiable:true},
            {value:"status",visiable:true},
            {value:"dc",visiable:true},
            {value:"dateFinish",visiable:false},
            {value:"numberOfPositions",visiable:false},
            {value:"datePayment",visiable:false},
            {value:"budget",visiable:false},
            {value:"employmentType",visiable:false},
            {value:"candidatesAdded",visiable:false},
            {value:"candidatesInWork",visiable:false},
            {value:"candidatesApproved",visiable:false},
            {value:"candidatesRefused",visiable:false},
            {value:"daysInWork",visiable:true}];


        function concatCastomOrStandartFields(custom, standart) {
            custom.forEach(item => {
                standart.push({
                    value: item.title,
                    visiable: false,
                    id: item.fieldId
                })
            });
            return true;
        }

        $scope.createReport = function(ifCheck){
            if($scope.checkListFields.length == 0 && $scope.checkCustomListFields.length == 0){
                $scope.checkListFieldsLength = true;
                return;
            }
                // console.log($scope.fieldsVacancyList, $scope.fieldsVacancyList)
            Stat.requestGetActualVacancyStatistic2({
                "from": createCorrectDate($scope.startVacancyDate, ['00','00','00']),
                "to": createCorrectDate($scope.endDate,['23','59','59']),
                "types":null,
                "vacancyStatuses": $scope._vacancyStatuses.filter(item => item.added).map(status => status.item),
                "interviewStatuses":$scope.inVacancysStatusesParam,
                "interviewCreatorIds": $scope.choosenPersons,
                "vacancyFields": ["client","numberOfPositions","salary","location","status","dateFinish",
                    "budget","candidatesAdded","candidatesApproved","daysInWork","responsibles","dc",
                    "datePayment","employmentType","candidatesRefused","candidatesInWork"],
                "customVacancyFields":$scope.checkCustomListFields,
                "withCandidates": $scope.withCandidates,
                "vacancyIds": $scope.fieldsVacancyList.filter(item => item.check).map(item => item.vacancyId)

            }, ifCheck)
            .then(response => {
                    $scope.regions = response.object["regions"];
                    $scope.vacancyData = response.object["entryList"].map(item => item["vacancy"]);
                    ($scope.vacancyData.length)? $scope.build = true : $scope.build = false;
                    resetAngularContext();
                });
        };

        $scope.updateReport = function(event){
            $scope.build = false;
            if($scope.timeMaxZone2){
                $rootScope.loading = false;
                return;
            }else if($scope.timeMaxZone){
                $rootScope.loading = false;
                return;
            }

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
                        }

                        if(!$scope.endDate){
                                var today = new Date();
                                $scope.endDate = today.getTime();
                        }
                        $scope.selectDateRange(null ,'customRange', false);
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
                .then(resp =>{
                    if(!$scope.firstTimeLoading) return CustomField.requestGetFieldsTitles();
                    return Promise.reject();
                })
                .then(resp => concatCastomOrStandartFields(resp['objects'], $scope.fieldsList),resp => true)
                .then(resp => {
                    let data = $scope.fieldsVacancyList;
                    if(data && !data.length){
                       return updateListVacansies($scope.startVacancyDate,$scope.endDate);
                    }else {return Promise.reject()}
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

                        setCountCadidateInStatuses($scope.totalVacancyStatusesCount)

                        if ($scope.firstTimeLoading == 1) {
                            angular.forEach($scope._vacancyStatuses, function (res) {
                                if (res.count != 0 && (res.item != 'canceled' && res.item != 'expects')) {
                                    res.added = true;
                                    array.push(res.item);
                                } else {
                                    res.added = false
                                }
                            });
                            console.log(array, 'array')


                            return Stat.requestGetCountInterviewForActualVacancyStatistic({
                                "from": $scope.startVacancyDate,
                                "to": $scope.endDate,
                                "vacancyStatuses":array,
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
                                "vacancyStatuses":$scope._vacancyStatuses.filter(item => item.added).map(status => status.item),
                                "interviewCreatorIds": $scope.choosenPersons
                            }),
                            Stat.requestGetActualVacancyStatistic2({
                                "from": createCorrectDate($scope.startVacancyDate, ['00','00','00']),
                                "to": createCorrectDate($scope.endDate,['23','59','59']),
                                "types":null,
                                "vacancyStatuses":$scope._vacancyStatuses.filter(item => item.added).map(status => status.item),
                                "interviewStatuses":$scope.inVacancysStatusesParam,
                                "interviewCreatorIds": $scope.choosenPersons,
                                "vacancyFields": $scope.checkListFields,
                                "withCandidates": $scope.withCandidates,
                                "vacancyIds": $scope.fieldsVacancyList.filter(item => item.check).map(item.vacancyId)
                            }, false),
                            CustomField.requestGetFieldsTitles()
                        ])
                        .then(resp => {
                            $scope.$apply(() => {
                                responseSetInView(resp);
                                $rootScope.loading = false;
                            });
                        });
                    }else{
                        $rootScope.loading  = false;
                        $scope.$apply();
                    }
                });



        };

        $scope.updateReport();

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

        $scope.loadingExcel = false;
        $scope.downloadReport = function () {
            $rootScope.loading = true;
            if($scope.loadingExcel == false){
                $scope.loadingExcel = true;
                Stat.createVacancyStatisticExcel({
                    "from": createCorrectDate($scope.startVacancyDate, ['00','00','00']),
                    "to": createCorrectDate($scope.endDate,['23','59','59']),
                    "types":null,
                    "vacancyStatuses": $scope._vacancyStatuses.filter(item => item.added).map(status => status.item),
                    "interviewStatuses":$scope.inVacancysStatusesParam,
                    "interviewCreatorIds": $scope.choosenPersons,
                    "vacancyFields":$scope.checkListFields,
                    "customVacancyFields":$scope.checkCustomListFields,
                    "withCandidates": $scope.withCandidates,
                    "vacancyIds": $scope.fieldsVacancyList.filter(item => item.check).map(item.vacancyId)
                }, function (resp) {
                    if (resp.status == 'ok') {
                        var sr = $rootScope.frontMode == "war" ? "/hr/" : "/hrdemo/";
                        $('#downloadReport')[0].href = sr + 'getapp?id=' + resp.object;
                        $('#downloadReport')[0].click();
                    }
                    $scope.loadingExcel = false;
                    // $scope.$apply();
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
            status.added = !status.added;
            updateListVacanciesWithStatuses(status);
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

        var now = Date.now();
            now += (2592000000 * 2);

        $(".startDate").datetimepicker({
            format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy" : "mm/dd/yyyy",
            startView: 4,
            minView: 2,
            autoclose: true,
            weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
            language: $translate.use(),
            endDate: new Date(now)
        }).on('changeDate', function(data) {
            $scope.startVacancyDate = data.date.getTime();
            if($scope.startVacancyDate > new Date()){
                $scope.timeMaxZone = true;
            }else{ $scope.timeMaxZone = false;}
            updateListVacansies($scope.startVacancyDate,  $scope.endDate);
            $scope.$apply();
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
            language: $translate.use(),
            endDate: new Date(now)
        }).on('changeDate', function(data) {
            $scope.endDate = data.date.getTime();
            if($scope.endDate > new Date()){
                $scope.timeMaxZone2 = true;
            }else{ $scope.timeMaxZone2 = false;}
            updateListVacansies($scope.startVacancyDate,  $scope.endDate);
            $scope.$apply();
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

        $scope.showChoosingMenuStages = function(event){
            let target = event.target;

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

        $scope.showChoosingFields = function () {
            $scope.checkListFieldsLength = false;
            if($('.chooseListFields').css('display') == 'none'){
                $('.chooseListFields').show('500');
                $('body').mouseup(function(e) {
                    if ($('.chooseListFields').has(e.target).length === 0) {
                        $('.chooseListFields').hide("500");
                        $(this).off('mouseup');
                    }
                });
            }else{
                $('body').unbind('mouseup');
                $('.chooseListFields').hide("500");
            }
        };

        $scope.popup = function(){
            $('.commentBlog').popup({
                position : 'right center'
            });
        };
        $scope.popup();

        $scope.getCompanyParams = function(){
            Company.getParams(function(resp){
                $scope.companyParams = resp.object;
                $rootScope.publicLink = $location.$$protocol + "://" + $location.$$host + "/i#/" + $scope.companyParams.nameAlias + "-vacancies";
            });
        };

        $scope.getCompanyParams();

        function createCorrectDate(date, time) {
            var currentDate = new Date(date),
                hour = time[0],
                minutes = time[1],
                seconds = time[2],
                correctDate = +new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hour, minutes, seconds);
            return correctDate;
        }

        $scope.filterVacancy = function (vacancy) {
            if(vacancy.position.toLocaleLowerCase().indexOf($scope.query.toLocaleLowerCase()) !== -1){
                return vacancy;
            }
        };

        $scope.selectedVacancy = function (vacancyID) {
            vacancyID.check = !vacancyID.check;
            reloadCountCandidatesInStatuses()
        };

        $scope.selectDateRange = function (event, dateRange, isUpdate) {
            let currentDate = new Date(),
                currentDateStart = new Date(),
                currentDateFinish = new Date();
                $scope.disabled = true;
                $scope.selectRange = dateRange;

            switch(dateRange) {
                case 'currentWeek':
                    currentDateStart.setDate(currentDate.getDate() - (currentDate.getDay() - 1));
                    currentDateFinish.setDate(currentDate.getDate());
                    break;
                case 'previousWeek':
                    currentDateStart.setDate((currentDate.getDate() - (currentDate.getDay() - 1)) - 7);
                    currentDateFinish.setDate((currentDate.getDate() - (currentDate.getDay() - 1)) - 1);
                    break;
                case 'currentMonth':
                    currentDateStart.setDate(1);
                    currentDateFinish.setDate(currentDate.getDate());
                    break;
                case 'previousMonth':
                    currentDateStart.setMonth(currentDate.getMonth() - 1, 1);
                    currentDateFinish.setMonth(currentDate.getMonth(), 0);
                    break;
                case 'currentYear':
                    currentDateStart.setFullYear(currentDate.getFullYear(), 0, 1);
                    currentDateFinish.setDate(currentDate.getDate());
                    break;
                case 'previousYear':
                    currentDateStart.setFullYear(currentDate.getFullYear() - 1, 0, 1);
                    currentDateFinish.setFullYear(currentDate.getFullYear(), 0, 0);
                    break;
                case 'customRange':
                    $scope.disabled = false;
                    currentDateStart = $scope.startVacancyDate;
                    currentDateFinish = new Date();
                    break;
            }

            $scope.startVacancyDate =  +new Date(currentDateStart);
            $scope.endDate =  +new Date(currentDateFinish);
            $(".startDate").datetimepicker("setDate", new Date(currentDateStart));
            $(".endDate").datetimepicker("setDate", new Date(currentDateFinish));

            if(isUpdate) updateListVacansies($scope.startVacancyDate,  $scope.endDate);
        };

        $scope.parentClick = function (event) {
            showBlocks(event);
        };

        $scope.selectAllVacancies = function () {
            let _fieldsVacancyList = $scope.fieldsVacancyList;
            _fieldsVacancyList.forEach(item => item.check = $scope.chooseListFieldsVacancies);
            reloadCountCandidatesInStatuses();
        };

        function isClickInDataShowBlock(element, id) {
            while(!element.classList.contains('block-constructor-reports')){
                if(element.classList.contains('active') || (id && element.id === id)){
                    return true;
                }
                element = element.parentNode;
            }
            return false;
        }

        function showBlocks(event) {
            let targetDataID = getDataShowElement(event.target), targetShowElement;

            if(isClickInDataShowBlock(event.target, targetDataID['show'])){
                return;
            }

            targetShowElement =  angular.element('#' + targetDataID['show'])[0];

            if(targetDataID && targetDataID['show'] && !targetShowElement.classList.contains('active')){
                _showBlocks(targetShowElement);
                return;
            }

            _hiddenBlocks();
        }

        function getDataShowElement(target) {
            let element = target;

            while(!element.classList.contains('block-constructor-reports')){
                    if(element.dataset.show){
                        return element.dataset;
                    }
                element = element.parentNode;
            }
            return false;
        }

        function _showBlocks(blockShow){
            activeBlocks.push(blockShow);
            blockShow.classList.add('active');
        }

        function _hiddenBlocks() {
          for(let i = 0; i < activeBlocks.length; i++){
              activeBlocks[i].classList.remove('active');
              activeBlocks.splice(i,1);
              i -= 1;
          }
        }

        function updateListVacansies(startDate,endDate) {
            Vacancy.getAllVacansies({from:startDate,to:endDate})
                .then(setListVacancies);
        }

        function setListVacancies(resp) {
            let responseData, listVacancies = $scope.fieldsVacancyList;
            if(!resp.objects){
                $rootScope.loading = false;
                return;
            }

            responseData = resp.objects;

            responseData.forEach(i => {
                i.visiable = true;
                listVacancies.forEach(j =>{
                    let i2 = i;
                    if(i2.vacancyId  === j.vacancyId && j.check){
                        i2.check = true;
                    }
                });
            });

            listVacancies  = null;
            $scope.fieldsVacancyList = responseData;
            $rootScope.loading = false;
        }

        function reloadCountCandidatesInStatuses(){
            let requestData = {
                "from": $scope.startVacancyDate,
                "to": $scope.endDate,
                "vacancyStatuses":   $scope._vacancyStatuses.filter(item => item.added).map(status => status.item),
                "interviewCreatorIds": $scope.choosenPersons,
                "vacancyIds": $scope.fieldsVacancyList.filter(item => item.check).map(item => item.vacancyId)
            }
            return  Stat.requestGetCountVacancyForActualVacancyStatistic(requestData)
                .then((resp) => {
                    setCountCadidateInStatuses(resp.object);
                    resetAngularContext();
                });
        }

        function setCountCadidateInStatuses(totalVacancyStatusesCount) {
            $scope._vacancyStatuses = totalVacancyStatusesCount;

            $scope._vacancyStatuses.forEach(item => {
                if(item.count > 0){
                    item.added = true;
                }else{
                    item.added = false;
                }
                item.visible = true;
            });
        }

        function updateListVacanciesWithStatuses(status){
            let listCheckStatuses = $scope._vacancyStatuses.filter(item => item.added).map(status => status.item),
                max = $scope.fieldsVacancyList.length, i = 0;

            console.log($scope.fieldsVacancyList, '$scope.fieldsVacancyList')
           for(;i < max;i++){
               let searchNeedVacansy = false,
                   elem = $scope.fieldsVacancyList[i];

               listCheckStatuses.forEach(status =>{
                   if(elem.status == status){
                       elem.visiable = true;
                       searchNeedVacansy = true;
                       return;
                   }
               });

               if(!searchNeedVacansy){
                   elem.check = false;
                   elem.visiable = false;
               }
           }

        }
    }
]);


