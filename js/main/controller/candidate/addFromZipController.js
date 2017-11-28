controller.controller('CandidateAddFromZipController', ["Notice", "$localStorage", "$translate", "Service",
    "$scope", "ngTableParams", "Candidate", "$location", "$rootScope", "$filter",
    "$cookies", "serverAddress", "notificationService", "googleService", "$window","$interval",
    function(Notice, $localStorage, $translate, Service, $scope, ngTableParams, Candidate, $location,
             $rootScope, $filter, $cookies, serverAddress, notificationService, googleService, $window,$interval) {

        $scope.regionzip = [];
        Candidate.ZIP($scope, $interval, $rootScope);
        $scope.loading = true;

        $scope.updateZipList = function () {
            console.log(1);
            $scope.loading = true;
            $.ajax({
                url: "/hr/uploads",
                type: "GET",
                data: null,
                dataType: "json",
                success: function(data) {
                    $scope.$apply(function () {
                        $scope.zipUploads = data;
                        $scope.loading = false;
                    });
                }
            });
        };
        $scope.updateZipList();
        //Candidate.one(function(resp) {
        //    if (angular.equals(resp.status, "ok")) {
        //        $scope.regionzip = resp.object.relatedRegions != undefined ? resp.object.relatedRegions : [];
        //    }
        //});
        $scope.deleteRegionzip = function(index) {
            $scope.regionzip.splice(index, 1);
        };

        //$scope.limitStrict = function () {
        //    var fileName = $(".fileName");
        //    if(fileName) fileName.val(fileName.val().substr(0,10));
        //};
        //$scope.limitStrict();

        $scope.openHelpZip1 = function(event) {
            console.log(event);
            var helpZip1 = $("#helpZip1");
            if (helpZip1.css('display') == 'none') {
                $("#agreedQuestion").css({"background-color": "rgba(0, 0, 0, 0.11)"});
                helpZip1.show('slide', {direction: 'left'}, 400);
                $(document).mouseup(function(e) {
                    var noticesElement = $("#agreedQuestionOuter");
                    if ($("#agreedQuestionOuter").has(e.target).length === 0) {
                        helpZip1.hide();
                        $("#agreedQuestion").css({"background-color": "rgba(0, 0, 0, 0)"});
                        $(document).off('mouseup');
                    }
                });
            } else {
                helpZip1.hide();
                $("#agreedQuestion").css({"background-color": "rgba(0, 0, 0, 0)"});
                $(document).off('mouseup')
            }
        };
        $scope.openHelpZip2 = function() {
            var helpZip2 = $("#helpZip2");
            if (helpZip2.css('display') == 'none') {
                $("#agreedQuestion").css({"background-color": "rgba(0, 0, 0, 0.11)"});
                helpZip2.show('slide', {direction: 'left'}, 400);
                $(document).mouseup(function(e) {
                    var noticesElement = $("#agreedQuestionOuter");
                    if ($("#agreedQuestionOuter").has(e.target).length === 0) {
                        helpZip2.hide();
                        $("#agreedQuestion").css({"background-color": "rgba(0, 0, 0, 0)"});
                        $(document).off('mouseup');
                    }
                });
            } else {
                helpZip2.hide();
                $("#agreedQuestion").css({"background-color": "rgba(0, 0, 0, 0)"});
                $(document).off('mouseup')
            }
        };
        $scope.openHelpZip3 = function() {
            var helpZip3 = $("#helpZip3");
            if (helpZip3.css('display') == 'none') {
                $("#agreedQuestion").css({"background-color": "rgba(0, 0, 0, 0.11)"});
                helpZip3.show('slide', {direction: 'left'}, 400);
                $(document).mouseup(function(e) {
                    var noticesElement = $("#agreedQuestionOuter");
                    if ($("#agreedQuestionOuter").has(e.target).length === 0) {
                        helpZip3.hide();
                        $("#agreedQuestion").css({"background-color": "rgba(0, 0, 0, 0)"});
                        $(document).off('mouseup');
                    }
                });
            } else {
                helpZip3.hide();
                $("#agreedQuestion").css({"background-color": "rgba(0, 0, 0, 0)"});
                $(document).off('mouseup')
            }
        };
        $scope.checkValidZip = function() {
           if(!$scope.radioType){
               $('.mainFormZip').css('box-shadow','rgb(245, 19, 19) 0px 0px 10px');
               setTimeout(function(){
                   $('.mainFormZip').css('box-shadow','none');
               },1000);
           }
            if($scope.regionzip.length==0){
                $('#pac-input3').css('box-shadow','rgb(245, 19, 19) 0px 0px 10px');
                setTimeout(function(){
                    $('#pac-input3').css('box-shadow','none');
                },1000);
           }
            if(!$scope.radioInclude){
                $('.minorFormZip').css('box-shadow','rgb(245, 19, 19) 0px 0px 10px');
                setTimeout(function(){
                    $('.minorFormZip').css('box-shadow','none');
                },1000);
            }
        };
        $scope.getZipBrowser = function () {
            if (navigator.saysWho.indexOf("Chrome") != -1) {
                $scope.zipBrowser = "Chrome";
            } else if (navigator.saysWho.indexOf("Firefox") != -1) {
                $scope.zipBrowser = "Firefox";
            } else {
                $scope.zipBrowser = $filter("translate")("browser");
            }
        };
        $scope.getZipBrowser();
        $scope.fakeZip = function(){
            $('.zipFake').popup({
                on: 'click',
                position: 'top center'
            });
        };
        $scope.fakeZip();
        $rootScope.changeSearchType = function(param){
            $window.location.replace('/!#/candidates');
            $rootScope.changeSearchTypeNotFromCandidates = param;
        }
    }]);
