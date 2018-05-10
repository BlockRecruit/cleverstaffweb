controller.controller('pipelineController', ["$rootScope", "$scope", "notificationService", "$filter", "$translate", "vacancyStages","Stat", "$uibModal",
    function($rootScope, $scope, notificationService, $filter, $translate, vacancyStages, Stat, $uibModal) {
        $rootScope.loading = false;
        $rootScope.closeModal = function(){
            $scope.modalInstance.close();
        };
        vacancyStages.get(function(data){
            $scope.customStages = data.object.interviewStates;
        });

        $scope.buildPipelineReport = function () {
            $rootScope.loading = true;
            Stat.getStatisticsByVacancies(function(resp){
                if(resp.status == 'ok'){
                    $scope.vacancies = resp.object.positionReport;
                    //Stat.countCandidateByVacancyAndLastActiveDate(function(res){
                    $scope.stagesOnVacancy = resp.objects[0].lastActiveState;
                    angular.forEach($scope.vacancies, function(data,key){
                        if(data.deadline){
                            if(differenceBetweenTwoDates(data.deadline, new Date()) <= 3){
                                data.strongWarning = true;
                            }
                        }
                        angular.forEach($scope.stagesOnVacancy, function(dat){
                            if(dat.vacancyId == data.vacancyId){
                                switch(dat.num){
                                    case 1:
                                        data.lastActiveStage = dat;
                                        data.lastActiveStage.differenceInDays = differenceBetweenTwoDates(new Date(), data.lastActiveStage.lastAction);
                                        // if(data.deadline){
                                        if(differenceBetweenTwoDates(data.lastActiveStage.lastAction, new Date()) < -5){
                                            data.warning = true;
                                        }
                                        // }
                                        break;
                                    case 2:
                                        data.previousActiveStage = dat;
                                        break;
                                }
                            }
                        });
                    });
                    //});
                    //Stat.countCandidateByRefusalAndApprovedReasonsAndLastActiveDate(function(ref){
                    var refuses = resp.objects[0].refusal;
                    var approved = resp.objects[0].approved;
                    angular.forEach($scope.vacancies, function(data,key){
                        angular.forEach(approved, function(dat){
                            if(dat.vacancyId == data.vacancyId){
                                data.approved = dat
                            }
                        });
                        angular.forEach(refuses, function(dat){
                            if(dat.vacancyId == data.vacancyId){
                                data.refusal = dat
                            }
                        });
                    });
                    //});
                    $rootScope.loading = false;
                }
            });
        };

        $scope.buildPipelineReport();

        Stat.getStatisticsByVacancies(function(resp){
           if(resp.status == 'ok'){
               $scope.vacancies = resp.object.positionReport;
               //Stat.countCandidateByVacancyAndLastActiveDate(function(res){
                   $scope.stagesOnVacancy = resp.objects[0].lastActiveState;
                   angular.forEach($scope.vacancies, function(data,key){
                       if(data.deadline){
                           if(differenceBetweenTwoDates(data.deadline, new Date()) <= 3){
                               data.strongWarning = true;
                           }
                       }
                       angular.forEach($scope.stagesOnVacancy, function(dat){
                           if(dat.vacancyId == data.vacancyId){
                              switch(dat.num){
                                  case 1:
                                      data.lastActiveStage = dat;
                                      data.lastActiveStage.differenceInDays = differenceBetweenTwoDates(new Date(), data.lastActiveStage.lastAction);
                                      // if(data.deadline){
                                          if(differenceBetweenTwoDates(data.lastActiveStage.lastAction, new Date()) < -5){
                                              data.warning = true;
                                          }
                                      // }
                                      break;
                                  case 2:
                                      data.previousActiveStage = dat;
                                      break;
                              }
                           }
                       });
                   });
               //});
               //Stat.countCandidateByRefusalAndApprovedReasonsAndLastActiveDate(function(ref){
                   var refuses = resp.objects[0].refusal;
               var approved = resp.objects[0].approved;
                   angular.forEach($scope.vacancies, function(data,key){
                       angular.forEach(approved, function(dat){
                           if(dat.vacancyId == data.vacancyId){
                               data.approved = dat
                           }
                       });
                       angular.forEach(refuses, function(dat){
                           if(dat.vacancyId == data.vacancyId){
                               data.refusal = dat
                           }
                       });
                   });
               //});
               $rootScope.loading = false;
           }
        });
        $scope.showPipelineDescr = function(){
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/pipeline-descr.html?b=2',
                size: '',
                resolve: function(){

                }
            });
        };
    }
]);


