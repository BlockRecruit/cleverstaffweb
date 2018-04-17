controller.controller('DepartmentCatalogController', ["$scope", "$rootScope", "$routeParams", "Service", "Person",
    "Company", "notificationService", "$filter", "$translate","Vacancy","Employee", "$filter",
    function($scope, $rootScope, $routeParams, Service, Person, Company, notificationService, $translate,
             $filter, Vacancy, Employee, $filter) {
        $scope.showCreateDepartment = false;
        $scope.showEditDepartment = false;

        $scope.departmentOnEdit = {
            name: null,
            parentEmployeeDepartmentId : null,
            editedDepartmentId : null
        };

        $scope.refreshDepartmentList = function(){
            Employee.getDepartmentsList(function (resp) {
                if(resp.status == 'ok'){
                    $scope.departmentsList = resp.objects;
                }else{
                    $location.path('/organizer');
                }
                //angular.forEach($scope.departmentsList, function(val) {
                //    if(val.deep == 1){
                //        val.name = "-- "  + val.name;
                //    };
                //    if(val.deep == 2){
                //        val.name = "---- "  + val.name;
                //    };
                //    if(val.deep == 3){
                //        val.name = "------ "  + val.name;
                //    };
                //});
            });
        };
        $scope.saveDepartmentByKey = function(e) {
          if(e.keyCode === 13) {
              $scope.saveDepartment();
          }
        };
        $scope.refreshDepartmentList();
        $scope.saveDepartment = function(){
            console.log($scope.departmentOnEdit);
                Employee.departmentAdd({
                    "name" : $scope.newName,
                    "parentEmployeeDepartmentId" : $scope.departmentOnEdit ? $scope.departmentOnEdit.employeeDepartmentId : null
                },function(resp){
                    if(resp.status == "ok"){
                        $scope.departmentOnEdit = null;
                        $scope.refreshDepartmentList();
                        notificationService.success($filter('translate')('Department successfully created'));
                    }
                });
        };
        $scope.deleteDepartment = function(department){
            Employee.departmentDelete({"id" : department.employeeDepartmentId},function (resp){
                if(resp.status == "ok"){
                    $scope.refreshDepartmentList();
                }
                else{
                    notificationService.error(resp.message);
                }
            });
        };
        $scope.pasteEditDepartment = function(depart){
            if($scope.showCreateDepartment == true){
                $scope.showCreateDepartment = false;
            }
            $scope.showEditDepartment = true;
            $scope.newName = depart.name;
            console.log(depart);
            $scope.editedDepartmentId = depart.employeeDepartmentId;
            if(depart.parentName){
                console.log($scope.departmentOnEdit);
                $scope.departmentOnEdit.employeeDepartmentId = depart.parentEmployeeDepartmentId;
                $scope.parentId = depart.parentEmployeeDepartmentId;
                //$scope.departmentOnEdit.name = depart.parentName;
                console.log($scope.departmentOnEdit);
            }

        };
        $scope.editDepartment = function(){
                Employee.departmentEdit({
                    "employeeDepartmentId" : $scope.editedDepartmentId,
                    "name" : $scope.newName,
                    "parentEmployeeDepartmentId" : $scope.departmentOnEdit?$scope.departmentOnEdit.employeeDepartmentId:null
                },function(resp){
                    if(resp.status == "ok"){
                        console.log($scope.departmentOnEdit);
                        $scope.refreshDepartmentList();
                        $scope.showEditDepartment = false;
                        if($scope.departmentOnEdit){
                            $scope.departmentOnEdit.employeeDepartmentId = null;
                        }
                        $scope.newName =null;
                    }
                    else{
                        notificationService.error(resp.message);
                    }
                });
        };

}]);
