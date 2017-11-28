controller.controller('ActivityCalendarController', ["Person", "$scope", "$rootScope", "Vacancy", "frontMode", "$sce", "googleService", "notificationService", "$filter",
    '$http', '$localStorage','outlookService', '$uibModal', function (Person, $scope, $rootScope, Vacancy, frontMode, $sce, googleService, notificationService, $filter, $http, $localStorage, outlookService, $uibModal) {

    if ($localStorage.get('calendarShow') != undefined) {
        $rootScope.calendarShow = $localStorage.get('calendarShow');
        if ($rootScope.calendarShow == 'true') {
            $rootScope.calendarShow = true;
        } else if ($scope.calendarShow == 'false') {
            $rootScope.calendarShow = false;
        }
    } else {
        $rootScope.calendarShow = false;
    }
    $rootScope.closeModal = function(){
        $scope.modalInstance.close();
    };
    $scope.initUserGoogleCalendars = function () {

        var localStorageCheck = $localStorage.get("calendarsss_+" + $rootScope.me.personId);
        if (localStorageCheck != null) {
            $scope.calendarsForCheck = JSON.parse(localStorageCheck);
            var founded = {};
            for (var i = 0; i <= $rootScope.calendars.length - 1; i++) {
                var cal = $rootScope.calendars[i];
                var check = false;
                angular.forEach($scope.calendarsForCheck, function (val) {
                    if (cal.id == val.id) {
                        check = true;
                    }
                });
                if (!check) {
                    $scope.calendarsForCheck.push({
                        id: cal.id,
                        checked: true,
                        name: cal.summary,
                        isCleverStaffEvent: cal.summary == 'CleverStaff events'
                    });
                }
                founded[cal.id] = true;
            }
            for (var j = 0; j <= $scope.calendarsForCheck.length - 1; j++) {
                var el2 = $scope.calendarsForCheck[j];
                if (!founded[el2.id]) {
                    $scope.calendarsForCheck.splice(j, 1);
                }
            }
            var cleverStaffEventsElement;
            for (var k = 0; k <= $scope.calendarsForCheck.length - 1; k++) {
                var el = $scope.calendarsForCheck[k];
                if (el.name == 'CleverStaff events') {
                    cleverStaffEventsElement = angular.copy(el);
                    $scope.calendarsForCheck.splice(k, 1);
                }
            }
            $scope.calendarsForCheck.unshift(cleverStaffEventsElement);
        } else {
            $scope.calendarsForCheck = [];
            console.log('rootscope.calendars', $rootScope.calendars);
            angular.forEach($rootScope.calendars, function (val) {
                $scope.calendarsForCheck.push({
                    id: val.id,
                    checked: true,
                    name: val.summary,
                    isCleverStaffEvent: val.summary == 'CleverStaff events'
                })
            });
        }


        $scope.calendarsForGet = angular.copy($rootScope.calendars);
        for (var i = 0; i < $scope.calendarsForGet.length; i++) {
            for (var j = 0; j < $scope.calendarsForCheck.length; j++) {
                if ($scope.calendarsForCheck[j] && ($scope.calendarsForCheck[j].id == $scope.calendarsForGet[i].id)) {
                    if ($scope.calendarsForCheck[j].checked == false) {
                        $scope.calendarsForGet.splice(i, 1);
                    }
                }
            }
        }

        if (!$rootScope.$$phase) {
            $rootScope.$apply();
        }
    };


    $scope.login = function () {
        $localStorage.set('calendarShow', true);
        $rootScope.calendarShow = true;
        if (!$rootScope.me.googleMail) {
            $rootScope.curentOnlyMenWatch = $rootScope.$watch('g_info', function (val) {
                if ($rootScope.g_info !== undefined && $rootScope.g_info.email !== undefined) {
                    console.log("logon if!");
                    Person.setSocial({email: $rootScope.g_info.email, social: "google"}, function (resp) {
                        if (resp.status && angular.equals(resp.status, "error")) {
                            notificationService.error(resp.message);
                            $rootScope.g_info = null;
                        } else {
                            if ($scope.user) {
                                $scope.user.googleMail = $rootScope.g_info.email;
                            }
                            notificationService.success($filter('translate')("gmail change"));
                            googleService.login(function (selectedCalendar) {
                                if (selectedCalendar != undefined) $rootScope.selectedCalendar = selectedCalendar;
                                $scope.initUserGoogleCalendars();
                            });
                            $rootScope.initGoogleCalendar = true;
                        }
                    }, function () {
                        $rootScope.g_info = null;
                    });
                    $rootScope.curentOnlyMenWatch();
                }
            });
        } else {
            googleService.login(function (selectedCalendar) {
                if (selectedCalendar != undefined) $rootScope.selectedCalendar = selectedCalendar;
                $scope.initUserGoogleCalendars();
            });

            $rootScope.initGoogleCalendar = true;
        }
    };

    $scope.updateCalendar = function (selectedCal) {
        if (!selectedCal.isCleverStaffEvent) {
            console.log($scope.calendarsForGet);
            if (!selectedCal.checked) {
                console.log(selectedCal.checked);
                console.log("if");
                for (var i = 0; i < $scope.calendarsForGet.length; i++) {
                    console.log('$scope.calendarsForGet[i]', $scope.calendarsForGet[i]);
                    if ($scope.calendarsForGet[i].id == selectedCal.id) {
                        $scope.calendarsForGet.splice(i, 1);
                        selectedCal.checked = false;
                        i = 0;
                    }
                }
                calendarIndex = _.findIndex($scope.calendarsForCheck, {'id':selectedCal.id});
                $scope.calendarsForCheck[calendarIndex].checked = false;
            } else {
                console.log(selectedCal.checked);
                console.log("else");
                if(_.indexOf($scope.calendarsForGet,{'id': selectedCal.id}) == -1) {
                    angular.forEach($rootScope.calendars, function (val) {
                        if (val.id == selectedCal.id) {
                            $scope.calendarsForGet.push(val);
                            selectedCal.checked = true;
                        }
                    });
                }
                calendarIndex = _.findIndex($scope.calendarsForCheck, {'id':selectedCal.id});
                $scope.calendarsForCheck[calendarIndex].checked = true;
            }
            console.log('calendars calendarsForCheck', $scope.calendarsForCheck);
            $localStorage.set("calendarsss_+" + $rootScope.me.personId, $scope.calendarsForCheck);
            console.log('in update',$localStorage.get("calendarsss_+" + $rootScope.me.personId));
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }
    };
    if ($rootScope.calendarShow == true) {
        if ($rootScope.initGoogleCalendar == false) {
            googleService.login(function(){
                $scope.initUserGoogleCalendars();
            });
        } else {
            if ($rootScope.me.googleMail != undefined) {
                $scope.initUserGoogleCalendars();
            }
        }
    }
    $scope.resfeshIframe = function () {
        var iFrame = $(document).find("#calendar_iframe");
        iFrame.attr("src", iFrame.attr("src"));
    };
    $scope.srcUrl = null;


    $scope.getCalendarFrame = function (calendar, calendars) {
        if (frontMode === 'war') {
            if (calendar != undefined) {
                var url = "https://www.google.com/calendar/embed?&";
                url += "src=" + calendar.id.replace(new RegExp("#", 'g'), "%23");
                if (calendars) {
                    angular.forEach(calendars, function (value, key) {
                        if (value && value.id && value.id !== calendar.id) {
                            url += "&src=" + value.id.replace(new RegExp("#", 'g'), "%23");
                        }
                    });
                }
                url += "&ctz=" + jstz.determine().name();
                url += "&mode=WEEK";
                return $sce.trustAsResourceUrl(url);
            }
        } else {
            return $sce.trustAsResourceUrl("https://www.google.com/calendar/embed?mode=WEEK&src=cgbil05l7c05viqpngev2ou9b4%40group.calendar.google.com&ctz=Europe/Kiev");
        }
    };
    $scope.signOutGoogle = function () {
        $localStorage.set('calendarShow', false);
        $rootScope.calendarShow = false;
    };
    $scope.addGoogleCalendarForCs = function () {
        if($rootScope.me.outlookCalendar){
            $scope.deleteOutLookCalendar();
        }
        googleService.addCalendar(function (resultCode) {
            googleService.login(function(){
            }).then(
                result => {
                    Person.addGoogleCalendar({
                        accessToken: resultCode.code
                    }, function (resp) {
                        if (resp.status == 'ok') {
                            $localStorage.set('calendarShow', true);
                            $rootScope.calendarShow = true;
                            $scope.initUserGoogleCalendars();
                            $scope.getCalendarFrame();
                            setTimeout(function () {
                                $scope.resfeshIframe();
                            }, 1000)

                        } else {
                            if(resp.code == 'сouldNotGetRefreshToken') {
                                $scope.modalInstance = $uibModal.open({
                                    animation: true,
                                    templateUrl: '../partials/modal/calendar-access.html',
                                    resolve: {
                                    }
                                });
                            } else {
                                notificationService.error(resp.message);
                            }
                        }
                    });
                },
                error => {
                    console.log('in googleService.login reject')
                }
            );
            console.log('addCalendar');
        });
    };

    $scope.getGoogleCalendarForUserCs = function () {
        Person.getGoogleCalendar(function (resp) {
            if (resp.object != null) {
                $localStorage.set('calendarShow', true);
                $scope.showConnectButtom = false;
                $scope.resfeshIframe();
            } else {
                $scope.showConnectButtom = true;
                $localStorage.set('calendarShow', false);
                $rootScope.calendarShow = false;
            }
        });
    };
    $scope.getGoogleCalendarForUserCs();
    $scope.deleteGoogleCalendarForCs = function () {
        Person.deleteGoogleCalendar(function (resp) {
            if (resp.status == 'ok') {
                $localStorage.set('calendarShow', false);
                $rootScope.calendarShow = false;
                $scope.showConnectButtom = true;
                $scope.resfeshIframe();
                googleService.signOut();
            } else {
                notificationService.error(resp.message);
            }
        });
    };
        $scope.$watch(
            'outLookWatch',
            function watch(newValue,oldValue){
                if(newValue != undefined){
                    Person.addOutlookCalendar({
                        code:newValue
                    },function(resp){
                        if(resp.object){
                            $rootScope.me.outlookCalendar = resp.object;
                        }else{
                            $rootScope.me.outlookCalendar = false;
                        }
                    });
                }
            }
        );
    $scope.addOutlookcalendar = function (){
        if($scope.calendarShow){
            $scope.deleteGoogleCalendarForCs();
            outlookService.getAccessForCalendar();
        }else{
            outlookService.getAccessForCalendar();
        }
    };
        $scope.deleteOutLookCalendar = function(){
            Person.deleteOutlookCalendar (function(resp){
                if(resp.status == 'ok'){
                    if(resp.object){
                        $rootScope.me.outlookCalendar = resp.object;
                    }else{
                        $rootScope.me.outlookCalendar = false;
                    }
                }else{
                    notificationService.error(resp.message);
                }
            });
        };
        Person.getOutlookCalendar(function(resp){
            if(resp.object){
                $rootScope.me.outlookCalendar = resp.object;
            }else{
                $rootScope.me.outlookCalendar = false;
            }
        });
}]);
