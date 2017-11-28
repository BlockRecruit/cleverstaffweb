controller.controller('CandidateXRayLinkController', ["$localStorage", "$translate", "Service", "$scope", "ngTableParams", "Candidate", "$location", "$rootScope", "$filter", "$cookies", "serverAddress",
    function ($localStorage, $translate, Service, $scope, ngTableParams, Candidate, $location, $rootScope, $filter, $cookies, serverAddress) {

        $scope.regions = Service.getCountryLinkedIn();

        var arr = [];
        angular.forEach($scope.regions, function (val) {
            arr.push({id: val.key, text: val.value})
        });
        $(".search-region").select2({
            data: arr,
            minimumInputLength: 1,
            selectOnBlur: true,
            formatInputTooShort: function () {
                return "";
            }
        }).on("select2-close", function (e) {
            if ($(this).select2('data')) {
                $scope.filterLink.region = $(this).select2('data').id;
            } else {
                $scope.filterLink.region = 'all';
            }
        });

        $scope.filterLink = {
            job_title: '',
            keywords_include: '',
            keywords_exclude: '',
            region: 'all'
        };

        $scope.lang = $translate;

        $scope.clickExtShow = function () {
            console.log($scope.filterLink);
            $scope.showInGoogle();
        };

        $scope.showInGoogle = function () {
            var url = 'https://www.google.com.ua/search?q=-intitle:"profiles"+-inurl:"dir/+"';
            if ($scope.filterLink.region === 'all') {
                url += '+site:linkedin.com/in/+OR+site:linkedin.com/pub/';
            } else {
                url += '+site:' + $scope.filterLink.region + '.linkedin.com/in/+OR+site:' + $scope.filterLink.region + '.linkedin.com/pub/';
            }
            if ($scope.filterLink.job_title) {
                url += '+"'+encodeURIComponent($scope.filterLink.job_title)+'"';
            }
            if ($scope.filterLink.keywords_include) {
                angular.forEach($scope.filterLink.keywords_include.split(','), function(val, ind) {
                    url += '+"'+encodeURIComponent($.trim(val))+'"';
                });
            }
            if ($scope.filterLink.keywords_exclude) {
                angular.forEach($scope.filterLink.keywords_exclude.split(','), function(val, ind) {
                    url += '-"'+encodeURIComponent($.trim(val))+'"';
                });
            }
            window.open(url, '_blank');
        };

    }]);
