function ClientOneController(serverAddress, $scope, $routeParams, $location, Client, Service, Contacts, Vacancy, $rootScope, notificationService,
                             $filter, ngTableParams,Person, Action, Task, CacheCandidates, File, FileInit, $translate, $uibModal, $route, Mail, $localStorage) {
    $scope.status = Client.getState();
    $scope.contactLimit = 3;
    $scope.vacancyCounter = 0;
    $scope.historyLimit = 20;
    $scope.serverAddress = serverAddress;
    $scope.todayDate = new Date().getTime();
    $scope.showAddedLinks = false;
    $scope.showAddedFiles = false;
    $scope.linked = false;
    $scope.showEditFileName = false;
    $scope.showMenuEdDelFile = false;
    $scope.showAddLink = false;
    $rootScope.changeResponsibleInClient = {id: "", comment: "", text: null, name: null};
    $scope.vacancy = null;
    $scope.onlyComments = false;
    $rootScope.clickedSaveClientStatus = false;
    $rootScope.toAdd = function() {
        $location.url('/client/add/');
        $location.path('/client/add/');
    };
    if($location.$$absUrl.indexOf('&task=') != -1) {
        $scope.urlTaskId = $location.$$absUrl.split('&task=')[1];
    }
    $('.showCommentSwitcher').prop("checked", !$scope.onlyComments);
    $(window).scrollTop(0);
    $rootScope.closeModal = function(){
        $scope.modalInstance.close();
    };
    Task.task($scope, $rootScope, $location, $translate, $uibModal, $route);
    $rootScope.newTask = {
        text: "",
        title: "",
        clientId: "",
        targetDate: '',
        responsibleIds: [],
        type: 'Task'
    };
    $scope.addLinkToClient = {
        name: '',
        url: ''
    };
    $scope.persons = [];

    Person.getAllPersons(function (resp) {
        $scope.associativePerson = resp.object;
        angular.forEach($scope.associativePerson, function (val, key) {
            if (angular.equals(resp.status, 'ok')) {
                $scope.persons.push($scope.associativePerson[key]);
            }
        });
        $rootScope.persons = $scope.persons;
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
    });
    $scope.showAddResponsibleUser = function (person) {
        $rootScope.clickedSaveResponsibleInVacancy = false;
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '../partials/modal/client-adding-responsible.html',
            size: '',
            resolve: function(){

            }
        });
        $rootScope.changeResponsibleInClient.id = person.userId;
        $rootScope.changeResponsibleInClient.name = person.cutFullName;
    };
    $scope.showRemoveResponsibleUser = function (user) {
        var firstName = user.firstName != undefined ? user.firstName : "";
        var lastName = user.lastName != undefined ? user.lastName : "";

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '../partials/modal/remove-responsible-from-client.html',
            size: '',
            resolve: function(){

            }
        });
        $rootScope.changeResponsibleInClient.id = user.userId;
        $rootScope.changeResponsibleInClient.text = $filter('translate')('Do you want to remove the responsible')
        + " " + firstName + " " + lastName;
    };
    $rootScope.removeResponsibleUserInVacancy = function () {
            Client.removeResponsible({
                clientId: $scope.client.clientId,
                personId: $rootScope.changeResponsibleInClient.id,
                comment: $rootScope.changeResponsibleInClient.comment
            }, function (resp) {
                if (resp.status === "ok") {
                    notificationService.success($filter('translate')('vacancy remove responsible'));
                    $scope.updateClient();
                }else{
                    notificationService.error(resp.message);
                }
                $rootScope.closeModal();
                $rootScope.changeResponsibleInClient.comment = "";
                $rootScope.changeResponsibleInClient.id = "";
            }, function (err) {

            });
    };
    $rootScope.saveResponsibleUserInVacancy = function () {
            Client.addResponsible({
                clientId: $scope.client.clientId,
                personId: $rootScope.changeResponsibleInClient.id,
                comment: $rootScope.changeResponsibleInClient.comment
            }, function (resp) {
                if (resp.status === "ok") {
                    notificationService.success($filter('translate')('set responsible'));
                    $scope.updateClient();
                }else{
                    notificationService.error(resp.message);
                }

            }, function (err) {
                //notificationService.error($filter('translate')('service temporarily unvailable'));
            });
            $rootScope.closeModal();
            $rootScope.changeResponsibleInClient.comment = "";
            $rootScope.changeResponsibleInClient.id = "";
    };

    $scope.updateClient = function () {
        $scope.showAddedLinks = false;
        $scope.showAddedFiles = false;
        Client.one({"localId": $routeParams.id}, function(resp) {
            if (angular.equals(resp.status, "ok")) {
                $scope.client = resp.object;
                $rootScope.client = $scope.client;
                $scope.locationBeforeCustomFields = $location.$$path.replace('/clients/' + $scope.client.localId, 'clients');
                $localStorage.set('previousHistoryCustomFields', $scope.locationBeforeCustomFields);
                $rootScope.newTask.clientId = $rootScope.client.clientId;
                $scope.updateTasks(true);
                $rootScope.title = resp.object.name + " | CleverStaff";
                if($scope.client.files){
                    if($scope.client.files.length != undefined && $scope.client.files.length != 0){
                        angular.forEach($scope.client.files, function (val) {
                            if(val.url){
                                $scope.showAddedLinks = true;
                            }
                            if(!val.url){
                                $scope.showAddedFiles = true;
                            }
                            initDocuments(val);
                        });
                    }
                } else{
                    $scope.showAddedLinks = false;
                    $scope.showAddedFiles = false;
                }
                $scope.statisticObj = {
                    requestObj: {clientId: resp.object.clientId},
                    objId: resp.userId,
                    objType: "user"
//            name: resp.object.position
                };
                $location.hash('');
                var name = "";
                name = resp.object.name != undefined ? name + resp.object.name.replace(/\W+/g, '_') : "";
                $location.search($filter('transliteration')(name)).replace();
                Service.history({
                    "vacancyId": null,
                    "candidateId": null,
                    "clientId": $scope.client !== undefined ? $scope.client.clientId : null,
                    "page": {"number": 0, "count": $scope.historyLimit},
                    "onlyWithComment": false
                }, function (res) {
                    historyButton($scope, res, Service, CacheCandidates);
                });
                $("#descr").html($scope.client.descr);
            } else {
                notificationService.error($filter('translate')('client not found'));
                $location.path("clients");
            }
            $rootScope.contactEmails = [];
            angular.forEach($scope.client.contactClientList, function(val) {
                angular.forEach(val.contacts, function(valC) {
                    if (valC.type == 'email') {
                        var text = "";
                        if (val.firstName) text = text + val.firstName;
                        if (val.lastName) text = text + " " + val.lastName;
                        //text = text + " <" + valC.value + ">";
                        $rootScope.contactEmails.push({id: valC.value, text: text});
                    }
                })
            });

            if($scope.client.files){
                if($scope.client.files.length != undefined && $scope.client.files.length != 0){
                    angular.forEach($scope.client.files, function (val) {
                        if(val.url){
                            $scope.showAddedLinks = true;
                        }
                        if(!val.url){
                            $scope.showAddedFiles = true;
                        }
                        initDocuments(val);
                    });
                }
            } else{
                $scope.showAddedLinks = false;
                $scope.showAddedFiles = false;
            }
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
            $scope.objectId = resp.object.clientId;
            FileInit.initFileOption($scope, "client", undefined, $filter);
            $scope.fileForSave = [];
            $scope.linksForSave = [];
            $rootScope.fileForSave = [];    /*For modal window*/

            $scope.callbackFileTemplateInClient = function(resp, names) {
                $scope.fileForSave.push({"fileId": resp, "fileName": names});
                $rootScope.fileForSave.push({"fileId": resp, "fileName": names});
            };
            $scope.removeFile = function(file) {
                Client.removeFile({"clientId": $scope.client.clientId, "fileId": file.fileId}, function (resp) {
                    if (resp.status == "ok") {
                        file.showMenuEdDelFile = false;
                        $scope.getLastEvent();
                        console.log(file.showMenuEdDelFile);
                    }
                    $scope.updateClient();
                });
                angular.forEach($scope.fileForSave, function(val, ind) {
                    if (val.attId === id) {
                        $scope.fileForSave.splice(ind, 1);
                    }
                });
                if ($scope.client.files.length === 0) {
                    delete $scope.client.files;
                    Client.progressUpdate($scope, false);
                }
            };
            $scope.callbackFile = function (resp, name) {
                if (!$scope.client.files) {
                    $scope.client.files = [];
                }
                $scope.client.files.push(resp);
                $scope.getLastEvent();
            };
            $rootScope.removeFile = function(id) {
                angular.forEach($rootScope.fileForSave, function(val, ind) {
                    if (val.attId === id) {
                        $rootScope.fileForSave.splice(ind, 1);
                    }
                });
            };
            $scope.showAddLinkFunc = function(){
                $scope.showAddLink = true;
                console.log($scope.showAddLink);
            };
            $scope.closeAddLinkFunc = function(){
                $scope.showAddLink = false;
                $scope.addLinkToClient.name = null;
                $scope.addLinkToClient.url = null;
                $scope.addLinkErrorShow = false;
            };
            $scope.addLinkInClient = function(){
                console.log($scope.addLinkToClient);
                if($scope.addLinkToClient.name && $scope.addLinkToClient.url){
                    if($rootScope.me.recrutRole != 'client'){
                        Client.addLink({
                            "clientId": $scope.client.clientId,
                            "name" : $scope.addLinkToClient.name,
                            "url" : $scope.addLinkToClient.url
                        }, function (resp){
                            if(resp.status === 'ok'){
                                $scope.addLinkToClient.name = null;
                                $scope.addLinkToClient.url = null;
                                $scope.addLinkErrorShow = false;
                                $scope.showAddLink = false;
                                //$scope.candidate.files.push(resp.object);
                                $scope.updateClient();
                                notificationService.success($filter('translate')('history_info.added_link'));
                            } else{
                                notificationService.error(resp.message);
                            }
                        });
                    }else{
                        notificationService.error($filter('translate')('This feature is available only to administrators and recruiters'));
                    }
                } else{
                    $scope.addLinkErrorShow = true;
                    if(!$scope.addLinkToClient.name)
                        notificationService.error($filter('translate')('Enter a URL name'));
                }
            };
        }, function() {
            //notificationService.error($filter('translate')('service temporarily unvailable'));
        });
    };
    $scope.updateClient();


    if ($rootScope.me.recrutRole == 'client') {
        Person.getAllPersons(function(resp) {
            $scope.tableParams = new ngTableParams({
                page: 1,
                count: 15
            }, {
                total: 10,
                getData: function($defer, params) {
                    $scope.usersFound = false;
                    $scope.personAll = [];
                    var persons = angular.copy(resp.object);
                    angular.forEach(persons, function(val, key) {
                        if (($scope.regionId === undefined || $scope.regionId === null) && persons[key].status === 'A') {
                            $scope.personAll.push(persons[key]);
                            $scope.usersFound = true;
                        } else if (persons[key].region !== undefined) {
                            if ($scope.regionIdType == 'country' && persons[key].region.country == $scope.regionId && persons[key].status === 'A') {
                                $scope.personAll.push(persons[key]);
                                $scope.usersFound = true;
                            } else if ($scope.regionIdType == 'city' && $scope.regionId == persons[key].region.regionId && persons[key].status === 'A') {
                                $scope.personAll.push(persons[key]);
                                $scope.usersFound = true;
                            }
                        }

                    });
                    var personSS=[];
                    angular.forEach($scope.personAll,function(resp){
                        if (resp.recrutRole == 'client') {
                            personSS.push(resp);
                        }
                    });
                    $defer.resolve($filter('orderBy')(personSS, params.orderBy()));
                }
            });
        });
    }

    $scope.persons = [];

    $scope.personId = $rootScope.me.personId;

    $scope.save = function() {
        Client.edit($scope.client, function(resp) {
        });
    };

    $rootScope.commentClient = {
        comment: "",
        loading: false
    };
    $scope.showModalAddCommentToClient = function(){
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '../partials/modal/add-comment-client.html',
            size: '',
            resolve: function(){

            }
        });
        $(document).unbind("keydown").keydown(function(e) {
            if (e.ctrlKey == true && e.which == 13) {
                $rootScope.addCommentInClient();
            }
        });
    };
    $rootScope.addCommentInClient = function() {
        if ($rootScope.commentClient.comment != undefined && $rootScope.commentClient.comment.length > 0) {
            $rootScope.commentClient.loading = true;
            Client.setMessage({
                comment: $rootScope.commentClient.comment,
                clientId: $scope.client.clientId
            }, function(resp) {
                $rootScope.commentClient.loading = false;
                $('.addMessageInClient').modal('hide');
                $rootScope.commentClient.comment = null;
                if (resp.status == 'ok') {
                    $scope.getLastEvent();
                    $rootScope.closeModal();
                }
            }, function(error) {
                $rootScope.commentClient.loading = false;
            });
        }
    };
    $rootScope.changeStatusInClient = {
        status: "",
        comment: "",
        header: "",
        placeholder: "",
        status_old: "",
        type: "edit"
    };

    $scope.showChangeStatusOfClient = function(status) {
        //$('.changeStatusInClient.modal').modal('show');
        $rootScope.changeStatusInClient.status = status;
        $rootScope.changeStatusInClient.status_old = $scope.client.state;
        $rootScope.changeStatusInClient.header = $filter('translate')('change_client_status');
        $rootScope.changeStatusInClient.placeholder = $filter('translate')("Write a comment about changing client's status (optional)");
        $rootScope.saveClientStatus();
    };
    $rootScope.saveClientStatus = function() {
        if (!$rootScope.clickedSaveClientStatus) {
            $rootScope.clickedSaveClientStatus = true;
            $scope.client.state = $rootScope.changeStatusInClient.status;

            if($scope.client.activeVacanciesNumber !== 0 && $rootScope.changeStatusInClient.status === 'deleted') {
                notificationService.error($filter('translate')("This client has active vacancy"));            $rootScope.clickedSaveClientStatus = true;
                $rootScope.clickedSaveClientStatus = false;
                return;
            }
            Client.changeState({
                clientId: $scope.client.clientId,
                comment: $rootScope.changeStatusInClient.comment,
                clientState: $rootScope.changeStatusInClient.status
            }, function(resp) {
                if (resp.status == "ok") {
                    $rootScope.clickedSaveClientStatus = false;
                    notificationService.success($filter('translate')("client change state"));
                    $rootScope.changeStatusInClient.comment = "";
                    $rootScope.changeStatusInClient.status = null;
                    $scope.getLastEvent();
                    $('.changeStatusInClient.modal').modal('hide');
                } else {
                    $rootScope.clickedSaveClientStatus = false;
                    notificationService.error(resp.message);
                }
            }, function() {
                $('.changeStatusInClient.modal').modal('hide');
                //notificationService.error($filter('translate')('service temporarily unvailable'));
            });
        }
    };
    $('.ui.dropdown').dropdown();
    $scope.toAddContact = function(id) {
        $rootScope.contactClientAddId = $scope.client.localId;
        $location.path("contact/add/" + $scope.client.localId);
    };
    $scope.toAllVacancy = function(id) {
        $rootScope.searchedClientId = id;
        Vacancy.setOptions("clientId", id);
        $rootScope.searchClientId = id;
        $location.path("/vacancies");
    };
    $scope.toAddVacancy = function(id) {
        $rootScope.addVacancyClientId = id;
        $location.path("/vacancy/add/");
    };

    $scope.changeCommentFlag = function(history){
        history.editCommentFlag = !history.editCommentFlag;
        $scope.editComment = history.descr;
    };
    $scope.changeComment = function(action, comment){
        Action.editAction({"comment": comment, "actionId": action.actionId}, function(resp){
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
    };
    $scope.showDeleteComment = function(resp) {
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

    $rootScope.deleteComment = function() {
        Action.removeMessageAction({
            actionId: $rootScope.commentRemoveId
        },function(resp){
            if (resp.status === "ok") {
                notificationService.success($filter('translate')('Comment removed'));
                angular.forEach($scope.history, function(val) {
                    if($rootScope.commentRemoveId == val.actionId){
                        $scope.history.splice($scope.history.indexOf(val), 1);
                    }
                });
                $scope.getLastEvent();
            } else {
                //notificationService.error($filter('translate')('service temporarily unvailable'));
            }
           $rootScope.closeModal();
        })
    };
    $scope.showCommentsFirstTime = function(){
        //$scope.onlyComments = !$scope.onlyComments;
        Service.history({
            "vacancyId": null,
            "clientId": $scope.client !== undefined ? $scope.client.clientId : null,
            "page": {"number": 0, "count": $scope.historyLimit},
            "onlyWithComment":false
        }, function(res) {
            $scope.historyLimit = res.size;
            $scope.historyTotal = res.total;
            $scope.history = res.objects;
            $scope.onlyComments = false;
        });
    };
    $scope.showComments = function(){
        //$scope.onlyComments = !$scope.onlyComments;
        Service.history({
            "vacancyId": null,
            "clientId": $scope.client !== undefined ? $scope.client.clientId : null,
            "page": {"number": 0, "count": $scope.historyLimit},
            "onlyWithComment":true
        }, function(res) {
            console.log(res, 'res');
            $scope.historyLimit = res.size;
            $scope.historyTotal = res.total;
            $scope.history = res.objects;
            $scope.onlyComments = true;
            $('.showCommentSwitcher').prop("checked", !$scope.onlyComments);
            //$("html, body").animate({ scrollTop: $(document).height() }, "slow");
        });
    };
    $scope.showDetails = function(){
        //$scope.onlyComments = !$scope.onlyComments;
        Service.history({
            "vacancyId": null,
            "clientId": $scope.client !== undefined ? $scope.client.clientId : null,
            "page": {"number": 0, "count": $scope.historyLimit},
            "onlyWithComment":false
        }, function(res) {
            $scope.historyLimit = res.size;
            $scope.historyTotal = res.total;
            $scope.history = res.objects;
            $scope.onlyComments = false;
            $('.showCommentSwitcher').prop("checked", !$scope.onlyComments);
            //$("html, body").animate({ scrollTop: $(document).height() }, "slow");
        });
    };
    $scope.showCommentsSwitch = function () {
        if($scope.onlyComments) {
            $scope.showDetails();
        }  else {
            $scope.showComments();
        }
    };
    $scope.updateTasks = function(needOpenModal){
        Task.get({
            //'creator': $rootScope.me.userId,
            'clientId': $rootScope.client.clientId
        },function(resp){
            if(resp.status == 'ok'){
                $scope.totalTasksNumber = 0;
                $scope.totalTasksNumber = resp.total;
                $scope.clientTasks = resp.objects;
                if($scope.urlTaskId){
                    $rootScope.responsiblePersonsEdit = [];
                    angular.forEach($scope.clientTasks, function(resp){
                        if(resp.taskId == $scope.urlTaskId && needOpenModal){
                            $rootScope.editableTask = resp;
                            $scope.showModalEditTaskToCandidate($rootScope.editableTask);
                            $location.$$absUrl = $location.$$absUrl.split("&")[0];
                        }
                    });
                    if($rootScope.editableTask && $location.$$absUrl.indexOf('&task=') == -1){
                        $location.$$absUrl = $location.$$absUrl + '&task=' + $scope.urlTaskId;
                        angular.forEach($rootScope.editableTask.responsiblesPerson,function(resp){
                            angular.forEach($rootScope.persons,function(res){
                                if(resp.responsible.userId == res.userId){
                                    $rootScope.responsiblePersonsEdit.push(res);
                                    res.notShown = true;
                                    //$rootScope.persons.splice($rootScope.persons.indexOf(res), 1);
                                }
                            });
                        });
                        $('.editTaskInCandidate').modal('setting',{
                            onHide: function(){
                                $scope.urlTaskId = null;
                                $location.$$absUrl = $location.$$absUrl.split("&")[0];
                                $scope.$apply();
                            }
                        }).modal('show');
                    }
                }
            }else{
                notificationService.error(resp.message);
            }
        })
    };

    $scope.roundMinutes = function(date) {

        date.setHours(date.getHours());
        date.setMinutes(0);

        return date;
    };
    $(".changeDateNewTask").datetimepicker({
        format: "dd/mm/yyyy hh:00",
        startView: 2,
        minView: 1,
        autoclose: true,
        weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
        language: $translate.use(),
        initialDate: new Date(),
        startDate: new Date()
    }).on('changeDate', function (data) {
        $rootScope.newTask.targetDate = $('.changeDateNewTask').datetimepicker('getDate');
        $scope.roundMinutes($rootScope.newTask.targetDate)
    }).on('hide', function () {
        if ($('.changeDateNewTask').val() == "") {
            $rootScope.newTask.date = "";
        }
        $('.changeDateNewTask').blur();
    });
    $rootScope.updateTaskInModal = function(){
        $scope.updateTasks();
        $scope.getLastEvent();
    };
    $("#editDateTaskVacancy").datetimepicker({
        format: "dd/mm/yyyy hh:00",
        startView: 2,
        minView: 1,
        autoclose: true,
        weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
        language: $translate.use(),
        initialDate: new Date(),
        startDate: new Date()
    }).on('changeDate', function (data) {
        $rootScope.editableTask.targetDate = $('#editDateTaskVacancy').datetimepicker('getDate');
        roundMinutes($rootScope.editableTask.targetDate);
        Task.changeTargetDate({
            "taskId": $rootScope.editableTask.taskId,
            "date":$rootScope.editableTask.targetDate
        }, function(resp){
            $rootScope.updateTaskInModal();
        })
    }).on('hide', function () {
        if ($('#editDateTaskVacancy').val() == "") {
            $rootScope.editableTask.date = "";
        }
    });
    $(".withoutTimeTask").datetimepicker({
        format: "dd/mm/yyyy hh:00",
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

    $scope.showModalAddTaskToCandidate = function (size) {
        angular.forEach($rootScope.persons,function(res){
            res.notShown = false;
        });
        $rootScope.responsiblePersonsEdit = [];
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '../partials/modal/adding-task.html',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
        $scope.modalInstance.opened.then(function() {
            setTimeout(function(){
                $(".changeDateNewTask").datetimepicker({
                    format: "dd/mm/yyyy hh:00",
                    startView: 2,
                    minView: 1,
                    autoclose: true,
                    weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                    language: $translate.use(),
                    initialDate: new Date(),
                    startDate: new Date()
                }).on('changeDate', function (data) {
                    $rootScope.newTask.targetDate = $('.changeDateNewTask').datetimepicker('getDate');
                    function roundMinutes(date) {

                        date.setHours(date.getHours() + Math.round(date.getMinutes()/60));
                        date.setMinutes(0);

                        return date;
                    }
                    $scope.roundMinutes($rootScope.newTask.targetDate)
                }).on('hide', function () {
                    if ($('.changeDateNewTask').val() == "") {
                        $rootScope.newTask.date = "";
                    }
                    $('.changeDateNewTask').blur();
                });
            },1)
        });
    };

    $scope.isInactive = function (clientObj) {
        var inactive = false;
        $scope.inactiveVacancies = [];
        angular.forEach(clientObj, function (vac) {
            if(vac.status == 'completed'  || vac.status == 'canceled' || vac.status == 'deleted') {
                inactive = true;
                $scope.inactiveVacancies.push(vac);
            }
        });
        return inactive;
    };
    //$rootScope.deleteResponsibleInEdit = function(responsible){
    //    if($rootScope.responsiblePersons.length > 1){
    //        angular.forEach($rootScope.responsiblePersons, function(resp){
    //            if (resp.userId == responsible.userId){
    //                responsible.notShown = false;
    //                $rootScope.responsiblePersons.splice($rootScope.responsiblePersons.indexOf(resp), 1);
    //            }
    //        });
    //        $rootScope.editNameTask();
    //    }else{
    //        notificationService.error($filter('translate')('The task must have at least one responsible'));
    //    }
    //};
    $rootScope.changeTabOnTask = function(val){
        if (val == "Task") {
            $rootScope.editableTask.type = 'Task';
        } else if (val == "Call") {
            $rootScope.editableTask.type = 'Call';
        } else if (val == "Meeting") {
            $rootScope.editableTask.type = 'Meeting';
        }
        $rootScope.editNameTask();
        $scope.updateTasks();
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
    $scope.getFirstLetters = function(str){
        return firstLetters(str)
    };
    ///////////////////////////////////////////////////////////////Sent Email
    $rootScope.emailTemplateInModal = {
        text: "Hi!<br/><br/>--<br/>Best, <br/>[[recruiter's name]]"
    };

    $scope.showCandidateSentEmail = function(){
        if($rootScope.me.emails.length == 0){
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/no-synch-email.html',
                size: '',
                resolve: {

                }
            });
        }else{
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/client-send-email.html',
                size: '',
                resolve: {

                }
            });
            $scope.modalInstance.closed.then(function() {
                tinyMCE.remove()
            });
            console.log($rootScope.emailTemplateInModal);
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
                                $rootScope.emailTemplateInModal.text = tinyMCE.get('modalMCE').getContent();
                            });
                        }
                    });
                    $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[candidate name\]\]/g, $scope.client.fullName);
                    $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's name\]\]/g, $rootScope.me.fullName);
                    setTimeout(function(){
                        tinyMCE.get('modalMCE').setContent($rootScope.emailTemplateInModal.text);
                    },100);
                },0);
            });
            //angular.forEach($scope.candidate.contacts,function(resp){
            //    if(resp.type == 'email'){
            //        $rootScope.emailToSend = resp.value;
            //    }
            //});
        }
    };
    FileInit.initVacancyTemplateFileOption($scope, "", "", false, $filter);
    $scope.callbackFileForTemplate = function(resp, names) {
        $scope.fileForSave.push({"fileId": resp, "fileName": names});
        $rootScope.fileForSave.push({"fileId": resp, "fileName": names});
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
    $rootScope.sentEmail = function(){
        Mail.sendMailByTemplate({
                toEmails: $rootScope.emailToSend,
                fullName: $scope.client.fullName,
                email: $rootScope.emailTemplateInModal.email,
                date: null,
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
                }else{
                    notificationService.success($filter('translate')('Letter sent'));
                    $rootScope.closeModal();
                    $rootScope.emailToSend = null;
                    $rootScope.fileForSave = [];
                    $rootScope.emailTemplateInModal = {
                        text: "Hi [[candidate name]]!<br/><br/>--<br/>Best, <br/>[[recruiter's name]]"
                    };
                }
            });
    };

    ///////////////////////////////////////////////////////////////End of Sent Email
}
controller.controller('ClientOneController', ["serverAddress", "$scope", "$routeParams", "$location", "Client", "Service", "Contacts", "Vacancy",
    "$rootScope", "notificationService", "$filter", "ngTableParams",'Person',"Action", "Task", "CacheCandidates", "File", "FileInit", "$translate", "$uibModal", "$route", "Mail", "$localStorage", ClientOneController]);
