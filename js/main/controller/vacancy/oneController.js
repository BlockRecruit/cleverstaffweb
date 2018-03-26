controller.controller('vacancyController', ["localStorageService", "CacheCandidates", "$localStorage", "$scope", "Vacancy",
    "Service", "$translate", "$routeParams", "$filter", "ngTableParams", "Person", "$location", "$rootScope", "FileInit",
    "googleService", "Candidate", "notificationService", "serverAddress", "frontMode", "Action", "vacancyStages", "Company", "Task", "File", "$sce","Mail", "$uibModal", "Client", "$route", "$timeout","$window",
    function (localStorageService, CacheCandidates, $localStorage, $scope, Vacancy, Service, $translate, $routeParams,
              $filter, ngTableParams, Person, $location, $rootScope, FileInit,
              googleService, Candidate, notificationService, serverAddress, frontMode, Action, vacancyStages, Company, Task, File, $sce, Mail, $uibModal, Client, $route,$timeout,$window) {
        $rootScope.currentElementPos = true;
        $rootScope.setCurrent = true;
        localStorage.setItem('setCurrent', true);
        $rootScope.isAddCandidates= true;
        localStorage.setItem('currentPage', 'vacancies');
        localStorage.removeItem('stageUrl');
        localStorage.removeItem('candidatesInStagesVac');
        localStorage.removeItem('getAllCandidates');
        Candidate.getCandidate = [];
        Vacancy.getCandidate = [];
        $scope.noCandidatesInThisVacancy = false;
        $scope.langs = Service.lang();
        $scope.serverAddress = serverAddress;
        $rootScope.currentElementPos = true;
        $scope.loadingCandidates = true;
        $scope.facebookAppId = facebookAppId;
        $scope.showSearchCandidate = false;
        $scope.historyLimit = 20;
        $scope.showAddEmailTemplate = false;
        $scope.searchCandidateName = null;
        $scope.a = {};
        $scope.getMaxValue = '1';
        $scope.searchNumber = 1;
        $scope.historyType = {};
        $scope.paginationParams = {
            currentPage: 1,
            totalCount: 0
        };
        $scope.historyType.value = 'all_actions';
        $rootScope.responsiblePersonsEdit = [];
        $rootScope.showEmailTemplate = true;
        $scope.sortValue = 'addInVacancyDate';
        $scope.sortOrder = 'ASC';
        $scope.visiable = false;
        $localStorage.remove("vacancyForTest");
        $localStorage.remove("activeCustomStageName");
        $localStorage.remove("activeCustomStageId");
        localStorage.setItem('candidatesInStagesVac', false);
        Candidate.getCandidate = false;

        $rootScope.closeModal = function(){
            $scope.modalInstance.close();
        };

        $scope.closeModal = function(){
            $scope.modalInstance.close();
        };

        $scope.emailTemplateForRender ={
            text:''
        };

        if($location.$$absUrl.indexOf('&task=') != -1) {
            $scope.urlTaskId = $location.$$absUrl.split('&task=')[1];
        }
        Task.task($scope, $rootScope, $location, $translate, $uibModal, $route);
        $scope.showRenderedTinyMce = false;
        $scope.initCreatEmailTemplate = function(){
            $scope.emailTemplate = {
                mailTemplateId: null,
                type: "candidateCreateInterviewNotification",
                name: "",
                title: "",
                text: "",
                vacancyId: $scope.vacancy.vacancyId,
                fileId: null,
                fileName: null
            };
        };
        if (getUrlVars($location.$$absUrl).page) {
            $scope.a.searchNumber = parseInt(getUrlVars($location.$$absUrl).page);
        if (getUrlVars($location.$$absUrl).stage) {
            $scope.activeName = getUrlVars($location.$$absUrl).stage;
        } else if (getUrlVars($location.$$absUrl).search) {
            $scope.activeName = null;
            $scope.showSearchCandidate = true;
            if (getUrlVars($location.$$absUrl).search.length == 0 || getUrlVars($location.$$absUrl).search == 'null' || getUrlVars($location.$$absUrl).search == 'null') {
                $scope.searchCandidateName = null;
            } else {
                $scope.searchCandidateName = decodeURIComponent(getUrlVars($location.$$absUrl).search);
            }
        }
    } else {
            $scope.a.searchNumber = 1;
            $scope.searchCandidateName = null;
            $scope.activeName = 'longlist';
        }
        $scope.frontMode = frontMode;
        if ($localStorage.get('calendarShow') != undefined) {
            $rootScope.calendarShow = $localStorage.get('calendarShow');
            if ($rootScope.calendarShow == 'true') {
                $rootScope.calendarShow = true;
            } else if ($scope.calendarShow == 'false') {
                $rootScope.calendarShow = false;
            }
        } else {
            $rootScope.calendarShow = true;
        }
        $scope.show_full_descr = false;
        $scope.showMoveble = false;
        $scope.currentTab = 'candidate';
        $scope.errorDuplicateStage = false;
        $scope.advicesLimit = 5;
        $scope.activeCustomStageName = '';
        $scope.displayResponsibleName = false;
        $rootScope.saveFromAdviceClicked = false;
        $rootScope.searchAdvies = false;
        $rootScope.vacancy = undefined;
        $scope.todayDate = new Date().getTime();
        $rootScope.editableTaskOuter = false;
        $rootScope.clickedSaveResponsibleInVacancy = false;
        $rootScope.clickedSaveStatusInterviewInVacancy = false;
        $rootScope.clickedremoveResponsibleUserInVacancy = false;
        $scope.showResponsiblePopup = false;
        $scope.showMap = $localStorage.get("vacancyShowMap") != undefined ? JSON.parse($localStorage.get("vacancyShowMap")) : true;
        $scope.paramForExcell = {
            states: ['not_searching', 'passive_search', 'active_search', 'employed', 'work', 'freelancer', 'archived',
                'reserved', 'black_list'],
            interviewState: 'longlist'
        };
        $scope.showHideMap = function () {
            $scope.showMap = !$scope.showMap;
            $localStorage.set("vacancyShowMap", $scope.showMap);
        };



        $('body').mouseup(function (e) {
            var element = $(".clever-window");
            if ($(".clever-window").has(e.target).length == 0) {
                $scope.showRegion2Map = false;
                $(document).off('mouseup');
                $scope.$apply();
            }
        });
        $rootScope.addedStage = {
            type: 'common',
            name: ''
        };
        $rootScope.editedStage = {
            type: '',
            name: '',
            customInterviewStateId: '',
            status: ''
        };
        $scope.extraStatusObj = {
            show: false,
            messageText: null
        };
        $rootScope.newTask = {
            text: "",
            title: "",
            vacancyId: "",
            targetDate: '',
            responsibleIds: [],
            type: 'Task'
        };
        $scope.VacanciesInfCandidTaskHistClientFunc = function (panel) {
            $scope.noCandidatesInThisVacancy = false;
            $location.$$absUrl = $location.$$absUrl.split("&")[0];
            $scope.showSearchCandidate = false;
            $scope.showMoveble = false;
            $scope.currentTab = panel;
            setTimeout(function(){
                $(".changeDateNewTask").datetimepicker({
                    format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy hh:ii" : "mm/dd/yyyy hh:ii",
                    startView: 2,
                    minView: 0,
                    autoclose: true,
                    weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                    language: $translate.use(),
                    initialDate: new Date(),
                    startDate: new Date()
                }).on('changeDate', function (data) {
                    $rootScope.newTask.targetDate = $('.changeDateNewTask').datetimepicker('getDate');
                    // $scope.roundMinutes($rootScope.newTask.targetDate)
                }).on('hide', function () {
                    if ($('.changeDateNewTask').val() == "") {
                        $rootScope.newTask.date = "";
                    }
                    $('.changeDateNewTask').blur();
                });
            },3);
            if($scope.currentTab == 'task'){
                resetTemplate();
                $scope.updateTasks(true)
            }
            if($scope.currentTab == 'settings'){
                resetTemplate();
                $scope.getEmailTemplates();
            }
            if($scope.currentTab == 'candidate'){
                resetTemplate();
                $scope.candidateInVacancy({value: "longlist"});
            }
        };
        $scope.changeVacancyType = function (typeName, saveInServer, changeAnimation) {
            var check = [];
            $scope.extraStatusObjSucces.show = false;
            angular.forEach($scope.VacancyStatus, function (val) {
                if (val.vacancyType == 'simpleVacancy' && val.vacancyType != typeName) {
                    angular.forEach(val.status, function (valStatus) {
                        if (valStatus.withDate) {
                            check.push({check: valStatus.count == 0});
                        }
                    });
                    angular.forEach($filter('filter')(val.status, {defaultS: false}), function (valS) {
                        check.push({check: valS.count == 0});
                    });
                }
                if (val.vacancyType == 'itVacancy' && val.vacancyType != typeName) {
                    angular.forEach(val.status, function (valStatus) {
                        if (valStatus.withDate) {
                            check.push({check: valStatus.count == 0});
                        }
                    });
                    angular.forEach($filter('filter')(val.status, {defaultS: false}), function (valS) {
                        check.push({check: valS.count == 0});
                    });
                }
            });
            if (check.length == $filter('filter')(check, {check: true}).length) {
                $scope.vacancyType = typeName;
                angular.forEach($scope.VacancyStatus, function (val) {
                    if (val.vacancyType == typeName) {
                        val.used = true;
                        if (changeAnimation) {
                            angular.forEach(val.status, function (val) {
                                if (val.single) {
                                    val.useAnimation = true;
                                }
                            })
                        }
                    } else {
                        val.used = false;
                        angular.forEach(val.status, function (valS) {
                            if (valS.defaultS == false) {
                                valS.added = false;
                            }
                        })
                    }
                });
                if (saveInServer) {
                    $scope.saveStatusInServer();
                }
                return true;
            } else {
                $scope.extraStatusObj.show = true;
                if (typeName == 'itVacancy') {
                    $scope.extraStatusObj.messageText = 'SimpleToIt';
                } else {
                    $scope.extraStatusObj.messageText = 'ItyoSimle';
                }

            }
            return false;
        };
        $scope.changeCustomInterviewStatus = function (statusObj, val, name) {
            if (statusObj.count == 0 || !statusObj.count) {
                $scope.extraStatusObjSucces.show = false;
                if (!statusObj.added) {
                    statusObj.added = true;
                    if (statusObj.type != 'refuse') {
                        $scope.VacancyStatusFiltered.splice(1, 0, statusObj);
                    } else {
                        $scope.VacancyStatusFiltered.splice($scope.VacancyStatusFiltered.length, 0, statusObj);
                    }
                    $scope.saveStatusInServer(val);
                } else {
                    statusObj.added = false;
                    var index = $scope.VacancyStatusFiltered.indexOf(statusObj);
                    $scope.VacancyStatusFiltered.splice(index, 1);
                    $scope.saveStatusInServer(val);
                }
            } else {
                $scope.extraStatusObj.show = true;
                $scope.extraStatusObj.messageText = 'deleteStatus';
            }
            $timeout(function(){
                $scope.extraStatusObjSucces.show = false;
            }, 2000);
            $scope.movableStages = _.filter($scope.VacancyStatusFiltered, 'movable');
        };

        $scope.changeInterviewStatus = function (statusObj, val, name, event) {
            $scope.extraStatusObj.show = false;
            $scope.extraStatusObjSucces.show = false;


            if (!statusObj.added) {
                $scope.addExtraStatus(val, name);
                statusObj.added = true;
            } else {
                if (statusObj.count == 0) {
                    statusObj.added = false;
                    var index = $scope.VacancyStatusFiltered.indexOf(statusObj);
                    $scope.VacancyStatusFiltered.splice(index, 1);
                    $scope.saveStatusInServer();
                } else {
                    $scope.extraStatusObj.show = true;
                    $scope.extraStatusObj.messageText = 'deleteStatus';
                }
            }
            $timeout(function(){
                $scope.extraStatusObjSucces.show = false;
            }, 2000);
            $scope.movableStages = _.filter($scope.VacancyStatusFiltered, 'movable');
        };

        $scope.addExtraStatus = function (val, name) {
            $scope.extraStatusObjSucces.show = false;
            var arrayStatus = $filter('filter')($scope.VacancyStatus, {vacancyType: name});
            var status = $filter('filter')(arrayStatus[0].status, {value: val});
            var check = false;
            angular.forEach($scope.VacancyStatus, function (vals) {
                if (vals.vacancyType == $scope.vacancyType && vals.vacancyType == name && vals.used) {
                    check = true;
                } else if (vals.vacancyType == name && !vals.used) {
                    if ($scope.changeVacancyType(name, false, true)) {
                        check = true;
                    }
                }
            });
            if (check) {
                status[0].added = true;
                status[0].useAnimation = true;
                if (status[0].movable) {
                    $scope.VacancyStatusFiltered.splice(1, 0, status[0]);
                } else {
                    $scope.VacancyStatusFiltered.push(status[0]);
                }
                angular.forEach($scope.VacancyStatus, function (val) {
                    if (val.vacancyType != name) {
                        angular.forEach(val.status, function (valS) {
                            if (valS.defaultS == false) {
                                valS.added = false;
                            }
                        })
                    }
                });
                $scope.saveStatusInServer();
            }
        };

        $scope.extraStatusObjSucces = {
            show: false
        };
        $scope.saveStatusInServer = function (statusValue) {
            var checkValue = [];
            $scope.extraStatusObj.show = false;
            angular.forEach($scope.VacancyStatusFiltered, function (val) {
                if (val.added && !val.name) {
                    checkValue.push(val.value)
                }
                if (val.name) {
                    checkValue.push(val.customInterviewStateId)
                }
            });
            $scope.saveForAllVacancies = checkValue.toString();
            Vacancy.setInterviewStatus({
                vacancyId: $scope.vacancy.vacancyId,
                interviewStatus: checkValue.toString()
            }, function (resp) {
                if(resp.code != 'stageContainsCandidates') {
                    $scope.extraStatusObjSucces.show = true;
                    //$scope.VacancyStatusFiltered = $filter('vacancyStatusInSelectFilter')($scope.VacancyStatus);
                    $scope.getLastEvent();
                } else {
                    $scope.customStages.some(function (stage) {
                        if(stage.value == statusValue) {
                            stage.added = true;
                            return true
                        }
                    });
                    $scope.extraStatusObj.show = true;
                    $scope.extraStatusObj.messageText = 'deleteStatus';
                }
            });
        };

        $rootScope.vacancyChangeInterviewDate = {
            date: null,
            dateOld: null,
            candidate: null,
            interviewObject: null,
            comment: null
        };


        $scope.openChangeVacancyInterviewDate = function (interviewObject) {
            $rootScope.vacancyChangeInterviewDate.interviewObject = interviewObject;
            $rootScope.vacancyChangeInterviewDate.date = interviewObject.dateInterview;
            $rootScope.vacancyChangeInterviewDate.candidate = interviewObject.candidateId;
            $rootScope.vacancyChangeInterviewDate.dateOld = angular.copy(interviewObject.dateInterview);
            if ($rootScope.vacancyChangeInterviewDate.date != undefined) {
                $(".changeVacancyInterviewDatePicker").datetimepicker("setDate", new Date(angular.copy(interviewObject.dateInterview)));
            } else {
                $(".changeVacancyInterviewDatePicker").val("");
            }
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/vacancy-change-date-of-interview.html?1',
                size: '',
                resolve: function(){

                }
            });
            $scope.modalInstance.opened.then(function(){
                setTimeout(function(){
                    $(".changeVacancyInterviewDatePicker").datetimepicker({
                        format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy hh:ii" : "mm/dd/yyyy hh:ii",
                        startView: 2,
                        minView: 0,
                        autoclose: true,
                        weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                        language: $translate.use()
                    }).on('changeDate', function (data) {
                        $rootScope.vacancyChangeInterviewDate.date = data.date;
                    }).on('hide', function () {
                        if ($('.changeVacancyInterviewDatePicker').val() == "") {
                            $rootScope.vacancyChangeInterviewDate.date = null;
                        }
                        $('.changeVacancyInterviewDatePicker').blur();
                    });
                },0);
            });
        };

        $rootScope.saveChangedVacancyInterview = function () {
            var object = $rootScope.vacancyChangeInterviewDate;
            var newDate = $('.changeVacancyInterviewDatePicker').datetimepicker('getDate') != null ?
                $('.changeVacancyInterviewDatePicker').datetimepicker('getDate').getTime() : null;
            if(newDate) {
                Vacancy.changeInterviewDate({
                    interviewId: object.interviewObject.interviewId,
                    date: newDate,
                    comment: object.comment != null ? object.comment : "",
                    lang: $translate.use()
                }, function (resp) {
                    object.interviewObject.dateInterview = newDate;
                    $rootScope.closeModal();
                    Vacancy.one({"localId": $scope.vacancy.localId}, function (resp) {
                        $scope.vacancy = resp.object;
                        $rootScope.vacancy = resp.object;
                        $scope.tableParams.reload();
                    });
                    $scope.getLastEvent();
                });
            } else {
                $('#change-date-in-vacancy').addClass('not-valid').on('click',(event) => {
                    $(event.currentTarget).removeClass('not-valid');
                });
            }
        };
        $rootScope.getTextToCopy = function () {
            return $scope.publicLink;
        };
        $rootScope.autocomplete = {
            interviews: null
        };
        $scope.updateVacancy = function () {
            $scope.numberAllCandidateInVacancy = 0;
            Vacancy.one({"localId": $routeParams.id, "interviews": false}, function (resp) {
                if (angular.equals(resp.status, "ok")) {
                    angular.forEach($scope.customStages, function (res) {
                        if ($scope.activeName == res.customInterviewStateId) {
                            $scope.activeCustomStageName = res.name;
                        }
                    });
                    $scope.vacancyType = 'simpleVacancy';
                    $scope.standartInterviewStatus = Vacancy.standardInterviewStatus($scope.vacancyType);
                    $scope.rightMenuInterviewStatus = Vacancy.standardInterviewStatus($scope.vacancyType);
                    $scope.statisticObj = {
                        requestObj: {vacancyId: resp.object.vacancyId},
                        objId: resp.object.vacancyId,
                        objType: "vacancy",
                        name: resp.object.position
                    };
                    $("#descr").html(resp.object.descr);
                    $scope.vacancy = resp.object;
                    $rootScope.vacancy = resp.object;
                    if($scope.vacancy != undefined){
                        $rootScope.promoLogo = $scope.vacancy.imageId;
                        if($rootScope.promoLogo != undefined){
                            $rootScope.promoLogoLink = $location.$$protocol + "://" + $location.$$host + $scope.serverAddress + "/getlogo?id=" + $rootScope.promoLogo + "&d=true";
                        }else{
                            $rootScope.promoLogoLink = "https://cleverstaff.net/images/sprite/vacancy-new.jpg";
                        }
                        if($scope.vacancy.imageId != undefined){
                            $('#owner_photo_wrap').css('width', '13%');
                        }else{
                            $('#owner_photo_wrap').css('width', '100%');
                        }
                    }
                    setVacanciesForCandidatesAccess($scope.vacancy.vacanciesForCandidatesAccess);
                    $scope.statusForChange = $scope.vacancy.status;
                    if($scope.urlTaskId) {
                        $scope.VacanciesInfCandidTaskHistClientFunc('task');
                    }
                    $rootScope.staticEmailTemplate = {
                        candidateName: "John Dou",
                        vacancyLink: $scope.vacancy.position,
                        date: 1463749200000,
                        recruiterName: $rootScope.me.fullName,
                        recruiterEmail: $rootScope.me.emails.length > 0 ? $rootScope.me.emails[0].email : $rootScope.me.login
                    };
                    Task.get({
                        //'creator': $rootScope.me.userId,
                        'vacancyId': $rootScope.vacancy.vacancyId
                    }, function (resp) {
                        if (resp.status == 'ok') {
                            $scope.totalTasksNumber = 0;
                            $scope.totalTasksNumber = resp.total;
                        }
                    });
                    angular.forEach($rootScope.me.contacts, function (val) {
                        if(val.contactType == 'phoneWork'){
                            $rootScope.staticEmailTemplate.phoneWork = val.value;
                        }
                        if(val.contactType == 'skype'){
                            $rootScope.staticEmailTemplate.skype = val.value;
                        }
                        if(val.contactType == 'linkedin'){
                            $rootScope.staticEmailTemplate.linkedin = val.value;
                        }
                        if(val.contactType == 'facebook'){
                            $rootScope.staticEmailTemplate.facebook = val.value;
                        }
                    });
                    for (var i = $scope.vacancy.publish.length - 1; i >= 0; i--) {
                        if ($scope.vacancy.publish[i].dd) {
                            $scope.vacancy.publish.splice(i, 1);
                        }
                    }
                    $(".paymentPicker").datetimepicker({
                        format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy" : "mm/dd/yyyy",
                        startView: 2,
                        minView: 2,
                        autoclose: true,
                        weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                        language: $translate.use()
                    });
                    $(".deadLinePicker").datetimepicker({
                        format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy" : "mm/dd/yyyy",
                        startView: 2,
                        minView: 2,
                        autoclose: true,
                        weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                        language: $translate.use()
                    });
                    if ($scope.vacancy.datePayment != undefined) {
                        $(".paymentPicker").datetimepicker("setDate", new Date($scope.vacancy.datePayment));
                    }

                    if ($scope.vacancy.dateFinish != undefined) {
                        $(".deadLinePicker").datetimepicker("setDate", new Date($scope.vacancy.dateFinish));
                    }
                    if (resp.object.region != undefined && resp.object.region.lat != undefined && resp.object.region.lng != undefined) {
                        $scope.map.center.latitude = resp.object.region.lat;
                        $scope.map.center.longitude = resp.object.region.lng;

                        $scope.marker.coords.latitude = resp.object.region.lat;
                        $scope.marker.coords.longitude = resp.object.region.lng;


                        $scope.regionInput = resp.object.region.displayFullName;
                    }
                    if($rootScope.me.personParams.clientAccessLevel != 'hide') {
                        Client.all(Client.searchOptions(), function(response) {
                            $scope.clients = response.objects;
                            var optionsHtml = '';
                            angular.forEach($scope.clients, function (value) {
                                if(value.clientId != $scope.vacancy.clientId.clientId){
                                    optionsHtml += "<option style='color: #000000' value='" + value.clientId + "'>" + value.name + "</option>";
                                }else{
                                    optionsHtml += "<option style='color: #000000' selected value='" + value.clientId + "'>" + value.name + "</option>";
                                }
                            });
                            $('#client-select').html(optionsHtml);
                        });
                    }
                    setTimeout(function () {
                        $('.select2-lang').val(resp.object.langs);
                        $('.select2-lang').select2({
                            tags: $scope.langs,
                            tokenSeparators: [",", " "]
                        });
                    }, 5);
                    $scope.updateOrgPages = function(){
                        Company.orgPages(function(resp){
                            $rootScope.fbPages = resp.objects;
                            for (var i = $rootScope.fbPages.length - 1; i >= 0; i--) {
                                if ($rootScope.fbPages[i].status === 'D') {
                                    $rootScope.fbPages.splice(i, 1);
                                }
                            }
                            angular.forEach($rootScope.fbPages, function (val) {
                                if (val.facebookPageId) {
                                    angular.forEach($scope.vacancy.publish, function (valStatus) {
                                        if (valStatus.pageId == val.facebookPageId) {
                                            val.vacancyAdded = true;
                                        }
                                    });
                                }
                            });
                        });
                    };
                    $scope.updateOrgPages();
                    $scope.showShareFbPages = function (tab) {
                        if($rootScope.fbPages.length === 0){
                            $scope.modalInstance = $uibModal.open({
                                animation: true,
                                templateUrl: '../partials/modal/notHaveIntegrationWith-FB.html',
                                size: '',
                                resolve: function(){

                                }
                            });
                        }else{
                            $scope.modalInstance = $uibModal.open({
                                animation: true,
                                templateUrl: '../partials/modal/haveIntegrationWith-FB.html',
                                size: '',
                                resolve: function(){

                                }
                            });
                        }
                    };
                    $rootScope.addVacancyToFacebook = function(tab){
                        Vacancy.addPublish({
                            vacancyId: $scope.vacancy.vacancyId,
                            type: 'facebook_page',
                            pageId: tab.facebookPageId
                        },function(resp){
                            if(resp.status == 'ok'){
                                $scope.updateVacancy();
                                $('.shareFbPagesForVacancy.modal').modal('hide');
                            }else{
                                notificationService.error(resp.message);
                            }
                        })
                    };
                    if ($scope.vacancy.files) {
                        if ($scope.vacancy.files.length != undefined && $scope.vacancy.files.length != 0) {
                            angular.forEach($scope.vacancy.files, function (val) {
                                initDocuments(val);
                            });
                        }
                    }
                    $scope.initCreatEmailTemplate();
                    $scope.paramForExcell.vacancyId = $scope.vacancy.vacancyId;
                    //$scope.vacancy.langs = Service.langTranslator($scope.vacancy.langs);
                    $scope.recalls = $scope.vacancy.recalls;
                    angular.forEach($scope.vacancy.interviews, function (resp) {
                        $scope.numberAllCandidateInVacancy++;
                        //if ($scope.oneName) {
                        //    if ($scope.oneName != resp.creator.fullName) {
                        //        $scope.displayResponsibleName = true;
                        //        return false;
                        //    }
                        //}
                        //$scope.oneName = resp.creator.fullName;
                    });
                    $scope.paramForExcell["page"] = {
                        number: 0,
                        count: $scope.numberAllCandidateInVacancy
                    };

                    if ($scope.vacancy.responsiblesPerson !== undefined && $scope.vacancy.responsiblesPerson.length > 0) {
                        angular.forEach($scope.vacancy.responsiblesPerson, function (respObject) {
                            if (angular.equals($rootScope.me.userId, respObject.personId)) {
                                $scope.isResponsiblePerson = true;
                            }
                        });
                    }
                    if ($scope.vacancy.status !== 'canceled' && $rootScope.me.recrutRole == 'admin' && ($scope.vacancy.responsiblesPerson == undefined || $scope.vacancy.responsiblesPerson.length == 0)) {
                        $scope.showResponsiblePopup = true;
                    }

                    angular.forEach($scope.vacancy.publish, function (val) {
                        $scope.shareObj[val.type] = true;
                    });

                    updateDefaultStages();

                    function isLockCheckStages(data,stages) {
                        let index, hiddenStages = data.map(item => item.objId);

                        stages.forEach(item =>{
                            if(hiddenStages.indexOf(item.value) !== -1 || hiddenStages.indexOf(item.customInterviewStateId) !== -1 ){
                                item.hidden = true;
                            }else{
                                item.hidden = false;
                            }
                        });
                    }

                    if (resp.object.interviewStatus) {
                        var array = resp.object.interviewStatus.split(",");
                        var sortedStages = [];
                        angular.forEach($scope.VacancyStatus, function (vStatus) {
                            if (vStatus.used) {
                                var statusNotDef = $filter('filter')(vStatus.status, {defaultS: false});
                                angular.forEach(statusNotDef, function (statusND) {
                                    angular.forEach(array, function (statusA) {
                                        if (statusND.value == statusA) {
                                            statusND.added = true;
                                        } else {
                                            statusND.added = false;
                                        }
                                    })
                                })
                            }
                        });
                        var i = 0;
                        angular.forEach(array, function (resp) {
                            angular.forEach($scope.VacancyStatus, function (vStatus) {
                                if (vStatus.used) {
                                    if (i == 0) {
                                        angular.forEach($scope.customStages, function (res) {
                                            res.value = res.name;
                                            if (res.type != 'refuse') {
                                                res.movable = true;
                                            } else {
                                                res.movable = false;
                                            }
                                            res.added = false;
                                            res.count = 0;
                                            vStatus.status.push(res);
                                            i = i + 1;
                                        });
                                    }
                                    angular.forEach(vStatus.status, function (vStatusIn) {
                                        if (resp == vStatusIn.value) {
                                            vStatusIn.added = true;
                                            sortedStages.push(vStatusIn);
                                        } else if (resp == vStatusIn.customInterviewStateId) {
                                            vStatusIn.added = true;
                                            sortedStages.push(vStatusIn);
                                        }
                                    })
                                }
                            })
                        });


                        $scope.recallsStage = [{value: 'recalls', hidden: true}];
                        isLockCheckStages($scope.hiddenStages, sortedStages);
                        isLockCheckStages($scope.hiddenStages, $scope.recallsStage);


                        $scope.VacancyStatusFiltered = sortedStages;
                        $rootScope.VacancyStatusFiltered = sortedStages;
                    } else {
                        $scope.recallsStage = [{value: 'recalls', hidden: true}];
                        isLockCheckStages($scope.hiddenStages, $scope.recallsStage);
                        $scope.VacancyStatusFiltered = $filter('vacancyStatusInSelectFilter')($scope.VacancyStatus);
                        $rootScope.VacancyStatusFiltered = $filter('vacancyStatusInSelectFilter')($scope.VacancyStatus);
                        isLockCheckStages($scope.hiddenStages, $scope.VacancyStatusFiltered)

                    }
                    if (resp.object.region != undefined && resp.object.region.lat != undefined && resp.object.region.lng != undefined) {
                        $scope.map.center.latitude = resp.object.region.lat;
                        $scope.map.center.longitude = resp.object.region.lng;

                        $scope.marker.coords.latitude = resp.object.region.lat;
                        $scope.marker.coords.longitude = resp.object.region.lng;
                    }
                    $scope.movableStages = _.filter($scope.VacancyStatusFiltered, 'movable');
                    $rootScope.title = resp.object.position + " | CleverStaff";
                    $location.hash('');
                    $location.search($filter('transliteration')
                    (resp.object.position.replace(/\W+/g, '_') + "_" + resp.object.clientId.name.replace(/\W+/g, '_'))).replace();
                    if (!$scope.showSearchCandidate && $location.$$absUrl.indexOf('&task=') == -1) {
                        $location.$$absUrl = $location.$$absUrl + '&page=' + $scope.a.searchNumber + '&stage=' + $scope.activeName;
                    } else {
                        $location.$$absUrl = $location.$$absUrl + '&page=' + $scope.a.searchNumber + '&search=' + $scope.searchCandidateName;
                    }

                    $scope.candidateInVacancy = (function(){
                        let showLongList = false;

                        $rootScope.stageUrl = {
                            url:$location.$$absUrl.split('#')[1],
                            name: $scope.vacancy.position,
                            stage: ($scope.activeCustomStageName)? $scope.activeCustomStageName: $scope.activeName
                        };
                        localStorage.setItem('stage', JSON.stringify($location.$$absUrl.split('stage=')));
                        localStorage.setItem('stageUrl',JSON.stringify($rootScope.stageUrl));
                        return function (status,event) {
                            $scope.visiable = status.hidden;
                            if(!$scope.visiable) $scope.noAccess = false;
                            $scope.loadingCandidates = true;
                            $scope.tableParams.$params.page = 1;
                            $scope.a.searchNumber = 1;
                            $('#recallsTable').hide();
                            $('.pagination-block').show();

                            if ($scope.showTable === 'recalls') {
                                if ($scope.statusesCount != undefined && $scope.statusesCount > 0 && $scope.recalls && $scope.recalls.length > 0) {
                                    $scope.showTable = 'table';
                                } else {
                                    $scope.showTable = "not available";
                                }
                            }

                            if (status.customInterviewStateId && !$scope.showMoveble) {
                                $scope.activeCustomStageName = status.name;
                                $scope.activeName = status.customInterviewStateId;
                                $rootScope.activeName = status.customInterviewStateId;
                                $scope.paramForExcell.interviewState = status.customInterviewStateId;
                                if (status.type == 'interview') {
                                    $scope.isInterview = true;
                                } else {
                                    $scope.isInterview = false;
                                }
                            } else if (status == 'extra_status') {
                                if(!showLongList && event && event.target.id === 'openSettings'){

                                    // updateDefaultStages();
                                    // updateCustomStages();
                                    $scope.activeName = 'extra_status';
                                    $scope.activeCustomStageName = "";
                                    showLongList = true;
                                    $("html, body").animate({scrollTop: $('#openSettings').offset().top - $('#openSettings').height()}, "fast");
                                }else{
                                    if(event && event.target.id === 'openSettings') {
                                        $("html, body").animate({scrollTop: $('#openSettings').offset().top - $('#openSettings').height()}, "fast");
                                        return;
                                    }
                                    showLongList = false;
                                    showLongLists($scope.VacancyStatusFiltered[0]);
                                    updateDefaultStages();
                                    updateCustomStages();
                                    $("html, body").animate({scrollTop: 0}, "slow");
                                    notificationService.success($filter('translate')('Changes saved'));
                                }
                            } else {
                                if(!$scope.showMoveble) {
                                    showLongLists(status);
                                } else {
                                    return;
                                }
                            }


                            if ($scope.activeName == 'extra_status') {
                                $scope.showMoveble = true;
                            } else {
                                $scope.showMoveble = false;
                            }

                            if($scope.visiable && $rootScope.me.recrutRole != 'client'){
                                setTimeout(() => {
                                    $scope.tableParams.reload();
                                    $scope.$apply();
                                },100)
                            }
                            if(!$scope.visiable){
                                setTimeout(() => {
                                    $scope.tableParams.reload();
                                    $scope.$apply();
                                },100)
                            }
                            let absURLFirstPart = $location.$$absUrl.split("&")[0].split("/vacancies/")[1];
                            $location.url('/vacancies/' + absURLFirstPart + '&page=' + $scope.a.searchNumber + '&stage=' + $scope.activeName).replace();

                            $rootScope.stageUrl = {
                                url:$location.$$absUrl.split('#')[1],
                                name: $scope.vacancy.position,
                                stage: ($scope.activeCustomStageName)? $scope.activeCustomStageName: $scope.activeName
                            };
                            localStorage.setItem('stageUrl',JSON.stringify($rootScope.stageUrl));

                            function showLongLists(status) {
                                $scope.activeName = status.value;
                                $rootScope.activeName = status.value;
                                $scope.paramForExcell.interviewState = status.value;
                                $scope.activeCustomStageName = "";
                                $scope.isInterview = false;
                            }
                        }
                    })();

                    //$scope.init();
                    $scope.tableParams.reload();
                    $scope.objectId = resp.object.vacancyId;
                    $scope.vacancy.descr_small = $filter('cut')($scope.vacancy.descr, true, 500, '...');
                    Service.history({
                        "vacancyId": $scope.vacancy !== undefined ? $scope.vacancy.vacancyId : null,
                        "candidateId": null,
                        "clientId": null,
                        "page": {"number": 0, "count": $scope.historyLimit},
                        "type": 'all_actions'
                    }, function (res) {
                        historyButton($scope, res, Service, CacheCandidates);
                    });
                    $scope.publicLink = $location.$$protocol + "://" + $location.$$host + "/i#/vacancy-" + $scope.vacancy.localId;
                    if (frontMode === 'demo') {
                        $scope.publicLink = $location.$$protocol + "://" + $location.$$host + "/di#/pv/" + $scope.vacancy.localId;
                    }
                    $scope.publicName = resp.object.position;
                    $scope.publicDescr = '';
                    angular.forEach(angular.element($scope.vacancy.descr).text().replace("\r\n", "\n").split("\n"), function (val) {
                        if (val !== undefined && val !== '') {
                            $scope.publicDescr += val + " ";
                        }
                    });
                    //$scope.reloadAdvice();

                    Service.getOrgLogoId({orgId: resp.object.orgId}, function (logoResp) {
                        if (logoResp.status && logoResp.status === 'ok') {
                            $scope.companyLogo = logoResp.object;
                            if ($scope.companyLogo != undefined && $scope.companyLogo !== '') {
                                $scope.publicImgLink = $location.$$protocol + "://" + $location.$$host + $scope.serverAddress + '/getlogo?id=' + $scope.companyLogo;
                            } else {
                                $scope.publicImgLink = "https://cleverstaff.net/images/sprite/icon_128_128_png.png";
                            }
                        }
                    });
                } else {
                    notificationService.error($filter('translate')('vacancy not found'));
                    $location.path("vacancies");
                }

            }, function (err) {
                //notificationService.error($filter('translate')('service temporarily unvailable'));
            });
        };
        $scope.pushCandidateToVacancy = function(candidate, all){
            if(candidate.added){
                var candidateAdded = false;
                for(var key in $scope.candidatesAddToVacancyIds){
                    if(candidate.candidateId == $scope.candidatesAddToVacancyIds[key])
                        candidateAdded = true;
                }
                if(!candidateAdded){
                    $scope.candidatesAddToVacancyIds.push(candidate.candidateId.candidateId);
                    $scope.addCandidateChangeStage.push(candidate.candidateId)
                }
            }else if(candidate.added == false && all == undefined){
                $scope.candidatesAddToVacancyIds.splice($scope.candidatesAddToVacancyIds.indexOf(candidate.candidateId.candidateId), 1);
                $scope.addCandidateChangeStage.splice($scope.addCandidateChangeStage.indexOf(candidate.candidateId), 1);
            }
        };
        $scope.pushAllCandidatesToVacancy = function () {
            $scope.checkAllCandidates = !$scope.checkAllCandidates;
            angular.forEach($scope.dataForVacancy, function(resp){
                angular.forEach($scope.candidatesAddToVacancyIds, function(ids){
                    if(resp.candidate == ids){
                        $scope.candidatesAddToVacancyIds.splice($scope.candidatesAddToVacancyIds.indexOf(resp.candidateId.candidateId), 1);
                        $scope.addCandidateChangeStage.splice($scope.addCandidateChangeStage.indexOf(resp.candidateId.candidateId), 1);
                    }
                });
                if($scope.checkAllCandidates && resp.candidateId.status != 'archived'){
                    resp.added = true
                }else{
                    resp.added = false;
                }
                if(!$scope.checkAllCandidates){
                    $scope.candidatesAddToVacancyIds.splice(0, $scope.candidatesAddToVacancyIds.length-1);
                    $scope.addCandidateChangeStage.splice(0, $scope.addCandidateChangeStage.length-1);
                }
                $scope.pushCandidateToVacancy(resp, 'all');
            });
        };

        $scope.updateTasks = function (needReload) {
            Task.get({
                //'creator': $rootScope.me.userId,
                'vacancyId': $scope.vacancy.vacancyId
            }, function (resp) {
                if (resp.status == 'ok') {
                    $scope.totalTasksNumber = 0;
                    $scope.totalTasksNumber = resp.total;
                    $scope.vacancyTasks = resp.objects;
                    if ($scope.urlTaskId && needReload) {
                        $rootScope.responsiblePersonsEdit = [];
                        angular.forEach($scope.vacancyTasks, function (resp) {
                            if (resp.taskId == $scope.urlTaskId ) {
                                $rootScope.editableTask = resp;
                                $scope.showModalEditTaskToCandidate($rootScope.editableTask);
                                $location.$$absUrl = $location.$$absUrl.split("&")[0];

                            }
                        });
                        if ($rootScope.editableTask) {
                            if($location.$$absUrl.indexOf('&task=') == -1)
                            $location.$$absUrl = $location.$$absUrl + '&task=' + $scope.urlTaskId;
                            angular.forEach($rootScope.editableTask.responsiblesPerson, function (resp) {
                                angular.forEach($rootScope.persons, function (res) {
                                    if (resp.responsible.userId == res.userId) {
                                        $rootScope.responsiblePersonsEdit.push(res);
                                        res.notShown = true;
                                        //$rootScope.persons.splice($rootScope.persons.indexOf(res), 1);
                                    }
                                });
                            });
                            $('.editTaskInCandidate').modal('setting', {
                                onHide: function () {
                                    $scope.urlTaskId = null;
                                    $location.$$absUrl = $location.$$absUrl.split("&")[0];
                                    $scope.$apply();
                                }
                            }).modal('show');
                        }
                    }
                } else {
                    notificationService.error(resp.message);
                }
            })
        };
        $scope.getEmailTemplates = function () {
            Mail.getTemplatesVacancy({vacancyId: $scope.vacancy.vacancyId,type:"candidateCreateInterviewNotification"},function(data){
                $scope.emailTemplates = data.objects;
                if(localStorage.editTemplate){
                    $scope.VacanciesInfCandidTaskHistClientFunc('settings');
                    angular.forEach($scope.emailTemplates,function(template){
                        if(template.type == localStorage.editTemplate){
                            setTimeout(function(){
                                $scope.showEditEmailTemplate(template);
                            },1)
                        }
                    });
                    delete localStorage.editTemplate
                }
            })
        };

        $scope.settingAccess = function(event, status){
            let target = event.target, id = status.customInterviewStateId || status.value,
                url = $location.$$absUrl.split('stage=')[1];

            if ($rootScope.me.recrutRole !== 'admin' || !$scope.showMoveble) return;
            if($(target).hasClass('fa-unlock')){
                Vacancy.requestHideState({
                    stateId: id
                })
                    .then(responce => {
                        status.hidden = true;
                        if(url  == id){
                            $scope.visiable = true;
                        }else if(id == 'recalls'){$scope.visiable2 = true;}
                        $scope.noAccess = true;
                        $scope.visiable2 = true;
                        $rootScope.loading = false;
                        $scope.$apply();
                    });
            }else{
                Vacancy.requestOpenHideState({
                    stateId: id
                })
                    .then(responce => {
                        if(url  == id){
                            $scope.visiable = false;
                        }else if(id == 'recalls'){$scope.visiable2 = false;}
                        status.hidden = false;
                        $scope.noAccess = false;
                        $rootScope.loading = false;
                        $scope.$apply();
                    });
            }
            event.stopPropagation();
        };

        function setActiveStatus(status) {
            console.log('go');
            $scope.activeName = status || "longlist";
            $rootScope.activeName = "longlist";
            // $scope.paramForExcell.interviewState = "longlist";
            $scope.activeCustomStageName = "";
            $scope.isInterview = false;
        }

        function updateDefaultStages() {
            $scope.VacancyStatus = Vacancy.interviewStatusNew();
        }

        function updateCustomStages() {
            vacancyStages.requestVacancyStages().
            then((resp)=>{
                var array = [];

                $scope.customStages = resp.object.interviewStates;
                $scope.hiddenStages = resp.object.hiddenLimitRoles;

                angular.forEach($scope.customStages, function (res) {
                    res.value = res.name;
                    res.movable = true;
                    res.added = false;
                    res.count = 0;
                    if (res.status == "A")
                        array.push(res);
                });
                $scope.customStages = array;
                $rootScope.customStages = array;
                $scope.customStagesFull = resp.object;
                $scope.$apply();
                $scope.updateVacancy();
            });
        }
        updateCustomStages();

        if(google){
            $scope.map = {
                center: {
                    latitude: 48.379433,
                    longitude: 31.165579999999977
                },
                zoom: 5,
                options: {
                    panControl: true,
                    zoomControl: true,
                    scaleControl: true,
                    mapTypeControl: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }
            };
            $scope.marker = {
                id: 1,
                title: "",
                coords: {
                    latitude: null,
                    longitude: null
                }
            };
        }
        $scope.editVacancyShare = function () {
            $scope.vacancy.accessType = $scope.vacancy.accessType == 'public' ? 'private' : 'public';
            Vacancy.edit($scope.vacancy, function (resp) {
                if ($scope.vacancy.accessType == "public") {
                    $scope.publicLink = $location.$$protocol + "://" + $location.$$host + "/i#/pv/" + $scope.vacancy.vacancyId;
                    if (frontMode === 'demo') {
                        $scope.publicLink = $location.$$protocol + "://" + $location.$$host + "/di#/pv/" + $scope.vacancy.vacancyId;
                    }
                }
            });
        };

        //$scope.clickSendEmail = function () {
        //    var contacts = "";
        //    angular.forEach($rootScope.me.contacts, function (val) {
        //        if (val.contactType == "phoneMob") {
        //            contacts = ", " + val.value;
        //        }
        //    });
        //    var textTemplate = $filter('translate')('staff-public-link');
        //    var textMessage = textTemplate.replace('{vacancy}', $scope.vacancy.position)
        //        .replace('{link}', $scope.publicLink)
        //        .replace('{fio}', $rootScope.me.firstName)
        //        .replace('{contacts}', contacts);
        //    var mailTemplate = "mailto:?subject={subject}&body={body}";
        //    window.open(mailTemplate
        //        .replace('{subject}', $filter('translate')('vacancy') + " " + $scope.vacancy.position).replace('{body}', encodeURIComponent(textMessage)), '_newtab');
        //};
        $scope.showSendEmailTemplateModal = function(){
            $scope.lang= localStorage.getItem('NG_TRANSLATE_LANG_KEY');
            $rootScope.sendEmailTemplate ={
                toEmails: '',
                vacancyId: $scope.vacancy.vacancyId,
                candidateId: null,
                fullName: null,
                email: '',
                date: null,
                lang: $scope.lang,
                template: {}
            };
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/send-vacancy-by-email.html',
                size: '',
                resolve: function(){

                }
            });
            $scope.modalInstance.closed.then(function() {
                tinyMCE.remove()
            });
            $scope.modalInstance.opened.then(function(){
                setTimeout(function(){
                    tinymce.init({
                        selector: '#sendVacancyModalMCE',
                        mode: 'exact',
                        theme: "modern",
                        height: 150,
                        language: $scope.lang!=undefined ||$scope.lang!=null?$scope.lang:"ru",
                        browser_spellcheck: true,
                        menubar: false,
                        statusbar: false,
                        theme_advanced_resizing: true,
                        plugins: ["advlist autolink lists link image charmap print preview hr anchor pagebreak",
                            "searchreplace visualblocks visualchars code fullscreen",
                            "insertdatetime media nonbreaking save table directionality",
                            "template paste textcolor  "],
                        fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
                        toolbar1: "bold italic forecolor backcolor fontsizeselect | bullist numlist | link",
                        image_advtab: true,
                        toolbar_items_size: 'small',
                        relative_urls: false,
                        setup: function (ed) {
                            ed.on('SetContent', function (e) {

                            });
                            ed.on('change', function(e) {
                                $rootScope.sendEmailTemplate.template.text = tinyMCE.get('sendVacancyModalMCE').getContent();
                            });
                        }
                    });
                    Mail.getTemplateVacancy({vacancyId: $scope.vacancy.vacancyId,type:'seeVacancy'},function(data){

                        //data.text = data.text.replace(/\[\[candidate name\]\]/g, $rootScope.candnotify.fullName);
                        data.object.text = data.object.text.replace(/\[\[vacancy link\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $scope.publicLink+ '">' + $scope.vacancy.position + '</a>');
                        data.object.text = data.object.text.replace(/\[\[recruiter's name\]\]/g, $rootScope.me.fullName);
                        data.object.title = data.object.title.replace(/\[\[vacancy name\]\]/g, $scope.vacancy.position);
                        $rootScope.sendEmailTemplate.template = data.object;
                        $rootScope.sendEmailTemplate.template.text = $rootScope.sendEmailTemplate.template.text.replace(/\[\[candidate name\]\]/g, $rootScope.candnotify.fullName ? $rootScope.candnotify.fullName : "");
                        $rootScope.sendEmailTemplate.template.text = $rootScope.sendEmailTemplate.template.text.replace(/\[\[recruiter's phone\]\]/g, $rootScope.me.phone ? $rootScope.me.phone : "");
                        $rootScope.sendEmailTemplate.template.text = $rootScope.sendEmailTemplate.template.text.replace(/\[\[recruiter's Skype\]\]/g, $rootScope.staticEmailTemplate.skype ? $rootScope.staticEmailTemplate.skype : "");
                        if(!$rootScope.staticEmailTemplate.skype){
                            $rootScope.sendEmailTemplate.template.text = $rootScope.sendEmailTemplate.template.text.replace(/Skype:/g, "");
                        }
                        if($rootScope.staticEmailTemplate.facebook){
                            $rootScope.sendEmailTemplate.template.text = $rootScope.sendEmailTemplate.template.text.replace(/\[\[recruiter's Facebook\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $rootScope.staticEmailTemplate.facebook+ '">' + $rootScope.staticEmailTemplate.facebook + '</a>');
                        } else {
                            $rootScope.sendEmailTemplate.template.text = $rootScope.sendEmailTemplate.template.text.replace(/\[\[recruiter's Facebook\]\]/g, '');
                        }
                        if($rootScope.staticEmailTemplate.linkedin){
                            $rootScope.sendEmailTemplate.template.text = $rootScope.sendEmailTemplate.template.text.replace(/\[\[recruiter's LinkedIn\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $rootScope.staticEmailTemplate.linkedin+ '">' + $rootScope.staticEmailTemplate.linkedin + '</a>');
                        } else {
                            $rootScope.sendEmailTemplate.template.text = $rootScope.sendEmailTemplate.template.text.replace(/\[\[recruiter's LinkedIn\]\]/g, '');
                        }
                        if($rootScope.me.emails.length == 1){
                            $rootScope.sendEmailTemplate.template.text = $rootScope.sendEmailTemplate.template.text.replace(/\[\[recruiterEmail\]\]/g, $rootScope.me.emails[0].email);
                        }
                        tinyMCE.get('sendVacancyModalMCE').setContent(data.object.text);
                        $scope.addEmailInDescriptionFromLocalStorage();
                        if($rootScope.sendEmailTemplate.template.fileId && $rootScope.sendEmailTemplate.template.fileName){
                            $rootScope.fileForSave.push({"fileId": $rootScope.sendEmailTemplate.template.fileId, "fileName": $rootScope.sendEmailTemplate.template.fileName});
                        }
                    });
                },0);
            });
        };
        $rootScope.sendEmailTemplateFunc = function(){
            $rootScope.sendEmailTemplate.template.fileId = $rootScope.fileForSave.length > 0 ? $rootScope.fileForSave[0].fileId : null;
            $rootScope.sendEmailTemplate.template.fileName = $rootScope.fileForSave.length > 0 ? $rootScope.fileForSave[0].fileName : null;
            Mail.sendMailByTemplateVerified($rootScope.sendEmailTemplate, function (resp) {
                if(resp.status == 'ok'){
                    notificationService.success($filter('translate')('Letter sent'));
                    $rootScope.closeModal();
                }else{
                    notificationService.error($filter('translate')('Error connecting integrate with email. Connect it again'));
                }
            });
        };

        if (frontMode === 'war') {
            googleService.checkAuthTimeout();
        }
        //$scope.reloadAdvice = function () {
        //    Candidate.getAdvices({"vacancyId": $scope.vacancy.vacancyId}, function (response) {
        //        $scope.advices = response['objects'];
        //        angular.forEach($scope.customStages, function (resp) {
        //            angular.forEach($scope.advices, function (res) {
        //                if (res.stateInVacancy == resp.customInterviewStateId) {
        //                    res.stateInVacancy = resp.name;
        //                }
        //            });
        //        });
        //    });
        //};
        $rootScope.errorMessageForAddCandidate = {show: false, text: ""};
        $rootScope.select2Options = {allowClear: true};
        $rootScope.recallToInterview = {recall: "", status: "", date: "", comment: "", status_old: null};
        $rootScope.changeStateObject = {status: "", comment: "", placeholder: null};
        $rootScope.changeResponsibleInVacancy = {id: "", comment: "", text: null, name: null};
        $scope.shareObj = {facebook: false, twitter: false, linkedin: false, vk: false};
        $rootScope.addCandidateInInterviewbuttonClicked = false;
        $rootScope.addCandidateInInterview = {
            id: "",
            comment: "",
            status: "longlist",
            buttonClicked: false,
            date: null,
            showSelect: "",
            showText: false,
            text: "",
            addedInVacancy: false,
            select2Obj: null
        };
        $rootScope.changeStatusOfInterviewInVacancy = {
            candidate: "",
            comment: "",
            status: "",
            date: null,
            exportgoogle: false
        };
        $rootScope.changeStatusOfInterviewEmployed = {
            candidate: "",
            comment: "",
            status: "",
            date: null,
            exportgoogle: false
        };
        $rootScope.candnotify = {
            emails: null,
            sendMail: null,
            show: false,
            fullName: '',
            send: false
        };

        $scope.openModalAddRecallToInterview = function (recall, status) {
            $rootScope.addToInterviewForm.status = status;
            $rootScope.recallToInterview.recall = recall;
            $('.addInInterviewFromRecall.modal').modal('show');
            // console.log(recall)
            console.log($rootScope.candnotify, '$rootScope.candnotify')
            $rootScope.candnotify = {};
            $rootScope.candnotify.emails = recall.email.split(",");
            $rootScope.candnotify.sendMail = recall.email;
            $rootScope.candnotify.show = false;
            $rootScope.candnotify.fullName = recall.name + " " + recall.lastName;
            $rootScope.candnotify.send = false;
        };

        $scope.toOneRecall = function (recallId) {
            $location.path("recalls/" + recallId);
        };


        $scope.toOneCandidate = function toOneCandidate(id) {
            if (id && id.candidateId) {
                id = id.candidateId;
            }
            Candidate.one({'id': id}, function (resp) {
                if (resp.status == "ok")
                    $location.path("candidates/" + resp.object.localId);
            });
        };
        $(".changeStatusOfInterviewInVacancyPick1").datetimepicker({
            format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy hh:ii" : "mm/dd/yyyy hh:ii",
            startView: 2,
            minView: 0,
            autoclose: true,
            weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
            language: $translate.use()
        }).on('changeDate', function (data) {
            $rootScope.changeStatusOfInterviewInVacancy.date = data.date;
            $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[interview date and time\]\]/g, $filter('dateFormat2')($('.changeStatusOfInterviewInVacancyPick1').datetimepicker('getDate').getTime(), true));
            $rootScope.emailTemplateInModal.title = $rootScope.emailTemplateInModal.title.replace(/\[\[interview date and time\]\]/g, $filter('dateFormat2')($('.changeStatusOfInterviewInVacancyPick1').datetimepicker('getDate').getTime(), true));
            $scope.$apply();
            tinyMCE.get('modalMCE').setContent($rootScope.emailTemplateInModal.text);
        }).on('hide', function () {
            if ($('.changeStatusOfInterviewInVacancyPick1').val() == "") {
                $rootScope.changeStatusOfInterviewInVacancy.date = null;
            }
        });
        $(".changeStatusOfInterviewEmployed1").datetimepicker({
            format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy" : "mm/dd/yyyy",
            startView: 2,
            minView: 2,
            autoclose: true,
            weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
            language: $translate.use()
        }).on('changeDate', function (data) {
            $rootScope.changeStatusOfInterviewEmployed.date = data.date;
        }).on('hide', function () {
            if ($('.changeStatusOfInterviewEmployed1').val() == "") {
                $rootScope.changeStatusOfInterviewEmployed.date = null;
            }
        });

        $(".addFromAdvicePicker").datetimepicker({
            format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy hh:ii" : "mm/dd/yyyy hh:ii",
            startView: 2, minView: 0,
            autoclose: true,
            weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
            language: $translate.use()
        }).on('changeDate', function (data) {
            // console.log(data);
            $rootScope.addFromAdvice.date = data.date;
        }).on('hide', function () {
            if ($('.addFromAdvicePicker').val() == "") {
                $rootScope.addFromAdvice.date = null;
            }
        });

        $(".dateOfStartEmployement").datetimepicker({
            format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy hh:ii" : "mm/dd/yyyy hh:ii",
            startView: 2, minView: 0,
            autoclose: true,
            weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
            language: $translate.use()
        }).on('changeDate', function (data) {
            $rootScope.changeStatusOfInterviewInVacancy.date = data.date;
        }).on('hide', function () {
            if ($('.changeStatusOfInterviewInVacancyPick1').val() == "") {
                $rootScope.changeStatusOfInterviewInVacancy.date = null;
            }
        });


        $scope.showModalAddCommentToVacancy = function () {
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/add-comment-vacancy.html',
                size: '',
                resolve: function(){

                }
            });
            $(document).unbind("keydown").keydown(function(e) {
                if (e.ctrlKey == true && e.which == 13) {
                    $rootScope.addCommentInVacancy();
                }
            });
        };
        $scope.showModalAddCommentToCandidate = function (candidate) {
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/add-coment-candidate-in-vacancy.html',
                size: '',
                resolve: function(){

                }
            });
            $(document).unbind("keydown").keydown(function(e) {
                if (e.ctrlKey == true && e.which == 13) {
                    $rootScope.addCommentInVacancyToCandidate();
                }
            });
            $rootScope.chosenCandidate = candidate;
            $rootScope.commentVacancyToCandidate.comment = candidate.comment;
        };

        $rootScope.commentVacancy = {
            comment: "",
            loading: false
        };
        $rootScope.commentVacancyToCandidate = {
            comment: "",
            loading: false
        };
        $rootScope.addCommentInVacancy = function () {
            if ($rootScope.commentVacancy.comment != undefined && $rootScope.commentVacancy.comment.length > 0) {
                $scope.commentVacancy.loading = true;
                Vacancy.setMessage({
                    comment: $rootScope.commentVacancy.comment,
                    vacancyId: $scope.vacancy.vacancyId
                }, function (resp) {
                    $scope.commentVacancy.loading = false;
                    $rootScope.commentVacancy.comment = null;
                    if (resp.status == 'ok') {
                        $scope.getLastEvent();
                        $rootScope.closeModal();
                    }
                }, function (error) {
                    $scope.commentVacancy.loading = false;
                });
            }
        };
        $rootScope.addCommentInVacancyToCandidate = function () {

            if ($rootScope.commentVacancyToCandidate.comment != undefined) {
                $scope.commentVacancyToCandidate.loading = true;
                Vacancy.setMessageToCandidate({
                    comment: $rootScope.commentVacancyToCandidate.comment,
                    vacancyId: $scope.vacancy.vacancyId,
                    candidateId: $scope.chosenCandidate.candidateId.candidateId
                }, function (resp) {
                    $scope.commentVacancyToCandidate.loading = false;
                    $rootScope.closeModal();
                    //$rootScope.commentVacancyToCandidate.comment = null;
                    if (resp.status == 'ok') {
                        Vacancy.one({"localId": $scope.vacancy.localId}, function (resp) {
                            console.log("llggl");
                            $scope.vacancy = resp.object;
                            $rootScope.vacancy = resp.object;
                            $scope.tableParams.reload();
                        });
                        $scope.updateVacancy();
                        $scope.getLastEvent();
                    }
                }, function (error) {
                    $scope.commentVacancyToCandidate.loading = false;
                });
            }
        };
        FileInit.initFileVacancy($scope, "vacancy", $filter);
        $scope.callbackFile = function (resp, name) {
            if (!$scope.vacancy.files) {
                $scope.vacancy.files = [];
            }
            $scope.vacancy.files.push(resp);
            $scope.getLastEvent();
        };

        $scope.removeFile = function (id) {

            Vacancy.removeFile({"vacancyId": $scope.vacancy.vacancyId, "fileId": id}, function (resp) {
                if (resp.status == "ok") {
                    $scope.getLastEvent();
                }
            });
            angular.forEach($scope.vacancy.files, function (val, ind) {
                if (val.fileId === id) {

                    $scope.vacancy.files.splice(ind, 1);
                }
            });

        };
        $scope.persons = [];

        $scope.personId = $rootScope.me.personId;

        Person.getAllPersons(function (resp) {
            $scope.statusPerson = resp;
            $scope.associativePerson = resp.object;
            angular.forEach($scope.associativePerson, function (val, key) {
                if (angular.equals(resp.status, 'ok')) {
                    $scope.persons.push($scope.associativePerson[key]);
                }
            });
            $rootScope.persons = $scope.persons;
            $rootScope.personsEdit = $scope.persons;
            var iUser = null;
            for (var i = 0; i <= $scope.persons.length - 1; i++) {
                if ($rootScope.me.userId == $scope.persons[i].userId) {
                    iUser = $scope.persons[i];
                    $scope.persons.splice(i, 1);
                    break;
                }
            }
            if (iUser) {
                $scope.persons.unshift(iUser);
            }

            var personsCount = $scope.associativePerson.length;

            if (personsCount > 1) {
                $scope.needAutoSetResponsible = false;
            } else if (personsCount == 1 && ($scope.vacancy.responsiblesPerson == undefined || $scope.vacancy.responsiblesPerson.length == 0)) {
                $scope.needAutoSetResponsible = true;
            } else {
                $scope.needAutoSetResponsible = false;
            }
        });

        $scope.showAddResponsibleUser = function (person) {
            $rootScope.clickedSaveResponsibleInVacancy = false;
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/vacancy-adding-responsible.html',
                size: '',
                resolve: function(){

                }
            });
            $rootScope.changeResponsibleInVacancy.id = person.userId;
            $rootScope.changeResponsibleInVacancy.name = person.cutFullName;
        };

        $scope.visibility = false;

        $scope.hoverInfoShow = function (flag, index) {
            var text = [
                "Use this template to send the interviw invitation & details when you move candidates to job stages with an interview.",
                "Use this template to describe candidates that thay do not meet the vacancy criteria.",
                "Use this template to send your candidates the letter with the vacancy proposal"
            ];

            if(flag === 'one' ){
                $scope.visibility = true;
            }else if(flag === 'two'){
                $scope.visibility2 = true;
                $scope.message = text[index];
            }
        };
        $scope.hoverInfoHidden = function(flag){
            if(flag === 'one'){
                $scope.visibility = false;
            }else if(flag === 'two'){
                $scope.visibility2 = false;
            }
        };

        $scope.showRemoveResponsibleUser = function (user) {
            var firstName = user.firstName != undefined ? user.firstName : "";
            var lastName = user.lastName != undefined ? user.lastName : "";

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/remove-responsible-from-vacancy.html',
                size: '',
                resolve: function(){

                }
            });
            console.log('here',firstName,lastName);
            $rootScope.changeResponsibleInVacancy.id = user.userId;
            $rootScope.changeResponsibleInVacancy.text = $filter('translate')('Do you want to remove the responsible')
                + " " + firstName + " " + lastName + " " + $filter('translate')("from vacancy") + " " + $scope.vacancy.position;
        };

        $scope.showChangeStatusOfVacancy = function (status) {
            $scope.changeStateObject.status = status;
            $scope.changeStateObject.status_old = $scope.vacancy.status;
            $scope.changeStateObject.placeholder = $filter('translate')('Write_a_comment_why_do_you_change_vacancy_status');
            if (status == 'completed') {
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
            } else {
                if (status != 'inwork') {
                    $scope.modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '../partials/modal/vacancy-change-status.html',
                        size: '',
                        resolve: function(){

                        }
                    });
                } else if (status == 'inwork' && ($scope.vacancy.responsiblesPerson != undefined && $scope.vacancy.responsiblesPerson.length > 0)) {
                    $scope.modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '../partials/modal/vacancy-change-status.html',
                        size: '',
                        resolve: function(){

                        }
                    });
                } else if ($scope.needAutoSetResponsible && status == 'inwork') {
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
        function showChangeStatusModal() {
            $('.changeStatusOfVacancy').modal('show');
            $scope.changeStateObject.status = status;
            $scope.changeStateObject.status_old = $scope.vacancy.status;
            $scope.changeStateObject.placeholder = $filter('translate')('Write_a_comment_why_do_you_change_vacancy_status');
        }

        $('.ui.dropdown').dropdown();
        $rootScope.saveVacancyStatus = function () {
            if (!$rootScope.clickedSaveVacancyStatus) {
                $rootScope.clickedSaveVacancyStatus = true;
                // console.log("DELETE IN VACANCY");
                $rootScope.closeModal();
                Vacancy.changeState({
                    vacancyId: $scope.vacancy.vacancyId,
                    comment: $rootScope.changeStateObject.comment,
                    vacancyState: $rootScope.changeStateObject.status
                }, function (resp) {
                    if (resp.status == "ok") {
                        $scope.vacancy.status = $rootScope.changeStateObject.status;
                        $rootScope.changeStateObject.comment = "";
                        $rootScope.changeStateObject.status = null;
                        notificationService.success($filter('translate')('vacancy change status'));
                        $scope.getLastEvent();
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
        $rootScope.deleteVacancyStatus = function() {
            $scope.vacancy.status = $rootScope.changeStateObject.status;
            $rootScope.closeModal();
            Vacancy.changeState({
                vacancyId: $scope.vacancy.vacancyId,
                comment: $rootScope.changeStateObject.comment,
                vacancyState: $rootScope.changeStateObject.status
            }, function(resp) {
                if (resp.status == "ok") {
                    $rootScope.changeStateObject.comment = "";
                    $rootScope.changeStateObject.status = null;
                    notificationService.success($filter('translate')('vacancy') + " " + $scope.vacancy.position + " " + $filter('translate')('was_deleted_2'));
                    $location.path('/vacancies');


                }
            }, function(err) {
                //notificationService.error($filter('translate')('service temporarily unvailable'));
            });

        };
        $rootScope.saveResponsibleUserInVacancy = function () {
            if (!$rootScope.clickedSaveResponsibleInVacancy) {
                $rootScope.clickedSaveResponsibleInVacancy = true;
                Vacancy.addResponsible({
                    lang: $translate.use(),
                    vacancyId: $scope.vacancy.vacancyId,
                    personId: $rootScope.changeResponsibleInVacancy.id,
                    comment: $rootScope.changeResponsibleInVacancy.comment
                }, function (resp) {
                    if (resp.status === "ok") {
                        $rootScope.clickedSaveResponsibleInVacancy = false;
                        notificationService.success($filter('translate')('vacancy set responsible'));
                        $scope.vacancy.responsiblesPerson = resp.object.responsiblesPerson;
                        $scope.getLastEvent();
                    }

                }, function (err) {
                    //notificationService.error($filter('translate')('service temporarily unvailable'));
                });
                $rootScope.closeModal();
                $rootScope.changeResponsibleInVacancy.comment = "";
                $rootScope.changeResponsibleInVacancy.id = "";
            }
        };
        $scope.changeResponsibleRole = function(responsible){
            Vacancy.addResponsible({
                lang: $translate.use(),
                vacancyId: $scope.vacancy.vacancyId,
                personId: responsible.responsible.userId,
                responsibleType: responsible.type
                //komment: $rootScope.changeResponsibleInVacancy.comment
            }, function (resp) {
                if (resp.status === "ok") {
                    notificationService.success($filter('translate')('vacancy set responsible'));
                    $scope.vacancy.responsiblesPerson = resp.object.responsiblesPerson;
                    $scope.getLastEvent();
                }

            }, function (err) {
                //notificationService.error($filter('translate')('service temporarily unvailable'));
            });
        };
        $rootScope.removeResponsibleUserInVacancy = function () {
            if (!$rootScope.clickedremoveResponsibleUserInVacancy) {
                $rootScope.clickedremoveResponsibleUserInVacancy = true;

                Vacancy.removeResponsible({
                    vacancyId: $scope.vacancy.vacancyId,
                    personId: $rootScope.changeResponsibleInVacancy.id,
                    comment: $rootScope.changeResponsibleInVacancy.comment
                }, function (resp) {
                    if (resp.status === "ok") {
                        notificationService.success($filter('translate')('vacancy remove responsible'));
                        $scope.vacancy.responsiblesPerson = resp.object.responsiblesPerson;
                        $scope.getLastEvent();
                    }
                    $rootScope.closeModal();
                    $rootScope.changeResponsibleInVacancy.comment = "";
                    $rootScope.changeResponsibleInVacancy.id = "";
                    $rootScope.clickedremoveResponsibleUserInVacancy = false;
                }, function (err) {
                    $rootScope.clickedremoveResponsibleUserInVacancy = false;
                    //notificationService.error($filter('translate')('service temporarily unvailable'));
                });
            }
        };
        $scope.status = Vacancy.status();
        $scope.statusAssoc = Vacancy.getStatusAssociated();
        $rootScope.statusInter = Vacancy.getInterviewStatus();

        $scope.callbackAddPromoLogo = function(photo) {
            if(photo != undefined){
                $('#owner_photo_wrap').css('width', '13%');
                $rootScope.promoLogo = photo;
                if($rootScope.promoLogo != undefined){
                    $rootScope.promoLogoLink = $location.$$protocol + "://" + $location.$$host + $scope.serverAddress + "/getlogo?id=" + $rootScope.promoLogo + "&d=true";
                }else{
                    $rootScope.promoLogoLink = "https://cleverstaff.net/images/sprite/vacancy-new.jpg";
                }
            }else{
                $('#owner_photo_wrap').css('width', '100%');
            }
        };

        $scope.numberOfCandidatesInDifferentStates = function () {
            var totalCount = 0;
            Vacancy.getCounts({
                vacancyId:$scope.vacancy.vacancyId
            },function(statusesCount){
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

        $.getScript("https://platform.linkedin.com/in.js?async=true", function success() {
            IN.init({
                api_key: apiKey.linkedIn.api_key,
                scope: "r_emailaddress w_share"
            });
        });
        $.getScript('//connect.facebook.net/en_UK/sdk.js', function () {
            FB.init({
                appId: apiKey.facebook.appId,
                version: 'v2.9'
            });
        });
        $scope.addPublish = function publish(type) {
            var DNA = true;
            $scope.requestToAddPublishCame = true;
            if ($scope.vacancy.publish != undefined && $scope.vacancy.publish.length > 0) {
                angular.forEach($scope.vacancy.publish, function (val) {
                    if (val.type == type) {
                        DNA = false;
                    }
                });
            }
            if (DNA && $scope.requestToAddPublishCame) {
                $scope.requestToAddPublishCame = false;
                Vacancy.addPublish({"vacancyId": $scope.vacancy.vacancyId, "type": type}, function (resp) {
                    if ($scope.vacancy.publish == undefined) {
                        $scope.vacancy.publish = [];
                    }
                    $scope.shareObj[resp.object.type] = true;
                    $scope.vacancy.publish.push(resp.object);
                    $scope.requestToAddPublishCame = true;
                });
            }
        };

        $scope.share = function (sourse) {
            var link = $location.$$protocol + "://" + $location.$$host + "/i#/vacancy-" + $scope.vacancy.localId;
            if (frontMode === 'demo') {
                link = $location.$$protocol + "://" + $location.$$host + "/di#/vacancy-" + $scope.vacancy.localId;
            }
            if (sourse === 'linkedin') {
                if (!IN.User.isAuthorized()) {
                    IN.User.authorize(function () {
                        IN.API.Raw("/people/~/shares")
                            .method("POST")
                            .body(JSON.stringify({
                                "content": {
                                    "submitted-url": link,
                                    "title": $filter('translate')('Vacancy') + ' ' + $scope.vacancy.position,
                                    "description": $scope.publicDescr,
                                    "submitted-image-url": $scope.publicImgLink
                                },
                                "visibility": {
                                    "code": "anyone"
                                },
                                "comment": ''
                            }))
                            .result(function (r) {
                                notificationService.success($filter('translate')('Vacancy posted on your LinkedIn'));
                                $scope.addPublish('linkedin');
                                autoRefreshIN();
                            })
                            .error(function (r) {
                                notificationService.error(r.message);
                            });
                    }, "w_share");
                } else {
                    IN.API.Raw("/people/~/shares")
                        .method("POST")
                        .body(JSON.stringify({
                            "content": {
                                "submitted-url": link,
                                "title": $filter('translate')('Vacancy') + ' ' + $scope.vacancy.position,
                                "description": $scope.publicDescr,
                                "submitted-image-url": $scope.publicImgLink
                            },
                            "visibility": {
                                "code": "anyone"
                            },
                            "comment": ""
                        }))
                        .result(function (r) {
                            notificationService.success($filter('translate')('Vacancy posted on your LinkedIn'));
                            $scope.addPublish('linkedin');
                            autoRefreshIN();
                        })
                        .error(function (r) {
                            notificationService.error(r.message);
                        });
                }
            }
            if (sourse === 'facebook') {
                console.log($scope.facebookAppId);
                FB.getLoginStatus(function (response) {
                    var setinterval =  setInterval(()=>{
                        let frame = document.querySelector('.FB_UI_Dialog');
                        if(frame){
                            frame.setAttribute('width','600px');
                            frame.setAttribute('style','min-width:600px;');
                            frame.style.minWidth = '600px !important';
                            frame.style.width = '600px !important';
                            clearInterval(setinterval)
                        }
                },1000);

                    if (response.status === 'connected') {
                        console.log(response);
                        FB.ui({
                                method: 'feed',
                                name: $filter('translate')('Vacancy') + ' ' + $scope.vacancy.position,
                                caption: '',
                                description: $scope.publicDescr,
                                link: link,
                                picture: $scope.publicImgLink
                            },
                            function (response) {
                                console.log(response);
                                if(response.error_message){
                                    notificationService.error($filter('translate')('Vacancy hasn\'t shared'));
                                }
                            });
                    }
                    else {

                        FB.login(function (response) {
                            if(response.authResponse){
                                FB.ui({
                                        method: 'feed',
                                        name: $filter('translate')('Vacancy') + ' ' + $scope.vacancy.position,
                                        caption: '',
                                        description: $scope.publicDescr,
                                        link: link,
                                        picture: $scope.publicImgLink,
                                    },
                                    function (response) {
                                    console.log(response);
                                        if(response.error_message){
                                            notificationService.error($filter('translate')('Vacancy hasn\'t shared'));
                                        }
                                });
                            }
                        });
                    }
                });
            }
        };
        $scope.$watch('sortValue',function(newVal, oldVal){
            if(newVal != undefined){
                $scope.tableParams.reload()
            }
        });
        $scope.tableParams = new ngTableParams({
            page: $scope.a.searchNumber,
            count: 15
        }, {
            total: 0,
            getData: function ($defer, params) {
                if($scope.vacancy){
                    $rootScope.loading = true;
                    $scope.finalCandidate = null;
                    $scope.candidatesAddToVacancyIds = [];
                    $scope.addCandidateChangeStage = [];
                    $rootScope.candidatesAddToVacancyIds = $scope.candidatesAddToVacancyIds;
                    $rootScope.addCandidateChangeStage = $scope.addCandidateChangeStage;
                    $scope.vacancySearchParams = {
                        state: $scope.activeName,
                        page: {number:(params.$params.page - 1),count:params.$params.count},
                        vacancyId: $scope.vacancy.vacancyId,
                        withCandidates: true,
                        withVacancies: false,
                        name: $scope.searchCandidateName,
                        interviewSortEnum: $scope.sortValue
                        //sortOrder: $scope.sortOrder
                    };
                    var cd = [];

                    function getCandidates(page, count){
                        if(page || count) {
                            $scope.vacancySearchParams.page.number = page;
                            $scope.vacancySearchParams.page.count = count;
                        } else {
                            $scope.isShowMore = false;
                            if(document.getElementById('scrollup'))
                                document.getElementById('scrollup').style.display = 'none';
                        }
                        Vacancy.getCandidatesInStages($scope.vacancySearchParams, function(resp){
                            Vacancy.candidateLastRequestParams = $scope.vacancySearchParams;
                            localStorage.setItem('objectSize', resp.total);
                            Vacancy.getCandidate = (resp.objects && resp.objects.length)?resp.objects.map(item => item.candidateId.localId):[];
                            localStorage.setItem('candidateLastRequestParams', JSON.stringify($scope.vacancySearchParams));
                            $scope.numberOfCandidatesInDifferentStates();
                            $scope.candidatesInStages = resp.objects;
                            data = (resp.objects && resp.objects.length)? resp.objects.map((item)=> item.candidateId.localId):[];
                            localStorage.setItem('candidatesInStagesVac', JSON.stringify(data));
                            angular.forEach(resp.objects, function (val) {
                                angular.forEach($scope.VacancyStatusFiltered, function (res) {
                                    if(res.customInterviewStateId == val.state){
                                        if(res.type == 'interview'){
                                            val.isInterview = true;
                                        }else{
                                            val.isInterview = false;
                                        }
                                        val.state = res.name;
                                    }
                                });
                                cd.push(val);
                            });
                            params.total(resp['total']);
                            $rootScope.objectSize = resp['objects'] ? resp['total'] : 0;
                            $scope.paginationParams = {
                                currentPage: $scope.vacancySearchParams.page.number,
                                totalCount: $rootScope.objectSize
                            };
                            let pagesCount = Math.ceil(resp['total']/$scope.vacancySearchParams.page.count);
                            if(pagesCount == $scope.vacancySearchParams.page.number + 1) {
                                $('#show_more').hide();
                            } else {
                                $('#show_more').show();
                            }
                            $defer.resolve($filter('orderBy')(resp['objects'], ['-dc']));
                            if (cd && $scope.showTable !== 'recalls') {
                                if ($scope.activeName === 'approved' && cd.length > 0) {
                                    $scope.showTable = "final";
                                    $scope.finalCandidate = cd;
                                } else if (cd.length > 0) {
                                    $scope.showTable = "table";
                                } else {
                                    $scope.showTable = "not available";
                                }
                            }


                            function hiddenCandidateOnStages() {
                                var urlStage = $location.$$absUrl.split('stage=')[1],
                                    stages = $scope.VacancyStatusFiltered.map(item => item.customInterviewStateId || item.value),
                                    index = stages.indexOf(urlStage), elem;
                                if(!$scope.showSearchCandidate) {
                                    if($scope.VacancyStatusFiltered.length > 0 && index !== -1){
                                        elem  = $scope.VacancyStatusFiltered[index].customInterviewStateId || $scope.VacancyStatusFiltered[index].value;
                                    }else{
                                        return;
                                    }

                                    if(elem == urlStage && (!$scope.VacancyStatusFiltered[index]['hidden']) || $rootScope.me.recrutRole !== 'client' ){
                                        $scope.dataForVacancy = cd;
                                        $defer.resolve(cd);
                                        $scope.noAccess = false;
                                    }else if(elem  == urlStage && $scope.VacancyStatusFiltered[index]['hidden']){
                                        $scope.visiable = true;
                                        $scope.noAccess = true;
                                    }else if(!$scope.visiable){
                                        $scope.dataForVacancy = cd;
                                        $scope.noAccess = false;
                                        $defer.resolve(cd);
                                    }else{
                                        $scope.noAccess = true;
                                    }
                                } else {
                                    $scope.dataForVacancy = cd;
                                    $scope.dataForVacancy.map((item) => {
                                        console.log(item.state,item.isInterview);
                                    });
                                    $defer.resolve(cd);
                                }

                            }

                            hiddenCandidateOnStages();

                        $scope.loadingCandidates = false;
                        $rootScope.loading = false;
                    });
                    $scope.a.searchNumber = $scope.tableParams.page();
                    }
                    getCandidates();
                    $scope.showMore = function () {
                        $scope.isShowMore = true;
                        Service.dynamicTableLoading(params.total(), $scope.vacancySearchParams.page.number, $scope.vacancySearchParams.page.count, getCandidates)
                    };
            }
        }
        });

        //$scope.tableParams2 = initTable();

        $scope.fileForSave = [];
        $rootScope.fileForSave = [];    /*For modal window*/

        FileInit.initVacancyTemplateFileOption($scope, "", "", false, $filter);
        $scope.callbackFileForTemplate = function(resp, names) {
            $scope.fileForSave.push({"fileId": resp, "fileName": names});
            $rootScope.fileForSave.push({"fileId": resp, "fileName": names});
        };
        //$scope.removeFile = function(id) {
        //    angular.forEach($scope.fileForSave, function(val, ind) {
        //        if (val.attId === id) {
        //            $scope.fileForSave.splice(ind, 1);
        //        }
        //    });
        //};
        $rootScope.removeFile = function(id) {
            angular.forEach($rootScope.fileForSave, function(val, ind) {
                if (val.attId === id) {
                    $rootScope.fileForSave.splice(ind, 1);
                }
            });
        };

        $rootScope.toChangeStatusInterview = function (status, candidate, withChooseStatus) {
            if (status == undefined) {
                $rootScope.changeStatusOfInterviewInVacancy.status =null;
                //$rootScope.changeStatusOfInterviewInVacancy.status = {
                //    value: "longlist",
                //    withDate: false,
                //    defaultS: true,
                //    single: false,
                //    added: true,
                //    active_color: "longlist_color",
                //    useAnimation: false,
                //    count: 0,
                //    forAdd: true
                //};

            }
            if (withChooseStatus == undefined || withChooseStatus == false) {
                angular.forEach($scope.VacancyStatusFiltered, function (val) {
                    if (val.value == status || $filter('translate')('interview_status_assoc_full.' + val.value) == status.trim()) {
                        $rootScope.changeStatusOfInterviewInVacancy.status = val;
                    }
                });
            } else if (withChooseStatus) {
                var value = $filter('filter')($scope.VacancyStatus, {used: true});
                $rootScope.changeStatusOfInterviewInVacancy.statusObject = [];
                angular.forEach($scope.VacancyStatusFiltered, function (resp) {
                    if (resp.value != 'approved' && resp.value != 'notafit' && resp.value != 'no_response') {
                        $rootScope.changeStatusOfInterviewInVacancy.statusObject.push(resp);
                    }
                });
            }
            if($rootScope.changeStatusOfInterviewInVacancy.status.value == 'interview' ||
                $rootScope.changeStatusOfInterviewInVacancy.status.withDate ||
                $rootScope.changeStatusOfInterviewInVacancy.status.value == 'longlist' ||
                $rootScope.changeStatusOfInterviewInVacancy.status.value == 'shortlist' ||
                $rootScope.changeStatusOfInterviewInVacancy.status.value == 'notafit' ||
                $rootScope.changeStatusOfInterviewInVacancy.status.value == 'declinedoffer' ||
                $rootScope.changeStatusOfInterviewInVacancy.status.value == 'no_response' ||
                $rootScope.changeStatusOfInterviewInVacancy.status.value == 'no_contacts' ||
                $rootScope.changeStatusOfInterviewInVacancy.status.type == 'interview' ||
                $rootScope.changeStatusOfInterviewInVacancy.status.type == 'refuse'){
                var templateType = 'candidateCreateInterviewNotification';
                if($rootScope.changeStatusOfInterviewInVacancy.status.value == 'notafit' ||
                    $rootScope.changeStatusOfInterviewInVacancy.status.value == 'declinedoffer' ||
                    $rootScope.changeStatusOfInterviewInVacancy.status.value == 'no_response' ||
                    $rootScope.changeStatusOfInterviewInVacancy.status.value == 'no_contacts' ||
                    $rootScope.changeStatusOfInterviewInVacancy.status.type == 'refuse'){
                    templateType = 'refuseCandidateInVacancy'
                }else if($rootScope.changeStatusOfInterviewInVacancy.status.value == 'longlist' ||
                    $rootScope.changeStatusOfInterviewInVacancy.status.value == 'shortlist'){
                    templateType = 'seeVacancy'
                }
                Mail.getTemplateVacancy({vacancyId: $scope.vacancy.vacancyId,type:templateType},function(data){
                    $rootScope.fileForSave = [];
                    $rootScope.emailTemplateInModal = data.object;
                    console.log($rootScope.candnotify, '$rootScope.candnotify');
                    $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[candidate name\]\]/g, $rootScope.candnotify.fullName ? $rootScope.candnotify.fullName : candidate.candidateId.fullName);
                    $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[vacancy link\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $scope.publicLink+ '">' + $scope.vacancy.position + '</a>');
                    $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's name\]\]/g, $rootScope.me.fullName);
                    $rootScope.emailTemplateInModal.title = $rootScope.emailTemplateInModal.title.replace(/\[\[vacancy link\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $scope.publicLink+ '">' + $scope.vacancy.position + '</a>');
                    $rootScope.emailTemplateInModal.title = $rootScope.emailTemplateInModal.title.replace(/\[\[vacancy name\]\]/g, $scope.vacancy.position);
                    $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's phone\]\]/g, $rootScope.me.phone ? $rootScope.me.phone : "");
                    $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's Skype\]\]/g, $rootScope.staticEmailTemplate.skype ? $rootScope.staticEmailTemplate.skype : "");
                    if(!$rootScope.staticEmailTemplate.skype){
                        $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/Skype:/g, "");
                    }
                    if($rootScope.staticEmailTemplate.facebook){
                        $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's Facebook\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $rootScope.staticEmailTemplate.facebook+ '">' + $rootScope.staticEmailTemplate.facebook + '</a>');
                    }else{
                        $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's Facebook\]\]/g, '');
                    }
                    if($rootScope.staticEmailTemplate.linkedin){
                        $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's LinkedIn\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $rootScope.staticEmailTemplate.linkedin+ '">' + $rootScope.staticEmailTemplate.linkedin + '</a>');
                    }else{
                        $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's LinkedIn\]\]/g, '');
                    }
                    if($rootScope.me.emails.length == 1){
                        $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiterEmail\]\]/g, $rootScope.me.emails[0].email);
                    }
                    tinyMCE.get('modalMCE').setContent($rootScope.emailTemplateInModal.text);
                    if(localStorage.emailThatAlreadyUsed){
                        $scope.addEmailFromLocalStorage(localStorage.emailThatAlreadyUsed);
                    }
                    if($rootScope.emailTemplateInModal.fileId && $rootScope.emailTemplateInModal.fileName){
                        $rootScope.fileForSave.push({"fileId": $rootScope.emailTemplateInModal.fileId, "fileName": $rootScope.emailTemplateInModal.fileName});
                    }
                })
            }
            if (candidate.state == 'approved' && $rootScope.me.recrutRole != 'admin') {
                notificationService.error($filter('translate')('Transfer from the status of approved can only Admin'));
                return;
            }
            //$rootScope.changeStatusOfInterviewInVacancy.withChooseStatus = withChooseStatus;
            $rootScope.changeStatusOfInterviewInVacancy.candidate = candidate;
            $rootScope.changeStatusOfInterviewInVacancy.approvedCount = $scope.approvedCount;
            $rootScope.candnotify = {};
            $rootScope.candnotify.sendMail = (candidate.candidateId.email && candidate.candidateId.email.length)? candidate.candidateId.email.split(/[',',' ']/gi)[0]: '';
            if($rootScope.candidatesAddToVacancyIds.length == 1){
                Candidate.getContacts({"candidateId": candidate[0].candidateId}, function (resp) {
                    var email = "";
                    angular.forEach(resp.objects, function (c) {
                        if (c.type == "email") {
                            email = c.value;
                        }
                    });
                    $rootScope.candnotify.emails = email.replace(/ /gi, "").split(",");
                    // $rootScope.candnotify.sendMail = $rootScope.candnotify.emails[0];
                });
                $rootScope.candnotify.show = false;
                $rootScope.candnotify.fullName = candidate[0].fullName;
                $rootScope.candnotify.send = false;
            }

            if (status == 'approved') {
                $rootScope.showEmployedFields = true;
                $rootScope.probationaryPeriod = null;
            } else {
                $rootScope.showEmployedFields = false;
            }
            $('.changeStatusOfInterviewInVacancy.modal').modal('show');
        };

        $rootScope.changeStatusInAddCandidate = function () {
            if (!$rootScope.addCandidateInInterviewbuttonClicked) {
                var candidateId = $("#candidateToAddInInterview").select2('data') !== null ? $("#candidateToAddInInterview").select2('data').id : null;
                var changeObj = $rootScope.changeStatusOfInterviewInVacancy;
                var candidateObj = $rootScope.addCandidateInInterview;
                var date = $('.addCandidateInInterviewPicker').datetimepicker('getDate') != null && candidateObj.status.withDate ? $('.addCandidateInInterviewPicker').datetimepicker('getDate') : null;
                angular.forEach($scope.vacancy.interviews, function (val) {
                    if (val.candidateId.candidateId == candidateId) {
                        changeObj.candidate = val;
                    }
                });
                if (changeObj.candidate.state == 'approved' && $rootScope.me.recrutRole != 'admin') {
                    $rootScope.errorMessageForAddCandidate.text = $filter('translate')('Transfer from the status of approved can only Admin');
                    $rootScope.errorMessageForAddCandidate.show = true;
                    return;
                }
                changeObj.status = candidateObj.status;
                changeObj.comment = candidateObj.comment;
                $rootScope.addCandidateInInterviewbuttonClicked = true;
                $rootScope.saveStatusInterviewInVacancy(date);
                $('.addCandidateInInterviewPicker').val("");
                $('.addCandidateInInterview.modal').modal('hide');
            }
        };

        $rootScope.saveStatusInterviewInVacancy = function (customDate, sendTemplate) {
            if($rootScope.emailTemplateInModal){
                if($rootScope.emailTemplateInModal.text.indexOf("//") > -1 && $rootScope.candnotify.send){
                    var templateError = true;
                    if($rootScope.emailTemplateInModal.text.indexOf("http://") > -1 || $rootScope.emailTemplateInModal.text.indexOf("https://") > -1){
                        var templateError = false;
                    }
                }
            }
            var neededRequest = 'editInterview';
            if($rootScope.changeStatusOfInterviewInVacancy && $rootScope.changeStatusOfInterviewInVacancy.candidate && $rootScope.changeStatusOfInterviewInVacancy.candidate.recallId){
                neededRequest = 'addInterview';
            }

            if(!templateError){
                if((!$rootScope.candnotify.sendMail) && sendTemplate ){
                    notificationService.error($filter('translate')("enter_email_candidate"));
                    return;
                }

                if (!$rootScope.clickedSaveStatusInterviewInVacancy) {
                    $rootScope.clickedSaveStatusInterviewInVacancy = true;
                    $rootScope.changeStatusOfInterviewInVacancy.errorMessage = false;
                    var changeObj = $rootScope.changeStatusOfInterviewInVacancy;
                    if (changeObj.status == 'declinedoffer' && changeObj.comment == '') {
                        $rootScope.changeStatusOfInterviewInVacancy.errorMessage = true;
                        return;
                    }
                    if ($rootScope.showEmployedFields) {
                        changeObj.date = $('.changeStatusOfInterviewEmployed1').datetimepicker('getDate') != null ? $('.changeStatusOfInterviewEmployed1').datetimepicker('getDate') : customDate != undefined ? customDate : null;
                    } else {
                        changeObj.date = $('.changeStatusOfInterviewInVacancyPick1').datetimepicker('getDate') != null ? $('.changeStatusOfInterviewInVacancyPick1').datetimepicker('getDate') : customDate != undefined ? customDate : null;
                    }
                    if (changeObj.status) {
                        if ($rootScope.showEmployedFields) {
                            Vacancy[neededRequest]({
                                "personId": $scope.personId,
                                "vacancyId": $scope.vacancy.vacancyId,
                                "recallId": neededRequest == 'addInterview'?$rootScope.changeStatusOfInterviewInVacancy.candidate.recallId:null,
                                "candidateId": changeObj.candidate.candidateId.candidateId,
                                "interviewId": changeObj.candidate.interviewId,
                                "interviewState": changeObj.status.customInterviewStateId ? changeObj.status.customInterviewStateId : changeObj.status.value,
                                "comment": changeObj.comment,
                                "lang": $translate.use(),
                                "probationaryPeriod": $rootScope.probationaryPeriod,
                                "dateEmployee": changeObj.date != null ? changeObj.date.getTime() : null
                            }, function (resp) {
                                if (resp.status == "ok") {
                                    $rootScope.clickedSaveStatusInterviewInVacancy = false;
                                    if (frontMode === 'war' && $scope.selectedCalendar != undefined) {
                                        if ((changeObj.status.withDate || changeObj.status.type == 'interview') && changeObj != undefined && changeObj.date != null) {
                                            if (changeObj.status.customInterviewStateId) {
                                                var id = resp.object.interviewId + changeObj.status.customInterviewStateId;
                                            } else {
                                                var id = resp.object.interviewId + changeObj.status.value;
                                            }
                                        }
                                    }
                                    Vacancy.one({"localId": $scope.vacancy.localId}, function (resp) {
                                        $scope.vacancy = resp.object;
                                        $rootScope.vacancy = resp.object;
                                        $scope.recalls = resp.object.recalls;
                                        if($scope.showTable !== 'recalls') {
                                            if($scope.dataForVacancy.length == 1 && $scope.a.searchNumber > 1) {
                                                $scope.tableParams.page($scope.a.searchNumber - 1);
                                                $scope.tableParams.reload();
                                            } else {
                                                $scope.tableParams.reload();
                                            }
                                        }
                                        $scope.numberOfCandidatesInDifferentStates();
                                    });
                                    changeObj.candidate.state = changeObj.status.value;
                                    changeObj.candidate.dateInterview = changeObj.date;
                                    if ((changeObj.status.withDate || changeObj.status.type == 'interview') && changeObj.date && $rootScope.candnotify.send && $rootScope.candnotify.sendMail.length > 1) {
                                        var candnotify = $rootScope.candnotify;
                                        Vacancy.sendInterviewCreateMail({
                                                "email": candnotify.sendMail,
                                                "vacancyId": $scope.vacancy.vacancyId,
                                                "candidateId": changeObj.candidate.candidateId.candidateId,
                                                "fullName": candnotify.fullName,
                                                "date": changeObj.date,
                                                "lang": $translate.use()
                                            },
                                            function (resp) {
                                            });
                                    }

                                    $rootScope.changeStatusOfInterviewInVacancy = {
                                        candidate: "",
                                        comment: "",
                                        status: "",
                                        date: null,
                                        exportgoogle: false
                                    };
                                    $rootScope.addCandidateInInterviewbuttonClicked = false;
                                    $rootScope.closeModal();
                                    $('.changeStatusOfInterviewInVacancyPick1').val("");
                                    $scope.numberOfCandidatesInDifferentStates();
                                    $scope.getLastEvent();
                                } else if (resp.status == "error") {
                                    $rootScope.clickedSaveStatusInterviewInVacancy = false;
                                    notificationService.error(resp.message);
                                }
                            }, function (err) {
                                $rootScope.clickedSaveStatusInterviewInVacancy = false;
                                //notificationService.error($filter('translate')('service temporarily unvailable'));
                                $rootScope.addCandidateInInterviewbuttonClicked = false;
                            });
                        } else if(!$rootScope.showEmployedFields && $rootScope.candidatesAddToVacancyIds.length == 1 ) {
                            Vacancy[neededRequest]({
                                "personId": $scope.personId,
                                "recallId": neededRequest == 'addInterview'?$rootScope.changeStatusOfInterviewInVacancy.candidate.recallId:null,
                                "vacancyId": $scope.vacancy.vacancyId,
                                "candidateId": changeObj.candidate[0].candidateId ? changeObj.candidate[0].candidateId : changeObj.candidate[0].candidateId,
                                "interviewState": changeObj.status.customInterviewStateId ? changeObj.status.customInterviewStateId : changeObj.status.value,
                                "comment": changeObj.comment,
                                "date": changeObj.date !== null ? changeObj.date.getTime() : null,
                                "lang": $translate.use()
                            }, function (resp) {
                                if (resp.status == "ok") {
                                    $rootScope.clickedSaveStatusInterviewInVacancy = false;
                                    if ($scope.selectedCalendar != undefined) {
                                        if ((changeObj.status.withDate || changeObj.status.type == 'interview') && changeObj != undefined && changeObj.date != null) {
                                            if (changeObj.status.customInterviewStateId) {
                                                var id = resp.object.interviewId + changeObj.status.customInterviewStateId;
                                            } else {
                                                var id = resp.object.interviewId + changeObj.status.value;
                                            }
                                        }
                                    }
                                    Vacancy.one({"localId": $scope.vacancy.localId}, function (resp) {
                                        console.log("gooo");
                                        $scope.vacancy = resp.object;
                                        $rootScope.vacancy = resp.object;
                                        $scope.recalls = resp.object.recalls;
                                        if($scope.showTable !== 'recalls') {
                                            if($scope.dataForVacancy.length == 1 && $scope.a.searchNumber > 1) {
                                                $scope.tableParams.page($scope.a.searchNumber - 1);
                                                $scope.tableParams.reload();
                                            } else {
                                                $scope.tableParams.reload();
                                            }
                                        }
                                        $scope.numberOfCandidatesInDifferentStates();

                                        //$scope.tableParams2.reload();
                                    });
                                    changeObj.candidate.state = changeObj.status.value;
                                    changeObj.candidate.dateInterview = changeObj.date;
                                    if ($rootScope.candnotify.send && $rootScope.candnotify.sendMail.length > 1 && sendTemplate) {
                                        if ($rootScope.candnotify.sendMail.length > 1) {
                                            var candnotify = $rootScope.candnotify;
                                            Mail.sendMailByTemplateVerified({
                                                    toEmails: candnotify.sendMail,
                                                    vacancyId: $scope.vacancy.vacancyId,
                                                    candidateId: changeObj.candidate.candidateId.candidateId,
                                                    fullName: candnotify.fullName,
                                                    email: $rootScope.emailTemplateInModal.email,
                                                    date: changeObj.date,
                                                    lang: $scope.lang,
                                                    template: {
                                                        type: $rootScope.emailTemplateInModal.type,
                                                        title: $rootScope.emailTemplateInModal.title,
                                                        text: $rootScope.emailTemplateInModal.text,
                                                        fileId: $rootScope.fileForSave.length > 0 ? $rootScope.fileForSave[0].fileId : null,
                                                        fileName: $rootScope.fileForSave.length > 0 ? $rootScope.fileForSave[0].fileName : null
                                                    }
                                                },
                                                function (resp) {
                                                    if(resp.status != 'ok'){
                                                        notificationService.error($filter('translate')('Error connecting integrate with email. Connect it again'));
                                                    }
                                                });
                                        }else{
                                            $rootScope.emailError = true;
                                        }
                                    }
                                    $rootScope.changeStatusOfInterviewInVacancy = {
                                        candidate: "",
                                        comment: "",
                                        status: "",
                                        date: null,
                                        exportgoogle: false
                                    };
                                    $rootScope.addCandidateInInterviewbuttonClicked = false;
                                    $rootScope.closeModal();
                                    $('.changeStatusOfInterviewInVacancyPick1').val("");
                                    $scope.getLastEvent();
                                } else if (resp.status == "error") {
                                    $rootScope.clickedSaveStatusInterviewInVacancy = false;
                                    notificationService.error(resp.message);
                                }
                            }, function (err) {
                                $rootScope.clickedSaveStatusInterviewInVacancy = false;
                                //notificationService.error($filter('translate')('service temporarily unvailable'));
                                $rootScope.addCandidateInInterviewbuttonClicked = false;
                            });
                        }else if(!$rootScope.showEmployedFields && $rootScope.candidatesAddToVacancyIds.length > 1 ) {
                            Vacancy.editInterviews({
                                "personId": $scope.personId,
                                "recallId": neededRequest == 'addInterview'?$rootScope.changeStatusOfInterviewInVacancy.candidate.recallId:null,
                                "vacancyId": $scope.vacancy.vacancyId,
                                "candidateIds": $rootScope.candidatesAddToVacancyIds ? $rootScope.candidatesAddToVacancyIds : $rootScope.candidatesAddToVacancyIds,
                                "interviewState": changeObj.status.customInterviewStateId ? changeObj.status.customInterviewStateId : changeObj.status.value,
                                "comment": changeObj.comment,
                                "date": changeObj.date !== null ? changeObj.date.getTime() : null,
                                "lang": $translate.use()
                            }, function (resp) {
                                if (resp.status == "ok") {
                                    $rootScope.clickedSaveStatusInterviewInVacancy = false;
                                    $scope.checkAllCandidates = false;
                                    notificationService.success($filter('translate')('The candidates have been successfully moved to the stage') + ' ' + '"' + $filter('translate')(changeObj.status.value) + '"');
                                    if ($scope.selectedCalendar != undefined) {
                                        if ((changeObj.status.withDate || changeObj.status.type == 'interview') && changeObj != undefined && changeObj.date != null) {
                                            if (changeObj.status.customInterviewStateId) {
                                                var id = resp.object.interviewId + changeObj.status.customInterviewStateId;
                                            } else {
                                                var id = resp.object.interviewId + changeObj.status.value;
                                            }
                                        }
                                    }
                                    Vacancy.one({"localId": $scope.vacancy.localId}, function (resp) {
                                        console.log("gooo");
                                        $scope.vacancy = resp.object;
                                        $rootScope.vacancy = resp.object;
                                        $scope.recalls = resp.object.recalls;
                                        if($scope.showTable !== 'recalls') {
                                            if($scope.dataForVacancy.length == 1 && $scope.a.searchNumber > 1) {
                                                $scope.tableParams.page($scope.a.searchNumber - 1);
                                                $scope.tableParams.reload();
                                            } else {
                                                $scope.tableParams.reload();
                                            }
                                        }
                                        $scope.numberOfCandidatesInDifferentStates();

                                        //$scope.tableParams2.reload();
                                    });
                                    changeObj.candidate.state = changeObj.status.value;
                                    changeObj.candidate.dateInterview = changeObj.date;
                                    if ($rootScope.candnotify.send && $rootScope.candnotify.sendMail.length > 1 && sendTemplate) {
                                        if ($rootScope.candnotify.sendMail.length > 1) {
                                            var candnotify = $rootScope.candnotify;
                                            Mail.sendMailByTemplateVerified({
                                                    toEmails: candnotify.sendMail,
                                                    vacancyId: $scope.vacancy.vacancyId,
                                                    candidateId: changeObj.candidate.candidateId.candidateId,
                                                    fullName: candnotify.fullName,
                                                    email: $rootScope.emailTemplateInModal.email,
                                                    date: changeObj.date,
                                                    lang: $scope.lang,
                                                    template: {
                                                        type: $rootScope.emailTemplateInModal.type,
                                                        title: $rootScope.emailTemplateInModal.title,
                                                        text: $rootScope.emailTemplateInModal.text,
                                                        fileId: $rootScope.fileForSave.length > 0 ? $rootScope.fileForSave[0].fileId : null,
                                                        fileName: $rootScope.fileForSave.length > 0 ? $rootScope.fileForSave[0].fileName : null
                                                    }
                                                },
                                                function (resp) {
                                                    if(resp.status != 'ok'){
                                                        notificationService.error($filter('translate')('Error connecting integrate with email. Connect it again'));
                                                    }
                                                });
                                        }else{
                                            $rootScope.emailError = true;
                                        }
                                    }
                                    $rootScope.changeStatusOfInterviewInVacancy = {
                                        candidate: "",
                                        comment: "",
                                        status: "",
                                        date: null,
                                        exportgoogle: false
                                    };
                                    $rootScope.addCandidateInInterviewbuttonClicked = false;
                                    $rootScope.closeModal();
                                    $('.changeStatusOfInterviewInVacancyPick1').val("");
                                    $scope.getLastEvent();
                                } else if (resp.status == "error") {
                                    $rootScope.clickedSaveStatusInterviewInVacancy = false;
                                    notificationService.error(resp.message);
                                }
                            }, function (err) {
                                $rootScope.clickedSaveStatusInterviewInVacancy = false;
                                //notificationService.error($filter('translate')('service temporarily unvailable'));
                                $rootScope.addCandidateInInterviewbuttonClicked = false;
                            });
                        } else {
                            Vacancy[neededRequest]({
                                "personId": $scope.personId,
                                "recallId": neededRequest == 'addInterview'?$rootScope.changeStatusOfInterviewInVacancy.candidate.recallId:null,
                                "vacancyId": $scope.vacancy.vacancyId,
                                "candidateId": changeObj.candidate.candidateId.candidateId ? changeObj.candidate.candidateId.candidateId : changeObj.candidate.candidateId,
                                "interviewState": changeObj.status.customInterviewStateId ? changeObj.status.customInterviewStateId : changeObj.status.value,
                                "comment": changeObj.comment,
                                "date": changeObj.date !== null ? changeObj.date.getTime() : null,
                                "lang": $translate.use()
                            }, function (resp) {
                                if (resp.status == "ok") {
                                    $rootScope.clickedSaveStatusInterviewInVacancy = false;
                                    if ($scope.selectedCalendar != undefined) {
                                        if ((changeObj.status.withDate || changeObj.status.type == 'interview') && changeObj != undefined && changeObj.date != null) {
                                            if (changeObj.status.customInterviewStateId) {
                                                var id = resp.object.interviewId + changeObj.status.customInterviewStateId;
                                            } else {
                                                var id = resp.object.interviewId + changeObj.status.value;
                                            }
                                        }
                                    }
                                    Vacancy.one({"localId": $scope.vacancy.localId}, function (resp) {
                                        console.log("gooo");
                                        $scope.vacancy = resp.object;
                                        $rootScope.vacancy = resp.object;
                                        $scope.recalls = resp.object.recalls;
                                        if($scope.showTable !== 'recalls') {
                                            if($scope.dataForVacancy.length == 1 && $scope.a.searchNumber > 1) {
                                                $scope.tableParams.page($scope.a.searchNumber - 1);
                                                $scope.tableParams.reload();
                                            } else {
                                                $scope.tableParams.reload();
                                            }
                                        }
                                        $scope.numberOfCandidatesInDifferentStates();

                                        //$scope.tableParams2.reload();
                                    });
                                    changeObj.candidate.state = changeObj.status.value;
                                    changeObj.candidate.dateInterview = changeObj.date;
                                    if ($rootScope.candnotify.send && $rootScope.candnotify.sendMail.length > 1 && sendTemplate) {
                                        if ($rootScope.candnotify.sendMail.length > 1) {
                                            var candnotify = $rootScope.candnotify;
                                            Mail.sendMailByTemplateVerified({
                                                    toEmails: candnotify.sendMail,
                                                    vacancyId: $scope.vacancy.vacancyId,
                                                    candidateId: changeObj.candidate.candidateId.candidateId,
                                                    fullName: candnotify.fullName,
                                                    email: $rootScope.emailTemplateInModal.email,
                                                    date: changeObj.date,
                                                    lang: $scope.lang,
                                                    template: {
                                                        type: $rootScope.emailTemplateInModal.type,
                                                        title: $rootScope.emailTemplateInModal.title,
                                                        text: $rootScope.emailTemplateInModal.text,
                                                        fileId: $rootScope.fileForSave.length > 0 ? $rootScope.fileForSave[0].fileId : null,
                                                        fileName: $rootScope.fileForSave.length > 0 ? $rootScope.fileForSave[0].fileName : null
                                                    }
                                                },
                                                function (resp) {
                                                    if(resp.status != 'ok'){
                                                        notificationService.error($filter('translate')('Error connecting integrate with email. Connect it again'));
                                                    }
                                                });
                                        }else{
                                            $rootScope.emailError = true;
                                        }
                                    }
                                    $rootScope.changeStatusOfInterviewInVacancy = {
                                        candidate: "",
                                        comment: "",
                                        status: "",
                                        date: null,
                                        exportgoogle: false
                                    };
                                    $rootScope.addCandidateInInterviewbuttonClicked = false;
                                    $rootScope.closeModal();
                                    $('.changeStatusOfInterviewInVacancyPick1').val("");
                                    $scope.getLastEvent();
                                } else if (resp.status == "error") {
                                    $rootScope.clickedSaveStatusInterviewInVacancy = false;
                                    notificationService.error(resp.message);
                                }
                            }, function (err) {
                                $rootScope.clickedSaveStatusInterviewInVacancy = false;
                                //notificationService.error($filter('translate')('service temporarily unvailable'));
                                $rootScope.addCandidateInInterviewbuttonClicked = false;
                            });
                        }
                    } else {
                        $rootScope.clickedSaveStatusInterviewInVacancy = false;
                        notificationService.error($filter('translate')('You must select a stage'));
                    }
                }
            }else{
                notificationService.error($filter('translate')('Please delete all comments'))
            }
        };

        $scope.showRecalls = function (status) {
            if ($scope.showMoveble) return;
            $scope.visiable2 = status.hidden;
            $scope.visiable = false;

            if($scope.visiable2 && $rootScope.me.recrutRole == 'client'){
                $scope.noAccess = true;
            }else{
                $('#recallsTable').show();
                $('.pagination-block').hide();
                $scope.noAccess = false;
            }

            $scope.activeName = 'recalls';
            if($scope.recalls && $scope.recalls.length > 0) {
                $scope.showTable = 'recalls';
            } else {
                $scope.showTable = 'not available';
            }
            $scope.activeCustomStageName = '';
        };

        $scope.toEdit = function (id) {
            $location.path();
        };

        $scope.toAddCandidateForm = function (state, showSelect, showText, withoutChangeStatusInVacancyAutocopleater) {
            if (withoutChangeStatusInVacancyAutocopleater == undefined) {
                $rootScope.withoutChangeStatusInVacancyAutocopleater = false;
            } else {
                $rootScope.withoutChangeStatusInVacancyAutocopleater = true;
            }
            $rootScope.addCandidateInInterviewbuttonClicked = false;
            $("#candidateToAddInInterview").select2("val", null);
            $rootScope.errorMessageForAddCandidate.show = false;
            $rootScope.addCandidateInInterview.addedInVacancy = false;
            $rootScope.addCandidateInInterview.select2Obj = null;
            $rootScope.addCandidateInInterview.comment = "";
            if (state != null) {
                angular.forEach($scope.VacancyStatus, function (val) {
                    if (val.used) {
                        angular.forEach(val.status, function (valS) {
                            if (valS.value == state) {
                                $rootScope.addCandidateInInterview.status = valS;
                            }
                        })
                    }
                });
            } else {
                $rootScope.addCandidateInInterview.status = {
                    value: "longlist",
                    withDate: false,
                    defaultS: true,
                    single: false,
                    added: true,
                    active_color: "longlist_color",
                    useAnimation: false,
                    count: 0,
                    forAdd: true
                };
            }
            $rootScope.addCandidateInInterview.showText = showText;
            $rootScope.addCandidateInInterview.showSelect = showSelect;
            var value = $filter('filter')($scope.VacancyStatus, {used: true});

            $rootScope.addCandidateInInterview.statusObject = $scope.VacancyStatusFiltered;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/vacancy-candidate-add.html',
                size: '',
                scope: $scope,
                resolve: function(){

                }
            });
            $rootScope.candnotify = {};
            $rootScope.candnotify.show = false;
            $rootScope.candnotify.send = false;
            $scope.modalInstance.opened.then(function() {
                setTimeout(function(){
                    $("#addCandidateInInterview").find("option").eq(0).remove();
                    tinymce.init({
                        selector: '#modalMCECandidate',
                        mode: 'exact',
                        theme: "modern",
                        height: 145,
                        language: $scope.lang!=undefined ||$scope.lang!=null?$scope.lang:"ru",
                        browser_spellcheck: true,
                        menubar: false,
                        statusbar: false,
                        theme_advanced_resizing: true,
                        plugins: ["advlist autolink lists link image charmap print preview hr anchor pagebreak",
                            "searchreplace visualblocks visualchars code fullscreen",
                            "insertdatetime media nonbreaking save table directionality",
                            "template paste textcolor  "],
                        fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
                        toolbar1: "bold italic forecolor backcolor fontsizeselect | bullist numlist | link",
                        image_advtab: true,
                        toolbar_items_size: 'small',
                        relative_urls: false,
                        setup: function (ed) {
                            ed.on('SetContent', function (e) {

                            });
                            ed.on('change', function(e) {
                                $rootScope.emailTemplateInModal.text = tinyMCE.get('modalMCECandidate').getContent();
                            });
                        }
                    });
                    $(".addCandidateInInterviewPicker").datetimepicker({
                        format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy hh:ii" : "mm/dd/yyyy hh:ii",
                        startView: 2, minView: 0,
                        autoclose: true,
                        isTrigger: 0,
                        useLocalTimezone: false,
                        defaultTimezone: '+0000',
                        showTimezone: true,
                        weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                        language: $translate.use()
                    }).on('changeDate', function (data) {
                        $scope.interviewDate = $rootScope.addCandidateInInterview.date = data.date;
                        $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[interview date and time\]\]/g, $filter('dateFormat2')($('.addCandidateInInterviewPicker').datetimepicker('getDate').getTime(), true));
                        $rootScope.emailTemplateInModal.title = $rootScope.emailTemplateInModal.title.replace(/\[\[interview date and time\]\]/g, $filter('dateFormat2')($('.addCandidateInInterviewPicker').datetimepicker('getDate').getTime(), true));
                        $scope.$apply();
                        tinyMCE.get('modalMCECandidate').setContent($rootScope.emailTemplateInModal.text);
                    }).on('hide', function () {
                        if ($('.addCandidateInInterviewPicker').val() == "") {
                            $rootScope.addCandidateInInterview.date = null;
                        }
                        $('.addCandidateInInterviewPicker').blur();
                    });
                    $rootScope.changeTemplateInAddCandidate($rootScope.addCandidateInInterview.status);
                    $("#candidateToAddInInterview").on("change", function (e) {
                        Candidate.getContacts({"candidateId": e.val}, function (resp) {
                            var email = "";
                            angular.forEach(resp.objects, function (c) {
                                if (c.type == "email") {
                                    email = c.value;
                                }
                            });
                            $rootScope.candnotify.emails = email.replace(/ /gi, "").split(",");
                            $rootScope.candnotify.sendMail = $rootScope.candnotify.emails[0];
                        });
                        $rootScope.candnotify.fullName = $(this).select2('data').text;
                    });
                },0);
            });
            $scope.modalInstance.closed.then(function() {
                $rootScope.candnotify.show = false;
                tinyMCE.remove()
            });
        };
        $scope.validateNotifyModal = function () {
            if(!$rootScope.candnotify.sendMail) {
                $('.candEmail').addClass('empty');
                notificationService.error($filter('translate')("enter_email_candidate"));
            } else if (!$scope.interviewDate) {
                $('.addCandidateInInterviewPicker').addClass('empty');
            }
        };
        $("#candidateToAddInInterview").on("change", function (e) {
            Candidate.getContacts({"candidateId": e.val}, function (resp) {
                var email = "";
                angular.forEach(resp.objects, function (c) {
                    if (c.type == "email") {
                        email = c.value;
                    }
                });
                $rootScope.candnotify.emails = email.replace(/ /gi, "").split(",");
                $rootScope.candnotify.sendMail = $rootScope.candnotify.emails[0];
            });
            $rootScope.candnotify.fullName = $(this).select2('data').text;
        });

        $rootScope.saveCandidateInVacancy = function (sendTemplate, flag) {
            if(!$rootScope.candnotify.sendMail && flag){
                notificationService.error($filter('translate')("enter_email_candidate"));
                return;
            }
            if($rootScope.me.recrutRole != 'client') {
                if (!$rootScope.addCandidateInInterviewbuttonClicked ) {
                    $rootScope.errorMessageForAddCandidate.show = false;
                    if ($("#candidateToAddInInterview").select2('data') == null) {
                        $rootScope.errorMessageForAddCandidate.show = true;
                        $rootScope.errorMessageForAddCandidate.text = $filter('translate')('You must select a candidate');
                        return;
                    }
                    var candidateObj = $rootScope.addCandidateInInterview;
                   $rootScope.errorMessageForAddCandidate.show = false;
                    var candidateId = $("#candidateToAddInInterview").select2('data') !== null ? $("#candidateToAddInInterview").select2('data').id : null;
                    var candidateFullName = $("#candidateToAddInInterview").select2('data') !== null ? $("#candidateToAddInInterview").select2('data').text : null;
                    candidateObj.date = $('.addCandidateInInterviewPicker').datetimepicker('getDate') != null && (candidateObj.status.withDate || candidateObj.status.type == 'interview') ? $('.addCandidateInInterviewPicker').datetimepicker('getDate') : null;
                    $rootScope.addCandidateInInterviewbuttonClicked = true;
                    $scope.interviewDate = candidateObj.date;
                    if(!sendTemplate) {
                        $rootScope.closeModal();
                    }

                    vacancyAddInterview (Vacancy, $scope.vacancy.vacancyId, $scope.vacancy.position,
                        candidateId,
                        candidateObj.comment,
                        candidateObj.status.customInterviewStateId? candidateObj.status.customInterviewStateId : candidateObj.status.value,
                        candidateObj.date, function (resp) {
                            $rootScope.addCandidateInInterviewbuttonClicked = false;
                            if (!$rootScope.$$phase) {
                                $rootScope.$apply();
                            }

                            if (!$scope.vacancy.interviews) {
                                $scope.vacancy.interviews = [];
                            }
                            if (candidateObj.status.customInterviewStateId) {
                                resp.object.state = candidateObj.status.name;
                                resp.object.customStage = true;
                            } else {
                                resp.object.state = candidateObj.status.value;
                            }
                            $scope.vacancy.interviews.push(resp.object);

                            $rootScope.autocomplete.interviews = $scope.vacancy.interviews;

                            $scope.tableParams.reload();
                            //$scope.tableParams2.reload();

                            $scope.numberOfCandidatesInDifferentStates();
                            if ($scope.vacancy && $scope.vacancy.status == "open" && resp.object && resp.object.vacancyId && resp.object.vacancyId.status == "inwork") {
                                $scope.vacancy.status = "inwork";
                                $scope.getLastEvent(2);
                            } else {
                                $scope.getLastEvent();
                            }
                            $rootScope.addCandidateInInterview = {
                                id: "",
                                comment: "",
                                status: "longlist",
                                date: null,
                                showSelect: "",
                                showText: false,
                                text: "",
                                addedInVacancy: false,
                                select2Obj: null
                            };
                            $("#candidateToAddInInterview").select2("val", null);
                            $('.addCandidateInInterviewPicker').val("");
                        }, function (resp) {
                            $rootScope.addCandidateInInterviewbuttonClicked = false;
                            $rootScope.errorMessageForAddCandidate.show = true;
                            $rootScope.errorMessageForAddCandidate.text = resp.message;
                        }, frontMode, notificationService, googleService, $scope.selectedCalendar != undefined ? $scope.selectedCalendar.id : null, $filter, $translate.use(), $rootScope);

                    Person.getActivePersonCount(function (resp) {
                        $scope.countActivePersons = resp.message;
                        if ($scope.countActivePersons == 1 && ($scope.vacancy.responsiblesPerson == undefined || $scope.vacancy.responsiblesPerson.length == 0)) {
                            Vacancy.one({"localId": $scope.vacancy.localId}, function (resp) {
                                console.log("tru123e");
                                $scope.vacancy.responsiblesPerson = resp.object.responsiblesPerson;
                            });
                        }

                    });
                    if($rootScope.candnotify.send && sendTemplate){
                        var candnotify = $rootScope.candnotify;
                        var changeObj = $rootScope.changeStatusOfInterviewInVacancy;

                        Mail.sendMailByTemplate({
                            toEmails: candnotify.sendMail,
                            vacancyId: $scope.vacancy.vacancyId,
                            candidateId: candidateId,
                            fullName: candidateFullName,
                            email: $rootScope.emailTemplateInModal.email,
                            date: candidateObj.date.getTime(),
                            lang: $scope.lang,
                            template: {
                                type: $rootScope.emailTemplateInModal.type,
                                title: $rootScope.emailTemplateInModal.title,
                                text: $rootScope.emailTemplateInModal.text,
                                fileId: $rootScope.fileForSave.length > 0 ? $rootScope.fileForSave[0].fileId : null,
                                fileName: $rootScope.fileForSave.length > 0 ? $rootScope.fileForSave[0].fileName : null
                            }
                        }, function (resp) {
                            if(resp.status == 'ok'){
                                notificationService.success($filter('translate')('Letter sent'));
                                $('.addCandidateInInterview.modal').modal('hide');
                                $rootScope.closeModal();
                            }else{
                                notificationService.error($filter('translate')('Error connecting integrate with email. Connect it again'));
                            }
                        });
                    }
                }
            } else {
                $rootScope.closeModal();
                notificationService.error($filter('translate')('This feature is not available for your role'));
            }
        };

        $rootScope.addFromAdvice = {
            id: "",
            comment: "",
            status: "longlist",
            date: null,
            showSelect: "",
            showText: false,
            text: "",
            state: "state"
        };
        $rootScope.errorAddFromAdvice = {
            show: false,
            text: ""
        };
        $scope.showFromAdvice = function (candidateId, title) {
            $rootScope.addFromAdvice.status = {
                value: "longlist",
                withDate: false,
                defaultS: true,
                single: false,
                added: true,
                active_color: "longlist_color",
                useAnimation: false,
                count: 0,
                forAdd: true
            };
            $rootScope.addFromAdvice.candidateId = candidateId;
            $rootScope.addFromAdvice.title = title;
            $rootScope.addFromAdvice.state = "vacancy";
            var value = $filter('filter')($scope.VacancyStatus, {used: true});
            $rootScope.addFromAdvice.statusObject = $scope.VacancyStatusFiltered;
            $('.addFromAdvice').modal('show');
            $rootScope.candnotify = {};
            $rootScope.candnotify.show = false;
            Candidate.getContacts({"candidateId": candidateId}, function (resp) {
                var email = "";
                angular.forEach(resp.objects, function (c) {
                    if (c.type == "email") {
                        email = c.value;
                    }
                });
                $rootScope.candnotify.emails = email.replace(/ /gi, "").split(",");
                $rootScope.candnotify.sendMail = $rootScope.candnotify.emails[0];
            });
            $rootScope.candnotify.show = false;
            $rootScope.candnotify.fullName = title;
            $rootScope.candnotify.send = false;
            //if (localStorageService.get("candnotify") == "false") {
            //    $rootScope.candnotify.send = false;
            //} else {
            //    $rootScope.candnotify.send = true;
            //}
        };

        $rootScope.saveFromAdvice = function () {
            $rootScope.saveFromAdviceClicked = true;
            var candidateId = $rootScope.addFromAdvice.candidateId;
            if ($rootScope.addFromAdvice.status.customInterviewStateId) {
                $rootScope.addFromAdvice.status.value = $rootScope.addFromAdvice.status.customInterviewStateId;
            }
            $rootScope.errorAddFromAdvice.show = false;
            $rootScope.addFromAdvice.date = $('.addFromAdvicePicker').datetimepicker('getDate') != null ? $('.addFromAdvicePicker').datetimepicker('getDate') : null;
            if ($rootScope.saveFromAdviceClicked) {
                vacancyAddInterviewFromAdvice(Vacancy, $scope.vacancy.vacancyId, $scope.vacancy.position,
                    candidateId,
                    $rootScope.addFromAdvice.comment,
                    $rootScope.addFromAdvice.status.value,
                    $rootScope.addFromAdvice.date, function (resp) {
                        $rootScope.saveFromAdviceClicked = false;
                        $('.addFromAdvice').modal('hide');
                        if (!$scope.vacancy.interviews) {
                            $scope.vacancy.interviews = [];
                        }
                        $scope.vacancy.interviews.push(resp.object);
                        $scope.tableParams.reload();
                        //$scope.tableParams2.reload();
                        $scope.numberOfCandidatesInDifferentStates();
                        $rootScope.addFromAdvice.comment = "";
                        $rootScope.addFromAdvice.id = null;
                        $rootScope.addFromAdvice.status = null;
                        $rootScope.addFromAdvice.date = null;
                        //$scope.reloadAdvice();
                        $scope.getLastEvent();
                    }, function (resp) {
                        $rootScope.errorAddFromAdvice.show = true;
                        $rootScope.errorAddFromAdvice.text = resp.message;
                    }, frontMode, notificationService, googleService, $scope.selectedCalendar != undefined ? $scope.selectedCalendar.id : null, $filter, $translate.use(), $rootScope);
            }
        };

        $scope.goToReportPage = function () {
            var path = 'vacancy/report/' + $scope.vacancy.localId;
            $location.path(path);
        };

        $scope.openQuestionMenu = function () {
            var questionCont = $("#noticesQuestion");
            if (questionCont.css('display') == 'none') {
                $("#agreedQuestion").css({"background-color": "rgba(0, 0, 0, 0.11)"});
                questionCont.show('slide', {direction: 'left'}, 400);
                $(document).mouseup(function (e) {
                    var noticesElement = $("#agreedQuestionOuter");
                    if ($("#agreedQuestionOuter").has(e.target).length === 0) {
                        questionCont.hide();
                        $("#agreedQuestion").css({"background-color": "rgba(0, 0, 0, 0)"});
                        $(document).off('mouseup');
                    }
                });
            } else {
                questionCont.hide();
                $("#agreedQuestion").css({"background-color": "rgba(0, 0, 0, 0)"});
                $(document).off('mouseup')
            }
        };

        $scope.denyQuestion = function () {
            $.ajax({
                url: "/hr/vacancy/saveAnswer",
                type: "POST",
                data: '{"value":"NO","vacancyId":"' + $scope.vacancy.vacancyId + '"}',
                //data: $("#questionForm").serialize(),
                dataType: "json",
                contentType: "application/json",
                success: function (data) {
                    $rootScope.changeQuestionWindow();
                }
            });
        };

        $scope.showDeleteInterview = function (client) {

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/vacancy-remove-candidate.html',
                size: '',
                resolve: function(){

                }
            });
            $rootScope.client = client;
            $rootScope.candidateRemoveId = client.candidateId.candidateId;
            $rootScope.candidateInterviewId = client.interviewId;
            $rootScope.deleteInterview.comment = "";
            //$rootScope.deleteInterview.text = $filter('translate')('Delete')
            //+" " + client.candidateId.fullName + "  " + $filter('translate')("from vacancy");
        };

        $rootScope.deleteInterview = function () {
            Vacancy.removeInterview({
                vacancyId: $scope.vacancy.vacancyId,
                candidateId: $rootScope.candidateRemoveId,
                comment: $rootScope.deleteInterview.comment
            }, function (resp) {
                if (resp.status === "ok") {
                    notificationService.success($filter('translate')('Candidate removed') + " " + $filter('translate')('from vacancy'));
                }
                $rootScope.closeModal();
                $rootScope.deleteInterview.comment = "";
                console.log('length ', $scope.dataForVacancy.length,$scope.a.searchNumber)
                if($scope.dataForVacancy.length == 1 && $scope.a.searchNumber > 1) {
                    $scope.tableParams.page($scope.a.searchNumber - 1);
                    $scope.tableParams.reload();
                } else {
                    $scope.tableParams.reload();
                }
                $scope.numberOfCandidatesInDifferentStates();
                $scope.getLastEvent();
            }, function (err) {
                //notificationService.error($filter('translate')('service temporarily unvailable'));
            })
        };
        $scope.changeCommentFlag = function(history){
            history.editCommentFlag = !history.editCommentFlag;
            $scope.editComment = history.descr;
            history.showAllCandidates = false;
        };
        $scope.openMenuWithCandidates = function(history){
            history.showAllCandidates = !history.showAllCandidates;
            history.editCommentFlag = false;
        };
        $scope.changeComment = function (action, comment) {
            if(comment.length > 0){
                Action.editAction({"comment": comment, "actionId": action.actionId}, function (resp) {
                    if (resp.status && angular.equals(resp.status, "error")) {
                        notificationService.error(resp.message);
                    }
                    else {
                        action.editCommentFlag = false;
                        action.descr = resp.object.descr;
                        action.new_komment = '';
                        action.dateEdit = resp.object.dateEdit;
                    }
                });
            }
        };

        $scope.showDeleteComment = function (resp) {
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/delete-comment-candidate.html',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            $rootScope.commentRemove = resp;
            $rootScope.commentRemoveId = resp.actionId;
        };

        $rootScope.deleteComment = function () {
            Action.removeMessageAction({
                actionId: $rootScope.commentRemoveId
            }, function (resp) {
                if (resp.status === "ok") {
                    notificationService.success($filter('translate')('Comment removed'));
                } else {
                    //notificationService.error($filter('translate')('service temporarily unvailable'));
                }
                $rootScope.closeModal();
                $scope.updateVacancy();
            })
        };
        $scope.showCommentsFirstTime = function () {
            Service.history({
                "vacancyId": $scope.vacancy !== undefined ? $scope.vacancy.vacancyId : null,
                "candidateId": null,
                "clientId": null,
                "page": {"number": 0, "count": $scope.historyLimit},
                "type": 'all_actions'
            }, function (res) {
                $scope.history = res.objects;
                $scope.historyLimit = res.objects !== undefined ? res.size : null;
                $scope.historyTotal = res.objects !== undefined ? res.total : null;
            });
        };

        $scope.changeHistoryType = function () {
            Service.history({
                "vacancyId": $scope.vacancy !== undefined ? $scope.vacancy.vacancyId : null,
                "candidateId": null,
                "clientId": null,
                "page": {"number": 0, "count": $scope.historyLimit},
                "type": $scope.historyType.value
            }, function (res) {
                $scope.history = res.objects;
                $scope.historyLimit = res.objects !== undefined ? res.size : null;
                $scope.historyTotal = res.objects !== undefined ? res.total : null;
                var array = [];
                angular.forEach($scope.history, function (value) {
                    if (value.stateNew && value.type == "set_interview_status") {
                        array = value.stateNew.split(",");
                        angular.forEach($scope.customStages, function (val) {
                            angular.forEach(array, function (resp) {
                                if (val.customInterviewStateId == resp) {
                                    array[array.indexOf(val.customInterviewStateId)] = val.name;
                                }
                            });
                        });
                        value.stateNew = array.toString();
                    }
                });

            });
        };

        $scope.searchAdvicesFunc = function () {
            $rootScope.searchAdvies = true;
        };
        $scope.sortableOptions = {
            draggable: ".moveble",
            onSort: function (evt) {
                $scope.$apply(function() {
                    let resortedStages = [];
                    let notMovable = [];
                    notMovable =_.filter($scope.VacancyStatusFiltered, {'movable': false});
                    notMovable.forEach(oneStage => {
                        //longlist always first, approved - always last, for vacancy funnel !
                        if(oneStage.value == 'longlist')
                            resortedStages.push(oneStage);
                    });
                    $scope.movableStages.forEach(function (obj) {
                        resortedStages.push(obj);
                    });
                    notMovable.forEach(oneStage => {
                        //longlist always first, approved - always last, for vacancy funnel !
                        if(oneStage.value != 'longlist')
                        resortedStages.push(oneStage);
                    });
                    var checkValue = [];
                    $scope.extraStatusObj.show = false;
                    angular.forEach(resortedStages, function (val) {
                        if (val.added && !val.name) {
                            checkValue.push(val.value)
                        }
                        if (val.name) {
                            checkValue.push(val.customInterviewStateId)
                        }
                    });
                    Vacancy.setInterviewStatus({
                        vacancyId: $scope.vacancy.vacancyId,
                        interviewStatus: checkValue.toString()
                    }, function (val) {
                        $scope.extraStatusObjSucces.show = true;
                        $scope.getLastEvent();
                    });
                });
            }
        };
        $scope.showEditStage = function (status) {
            $rootScope.addingRefuseStage = false;
            $rootScope.editedStage.type = status.type;
            $rootScope.editedStage.name = status.name;
            $rootScope.editedStage.customInterviewStateId = status.customInterviewStateId;
            $rootScope.editedStage.status = status.status;
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/edit-status-of-interview-in-vacancy.html',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            //$('.editStatusOfInterviewInVacancy.modal').modal('show');
        };
        $scope.showEditRefuseStage = function (status) {
            $rootScope.addingRefuseStage = true;
            $rootScope.editedStage.type = status.type;
            $rootScope.editedStage.name = status.name;
            $rootScope.editedStage.customInterviewStateId = status.customInterviewStateId;
            $rootScope.editedStage.status = status.status;
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/edit-status-of-interview-in-vacancy.html',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            //$('.editStatusOfInterviewInVacancy.modal').modal('show');
        };

        $rootScope.editStatus = function () {
            vacancyStages.edit({
                type: $rootScope.editedStage.type,
                name: $rootScope.editedStage.name,
                customInterviewStateId: $rootScope.editedStage.customInterviewStateId,
                status: $rootScope.editedStage.status
            }, function (resp) {
                if (resp.status == 'ok') {
                    $rootScope.closeModal();
                    //$('.editStatusOfInterviewInVacancy.modal').modal('hide');
                    var checkValue = [];
                    $scope.extraStatusObj.show = false;
                    resp.object.value = resp.object.name;
                    resp.object.movable = true;
                    resp.object.count = 0;
                    resp.object.added = true;
                    angular.forEach($scope.VacancyStatusFiltered, function (val) {
                        if (val.customInterviewStateId == resp.object.customInterviewStateId) {
                            val.name = resp.object.name;
                            val.type = resp.object.type;
                            val.value = resp.object.value;
                        }
                    });
                    angular.forEach($scope.customStages, function (val) {
                        if (val.customInterviewStateId == resp.object.customInterviewStateId) {
                            val.name = resp.object.name;
                            val.type = resp.object.type;
                            val.value = resp.object.value;
                        }
                    });
                }
            });
        };

        $scope.showAddStage = function () {
            $rootScope.addingRefuseStage = false;
            $rootScope.addedStage.type = 'common';
            $rootScope.addedStage.name = '';
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/vacancy-add-new-stage.html',
                size: '',
                resolve: function(){

                }
            });
        };
        $scope.showAddRefuseStage = function () {
            $rootScope.addingRefuseStage = true;
            $rootScope.addedStage.type = 'refuse';
            $rootScope.addedStage.name = '';
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/vacancy-add-new-stage.html',
                size: '',
                resolve: function(){

                }
            });
        };
        $rootScope.addStatus = function () {
            $scope.errorDuplicateStage = false;
            angular.forEach($scope.customStages, function (val) {
                if (val.name == $rootScope.addedStage.name) {
                    $scope.errorDuplicateStage = true;
                }
            });
            if (!$scope.errorDuplicateStage) {
                vacancyStages.add({
                    type: $rootScope.addedStage.type,
                    name: $rootScope.addedStage.name
                }, function (resp) {
                    if (resp.status == 'ok') {
                        $rootScope.closeModal();
                        var checkValue = [];
                        $scope.extraStatusObj.show = false;
                        resp.object.value = resp.object.name;
                        if(resp.object.type != 'refuse'){
                            resp.object.movable = true;
                            $scope.VacancyStatusFiltered.splice(1, 0, resp.object);
                        }else{
                            resp.object.movable = false;
                            $scope.VacancyStatusFiltered.splice($scope.VacancyStatusFiltered.length, 0, resp.object);
                        }
                        resp.object.count = 0;
                        resp.object.added = true;
                        $scope.customStages.splice(0, 0, resp.object);
                        angular.forEach($scope.VacancyStatusFiltered, function (val) {
                            if (val.added && !val.name) {
                                checkValue.push(val.value)
                            }
                            if (val.name) {
                                checkValue.push(val.customInterviewStateId)
                            }
                        });
                        $scope.movableStages = _.filter($scope.VacancyStatusFiltered, 'movable');
                        Vacancy.setInterviewStatus({
                            vacancyId: $scope.vacancy.vacancyId,
                            interviewStatus: checkValue.toString()
                        }, function (val) {
                            if (val.status == "ok") {
                                //$scope.VacancyStatusFiltered.push(resp.object);

                                $scope.getLastEvent();
                            } else {
                                notificationService.error(resp.message);
                            }
                        });
                    }
                });
            } else {
                notificationService.error($filter('translate')('Stage with the same name already exists'));
            }

        };
        // $scope.deleteCustomStageFromCompany = function (status) {
        //     console.log(status);
        //     if (status.added == false) {
        //         vacancyStages.edit({
        //             customInterviewStateId: status.customInterviewStateId,
        //             name: status.name,
        //             status: "D",
        //             type: status.type
        //         }, function (val) {
        //             if (val.status == "ok") {
        //                 var index = $scope.customStages.indexOf(status);
        //                 $scope.customStages.splice(index, 1);
        //                 if (status.added) {
        //                     var index = $scope.VacancyStatusFiltered.indexOf(status);
        //                     $scope.VacancyStatusFiltered.splice(index, 1);
        //                 }
        //                 $scope.saveStatusInServer();
        //             } else if (val.code == 'existsInOtherVacancy') {
        //                 $scope.extraStatusObj.show = true;
        //                 $scope.extraStatusObj.messageText = 'existsInOtherVacancy';
        //                 $scope.existInVacancyErrorVacancy = val.object
        //             } else {
        //                 notificationService.error(val.message);
        //             }
        //         });
        //     } else {
        //         $scope.extraStatusObj.show = true;
        //         if(status.type == 'refuse'){
        //             $scope.extraStatusObj.messageText = 'deleteRefuse';
        //         }else{
        //             $scope.extraStatusObj.messageText = 'deleteStatus';
        //         }
        //     }
        // };

        $scope.deleteCustomStageFromCompany = function (status) {
            if (status.count === 0) {
                vacancyStages.edit({
                    customInterviewStateId: status.customInterviewStateId,
                    name: status.name,
                    status: "D",
                    type: status.type,
                    requestVacancy : $scope.vacancy.vacancyId
                }, function (val) {
                    if (val.status == "ok") {
                        var index = $scope.customStages.indexOf(status);
                        $scope.customStages.splice(index, 1);
                        if (status.added) {
                            var index = $scope.VacancyStatusFiltered.indexOf(status);
                            $scope.VacancyStatusFiltered.splice(index, 1);
                        }
                        $scope.saveStatusInServer();
                    } else if (val.code == 'existsInOtherVacancy') {
                        $scope.extraStatusObj.show = true;
                        $scope.extraStatusObj.messageText = 'existsInOtherVacancy';
                        $scope.existInVacancyErrorVacancy = val.object
                    } else {
                        notificationService.error(val.message);
                    }
                });
            } else {
                $scope.extraStatusObj.show = true;
                if(status.type == 'refuse'){
                    $scope.extraStatusObj.messageText = 'deleteRefuse';
                }else{
                    $scope.extraStatusObj.messageText = 'deleteStatus';
                }
            }
        };
        $scope.deleteCustomStage = function (status) {
            if (status.count == 0) {
                status.added = false;
                var index = $scope.VacancyStatusFiltered.indexOf(status);
                $scope.VacancyStatusFiltered.splice(index, 1);
                $scope.saveStatusInServer();
            } else {
                $scope.extraStatusObj.show = true;
                $scope.extraStatusObj.messageText = 'deleteStatus';
            }
        };
        $scope.saveStagesForAllVacancies = function () {
            $scope.saveForAllVacancies = null;
            if ($rootScope.me.recrutRole == 'admin') {
                if (!$scope.saveForAllVacancies) {
                    var array = [];
                    angular.forEach($scope.VacancyStatusFiltered, function (res) {
                        if (res.customInterviewStateId) {
                            array.push(res.customInterviewStateId)
                        } else {
                            array.push(res.value)
                        }
                    });
                    $scope.saveForAllVacancies = array;
                }
                Company.setDefaultInterviewStates({
                    states: $scope.saveForAllVacancies
                }, function (resp) {
                    if (resp.status == 'ok') {
                        notificationService.success($filter('translate')('Default stages for vacancies has been saved'))
                    } else {
                        notificationService.error(resp.message);
                    }
                })
            } else {
                notificationService.error($filter('translate')('This feature is available only to administrators'));
            }
        };
        $scope.exportToExcel = function () {
            $scope.loadingExcel = true;
            $scope.paramForExcell.interviewState = $scope.activeName;
            Candidate.createExcel($scope.paramForExcell, function (resp) {
                if (resp.status == 'ok') {
                    var sr = $rootScope.frontMode == "war" ? "/hr/" : "/hrdemo/";
                    $('#export_in_excel')[0].href = sr + 'getapp?id=' + resp.object;
                    $('#export_in_excel')[0].click();
                }
                if (resp.code == 'emptyExportExcel') {
                    notificationService.error($filter('translate')('No candidates for export according to criteria'));
                    $scope.loadingExcel = false;
                }
                $scope.loadingExcel = false;

            });
        };

        $scope.roundMinutes = function(date) {

            date.setHours(date.getHours());
            date.setMinutes(0);

            return date;
        };
        $rootScope.updateTaskInModal = function(){
            $scope.updateTasks();
            $scope.getLastEvent();
        };
        setDatePickerForOnce($rootScope,$translate, Task);
        $(".withoutTimeTask").datetimepicker({
            format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy hh:00" : "mm/dd/yyyy hh:00",
            startView: 2,
            minView: 1,
            autoclose: true,
            weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
            language: $translate.use(),
            initialDate: new Date(),
            startDate: new Date()
        }).on('changeDate', function (data) {
            $rootScope.editableTask.targetDate = $('.withoutTimeTask').datetimepicker('getDate');
            $scope.roundMinutes($rootScope.editableTask.targetDate);
            Task.changeTargetDate({
                "taskId": $rootScope.editableTask.taskId,
                "date":$rootScope.editableTask.targetDate
            }, function(resp){
                $scope.updateTasks();
                $scope.getLastEvent();
            })
        }).on('hide', function () {
            if ($('.withoutTimeTask').val() == "") {
                $rootScope.editableTask.date = "";
            }
            $('.withoutTimeTask').blur();
        });

        $scope.isModalOpened = function () {
            if($scope.modalEditTaskToCandidateOpened == true){
                $rootScope.responsiblePersons = [];
            }
            $scope.modalEditTaskToCandidateOpened = false;
        };

        $scope.showModalAddTaskToCandidate = function () {
            angular.forEach($rootScope.persons, function(resp){
                resp.notShown = false;
            });
            $rootScope.responsiblePersons = [];
            $('.addTaskInCandidate').modal('show');
        };

        $scope.showModalResume = function(file){
            showModalResume(file,$scope,$rootScope,$location,$sce);
        };
        $scope.showModalImg = function (file) {
            showModalImg(file, $scope, $rootScope, $location, $sce);
        };
        $rootScope.closeModalResume = function(){
            $('.showResume.modal').modal('hide')
        };
        $scope.MenuEdDelFile = function(file){
            file.showMenuEdDelFile = true;
            $('body').mouseup(function (e) {
                var element = $(".editFileMenu");
                if ($(".editFileMenu").has(e.target).length == 0) {
                    file.showMenuEdDelFile = false;
                    $(document).off('mouseup');
                    $scope.$apply();
                }
            });
        };
        $scope.showEditFileNameFunc = function(file){
            file.showEditFileName = !file.showEditFileName;
            file.showMenuEdDelFile = !file.showMenuEdDelFile;
            $scope.showMenuEdDelFile = false;
        };
        $scope.editFileName = function(data){
            File.changeFileName({
                "fileId":data.fileId,
                "name":data.fileName
            },function(resp){
                if(resp.status == 'ok'){
                    data.showEditFileName = false;
                }else{
                    notificationService.error(resp.message);
                }
            });
        };
        $scope.changePage = function(params,page){
            var maxValue = $filter('roundUp')(params.settings().total/params.count());
            if(page){
                if(page.number >= 1 && page.number <= maxValue){
                    //params.page(page.number);
                    $scope.a.searchNumber = page.number;
                    var input = $('#number');
                    input.val($scope.a.searchNumber);
                    input.trigger('#number');
                    $location.$$absUrl = $location.$$absUrl.split("&")[0];
                    if(!$scope.showSearchCandidate && $location.$$absUrl.indexOf('&task=') == -1){
                        $location.$$absUrl = $location.$$absUrl + '&page=' + $scope.a.searchNumber + '&stage=' + $scope.activeName;
                    }else{
                        $location.$$absUrl = $location.$$absUrl + '&page=' + $scope.a.searchNumber + '&search=' + $scope.searchCandidateName;
                    }
                }
            }
        };

        $scope.changeInputPage = function(params,searchNumber){
            var searchNumber = Math.round(searchNumber);
            var maxValue = $filter('roundUp')(params.settings().total/params.count());
            if(searchNumber){
                if(searchNumber >= 1 && searchNumber <= maxValue){
                    params.page(searchNumber);
                    $scope.a.searchNumber = searchNumber;
                }
            }
            if(searchNumber){
                if(searchNumber >= 1 && searchNumber <= maxValue){
                    //params.page(searchNumber);
                    $scope.a.searchNumber = searchNumber;
                    $location.$$absUrl = $location.$$absUrl.split("&")[0];
                    if(!$scope.showSearchCandidate){
                        $location.$$absUrl = $location.$$absUrl + '&page=' + $scope.a.searchNumber + '&stage=' + $scope.activeName;
                    }else{
                        $location.$$absUrl = $location.$$absUrl + '&page=' + $scope.a.searchNumber + '&search=' + $scope.searchCandidateName;
                    }
                }
            }
        };
        $scope.updateSearch = function(){
            if(!$scope.searchCandidateName){
                $scope.searchCandidateName = null;
            }
            $scope.tableParams.reload();
            $location.$$absUrl = $location.$$absUrl.split("&")[0];
            $location.$$absUrl = $location.$$absUrl + '&page=' + $scope.a.searchNumber + '&search=' + $scope.searchCandidateName;
        };
        $scope.showSearchCandidateFunc = function(type){
            $scope.noCandidatesInThisVacancy = true;
            $scope.visiable = false;
            $scope.noAccess = false;
            $scope.vacancySearchParams.state = null;
            $scope.tableParams.$params.page = 1;
            $scope.a.searchNumber = 1;
            var input = $('#number');
            input.val($scope.a.searchNumber);
            input.trigger('#number');
            $scope.loadingCandidates = true;
            $scope.showSearchCandidate = true;
            $scope.activeName = null;
            $scope.tableParams.reload();
            $location.$$absUrl = $location.$$absUrl.split("&")[0];
            $location.$$absUrl = $location.$$absUrl + '&page=' + $scope.a.searchNumber + '&search=' + $scope.searchCandidateName + '&allInOne';
        };
        $scope.hideSearchCandidateFunc = function(){
            $scope.tableParams.$params.page = 1;
            $scope.a.searchNumber = 1;
            var input = $('#number');
            input.val($scope.a.searchNumber);
            input.trigger('#number');
            $scope.searchCandidateName = null;
            $scope.loadingCandidates = true;
            $scope.showSearchCandidate = false;
            $scope.activeName = 'longlist';
            $scope.activeCustomStageName = '';
            $scope.tableParams.reload();
            if($location.$$absUrl.indexOf('&task=') == -1) {
                $location.$$absUrl = $location.$$absUrl.split("&")[0];
                $location.$$absUrl = $location.$$absUrl + '&page=' + $scope.a.searchNumber + '&stage=' + $scope.activeName;
            }

        };
        window.onhashchange = function() {
            if(getUrlVars($location.$$absUrl).page){
                $scope.a.searchNumber = parseInt(getUrlVars($location.$$absUrl).page);
                if(getUrlVars($location.$$absUrl).stage){
                    $scope.activeName = getUrlVars($location.$$absUrl).stage;
                    $scope.showSearchCandidate = false;
                }else if(getUrlVars($location.$$absUrl).search){
                    $scope.activeName = null;
                    $scope.showSearchCandidate = true;
                    if(getUrlVars($location.$$absUrl).search.length == 0 || getUrlVars($location.$$absUrl).search == 'null' || getUrlVars($location.$$absUrl).search == 'null'){
                        $scope.searchCandidateName = null;
                    }else{
                        $scope.searchCandidateName = decodeURIComponent(getUrlVars($location.$$absUrl).search);
                    }
                }
            }else{
                $scope.a.searchNumber = 1;
                $scope.searchCandidateName = null;
                $scope.activeName = 'longlist';
            }
            // $scope.tableParams.page($scope.a.searchNumber);
            $scope.$apply();
        };

        $scope.updateOrgPages = function(){
            Company.orgPages(function(resp){
                $rootScope.fbPages = resp.objects;
                for (var i = $rootScope.fbPages.length - 1; i >= 0; i--) {
                    if ($rootScope.fbPages[i].status === 'D') {
                        $rootScope.fbPages.splice(i, 1);
                    }
                }
                angular.forEach($rootScope.fbPages, function (val) {
                    if (val.facebookPageId) {
                        angular.forEach($scope.vacancy.publish, function (valStatus) {
                            if (valStatus.pageId == val.facebookPageId) {
                                val.vacancyAdded = true;
                            }
                        });
                    }
                });
            });
        };

        $rootScope.addVacancyToFacebook = function(tab){
            Vacancy.addPublish({
                vacancyId: $scope.vacancy.vacancyId,
                type: 'facebook_page',
                pageId: tab.facebookPageId
            },function(resp){
                if(resp.status == 'ok'){
                    $scope.updateVacancy();
                    $('.shareFbPagesForVacancy.modal').modal('hide');
                }else{
                    notificationService.error(resp.message);
                }
            })
        };
        $scope.removeEmailTemplate = function(){
            Mail.removeTemplate({id:$scope.emailTemplate.mailTemplateId}, function(resp){
                if(resp.status == 'ok'){
                    $scope.showAddEmailTemplate = false;
                    $scope.getEmailTemplates();
                }else{
                    notificationService.error(resp.message);
                }
            })
        };

        $scope.openPromoLogo = function () {
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/open-promo-logo.html',
                size: '',
                resolve: function () {

                }
            });
        };
        $scope.removePromoLogo = function () {
            Vacancy.removeImg({"vacancyId": $scope.vacancy.vacancyId}, function (resp) {
                if (resp.status == "ok") {
                    notificationService.success($filter('translate')('Logo of the vacancy') + ' ' + $scope.vacancy.position + ' ' + $filter('translate')('was removed'));
                    $scope.updateVacancy();
                }
            });
        };

        $scope.sendCandidatesToClient = function() {
            Vacancy.one({localId: $routeParams.id}, function (resp) {
                if (!resp.object.interviews || resp.object.interviews.length == 0) {
                    notificationService.error($filter('translate')('Please add the candidates to this stage'));
                    return;
                } else {
                    $location.path("/email/vacancy/" + $scope.vacancy.localId);
                }
            });
        };

        $scope.showEditEmailTemplate = function(template){
            $scope.activeTemplate = template.type;
            $scope.fileForSave = [];
            $scope.emailTemplate = {
                mailTemplateId: template.mailTemplateId,
                type: template.type,
                name: template.name,
                title: template.title,
                text: template.text,
                vacancyId: $scope.vacancy.vacancyId,
                fileId: template.fileId,
                fileName: template.fileName
            };
            if($scope.emailTemplate.fileId && $scope.emailTemplate.fileName){
                $scope.fileForSave.push({"fileId": $scope.emailTemplate.fileId, "fileName": $scope.emailTemplate.fileName});
            }
            $scope.emailTemplateForRender.text = $scope.emailTemplate.text;
            //if(!$scope.$$phase) {
            //    $scope.$evalAsync();
            //}
            $scope.showAddEmailTemplate = true;
            $scope.updateRenderedTitle();
        };
        $rootScope.showDeleteFbPages = function (tab) {
            $scope.deletedTab = tab;
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/vacancy-remove-fb-tab.html',
                size: '',
                resolve: function(){

                }
            });
        };
        $rootScope.deleteVacancyOnFacebook = function(){
            Vacancy.deletePublish({
                publishId: $scope.deletedTab.publishId
            },function(resp){
                if(resp.status == 'ok'){
                    $scope.updateVacancy();
                    $scope.updateOrgPages();
                    $rootScope.closeModal();
                }else{
                    notificationService.error(resp.message);
                }
            })
        };
        //Vacancy.all(Vacancy.searchOptions(), function(response) {
        //    $rootScope.objectSize = response['objects'] != undefined ? response['total'] : 0;
        //});
        $scope.updateRenderedTitle = function(){
            /* rendering title */
            $scope.renderedTitle = $scope.emailTemplate.title;
            $scope.renderedTitle =  $scope.renderedTitle.replace(/\[\[vacancy name\]\]/g, $scope.vacancy.position);
            $scope.renderedTitle = $scope.renderedTitle.replace(/\[\[candidate name\]\]/g, $rootScope.staticEmailTemplate.candidateName);
            $scope.renderedTitle = $scope.renderedTitle.replace(/\[\[vacancy link\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $scope.publicLink+ '">' + $scope.vacancy.position + '</a>');
            $scope.renderedTitle = $scope.renderedTitle.replace(/\[\[recruiter's name\]\]/g, $rootScope.me.fullName);
            $scope.renderedTitle = $scope.renderedTitle.replace(/\[\[vacancyName\]\]/g, $scope.vacancy.position);
            $scope.renderedTitle = $scope.renderedTitle.replace(/\[\[interview date and time\]\]/g, $filter('dateFormat2')($rootScope.staticEmailTemplate.date),true);
            $scope.renderedTitle = $scope.renderedTitle.replace(/\[\[recruiter's phone\]\]/g, $rootScope.staticEmailTemplate.phoneWork);
            $scope.renderedTitle = $scope.renderedTitle.replace(/\[\[recruiter's Skype\]\]/g, $rootScope.staticEmailTemplate.skype);
            $scope.renderedTitle = $scope.renderedTitle.replace(/\[\[recruiter's Facebook\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $rootScope.staticEmailTemplate.facebook+ '">' + $rootScope.staticEmailTemplate.facebook + '</a>');
            $scope.renderedTitle = $scope.renderedTitle.replace(/\[\[recruiter's LinkedIn\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $rootScope.staticEmailTemplate.linkedin+ '">' + $rootScope.staticEmailTemplate.linkedin + '</a>');
            /* rendering title end */
        };

        $rootScope.addEmailFromWhatSend = function(email){
            if($rootScope.emailThatAlreadyUsed){
                $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace($rootScope.emailThatAlreadyUsed.email, email.email);
            }
            $rootScope.emailTemplateInModal.email = [];
            $rootScope.emailThatAlreadyUsed = email;
            localStorage.emailThatAlreadyUsed = email.email;
            $rootScope.emailTemplateInModal.email = $rootScope.emailTemplateInModal.email + email.email;
            $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiterEmail\]\]/g, $rootScope.emailTemplateInModal.email);
            tinyMCE.get('modalMCE').setContent($rootScope.emailTemplateInModal.text);
        };
        $rootScope.addEmailFromWhatSendInCandidate = function(email){
            if($rootScope.emailThatAlreadyUsed){
                $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace($rootScope.emailThatAlreadyUsed.email, email.email);
            }
            $rootScope.emailTemplateInModal.email = [];
            $rootScope.emailThatAlreadyUsed = email;
            localStorage.emailThatAlreadyUsed = email.email;
            $rootScope.emailTemplateInModal.email = $rootScope.emailTemplateInModal.email + email.email;
            $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiterEmail\]\]/g, $rootScope.emailTemplateInModal.email);
            tinyMCE.get('modalMCECandidate').setContent($rootScope.emailTemplateInModal.text);
        };
        $scope.addEmailFromLocalStorage = function(email){
            angular.forEach($rootScope.me.emails,function(resp){
                if(resp.email == localStorage.emailThatAlreadyUsed){
                    $rootScope.addEmailFromWhatSend(resp);
                }
            })
        };
        $scope.addEmailInDescriptionFromLocalStorage = function(email){
            angular.forEach($rootScope.me.emails,function(resp){
                if(resp.email == localStorage.emailThatAlreadyUsed){
                    $rootScope.addEmailFromWhatSendInDescription(resp);
                }
            })
        };
        $rootScope.addEmailFromWhatSendInDescription = function(email){
            $rootScope.sendEmailTemplate.template.email = [];
            $rootScope.sendEmailTemplate.template.email = $rootScope.sendEmailTemplate.template.email + email.email;
            $rootScope.sendEmailTemplate.email = $rootScope.sendEmailTemplate.template.email;
            $rootScope.sendEmailTemplate.template.text = $rootScope.sendEmailTemplate.template.text.replace(/\[\[recruiterEmail\]\]/g, $rootScope.sendEmailTemplate.template.email);
            tinyMCE.get('sendVacancyModalMCE').setContent($rootScope.sendEmailTemplate.template.text);
        };
        $rootScope.goToEditTemplate = function(){
            localStorage.editTemplate = $rootScope.emailTemplateInModal.type
        };
        $scope.setDefaultTemplate = function(){
            Mail.getDefaultTemplate({type: $scope.emailTemplate.type},function(resp){
                $scope.emailTemplate.text = resp.object.text;
                $scope.emailTemplate.title = resp.object.title;
                $scope.updateRenderedTitle();
            })
        };
        $scope.showHideTinyMce = function(){
            $scope.showRenderedTinyMce = !$scope.showRenderedTinyMce;
        };
        $rootScope.setDocCounter = function(){
            $scope.currentDocPreviewPage = 0;
        };
        $scope.prevDoc = function(){
            $scope.currentDocPreviewPage -= 1;
        };
        $scope.saveEmailTemplate = function () {
            if($scope.fileForSave.length > 0){
                $scope.emailTemplate.fileId = $scope.fileForSave[0].fileId;
                $scope.emailTemplate.fileName = $scope.fileForSave[0].fileName;
            }
            var templateError = false;
            angular.forEach($scope.emailTemplate.text.split(" "),function(data){
                var i = data.indexOf("//");
                if(i > 0){
                    if(data.indexOf("http:") == -1 && data.indexOf("https:") == -1){
                        templateError = true;
                    }
                }
            });
            if(!templateError){
                if(!$scope.emailTemplate.mailTemplateId){
                    delete $scope.emailTemplate["mailTemplateId"];
                    Mail.createTemplate($scope.emailTemplate,function(resp){
                        if(resp.status == 'ok'){
                            $scope.showAddEmailTemplate = false;
                            $scope.getEmailTemplates();
                        }else{
                            notificationService.error(resp.message);
                        }
                    })
                }else{
                    Mail.updateTemplate($scope.emailTemplate,function(resp){
                        if(resp.status == 'ok'){
                            $scope.showAddEmailTemplate = false;
                            $scope.getEmailTemplates();
                        }else{
                            notificationService.error(resp.message);
                        }
                    });
                }
            }else{
                notificationService.error($filter('translate')('Please delete all comments'))
            }
        };
        $scope.nextDoc = function(){
            $scope.currentDocPreviewPage += 1;
        };
        $rootScope.changeTemplateInAddCandidate = function(status){
            if(typeof status.value  !== 'undefined'){
                $rootScope.status2 = false;
            }else{
                status = JSON.parse(status);
            }

            var candidateFullName = $("#candidateToAddInInterview").select2('data') !== null ? $("#candidateToAddInInterview").select2('data').text : null;
            $rootScope.addCandidateInInterview.status = status;

            if($rootScope.addCandidateInInterview.status.value == 'interview' ||
                $rootScope.addCandidateInInterview.status.withDate ||
                $rootScope.addCandidateInInterview.status.value == 'longlist' ||
                $rootScope.addCandidateInInterview.status.value == 'shortlist' ||
                $rootScope.addCandidateInInterview.status.value == 'notafit' ||
                $rootScope.addCandidateInInterview.status.value == 'declinedoffer' ||
                $rootScope.addCandidateInInterview.status.value == 'no_response' ||
                $rootScope.addCandidateInInterview.status.value == 'no_contacts' ||
                $rootScope.addCandidateInInterview.status.type == 'interview' ||
                $rootScope.addCandidateInInterview.status.type == 'refuse'){
                var templateType = 'candidateCreateInterviewNotification';
                if($rootScope.addCandidateInInterview.status.value == 'notafit' ||
                    $rootScope.addCandidateInInterview.status.value == 'declinedoffer' ||
                    $rootScope.addCandidateInInterview.status.value == 'no_response' ||
                    $rootScope.addCandidateInInterview.status.value == 'no_contacts' ||
                    $rootScope.addCandidateInInterview.status.type == 'refuse'){
                    templateType = 'refuseCandidateInVacancy'
                }else if($rootScope.addCandidateInInterview.status.value == 'longlist' ||
                    $rootScope.addCandidateInInterview.status.value == 'shortlist'){
                    templateType = 'seeVacancy'
                }

                Mail.getTemplateVacancy({vacancyId: $scope.vacancy.vacancyId,type:templateType},function(data){
                    $rootScope.fileForSave = [];
                    $rootScope.emailTemplateInModal = data.object;
                    $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[candidate name\]\]/g, candidateFullName);
                    $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[vacancy link\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $scope.publicLink+ '">' + $scope.vacancy.position + '</a>');
                    $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's name\]\]/g, $rootScope.me.fullName);
                    $rootScope.emailTemplateInModal.title = $rootScope.emailTemplateInModal.title.replace(/\[\[vacancy link\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $scope.publicLink+ '">' + $scope.vacancy.position + '</a>');
                    $rootScope.emailTemplateInModal.title = $rootScope.emailTemplateInModal.title.replace(/\[\[vacancy name\]\]/g, $scope.vacancy.position);
                    $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's phone\]\]/g, $rootScope.me.phone ? $rootScope.me.phone : "");
                    $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's Skype\]\]/g, $rootScope.staticEmailTemplate.skype ? $rootScope.staticEmailTemplate.skype : "");
                    if(!$rootScope.staticEmailTemplate.skype){
                        $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/Skype:/g, "");
                    }
                    if($rootScope.staticEmailTemplate.facebook){
                        $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's Facebook\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $rootScope.staticEmailTemplate.facebook+ '">' + $rootScope.staticEmailTemplate.facebook + '</a>');
                    }else{
                        $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's Facebook\]\]/g, '');
                    }
                    if($rootScope.staticEmailTemplate.linkedin){
                        $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's LinkedIn\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $rootScope.staticEmailTemplate.linkedin+ '">' + $rootScope.staticEmailTemplate.linkedin + '</a>');
                    }else{
                        $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's LinkedIn\]\]/g, '');
                    }
                    if($rootScope.me.emails.length == 1){
                        $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiterEmail\]\]/g, $rootScope.me.emails[0].email);
                    }

                    tinyMCE.get('modalMCECandidate').setContent($rootScope.emailTemplateInModal.text);
                    //if(localStorage.emailThatAlreadyUsed){
                    //    $scope.addEmailFromLocalStorage(localStorage.emailThatAlreadyUsed);
                    //}
                    if($rootScope.emailTemplateInModal.fileId && $rootScope.emailTemplateInModal.fileName){
                        $rootScope.fileForSave.push({"fileId": $rootScope.emailTemplateInModal.fileId, "fileName": $rootScope.emailTemplateInModal.fileName});
                    }
                })
            }
        };

        $rootScope.changeTabOnTask = function(val){
            if (val == "Task") {
                $rootScope.editableTask.type = 'Task';
            } else if (val == "Call") {
                $rootScope.editableTask.type = 'Call';
            } else if (val == "Meeting") {
                $rootScope.editableTask.type = 'Meeting';
            }
            $rootScope.editNameTask(true);
        };
        $rootScope.changeTabOnTaskForNewTask = function(val){
            if (val == "Task") {
                $rootScope.newTask.type = 'Task';
            } else if (val == "Call") {
                $rootScope.newTask.type = 'Call';
            } else if (val == "Meeting") {
                $rootScope.newTask.type = 'Meeting';
            }
            $scope.updateTasks();
        };
        $scope.openVacancyCandidateChangeStatus = function (candidate) {
            $rootScope.changeStatusOfInterviewInVacancy.candidate = false;
            $rootScope.changeStatusOfInterviewInVacancy.candidate = candidate;
            $rootScope.changeStatusOfInterviewInVacancy.status = '';
            $rootScope.changeStatusOfInterviewInVacancy.comment = '';
            $rootScope.showEmployedFields = false;
            $rootScope.changeStatus = '';
            if(candidate.candidateId && typeof candidate.candidateId == 'string' && candidate.candidates) {
                $rootScope.changeStatusOfInterviewInVacancy.candidate.candidateId = candidate.candidates[0];
            }
            $scope.lang = localStorage.getItem('NG_TRANSLATE_LANG_KEY');

            $scope.modalInstance = $uibModal.open({
                animation: false,
                templateUrl: '../partials/modal/vacancy-candidate-change-status.html?b41123',
                size: '',
                resolve: function(){

                }
            });
            $scope.modalInstance.closed.then(function() {
                $rootScope.candnotify.show = false;
                tinyMCE.remove()
            });
            $scope.modalInstance.opened.then(function(){
                setTimeout(function(){
                    tinymce.init({
                        selector: '#modalMCE',
                        mode: 'exact',
                        theme: "modern",
                        height: 145,
                        language: $scope.lang!=undefined ||$scope.lang!=null?$scope.lang:"ru",
                        browser_spellcheck: true,
                        menubar: false,
                        statusbar: false,
                        theme_advanced_resizing: true,
                        plugins: ["advlist autolink lists link image charmap print preview hr anchor pagebreak",
                            "searchreplace visualblocks visualchars code fullscreen",
                            "insertdatetime media nonbreaking save table directionality",
                            "template paste textcolor  "],
                        fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
                        toolbar1: "bold italic forecolor backcolor fontsizeselect | bullist numlist | link",
                        image_advtab: true,
                        toolbar_items_size: 'small',
                        relative_urls: false,
                        setup: function (ed) {
                            ed.on('SetContent', function (e) {

                            });
                            ed.on('change', function(e) {
                                try{
                                    $rootScope.emailTemplateInModal.text = tinymce.get('modalMCE').getContent();
                                } catch (e) {
                                    console.log('error in tinymce.get(\'modalMCE\').getContent(). It`s normal')
                                }

                            });
                        }
                    });
                    $(".changeStatusOfInterviewInVacancyPick1").datetimepicker({
                        format: "dd/mm/yyyy hh:ii",
                        startView: 2,
                        minView: 0,
                        autoclose: true,
                        weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                        language: $translate.use()
                    }).on('changeDate', function (data) {
                        $rootScope.changeStatusOfInterviewInVacancy.date = data.date;
                        $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[interview date and time\]\]/g, $filter('dateFormat2')($('.changeStatusOfInterviewInVacancyPick1').datetimepicker('getDate').getTime(), true));
                        $rootScope.emailTemplateInModal.title = $rootScope.emailTemplateInModal.title.replace(/\[\[interview date and time\]\]/g, $filter('dateFormat2')($('.changeStatusOfInterviewInVacancyPick1').datetimepicker('getDate').getTime(), true));
                        $scope.$apply();
                        tinyMCE.get('modalMCE').setContent($rootScope.emailTemplateInModal.text);
                    }).on('hide', function () {
                        if ($('.changeStatusOfInterviewInVacancyPick1').val() == "") {
                            $rootScope.changeStatusOfInterviewInVacancy.date = null;
                        }
                    });

                    $(".changeStatusOfInterviewEmployed1").datetimepicker({
                        format: "dd/mm/yyyy",
                        startView: 2,
                        minView: 2,
                        autoclose: true,
                        weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                        language: $translate.use()
                    }).on('changeDate', function (data) {
                        $rootScope.changeStatusOfInterviewEmployed.date = data.date;
                    }).on('hide', function () {
                        if ($('.changeStatusOfInterviewEmployed1').val() == "") {
                            $rootScope.changeStatusOfInterviewEmployed.date = null;
                        }
                    });
                },0);
            });
        };

        $scope.getFirstLetters = function(str){
            return firstLetters(str)
        };
        ////////////////////////////////////////////////////////Edit page
        $scope.sexObject = [
            {name: "Male", value: true},
            {name: "Female", value: false},
            {name: "Doesn't matter", value: null}
        ];
        $scope.sexObjectRU = [
            {name: "Мужчина", value: true},
            {name: "Женщина", value: false},
            {name: "Не имеет значения", value: null}
        ];
        $scope.lang = $translate;
        $scope.currency = Service.currency();
        $scope.employmentType = Service.employmentType();
        Client.init();
        $scope.save = function() {

            if ($scope.vacancyForm.$valid && !$scope.clickedAddVacancy) {
                $scope.vacancy.dateFinish = $('.deadLinePicker').datetimepicker('getDate') != null ? $('.deadLinePicker').datetimepicker('getDate').getTime() : null;
                $scope.vacancy.datePayment = $('.paymentPicker').datetimepicker('getDate') != null ? $('.paymentPicker').datetimepicker('getDate').getTime() : null;

                $scope.vacancy.langs = $('.select2-lang').select2('val').toString();
                deleteUnnecessaryFields($scope.vacancy);

                if ($("#pac-input").val().length == 0) {
                    $scope.vacancy.region = null;
                } else if ($("#pac-input").val().length > 0 && ($scope.vacancy.region == undefined || $("#pac-input").val() != $scope.vacancy.region.fullName)) {
                    if ($scope.region)
                        $scope.vacancy.region = $scope.region;
                }
                $scope.clickedAddVacancy = true;
                Vacancy.edit($scope.vacancy, function(resp) {
                    if (angular.equals(resp.status, "ok")) {
                        notificationService.success($filter('translate')('vacancy_save_1') + $scope.vacancy.position + $filter('translate')('vacancy_save_2'));
                        $scope.updateVacancy();
                        $scope.clickedAddVacancy = false;
                    } else {
                        $scope.clickedAddVacancy = false;
                        $scope.errorMessage.show = true;
                        $scope.errorMessage.message = resp.message;
                    }
                }, function(err) {
                    $scope.clickedAddVacancy = false;
                    //notificationService.error($filter('translate')('service temporarily unvailable'));
                });
            } else {
                $scope.vacancyForm.client.$pristine = false;
                $scope.vacancyForm.regionInput.$pristine = false;
                $scope.clickedAddVacancy = false;
            }
        };
        $scope.deleteVacancy = function() {
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/delete-vacancy.html',
                size: '',
                resolve: function(){

                }
            });
            $rootScope.changeStateObject.status = "deleted";
            $rootScope.changeStateObject.position = $scope.vacancy.position;
            $rootScope.changeStateObject.placeholder = $filter('translate')("Write a comment why you want remove this vacancy");
        };
        $scope.getCompanyParams = function(){
            Company.getParams(function(resp){
                $scope.companyParams = resp.object;
                $rootScope.publicLink = $location.$$protocol + "://" + $location.$$host + "/i#/" + $scope.companyParams.nameAlias + "-vacancies";
            });
        };
        $scope.getCompanyParams();

        $scope.restoreCandidate = function (candidateId, localId, fullName) {
            $scope.restoreParams = {
                candidateId: candidateId,
                localId: localId,
                fullName: fullName,
                comment: '',
                candidateState: 'archived'
            };
            $scope.modalInstance = $uibModal.open({
               animation: true,
               templateUrl: '../partials/modal/restore-candidate-from-vacancy.html',
               size: '',
               scope: $scope,
               resolve: function () {

               }
            });
        };

        $scope.confirmRestoring = function () {
            Candidate.changeState({
                candidateId: $scope.restoreParams.candidateId,
                comment: $scope.restoreParams.comment,
                candidateState: $scope.restoreParams.candidateState
            }, function (resp) {
                if(resp.status != 'error') {
                    $scope.closeModal();
                    notificationService.success($filter('translate')('history_info.changed_the_status'));
                    $scope.tableParams.reload();
                } else {
                    notificationService.error(resp.message)
                }
            })
        };

        $scope.menuOptions = [
            [$filter('translate')('Open in new tab'), function ($itemScope) {
                console.log($location,'location');
                let url = $location.$$protocol + '://' + $location.$$host +'/!#' + '/candidates/' + $itemScope.candidate.candidateId.localId;

                $window.open(url, "_blank");
            }]];

        $scope.routeOnCandidate = function(event, url, panel){
            if(panel === 'history'){
                localStorage.setItem("isAddCandidates", false);
            }else if(panel === 'candidate'){
                localStorage.setItem("isAddCandidates", true);
            }

            $location.path('/candidates/' + url);
        };

        if($scope.activeName === 'extra_status') {
            setActiveStatus();
        }

        function resetTemplate() {
            $scope.activeTemplate = '';
            $scope.showAddEmailTemplate = false;
        }


        function setVacanciesForCandidatesAccess(access) {
            if(access == 'publicAccess'){
                $scope.accessVacancies = false;
            }else if(access == 'privateAccess'){
                $scope.accessVacancies = true;
            }

        }

        $scope.hiddenOrShowVacanciesOnThePublicListVacancies = Vacancy.requestChangeVacanciesForCandidatesAccess;

    }]);
