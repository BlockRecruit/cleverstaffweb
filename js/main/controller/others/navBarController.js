function navBarController($q, Vacancy, serverAddress, notificationService, $scope, tmhDynamicLocale, $http, Person, $rootScope, Service,
                          $route, $window, $location, $filter, $sce, $cookies, localStorageService, $localStorage, $timeout, CheckAccess,
                          frontMode, $translate, Client, ScopeService, googleService, Company, $uibModal, Notice, Pay, News, TooltipService, Account,googleService) {
    $scope.onlyMe = null;
    $scope.orgCheck = true;
    $scope.onlyMeCheck = false;
    $scope.regionCheck = false;
    $rootScope.blockUser = false;
    $scope.billingEnabled = false;
    $scope.cutForTest = 18;
    $scope.activeNewsCounter = 3;
    $scope.activeNewsCounterEng = 3;
    $scope.shoowNewsFlag = true;
    $scope.news = [];
    $scope.newsEng = [];
    $scope.readedNews = [];
    $scope.bonus = 0;
    $scope.paidUsers = [];
    $scope.months = [{label:1, value:1},{label:2, value:2},{label:3, value:3},{label:4, value:4},{label:5, value:5},{label:6, value:6},{label:7, value:7},{label:8, value:8},{label:9, value:9},{label:10, value:10},{label:11, value:11},{label:12, value:12}];
    $scope.countPeople = 0;
    $scope.countMonth = 4;
    //localStorage.setItem("readedNews", '');
    if(localStorage.readedNews){
        $scope.readedNews = (JSON.parse(localStorage.getItem('readedNews')));
    }
    $rootScope.closeModal = function(){
        $rootScope.modalInstance.close();
    };
    $rootScope.closeNavModal = function(){
        if($rootScope.modalInstance)
            $rootScope.modalInstance.close();
    };

    $rootScope.badInternetObj = {show: false};
    $rootScope.frontMode = frontMode;
    $rootScope.initGoogleCalendar = false;

    $scope.inviteHiringManager = function(){
        $rootScope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'partials/modal/invite-hiring-manager.html?b=1',
            size: '',
            resolve: function(){

            }
        });
        $rootScope.modalInstance.opened.then(function(){
            $rootScope.inviteUser.role = 'client';
        });
        $rootScope.modalInstance.closed.then(function() {
            $rootScope.inviteUser.role = null;
            $rootScope.inviteUser.email = null;
        });
    };

    Service.getRegions2(function (resp) {
        $scope.regions = resp;
        let lang = localStorage.getItem('NG_TRANSLATE_LANG_KEY');
         $scope.translate = '';

        if(lang == 'ru'){
            $scope.translate =  "Выберите регион";
        }else{
            $scope.translate =  "Choose region";
        }
     $timeout(setDefualtValueRegionSelect);
    });

    $rootScope.getBrowser = function () {
        if (navigator.saysWho.indexOf("Chrome") != -1) {
            return "chrome";
        } else if (navigator.saysWho.indexOf("Firefox") != -1) {
            return "firefox";
        } else {
            return "all";
        }
    };

    $rootScope.callbackErr = function (err) {
        notificationService.error(err);
    };
    $rootScope.closeModalForTestAccount = function(){
        $rootScope.closeNavModal();
        $location.path("/pay");
    };
    $rootScope.hideTariff = true;
    $scope.blockInfo = function(){
        Company.getParams(function(resp){
            $rootScope.companyParams = resp.object;
            $scope.differenceDatesForPay = differenceBetweenTwoDates(new Date(), new Date($rootScope.companyParams.paidTillDate));
            //$scope.differenceDatesForHrModulePay = differenceBetweenTwoDates(new Date(), new Date($rootScope.companyParams.tarifHrModule == 'free' ? $rootScope.companyParams.trialEmployeeEndDate : $rootScope.companyParams.paidHrModuleTillDate));
            $rootScope.nowDate = new Date().getTime();
            $rootScope.otherDate = new Date($rootScope.companyParams.trialEndDate).getTime();
            if($rootScope.otherDate >= $rootScope.nowDate){
                $rootScope.hideTariff = true;
            }else if ($rootScope.companyParams.tarif == 'standard'){
                $rootScope.hideTariff = true;
            }else if($rootScope.companyParams.tarif == 'free' && $rootScope.otherDate >= $rootScope.nowDate) {
                $rootScope.hideTariff = true;
            }else if ($rootScope.companyParams.tarif == undefined){
                $rootScope.hideTariff = true;
            }else if ($rootScope.otherDate < $rootScope.nowDate){
                $rootScope.hideTariff = false;
                setTimeout(function(){
                    if($rootScope.me.recrutRole == 'client'){
                        $rootScope.blockAccountHmNotPaid();
                    }
                },2000);
                $rootScope.disabledBtnFunc = function(){
                    $rootScope.modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '../partials/modal/disabled-btn-for-test-account.html',
                        resolve: {
                            items: function () {

                            }
                        }
                    });
                    $('.overModal').removeClass('overModal');
                };
                $rootScope.disabledBtnFuncUserModal = function(){
                    $rootScope.closeModal();
                    $rootScope.modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '../partials/modal/disabled-btn-for-test-account.html',
                        resolve: {
                            items: function () {

                            }
                        }
                    });
                    $('.overModal').removeClass('overModal');
                };
            }else if($rootScope.companyParams.tarif == 'free') {
                $rootScope.hideTariff = false;
                setTimeout(function(){
                    if($rootScope.me.recrutRole == 'client'){
                        $rootScope.blockAccountHmNotPaid();
                    }
                },2000);
                $rootScope.disabledBtnFunc = function(){
                    $rootScope.modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '../partials/modal/disabled-btn-for-test-account-before-14-days.html',
                        resolve: {
                            items: function () {

                            }
                        }
                    });
                    $('.overModal').removeClass('overModal');
                };
                $rootScope.disabledBtnFuncUserModal = function(){
                    $rootScope.closeModal();
                    $rootScope.modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '../partials/modal/disabled-btn-for-test-account-before-14-days.html',
                        resolve: {
                            items: function () {

                            }
                        }
                    });
                    $('.overModal').removeClass('overModal');
                };
            }
            if($scope.differenceDatesForPay < 0){
                $scope.differenceDatesForPay = Math.abs($scope.differenceDatesForPay);
            }else{
                $scope.differenceDatesForPay = -$scope.differenceDatesForPay;
            }
            if(resp.object.block == 'Y'){
                $rootScope.blockUser = true;
                $scope.bonuce = 0;
                $rootScope.blockUserData = resp.object;
                if(!$rootScope.blockUserData.payment_min_users){
                    $rootScope.blockUserData.payment_min_users = 1;
                }
                $scope.monthRate = $scope.monthRate || 25;
                if ($scope.countMonth >= 12) {
                    $scope.bonus = 20;
                }
                else if ($scope.countMonth >= 4) {
                    $scope.bonus = 10;
                }
                else {
                    $scope.bonus = 0;
                }

                $scope.price = Math.floor($scope.monthRate * $scope.countMonth * $scope.countPeople);
                $scope.bonusAmount = Math.floor(($scope.price / 100) * $scope.bonus );
                $scope.priceWithBonus = $scope.price + $scope.bonusAmount;
            }else{
                $rootScope.blockUser = false;
            }
            if(resp.object.billing === 'Y') {
                $scope.billingEnabled = true;
            }
            Account.getAccountInfo(resp => {
                if(resp.object.tarif === 'free') {
                    $rootScope.hideTariff = false;
                }
            }, error => notificationService.error(error.message))
        });
    };

    $scope.$watchGroup(['countPeople', 'countMonth'], function() {
        $scope.monthRate = $scope.monthRate || 25;
        if ($scope.countMonth >= 12) {
            $scope.bonus = 20;
        }
        else if ($scope.countMonth >= 4) {
            $scope.bonus = 10;
        }
        else {
            $scope.bonus = 0;
        }

        $scope.price = Math.floor($scope.monthRate * $scope.countMonth * $scope.countPeople);
        $scope.bonusAmount = Math.floor(($scope.price / 100) * $scope.bonus );
        $scope.priceWithBonus = $scope.price + $scope.bonusAmount;
    });

    $scope.blockInfo();

    $rootScope.removeLogo = function () {
        Service.removeLogo(function (resp) {
            if ($rootScope.companyLogo != undefined) {
                if (angular.equals(resp.status, "ok")) {
                    $rootScope.companyLogo = undefined;
                }
            }
        });
    };

    $rootScope.showAddLogo = function () {
        if ($rootScope.me.recrutRole == 'admin') {
            $("#logo").click();
        } else {
            notificationService.error($filter('translate')('Only admin can set logo'));
        }
    };

    $scope.openNoticeMenu = function () {
        $('#open-notice-button').blur();
        var noticesCont = $("#notices");
        if (noticesCont.css('display') == 'none') {
            $(".noticeIcon").css({"background-color": "rgba(0, 0, 0, 0.11)"});
            //noticesCont.toggle('slide', {direction: 'up'}, 400);
            $(noticesCont).slideDown(400);
            $('body').mouseup(function (e) {
                var noticesElement = $("#notices");
                if(noticesElement.has(e.target).length === 0){
                    noticesCont.slideUp();
                    $(".noticeIcon").css({"background-color": "rgba(0, 0, 0, 0)"});
                    $(document).off('mouseup');
                }
            });
        } else {
            noticesCont.slideUp();
            $("#notice_element_icon").css({"background-color": "rgba(0, 0, 0, 0)"});
            $(document).off('mouseup')
        }
        localStorage.setItem("isAddCandidates", false);
    };
    //$scope.toggleNoticeMenu = function(){
    //    $('body').click(function (e) {
    //        var noticesElement = $("#notices");
    //        if(noticesElement.has(e.target).length === 0 && !noticesElement.is(e.target)){
    //            noticesElement.slideUp();
    //            $(".noticeIcon").css({"background-color": "rgba(0, 0, 0, 0)"});
    //            $(document).off('mouseup');
    //        }
    //    });
    //};
    //$scope.toggleNoticeMenu();
    $scope.showScopeFunc = function(){
        var scopeShow = $(".showScopeMenu");
        if (scopeShow.css('display') == 'none') {
            $(scopeShow).slideDown();
        } else {
            $('body').mouseup(function (e) {
                if ($(".showScopeMenu").has(e.target).length === 0) {
                    scopeShow.slideUp();
                    $(document).off('mouseup');
                }
            });
        }
    };

    $rootScope.candidatePreview = null;
    $rootScope.serverAddress = serverAddress;
    $rootScope.statusInter = Vacancy.getInterviewStatus();
    $rootScope.statusInterFull = Vacancy.getInterviewStatusFull();
    $rootScope.serverAddress = serverAddress;

    var cancelRefresh;
    var myIntervalFunction = function () {
        CheckAccess.check($window);
        $rootScope.i = 0;
        cancelRefresh = $timeout(function myFunction() {
            CheckAccess.check($window);
            cancelRefresh = $timeout(myFunction, 300000);
        }, 300000);
    };
    $scope.toAdd = function (name) {
        $location.path(name);
    };
    $rootScope.inviteUser = {
        role: null,
        email: null
    };

    var isBlock = function (callback) {
        var done = false;
        Person.getAllPersons(function (resp) {
            $scope.associativePerson = resp.object;
            angular.forEach($scope.associativePerson , function (val) {
                if (val.login == $rootScope.inviteUser.email) {
                    callback(val);
                    done = true;
                }
            });
            if (!done) {
                callback(false)
            }
        }, function (resp) {
            callback(false)
        })
    };

    $rootScope.addInvite = function () {
        if ($rootScope.frontMode === 'war') {
            if ($rootScope.inviteUser.role == null) {
                notificationService.error($filter('translate')('need role'));
            } else if ($rootScope.inviteUser.email == null) {
                notificationService.error($filter('translate')('wrong_email'));
            }else if($rootScope.inviteUser.role == 'client' && ($rootScope.VacancyAddedInCandidate == null || $rootScope.VacancyAddedInCandidate == undefined)){
                notificationService.error($filter('translate')('Hiring manager must be responsible for the vacancy.Please select a vacancy'));
            } else {
                if($rootScope.VacancyAddedInCandidate != undefined){
                    $rootScope.inviteUser.vacancyId = $rootScope.VacancyAddedInCandidate.vacancyId;
                }
                isBlock(function (resp) {
                    if (resp && resp.status == 'N') {
                        $rootScope.inviteUserBlock = true;
                        $rootScope.errorMessageType = "inviteBlockUser";
                        $location.path("/users/" + resp.userId);
                        // $rootScope.closeNavModal();
                        $rootScope.VacancyAddedInCandidate.vacancyId = null;
                        $rootScope.inviteUser.vacancyId = null;
                    } else if (resp && resp.status == 'A') {
                        notificationService.error("<a href='#/users/" + resp.userId + "'>" + resp.fullName + "</a> (" + resp.login + ") " + $filter("translate")("has already working in your account"));
                        $rootScope.closeNavModal();
                        $rootScope.VacancyAddedInCandidate.vacancyId = null;
                        $rootScope.inviteUser.vacancyId = null;
                    } else {
                        Person.inviteUser({
                            email: $rootScope.inviteUser.email,
                            role: $rootScope.inviteUser.role,
                            vacancyId: $rootScope.inviteUser.role == 'client' ? $rootScope.inviteUser.vacancyId : null,
                            lang: $translate.use()
                        }, function (resp) {
                            if (resp.status && angular.equals(resp.status, "error")) {
                                notificationService.error(resp.message);
                                //$('.addUserInvite.modal').modal('hide');
                                $rootScope.VacancyAddedInCandidate.vacancyId = null;
                                $rootScope.inviteUser.vacancyId = null;
                            } else {
                                notificationService.success($filter('translate')('user_was_invite_1') + $rootScope.inviteUser.email + $filter('translate')('user_was_invite_2'));
                                $rootScope.closeNavModal();
                                $rootScope.VacancyAddedInCandidate.vacancyId = null;
                                $rootScope.inviteUser.vacancyId = null;
                                if ($location.path() == '/company/users') {
                                    $route.reload();
                                }
                                $rootScope.inviteUser = {
                                    role: 'recruter',
                                    email: ''
                                };
                            }
                        }, function (resp) {
                            //notificationService.error($filter('translate')('service temporarily unvailable'));
                        });
                    }
                })
            }
        } else {
            notificationService.error($filter('translate')('This function is not available at the demo version'));
        }
    };

    // Client.all(Client.searchOptions(), function (response) {
    //     $rootScope.clientsForInvite = response.objects;
    // });
    console.log($rootScope, '$rootScope');
    $rootScope.userRoles = [
        {
            type: "fullAccess",
            roles: [
                {"name": "Admin", "value": "admin", "type" : "full-access"},
                {"name": "Recruiter", "value": "recruter", "type": 'full-access'}
            ]
        },
        {
            type: "limitedAccess",
            roles: [
                {"name": "Freelancer", "value": "freelancer", "type": 'limited-access'},
                {"name": "Researcher", "value": "researcher", "type": 'limited-access'},
            ]
        },
        {
            type: "freeAccess",
            roles: [
                {"name": "Hiring Manager", "value": "client", "type": 'free-access'}
            ]
        }
    ];

    $rootScope.selectUserRole = function(role) {
        $rootScope.inviteUser.role = role.value;
    };

    myIntervalFunction();
    $scope.scopeStyle = {'max-width': "160px"};

    $scope.changeLanguage = function (key) {
        Person.setLang({lang:key},function(resp){

        });
        $translate.use(key);
        $rootScope.currentLang = key;
    };


    $scope.openRegionList = function () {
        if (document.createEvent) {
            var regionList = document.getElementById('regionList');
            var e = document.createEvent("Event");
            e.initEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            regionList.dispatchEvent(e);
        } else if (element.fireEvent) {
            regionList[0].fireEvent("onmousedown");
        }
    };

    function getTrialTime(getMe) {
        var trialEndDate = getMe["orgParams"]["trialEndDate"],
            result =  difBetweenDates(new Date(trialEndDate), new Date()) ;
        $scope.digit = " " + result + " ";
        $scope.getMeObj = getMe;
        return new Promise((resolve,reject) => {
            if(getMe) {
                resolve(getMe);
            } else {
                reject('error');
            }
        })
    };

    $scope.HoverBlockTrialShow = function () {
        $scope.hoverBlockTrial = true;
    };
    $scope.HoverBlockTrialHidden = function () {
        $scope.hoverBlockTrial = false;
    };

    $scope.changeOrg = function (callback) {
        if ($rootScope.me.org.orgId != $scope.orgId) {
            Person.changeOrg({"orgId": $scope.orgId}, function (resp) {
                if (resp.personId) {
                    Person.getMe(function (resp) {
                        $rootScope.me = resp.object;
                        $rootScope.userId = resp.object.userId;
                        $rootScope.differenceCreateOrgDate = differenceBetweenTwoDates(new Date(), $rootScope.me.org.dc);
                        //if($rootScope.me.recrutRole == "freelancer"){
                        //    $scope.changeScope('onlyMy');
                        //}
                        $rootScope.closeNavModal();

                    });
                    Service.getRegions2(function (resp) {
                        $scope.regions = resp;
                    });
                    if ($rootScope.currentLocation == "/personInfo/:id") {
                        $location.path('/personInfo/' + resp.userId);
                    }
                    $route.reload();
                    if (callback != undefined) {
                        callback();
                    }
                } else if (resp.message) {
                    notificationService.error($filter('translate')("You can't change the company, because") + ' ' + resp.message);
                } else {
                    //notificationService.error($filter('translate')('service temporarily unvailable'));
                }
                $scope.regionId = null
            }, function (resp) {
                //notificationService.error($filter('translate')('service temporarily unvailable'));
            });
        } else {
            if (callback != undefined) {
                callback();
            }
        }
    };

    $scope.toDetailUserInfo = function() {
        $location.path("/personInfo/" + $rootScope.me.userId);
    };
    $('.ui.dropdown').dropdown();

    $rootScope.updateMe = function(){
        $rootScope.loading = true;
        Person.getMe(response => {
            $rootScope.loading = false;
            if(response.status != 'error'){
                if (response.object.orgParams !== undefined) {
                    function isServerURL() {
                        return (response.object.orgParams !== undefined && response.object.orgParams.serverURL !== undefined && response.object.orgParams.serverURL !== null && response.object.orgParams.serverURL !== '' && response.object.orgParams.serverURL !== 'https://dev.cleverstaff.net/' && response.object.orgParams.serverURL !== 'http://dev2.cleverstaff.net/')
                    }

                    if (isServerURL()) {
                        $window.location.href = response.object.orgParams.serverURL + "!#" + $location.path();
                    }
                }
                $rootScope.updateQuestStatus();
                if (response.object.personParams != undefined && response.object.personParams.lang != undefined) {
                    $rootScope.currentLang = response.object.personParams.lang === 'en' || response.object.personParams.lang === 'ru' ? response.object.personParams.lang : 'en';
                    tmhDynamicLocale.set($rootScope.currentLang);
                    $translate.use($rootScope.currentLang);
                }
                Service.cookiesConsent();
                $rootScope.me = response.object;
                $rootScope.orgs = response.object.orgs;
                $scope.orgId = response.object.orgId;
                $scope.nameUser = (response.object.firstName ? response.object.firstName : " ") + " " + (response.object.lastName ? response.object.lastName : " ");
                $rootScope.userId = response.object.userId;
                if (response !== undefined) {
                    Service.getOrgLogoId({orgId: response.object.orgId}, function (logoResp) {
                        if (logoResp.status === 'ok') {
                            $rootScope.companyLogo = logoResp.object;
                        }
                    });
                }

                // if($rootScope.me.recrutRole == 'admin') {
                    Account.getAccountInfo(function(resp){
                        if(resp.status != 'error'){
                            if(resp.object && resp.object.tillDate) {
                                $scope.tarif = resp.object.tarif;
                                $scope.paidFor = resp.object.dayCount;
                                $('#bilEnabledText').removeClass('hidden');
                                $rootScope.paidTillDateBilling = resp.object.tillDate.year + '-' + resp.object.tillDate.monthValue + '-' + resp.object.tillDate.dayOfMonth;
                            } else {
                                $scope.paidFor = difBetweenDates(new Date($rootScope.companyParams.paidTillDate), new Date());
                                $('#bilDisabledText').removeClass('hidden');
                            }
                            if(resp.object && resp.object.monthRate && resp.object.dailyRate) {
                                $scope.monthRate = resp.object.monthRate;
                                $scope.dailyRate = resp.object.dailyRate;
                                $('#dailyRate').html($scope.dailyRate);
                                $('#monthRate').html($scope.monthRate);
                            }
                                $scope.monthRate = resp.object.monthRate;
                                if($rootScope.blockUser){
                                    $scope.bonuce = 0;
                                    if(!$rootScope.blockUserData.payment_min_users){
                                        $rootScope.blockUserData.payment_min_users = 1;
                                    }

                                    $scope.monthRate = $scope.monthRate || 25;
                                    if ($scope.countMonth >= 12) {
                                        $scope.bonus = 20;
                                    }
                                    else if ($scope.countMonth >= 4) {
                                        $scope.bonus = 10;
                                    }
                                    else {
                                        $scope.bonus = 0;
                                    }

                                    $scope.price = Math.floor($scope.monthRate * $scope.countMonth * $scope.countPeople);
                                    $scope.bonusAmount = Math.floor(($scope.price / 100) * $scope.bonus );
                                    $scope.priceWithBonus = $scope.price + $scope.bonusAmount;
                                }
                                if(!$scope.$$phase) {
                                    $scope.$apply();
                                }

                    }else{
                        notificationService.error(resp.message);
                    }

                    ///////////For account on billing - tarif in AccountInfo request
                    if(!$rootScope.companyParams.tarif && resp.object.tarif) {
                        $rootScope.companyParams.tarif = resp.object.tarif;
                        $rootScope.nowDate = new Date().getTime();
                        $rootScope.otherDate = new Date($rootScope.companyParams.trialEndDate).getTime();
                        if($rootScope.otherDate >= $rootScope.nowDate){
                            $rootScope.hideTariff = true;
                        }else if ($rootScope.companyParams.tarif == 'standard'){
                            $rootScope.hideTariff = true;
                        }else if($rootScope.companyParams.tarif == 'free' && $rootScope.otherDate >= $rootScope.nowDate) {
                            $rootScope.hideTariff = true;
                        }else if ($rootScope.otherDate < $rootScope.nowDate){
                            $scope.trialOver = true;
                            $rootScope.hideTariff = false;
                            setTimeout(function(){
                                if($rootScope.me.recrutRole == 'client'){
                                    $rootScope.blockAccountHmNotPaid();
                                }
                            },2000);
                            $rootScope.disabledBtnFunc = function(){
                                $rootScope.modalInstance = $uibModal.open({
                                    animation: true,
                                    templateUrl: '../partials/modal/disabled-btn-for-test-account.html',
                                    resolve: {
                                        items: function () {

                                        }
                                    }
                                });
                                $('.overModal').removeClass('overModal');
                            };
                            $rootScope.disabledBtnFuncUserModal = function(){
                                $rootScope.closeModal();
                                $rootScope.modalInstance = $uibModal.open({
                                    animation: true,
                                    templateUrl: '../partials/modal/disabled-btn-for-test-account.html',
                                    resolve: {
                                        items: function () {

                                        }
                                    }
                                });
                                $('.overModal').removeClass('overModal');
                            };
                        }else if($rootScope.companyParams.tarif == 'free') {
                            $rootScope.hideTariff = false;
                            setTimeout(function(){
                                if($rootScope.me.recrutRole == 'client'){
                                    $rootScope.blockAccountHmNotPaid();
                                }
                            },2000);
                            $rootScope.disabledBtnFunc = function(){
                                $rootScope.modalInstance = $uibModal.open({
                                    animation: true,
                                    templateUrl: '../partials/modal/disabled-btn-for-test-account-before-14-days.html',
                                    resolve: {
                                        items: function () {

                                        }
                                    }
                                });
                                $('.overModal').removeClass('overModal');
                            };
                            $rootScope.disabledBtnFuncUserModal = function(){
                                $rootScope.closeModal();
                                $rootScope.modalInstance = $uibModal.open({
                                    animation: true,
                                    templateUrl: '../partials/modal/disabled-btn-for-test-account-before-14-days.html',
                                    resolve: {
                                        items: function () {

                                        }
                                    }
                                });
                                $('.overModal').removeClass('overModal');
                            };
                        }
                    }
                    //////////////
                });
                // }

                if($rootScope.modalInstance){
                    $rootScope.modalInstance.closed.then(function(){
                        switchToBilling().then((result) => {
                            increasedPrice();
                        })
                    });
                }else{
                    switchToBilling().then((result) => {
                        increasedPrice();
                    });
                }

                function switchToBilling(){
                    return $q((resolve, reject) => {
                        if (response["object"]["orgParams"]["switch2billing"] === "must" && response["object"]["recrutRole"] === "admin") {
                            $rootScope.modalInstance = $uibModal.open({
                                animation: true,
                                templateUrl: '../partials/modal/change-payment-model.html',
                                controller: 'payWay4PayController',
                                backdrop: 'static',
                            });
                            if($rootScope.modalInstance){
                                $rootScope.modalInstance.closed.then(function(){
                                    resolve('switchToBilling === must');
                                });
                            }
                        } else {
                            resolve('switchToBilling !== must');
                        }
                    });
                }

                function increasedPrice() {
                    if(response["object"]["orgParams"]["increasePrices"] === "must" && response["object"]["recrutRole"] === "admin") {
                        $rootScope.modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: '../partials/modal/price-change.html',
                            controller: 'payWay4PayController',
                            scope: $scope,
                            backdrop: 'static'
                        });
                    }
                }



                $rootScope.differenceCreateOrgDate = differenceBetweenTwoDates(new Date(), $rootScope.me.org.dc);
                $scope.scopeName = $filter('filter')($scope.orgs, $scope.orgId, "orgId")[0].orgName;
                if (localStorageService.get($rootScope.userId) === 'onlyme') {
                    ScopeService.initDefaultScope("onlyMy");
                } else if (localStorageService.get($rootScope.userId) === 'region' && localStorageService.get($rootScope.userId + "_regionId")) {
                    var region = localStorageService.get($rootScope.userId + "_regionId");
                    localStorageService.set($rootScope.userId + "_regionId", region);
                    ScopeService.initDefaultScope("region", {type: region.type, value: region.value, name: region.showName});
                    $scope.regionId = region.id;
                } else {
                    ScopeService.initDefaultScope("company");
                }
                if ($rootScope.me.googleMail) {
                    googleService.checkAuth();
                }
                //if($rootScope.me.recrutRole == "freelancer"){
                //    $scope.changeScope('onlyMy');
                //}
                window.mylogin =  response.object.login;
                var appId = 'fcijt4tn';
                if(window.location.hostname != 'cleverstaff.net'){
                    appId = "xlxtttgt";
                }
                var time = new Date($rootScope.me.hireDate);


                getTrialTime(response['object']);
                //window.Intercom("boot", {
                //    app_id: appId,
                //    name: $rootScope.me.fullName, // Full name
                //    email: $rootScope.me.login, // Email address
                //    created_at: Math.round(time.getTime()/1000.0)// Signup date as a Unix timestamp
                //});
                //window.Intercom("update");
                $rootScope.blockAccountHmNotPaid = function(){
                    if($rootScope.me.recrutRole == 'client'){
                        if($rootScope.hideTariff == false){
                            if($rootScope.me.orgs.length > 1){
                                $('.navbar-static-top').addClass('overModal');
                            }
                            $rootScope.modalInstance = $uibModal.open({
                                animation: true,
                                templateUrl: '../partials/modal/blockAccountHmNotPaid.html',
                                size: 'md',
                                backdrop: 'static',
                                keyboard: false,
                                resolve: {
                                    items: function () {

                                    }
                                }
                            });
                            if($rootScope.me.orgs.length > 1){
                                $('.blurBackground').css({"-webkit-filter": "blur(-1px)", "-moz-filter": "blur(-1px)", "-o-filter": "blur(-1px)", "-ms-filter": "blur(-1px)", "filter": "blur(-1px)"});
                            }else{
                                $('.blurBackground').css({"-webkit-filter": "blur(5px)", "-moz-filter": "blur(5px)", "-o-filter": "blur(5px)", "-ms-filter": "blur(5px)", "filter": "blur(5px)"});
                            }
                        }
                    }
                };
                $rootScope.blockAccountHmNotPaid();
                /**************************************Remove emails that cant send**************************************/
                setTimeout(function(){
                    angular.forEach($rootScope.me.emails, function(resp){
                        if(resp.permitSend != true){
                            $rootScope.me.emails.splice($rootScope.me.emails.indexOf(resp), 1);
                        }
                    });
                },0);
                /**************************************End of remove emails that cant send**************************************/
            }else{
                $rootScope.error = response.message;
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    keyboard: false,
                    templateUrl: '../partials/modal/russian-server-transfer-error.html',
                    resolve: {

                    }
                });
                $scope.modalInstance.opened.then(function(){
                    $('.modal').addClass('middle-modal')
                });
            }
        }, resp => $rootScope.loading = false);
    };
    $rootScope.updateMe();
    $rootScope.getNotices = function(){
        Notice.getMy(function(resp){
            if(resp.status =='ok'){
                $rootScope.globalNotice = resp.object;
            }else{
                notificationService.error(resp.message);
            }
        })
    };

    $rootScope.getNotices();


    $scope.signOut = function () {
        $cookies.cfauth = 'false';
        Person.logout(function (response) {
            $window.location.replace('/');
        });
    };

    $scope.getImgSrc = function (g_info) {
        if (g_info != undefined) {
            return $sce.trustAsResourceUrl(g_info.picture + "?sz=38");
        }
    };

    $scope.toAddCandidate = function () {
        Service.toAddCandidate();
    };

    $rootScope.candnotifyClick = function () {
        $rootScope.candnotify.send = !$rootScope.candnotify.send;
        $localStorage.set("candnotify", false);
    };

    $scope.scopeActiveObject = null;


    ScopeService.setNavBarUpdateFunction(function (val) {
        $scope.scopeActiveObject = val;
        $rootScope.scopeActiveObject = val;
        setCurrentScopeForNavBar($scope.scopeActiveObject.name);
        $scope.scopeActiveObject.name === 'region' ?setCurrentRegionForNavBar(null): null;
    });

    function isCheckBoxChecked(element) {
        return element.classList.contains('checkmark');
    }

    function setCurrentScopeForNavBar(name){
        $rootScope.currentSelectScope = name;
    }

    function setCurrentRegionForNavBar(region){
        if(!region){
            region = JSON.parse(localStorage.getItem(`ls.${$rootScope.userId}_regionId`));
        }
        $rootScope.currentSelectRegion = region.name;
    }


    $scope.changeScope = function (name, orgId, event) {
        if(event && isCheckBoxChecked(event.target)) return;
        setCurrentScopeForNavBar(name);

        if (name == 'region') {
            if($rootScope.activePage == 'Candidates'){
                $rootScope.clearSearchRegion();
            }

            if ($scope.regionId) {
                localStorageService.set($rootScope.userId, 'region');
                var region = null;
                angular.forEach($scope.regions, function (val) {
                    if (val.id == $scope.regionId) {
                        region = val;
                    }
                });
                localStorageService.set($rootScope.userId + "_regionId", region);
                ScopeService.setActiveScopeObject(name, {
                    type: region.type,
                    value: region.value,
                    name: region.showName
                });

                setCurrentRegionForNavBar($scope.regionId);
            } else {
                $scope.regionListStyle = {
                    'border': '3px solid red'
                };
                setTimeout(function () {
                    $scope.regionListStyle = {};
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }, 2000);
                return;
            }
        } else if (name == 'company') {
            $timeout(setDefualtValueRegionSelect);
            $timeout(function(){
                $scope.orgId = orgId;
                $scope.changeOrg(function () {
                    ScopeService.setActiveScopeObject(name);
                    localStorageService.set($rootScope.userId, 'org');
                    localStorageService.set($rootScope.userId + "_regionId", null);
                });
            });

        } else if (name == 'onlyMy') {
            $timeout(setDefualtValueRegionSelect);
            localStorageService.set($rootScope.userId, 'onlyme');
            localStorageService.set($rootScope.userId + "_regionId", null);
            ScopeService.setActiveScopeObject(name);
            $scope.regionListStyle = {
                'border': '1px solid rgba(0,0,0,.15);'
            };
        }

        notificationService.success($translate.instant("Account visibility changed"));

        setTimeout(function () {
            $scope.blockInfo();
            $scope.getAllPersonsFunc();
        }, 1000);
    };

    $scope.changeScopeForRegionSelect = function (name, regionId) {
        setCurrentScopeForNavBar(name);

        if (name == 'region') {
            if($rootScope.activePage == 'Candidates'){
                $rootScope.clearSearchRegion();
            }

            $scope.regionId = regionId;
            if ($scope.regionId) {
                localStorageService.set($rootScope.userId, 'region');
                var region = null;
                angular.forEach($scope.regions, function (val) {
                    if (val.id == $scope.regionId) {
                        region = val;
                    }
                });
                localStorageService.set($rootScope.userId + "_regionId", region);

                ScopeService.setActiveScopeObject(name, {
                    type: region.type,
                    value: region.value,
                    name: region.showName
                });

                notificationService.success($translate.instant("Account visibility changed"));
            } else {
            }
        } else if (name == 'company') {
            $scope.changeOrg(function () {
                ScopeService.setActiveScopeObject(name);
                localStorageService.set($rootScope.userId, 'org');
                localStorageService.set($rootScope.userId + "_regionId", null);
                notificationService.success($translate.instant("Account visibility changed"));
            });
        } else if (name == 'onlyMy') {
            localStorageService.set($rootScope.userId, 'onlyme');
            localStorageService.set($rootScope.userId + "_regionId", null);
            ScopeService.setActiveScopeObject(name);
            notificationService.success($translate.instant("Account visibility changed"));
        }
    };

    // Create the XHR object.
    function createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            // XHR for Chrome/Firefox/Opera/Safari.
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            // XDomainRequest for IE.
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            // CORS not supported.
            xhr = null;
        }
        return xhr;
    }

