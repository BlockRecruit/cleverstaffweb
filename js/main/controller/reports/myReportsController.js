
function MyReportsCtrl($rootScope, $scope, Vacancy, Service, $location, $routeParams, notificationService, $filter, translateWords,
                       $translate, vacancyStages, Stat, Company, vacancyStages, Person, $uibModal, CustomReportsService) {
    try {

        Stat.requestGetCustomVacancyReports()
            .then((resp) => {
                this.customReports = resp['objects'];
                $rootScope.loading = false;
                $scope.$apply();
            });

        this.getReport    = CustomReportsService.getReport;
        this.remove       = CustomReportsService.remove;
        this.removeReport = CustomReportsService.removeReport;
    }catch(erorr){
        console.log('Ошибка в customReports', erorr);
    }
}
controller
    .controller("MyReportsCtrl", ["$rootScope", "$scope", "Vacancy", "Service", "$location",
        "$routeParams", "notificationService", "$filter", "translateWords", "$translate",
        "vacancyStages", "Stat", "Company", "vacancyStages", "Person", "$uibModal","CustomReportsService", MyReportsCtrl]);


