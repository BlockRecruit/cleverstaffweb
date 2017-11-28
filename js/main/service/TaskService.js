angular.module('services.task', [
    'ngResource',
    'ngCookies'
]).factory('Task', ['$resource', 'serverAddress', '$filter', '$localStorage', 'notificationService',
    function ($resource, serverAddress, $filter, $localStorage, notificationService) {

        var Task = $resource(serverAddress + '/task/:param', {param: "@param"},
            {
                add: {
                    method: "PUT",
                    headers: {'Content-type': 'application/json; charset=UTF-8'},
                    params: {
                        param: "add"
                    }
                },
                get: {
                    method: "POST",
                    headers: {'Content-type': 'application/json; charset=UTF-8'},
                    params: {
                        param: "get"
                    }
                },
                edit: {
                    method: "POST",
                    headers: {'Content-type': 'application/json; charset=UTF-8'},
                    params: {
                        param: "edit"
                    }
                },
                changeState: {
                    method: "POST",
                    headers: {'Content-type': 'application/json; charset=UTF-8'},
                    params: {
                        param: "changeState"
                    }
                },
                changeTargetDate: {
                    method: "POST",
                    headers: {'Content-type': 'application/json; charset=UTF-8'},
                    params: {
                        param: "changeTargetDate"
                    }
                },
                taskComment: {
                    method: "POST",
                    params: {
                        param: "comment"
                    }
                },
                updateComment: {
                    method: "POST",
                    params: {
                        param: "updateComment"
                    }
                },
                removeComment: {
                    method: "POST",
                    params: {
                        param: "removeComment"
                    }
                },
                getHistory: {
                    method: "POST",
                    params: {
                        param: "getHistory"
                    }
                },
                addResponsible: {
                    method: "POST",
                    params: {
                        param: "addResponsible"
                    }
                },
                removeResponsible: {
                    method: "POST",
                    params: {
                        param: "removeResponsible"
                    }
                }
            });

        Task.task = function($scope, $rootScope, $location, $translate, $uibModal, $route){
            $rootScope.closeTaskModal = function(){
                $rootScope.closeModal();
            };
            $rootScope.saveNewTask = function(){
                if($route.current.$$route.pageName == 'Vacancies'){
                    $rootScope.newTask.vacancyId = $rootScope.vacancy.vacancyId;
                } else if($route.current.$$route.pageName == 'Candidate'){
                    $rootScope.newTask.candidateId = $scope.candidate.candidateId;
                } else if($route.current.$$route.pageName == 'Clients'){
                    $rootScope.newTask.clientId = $rootScope.client.clientId;
                }
                if($rootScope.newTask.title.length > 0) {
                    if($rootScope.newTask.targetDate > 0){
                        angular.forEach($rootScope.responsiblePersonsEdit, function(resp){
                            $rootScope.newTask.responsibleIds.push(resp.userId)
                        });
                        Task.add($rootScope.newTask, function(resp){
                            if(resp.status == 'ok'){
                                $scope.updateTasks();
                                notificationService.success($filter('translate')('Task saved'));
                                $rootScope.newTask.title = '';
                                $rootScope.newTask.text = '';
                                $rootScope.newTask.targetDate = '';
                                $rootScope.newTask.responsibleIds = [];
                                $rootScope.responsiblePersonsEdit = [];
                                $rootScope.newTask.type = 'Task';
                                $('.changeDateNewTask').val("");
                                //$scope.updateTasks();
                                $scope.getLastEvent();
                                $rootScope.closeTaskModal();
                            }else{
                                notificationService.error(resp.message);
                            }
                        })
                    }else{
                        notificationService.error($filter('translate')('Please enter a date'));
                    }
                }else{
                    notificationService.error($filter('translate')('Please enter a title for the task'));
                }
            };
            $rootScope.changeTaskState = function(task){
                $rootScope.editableTask = task;
                Task.changeState({
                    "taskId": task.taskId,
                    "taskState": task.status
                }, function(resp){
                    if(resp.status == 'ok'){
                        if($rootScope.editableTask){
                            $rootScope.editableTask = resp.object;
                        }
                        $rootScope.getHistoryForAllActions();
                        if($route.current.$$route.pageName != 'Activity'){
                            //$scope.updateTasks();
                            $scope.getLastEvent();
                        }
                    }else{
                        notificationService.error(resp.message);
                    }
                })
            };
            $rootScope.editNameTask = function(hideModal){
                if($rootScope.editableTask.title.length > 0){
                    $rootScope.editableTask.responsibleIds = [];
                    angular.forEach($rootScope.responsiblePersons, function(resp){
                        $rootScope.editableTask.responsibleIds.push(resp.userId)
                    });
                    Task.edit({
                        "taskId": $rootScope.editableTask.taskId,
                        "status": $rootScope.editableTask.status,
                        "title":$rootScope.editableTask.title,
                        "text":$rootScope.editableTask.text,
                        "targetDate":$rootScope.editableTask.targetDate,
                        "responsibleIds":$rootScope.editableTask.responsibleIds,
                        "type":$rootScope.editableTask.type
                    }, function(resp){
                        if(resp.status == 'ok'){
                            $rootScope.showEditNameTask = false;
                            $rootScope.showEditTextTask = false;
                            $rootScope.showNewText = false;
                            $scope.standartLength = $rootScope.editableTask.text;
                            $rootScope.editedTaskText = function (text) {
                                if($scope.standartLength != text && $rootScope.editableTask.text.length > 0){
                                    $rootScope.showNewText = true;
                                } else{
                                    $rootScope.showNewText = false;
                                }
                            };
                            $scope.urlTaskId = null;
                            if($route.current.$$route.pageName != 'Activity'){
                                //$scope.updateTasks();
                                $scope.getLastEvent();
                                $rootScope.getMoreHistory();
                                notificationService.success($filter('translate')('Task edited'));
                            } else{
                                $scope.tableParams.reload();
                                $rootScope.getMoreHistory();
                                notificationService.success($filter('translate')('Task edited'));
                            }
                            if(!hideModal){
                                $rootScope.closeModal();
                            }
                        }else{
                            notificationService.error(resp.message);
                        }
                    })
                }else{
                    notificationService.error($filter('translate')('Please enter a title for the task'));
                }
            };
            $rootScope.deleteTask = function(){
                Task.changeState({
                    "taskId": $rootScope.editableTask.taskId,
                    "taskState":'deleted'
                }, function(resp){
                    if(resp.status == 'ok'){
                        if($route.current.$$route.pageName != 'Activity'){
                            $scope.updateTasks();
                            $scope.getLastEvent();
                        } else{
                            $scope.tableParams.reload();
                        }
                        $rootScope.closeModal();
                        $scope.urlTaskId = null;
                        $location.$$absUrl = $location.$$absUrl.split("&")[0];
                        //$scope.$apply();
                    }else{
                        notificationService.error(resp.message);
                    }
                })
            };
            $rootScope.setResponsible = function(responsible){
                Task.addResponsible({
                    "taskId": $rootScope.editableTask.taskId,
                    "userId": responsible.userId
                }, function(resp){
                    if(resp.status == 'ok'){
                        $rootScope.getHistoryForAllActions();
                        if($route.current.$$route.pageName != 'Activity'){
                            //$scope.updateTasks();
                            $scope.getLastEvent();
                        } else{
                            $scope.tableParams.reload();
                        }
                    }else{
                        notificationService.error(resp.message);
                    }
                })
            };
            $rootScope.deletedResponsible = function(responsible){
                Task.removeResponsible({
                    "taskId": $rootScope.editableTask.taskId,
                    "userId": responsible.userId
                }, function(resp){
                    if(resp.status == 'ok'){
                        $rootScope.getHistoryForAllActions();
                        if($route.current.$$route.pageName != 'Activity'){
                            //$scope.updateTasks();
                            $scope.getLastEvent();
                        } else{
                            $scope.tableParams.reload();
                        }
                    }else{
                        notificationService.error(resp.message);
                    }
                })
            };
            $rootScope.addResponsible = function(responsible){
                var i = 0;
                angular.forEach($rootScope.responsiblePersonsEdit, function(resp){
                    if (resp.userId == responsible.userId){
                        i++;
                    }
                });
                if (i > 0){
                    notificationService.error($filter('translate')('This user already responsible for this task'));
                }else{
                    $scope.modalEditTaskToCandidateOpened = true;
                    responsible.notShown = true;
                    $rootScope.responsiblePersonsEdit.unshift(responsible);
                }
            };
            $rootScope.deleteResponsible = function(responsible){
                console.log('length', $rootScope.responsiblePersonsEdit.length);
                if($rootScope.responsiblePersonsEdit.length > 1){
                    angular.forEach($rootScope.responsiblePersonsEdit, function(resp){
                        if (resp.userId == responsible.userId){
                            responsible.notShown = false;
                            $rootScope.responsiblePersonsEdit.splice($rootScope.responsiblePersonsEdit.indexOf(resp), 1);
                        }
                    });
                }else{
                    notificationService.error($filter('translate')('The task must have at least one responsible'));
                }
            };
            $rootScope.addResponsibleInEdit = function(responsible){
                $rootScope.responsiblePersonsEdit = [];
                var i = 0;
                angular.forEach($rootScope.responsiblePersons, function(resp){
                    if (resp.userId == responsible.userId){
                        i++;
                    }
                });
                if (i > 0){
                    notificationService.error($filter('translate')('This user already responsible for this task'));
                }else{
                    $scope.modalEditTaskToCandidateOpened = true;
                    responsible.notShown = true;
                    $rootScope.responsiblePersons.unshift(responsible);
                }
                $rootScope.setResponsible(responsible);
            };
            $rootScope.deleteResponsibleInEdit = function(responsible){
                $rootScope.responsiblePersonsEdit = [];
                if($rootScope.responsiblePersons.length > 1){
                    angular.forEach($rootScope.responsiblePersons, function(resp){
                        if (resp.userId == responsible.userId){
                            responsible.notShown = false;
                            $rootScope.responsiblePersons.splice($rootScope.responsiblePersons.indexOf(resp), 1);
                        }
                    });
                    $rootScope.deletedResponsible(responsible);
                }else{
                    notificationService.error($filter('translate')('The task must have at least one responsible'));
                }
            };
            $scope.modalEditTaskToCandidateOpened = true;
            $scope.showModalEditTaskToCandidate = function (task) {
                $scope.modalEditTaskToCandidateOpened = false;
                $location.$$absUrl = $location.$$absUrl.split("&")[0];
                let newUrl = $location.$$absUrl.split('?')[0];
                $scope.urlDescription = $location.$$absUrl.split('?')[1] ||  $scope.urlDescription;

                $location.$$absUrl = newUrl + '&task=' + task.taskId;
                $rootScope.responsiblePersons = [];
                $rootScope.responsiblePersonsEdit = [];
                $rootScope.historyComment = [];
                $rootScope.historyAction = [];
                $rootScope.editableTask = task;
                $rootScope.showNewText = false;
                $scope.standartLength = $rootScope.editableTask.text;
                $rootScope.editedTaskText = function (text) {
                    if($scope.standartLength != text && $rootScope.editableTask.text.length > 0){
                        $rootScope.showNewText = true;
                    } else{
                        $rootScope.showNewText = false;
                    }
                };
                angular.forEach($rootScope.persons,function(res){
                    res.notShown = false;
                });
                angular.forEach($rootScope.editableTask.responsiblesPerson,function(resp){
                    angular.forEach($rootScope.persons,function(res){
                        if(resp.responsible.userId == res.userId){
                            $rootScope.responsiblePersons.push(res);
                            res.notShown = true;
                            //$rootScope.persons.splice($rootScope.persons.indexOf(res), 1);
                        }
                    });
                });
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '../partials/modal/edit-task.html',
                    size: '',
                    scope: $scope,
                    resolve: function(){

                    }
                });
                $scope.modalInstance.closed.then(function() {
                    $scope.modalEditTaskToCandidateOpened = true;
                    $rootScope.responsiblePersons = [];
                    if($scope.urlDescription) {
                        if($location.$$absUrl.indexOf('&task=') == -1) {
                            $location.$$absUrl += '?' + $scope.urlDescription;
                        }  else {
                            $location.$$absUrl = $location.$$absUrl.split('&task=')[0] + '?' + $scope.urlDescription;
                        }

                    }
                });
                $rootScope.getMoreHistory = function(number){
                    Task.getHistory({
                        'taskId': task.taskId,
                        "page": {"number": 0, "count": $rootScope.historyLimit + number}
                    }, function (resp) {
                        if (resp.status == 'ok') {
                            $rootScope.historyLimit = resp.objects !== undefined ? resp.size : null;
                            $rootScope.historyTotal = resp.objects !== undefined ? resp.total : null;
                            if($rootScope.historyTotal < $rootScope.historyLimit){
                                $('.more-history').css('display', 'none');
                            }
                            $rootScope.historyTask = resp.objects;
                        }else{
                            notificationService.error(resp.message);
                        }
                    });
                };
                $rootScope.getHistoryForComment = function(){
                    Task.getHistory({
                        'taskId': task.taskId,
                        'type': 'comment'
                    }, function (resp) {
                        if (resp.status == 'ok') {
                            $rootScope.historyComment = [];
                            $(".taskSwitcher").prop( "checked", true );
                            $rootScope.historyTask = resp.objects;
                            angular.forEach($rootScope.historyTask,function(resp){
                                if(resp.type == 'comment'){
                                    $rootScope.historyComment.push(resp);
                                }
                            });
                        }else{
                            notificationService.error(resp.message);
                        }
                    });
                };
                $rootScope.getHistoryForAllActions = function(){
                    Task.getHistory({
                        'taskId': task.taskId,
                        "page": {"number": 0, "count": $rootScope.historyLimit}
                    }, function (resp) {
                        if (resp.status == 'ok') {
                            $(".taskSwitcher").prop( "checked", false );
                            $rootScope.historyLimit = resp.objects !== undefined ? resp.size : null;
                            $rootScope.historyTotal = resp.objects !== undefined ? resp.total : null;
                            $rootScope.historyTask = resp.objects;
                        }else{
                            notificationService.error(resp.message);
                        }
                    });
                };
                $rootScope.getHistoryForTask = function(val){
                    if(val == 'all actions') {
                        $rootScope.showAllActions = true;
                        $(".taskSwitcher").prop( "checked", true );
                        $rootScope.getHistoryForAllActions();
                    }else if(val == 'comment') {
                        $rootScope.getHistoryForComment();
                        $rootScope.showAllActions = false;
                        $(".taskSwitcher").prop( "checked", false );
                    }else if(val == 'switch') {
                        $rootScope.showAllActions = !$rootScope.showAllActions;
                        if($rootScope.showAllActions == false){
                            $rootScope.getHistoryForComment();
                            $(".taskSwitcher").prop( "checked", true );
                        }else{
                            $rootScope.getHistoryForAllActions();
                            $(".taskSwitcher").prop( "checked", false );
                        }
                    }
                };
                $rootScope.getHistoryForTask('all actions');
                $scope.modalInstance.result.then(function (selectedItem) {
                    //$scope.selected = selectedItem;
                }, function () {
                    $location.$$absUrl = $location.$$absUrl.split("&")[0];
                });
            };
            $scope.showModalEditTask = function (event) {
                if(event){
                    angular.forEach($rootScope.persons,function(res){
                        res.notShown = false;
                    });
                    $rootScope.responsiblePersons = [];
                    $rootScope.editableTaskOuter = event;
                    $rootScope.editableTask = event.task;
                    $rootScope.showNewText = false;
                    $scope.standartLength = $rootScope.editableTask.text;
                    $rootScope.editedTaskText = function (text) {
                        if($scope.standartLength != text && $rootScope.editableTask.text.length > 0){
                            $rootScope.showNewText = true;
                        } else{
                            $rootScope.showNewText = false;
                        }
                    };
                    angular.forEach($rootScope.editableTask.responsiblesPerson,function(resp){
                        angular.forEach($rootScope.persons,function(res){
                            if(resp.responsible.userId == res.userId){
                                $rootScope.responsiblePersons.push(res);
                                res.notShown = true;
                                //$rootScope.persons.splice($rootScope.persons.indexOf(res), 1);
                            }
                        });
                    });
                    $scope.modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '../partials/modal/edit-task.html',
                        size: '',
                        scope: $scope,
                        resolve: function(){

                        }
                    });
                    $rootScope.getMoreHistory = function(number){
                        Task.getHistory({
                            'taskId': $rootScope.editableTask.taskId,
                            "page": {"number": 0, "count": $rootScope.historyLimit + number}
                        }, function (resp) {
                            if (resp.status == 'ok') {
                                $rootScope.historyLimit = resp.objects !== undefined ? resp.size : null;
                                $rootScope.historyTotal = resp.objects !== undefined ? resp.total : null;
                                if($rootScope.historyTotal < $rootScope.historyLimit){
                                    $('.more-history').css('display', 'none');
                                }
                                $rootScope.historyTask = resp.objects;
                            }else{
                                notificationService.error(resp.message);
                            }
                        });
                    };
                    $rootScope.getHistoryForComment = function(){
                        Task.getHistory({
                            'taskId': $rootScope.editableTask.taskId,
                            'type': 'comment'
                        }, function (resp) {
                            if (resp.status == 'ok') {
                                $rootScope.historyComment = [];
                                $(".taskSwitcher").prop( "checked", true );
                                $rootScope.historyTask = resp.objects;
                                angular.forEach($rootScope.historyTask,function(resp){
                                    if(resp.type == 'comment'){
                                        $rootScope.historyComment.push(resp);
                                    }
                                });
                            }else{
                                notificationService.error(resp.message);
                            }
                        });
                    };
                    $rootScope.getHistoryForAllActions = function(){
                        Task.getHistory({
                            'taskId': $rootScope.editableTask.taskId,
                            "page": {"number": 0, "count": $rootScope.historyLimit}
                        }, function (resp) {
                            if (resp.status == 'ok') {
                                $(".taskSwitcher").prop( "checked", false );
                                $rootScope.historyLimit = resp.objects !== undefined ? resp.size : null;
                                $rootScope.historyTotal = resp.objects !== undefined ? resp.total : null;
                                $rootScope.historyTask = resp.objects;
                            }else{
                                notificationService.error(resp.message);
                            }
                        });
                    };
                    $rootScope.getHistoryForTask = function(val){
                        if(val == 'all actions') {
                            $rootScope.showAllActions = true;
                            $(".taskSwitcher").prop( "checked", true );
                            $rootScope.getHistoryForAllActions();
                        }else if(val == 'comment') {
                            $rootScope.getHistoryForComment();
                            $rootScope.showAllActions = false;
                            $(".taskSwitcher").prop( "checked", false );
                        }else if(val == 'switch') {
                            $rootScope.showAllActions = !$rootScope.showAllActions;
                            if($rootScope.showAllActions == false){
                                $rootScope.getHistoryForComment();
                                $(".taskSwitcher").prop( "checked", true );
                            }else{
                                $rootScope.getHistoryForAllActions();
                                $(".taskSwitcher").prop( "checked", false );
                            }
                        }
                    };
                    $rootScope.getHistoryForTask('all actions');
                    $rootScope.changeTaskState = function(task){
                        $rootScope.editableTask = task;
                        Task.changeState({
                            "taskId": task.taskId,
                            "taskState": task.status
                        }, function(resp){
                            if(resp.status == 'ok'){
                                if($rootScope.editableTask){
                                    $rootScope.editableTask = resp.object;
                                }
                                $rootScope.getHistoryForAllActions();
                                if($route.current.$$route.pageName != 'Activity'){
                                    $scope.updateTasks();
                                    $scope.getLastEvent();
                                } else{
                                    $scope.tableParams.reload();
                                }
                            }else{
                                notificationService.error(resp.message);
                            }
                        })
                    };

                }
            };
            $rootScope.addCommentForTask = function(){
                if($("#addComment").val().length > 0){
                    Task.taskComment({
                        taskId: $rootScope.editableTask.taskId,
                        comment: $rootScope.addComment.comment
                    },function(resp){
                        if(resp.status == 'ok'){
                            $rootScope.historyComment = [];
                            $rootScope.historyTask = resp.object;
                            $rootScope.addComment.comment = '';
                            if($rootScope.showAllActions = true){
                                $rootScope.getHistoryForAllActions();
                             }else{
                                $rootScope.getHistoryForComment();
                            }
                            $(".taskSwitcher").prop( "checked", true );
                            notificationService.success($filter('translate')('Comment added'));
                        }else{
                            notificationService.error(resp.message);
                        }
                    });
                }else{
                    notificationService.error($filter('translate')('write_a_comment'));
                }
            };
            $rootScope.updateCommentForTask = function(comment, taskId, taskActionId){
                if($("#addComment2").val().length > 0){
                    Task.updateComment({
                        taskId: taskId,
                        comment: comment,
                        taskActionId: taskActionId
                    },function(resp){
                        if(resp.status == 'ok'){
                            taskActionId.showTxtArea = false;
                            if($rootScope.showAllActions = true){
                                $rootScope.getHistoryForAllActions();
                            }else{
                                $rootScope.getHistoryForComment();
                            }
                            $rootScope.historyTask = resp.object;
                        }else{
                            notificationService.error(resp.message);
                        }
                    });
                }else{
                    notificationService.error($filter('translate')('write_a_comment'));
                }
            };
            $rootScope.deleteCommentForTask = function (taskId, taskActionId) {
                Task.removeComment({
                    taskId: taskId,
                    taskActionId: taskActionId
                },function(resp){
                    if(resp.status == 'ok'){
                        $rootScope.historyTask = resp.object;
                        if($rootScope.showAllActions = true){
                            $rootScope.getHistoryForAllActions();
                        }else{
                            $rootScope.getHistoryForComment();
                        }
                        notificationService.success($filter('translate')('Comment removed'));
                    } else{
                        notificationService.error(resp.message);
                    }
                });
            };
        };
        return Task;
    }]);