// Helper method to parse the title tag from the response.
//function getTitle(text) {
//    return text.match('<title>(.*)?</title>')[1];
//}

//Make the actual CORS request.
//    function makeCorsRequestNews() {
//        // All HTML5 Rocks properties support CORS.
//        var url = 'https://cleverstaff.net/blog-entries3';
//
//        var xhr = createCORSRequest('GET', url);
//        if (!xhr) {
//            alert('CORS not supported');
//            return;
//        }
//
//        // Response handlers.
//        xhr.onload = function() {
//            var text = xhr.responseText;
//            var newsArray = JSON.parse(xhr.responseText);
//            angular.forEach(newsArray, function (val) {
//                $scope.news.push(val);
//                angular.forEach($scope.readedNews, function (resp) {
//                    if(val.ID == resp.ID){
//                        $scope.news.splice($scope.news.indexOf(val), 1);
//                        $scope.activeNewsCounter = $scope.activeNewsCounter - 1;
//                    }
//                });
//            });
//            if($scope.news.length == 0){
//                $scope.shoowNewsFlag = false;
//            }
//        };
//
//        xhr.onerror = function() {
//
//        };
//
//        xhr.send();
//    }
//    makeCorsRequestNews();
//
//    function makeCorsRequestNewsEng() {
//        // All HTML5 Rocks properties support CORS.
//        var url = ' https://cleverstaff.net/news3';
//
//        var xhr = createCORSRequest('GET', url);
//        if (!xhr) {
//            alert('CORS not supported');
//            return;
//        }
//
//        // Response handlers.
//        xhr.onload = function() {
//            var text = xhr.responseText;
//            var newsArray = JSON.parse(xhr.responseText);
//            angular.forEach(newsArray, function (val) {
//                var parcedTitle = $.parseHTML(val.title);
//                val.title = parcedTitle[0];
//                $scope.newsEng.push(val);
//                angular.forEach($scope.readedNews, function (resp) {
//                    if(val.ID == resp.ID){
//                        $scope.newsEng.splice($scope.newsEng.indexOf(val), 1);
//                        $scope.activeNewsCounterEng = $scope.activeNewsCounterEng - 1;
//                    }
//                });
//            });
//            if($scope.newsEng.length == 0){
//                $scope.shoowNewsFlag = false;
//            }
//        };
//
//        xhr.onerror = function() {
//
//        };
//
//        xhr.send();
//    }
//    makeCorsRequestNewsEng();
    $('body').disabled = true;

    $scope.addReadedNews = function(oneNews){
        window.open(oneNews.link);
        $scope.readedNews.push(oneNews);
        $scope.readedNews = JSON.stringify($scope.readedNews);
        localStorage.setItem("readedNews", $scope.readedNews);
        $scope.readedNews = JSON.parse($scope.readedNews);
        $scope.activeNewsCounter = $scope.activeNewsCounter - 1;
        $scope.activeNewsCounterEng = $scope.activeNewsCounterEng - 1;
        $scope.news.splice($scope.news.indexOf(oneNews), 1);
        if($scope.news.length == 0){
            $scope.shoowNewsFlag = false;
        }
        $scope.newsEng.splice($scope.newsEng.indexOf(oneNews), 1);
        if($scope.newsEng.length == 0){
            $scope.shoowNewsFlag = false;
        }
    };
    $scope.relocateToBlog = function(){
        window.open('http://blog.cleverstaff.net/');
    };
    $scope.relocateToBlogEng = function(){
        window.open('http://news.cleverstaff.net');
    };
    $scope.closeNewsTab = function(){
        $('.newsMenu').hide();
        $scope.shoowNewsFlag = false;
    };
    $scope.getAllPersonsFunc = function(){
        $scope.numberVacancy = 0;
        //$scope.trueVisionBlockUser = $rootScope.blockUser;
        //$rootScope.blockUser = false;
        //$rootScope.$on('$routeChangeStart',function(){
        //    console.log(1);
        //   if($scope.trueVisionBlockUser == true){
        //        $rootScope.blockUser = true;
        //    }
        //});

        $rootScope.payClick = function () {
            Pay.createPaymentUsage({
                months: $scope.countMonth,
                users: $scope.countPeople,
                type: 'way4pay'
            }, function (resp) {
                if (resp.status && angular.equals(resp.status, "error")) {
                    notificationService.error(resp.message);
                } else {
                    var form = '<form id="payForm" action="https://secure.wayforpay.com/pay" method="post">' +
                        '<input type="hidden" name="amount" value="' + resp.wayForPayParams.amount + '" />' +
                        '<input type="hidden" name="currency" value="' + resp.wayForPayParams.currency + '" />' +
                        '<input type="hidden" name="merchantAccount" value="' + resp.wayForPayParams.merchantAccount + '" />' +
                        '<input type="hidden" name="merchantDomainName" value="' + resp.wayForPayParams.merchantDomainName + '" />' +
                        '<input type="hidden" name="merchantSignature" value="' + resp.wayForPayParams.merchantSignature + '" />' +
                        '<input type="hidden" name="merchantTransactionSecureType" value="' + resp.wayForPayParams.merchantTransactionSecureType + '" />' +
                        '<input type="hidden" name="merchantTransactionType" value="' + resp.wayForPayParams.merchantTransactionType + '" />' +
                        '<input type="hidden" name="orderDate" value="' + resp.wayForPayParams.orderDate + '" />' +
                        '<input type="hidden" name="orderReference" value="' + resp.wayForPayParams.orderReference + '" />' +
                        '<input type="hidden" name="paymentSystems" value="' + resp.wayForPayParams.paymentSystems + '" />' +
                        '<input type="hidden" name="productCount[]" value="' + resp.wayForPayParams.productCount + '" />' +
                        '<input type="hidden" name="productName[]" value="' + resp.wayForPayParams.productName + '" />' +
                        '<input type="hidden" name="productPrice[]" value="' + resp.wayForPayParams.productPrice + '" />' +
                        '<input type="hidden" name="returnUrl" value="' + resp.wayForPayParams.returnUrl + '" />' +
                        '<input type="hidden" name="serviceUrl" value="' + resp.wayForPayParams.serviceUrl + '" />' +
                        '</form>';
                    $('body').append(form);
                    $('#payForm').submit();
                    $('#payForm').remove();
                }
            }, function () {
                //notificationService.error($filter('translate')('service temporarily unvailable'));
            });
        };
        Person.getAllPersons((resp) => {
            angular.forEach(resp.object, function (val) {
                if (val.status == "A" && val.recrutRole != 'client') {
                    $scope.paidUsers.push({label: $scope.paidUsers.length + 1, value: $scope.paidUsers.length + 1});
                }
            });
            $scope.countPeople = $scope.paidUsers.length;
        });

        $scope.deletePayment = function(resp){
            console.log(resp.paymentId);
            $.ajax({
                url: "/hr/pay/removePayment?paymentId="+resp.paymentId,
                type: "GET",
                data: null,
                dataType: "json",
                success: function(data) {
                    if (data.status === "ok") {
                        $scope.updatePaymentsList();
                    }
                }
            });
        };
        $scope.payViaTab = function(resp){
            data = resp.data;
            signature = resp.signature;
            window.open("https://www.liqpay.com/api/checkout?data=" + data + "&" + "signature=" + signature);
        }
    };
    $scope.getAllPersonsFunc();
    $scope.toUser = function() {
        $location.path('/users/' + $rootScope.me.userId);
    };
    $scope.toAddEmail = function() {
        $location.path('/email-integration');
    };
    $scope.toNotification = function(){
        $location.path("notifications")
    };

    $scope.toListNotices = function() {
        $location.path('/notices');
    };
    $scope.inHover = function(){
        $scope.showHover = true;
    };
    $scope.outHover = function(){
        $scope.showHover = false;
    };
    $scope.pluginMenu = function(){
        $scope.showPluginMenu = $(".menuPlugin");
        if($scope.showPluginMenu.css('display') == 'none'){
            $($scope.showPluginMenu).slideDown();
            $('body').mouseup(function (e) {
                if ($($scope.showPluginMenu).has(e.target).length === 0) {
                    $scope.showPluginMenu.slideUp();
                    $(document).off('mouseup');
                }
            });
        }
    };
    $scope.getPlugin = function(status) {
        if (navigator.saysWho.indexOf("Chrome") != -1) {
            if(status == 'old'){
                $window.open("https://chrome.google.com/webstore/detail/recruiters-integration-to/ibfoabadoicmplbdpmchomcagkpmfama");
            }else{
                $window.open("https://chrome.google.com/webstore/detail/recruiters-integration-to/ibfoabadoicmplbdpmchomcagkpmfama");
            }
        } else if (navigator.saysWho.indexOf("Firefox") != -1) {
            //$window.open("https://addons.mozilla.org/firefox/addon/cleverstaff_extension");
            $window.open("/extension/CleverstaffExtension4Firefox.xpi");
        } else {
            $("#bad-browser-modal").modal("show");
        }
    };
    $scope.getBrowser = function() {
        if (navigator.saysWho.indexOf("Chrome") != -1) {
            return "Chrome";
        } else if (navigator.saysWho.indexOf("Firefox") != -1) {
            return "Firefox";
        } else {
            return $filter("translate")("browser");
        }
    };
    $scope.isGoodBrowser = function() {
        return scope.getBrowser() === "Chrome" || scope.getBrowser() === "Firefox";
    };
    $rootScope.updateQuestStatus = function(){
        Person.getUserPopup({
        },function(resp){
            if (resp.status == 'ok'){
                $rootScope.questStatus = resp.object;
            }else{
                notificationService.error(resp.message);
            }

        });
    };
    $rootScope.supportChat = function(){
        $scope.arrow = $("#arrowFeedback");
        if($scope.arrow.css('display') == 'none'){
            $($scope.arrow).slideDown();
            $('body').mouseup(function (e) {
                if ($($scope.arrow).has(e.target).length === 0) {
                    $scope.arrow.slideUp();
                    $(document).off('mouseup');
                }
            });
        }
        setTimeout(function(){
            $scope.arrow.slideUp();
        }, 2000);
    };
    $scope.showResponsiveNav = function(){
        var element = $('.responsive-nav');
        if($(element).css('display') == 'none'){
            element.slideToggle('slow');
            $('body').mouseup(function (e) {
                if(e.target.id != 'tech-dropdown'){
                    element.slideToggle('slow');
                    $('body').unbind('mouseup');
                }
            });
        }
    };
    var mailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
    $rootScope.login = function(){
        $rootScope.errorSignin = false;
        $rootScope.loginForm.lang = $translate.use();
        if($rootScope.loginForm.lang == 'RUS') {
            $rootScope.loginForm.lang = 'ru';
        } else if ($rootScope.loginForm.lang == 'ENG'){
            $rootScope.loginForm.lang = 'en';
        }
        $rootScope.loginForm.timeZoneOffset = new Date().getTimezoneOffset();
        if($rootScope.loginForm.password == '' || !mailPattern.test($rootScope.loginForm.login)){
            if(!mailPattern.test($rootScope.loginForm.login)){
                // notificationService.error($filter('translate')('wrong_email'));
                $rootScope.errorSignin = $filter('translate')('wrong_email');
            }else if($rootScope.loginForm.password == ''){
                // notificationService.error($filter('translate')('enter_password'));
                $rootScope.errorSignin = $filter('translate')('enter_password');
            }
        }else{
            Person.authorization($rootScope.loginForm, function(resp){
                if(resp.status == 'error'){
                    if (resp.message == 'unknownEmail') {
                        // notificationService.error($filter('translate')('unknownEmail'));'
                        $rootScope.errorSignin = $filter('translate')('unknownEmail');
                        console.log('if', $filter('translate')('unknownEmail'));
                    }else{
                        // notificationService.error(resp.message);
                        $rootScope.errorSignin = resp.message;
                    }
                }else{
                    location.reload();
                    console.log('все ОК');
                    $rootScope.errorSignin = false;
                }
            });
        }
    };
    ////////////////////////////////////////////////////////Addidng facebook SDK
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id))
            return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId="+apiKey.facebook.appId+"&version=v2.9";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    ///////////////////////////////////////////////////////End of facebook SDK
    $rootScope.loginSocial = function(social){
        googleService.signin(social);
    };
    //setTimeout(function(){
    //    $rootScope.hideContainer = true;
    //    var w = angular.element($window);
    //    console.log($rootScope.activePage);
    //    if ($rootScope.activePage == 'Candidate') {
    //        if(w.width() < 992){
    //            $rootScope.hideContainer = false;
    //            console.log('vik123');
    //        }
    //        else{
    //            $rootScope.hideContainer = true;
    //            console.log('xzm,zxm,zm,zx,mzx');
    //        }
    //    }
    //},1000);

    $rootScope.hideContainer = true;

    var w = angular.element($window);
    w.bind("resize",function(){
        if ($rootScope.activePage == 'Candidate') {
            if(w.width() < 992){
                $rootScope.hideContainer = false;
                console.log('vik123');
            } else{
                $rootScope.hideContainer = true;
                console.log('xzm,zxm,zm,zx,mzx');
            }
        }
        return  $scope.$apply();
    });

    $scope.inviteUserClientModal = function () {
        if($rootScope.hideTariff){
            $rootScope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'partials/modal/invite-new-user.html',
                size: '',
                resolve: function(){

                }
            });
            $rootScope.modalInstance.closed.then(function() {
                $rootScope.inviteUser.role = null;
                $rootScope.inviteUser.email = null;
            });
        }else{
            $rootScope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'partials/modal/block-invite-user.html',
                size: '',
                resolve: function(){

                }
            });
            $('.overModal').removeClass('overModal');
        }
    };
    $scope.integrationEmailPrompt = function(){
        $scope.showHoverEmailPrompt = true;
    };
    $scope.integrationEmailPromptHide = function(){
        $scope.showHoverEmailPrompt = false;
    };


    $scope.acceptChangesPrice = function (choice) {

        if(choice) {
            Company.setParam({
                name:"increasePrices",
                value:"Y"

            }, function (resp) {

                if(resp.status == "ok"){
                    $rootScope.closeModal();
                    $rootScope.modalInstance = undefined;
                }
            });
        } else {
            Company.setParam({
                name:"increasePrices",
                value:"Y"

            }, function (resp) {

                if(resp.status == "ok"){
                    $rootScope.closeModal();
                    $rootScope.modalInstance = undefined;
                    $location.path('/pay')
                }
            });
        }

    };


    function difBetweenDates(firstDate,secondDate){
        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds

        return Math.ceil((new Date(firstDate) - secondDate)/(oneDay));
    }


    TooltipService.createTooltips();

    if($rootScope.modalInstance){
        $rootScope.modalInstance.closed.then(function(){
            showNews()
        });
    }else{
        showNews();
    }

    function showNews(){
        News.getNews(function(resp){
            if(resp.status == 'ok'){
                var i = 0;
                if(resp.objects.length > 0){
                    setTimeout(function(){
                        var interval = setInterval(function(){
                            if(FB){
                                clearInterval(interval);
                                FB.Event.subscribe('xfbml.render', function(response) {
                                    if(response === 2){
                                        $('body').addClass('modal-open');
                                        $('body').addClass('modal-open-news');
                                        $('.modal-backdrop').css('z-index','1040');
                                        $('.modal-backdrop').css('opacity','0.5');
                                        $('.modal').css('z-index','1050');
                                        $('.modal').css('opacity','1');
                                    }
                                });

                                $rootScope.news = resp.objects;

                                $rootScope.modalInstance = $uibModal.open({
                                    animation: true,
                                    backdrop: 'static',
                                    templateUrl: 'partials/modal/newsFB.html',
                                    size: '',
                                    resolve: function(){

                                    }
                                });
                                $scope.modalInstance.opened.then(function(){
                                    $('body').removeClass('modal-open');
                                    $('.modal-backdrop').css('z-index', '0');
                                    $('.modal-backdrop').css('opacity', '0');
                                    $('.modal').css('z-index', '0');
                                    $('.modal').css('opacity', '0');
                                    $timeout(()=> {
                                        FB.XFBML.parse();
                                    }, 3000);
                                });
                                $rootScope.modalInstance.closed.then(function() {
                                    $('body').removeClass('modal-open-news');
                                    var array = [];
                                    angular.forEach($rootScope.news, function(data,key){
                                        array.push(data);
                                    });
                                    News.setNewsAsViewed({
                                        postsIds: array
                                    },function(res){
                                        if(res.status == 'ok'){

                                        }else{
                                            notificationService.error(res.message);
                                        }
                                    });
                                });
                            }
                        },5)
                    },0)
                }
            }
        });
    }

    function setDefualtValueRegionSelect(){
        var optionsHtml = `<option ng-selected="true" value="" selected style="color:#999">${$scope.translate}</option>`;
        let region = JSON.parse(localStorage.getItem(`ls.${$rootScope.userId}_regionId`));
        console.log(region, 'region');
        angular.forEach($scope.regions, function (value) {
            if(region && region.value === value["value"]){
                optionsHtml += "<option style='color: #000000' selected  value='" + (value.id).replace(/\'/gi,"") + "'>" + value.name + "</option>";
            }else{
                optionsHtml += "<option style='color: #000000'  value='" + (value.id).replace(/\'/gi,"") + "'>" + value.name + "</option>";
            }
        });

        $('#cs-region-filter-select-scope').html(optionsHtml);
        $('.cs-region-filter-select-scope2').html(optionsHtml);
    }

    $scope.dataChangeScopeAccount = ScopeService.dataChangeScopeAccount;

}
controller.controller('NavbarController', ["$q", "Vacancy", "serverAddress", "notificationService", "$scope", "tmhDynamicLocale", "$http", "Person", "$rootScope",
    "Service", "$route", "$window", "$location", "$filter", "$sce", "$cookies", "localStorageService", "$localStorage", "$timeout", "CheckAccess", "frontMode",
    "$translate", "Client", 'ScopeService', 'googleService', 'Company', '$uibModal', 'Notice', 'Pay', 'News', 'TooltipService', 'Account', 'googleService',navBarController]);