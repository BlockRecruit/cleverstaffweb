angular.module('services.notice', [
        'ngResource'
    ]
).factory('Notice', ['$resource', 'serverAddress', function($resource, serverAddress) {
    var service = $resource(serverAddress + '/notice/:param', {param: "@param"},
        {
            all: {
                method: 'POST',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "get"
                }
            },
            notice: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    service: "notice",
                    action: "get"
                }
            },
            readNotice: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    service: "notice",
                    action: "read"
                }
            },
            readAll: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                   param: "readAll"
                }
            },
            getMy: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "getMy"
                }
            }
        });
    var forUpdateNoticesView = [];

    service.registerNoticeView = function(val, name) {
        forUpdateNoticesView.push({name: name, funct: val});
    };
    service.updateNoticesView = function(noticeId, nameNoticeView) {
        angular.forEach(forUpdateNoticesView, function(val) {
            if (val.name != nameNoticeView) {
                val.funct(noticeId);
            }
        })
    };
    return service;
}]);