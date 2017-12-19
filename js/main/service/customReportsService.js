function CustomReportsService($rootScope, Stat, $translate, Company, Person, vacancyStages, notificationService, $location, $uibModal,$timeout, CustomField) {
    try{
        var reports = {},
            loadingExcel = false;


        function resetDefaultData() {
            reports.fieldsList = [
                {value:"client",visiable:false},
                {value:"salary",visiable:false},
                {value:"location",visiable:false},
                {value:"responsibles",visiable:false},
                {value:"status",visiable:false},
                {value:"dc",visiable:false},
                {value:"dateFinish",visiable:false},
                {value:"numberOfPositions",visiable:false},
                {value:"datePayment",visiable:false},
                {value:"budget",visiable:false},
                {value:"employmentType",visiable:false},
                {value:"candidatesAdded",visiable:false},
                {value:"candidatesInWork",visiable:false},
                {value:"candidatesApproved",visiable:false},
                {value:"candidatesRefused",visiable:false},
                {value:"daysInWork",visiable:false}];
        }

        function isCheckedFields(data, fieldsList) {
            fieldsList.forEach(item => {
                if(data.indexOf(item.id || item.value) !== -1){
                    item.visiable = true;
                }
            })
        }

        function formatDate(date) {

            var dd = date.getDate();
            if (dd < 10) dd = '0' + dd;

            var mm = date.getMonth() + 1;
            if (mm < 10) mm = '0' + mm;

            var yy = date.getFullYear() % 100;

            if (yy < 10) yy = '0' + yy;

            return dd + '.' + mm + '.' + yy;
        }
        


        function _getDataCandidate(data, regions, persons, stages) {
            angular.forEach(data, item => {
                angular.forEach(item.info, res => {
                    getReginForCandidate(res, regions);
                    getRecruterForCandidate(res, persons);
                    getStagesForCandidate(res, stages);
                })
            });
        }
        
        function resetNoAngularContext($scope) {
            if($rootScope.modalInstance)$rootScope.modalInstance.close();
            $rootScope.loading  = false;
            $scope.$apply();
        }

        function getReginForCandidate(res , regions) {
            angular.forEach(regions, function(reigion){
                if(res.candidate.regionId == reigion.regionId){
                    res.candidate.regionfullName = reigion.displayFullName;
                }
            });
        }

        function getStagesForCandidate(res , stages) {
            angular.forEach(stages, function(stage){
                if(res.interview.state == stage.customInterviewStateId){
                    res.interview.state = stage.name;
                }
            });
        }

        function getRecruterForCandidate(res , persons) {
            angular.forEach(persons, function(person){
                if(res.interview.creatorId == person.userId){
                    res.interview.creatorCutFullName = person.cutFullName;
                }
            });
        }
        
        function _showReportWithoutCandidates(response) {
            this.vacancyData = response.object["entryList"].map(item => item["vacancy"]);
            this.regions = response.object['regions'];
            this.build = true;
        }

        function _showReportWithCandidates(resp) {
            this.mainData = resp.object['entryList'];
            this.build = false;
            _getDataCandidate(this.mainData, this.regions,  resp.object['persons'], this.customStages);
        }

        function concatCastomOrStandartFields(custom, standart) {
            custom.objects.forEach(item => {
                standart.push({
                    value: item.title,
                    visiable: false,
                    id: item.fieldId
                })
            });
        }

        function responseSetInView(resp){
            resetDefaultData();
            concatCastomOrStandartFields(resp.filter(item => item.request == 'customField')[0],reports.fieldsList);
            isCheckedFields(this.dataReport["vacancyFields"], reports.fieldsList);
            isCheckedFields(this.dataReport["сustomVacancyFields"], reports.fieldsList);
            this.fieldsList = reports.fieldsList;
            _showReportWithoutCandidates.call(this, resp.filter(item => item.request == 'Statistic2')[0]);

        }

        function requestWithOrWithoutCandidates($scope) {
            console.log(this.dataReport, 'this.dataReport');
            let withCandidates = this.dataReport["withCandidates"];
            (withCandidates)? requestWithCandidates.call(this, $scope) : requestWithoutCandidates.call(this, $scope);
        }

        function requestWithCandidates($scope) {
            Stat.requestGetActualVacancyStatistic2({
                "from": this.dataReport['dateFrom'],
                "to": this.dataReport['dateTo'],
                "types":null,
                "vacancyId":null,
                "vacancyIds":(this.dataReport["vacancyIds"] && this.dataReport["vacancyIds"].length > 0)? this.dataReport["vacancyIds"] : null,
                "vacancyStatuses": this.dataReport["vacancyStatuses"],
                "interviewStatuses": this.dataReport["interviewStatuses"],
                "interviewCreatorIds": this.dataReport["interviewCreatorIds"],
                "vacancyFields": this.dataReport["vacancyFields"],
                "withCandidates":this.dataReport["withCandidates"]
            }, false)
                .then((resp) => {
                    resetDefaultData();
                    _showReportWithCandidates.call(this, resp);
                    resetNoAngularContext($scope);
                });
        }

        function requestWithoutCandidates($scope) {
            Promise.all([Stat.requestGetActualVacancyStatistic2({
                "from": (this.startVacancyDate)? this.startVacancyDate : this.dataReport['dateFrom'],
                "to": (this.endDate)? this.endDate : this.dataReport['dateTo'],
                "types":null,
                "vacancyId":null,
                "vacancyIds":(this.dataReport["vacancyIds"] && this.dataReport["vacancyIds"].length > 0)? this.dataReport["vacancyIds"]:null,
                "vacancyStatuses": this.dataReport["vacancyStatuses"],
                "interviewStatuses": this.dataReport["interviewStatuses"],
                "interviewCreatorIds": this.dataReport["interviewCreatorIds"],
                "vacancyFields": this.dataReport["vacancyFields"],
                "customVacancyFields":(this.dataReport["сustomVacancyFields"])?this.dataReport["сustomVacancyFields"]:[],
                "withCandidates":this.dataReport["withCandidates"]
            }, false),
                CustomField.requestGetFieldsTitles() ])

                .then((resp) => {
                    responseSetInView.apply(this, [resp]);
                    resetNoAngularContext($scope);
                });
        }

        reports.getReport = data => {
            reports.data = data;
            localStorage.setItem('reportsData', JSON.stringify(data));
        };

        reports.showChoosingMenu = function(selector, $scope){
            if($(selector).css('display') == 'none'){
                $(selector).show('500');
                $('body').mouseup((e) =>{
                    $scope.$apply(() => {
                        if ($(selector).has(e.target).length === 0) {
                            $(selector).hide("500");
                            $(document).off('mouseup');
                            this.chooseListFieldsVacancies = false;
                        }
                    });
                });
            }else{
                $('body').unbind('mouseup');
                $(selector).hide("500");
                this.chooseListFieldsVacancies = false;
            }
        };

        reports.removeReport = function ($scope)  {
            let id = $scope.id;

            Stat.requestDeleteCustomVacancyReport({id: id})
                .then(response => response)
                .then(response => Stat.requestGetCustomVacancyReports())
                .then(response => {
                    let url = $location.path().split('/');
                        if(url.length > 2) {
                            $location.path('/reports');
                        }
                    this.customReports = response["objects"];
                    resetNoAngularContext($scope)
                })
                .catch(error => console.log(error, 'removeReport Method'))
        };

        reports.remove = function (id, scope) {
            scope.id = id;
            $rootScope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/delete-custom-reports.html?b4',
                size: '',
                backdrop: 'static',
                scope: scope,
            });
        };

        reports.closeModal = function () {
            $rootScope.modalInstance.close();
        };


        reports.inHover = function (event) {
            let target = event.target.nextElementSibling;
                target.style.display = 'block';
        };

        reports.outHover = function (event) {
            let target = event.target.nextElementSibling;
                target.style.display = 'none';
        };

        reports.getPersonFullName = function (id) {
            var fullName = '';
            angular.forEach(reports.associativePerson, function (resp) {
                if(resp.userId == id) {
                    fullName = resp.cutFullName;
                }
            });
            return fullName;
        };

        reports.getDate = function (dataReport, scope) {
            var now = Date.now();
                now += (2592000000 * 2);

            $(".startDate").datetimepicker({
                format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy" : "mm/dd/yyyy",
                startView: 4,
                minView: 2,
                autoclose: true,
                weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                language: $translate.use(),
                endDate: new Date(now)
            }).on('changeDate', (data) => {
                this.startVacancyDate = data.date.getTime();
                if(this.startVacancyDate > new Date()){
                    this.timeMaxZone = true;
                }else{ this.timeMaxZone = false;}

                (this.data)? this.data.dateFrom = this.startVacancyDate : null;

                setTimeout(() => {
                    this.change = false;
                    scope.$apply();
                }, 100)
            })
              .on('hide', () => ($('.startDate').val() == "")? this.startVacancyDate = null : false);

            $(".endDate").datetimepicker({
                format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy" : "mm/dd/yyyy",
                startView: 4,
                minView: 2,
                autoclose: true,
                weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                language: $translate.use(),
                endDate: new Date(now)
            }).on('changeDate', (data) => {
                this.endDate = data.date.getTime();
                if(this.endDate > new Date()){
                    this.timeMaxZone = true;
                }else{ this.timeMaxZone = false;}
                console.log(dataReport,'dataReport)');
                (this.data)? this.data.dateTo = this.endDate : null;

                setTimeout(() => {
                    this.change = false;
                    scope.$apply();
                }, 100)
            })
              .on('hide', () => ($('.endDate').val() == "")? this.endDate = null : false);


            $(".startDate").datetimepicker("setDate", new Date(dataReport['dateFrom']));
            $(".endDate").datetimepicker("setDate", new Date(dataReport['dateTo']));
        };

        reports.buildReport = function($scope){
            requestWithOrWithoutCandidates.call(this, $scope);
        };

        reports.downloadReport = function () {
            $rootScope.loading = true;
            if(loadingExcel == false){
                loadingExcel = true;
                Stat.createVacancyStatisticExcel({
                    "from": this.dataReport['dateFrom'],
                    "to": this.dataReport['dateTo'],
                    "types":null,
                    "vacancyId":null,
                    "vacancyIds":(this.dataReport["vacancyIds"] && this.dataReport["vacancyIds"].length > 0)? this.dataReport["vacancyIds"]:null,
                    "vacancyStatuses": this.dataReport["vacancyStatuses"],
                    "interviewStatuses": this.dataReport["interviewStatuses"],
                    "interviewCreatorIds": this.dataReport["interviewCreatorIds"],
                    "vacancyFields": this.dataReport["vacancyFields"],
                    "withCandidates": this.dataReport["withCandidates"],
                    "сustomVacancyFields":(this.dataReport["сustomVacancyFields"])? this.dataReport["сustomVacancyFields"] : []
                }, function (resp) {
                    if (resp.status == 'ok') {
                        var sr = $rootScope.frontMode == "war" ? "/hr/" : "/hrdemo/";

                        $timeout(() => {
                            $('#downloadReport')[0].href = sr + 'getapp?id=' + resp.object;

                            $('#downloadReport')[0].click();
                        },100)
                    }

                    loadingExcel = false;
                    $rootScope.loading = false;
                });
            }
        };

        reports.getAllPersons = function () {
            Person.getAllPersons(resp => {
                this.associativePerson = resp.object;
                angular.forEach(this.associativePerson, function(res){
                    res.added = false;
                });
            });
        };

        reports.vacancyStages = function () {
            vacancyStages.get(resp =>{
                this.customStages = resp.object.interviewStates;
            });
        };

        reports.getPersonFullName = function (id) {
            let fullName = '';

            angular.forEach(this.associativePerson, function (resp) {
                if(resp.userId == id) {
                    fullName = resp.cutFullName;
                }
            });

            return fullName;
        };

        reports.regionIdToName = function (regionId) {
            var location = '';

            angular.forEach(this.regions, function(regVal){
                if(regionId == regVal.regionId){
                    location = regVal.fullName;
                }
            });

            return (location)? location : "-";
        };

        if(!reports.data) {
            if (!localStorage.getItem('reportsData') || localStorage.getItem('reportsData') == '') {
                $location.path('/reports')
            }else{
                reports.data = JSON.parse(localStorage.getItem('reportsData'));
            }
        }
        return reports;
    }catch(error){
        console.log(error, 'error CustomReportsService');
    }
}

angular
    .module('services.CustomReportsService',['ngResource', 'ngCookies'])
    .factory('CustomReportsService',["$rootScope","Stat", "$translate","Company","Person","vacancyStages", "notificationService","$location","$uibModal","$timeout","CustomField", CustomReportsService]);