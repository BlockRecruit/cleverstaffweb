
function MyReportsCtrl($rootScope, $scope, Vacancy, Service, $location, $routeParams, notificationService, $filter, translateWords,
                       $translate, vacancyStages, Stat, Company, vacancyStages, Person, $uibModal, CustomReportsService, reportsService, $window) {
    try {
        Stat.requestGetCustomVacancyReports()
            .then((resp) => {
                this.customReports = resp['objects'];
                $rootScope.loading = false;
                $scope.$apply();
            });

        reportsService.showMore.call(this);

        this.changeLocation = (path, report, event) => {
            (report)? this.getReport(event, report) : null;
            $location.path(path);
        };

        this.isShowMore          = true;
        this.getReport           = CustomReportsService.getReport;
        this.remove              = CustomReportsService.remove;
        this.removeReport        = CustomReportsService.removeReport;
        this.removeReport        = CustomReportsService.removeReport;
        this.reportsBlocks       = reportsService.reportsBlocks;
        this.inviteHiringManager = reportsService.inviteHiringManager;
        localStorage.setItem("isAddCandidates", false);
    }catch(erorr){
        console.log('Ошибка в customReports', erorr);
    }
}
controller
    .controller("MyReportsCtrl", ["$rootScope", "$scope", "Vacancy", "Service", "$location",
        "$routeParams", "notificationService", "$filter", "translateWords", "$translate",
        "vacancyStages", "Stat", "Company", "vacancyStages", "Person", "$uibModal","CustomReportsService","reportsService","$window", MyReportsCtrl]);


