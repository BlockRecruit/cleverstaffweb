controller.controller('PublicCandidateController', ['$scope', 'Service', '$routeParams', '$rootScope', 'serverAddress', function($scope, Service, $routeParams, $rootScope, serverAddress) {
        $scope.pageObject = {
            loading: true,
            showInformation: true
        };
        Service.publicCandidate({id: $routeParams.candidateId}, function(resp) {
            if (resp.status == "ok") {
                $scope.pageObject.loading = false;
                $scope.candidate = resp.object;
                if (resp.object.coreSkills != undefined) {
                    $("#candidateCoreSkills").html(resp.object.coreSkills)
                }

                if (resp.object.education != undefined) {
                    $("#candidateEducation").html(resp.object.education)
                }
                $rootScope.title = resp.object.fullName + " | CleverStaff";
                if (resp.object.region != undefined && resp.object.region.lat != undefined && resp.object.region.lng != undefined) {
                    $scope.map.center.latitude = resp.object.region.lat;
                    $scope.map.center.longitude = resp.object.region.lng;

                    $scope.marker.coords.latitude = resp.object.region.lat;
                    $scope.marker.coords.longitude = resp.object.region.lng;
                }

                Service.getOrgLogoId({orgId : resp.object.orgId}, function(logoResp) {
                    if (logoResp.status === 'ok') {
                        $scope.companyLogo = logoResp.object;
                        if (serverAddress === '/hr') {
                            $scope.logoLink = '/hr/getlogo?id=' + $scope.companyLogo + '';
                        } else {
                            $scope.logoLink = '/hrdemo/getlogo?id=' + $scope.companyLogo + '';
                        }
                    }
                });
            } else {
                $scope.pageObject.showInformation = false;
            }
            console.log($scope.pageObject.showInformation);
        }, function(respError) {
            $scope.pageObject.showInformation = false;
            $scope.pageObject.loading = false;
        });
        $scope.serverAddress = serverAddress;


        $scope.map = {
            center: {
                latitude: 48.379433,
                longitude: 31.165579999999977
            },
            zoom: 5,
            options: {
                panControl: true,
                zoomControl: true,
                scaleControl: true,
                mapTypeControl: true
                //mapTypeId: google.maps.MapTypeId.ROADMAP
            }
        };
        $scope.showHideMap = function() {
            $scope.showRegion2Map = !$scope.showRegion2Map;
        };
        $scope.marker = {
            id: 1,
            title: "",
            coords: {
                latitude: null,
                longitude: null
            }
        };


    }]
);