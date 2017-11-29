function EmployeeAddControllerFunc($rootScope, $http, $scope, $translate, FileInit, $location, Service, Candidate, notificationService, $filter,
                                   $localStorage, $cookies, $window, serverAddress, Employee, $uibModal) {
    //Service.toAddCandidate("/candidates/");
    $location.hash('');
    $scope.candidate = {};
    $scope.pageObject = {
        employee: {
            candidateId: {
                status: "employed",
                readyRelocate: false,
                employmentType: null,
                contacts: []
            }
        },
        contacts: {
            skype: null,
            mphone: null,
            email: null,
            linkedin: null,
            facebook: null,
            googleplus: null,
            homepage: null
        },
        variables: {
            positionList: [],
            positionListAfterSearch: [],
            currency: Service.currency(),
            industries: Service.getIndustries(),
            experience: Service.experience(),
            lang: Service.lang(),
            saveButtonIsPressed: false,
            fileForSave: []
        }, errorMessage: {
            show: false,
            message: ""
        }
    };
    $scope.addLinkToCandidate = {
        name: '',
        url: ''
    };
    $scope.linksForSave = [];

    $scope.searchPosition = function searchPosition(term) {
        $scope.pageObject.positionListAfterSearch = $filter('filter')($scope.pageObject.positionList, term.toLowerCase());
    };

    Employee.getPositionList(function(resp) {
        $scope.pageObject.positionList = resp.objects;
        $scope.pageObject.positionListAfterSearch = resp.objects;
    });


    $scope.callbackAddPhoto = function(photo) {
        $rootScope.loading = false;
        $scope.pageObject.employee.candidateId.photo = photo;
        $scope.photoLink = $scope.serverAddress + "/getapp?id=" + photo + "&d=true";
        $rootScope.photoUrl = "";
        $rootScope.closeModal();
    };

    $scope.addPhotoByReference = function (photoUrl) {
        $rootScope.loading = true;
        FileInit.addPhotoByReference(photoUrl, $scope.callbackAddPhoto);
    };
    FileInit.initCandFileOption($scope, "", "", false);

    $scope.progressUpdate = function() {
        //Candidate.progressUpdate($scope, true);
    };

    $scope.updateErrorForPosition = function() {
        if ($scope.pageObject.employee.position != undefined &&
            $scope.pageObject.employee.position.length > 0) {
            $scope.candidateForm.position.$pristine = true;
            $scope.candidateForm.position.$invalid = false;
        } else {
            $scope.candidateForm.position.$pristine = false;
            $scope.candidateForm.position.$invalid = true;
        }
    };
    function initEmploymentType(employmentTArr) {
        $('.select2-employmentType').select2({
            tags: employmentTArr,
            tokenSeparators: [",", " "],
            initSelection: function(element, callback) {
                var data = {id: element.val(), text: element.val()};
                callback(data);
            }
        });
    }
    initEmploymentType(Service.employmentTypeTwo());
    $scope.serverAddress = serverAddress;
    $scope.googleMapOption = false;
    $scope.regionToRelocate = [];
    $scope.duplicatesByEmail = [];
    $scope.duplicatesByPhone = [];

    $scope.deleteRegion2ToRelocate = function(index) {
        $scope.regionToRelocate.splice(index, 1);
    };
    /** @namespace google.maps.MapTypeId.ROADMAP */
    $scope.map = {
        center: {
            latitude: 48.379433,
            longitude: 31.165579999999977
        },
        zoom: 6,
        options: {
            panControl: true,
            zoomControl: true,
            scaleControl: true,
            mapTypeControl: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
    };
    $scope.marker = {
        id: 1,
        title: "",
        coords: {
            latitude: null,
            longitude: null
        }
    };

    $scope.callbackFile = function(resp, names) {
        $scope.pageObject.variables.fileForSave.push({"attId": resp, "fileName": names});
        $scope.progressUpdate();
    };

    $scope.removeFile = function(id) {
        angular.forEach($scope.pageObject.variables.fileForSave, function(val, ind) {
            if (val.attId === id) {
                $scope.pageObject.variables.fileForSave.splice(ind, 1);
            }
        });
        $scope.progressUpdate();
    };
    $scope.removeLink = function(id) {
        angular.forEach($scope.linksForSave, function(val, ind) {
            if (val.fileName === id) {
                $scope.linksForSave.splice(ind, 1);
            }
        });
        $scope.progressUpdate();
    };

    $scope.status = Candidate.getStatus();
    $scope.employmentType = Service.employmentType();
    Service.regions(function(resp) {
        $scope.regions = resp.objects;
    });
    $scope.cancel = function() {
        $location.path("/candidates/");
    };


    $scope.addPhoto = function() {
        $('#photoFile').click();
    };

    $scope.callbackErr = function(err) {
        notificationService.error(err);
    };
    Candidate.setPhoto($scope);

    $scope.removePhoto = function() {
        $scope.pageObject.employee.candidateId.photo = "";
        $scope.photoLink = undefined;
        $scope.progressUpdate();
    };
    $scope.saveCandidate = function() {
        $scope.errorId = false;
        $scope.dateChange($scope.candidateForm.workingDate.$modelValue);
        if ($scope.candidateForm.name.$valid && $scope.candidateForm.position.$valid && $scope.candidateForm.workingDate.$valid && !$scope.errorDateStartWorking) {
            getFieldWithJQuery($scope.pageObject.employee.candidateId, $scope.region);
            //$scope.pageObject.employee.employeeDepartment.name = $scope.pageObject.employee.employeeDepartment.name.replace(/-/g, '');
            $scope.pageObject.employee.candidateId.position = $scope.pageObject.employee.position;
            $scope.pageObject.employee.candidateId.salary = $scope.pageObject.employee.salary;
            $scope.pageObject.employee.candidateId.relatedRegions = $scope.regionToRelocate;
            $scope.pageObject.employee.candidateId.currency = $scope.pageObject.employee.currency;
            addContactsInCandidateObject($scope);
            Employee.addEmployeeWithCandidate($scope.pageObject.employee, function(resp) {
                if (angular.equals(resp.status, "ok")) {
                    $scope.pageObject.variables.saveButtonIsPressed = false;
                    notificationService.success($filter('translate')('Candidate saved'));
                    if ($scope.pageObject.variables.fileForSave.length > 0) {
                        angular.forEach($scope.pageObject.variables.fileForSave, function(valI, i) {
                            Candidate.addFile({
                                "attId": valI.attId,
                                "candidateId": resp.object.candidateId.candidateId,
                                "fileName": valI.fileName
                            }, function(resp) {

                            });
                            if ($scope.pageObject.variables.fileForSave.length - 1 == i) {
                                $location.path("/company/employees/" + resp.object.employeeId);
                            }
                        });
                    } else {
                        $location.path("/company/employees/" + resp.object.employeeId);
                    }
                    if ($scope.linksForSave.length > 0) {
                        angular.forEach($scope.linksForSave, function(valI, i) {
                            Candidate.addLink({
                                "url": valI.url,
                                "candidateId": resp.object.candidateId.candidateId,
                                "name": valI.fileName
                            }, function(resp) {
                            });
                            if ($scope.linksForSave.length - 1 == i) {
                                $location.path("/company/employees/" + resp.object.employeeId);
                            }
                        });
                    } else {
                        $location.path("/company/employees/" + resp.object.employeeId);
                    }
                } else {
                    $scope.pageObject.variables.saveButtonIsPressed = false;
                    $scope.pageObject.errorMessage.show = true;
                    $scope.pageObject.errorMessage.message = resp.message;
                    if(resp.code == 'existsEmployeeId'){
                        $scope.errorId = true;
                    }
                }
            }, function() {
                $scope.pageObject.variables.saveButtonIsPressed = false;
                //notificationService.error($filter('translate')('service temporarily unvailable'));
                $cookies.url = $location.$$url;
                $cookies.cfauth = 'false';
                $window.location.replace('/');
            });
        } else {

            $scope.dateChange($scope.candidateForm.workingDate.$modelValue);
            $scope.candidateForm.name.$pristine = false;
            $scope.candidateForm.salary.$pristine = false;
            //$scope.candidateForm.department.$pristine = false;
            $scope.updateErrorForPosition();
        }
    };
    $scope.checkDuplicatesByEmail = function() {
        Candidate.checkDuplicatesByEmail($scope);
    };
    $scope.checkDuplicatesByPhone = function() {
        Candidate.checkDuplicatesByPhone($scope);
    };


    //JQuery function init===========================================================================================
    $('.ui.dropdown').dropdown();
    $('.select2-lang-employee')
        .select2({
            tags: $scope.pageObject.variables.lang,
            tokenSeparators: [",", " "]
        }
    )
        .on("change", function(e) {
            $scope.progressUpdate();
        });
    $('#pac-input').blur(function() {
        if (!$(this).val()) {
            $scope.progressUpdate();
        }
    });

    $(".datepickerOfBirth").datetimepicker({
        format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy" : "mm/dd/yyyy",
        startView: 4,
        minView: 2,
        autoclose: true,
        language: $translate.use(),
        weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
        initialDate: new Date(315550800000)
    }).on('hide', function(val) {
        if (val.date != undefined) {
            $scope.pageObject.employee.candidateId.db = val.date.getTime();

        }
        $('.datepickerOfBirth').blur();
        $scope.progressUpdate();
    });

    $(".datepickerOfStartWorking").datetimepicker({
        format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy" : "mm/dd/yyyy",
        startView: 4,
        minView: 2,
        autoclose: true,
        weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
        language: $translate.use(),
        initialDate: new Date(315550800000)
    }).on('hide', function(val) {
        if (val.date != undefined) {
            $scope.pageObject.employee.dateEmployee = val.date.getTime();
            $scope.startWorkingDate = $(".datepickerOfStartWorking").val();

        }
        $('.datepickerOfStartWorking').blur();
    });
    $(".datepickerOfStartDepartment").datetimepicker({
        format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy" : "mm/dd/yyyy",
        startView: 4,
        minView: 2,
        autoclose: true,
        language: $translate.use(),
        weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
    }).on('hide', function(val) {
        if (val.date != undefined) {
            $scope.pageObject.employee.dateDepartment = val.date.getTime();

        }
        $('.datepickerOfStartDepartment').blur();
    });
    $(".datepickerOfStartPosition").datetimepicker({
        format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy" : "mm/dd/yyyy",
        startView: 4,
        minView: 2,
        autoclose: true,
        language: $translate.use(),
        weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
    }).on('hide', function(val) {
        if (val.date != undefined) {
            $scope.pageObject.employee.datePosition = val.date.getTime();

        }
        $('.datepickerOfStartPosition').blur();
    });
    $(".datepickerOfStartSalary").datetimepicker({
        format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy" : "mm/dd/yyyy",
        startView: 4,
        minView: 2,
        autoclose: true,
        language: $translate.use(),
        weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
    }).on('hide', function(val) {
        if (val.date != undefined) {
            $scope.pageObject.employee.dateSalary = val.date.getTime();

        }
        $('.datepickerOfStartSalary').blur();
    });

    $scope.dateChange = function checkFormDate(val)
    {
        // regular expression to match required date format
        re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

        if(val){
            if(val != '' && !val.match(re)) {
                $scope.errorDateStartWorking = true;
                return false;
            }
        } else{
            $scope.errorDateStartWorking = true;
            return false;
        }
        $scope.errorDateStartWorking = false;
        return true;
    };

    Employee.getDepartmentsList(function (resp) {
        $scope.departmentsList = resp.objects;
        angular.forEach($scope.departmentsList, function(val) {
            if(val.deep == 1){
                val.name = "-- "  + val.name;
            }
            if(val.deep == 2){
                val.name = "---- "  + val.name;
            }
            if(val.deep == 3){
                val.name = "------ "  + val.name;
            }
            if(val.deep == 4){
                val.name = "-------- "  + val.name;
            }
            if(val.deep == 5){
                val.name = "---------- "  + val.name;
            }
            if(val.deep == 6){
                val.name = "------------ "  + val.name;
            }
            if(val.deep == 7){
                val.name = "-------------- "  + val.name;
            }
            if(val.deep == 8){
                val.name = "---------------- "  + val.name;
            }
        });
    });
    $scope.showAddLinkFunc = function(){
        $scope.showAddLink = true;
    };
    $scope.closeAddLinkFunc = function(){
        $scope.showAddLink = false;
        $scope.addLinkToCandidate.name = null;
        $scope.addLinkToCandidate.url = null;
        $scope.addLinkErrorShow = false;
    };
    $scope.addLinkInCandidateStart = function(){
        if($scope.addLinkToCandidate.name && $scope.addLinkToCandidate.url){
            $scope.linksForSave.push({"url": $scope.addLinkToCandidate.url, "fileName": $scope.addLinkToCandidate.name});
            $scope.showAddLink = false;
        } else{
            $scope.addLinkErrorShow = true;
        }
    };
    $scope.showModalAddPhoto = function(){
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '../partials/modal/add-photo-candidate.html',
            size: '',
            resolve: function(){

            }
        });
    };
    $rootScope.closeModal = function(){
        $scope.modalInstance.close();
    };
}


controller.controller('EmployeeAddController', [
    "$rootScope",
    "$http",
    "$scope",
    "$translate",
    "FileInit",
    "$location",
    "Service",
    "Candidate",
    "notificationService",
    "$filter", "$localStorage",
    "$cookies",
    "$window",
    "serverAddress", "Employee", "$uibModal", EmployeeAddControllerFunc]);




function getFieldWithJQuery(candidateObject, region2) {
    var lang = $('.select2-lang-employee').select2('val');
    var emplType = $('.select2-employmentType').select2('val');
    var db = $('.datepickerOfBirth').datetimepicker('getDate');
    candidateObject.languages = lang && lang.length > 0 ? lang.toString() : null;
    candidateObject.employmentType = emplType && emplType.length > 0 ? emplType.toString() : null;
    var regionInput = $("#pac-input").val();
    if (regionInput.length == 0) {
        candidateObject.region = null;
    } else if (regionInput.length > 0) {
        candidateObject.region = region2;
    }
    candidateObject.db = db != null ? db.getTime() : null;
}











