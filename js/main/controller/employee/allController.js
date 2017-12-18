function EmployeeAddController($scope, $timeout, $anchorScroll, Employee, $filter, ngTableParams, $location, Company, Service, $rootScope) {
    $scope.searchButtonClicked = false;
    $scope.employeesFound = null;
    $scope.a = {};
    $scope.a.searchNumber = 1;
    $scope.employeesObj = {
        dataIsLoad: true,
        allDataSize: 0,
        showMassage: null,
        messageCode: 0
    };
    $scope.searchParam = {
        isClicked: true,
        state: null,
        position: null,
        department: null,
        name: null,
        page: {number: 0, count: 15}
    };
    $scope.searchStatus = [
        {name: "employed", value: "work"},
        {name: "dismiss", value: "dismiss"},
    ];


    $scope.toAddEmployee = function() {
        $location.path('/company/employee/add');
    };

    $scope.clickSearch = function() {
        $scope.searchButtonClicked = true;
        if ($scope.searchParam.state != null ||
            $scope.searchParam.position != null ||
            $scope.searchParam.departmentId != null ||
            $scope.searchParam.name != null) {
            $scope.employeesObj.dataIsLoad = true;
            if($scope.searchParam.departmentId){
                $scope.searchParam.departmentId = $scope.searchParam.departmentId.replace(/-/g, '');
            }
            $scope.tableParams.reload();
        }
    };
    Employee.getPositionList(function (resp) {
        $scope.positionList = resp.objects;
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

    let pageNumber = 0;
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: $scope.searchParam.page.count
    }, {
        total: 0,
        getData: function($defer, params) {
            $scope.employeesObj.showMassage = false;
            if($scope.searchParam.state == 'null'){
                $scope.searchParam.state = null;
            }
            if($scope.searchParam.position == 'null'){
                $scope.searchParam.position = null;
            }
            if($scope.searchParam.departmentId == 'null'){
                $scope.searchParam.departmentId = null;
            }
            $scope.searchParam.page.number = (params.$params.page - 1);
            $scope.searchParam.page.count = params.$params.count;

            function getEmployees(page,count) {
                if(page || count) {
                    $scope.searchParam.page = {number: page, count: count};
                    pageNumber = page;
                } else {
                    $scope.isShowMore = false;
                    pageNumber = $scope.searchParam.page.number;
                    if(document.getElementById('scrollup'))
                        document.getElementById('scrollup').style.display = 'none';
                    $timeout(function() {
                        $anchorScroll('mainTable');
                    });
                }
                Employee.all($scope.searchParam, function(response) {
                    if (response.status == 'error') {
                        $rootScope.loading = false;
                        if (response.code = 'notEnabledEmployeeFunction') {
                            $scope.employeesObj.messageCode = 1;
                            $location.path('/organizer');
                        }
                    }else{
                        $rootScope.loading = false;
                        $rootScope.objectSize = response['objects'] != undefined ? response['total'] : undefined;
                        params.total(response['total']);
                        if(page) {
                            $scope.employees = $scope.employees.concat(response['objects'])
                        } else {
                            $scope.employees = response['objects'];
                        }
                        var data = $filter('orderBy')(response['objects'], params.orderBy());
                        if (!data && !$scope.searchButtonClicked) {
                            data = [];
                            $scope.employeesObj.messageCode = 2;
                        } else if (!data && $scope.searchButtonClicked) {
                            data = [];
                            $scope.employeesObj.messageCode = 3;
                        }
                        $scope.paginationParams = {
                            currentPage: $scope.searchParam.page.number,
                            totalCount: $rootScope.objectSize
                        };
                        let pagesCount = Math.ceil(response['total']/$scope.searchParam.page.count);
                        if(pagesCount == $scope.searchParam.page.number + 1) {
                            $('#show_more').hide();
                        } else {
                            $('#show_more').show();
                        }
                        $defer.resolve(data);
                        $scope.employeesObj.allDataSize = response['total'];
                        if($scope.searchParam.state == null){
                            $scope.searchParam.state = 'null';
                        }
                        if($scope.searchParam.position == null){
                            $scope.searchParam.position = 'null';
                        }
                        if($scope.searchParam.departmentId == null){
                            $scope.searchParam.departmentId = 'null';
                        }
                    }
                    $scope.employeesObj.dataIsLoad = false;
                    $scope.employeesFound = response['total'] >= 1;
                    $scope.searchParam.page.count = params.$params.count;
                    $scope.a.searchNumber = $scope.tableParams.page();
                });
            }
            getEmployees();
            $scope.showMore = function () {
                $scope.isShowMore = true;
                Service.dynamicTableLoading(params.total(), pageNumber, params.$params.count, getEmployees)
            };
            $rootScope.searchParamInClients = $scope.searchParam;
            $scope.a.searchNumber = $scope.tableParams.page();
            $rootScope.previousSearchNumber = $scope.a.searchNumber;
            $scope.searchParam.isClicked = false;

        }
    });
    $scope.changeInputPage = function(params,searchNumber){
        var searchNumber = Math.round(searchNumber);
        var maxValue = $filter('roundUp')(params.settings().total/params.count());
        if(searchNumber){
            if(searchNumber >= 1 && searchNumber <= maxValue){
                params.page(searchNumber);
                $scope.a.searchNumber = searchNumber;
            }
        }
    };
    $scope.callbackAddLogo = function (photo) {
        console.log(photo);
        $rootScope.companyLogo = photo;
        $rootScope.logoLink = $scope.serverAddress + "/getapp?id=" + $rootScope.companyLogo + "&d=true";
    };
    $scope.callbackErr = function (err) {
        notificationService.error(err);
    };
    $scope.showAdvancedSearchFunc = function() {
        $scope.showAdvancedSearch = !$scope.showAdvancedSearch;
    };
    $scope.showAdvancedSearchFuncHide = function(){
        $scope.showAdvancedSearch = !$scope.showAdvancedSearch;
    };
    $scope.getFirstLetters = function(str){
        return firstLetters(str)
    };
    $(document).click(function (){
        if($(".advancedSearch").css('display') != 'none'){
            $scope.showAdvancedSearchFuncHide();
            $scope.$apply();
        }
    });

}
controller.controller('EmployeesController', ['$scope', '$timeout', '$anchorScroll', 'Employee', '$filter', 'ngTableParams', '$location', 'Company', 'Service', '$rootScope', EmployeeAddController]);