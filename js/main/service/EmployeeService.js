angular.module('services.employee', [
    'ngResource'
]).factory('Employee', ['$resource', 'serverAddress', function($resource, serverAddress) {
    return $resource(serverAddress + '/employee/:param', {param: "@param"},
        {
            all: {
                method: 'POST',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "get"
                }
            },
            one: {
                method: 'GET',
                params: {
                    param: "get"
                }
            },
            getEmployeeHistory: {
                method: 'GET',
                params: {
                    param: "getEmployeeHistory"
                }
            },
            getPositionList: {
                method: 'GET',
                params: {
                    param: "getPositionList"
                }
            },
            "addEmployeeForCandidate": {
                method: "PUT",
                params: {
                    param: "addEmployeeForCandidate"
                }
            },
            "editEmployee": {
                method: "POST",
                params: {
                    param: "editEmployee"
                }
            },
            "addEmployeeWithCandidate": {
                method: "PUT",
                params: {
                    param: "addEmployeeWithCandidate"
                }
            },
            "changeState": {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "changeState"
                }
            },
            "changeSalary": {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "changeSalary"
                }
            },
            "changeDepartment": {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "changeDepartment"
                }
            },
            "changePosition": {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "changePosition"
                }
            },
            "setEmployeeFunctionsEnabled": {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "setEmployeeFunctionsEnabled"
                }
            },
            setComment: {
                method: 'POST',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "setComment"
                }
            },
            editComment: {
                method: 'POST',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "editComment"
                }
            },
            removeComment: {
                method: 'GET',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "removeComment"
                }
            },
            getPositionList: {
                method: 'GET',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "getPositionList"
                }
            },
            //getDepartmentsList: {
            //    method: 'GET',
            //    headers: {'Content-type': 'application/json; charset=UTF-8'},
            //    params: {
            //        param: "getDepartmentsList"
            //    }
            //},
            getDepartmentsList: {
                method: 'GET',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "department/list"
                }
            },
            departmentAdd: {
                method: 'POST',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "department/add"
                }
            },
            departmentDelete: {
                method: 'GET',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "department/delete"
                }
            },
            departmentEdit: {
                method: 'POST',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "department/edit"
                }
            }

        });
}]);