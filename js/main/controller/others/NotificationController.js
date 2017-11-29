controller.controller('NotificationController',["$rootScope", "$scope", "$filter", "$uibModal", "Person", "notificationService", "Statistic",
    function($rootScope, $scope, $filter, $uibModal, Person, notificationService, Statistic) {
        $scope.sendNotificationObj = [
            {
                name: 'sendInterviewNotification',
                value: 'Y'
            },
            {
                name: 'mailDailyReport',
                value: 'Y'
            },
            {
                name: 'sendVacancyResponsible',
                value: 'Y'
            },
            {
                name: 'sendNewRecall',
                value: 'Y'
            }
        ];
        angular.forEach($rootScope.me.personParams, function(value,key){
            angular.forEach($scope.sendNotificationObj, function(res){
                if(res.name == key){
                    res.value = value;
                }
            });
        });

        $scope.changeReport = function(param){
            if(param.value == 'Y'){
                param.value = 'N';
            }else{
                param.value = 'Y';

            }
            Person.changeUserParam({
                userId: $rootScope.me.userId,
                name: param.name,
                value: param.value
            },function(resp){
                if(resp.status == 'ok'){
                    Person.getMe(function(response){
                        $rootScope.me = response.object;
                    });
                    $("#ShowSaveSettings").css('display', 'block');
                    setTimeout(function(){
                        $("#ShowSaveSettings").css('display', 'none');
                    },2000);
                }else{
                    notificationService.error(resp.message);
                }
            })
        };

        $scope.requestReportModal = function () {
            Statistic.setParam('requestReportDate', null);
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/request-report.html?6',
                scope: $scope,
                resolve: {
                }
            })
        };

        $scope.requestReport = function () {
            let requestReportDate = Statistic.getParam('requestReportDate');
            if(requestReportDate) {
                Statistic.getDailyReport({
                    date: requestReportDate
                }, function (resp) {
                    if(resp.status != 'error') {
                        notificationService.success($filter('translate')('You will receive this report within 10 minutes'));
                        $scope.closeModal();
                    } else {
                        notificationService.error(resp.message);
                    }
                })
            } else {
                notificationService.error($filter('translate')('Please, choose the date'));
            }
        };

        $scope.closeModal = function () {
          $scope.modalInstance.close();
        };

    }]);