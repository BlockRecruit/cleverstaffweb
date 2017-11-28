'use strict';

/* Controllers */

var controller = angular.module('RecruitingAppStart.controllers', [])
    .controller('mainController', function ($scope, $location, $window)
{
    $scope.toSignUp = function () {
        $location.path("/registration/");
        $("#signUpButtonDiv").hide();
        $("#signInButtonDiv").show();
    };
    $scope.toSingIn = function () {
        $location.path('/');
        $("#signInButtonDiv").hide();
        $("#signUpButtonDiv").show();
    };
    $scope.toLanding = function () {
        $window.location.href = '/';
    };
}).controller('StartController', ['$scope', 'Person', '$location', '$window', '$cookies', function ($scope, $aut, $location, $window, $cookies) {
    $("#signInButtonDiv").hide();
    $("#signUpButtonDiv").hide();
    $scope.showAuthorization = true;
    $scope.authorization = {
        email: "",
        password: ""
    };

    $aut.getMe(function (data) {
        if (!angular.equals(data.status, "error")) {
            $cookies.cfauth = 'true';
            if ($cookies.url === undefined || $cookies.url === ''
                || $cookies.url === '/') {
                $window.location.replace('hdemo.html#/activity');
            } else {
                var url = $cookies.url;
                $cookies.url = undefined;
                $window.location.replace('hdemo.html#' + url);
            }
        }
    });
    $aut.authorization({login: 'demo', password: 'demo', lang: 'ru'},
        function success(data) {
            if (data.status !== undefined && angular.equals(data.status, "error")) {
                $scope.errorMessage = data.message;
            } else {
                if ($cookies.url === undefined || $cookies.url === '' || $cookies.url === '/') {
                    $window.location.replace('hdemo.html#/activity');
                } else {
                    var url = $cookies.url;
                    $cookies.url = undefined;
                    $window.location.replace('hdemo.html#' + url);
                }
            }
        },
        function error(data) {
            $scope.errorMessage = "Service is temporarily unavailable";
        });

}]).controller('PublicVacancyController', function ($rootScope, $scope, $filter, $location, $routeParams, $sce, $translate, Service, notificationService, FileInit, serverAddress) {
    $("#signUpButtonDiv").hide();
    $("#signInButtonDiv").hide();
    $scope.message = 'def';
    $rootScope.header = "two";
    $scope.serverAddress = serverAddress;
    $scope.request = {
        name: null,
        lastName: null,
        phone: null,
        message: null,
        vacancyId: $scope.vacancyId,
        fileId: null
    };
        $.getScript("https://platform.linkedin.com/in.js?async=true", function success() {
            IN.init({
                api_key: apiKey.linkedIn.api_key,
                scope: "r_emailaddress w_share"
            });
        });
        $.getScript('//connect.facebook.net/en_UK/all.js', function() {
            FB.init({
                appId: apiKey.facebook.appId,
                version: 'v2.9'
            });
        });


        $scope.share = function(sourse) {
            if ($scope.companyLogo != undefined && $scope.companyLogo !== '') {
                $scope.publicImgLink = $location.$$protocol + "://" + $location.$$host + $scope.serverAddress + '/getlogo?id=' + $scope.companyLogo;
            } else {
                $scope.publicImgLink = "https://cleverstaff.net/img/logo2_small.png";
            }
            var link = $location.$$protocol + "://" + $location.$$host + "/i#/pv/" + $scope.vacancy.localId;
            $scope.publicDescr = '';

            if ($scope.serverAddress === '/hrdemo') {
                link = $location.$$protocol + "://" + $location.$$host + "/di#/pv/" + $scope.vacancy.localId;
            }

            angular.forEach(angular.element($scope.vacancy.descr).text().replace("\r\n", "\n").split("\n"), function(val) {
                if (val !== undefined && val !== '') {
                    $scope.publicDescr += val + " ";
                }
            });

            if (sourse === 'linkedin') {
                if (!IN.User.isAuthorized()) {
                    IN.User.authorize(function() {
                        IN.API.Raw("/people/~/shares")
                            .method("POST")
                            .body(JSON.stringify({
                                "content": {
                                    "submitted-url": link,
                                    "title": $scope.vacancy.position,
                                    "description": $scope.publicDescr,
                                    "submitted-image-url": $scope.publicImgLink
                                },
                                "visibility": {
                                    "code": "anyone"
                                },
                                "comment": ''
                            }))
                            .result(function(r) {
                                notificationService.success($filter('translate')('Vacancy posted on your LinkedIn'));
                                $scope.addPublish('linkedin');
                                autoRefreshIN();
                            })
                            .error(function(r) {
                                notificationService.error(r.message);
                            });
                    }, "w_share");
                } else {
                    IN.API.Raw("/people/~/shares")
                        .method("POST")
                        .body(JSON.stringify({
                            "content": {
                                "submitted-url": link,
                                "title": $scope.vacancy.position,
                                "description": $scope.publicDescr,
                                "submitted-image-url": $scope.publicImgLink
                            },
                            "visibility": {
                                "code": "anyone"
                            },
                            "comment": ""
                        }))
                        .result(function(r) {
                            notificationService.success($filter('translate')('Vacancy posted on your LinkedIn'));
                            $scope.addPublish('linkedin');
                            autoRefreshIN();
                        })
                        .error(function(r) {
                            notificationService.error(r.message);
                        });
                }
            }
            if (sourse === 'facebook') {
                FB.getLoginStatus(function(response) {
                    console.log(response, 'response');
                    if (response.status === 'connected') {
                        FB.ui({
                                method: 'feed',
                                name: $scope.vacancy.position,
                                caption: '',
                                description: $scope.publicDescr,
                                link: link,
                                picture: $scope.publicImgLink
                            },
                            function(response) {
                                if (response && response.post_id) {
                                    notificationService.success($filter('translate')('Vacancy posted on your Facebook'));
                                    $scope.addPublish('facebook');
                                } else {
                                    notificationService.error($filter('translate')('Vacancy hasn\'t shared'));
                                }
                            });
                    }
                    else {
                        FB.login(function() {
                            FB.ui({
                                    method: 'feed',
                                    name: $scope.vacancy.position,
                                    caption: '',
                                    description: $scope.publicDescr,
                                    link: link,
                                    picture: $scope.publicImgLink
                                },
                                function(response) {
                                    if (response && response.post_id) {
                                        notificationSecvice.success($filter('translate')('Vacancy posted on your Facebook'));
                                    } else {
                                        notificationService.error($filter('translate')('Vacancy hasn\'t shared'));
                                    }
                                });
                        });
                    }
                });
            }
        };

    $scope.addRecallFromLinkedIn = function () {
        IN.User.authorize(function () {
            IN.API.Profile("me").fields(["first-name", "last-name" , "email-address", "phone-numbers","bound-account-types", "headline", "summary", "specialties", "positions", "educations"]).result(function (me) {
                parseLinkedInInformationForRecall(me, $scope)
            });
        });
    };
    $scope.show = true;
    FileInit.initFileOption($scope, "public", {allowedType: ["docx", "doc", "pdf", "odt"], maxSize: 5242880},$filter);
    $scope.filesForRecall = [];
    $scope.callbackFile = function (var1, var2) {
        $scope.message = 'def';
        $scope.filesForRecall.push({name: var2, attId: var1})
    };
    $scope.callbackFileError = function () {
        $scope.message = 'error_file';
    };
    Service.publicVacancy({id: $routeParams.vacancyId, host : document.referrer}, function (resp) {
        if (resp.status && resp.status === 'error' && resp.message) {
            $scope.vacancyFound = false;
        } else {
            $scope.vacancyId = resp.object.vacancyId;
            $scope.request.vacancyId = resp.object.vacancyId;
            $rootScope.title = resp.object.position + "- " + $filter('translate')('vacancy_in') + " CleverStaff";
            $rootScope.vacancyName = resp.object.position;
            if (resp.object.region != undefined) {
                $rootScope.region = resp.object.region.fullName;
            }
            $scope.vacancy = resp.object;
            $scope.vacancyFound = true;
            $location.hash($filter('transliteration')(resp.object.position.replace(/\s/g, '_'))).replace();

            Service.getOrgLogoId({orgId : resp.object.orgId}, function(logoResp) {
                if (logoResp.status && logoResp.status === 'ok') {
                    $scope.companyLogo = logoResp.object;
                }
            });
        }
    }, function () {
        console.log(true);
    });
    $scope.to_trusted = function (html_code) {
        return $sce.trustAsHtml(html_code);
    };
    $scope.removeFile = function (id) {
        angular.forEach($scope.filesForRecall, function (val, ind) {
            if (val.attId == id) {
                $scope.filesForRecall.splice(ind, 1);
            }
        });
    };
    $scope.showErrorEmailMessage = false;
    $('#email2').on('input', function () {
        $scope.request.email = $(this).val();
        $scope.changeEmail();
        $scope.$apply();
    });
    $scope.showErrorPhoneMessage=false;
    $('#phone').on('input', function () {
        console.log(true);
        $scope.showErrorPhoneMessage=false;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    });
    $scope.changeEmail = function () {
        if ($scope.request.email == undefined) {
            $scope.showErrorEmailMessage = true;
        } else if ($scope.request.email.length == 0) {
            $scope.showErrorEmailMessage = true;
        } else {
            $scope.showErrorEmailMessage = false;
        }
    };
    $scope.changePhone = function () {
        $scope.recallForm.phone.$invalid = false;
    };
    $scope.sendRequest = function () {
        console.log($scope.recallForm,'123213');
        if ($scope.recallForm.$valid) {
            if ($scope.request.email != undefined && $scope.request.email.length == 0) {
                $scope.request.email = "";
            }
            if (validEmail($scope.request.email)) {
                $scope.showErrorEmailMessage = true;
                return;
            }
            if ($scope.filesForRecall.length != 0) {
                angular.forEach($scope.filesForRecall, function (resp) {
                    delete resp.$$hashKey;
                });
                $scope.request.fileId = JSON.stringify($scope.filesForRecall);
            }
            if ($scope.request.message != undefined && $scope.request.message.length == 0) {
                $scope.request.message = "";
            } else if ($scope.request.message == undefined) {
                $scope.request.message = "";
            }
            $scope.request.lang = $translate.use();
            $scope.request.email = $('#email2').val();
            var replacedPhone = $scope.request.phone.replace(/(\+)|(\()|(\))|(\-)|(\s)/g, '');
            if ($scope.request.phone == undefined || replacedPhone.match(/[0-9_-]{10}/) == null) {
                $scope.showErrorPhoneMessage=true;
                return false;
            }
            Service.addCandidate($scope.request, function (resp) {
                if (resp.status && resp.status === 'error' && resp.message) {
                    $scope.message = "error";
                } else {
                    $scope.message = "success";
                    $scope.request = {
                        name: "",
                        lastName: "",
                        phone: "",
                        message: "",
                        vacancyId: $scope.vacancyId,
                        fileId: null
                    };
                    $("#email2").val("");
                    $scope.filesForRecall = [];
                    $scope.recallForm.name.$pristine = true;
                    $scope.recallForm.last_name.$pristine = true;
                    $scope.recallForm.phone.$pristine = true;
                    $scope.recallForm.phone.$invalid = false;
                }

            }, function (resp) {
                $scope.message = "error";
            });

        } else {

            $scope.recallForm.name.$pristine = false;
            $scope.recallForm.last_name.$pristine = false;
            if (validEmail($scope.request.email)) {
                console.log(false);
                $scope.showErrorEmailMessage = true;
            }
            $scope.recallForm.phone.$pristine = false;

        }
    };

});


function validEmail(email, notificationService) {
    if (email == undefined) return;
    var r = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi;
    return !email.match(r);
}
