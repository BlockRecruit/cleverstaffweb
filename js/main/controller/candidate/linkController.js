controller.controller('CandidateLINKController',["$localStorage", "$translate", "Service", "$scope", "ngTableParams", "Candidate", "$location", "$rootScope", "$filter", "$cookies", "serverAddress",
    function($localStorage, $translate, Service, $scope, ngTableParams, Candidate, $location, $rootScope, $filter, $cookies, serverAddress) {
    $scope.searchExternalObject = {
        candidateExternalFound: false
    };
    $scope.resultLINK = [];
    $scope.found_link = false;
    $scope.count = false;
    $scope.extensionHas = false;
    $scope.lang = $translate;
    $scope.serverAddress = serverAddress;
    $scope.candidateFound = null;
    $scope.regionId = null;
    $scope.regionSelect = null;
    Service.getRegions2(function(resp) {
        $scope.regions = resp;
    });
    $scope.filterLink = {
        searchPosition: '',
        company: '',
        regionSelect: null,
        page: 1
    };

    $scope.lang = $translate;


    $scope.loader = false;
    $scope.isSearched = false;
    $scope.selectRegion = function(val) {
        if ($scope.regionId != null) {
            var json = JSON.parse($scope.regionId);
            if (val.value == json.value) {
                $scope.regionSelect = json;
                return true;
            } else {
                return false;
            }
        }
    };

    $scope.sendFilterToPlugin = function(eventName) {
        delete $scope.filterLink['regionSelect'];
        if ($scope.regionSelect) {
            if ($scope.regionSelect.type == 'country') {
                angular.forEach(Service.getCountryLinkedIn(), function(val, ind) {
                    if (val.value == $scope.regionSelect.value) {
                        $scope.filterLink.regionSelect = val.key;
                    }
                });
            } else {
                var indSelect = -1;
                angular.forEach($scope.regions, function(val, ind) {
                    if (val.value == $scope.regionSelect.value) {
                        indSelect = ind;
                    }
                });
                if (indSelect > 0) {
                    for (var i = indSelect; i > -1; i--) {
                        if ($scope.regions[i].type == 'country') {
                            angular.forEach(Service.getCountryLinkedIn(), function(val, ind) {
                                if (val.value == $scope.regions[i].value) {
                                    $scope.filterLink.regionSelect = val.key;
                                }
                            });
                            break;
                        }
                    }
                }
            }
        }
        document.dispatchEvent(new CustomEvent(eventName, {'detail': $scope.filterLink}));
    };
    $scope.clickSearch = function() {
        $scope.filterLink.page = 1;
        $scope.resultLINK = [];
        $scope.sendFilterToPlugin('searchLinkedIn');
    };
    $scope.clickExtShow = function() {
        $scope.sendFilterToPlugin('showLinkedIn');
    };
    $scope.data = {};
    if ($rootScope.eventListenerSearch) {
        document.removeEventListener('resultLinkedIn', $rootScope.eventListenerSearch);
    }
    $rootScope.eventListenerSearch = function(event) {
        $scope.data = event.detail;
        $scope.count = $scope.data.content.page.voltron_unified_search_json.search.baseData.resultCount;
        angular.forEach($scope.data.content.page.voltron_unified_search_json.search.results, function(val) {
            if (val.person) {
                $scope.resultLINK.push(val);
            }
        });
        $scope.tableParamsExteranl.reload();
    };
    document.addEventListener('resultLinkedIn', $rootScope.eventListenerSearch);
    if ($rootScope.eventListenerPing) {
        document.removeEventListener('cleverstaffExtensionPong', $rootScope.eventListenerPing);
    }
    $rootScope.eventListenerPing = function(event) {
        console.log('extension has');
        $scope.extensionHas = true;
    };
    document.addEventListener('cleverstaffExtensionPong', $rootScope.eventListenerPing);
    document.dispatchEvent(new CustomEvent('cleverstaffExtensionPing'));

    $scope.nextListLinkedIn = function() {
        $scope.filterLink.page++;
        $scope.sendFilterToPlugin();
    };

    $scope.tableParamsExteranl = new ngTableParams({
        page: 1,
        count: 10
    }, {
        total: 10000,
        getData: function($defer, params) {
            if ($scope.resultLINK && $scope.resultLINK.length > 0) {
                $scope.found_link = true;
            } else {
                $scope.found_link = false;
            }
            $defer.resolve($filter('orderBy')(angular.copy($scope.resultLINK), params.orderBy()));
        }
    });

    $scope.toAddFromLink = function(user) {
        var replace1 = 'https://www.linkedin.com/profile/view?id=';
        var replace2 = 'http://www.linkedin.com/profile/view?id=';
        var linkid = user.person.link_nprofile_view_3.replace(replace1, '').replace(replace2, '').split('&')[0];
        console.log('linkid ' + linkid);
        $scope.selectedCandidateLink = user.person;
        $scope.selectedCandidateLink.linkid = linkid;
        document.dispatchEvent(new CustomEvent('getContactsFromLinkedIn', {'detail': {id: linkid}}));
    };
    $scope.linkAdd = function(contact_detail) {
        var candidate = {
            fullName: $scope.selectedCandidateLink.fmt_name,
            contacts: [],
            photoUrl: $scope.selectedCandidateLink.logo_result_base.media_picture_link.replace('shrink_60_60', 'shrink_200_200'),
            position: String($scope.selectedCandidateLink.fmt_headline).replace(/<[^>]+>/gm, ''),
            city: $scope.selectedCandidateLink.fmt_location
        };
        candidate.contacts.push({
            type: "homepage",
            value: 'https://www.linkedin.com/profile/view?id=' + $scope.selectedCandidateLink.linkid
        });
        if (contact_detail.status == 'success') {

        }
        $localStorage.set("candidateForSave", candidate);
        console.log(candidate);
        $rootScope.$apply(function() {
            $location.path("candidate/add/")
        });
    };
    if ($rootScope.eventListenerGetContact) {
        document.removeEventListener('contactFromLinkedIn', $rootScope.eventListenerGetContact);
    }
    $rootScope.eventListenerGetContact = function(event) {
        console.log(event.detail);
        $scope.linkAdd(event.detail);
    };
    document.addEventListener('contactFromLinkedIn', $rootScope.eventListenerGetContact);
}]);
