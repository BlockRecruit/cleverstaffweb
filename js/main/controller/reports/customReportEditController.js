

 function CustomReportEditCtrl($rootScope, $scope, Vacancy, Service, $location, $routeParams, notificationService, $filter, translateWords,
                       $translate, vacancyStages, Stat, Company, vacancyStages, Person, $uibModal, CustomReportsService, CustomReportEditService, $uibModal) {
    try {
        let filterVacancy = (vacancy) => {
            let index = vacancy.position.toLocaleLowerCase().indexOf(this.query.toLocaleLowerCase());

            if(index !== -1){
                return vacancy;
            }
        },
         showCurrentBlock = event => CustomReportEditService.showBlocks.call(null, event);
         _parentClick     = event => showCurrentBlock(event, $scope);

        CustomReportEditService.buildReport.call(this, $scope);
        this.showChoosingMenu           = CustomReportsService.showChoosingMenu;
        this.removeReport               = CustomReportsService.removeReport;
        this.remove                     = CustomReportsService.remove;
        this.closeModalOnRemove         = CustomReportsService.closeModal;
        this.inHover                    = CustomReportsService.inHover;
        this.outHover                   = CustomReportsService.outHover;
        this.data                       = CustomReportEditService.editReport;
        this.fieldsList                 = CustomReportEditService.editReport.vacancyFields;
        this.dateRange                  = CustomReportEditService.dateRange;
        this.selectValue                = CustomReportEditService.selectValue;
        this.selectValueStages          = CustomReportEditService.selectValueStages;
        this.selectAllStages            = CustomReportEditService.selectAllStages;
        this.selectValueVacancyFields   = CustomReportEditService.selectValueVacancyFields.bind(this, $scope);
        this.changeNameOrDescription    = CustomReportEditService.changeNameOrDescription;
        this.editNameOrDescr            = CustomReportEditService.editNameOrDescr;
        this.closeModal                 = CustomReportEditService.closeModal;
        this.saveNameOrDescr            = CustomReportEditService.saveNameOrDescr;
        this.saveCustomReport           = CustomReportEditService.saveCustomReport;
        this.showOrHideCandidates       = CustomReportEditService.showOrHideCandidates;
        this.selectDateRange            = CustomReportEditService.selectDateRange;
        this.selectAllVacancies         = CustomReportEditService.selectAllVacancies.bind(this, $scope);
        this.filterVacancy              = filterVacancy;
        this.parentClick                = _parentClick;
    }catch(error){
        console.log(error, 'error')
    }
 }
 controller
    .controller("CustomReportEditCtrl", ["$rootScope", "$scope", "Vacancy", "Service", "$location",
        "$routeParams", "notificationService", "$filter", "translateWords", "$translate",
        "vacancyStages", "Stat", "Company", "vacancyStages", "Person", "$uibModal","CustomReportsService","CustomReportEditService","$uibModal",CustomReportEditCtrl]);


