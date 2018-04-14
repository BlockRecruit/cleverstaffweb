function EmployeeAddFromCandidateControllerFunc($scope, $stateParams, $location, Candidate, Employee, $filter,notificationService, Service) {
    if (!$stateParams.candidateId) {
        $location.path('/vacancies');
    }
    $scope.pageObject = {
        candidate: null,
        variables: {
            currency: Service.currency()
        },
        employee: {
            candidateId: {
                candidateId: null
            },
            position: ""
        },
        positionList: [],
        positionListAfterSearch: []
    };

    $scope.searchPosition = function searchPosition(term) {
        $scope.pageObject.positionListAfterSearch = $filter('filter')($scope.pageObject.positionList, term.toLowerCase());
    };
    $scope.saveEmployee = function saveEmployee() {
        if ($scope.employeeForm.$valid) {
            Employee.addEmployeeForCandidate($scope.pageObject.employee, function(val) {
                if (val.status == 'ok') {
                    $location.path('/company/employees/' + val.object.employeeId);
                } else {
                    console.log("error at save employee object");
                    notificationService.error(val.message);
                }
            }, function(resp) {
                //notificationService.error($filter('translate')('service temporarily unvailable'));
            });
        } else {
            $scope.employeeForm.position.$pristine = false;
            $scope.employeeForm.department.$pristine = false;
            $scope.employeeForm.salary.$pristine = false;
        }
    };


    Candidate.one({localId: $stateParams.candidateId}, function(resp) {
        if (resp.status == 'ok') {
            $scope.pageObject.candidate = resp.object;
            $scope.pageObject.employee.candidateId.candidateId = resp.object.candidateId;
        } else {
            $location.path('/vacancies');
        }
    }, function(resp) {
        $location.path('/vacancies');
    });

    Employee.getPositionList(function(resp) {
        $scope.pageObject.positionList = resp.objects;
        $scope.pageObject.positionListAfterSearch = resp.objects;
        console.log($scope.pageObject.positionList);
    });

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
    $scope.cancel = function() {
        $location.path("/candidates/");
    };

}
controller.controller('EmployeeAddFromCandidateController', ['$scope', '$stateParams', '$location', 'Candidate', 'Employee', '$filter','notificationService', 'Service', EmployeeAddFromCandidateControllerFunc]);