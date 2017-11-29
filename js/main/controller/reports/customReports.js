
    function customReports($rootScope, $scope, Vacancy, Service, $location, $routeParams, notificationService, $filter, translateWords,
                           $translate, vacancyStages, Stat, Company, vacancyStages, Person, $uibModal, CustomReportsService) {
        try {
            this.dataReport        = CustomReportsService.data;
            this.inHover           = CustomReportsService.inHover;
            this.outHover          = CustomReportsService.outHover;
            this.downloadReport    = CustomReportsService.downloadReport;
            this.getPersonFullName = CustomReportsService.getPersonFullName;
            this.regionIdToName    = CustomReportsService.regionIdToName;
            this.remove            = CustomReportsService.remove;
            this.removeReport      = CustomReportsService.removeReport;
            this.closeModal        = CustomReportsService.closeModal;
            this.timeMaxZone       = CustomReportsService.timeMaxZone;
            this.timeMaxZone2      = CustomReportsService.timeMaxZone2;
            CustomReportsService.vacancyStages.call(this);
            CustomReportsService.getAllPersons.call(this);
            CustomReportsService.getDate.call(this, this.dataReport);
            CustomReportsService.buildReport.call(this, $scope);

        }catch(erorr){
            console.log(erorr, 'erorr CustomReports')
        }
    }
    controller
        .controller("CustomReports", ["$rootScope", "$scope", "Vacancy", "Service", "$location",
            "$routeParams", "notificationService", "$filter", "translateWords", "$translate",
            "vacancyStages", "Stat", "Company", "vacancyStages", "Person", "$uibModal","CustomReportsService", customReports]);


