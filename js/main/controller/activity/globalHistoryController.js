controller.controller('ActivityGlobalHistoryController', ["$scope", "$rootScope", "Service", "Person", "Company", "notificationService", "$filter", "$translate", "$uibModal", "vacancyStages","Action","CacheCandidates",
    function($scope, $rootScope, Service, Person, Company, notificationService, $filter, $translate, $uibModal, vacancyStages, Action, CacheCandidates) {
    $scope.showHistory = true;
    $scope.loading = true;
        $rootScope.closeModal = function(){
            $scope.modalInstance.close();
        };
    $scope.search = function() {
        var country = null;
        var city = null;
        if ($scope.regionId) {
            if ($scope.regionIdType == 'country') {
                country = $scope.regionId;
            } else if ($scope.regionIdType == 'city') {
                city = $scope.regionId;
            }
        }
        vacancyStages.get(function(resp){
            $scope.customStages =resp.object.interviewStates;
        });
        var array = [];
        $scope.updateHistory = function(){
            Service.history({
                country: country, city: city,
                //"ignoreType":['sent_candidate_to_client'],
                personId: $rootScope.onlyMe ? $rootScope.userId : null,
                "page": {"number": 0, "count": $scope.historyLimit ? $scope.historyLimit : 20}
            }, function(res) {
                $scope.history = res.objects;
                console.log('history');
                setHistoryCandidatesLimit();
                angular.forEach($scope.history, function(value){
                    if(value.stateNew && value.type == "set_interview_status"){
                        array = value.stateNew.split(",");
                        angular.forEach($scope.customStages,function(val){
                            angular.forEach(array,function(resp){
                                if(val.customInterviewStateId == resp){
                                    array[array.indexOf(val.customInterviewStateId)] = val.name;
                                }
                            });
                        });
                        value.stateNew = array.toString();
                    }
                });
                $scope.showHistory = res.objects != undefined;

                $scope.historyLimit = 20;
                $scope.historyTotal = res.total;
                $scope.loading = false;
            });
        };
        $scope.updateHistory();
    };

    $scope.search();
    $scope.getMoreHistory = function() {
        var country = null;
        var city = null;
        if ($scope.regionId) {
            if ($scope.regionIdType == 'country') {
                country = $scope.regionId;
            } else if ($scope.regionIdType == 'city') {
                city = $scope.regionId;
            }
        }
        Service.history({
            country: country, city: city,
            personId: $rootScope.onlyMe ? $rootScope.userId : null,
            "page": {"number": 0, "count": $scope.historyLimit *= 2}
        }, function(res) {
            console.log('hist-2');
            $scope.history = res.objects;
            $scope.loading = false;

        }, function(error) {
        });
    };
    listenerForScopeLight($scope, $rootScope);

    $scope.callbackAddLogo = function(photo) {
        $rootScope.companyLogo = photo;
        $rootScope.logoLink = $scope.serverAddress + "/getapp?id=" + $rootScope.companyLogo + "&d=true";
    };

    $scope.callbackErr = function(err) {
        notificationService.error(err);
    };

        $scope.changeComment = function(action){
            Action.editAction({"comment": action.descr, "actionId": action.actionId}, function(resp){
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
        $scope.changeCommentFlag = function(history){
            history.editCommentFlag = !history.editCommentFlag;
            $scope.editComment = history.descr;
            console.log('history.editCommentFlag');
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
            console.log('deleteFunc');
        };

        $scope.toggleHistoryCandidatesLimit = function(hist) {
            if(!$scope.history[0].candidatesToShow) {
                setHistoryCandidatesLimit();
            }
            console.log('asdas');
            $scope.history[$scope.history.indexOf(hist)].candidatesToShow = $scope.history[$scope.history.indexOf(hist)].candidatesToShow === 5 ? hist.candidates.length : 5;
        };

        $rootScope.deleteComment = function() {
            Action.removeMessageAction({
                actionId: $rootScope.commentRemoveId
            },function(resp){
                if (resp.status === "ok") {
                    notificationService.success($filter('translate')('Comment removed'));
                    if(!$scope.onlyComments){
                        $scope.updateHistory();
                    }
                } else {
                    //notificationService.error($filter('translate')('service temporarily unvailable'));
                }
                $scope.closeModal();
            })
        };
        function setHistoryCandidatesLimit() {
            if($scope.history) {
                $scope.history.forEach((action) => {
                    action.candidatesToShow = 5;
                });
            } else {
                setTimeout(() => setHistoryCandidatesLimit(), 2000);
            }
        }
}]);
