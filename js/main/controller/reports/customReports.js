
    function customReports($rootScope, $scope, Vacancy, Service, $location, $routeParams, notificationService, $filter, translateWords,
                           $translate, vacancyStages, Stat, Company, vacancyStages, Person, $uibModal, CustomReportsService, CustomReportEditService) {
        try {
            let updateReport = () => CustomReportsService.buildReport.call(this, $scope);
            let showBlocks =  (event) => {
                let targetDataID = event.target.dataset, blockShow;

                if(targetDataID && targetDataID['show']){
                    blockShow = angular.element('#' + targetDataID['show'])[0];
                    CustomReportEditService.showBlocks(blockShow);
                    return;
                }
                CustomReportEditService.hiddenBlocks();
            };

            this.dataReport        = CustomReportsService.data;
            this.inHover           = CustomReportsService.inHover;
            this.outHover          = CustomReportsService.outHover;
            this.downloadReport    = CustomReportsService.downloadReport;
            this.getPersonFullName = CustomReportsService.getPersonFullName;
            this.regionIdToName    = CustomReportsService.regionIdToName;
            this.selectDateRange   = CustomReportsService.selectDateRange;
            this.remove            = CustomReportsService.remove;
            this.removeReport      = CustomReportsService.removeReport;
            this.closeModal        = CustomReportsService.closeModal;
            this.timeMaxZone       = CustomReportsService.timeMaxZone;
            this.timeMaxZone2      = CustomReportsService.timeMaxZone2;
            this.dateRange         = CustomReportEditService.dateRange;
            this.updateReport      = updateReport;
            this.showBlocks        = showBlocks;
            CustomReportsService.vacancyStages.call(this);
            CustomReportsService.getAllPersons.call(this);
            CustomReportsService.getDate.call(this, this.dataReport, $scope);
            CustomReportsService.buildReport.call(this, $scope);

        }catch(erorr){
            console.log(erorr, 'erorr CustomReports')
        }
    }
    controller
        .controller("CustomReports", ["$rootScope", "$scope", "Vacancy", "Service", "$location",
            "$routeParams", "notificationService", "$filter", "translateWords", "$translate",
            "vacancyStages", "Stat", "Company", "vacancyStages", "Person", "$uibModal","CustomReportsService","CustomReportEditService", customReports]);


