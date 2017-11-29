controller.controller('ActivityCompanySettingsController', ["$scope", "$rootScope", "$routeParams", "Service", "Person", "Company", "notificationService", "$filter", "$translate",
    "Vacancy", "$location", "$uibModal", function($scope, $rootScope, $routeParams, Service, Person, Company, notificationService, $filter, $translate, Vacancy, $location, $uibModal) {

    $scope.showHistory = true;
    $scope.facebookAppId = facebookAppId;
    $scope.loading = true;
    $scope.showChangeOrgName = false;
    $rootScope.closeModal = function(){
        $scope.modalInstance.close();
    };
    listenerForScopeLight($scope, $rootScope);

    $scope.callbackAddLogo = function(photo) {
        $rootScope.companyLogo = photo;
        $rootScope.logoLink = $scope.serverAddress + "/getapp?id=" + $rootScope.companyLogo + "&d=true";
    };

    $scope.callbackErr = function(err) {
        notificationService.error(err);
    };

    $scope.newOrgName = $rootScope.me.orgName;

    $scope.showChangeUserOrgName = function() {
        $scope.showChangeOrgName = true;
        $scope.newOrgName = $rootScope.me.orgName;
    };

    $scope.changeOrgName = function() {
        Person.changeOrgName({orgName: $scope.newOrgName, lang: $rootScope.currentLang}, function(resp) {
            if (resp.status && angular.equals(resp.status, "error")) {
                notificationService.error(resp.message);
            } else {
                //notificationService.success($filter('translate')('You changed company name'));
                $rootScope.me.orgName = $scope.newOrgName;
                $scope.showChangeOrgName = false;
                angular.forEach($rootScope.me.orgs, function(org) {
                    if (org.orgId == $rootScope.me.orgId) {
                        org.orgName = $scope.newOrgName;
                    }
                });
                angular.forEach($rootScope.orgs, function(org) {
                    if (org.orgId == $rootScope.me.orgId) {
                        org.orgName = $scope.newOrgName;
                    }
                });

                //$scope.getLastEvent();

            }
        }, function() {
            //notificationService.error($filter('translate')('service temporarily unvailable'));
        });
    };
    Vacancy.getVacancyExampleForLogoDemo(function (resp) {
        if (angular.equals(resp.status, "ok") && resp.object.localId != undefined) {
            console.log(resp);
            if ($rootScope.frontMode == 'war') {
                $scope.publicLink = $location.$$protocol + "://" + $location.$$host + "/i#/pv/" + resp.object.localId;
            } else {
                $scope.publicLink = $location.$$protocol + "://" + $location.$$host + "/di#/pv/" + resp.object.localId;
            }

        }
    });
    $scope.updateFBpages = function(){
        Company.orgPages(function(resp){
            $rootScope.fbPages = resp.objects;
            for (var i = $rootScope.fbPages.length - 1; i >= 0; i--) {
                if ($rootScope.fbPages[i].status === 'D') {
                    $rootScope.fbPages.splice(i, 1);
                }
            }
        });
    };
    $scope.updateFBpages();
    $scope.addFacebookTabInCs = function (){
        FB.ui({
            method: 'pagetab',
            redirect_uri: 'https://www.facebook.com/dialog/pagetab?app_id=579184295576444'
        }, function(response){
            if(response === undefined){
                //notificationService.error($filter('translate')('To_add_a_page_that_has_already_been_created_Jobs_tab_you_need_to_remove_it_on_your_Facebook_page'));
            }else{
                $scope.FBpagesId = Object.keys(response.tabs_added);
                checkFbAuth();
            }
        });
        function checkFbAuth(){
            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    var uid = response.authResponse.userID;
                    var accessToken = response.authResponse.accessToken;
                } else if (response.status === 'not_authorized') {
                    FB.login(function(response) {
                        checkFbAuth();
                        // Original FB.login code
                    });
                    // the user is logged in to Facebook,
                    // but has not authenticated your app
                } else {
                    // the user isn't logged in to Facebook.
                    FB.login(function(response) {
                        checkFbAuth();
                        // Original FB.login code
                    });
                }
                if(accessToken){
                    angular.forEach($scope.FBpagesId,function(data,key){
                        FB.api(
                            data,{accessToken: accessToken},
                            function (response1) {
                                if (response1 && !response1.error) {
                                    Company.addFacebookPage({
                                        facebookPageId: data,
                                        name : response1.name
                                    }, function(resp){
                                        if(resp.status == 'ok'){
                                            function facebooklogout() {
                                                FB.logout(function (response) {
                                                    }
                                                )
                                            }
                                            $scope.updateFBpages();
                                        }
                                    });
                                }
                            }
                        );
                    });
                }
            });
        }
    };
    $rootScope.showDeleteFbPagesOnCompany = function (tab) {
        $scope.deletedTabCompany = tab;
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '../partials/modal/company-settings-remove-fb-tab.html',
            resolve: {

            }
        });
    };
    $rootScope.deleteTabOnFacebook = function(){
        Company.deleteFacebookPage({
            facebookPageId: $scope.deletedTabCompany.facebookPageId
        }, function(resp){
            if(resp.status == 'ok'){
                $scope.updateFBpages();
                $rootScope.closeModal();
            }else{
                notificationService.error(resp.message);
            }
        });
    };
    $.getScript('//connect.facebook.net/en_UK/all.js', function() {
        FB.init({
            appId: apiKey.facebook.appId,
            version: 'v2.9'
        });
        if(getUrlVars($location.$$absUrl).q1){
            $('.showNotHaveIntegration.modal').modal('hide');
            $scope.addFacebookTabInCs();
        }
    });
    $scope.showModalCompanyLogo = function(){
        $('.showImgCompany.modal').modal('show');
    };
    $scope.getLinkCompanyPage = function(name){
        Company.getParam({
            name: name
        }, function(resp){
            if(resp.status == 'ok'){
                if(name == 'companyWebSite'){
                    $scope.changeWebSite = resp.object;
                }else{
                    $scope.changeFacebookPage = resp.object;
                }
            }else{
                notificationService.error(resp.message);
            }
        });
    };
    $scope.getLinkCompanyPage('companyWebSite');
    $scope.getLinkCompanyPage('companyFacebookPage');
    $scope.showCompanyWebSite = true;
    $scope.showCompanyFacebookPage = true;
    $scope.setChangeCompanyWebSite = function(name){
        if($scope.changeWebSite.indexOf('http://') > -1 || $scope.changeWebSite.indexOf('https://') > -1 || $scope.changeWebSite.length == 0){
            Company.setParam({
                name: name,
                value: name == 'companyWebSite' ? $scope.changeWebSite : $scope.changeFacebookPage
            }, function(resp){
                if(resp.status == 'ok'){
                    if($scope.changeFacebookPage.length > 0) {
                        notificationService.success($filter('translate')("save_link"));
                    } else {
                        notificationService.success($filter('translate')("remove_link"));
                    }
                    $scope.showCompanyWebSite = true;
                    $scope.showCompanyFacebookPage = true;
                }else{
                    notificationService.error(resp.message);
                }
            });
        }else{
            notificationService.error($filter('translate')("enter the link http"));
        }
    };
    $scope.setChangeUserWebSite = function(name){
        if($scope.changeFacebookPage.indexOf('http://') > -1 || $scope.changeFacebookPage.indexOf('https://') > -1 || $scope.changeFacebookPage.length == 0){
            Company.setParam({
                name: name,
                value: name == 'companyWebSite' ? $scope.changeWebSite : $scope.changeFacebookPage
            }, function(resp){
                if(resp.status == 'ok'){
                    if($scope.changeFacebookPage.length > 0) {
                        notificationService.success($filter('translate')("save_link"));
                    } else {
                        notificationService.success($filter('translate')("remove_link"));
                    }
                    $scope.showCompanyWebSite = true;
                    $scope.showCompanyFacebookPage = true;
                }else{
                    notificationService.error(resp.message);
                }
            });
        }else{
            notificationService.error($filter('translate')("enter the link http"));
        }
    };
    $scope.showInputForChangeWebSite = function(){
        $scope.showCompanyWebSite = false;
    };
    $scope.showInputForChangeFacebookPage = function(){
        $scope.showCompanyFacebookPage = false;
    };
}]);
