angular.module('services.news', [
    'ngResource',
    'ngCookies'
]).factory('News', ['$resource', 'serverAddress', '$filter', '$localStorage', 'notificationService',
    function ($resource, serverAddress, $filter, $localStorage, notificationService) {

        var News = $resource(serverAddress + '/news/:param', {param: "@param"},
            {
                getNews: {
                    method: "GET",
                    params: {
                        param: "getNews"
                    }
                },
                setNewsAsViewed: {
                    method: "POST",
                    params: {
                        param: "setNewsAsViewed"
                    }
                }

            });
        return News;
    }]);