
function MyReportsCtrl($rootScope, $scope, Vacancy, Service, $location, $routeParams, notificationService, $filter, translateWords,
                       $translate, vacancyStages, Stat, Company, vacancyStages, Person, $uibModal, CustomReportsService) {
    try {

        Stat.requestGetCustomVacancyReports()
            .then((resp) => {
                this.customReports = resp['objects'];
                $rootScope.loading = false;
                $scope.$apply();
            });

        this.changeLocation = (path,report, event) => {
            console.log(report, event)
            this.getReport(event, report);
            $location.path(path);
        };

        this.changeLocationAllVacancies = (path) => {
            $location.path(path);
        };
        this.getReport    = CustomReportsService.getReport;
        this.remove       = CustomReportsService.remove;
        this.removeReport = CustomReportsService.removeReport;
        localStorage.setItem("isAddCandidates", false);
    }catch(erorr){
        console.log('Ошибка в customReports', erorr);
    }
}
controller
    .controller("MyReportsCtrl", ["$rootScope", "$scope", "Vacancy", "Service", "$location",
        "$routeParams", "notificationService", "$filter", "translateWords", "$translate",
        "vacancyStages", "Stat", "Company", "vacancyStages", "Person", "$uibModal","CustomReportsService", MyReportsCtrl]);


