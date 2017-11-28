controller.controller('EmployeeOneController', ['$scope', 'Employee', '$routeParams', '$location', '$sce', '$rootScope',
    'Candidate', 'FileInit', 'notificationService', '$filter', '$translate', 'Service', '$uibModal', 'File',
    function($scope, Employee, $routeParams, $location, $sce, $rootScope, Candidate, FileInit, notificationService, $filter, $translate, Service, $uibModal, File) {
        $scope.pageObject = {
            employee: null,
            history:null,
            employeeStatus: [
                {value: "work"},
                {value: "dismiss"},
                //{value: "vacation"}
            ]
        };
        $scope.addLinkToCandidate = {
            name: '',
            url: ''
        };
        $rootScope.closeModal = function(){
            $scope.modalInstance.close();
        };
        $scope.onlyComments = false;
        $('.showCommentSwitcher').prop("checked", !$scope.onlyComments);
        $scope.addLinkErrorShow = false;
        $scope.showAddedLinks = false;
        $scope.showAddedFiles = false;
        $scope.showAddLink = false;
        $scope.showEditFileName = false;
        $rootScope.changeStatusOfEmployeeObject = {
            comment: "",
            oldStatus: null,
            newStatus: null,
            buttonIsClicked: false
        };
        function getEmployeeHistory(){
            Employee.getEmployeeHistory({id: $routeParams.id}, function(resp) {
                $scope.pageObject.history=resp.objects;
                angular.forEach($scope.history, function(val) {
                    if(val.type == 'vacancy_message' ||
                        val.type == 'candidate_message' ||
                        val.type == 'interview_message' ||
                        val.type == 'client_message'){
                        $scope.showComments();
                    }
                });
            });
        }
        getEmployeeHistory();

        if ($routeParams.id == undefined) {
            $location.path("/company/employees");
        }
        $scope.showModalChangeEmployeeStatus = function(status) {
            if (status != undefined) {
                $rootScope.changeStatusOfEmployeeObject.oldStatus = $scope.pageObject.employee.state;
                $rootScope.changeStatusOfEmployeeObject.newStatus = status;
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '../partials/modal/employee-change-status-in-employee.html',
                    resolve: {
                        items: function () {

                        }
                    }
                });
            }
        };

        $rootScope.saveNewEmployeeStatus = function() {
            if (!$rootScope.changeStatusOfEmployeeObject.buttonIsClicked) {
                $rootScope.changeStatusOfEmployeeObject.buttonIsClicked = true;
                Employee.changeState({
                    employeeId: $scope.pageObject.employee.employeeId,
                    employeeState: $rootScope.changeStatusOfEmployeeObject.newStatus,
                    comment: $rootScope.changeStatusOfEmployeeObject.comment,
                    date: $rootScope.changeStatusOfEmployeeObject.firedDate
                }, function(resp) {
                    if (resp.status == 'ok') {
                        $scope.pageObject.employee = resp.object;
                        $scope.pageObject.employee.state = resp.object.state;
                        $rootScope.changeStatusOfEmployeeObject.buttonIsClicked = false;
                        $rootScope.changeStatusOfEmployeeObject.comment = "";
                        $rootScope.closeModal();
                        getEmployeeHistory();
                    }
                }, function(error) {
                    $rootScope.changeStatusOfEmployeeObject.buttonIsClicked = false;
                    $rootScope.closeModal();
                });
            }
        };

        FileInit.initFileOption($scope, "candidate");
        $scope.callbackFile = function(resp, name) {
            if (!$scope.pageObject.employee.candidateId.files) {
                $scope.pageObject.employee.candidateId.files = [];
            }
            $scope.pageObject.employee.candidateId.files.push(resp);
            $scope.updateEmployee();
        };


        $scope.removeFile = function(fileId, elementId) {
            Candidate.removeFile({
                "candidateId": $scope.pageObject.employee.candidateId.candidateId,
                "fileId": fileId
            }, function(resp) {
                if (resp.status == 'ok') {
                    $scope.updateEmployee();
                }
            });
        };
        $scope.updateEmployee = function(){
            $scope.showAddedLinks = false;
            $scope.showAddedFiles = false;
            Employee.one({id: $routeParams.id}, function(resp) {
                if (resp.status == "ok") {
                    $rootScope.title = resp.object.candidateId.fullName + " | CleverStaff";
                    $scope.pageObject.employee = resp.object;
                    console.log($scope.pageObject.employee);
                    $('.candidateCoreSkills').html($scope.pageObject.employee.candidateId.coreSkills);
                    $scope.objectId = $scope.pageObject.employee.candidateId.candidateId;
                    $scope.relookShown = function(){
                        if($scope.pageObject.employee.candidateId.files){
                            if($scope.pageObject.employee.candidateId.files.length != undefined && $scope.pageObject.employee.candidateId.files.length != 0){
                                angular.forEach($scope.pageObject.employee.candidateId.files, function (val) {
                                    if(val.url){
                                        $scope.showAddedLinks = true;
                                    }
                                    if(!val.url){
                                        $scope.showAddedFiles = true;
                                    }
                                });
                            }
                        } else{
                            $scope.showAddedLinks = false;
                            $scope.showAddedFiles = false;
                        }
                    };
                    $scope.relookShown();
                    if ($scope.pageObject.employee.candidateId) {
                        /** @namespace $scope.pageObject.employee.candidateId.coreSkills */
                        if ($scope.pageObject.employee.candidateId.coreSkills) {
                            $scope.pageObject.employee.candidateId.coreSkills = $sce.trustAsHtml($scope.pageObject.employee.candidateId.coreSkills);
                        }
                        if ($scope.pageObject.employee.candidateId.descr) {
                            $scope.pageObject.employee.candidateId.descr = $sce.trustAsHtml($scope.pageObject.employee.candidateId.descr);
                        }
                    }
                } else {
                    $location.path("/company/employees");
                }
            });
        };
        $scope.updateEmployee();


        $scope.toEdit = function() {
            $location.path('/company/employees/edit/' + $scope.pageObject.employee.employeeId);
        };

        $('.ui.dropdown').dropdown();

        $scope.showModalAddCommentToEmployee = function () {
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/add-comment-employee.html',
                size: '',
                resolve: function(){

                }
            });
            $(document).unbind("keydown").keydown(function(e) {
                if (e.ctrlKey == true && e.which == 13) {
                    $rootScope.addCommentInCandidate();
                }
            });
        };

        $rootScope.addCommentInCandidate = function () {
            if ($rootScope.commentEmployee.comment != undefined && $rootScope.commentEmployee.comment.length > 0) {
                $rootScope.commentEmployee.loading = true;
                Employee.setComment({
                    comment: $rootScope.commentEmployee.comment,
                    employeeId: $scope.pageObject.employee.employeeId
                }, function (resp) {
                    $rootScope.commentEmployee.loading = false;
                    $rootScope.closeModal();
                    $rootScope.commentEmployee.comment = null;
                    getEmployeeHistory();
                    //$scope.getLastEvent();
                }, function (error) {
                    $rootScope.commentEmployee.loading = false;
                });
            }
        };
        $scope.changeCommentEmployee = function(action){
            Employee.editComment({"comment": action.comment, "employeeHistoryId": action.employeeHistoryId}, function(resp){
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

        // $scope.showDeleteCommentEmployee = function(resp) {
        //     $('.deleteCommentEmployee.modal').modal('show');
        //     $rootScope.commentRemove = resp;
        //     $rootScope.employeeHistoryId = resp.employeeHistoryId;
        // };
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
            $rootScope.employeeHistoryId = resp.employeeHistoryId;
        };


        $rootScope.deleteComment = function() {
            Employee.removeComment({
                employeeHistoryId: $rootScope.employeeHistoryId
            },function(resp){
                if (resp.status === "ok") {
                    notificationService.success($filter('translate')('Comment removed'));
                    getEmployeeHistory();
                } else {
                    //notificationService.error($filter('translate')('service temporarily unvailable'));
                }
                $rootScope.closeModal();
            })
        };
        $(".datepickerOfFired").datetimepicker({
            format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy" : "mm/dd/yyyy",
            startView: 4,
            minView: 2,
            autoclose: true,
            language: $translate.use()
        }).on('hide', function(val) {
            if (val.date != undefined) {
                $rootScope.changeStatusOfEmployeeObject.firedDate = val.date.getTime();
                $scope.startFiredDate = $(".datepickerOfStartWorking").val();
            }
            $('.datepickerOfFired').blur();
        });

        $scope.showAddLinkFunc = function(){
            $scope.showAddLink = true;
        };
        $scope.closeAddLinkFunc = function(){
            $scope.showAddLink = false;
            $scope.addLinkToCandidate.name = null;
            $scope.addLinkToCandidate.url = null;
            $scope.addLinkErrorShow = false;
        };
        $scope.addLinkInCandidate = function(){
            if($scope.addLinkToCandidate.name && $scope.addLinkToCandidate.url){
                Candidate.addLink({
                    "candidateId": $scope.pageObject.employee.candidateId.candidateId,
                    "name" : $scope.addLinkToCandidate.name,
                    "url" : $scope.addLinkToCandidate.url
                }, function (resp){
                    if(resp.status === 'ok'){
                        $scope.addLinkToCandidate.name = null;
                        $scope.addLinkToCandidate.url = null;
                        $scope.addLinkErrorShow = false;
                        $scope.showAddLink = false;
                        //$scope.candidate.files.push(resp.object);
                        $scope.updateEmployee();
                    } else{
                        notificationService.error(resp.message);
                    }
                });
            } else{
                $scope.addLinkErrorShow = true;
            }
        };
        $scope.showCommentsFirstTime = function(){
            //$scope.onlyComments = !$scope.onlyComments;
            Employee.getEmployeeHistory({
                "vacancyId": $scope.vacancy !== undefined ? $scope.vacancy.vacancyId : null,
                "id": $scope.pageObject.employee !== undefined ? $scope.pageObject.employee.employeeId : null,
                "clientId": $scope.client !== undefined ? $scope.client.clientId : null,
                "onlyWithComment":true
            }, function(res) {
                $scope.pageObject.history = res.objects;
                $scope.onlyComments = true;
            });
        };
        $scope.showComments = function(){
            //$scope.onlyComments = !$scope.onlyComments;
            Employee.getEmployeeHistory({
                "vacancyId": $scope.vacancy !== undefined ? $scope.vacancy.vacancyId : null,
                "id": $scope.pageObject.employee !== undefined ? $scope.pageObject.employee.employeeId : null,
                "clientId": $scope.client !== undefined ? $scope.client.clientId : null,
                "onlyWithComment":true
            }, function(res) {
                $scope.pageObject.history = res.objects;
                $scope.onlyComments = true;
                $('.showCommentSwitcher').prop("checked", !$scope.onlyComments);
            });
        };
        $scope.showDetails = function(){
            //$scope.onlyComments = !$scope.onlyComments;
            Employee.getEmployeeHistory({
                "vacancyId": $scope.vacancy !== undefined ? $scope.vacancy.vacancyId : null,
                "id": $scope.pageObject.employee !== undefined ? $scope.pageObject.employee.employeeId : null,
                "clientId": $scope.client !== undefined ? $scope.client.clientId : null,
                "onlyWithComment":false
            }, function(res) {
                $scope.pageObject.history = res.objects;
                $scope.onlyComments = false;
                $('.showCommentSwitcher').prop("checked", !$scope.onlyComments);
            });
        };
        $scope.showCommentsSwitch = function () {
            if($scope.onlyComments) {
                $scope.showDetails();
            }  else {
                $scope.showComments();
            }
        };
    }
])
;