function CustomReportEditService($rootScope, Stat, $translate, Company, Person, vacancyStages, notificationService, CustomReportsService, $timeout, $uibModal, translateWords, $location, CustomField, $filter, Vacancy) {
    try{
        let vacancyStatuses,
            fieldsListStart,
            activeBlocks = [],
            singleton = {
                editReport: {}
            };

        function resetDefaultData() {
                fieldsListStart = [
                    {value:"client",visible:false},
                    {value:"salary",visible:false},
                    {value:"location",visible:false},
                    {value:"responsibles",visible:false},
                    {value:"status",visible:false},
                    {value:"dc",visible:false},
                    {value:"dateFinish",visible:false},
                    {value:"numberOfPositions",visiable:false},
                    {value:"datePayment",visible:false},
                    {value:"budget",visible:false},
                    {value:"employmentType",visible:false},
                    {value:"candidatesAdded",visible:false},
                    {value:"candidatesInWork",visible:false},
                    {value:"candidatesApproved",visible:false},
                    {value:"candidatesRefused",visible:false},
                    {value:"daysInWork",visible:false}];

                vacancyStatuses =[
                    {
                        value: "open",
                        added: false,
                        count: 0
                    },
                    {
                        value: "expects",
                        added: false,
                        count: 0
                    },
                    {
                        value: "inwork",
                        added: false,
                        count: 0
                    },
                    {
                        value: "payment",
                        added: false,
                        count: 0
                    },
                    {
                        value: "completed",
                        added: false,
                        count: 0
                    },
                    {
                        value: "canceled",
                        added: false,
                        count: 0
                    }
                ],
            inVacancyStatuses =[
                {
                    value: "longlist",
                    added: false,
                    count: 0
                },
                {
                    value: "shortlist",
                    added: false,
                    count: 0
                },
                {
                    value: "test_task",
                    added: false,
                    count: 0
                },
                {
                    value: "interview",
                    added: false,
                    count: 0
                },
                {
                    value: "interview_with_the_boss",
                    added: false,
                    count: 0
                },
                {
                    value: "security_check",
                    added: false,
                    count: 0
                },
                {
                    value: "tech_screen",
                    added: false,
                    count: 0
                },
                {
                    value: "hr_interview",
                    added: false,
                    count: 0
                },
                {
                    value: "tech_interview",
                    added: false,
                    count: 0
                },
                {
                    value: "interview_with_the_client",
                    added: false,
                    count: 0
                },
                {
                    value: "sent_offer",
                    added: false,
                    count: 0
                },
                {
                    value: "accept_offer",
                    added: false,
                    count: 0
                },
                {
                    value: "approved",
                    added: false,
                    count: 0
                },
                {
                    value: "notafit",
                    added: false,
                    count: 0,
                    type: "refuse"
                },
                {
                    value: "declinedoffer",
                    added: false,
                    count: 0,
                    type: "refuse"
                },
                {
                    value: "no_response",
                    added: false,
                    count: 0,
                    type: "refuse"
                },
                {
                    value: "no_contacts",
                    added: false,
                    count: 0,
                    type: "refuse"
                }
            ],
                singleton.editReport = angular.copy(CustomReportsService.data);
                singleton.dateRange = ['currentWeek','previousWeek','currentMonth', 'previousMonth', 'currentYear', 'previousYear', 'customRange'];

        }

        function concatCastomOrStandartFields(custom, standart) {
            console.log(custom, standart, 'custom, standart');
            custom.forEach(item => {
                standart.push({
                    value: item.title,
                    visiable: false,
                    id: item.fieldId
                })
            });
        }

        function checkProperty(data, property) {
            property.forEach(item  => {
                if(data.indexOf(item.value) !== -1 || data.indexOf(item.customInterviewStateId) !== -1){
                    item.added = true;
            }
        });
            return property;
        }

        function checkPropertyFyelds(data, property) {
            property.forEach(item  => {
                let index = data.indexOf(item.id || item.value);

                if(index !== -1){
                    item.visible = true;
                }
            });
            return property;
        }

        function checkPropertyPersons(data, property) {
            let i, index;

            for(i in property){
                index = data.indexOf(i);

                if(index !== -1){
                    property[i].added = true;
                }else{
                    property[i].added = false;
                }
            }
            return property;
        }

        function checkCount(data, property) {
            property.forEach(i => {
               data.forEach(j => {
                   if(j.item === i.value || j.item === i.customInterviewStateId){
                       i.count = j.count;
                   }
               });
            });
        }

        function checkCountStatuses(data, property) {
            angular.forEach(data, function (status) {
                let search = false;

                property.forEach((item) => {
                    if(item.value == status.item){
                        item['count'] = status['count'];
                        search = true;
                        return;
                    }
                });
                if(!search)property.push({value:status.item, count:status.count});
            });
        }

        function concatStages(data){
            let mass = inVacancyStatuses.concat(data);
            isType(mass);
            return mass;
        }

        function isType(mass){
            mass.forEach(item =>{
                if(!item.type) item.type = 'ok';
            })
        }

        function isAllStagesChecked(data) {
            let i = 0, max = data.length, flag = true;

            for(; i < max; i++){
                if(!data[i].added){
                    flag = false
                }
            }
            return flag;
        }

        function splitMassStagesOnTypes(mass) {
            let obj = {};

            obj['Standard'] =  mass.filter(item => item.type === 'ok');
            obj['Company']  =  mass.filter(item => item.type !== 'ok'&& item.type !== 'refuse' );
            obj['Refuse']   =  mass.filter(item => item.type === 'refuse');

            return obj;
        }


        function _dataProcessing(data, item) {
            let respData = item.object, allStages = [],
                requestCountStages = data.filter(item => item.request === "stagesOrCount");

            if (item.request === 'statusesOrCount') {
                checkCountStatuses(respData, vacancyStatuses);
                checkProperty(singleton.editReport.vacancyStatuses, vacancyStatuses);
                this.vacancyStatuses = vacancyStatuses;
            } else if (item.request === 'stageFull') {
                allStages = respData.interviewStates.filter(item => item.status !== 'D');
                allStages = concatStages(allStages);
                checkProperty(singleton.editReport.interviewStatuses, allStages);
                checkCount(requestCountStages[0]["object"], allStages);
                this.selectStages = allStages.filter(item => item.added == true);
                allStages = splitMassStagesOnTypes(allStages);
                this.allStages = allStages;
            } else if(item.request == 'AllPersons'){
                this.associativePerson = checkPropertyPersons(singleton.editReport.interviewCreatorIds, item.object);
            }else if(item.request == 'customField'){
                concatCastomOrStandartFields(item.objects, fieldsListStart);
            }
        }

        function checkChangedArray(startData, finishData) {
            let change = true, i = 0, max = startData.length;

            if(startData.length === finishData.length){
                for(; i < max; i++){
                    if(!change) return false;
                    change = finishData.some(finish => finish === startData[i]);
                }
            }else{
                return false;
            }
            return change;
        }

        function checkChangedPrimitiveData(startData, finishData, index) {
            let change = true, i = 0, max = startData.length;

            if(index !== -1  && (finishData === startData) ){
                change =  true;
            }else{
                return false;
            }
            return change;
        }

        function isChanged(startData, finishData) {
            let index, i, change = true;
            console.log(startData, finishData);

            for(i in startData){
                index = Object.getOwnPropertyNames(finishData).sort().indexOf(i);

                if(startData[i].pop){
                    change = checkChangedArray(startData[i], finishData[i]);
                    if(!change) return change;
                }else{
                    change = checkChangedPrimitiveData(startData[i], finishData[i],index);
                    if(!change) return change;
                }
            }
            return change;
        }

        function createFinishDataBeforeSave() {
            let i, data = this.associativePerson, selectPerson = [];

            for(i in data){
                if(data[i].added){
                    selectPerson.push(i)
                }
            }

            this.data.interviewCreatorIds = selectPerson;
            this.data.withCandidates      = this.data.withCandidates;
            this.data.dateFrom            = (this.startVacancyDate)? this.startVacancyDate: CustomReportsService.data.dateFrom;
            this.data.dateTo              = (this.endDate)? this.endDate: CustomReportsService.data.dateTo;
            this.data.vacancyStatuses     = filterSelectedItems(this.vacancyStatuses, 'vacancyStatuses');
            this.data.interviewStatuses   = filterSelectedItems(this.selectStages, 'interviewStatuses');
            this.data.vacancyFields       = filterSelectedItems(this.fieldsList, 'vacancyFields');
            this.data.сustomVacancyFields = filterSelectedItems(this.fieldsList, 'сustomVacancyFields');
            this.data.vacancyIds          = this.fieldsVacancyList.filter(item => item.visible).map(item => item.vacancyId);
        }

        function filterSelectedItems(data, type) {
            let i = '', mass = [];

            if(type === 'vacancyStatuses' || type === 'interviewStatuses'){
                data = data.filter(item => item.added);
                data = data.map(item => item.customInterviewStateId || item.value);
            }else if(type === 'vacancyFields'){
                data = data.filter(item => item.visible && !item.id);
                data = data.forEach(item => {
                        mass.push(item.value);
                });
                return mass;
            }else if(type === 'сustomVacancyFields'){
                data.forEach(item =>{
                    if(item.visible && item.id){
                        mass.push(item.id);
                    }
                });
                return mass;
            }
            return  data;
        }

        function showSelectStages(data, select){
            let dataSelected = this.selectStages,
                index;

            if(select){
                data.forEach(item =>{
                    index = dataSelected.indexOf(item);
                    (index === -1)? dataSelected.push(item) : null;
                });
            }
        }

        function checkOnChange() {
            let change = true;

            createFinishDataBeforeSave.call(this);
            change = isChanged(CustomReportsService.data, this.data);
            this.change = change;
        }

        function checkPropertiesListVacancies(fieldsVacancyList, responseData) {
            let data, index;

            responseData.forEach(item => {
                index = fieldsVacancyList.indexOf(item.vacancyId);
                if(index !== -1){
                    item.visible = true;
                }
            });

            return responseData;
        }

        function _showBlocks(blockShow){
            activeBlocks.push(blockShow);
            blockShow.classList.toggle('active');
        }

        function _hiddenBlocks() {
            for(let i = 0; i < activeBlocks.length; i++){
                activeBlocks[i].classList.remove('active');
                activeBlocks.splice(i,1);
                i -= 1;
            }
        }

        function updateListVacansies(startDate,endDate) {
          return Vacancy.getAllVacansies({from:startDate,to:endDate});
        }

        function setListVacancies(resp) {
            console.log(this,'this')
            let responseData, listVacancies = this.fieldsVacancyList;

            if(!resp.objects){
                $rootScope.loading = false;
                return;
            }

            responseData = resp.objects;

            responseData.forEach(i => {
                listVacancies.forEach(j =>{
                    let i2 = i;
                    if(i2.vacancyId  === j.vacancyId && j.visible){
                        i2.visible = true;
                    }
                });
            });

            listVacancies  = null;
            this.fieldsVacancyList = responseData;
            $rootScope.loading = false;
        }

        resetDefaultData();

        singleton.showOrHideCandidates = function () {
            this.data.withCandidates = !this.data.withCandidates;
            checkOnChange.call(this)
        };

        singleton.buildReport =  function ($scope) {
            this.change = true;
            this.timeMaxZone = false;
            this.timeMaxZone2 = false;
            resetDefaultData();

                Promise.all(
                    [
                        Stat.requestGetCountVacancyForActualVacancyStatistic({
                            from: singleton.editReport.dateFrom,
                            interviewCreatorIds: [],
                            to: singleton.editReport.dateTo
                        }),
                        Stat.requestGetCountInterviewForActualVacancyStatistic({
                            from: singleton.editReport.dateFrom,
                            interviewCreatorIds: [],
                            to: singleton.editReport.dateTo
                        }),
                        vacancyStages.requestVacancyStages(),
                        Person.requestGetAllPersons(),
                        CustomField.requestGetFieldsTitles(),
                    ]).then(data => {
                        data.forEach(item => {
                            _dataProcessing.apply(this, [data, item]);
                        });
                        CustomReportsService.getDate.apply(this, [singleton.editReport, $scope, true]);
                        this.fieldsList = checkPropertyFyelds(this.fieldsList, fieldsListStart);
                        this.fieldsList = checkPropertyFyelds(this.data.сustomVacancyFields, this.fieldsList);
                        return true;
                     })
                    .then(resp => Vacancy.getAllVacansies({from:singleton.editReport.dateFrom,to:singleton.editReport.dateTo}))
                    .then(resp => {
                        this.fieldsVacancyList = checkPropertiesListVacancies(this.data.vacancyIds, resp.objects)
                        $rootScope.loading = false;
                        $scope.$apply();
                    });
        };

        singleton.selectValue = function (status) {
            status.added = !status.added;
            checkOnChange.call(this)
        };

        singleton.selectValueVacancyFields = function (status) {
            status.visible = !status.visible;
            checkOnChange.call(this)
        };

        singleton.changeNameOrDescription = function (scope) {
            this.copyData = angular.copy(this.data);

            $rootScope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/edit-name-and-description-custom-reports.html',
                size: '',
                backdrop: 'static',
                scope: scope,
            });
        };

        singleton.editNameOrDescr = function () {
            $rootScope.modalInstance.close();
        };

        singleton.saveNameOrDescr = function () {
            checkOnChange.call(this)
        };

        singleton.closeModal = function () {
            this.data.name = this.copyData.name;

            if(this.copyData.descr){
                this.data.descr = this.copyData.descr;
            }else{this.data.descr = '';}

            $rootScope.modalInstance.close();
        };

        singleton.selectValueStages = function (stage, type, data ,scope) {
            let index = data[type].indexOf(stage),
                change = true,
                index2 = this.selectStages.indexOf(data[type][index]);

            if(index !== -1){
                data[type][index].added = !data[type][index].added;
            }

            if(data[type][index].added && index2 === -1){
                this.selectStages.push(data[type][index]);
            }

           isAllCheck = isAllStagesChecked(this.allStages[type]);

            if(isAllCheck){
                setTimeout(()=>{
                    this.allStages[type].select = true;
                    scope.$apply();
                },0)
            }

            checkOnChange.call(this)
        };

        singleton.saveCustomReport = function ($scope) {
            if(this.timeMaxZone2){
                $rootScope.loading = false;
                return;
            }else if(this.timeMaxZone){
                $rootScope.loading = false;
                return;
            }

            translateWords.getTranslete("Report saved", $scope, 'reportSaved');
            let params = {
                "from": this.data.dateFrom,
                "to": this.data.dateTo,
                "types": null,
                "vacancyIds": this.data.vacancyIds,
                "vacancyStatuses": this.data.vacancyStatuses,
                "interviewStatuses": this.data.interviewStatuses,
                "interviewCreatorIds": this.data.interviewCreatorIds,
                "vacancyFields": this.data.vacancyFields,
                "withCandidates": this.data.withCandidates,
                "customReportName": this.data.name,
                "descr": (this.data.descr)? this.data.descr : '',
                "customVacancyReportId": this.data.customVacancyReportId,
                "customVacancyFields": this.data.сustomVacancyFields
            };

            Stat.requestEditCustomVacancyReport(params)
                .then((resp) => {
                    if(resp.status == "error"){
                        notificationService.error(resp.message);
                        return;
                    }
                    notificationService.success($filter('translate')('_Report') + " " + this.data.name + " " + $filter('translate')('saved'));
                    $location.path('/reports');
                    $rootScope.loading = false;
                    $scope.$apply();
                }, (error) => {
                    translateWords.getTranslete(error.text, $scope, 'error');
                    notificationService.error($scope.error)
                });
        };

        singleton.selectAllStages = function (stage) {
            let data = this.allStages[stage], i;

            if(!data['select']){
                data['select'] = true;

                for(i in data){
                    data[i].added = true;
                }
            }else if(data['select']){
                data['select'] = false;

                for(i in data){
                    data[i].added = false;
                }
            }

            showSelectStages.apply(this,[data, data['select']]);
            checkOnChange.call(this)
        };

        singleton.selectDateRange = function (event, dateRange, isUpdate) {
            let currentDate = new Date(),
                currentDateStart = new Date(),
                currentDateFinish = new Date();
            this.disabled = true;
            this.selectRange = dateRange;

            switch(dateRange) {
                case 'currentWeek':
                    currentDateStart.setDate(currentDate.getDate() - (currentDate.getDay() - 1));
                    currentDateFinish.setDate(currentDate.getDate());
                    break;
                case 'previousWeek':
                    currentDateStart.setDate((currentDate.getDate() - (currentDate.getDay() - 1)) - 7);
                    currentDateFinish.setDate((currentDate.getDate() - (currentDate.getDay() - 1)) - 1);
                    break;
                case 'currentMonth':
                    currentDateStart.setDate(1);
                    currentDateFinish.setDate(currentDate.getDate());
                    break;
                case 'previousMonth':
                    currentDateStart.setMonth(currentDate.getMonth() - 1, 1);
                    currentDateFinish.setMonth(currentDate.getMonth(), 0);
                    break;
                case 'currentYear':
                    currentDateStart.setFullYear(currentDate.getFullYear(), 0, 1);
                    currentDateFinish.setDate(currentDate.getDate());
                    break;
                case 'previousYear':
                    currentDateStart.setFullYear(currentDate.getFullYear() - 1, 0, 1);
                    currentDateFinish.setFullYear(currentDate.getFullYear(), 0, 0);
                    break;
                case 'customRange':
                    this.disabled = false;
                    currentDateStart = this.startVacancyDate;
                    currentDateFinish = new Date();
                    break;
            }

            this.startVacancyDate =  +new Date(currentDateStart);
            this.endDate =  +new Date(currentDateFinish);

            $(".startDate").datetimepicker("setDate", new Date(currentDateStart));
            $(".endDate").datetimepicker("setDate", new Date(currentDateFinish));

            if(isUpdate){
                updateListVacansies.apply(this, [this.startVacancyDate,  this.endDate])
                    .then(setListVacancies.bind(this))
                    .then(() => checkOnChange.call(this));
            }else{
                checkOnChange.call(this)
            }

        };

        function _moveCircleForVacancies() {
            if(this.fieldsVacancyList.filter(i=>i.visible).length){
                this.chooseListFieldsVacancies = true;
            }else{
                this.chooseListFieldsVacancies = false
            }
        };

        singleton.hiddenBlocks = _hiddenBlocks;
        singleton.showBlocks = _showBlocks;
        singleton.moveCircleForVacancies = _moveCircleForVacancies;

        return singleton;
    }catch(error){
        console.log(error, 'error CustomReportEditService');
    }
}
angular
    .module('services.CustomReportEditService',['ngResource', 'ngCookies','services.person'])
    .factory('CustomReportEditService',["$rootScope","Stat", "$translate","Company","Person","vacancyStages", "notificationService", "CustomReportsService","$timeout","$uibModal","translateWords","$location","CustomField","$filter","Vacancy", CustomReportEditService]);