angular.module('services.testsService', [
    'ngResource'
]).factory('Test', ['$resource', 'serverAddress', "$http", function($resource, serverAddress, $http) {
    var options;

    var test = $resource(serverAddress + '/test/:param', {param: "@param"}
        , {
            saveTest: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "saveTest"
                }
            },
            getTest: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "getTest"
                }
            },
            getTests: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "getTests"
                }
            },
            getAppointments: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "getAppointments"
                }
            },
            getAppointment: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "getAppointment"
                }
            },
            deleteTest: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "deleteTest"
                }
            },
            sendTest: {
                method: "POST",
                params: {
                    param: "sendTest"
                }
            },
            editAnswer: {
                method: "POST",
                params: {
                    param: "editAnswer"
                }
            },
            editAppointment: {
                method: "POST",
                params: {
                    param: "editAppointment"
                }
            },
            startTest: {
                method: "POST",
                params: {
                    param: "startTest"
                }
            },
            endAppointment: {
                method: "POST",
                params: {
                    param: "endAppointment"
                }
            },
            openTest: {
                method: "GET",
                params: {
                    param: "openTest"
                }
            },
            saveAnswer: {
                method: "POST",
                params: {
                    param: "saveAnswer"
                }
            },
            getTestsQuestion: {
                method: "POST",
                params: {
                    param: "getTestsQuestion"
                }
            },
            saveImage: {
                method: "POST",
                params: {
                    param: "saveImage"
                }
            },
            autocompleteTest: {
                method: "POST",
                params: {
                    param: "autocompleteTest"
                }
            }
        });
    test.uploadTestQuestionLogo = function(fileUp){
        var FD  = new FormData();
        var blobBin = atob(fileUp.split(',')[1]);
        var array = [];
        for(var i = 0; i < blobBin.length; i++) {
            array.push(blobBin.charCodeAt(i));
        }
        var file=new Blob([new Uint8Array(array)], {type: 'image/png'});
        FD.append('image', file);
        return $http({
            url: serverAddress + "/test/saveImage",
            method: 'POST',
            data: FD,
            withCredentials: true,
            headers: { 'Content-Type': undefined},
            transformRequest: angular.identity
        });
    };
    return test;
}]);
