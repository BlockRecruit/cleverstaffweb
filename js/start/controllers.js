'use strict';

/* Controllers */

var controller = angular.module('RecruitingAppStart.controllers', []);

controller.controller('mainController' ,function($scope, $location, $window) {
    $scope.toSignUp = function() {
        $location.path("/registration/");
        $("#signUpButtonDiv").hide();
        $("#signInButtonDiv").show();
    };
    $scope.toSingIn = function() {
        $location.path('/');
        $("#signInButtonDiv").hide();
        $("#signUpButtonDiv").show();
    };
    $scope.toLanding = function() {
        $window.location.href = '/';
    };
})
    .controller('test_redirect_controller', function($location) {
        window.location.replace($location.$$protocol + "://" + $location.$$host)

    })
    .controller('ConfirmController', function($scope, $translate, $location, $routeParams, Person, notificationService, $window) {
        var lang = localStorage.getItem("NG_TRANSLATE_LANG_KEY") ? localStorage.getItem("NG_TRANSLATE_LANG_KEY") : "en";
        Person.finishReg({
            personId: $routeParams.personId,
            key: $routeParams.key,
            timeZoneOffset: new Date().getTimezoneOffset(),
            lang: lang
        }, function(resp) {
            if (resp.status && resp.status === 'error' && resp.message) {
                $("#confirmRegistrationFailReconfirmation").css('display', 'block');
                var userLang = localStorage.getItem("NG_TRANSLATE_LANG_KEY");

                if (userLang == "ru") {
                    $("#confirmRegistrationFailReconfirmation_ru").css('display', 'block');
                } else if (userLang == "ua") {
                    $("#confirmRegistrationFailReconfirmation_ua").css('display', 'block');
                } else {
                    $("#confirmRegistrationFailReconfirmation_en").css('display', 'block');
                }
            } else {
                notificationService.success("success");
                $window.location.replace('!#/organizer');
            }
        }, function(resp) {
            notificationService.error('Service is temporarily unavailable');
        });
    })
    .controller('InController', function($scope, $translate, $location, $routeParams, Person, notificationService, $window) {
        Person.getMe(function(resp) {
            if (resp.personId) {
                localStorage.setItem("link_redirect", window.location.hash);
                if(localStorage.getItem("NG_TRANSLATE_LANG_KEY") == 'ru'){
                    $window.location.replace('/ru/signin.html');
                }else{
                    $window.location.replace('/signin.html');
                }
            } else {
                $scope.in();
            }
        }, function(resp) {
            $scope.in();
        });

        $scope.in = function() {
            var lang = localStorage.getItem("NG_TRANSLATE_LANG_KEY") ? localStorage.getItem("NG_TRANSLATE_LANG_KEY") : "en";
            Person.in({
                personId: $routeParams.id,
                key: $routeParams.key,
                lang: lang,
                timeZoneOffset: new Date().getTimezoneOffset()
            }, function(resp) {
                if (resp.personId) {
                    $window.location.replace('/!#/organizer');
                } else {
                    $window.location.replace('/');
                }
            }, function(resp) {
                $window.location.replace('/');
            });
        }
    })
    .controller('RestorePasswordController', function($scope, $rootScope, $filter, $translate, $location, $routeParams, Person, notificationService, $window) {
        Person.checkKey({name: "forgotPasswordKey", id: $routeParams.id, key: $routeParams.key}, function(resp){
            if (resp && resp.status == "ok") {
                $scope.showRestoreForm = true;
            } else if (resp && resp.status == "error") {
                $scope.showRestoreForm = false;
            }
        }, function (resp) {
            $location.path("/");
        });
        //$rootScope.title = $filter('translate')('Change Password') + " | CleverStaff";
        var messages = {
            enter_password: "Пожалуйста введите пароль",
            wrong1_password: "Пароль должен содержать только цифры и латинские буквы",
            wrong2_password: "Пароль должен содержать хотя бы одну латинскую букву",
            wrong3_password: "Пароль должен содержать хотя бы одну цифру",
            wrong4_password: "Пароль должен быть длиной 8-30 символов",
            wrong_password2: "Пароль не совпадает с предыдущим"
        };
        $.fn.form.settings.rules.password1 = function(value) {
            var password1 = /^[a-zA-Z0-9]{0,99}$/;
            return password1.test(value);
        };
        $.fn.form.settings.rules.password2 = function(value) {
            var password2 = /.*[a-zA-Z].*/;
            return password2.test(value);
        };
        $.fn.form.settings.rules.password3 = function(value) {
            var password3 = /.*\d.*/;
            return password3.test(value);
        };
        $.fn.form.settings.rules.password4 = function(value) {
            return (value.length > 7 && value.length < 31);
        };
        $.fn.serializeObject = function() {
            var o = {};
            var a = this.serializeArray();
            $.each(a, function() {
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        };
        //var rules = {
        //    password: {
        //        identifier: 'password',
        //        rules: [
        //            {
        //                type: 'empty',
        //                prompt: $filter('translate')('Please enter your password')
        //            },
        //            {
        //                type: 'password1',
        //                prompt: $filter('translate')('Password should contain only numbers and latin letters')
        //            },
        //            {
        //                type: 'password2',
        //                prompt: $filter('translate')('Password should contain at least one latin letter')
        //            },
        //            {
        //                type: 'password3',
        //                prompt: $filter('translate')('Password should contain at least one number')
        //            },
        //            {
        //                type: 'password4',
        //                prompt: $filter('translate')('Password must be 8-30 characters long')
        //            }
        //        ]
        //    },
        //    password2: {
        //        identifier: 'password2',
        //        rules: [
        //            {
        //                type: 'match[password]',
        //                prompt: $filter('translate')("The password doesn't match to previous")
        //            }
        //        ]
        //    }
        //};
        //var events = {
        //    inline: true,
        //    on: 'blur',
        //    onSuccess: restoreForm
        //};
        //$('#signup').form(rules, events);
        //
        //function restoreForm() {
        //}
        //
        //$("form").submit(function() {
        //    return false;
        //});

        $scope.resetError = function(){
            $('#password').removeClass('error');
            $scope.showError = false;
        };
        $scope.restore = function() {
            $scope.resetError();
            var password1 = /^[a-zA-Z0-9!,.?%$#@*_\-+=\\|/[\]{}()]{8,30}$/;
            var password2 = /.*[a-zA-Z].*/;
            var password3 = /.*\d.*/;
            var checkpassword1 = password1.test($scope.password);
            var checkpassword2 = password2.test($scope.password);
            var checkpassword3 = password3.test($scope.password);
            if($scope.password){
                var checkpassword4 = $scope.password.length > 7 && $scope.password.length < 31;
            }
            if ($scope.password == $scope.password2 && $scope.restoreForm.$valid) {
                Person.changePasswordByKey({
                    personId: $routeParams.id,
                    key: $routeParams.key,
                    newPass: $scope.password,
                    lang: $translate.use()
                }, function(resp) {
                    if (resp.personId) {
                        $window.location.replace('!#/organizer');
                    } else {
                        if (resp.message) {
                            if (resp.message.trim() == 'Incorrect confirm key' || resp.message.trim() == 'Неверный код подтверждения' || resp.message.trim() == 'Неправильний код підтвердження') {
                                notificationService.error($filter('translate')('You have already changed the password on this special link. For safety reasons it can not be done enough on this link. Please ask for a password reset again on') + "   <a href=\"https://cleverstaff.net?q=restore\">https://cleverstaff.net?q=restore</a>");
                            } else {
                                notificationService.error(resp.message);
                            }

                        }
                    }
                }, function(resp) {
                    if (resp.message) {
                        notificationService.error(resp.message);
                    }

                });
            }else{
                if($scope.password){
                    if($scope.password.length == 0){
                        notificationService.error($filter('translate')('enter_password'));
                        $scope.showError = true;
                        $scope.showErrorGoodSuccess = false;
                        $scope.showErrorEnterPassword = false;
                        $scope.showErrorEnterNumber = false;
                        $scope.showErrorEnterLatin = false;
                        $scope.showErrorEnterNumberCharacters = false;
                        $scope.showErrorEnterLatinCharacters = false;
                        $('#password').addClass('error');
                    }
                    if(!checkpassword3 && !checkpassword4){
                        $scope.errorMessage = $filter('translate')('Password must be 8-30 characters long');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterNumberCharacters = true;
                        $scope.showErrorEnterNumber = false;
                        $scope.showErrorGoodSuccess = false;
                        $scope.showErrorEnterLatin = false;
                        $scope.showErrorEnterPassword = false;
                        return false;
                    } else if(!checkpassword2 && !checkpassword4){
                        console.log(!checkpassword2);
                        console.log(!checkpassword4);
                        $scope.errorMessage = $filter('translate')('Password must be 8-30 characters long');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterLatinCharacters = true;
                        $scope.showErrorEnterNumberCharacters = false;
                        $scope.showErrorEnterLatin = false;
                        $scope.showErrorGoodSuccess = false;
                        $scope.showErrorEnterPassword = false;
                        return false;
                    } else if(!checkpassword1 && !checkpassword4){
                        console.log(!checkpassword1);
                        console.log(!checkpassword4);
                        $scope.errorMessage = $filter('translate')('Password must be 8-30 characters long');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterCharacters = true;
                        $scope.showErrorEnterLatin = false;
                        $scope.showErrorEnterLatinCharacters = false;
                        $scope.showErrorGoodSuccess = false;
                        $scope.showErrorEnterPassword = false;
                        return false;
                    } else if(!checkpassword2){
                        $('#password').addClass('error');
                        $scope.errorMessage = $filter('translate')('Password should contain at least one latin letter');
                        console.log('qwerty');
                        $scope.showError = true;
                        $scope.showErrorEnterLatin = true;
                        $scope.showErrorEnterNumber = false;
                        $scope.showErrorEnterCharacters = false;
                        $scope.showErrorEnterNumberCharacters = false;
                        $scope.showErrorEnterLatinCharacters = false;
                        $scope.showErrorEnterPassword = false;
                        return false;
                    } else if(!checkpassword3){
                        $scope.errorMessage = $filter('translate')('Password should contain at least one number');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterNumber = true;
                        $scope.showErrorEnterLatin = false;
                        $scope.showErrorEnterCharacters = false;
                        $scope.showErrorEnterNumberCharacters = false;
                        $scope.showErrorEnterLatinCharacters = false;
                        $scope.showErrorEnterPassword = false;
                        return false;
                    } else if(!checkpassword4){
                        $scope.errorMessage = $filter('translate')('Password must be 8-30 characters long');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterPassword = false;
                        return false;
                    } else if(!checkpassword1){
                        $scope.errorMessage = $filter('translate')('Password should contain only numbers and latin letters, allowed characters: !,.?%$#@*_-+=\\|/[]{}()');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        return false;
                    }
                    if($scope.password.length > 0){
                        $scope.showErrorGoodSuccess = true;
                    }
                }else{
                    notificationService.error($filter('translate')('enter_password'));
                    $scope.showError = true;
                    $scope.showErrorGoodSuccess = false;
                    $scope.showErrorEnterPassword = false;
                    $scope.showErrorEnterNumber = false;
                    $scope.showErrorEnterLatin = false;
                    $scope.showErrorEnterNumberCharacters = false;
                    $scope.showErrorEnterLatinCharacters = false;
                    $('#password').addClass('error');
                }
                if($scope.password != $scope.password2){
                    notificationService.error($filter('translate')('wrong_password2'));
                    $scope.showErrorEnterPassword = false;
                    $scope.showErrorEnterNumber = false;
                    $scope.showErrorEnterCharacters = false;
                    $scope.showErrorEnterLatin = false;
                    $scope.showErrorEnterNumberCharacters = false;
                    $scope.showErrorEnterLatinCharacters = false;
                    //$scope.showErrorGoodSuccess = true;
                }else{
                    console.log('form is not valid')
                }
            }
        }
    })
    .controller('SignupController', function($scope, $rootScope, $filter, $location, $translate, $cookies, Person, notificationService, $window) {
        $rootScope.title = $filter('translate')('Sign Up') + " | CleverStaff";


      $("#signUpButtonDiv").hide();
        $("#signInButtonDiv").show();
        $scope.key = $location.search().key;
        $scope.registration = {};
      Person.inviteInfo({inviteKey: $scope.key}, function(resp) {
            if (resp.status && resp.status === 'error' && resp.message) {
                $rootScope.inviteState = resp.code;
                $scope.redirectToSigning = function () {
                    if(localStorage.getItem("NG_TRANSLATE_LANG_KEY") == 'ru'){
                        $window.location.replace('/ru/signin.html');
                    }else{
                        $window.location.replace('/signin.html');
                    }
                };
            } else {
                $scope.info = resp;
                $scope.registration.login = $scope.info.email;
                $scope.registration.orgName = $scope.info.orgName;
                $scope.registration.inviteKey = $scope.key;
                $scope.registration.inviter = $scope.info.inviter;
                $scope.registration.role = $scope.info.role;
              $rootScope.inviteState = 'activeInvite';
            }
        }, function(resp) {
            $location.path("/");
            notificationService.error('Service is temporarily unavailable');
        });
         $scope.resetError = function(){
            $('#firstName').removeClass('error');
             $('#password').removeClass('error');
            $scope.showError = false;
        };
        $scope.ngClickRegistration = function() {
            $scope.resetError();
            var password1 = /^[a-zA-Z0-9!,.?%$#@*_\-+=\\|/[\]{}()]{8,30}$/;
            var password2 = /.*[a-zA-Z].*/;
            var password3 = /.*\d.*/;
            var checkpassword1 = password1.test($scope.password);
            var checkpassword2 = password2.test($scope.password);
            var checkpassword3 = password3.test($scope.password);
            if($scope.password){
                var checkpassword4 = $scope.password.length > 7 && $scope.password.length < 31;
            }
            if ($scope.password == $scope.password2 && $scope.registration.firstName && $scope.registration.phone && $scope.registrationForm.$valid  && (checkpassword1 && checkpassword2 && checkpassword3 && checkpassword4)) {
                $scope.registration.password = $scope.password;
                if($scope.registration.phone == null){
                    $scope.registration.phone = $('.select2-selection__rendered')[0].title.replace(/[A-z]/g, "").replace(/\(*\)*\+*\.*\s*/g,"").replace(/,/g,"") + $scope.registration.phone;
                }else{
                    $scope.registration.phone = $("#countryCustom").text(localStorage.getItem('phone').replace(/-/g,"") + $scope.registration.phone)[0].textContent;
                }
                if(localStorage.getItem("NG_TRANSLATE_LANG_KEY") == 'ru'){
                    $scope.registration.lang = 'ru';
                }else{
                    $scope.registration.lang = 'en';
                }
                console.log('here');
                $rootScope.loading = true;
                Person.joinInvited($scope.registration, function(resp) {
                    if (resp.status && resp.status === 'error' && resp.message) {
                        $rootScope.loading = false;
                        notificationService.error(resp.message);
                    } else {
                        Person.authorization({
                            login: $scope.registration.login,
                            password: $scope.registration.password,
                            lang: $translate.use(),
                            timeZoneOffset: new Date().getTimezoneOffset()
                        }, function(resp) {
                            $rootScope.loading = false;
                            if (resp.object.personId) {
                                localStorage.removeItem('phone');
                                $window.location.replace('!#/organizer');
                            } else {
                                if (resp.message) {
                                    if (resp.message.trim() == 'Incorrect confirm key' || resp.message.trim() == 'Неверный код подтверждения' || resp.message.trim() == 'Неправильний код підтвердження') {
                                        notificationService.error($filter('translate')('You have already changed the password on this special link. For safety reasons it can not be done enough on this link. Please ask for a password reset again on') + "   <a href=\"https://cleverstaff.net?q=restore\">https://cleverstaff.net?q=restore</a>");
                                    } else {
                                        notificationService.error(resp.message);
                                    }

                                }
                            }
                        }, function(resp) {
                            $rootScope.loading = false;
                            if (resp.message) {
                                notificationService.error(resp.message);
                            }

                        });
                    }
                })
            }else{
                if ($scope.registration.firstName){
                    if ($scope.registration.firstName.length == 0){
                        $scope.errorMessage = $filter('translate')('wrong_name');
                        $scope.showErrorName = true;
                        $scope.showError = false;
                        $scope.showErrorPhone = false;
                        $('#firstName').addClass('error');
                        return false;
                    }
                }else{
                    $scope.errorMessage = $filter('translate')('wrong_name');
                    $scope.showErrorName = true;
                    $scope.showError = false;
                    $scope.showErrorPhone = false;
                    $('#firstName').addClass('error');
                    return false;
                }
                if ($scope.registration.phone){
                    $('#phone').removeClass('error');
                    if ($scope.registration.phone.length == 0){
                        $scope.errorMessage = $filter('translate')('enter_phone');
                        $scope.showErrorPhone = true;
                        $scope.showErrorName = false;
                        $scope.showError = false;
                        $('#phone').addClass('error');
                        return false;
                    }
                }else{
                    if ($('input[name=phone]').val().length > 15){
                        $scope.errorMessage = $filter('translate')('enter_phone_length');
                        $scope.showErrorPhone = true;
                        $scope.showErrorName = false;
                        $scope.showError = false;
                        $('#phone').addClass('error');
                        return false;
                    }
                    $scope.errorMessage = $filter('translate')('enter_phone');
                    $scope.showErrorPhone = true;
                    $scope.showErrorName = false;
                    $scope.showError = false;
                    $('#phone').addClass('error');
                    return false;
                }
                if($scope.password){
                    if($scope.password.length == 0){
                        $scope.errorMessage = $filter('translate')('enter_password');
                        $scope.showError = true;
                        $scope.showErrorName = false;
                        $scope.showErrorPhone = false;
                        $scope.showErrorEnterLatinCharacters = false;
                        $('#password').addClass('error');
                        return false;
                    }
                    if(!checkpassword3 && !checkpassword4){
                        $scope.errorMessage = $filter('translate')('Password must be 8-30 characters long');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterNumberCharacters = true;
                        $scope.showErrorEnterLatin = false;
                        $scope.showErrorEnterPassword = false;
                        $scope.showErrorEnterLatinCharacters = false;
                        $scope.showErrorGoodSuccess = false;
                        $scope.showErrorName = false;
                        $scope.showErrorPhone = false;
                        return false;
                    } else if(!checkpassword1 && !checkpassword4){
                        console.log(!checkpassword1);
                        console.log(!checkpassword4);
                        $scope.errorMessage = $filter('translate')('Password must be 8-30 characters long');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterLatinCharacters = true;
                        $scope.showErrorEnterNumberCharacters = false;
                        $scope.showErrorEnterPassword = false;
                        $scope.showErrorGoodSuccess = false;
                        $scope.showErrorName = false;
                        $scope.showErrorPhone = false;
                        return false;
                    }else if(!checkpassword2){
                        $('#password').addClass('error');
                        $scope.errorMessage = $filter('translate')('Password should contain at least one latin letter');
                        $scope.showError = true;
                        $scope.showErrorEnterLatin = true;
                        $scope.showErrorEnterNumberCharacters = false;
                        $scope.showErrorEnterLatinCharacters = false;
                        $scope.showErrorEnterPassword = false;
                        $scope.showErrorName = false;
                        $scope.showErrorPhone = false;
                        return false;
                    } else if(!checkpassword3){
                        $scope.errorMessage = $filter('translate')('Password should contain at least one number');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterNumber = true;
                        $scope.showErrorEnterNumberCharacters = false;
                        $scope.showErrorEnterLatinCharacters = false;
                        $scope.showErrorEnterPassword = false;
                        $scope.showErrorEnterLatin = false;
                        $scope.showErrorName = false;
                        $scope.showErrorPhone = false;
                        return false;
                    } else if(!checkpassword4){
                        $scope.errorMessage = $filter('translate')('Password must be 8-30 characters long');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterPassword = false;
                        $scope.showErrorName = false;
                        $scope.showErrorPhone = false;
                        return false;
                    } else if(!checkpassword1){
                        $scope.errorMessage = $filter('translate')('Password should contain only numbers and latin letters, allowed characters: !,.?%$#@*_-+=\\|/[]{}()');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorName = false;
                        $scope.showErrorPhone = false;
                        return false;
                    }
                }else{
                    $scope.errorMessage = $filter('translate')('enter_password');
                    $scope.showError = true;
                    $scope.showErrorEnterPassword = true;
                    $scope.showErrorGoodSuccess = false;
                    $scope.showErrorName = false;
                    $scope.showErrorPhone = false;
                    $('#password').addClass('error');
                    return false;
                }
                if($scope.password != $scope.password2){
                    notificationService.error($filter('translate')('wrong_password2'));
                    $scope.showErrorEnterPassword = false;
                    $scope.showErrorEnterNumber = false;
                    $scope.showErrorEnterLatin = false;
                    $scope.showErrorEnterNumberCharacters = false;
                    $scope.showErrorEnterLatinCharacters = false;
                    $scope.showErrorGoodSuccess = true;
                    $('#password2').addClass('error');
                    return false;
                }else{
                    console.log('form is not valid')
                }
            }
        };

        setTimeout(function(){
            var isoCountries = [
                { id: 'AF', text: 'Afghanistan (+93)', value: '+93'},
                { id: 'AX', text: 'Aland Islands (+358)', value: '+358'},
                { id: 'AL', text: 'Albania (+355)', value: '+355'},
                { id: 'DZ', text: 'Algeria (+213)', value: '+213'},
                { id: 'AS', text: 'American Samoa (+1)', value: '+1'},
                { id: 'AD', text: 'Andorra (+376)', value: '+376'},
                { id: 'AO', text: 'Angola (+244)', value: '+244'},
                { id: 'AI', text: 'Anguilla (+1264)', value: '+1264'},
                { id: 'AQ', text: 'Antarctica (+672)', value: '+672'},
                { id: 'AG', text: 'Antigua And Barbuda (+1268)', value: '+1268'},
                { id: 'AR', text: 'Argentina (+54)', value: '+54'},
                { id: 'AM', text: 'Armenia (+374)', value: '+374'},
                { id: 'AW', text: 'Aruba (+297)', value: '+297'},
                { id: 'AU', text: 'Australia (+61)', value: '+61'},
                { id: 'AT', text: 'Austria (+43)', value: '+43'},
                { id: 'AZ', text: 'Azerbaijan (+994)', value: '+994'},
                { id: 'BS', text: 'Bahamas (+1242)', value: '+1242'},
                { id: 'BH', text: 'Bahrain (+973)', value: '+973'},
                { id: 'BD', text: 'Bangladesh (+880)', value: '+880'},
                { id: 'BB', text: 'Barbados (+1246)', value: '+1246'},
                { id: 'BY', text: 'Belarus (+375)', value: '+375'},
                { id: 'BE', text: 'Belgium (+32)', value: '+32'},
                { id: 'BZ', text: 'Belize (+501)', value: '+501'},
                { id: 'BJ', text: 'Benin (+229)', value: '+229'},
                { id: 'BM', text: 'Bermuda (+1441)', value: '+1441'},
                { id: 'BT', text: 'Bhutan (+975)', value: '+975'},
                { id: 'BO', text: 'Bolivia (+591)', value: '+591'},
                { id: 'BA', text: 'Bosnia And Herzegovina (+387)', value: '+387'},
                { id: 'BW', text: 'Botswana (+267)', value: '+267'},
                { id: 'BV', text: 'Bouvet Island (+47)', value: '+47'},
                { id: 'BR', text: 'Brazil (+55)', value: '+55'},
                { id: 'IO', text: 'British Indian Ocean Territory (+246)', value: '+246'},
                { id: 'BN', text: 'Brunei Darussalam (+673)', value: '+673'},
                { id: 'BG', text: 'Bulgaria (+359)', value: '+359'},
                { id: 'BF', text: 'Burkina Faso (+226)', value: '+226'},
                { id: 'BI', text: 'Burundi (+257)', value: '+257'},
                { id: 'KH', text: 'Cambodia (+855)', value: '+855'},
                { id: 'CM', text: 'Cameroon (+237)', value: '+237'},
                { id: 'CA', text: 'Canada (+1)', value: '+1'},
                { id: 'CV', text: 'Cape Verde Islands (+238)', value: '+238'},
                { id: 'KY', text: 'Cayman Islands (+1345)', value: '+1345'},
                { id: 'CF', text: 'Central African Republic (+236)', value: '+236'},
                { id: 'TD', text: 'Chad (+235)', value: '+235'},
                { id: 'CL', text: 'Chile (+56)', value: '+56'},
                { id: 'CN', text: 'China (+86)', value: '+86'},
                { id: 'CX', text: 'Christmas Island (+672)', value: '+672'},
                { id: 'CC', text: 'Cocos (Keeling) Islands (+225)', value: '+225'},
                { id: 'CO', text: 'Colombia (+57)', value: '+57'},
                { id: 'KM', text: 'Comoros (+269)', value: '+269'},
                { id: 'CG', text: 'Congo (+242)', value: '+242'},
                { id: 'CD', text: 'Congo, Democratic Republic (+243)', value: '+243'},
                { id: 'CK', text: 'Cook Islands (+682)', value: '+682'},
                { id: 'CR', text: 'Costa Rica (+506)', value: '+506'},
                { id: 'CI', text: 'Cote D\'Ivoire (+225)', value: '+225'},
                { id: 'HR', text: 'Croatia (+385)', value: '+385'},
                { id: 'CU', text: 'Cuba (+53)', value: '+53'},
                { id: 'CY', text: 'Cyprus (+90)', value: '+90'},
                { id: 'CZ', text: 'Czech Republic (+420)', value: '+420'},
                { id: 'DK', text: 'Denmark (+45)', value: '+45'},
                { id: 'DJ', text: 'Djibouti (+253)', value: '+253'},
                { id: 'DM', text: 'Dominica (+1809)', value: '+1809'},
                { id: 'DO', text: 'Dominican Republic (+1809)', value: '+1809'},
                { id: 'EC', text: 'Ecuador (+593)', value: '+593'},
                { id: 'EG', text: 'Egypt (+20)', value: '+20'},
                { id: 'SV', text: 'El Salvador (+503)', value: '+503'},
                { id: 'GQ', text: 'Equatorial Guinea (+240)', value: '+240'},
                { id: 'ER', text: 'Eritrea (+291)', value: '+291'},
                { id: 'EE', text: 'Estonia (+372)', value: '+372'},
                { id: 'ET', text: 'Ethiopia (+251)', value: '+251'},
                { id: 'FK', text: 'Falkland Islands (Malvinas) (+500)', value: '+500'},
                { id: 'FO', text: 'Faroe Islands (+298)', value: '+298'},
                { id: 'FJ', text: 'Fiji (+679)', value: '+679'},
                { id: 'FI', text: 'Finland (+358)', value: '+358'},
                { id: 'FR', text: 'France (+33)', value: '+33'},
                { id: 'GF', text: 'French Guiana (+594)', value: '+594'},
                { id: 'PF', text: 'French Polynesia (+689)', value: '+689'},
                { id: 'TF', text: 'French Southern Territories (+689)', value: '+689'},
                { id: 'GA', text: 'Gabon (+241)', value: '+241'},
                { id: 'GM', text: 'Gambia (+220)', value: '+220'},
                { id: 'GE', text: 'Georgia (+7880)', value: '+7880'},
                { id: 'DE', text: 'Germany (+49)', value: '+49'},
                { id: 'GH', text: 'Ghana (+233)', value: '+233'},
                { id: 'GI', text: 'Gibraltar (+350)', value: '+350'},
                { id: 'GR', text: 'Greece (+30)', value: '+30'},
                { id: 'GL', text: 'Greenland (+299)', value: '+299'},
                { id: 'GD', text: 'Grenada (+1473)', value: '+1473'},
                { id: 'GP', text: 'Guadeloupe (+590)', value: '+590'},
                { id: 'GU', text: 'Guam (+671)', value: '+671'},
                { id: 'GT', text: 'Guatemala (+502)', value: '+502'},
                { id: 'GG', text: 'Guernsey (+44)', value: '+44'},
                { id: 'GN', text: 'Guinea (+224)', value: '+224'},
                { id: 'GW', text: 'Guinea-Bissau (+245)', value: '+245'},
                { id: 'GY', text: 'Guyana (+592)', value: '+592'},
                { id: 'HT', text: 'Haiti (+509)', value: '+509'},
                { id: 'HM', text: 'Heard Island & Mcdonald Islands (+61)', value: '+61'},
                { id: 'VA', text: 'Holy See (Vatican City State) (+39)', value: '+39'},
                { id: 'HN', text: 'Honduras (+504)', value: '+504'},
                { id: 'HK', text: 'Hong Kong (+852)', value: '+852'},
                { id: 'HU', text: 'Hungary (+36)', value: '+36'},
                { id: 'IS', text: 'Iceland (+354)', value: '+354'},
                { id: 'IN', text: 'India(+91)', value: '+91'},
                { id: 'ID', text: 'Indonesia (+62)', value: '+62'},
                { id: 'IR', text: 'Iran, Islamic Republic Of (+98)', value: '+98'},
                { id: 'IQ', text: 'Iraq (+964)', value: '+964'},
                { id: 'IE', text: 'Ireland (+353)', value: '+353'},
                { id: 'IM', text: 'Isle Of Man (+44)', value: '+44'},
                { id: 'IL', text: 'Israel (+972)', value: '+975'},
                { id: 'IT', text: 'Italy (+39)', value: '+39'},
                { id: 'JM', text: 'Jamaica (+1876)', value: '+1876'},
                { id: 'JP', text: 'Japan (+81)', value: '+81'},
                { id: 'JE', text: 'Jersey (+44-1534)', value: '+44-1534'},
                { id: 'JO', text: 'Jordan (+962)', value: '+962'},
                { id: 'KZ', text: 'Kazakhstan (+7)', value: '+7'},
                { id: 'KE', text: 'Kenya (+254)', value: '+254'},
                { id: 'KI', text: 'Kiribati (+686)', value: '+686'},
                { id: 'KP', text: 'Korea - North (+850)', value: '+850'},
                { id: 'KR', text: 'Korea - South (+82)', value: '+82'},
                { id: 'KW', text: 'Kuwait (+965)', value: '+965'},
                { id: 'KG', text: 'Kyrgyzstan (+996)', value: '+996'},
                { id: 'LA', text: 'Lao People\'s Democratic Republic (+856)', value: '+856'},
                { id: 'LV', text: 'Latvia (+371)', value: '+371'},
                { id: 'LB', text: 'Lebanon (+961)', value: '+961'},
                { id: 'LS', text: 'Lesotho (+266)', value: '+266'},
                { id: 'LR', text: 'Liberia (+231)', value: '+231'},
                { id: 'LY', text: 'Libyan Arab Jamahiriya (+218)', value: '+218'},
                { id: 'LI', text: 'Liechtenstein (+417)', value: '+417'},
                { id: 'LT', text: 'Lithuania (+370)', value: '+370'},
                { id: 'LU', text: 'Luxembourg (+352)', value: '+352'},
                { id: 'MO', text: 'Macao (+853)', value: '+853'},
                { id: 'MK', text: 'Macedonia (+389)', value: '+389'},
                { id: 'MG', text: 'Madagascar (+261)', value: '+261'},
                { id: 'MW', text: 'Malawi (+265)', value: '+265'},
                { id: 'MY', text: 'Malaysia (+60)', value: '+60'},
                { id: 'MV', text: 'Maldives (+960)', value: '+960'},
                { id: 'ML', text: 'Mali (+223)', value: '+223'},
                { id: 'MT', text: 'Malta (+356)', value: '+356'},
                { id: 'MH', text: 'Marshall Islands (+692)', value: '+692'},
                { id: 'MQ', text: 'Martinique (+596)', value: '+596'},
                { id: 'MR', text: 'Mauritania (+222)', value: '+222'},
                { id: 'MU', text: 'Mauritius (+230)', value: '+230'},
                { id: 'YT', text: 'Mayotte (+269)', value: '+269'},
                { id: 'MX', text: 'Mexico (+52)', value: '+52'},
                { id: 'FM', text: 'Micronesia, Federated States Of (+691)', value: '+691'},
                { id: 'MD', text: 'Moldova (+373)', value: '+373'},
                { id: 'MC', text: 'Monaco (+377)', value: '+377'},
                { id: 'MN', text: 'Mongolia (+976)', value: '+976'},
                { id: 'ME', text: 'Montenegro (+382)', value: '+382'},
                { id: 'MS', text: 'Montserrat (+1664)', value: '+1664'},
                { id: 'MA', text: 'Morocco (+212)', value: '+212'},
                { id: 'MZ', text: 'Mozambique (+258)', value: '+258'},
                { id: 'MM', text: 'Myanmar (+95)', value: '+95'},
                { id: 'NA', text: 'Namibia (+264)', value: '+264'},
                { id: 'NR', text: 'Nauru (+674)', value: '+674'},
                { id: 'NP', text: 'Nepal (+977)', value: '+977'},
                { id: 'NL', text: 'Netherlands (+31)', value: '+31'},
                { id: 'AN', text: 'Netherlands Antilles (+599)', value: '+599'},
                { id: 'NC', text: 'New Caledonia (+687)', value: '+687'},
                { id: 'NZ', text: 'New Zealand (+64)', value: '+64'},
                { id: 'NI', text: 'Nicaragua (+505)', value: '+505'},
                { id: 'NE', text: 'Niger (+227)', value: '+227'},
                { id: 'NG', text: 'Nigeria (+234)', value: '+234'},
                { id: 'NU', text: 'Niue (+683)', value: '+683'},
                { id: 'NF', text: 'Norfolk Island (+672)', value: '+672'},
                { id: 'MP', text: 'Northern Mariana Islands (+670)', value: '+670'},
                { id: 'NO', text: 'Norway (+47)', value: '+47'},
                { id: 'OM', text: 'Oman (+968)', value: '+968'},
                { id: 'PK', text: 'Pakistan (+92)', value: '+92'},
                { id: 'PW', text: 'Palau (+680)', value: '+680'},
                { id: 'PS', text: 'Palestinian Territory (+970)', value: '+970'},
                { id: 'PA', text: 'Panama (+507)', value: '+507'},
                { id: 'PG', text: 'Papua New Guinea (+675)', value: '+675'},
                { id: 'PY', text: 'Paraguay (+595)', value: '+595'},
                { id: 'PE', text: 'Peru (+51)', value: '+51'},
                { id: 'PH', text: 'Philippines (+63)', value: '+63'},
                { id: 'PN', text: 'Pitcairn (+64)', value: '+64'},
                { id: 'PL', text: 'Poland (+48)', value: '+48'},
                { id: 'PT', text: 'Portugal (+351)', value: '+351'},
                { id: 'PR', text: 'Puerto Rico (+1787)', value: '+1787'},
                { id: 'QA', text: 'Qatar (+974)', value: '+974'},
                { id: 'RE', text: 'Reunion (+262)', value: '+262'},
                { id: 'RO', text: 'Romania (+40)', value: '+40'},
                { id: 'RU', text: 'Russian Federation (+7)', value: '+7'},
                { id: 'RW', text: 'Rwanda (+250)', value: '+250'},
                { id: 'BL', text: 'Saint Barthelemy (+590)', value: '+590'},
                { id: 'SH', text: 'Saint Helena (+290)', value: '+94'},
                { id: 'KN', text: 'Saint Kitts And Nevis (+1869)', value: '+94'},
                { id: 'LC', text: 'Saint Lucia (+1758)', value: '+94'},
                { id: 'MF', text: 'Saint Martin (+590)', value: '+590'},
                { id: 'PM', text: 'Saint Pierre And Miquelon (+508)', value: '+508'},
                { id: 'VC', text: 'Saint Vincent And Grenadines (+1-784)', value: '+1-784'},
                { id: 'WS', text: 'Samoa (+685)', value: '+685'},
                { id: 'SM', text: 'San Marino (+378)', value: '+378'},
                { id: 'ST', text: 'Sao Tome And Principe (+239)', value: '+239'},
                { id: 'SA', text: 'Saudi Arabia (+966)', value: '+966'},
                { id: 'SN', text: 'Senegal (+221)', value: '+221'},
                { id: 'RS', text: 'Serbia (+381)', value: '+381'},
                { id: 'SC', text: 'Seychelles (+248)', value: '+248'},
                { id: 'SL', text: 'Sierra Leone (+232)', value: '+232'},
                { id: 'SG', text: 'Singapore (+65)', value: '+65'},
                { id: 'SK', text: 'Slovakia (+421)', value: '+421'},
                { id: 'SI', text: 'Slovenia (+386)', value: '+386'},
                { id: 'SB', text: 'Solomon Islands (+677)', value: '+677'},
                { id: 'SO', text: 'Somalia (+252)', value: '+252'},
                { id: 'ZA', text: 'South Africa (+27)', value: '+27'},
                { id: 'GS', text: 'South Georgia And Sandwich Isl. (+500)', value: '+500'},
                { id: 'ES', text: 'Spain (+34)', value: '+34'},
                { id: 'LK', text: 'Sri Lanka (+94)', value: '+94'},
                { id: 'SD', text: 'Sudan (+249)', value: '+249'},
                { id: 'SR', text: 'Suriname (+597)', value: '+597'},
                { id: 'SJ', text: 'Svalbard And Jan Mayen (+47)', value: '+47'},
                { id: 'SZ', text: 'Swaziland (+268)', value: '+268'},
                { id: 'SE', text: 'Sweden (+46)', value: '+46'},
                { id: 'CH', text: 'Switzerland (+41)', value: '+41'},
                { id: 'SY', text: 'Syrian Arab Republic (+963)', value: '+963'},
                { id: 'TW', text: 'Taiwan (+886)', value: '+886'},
                { id: 'TJ', text: 'Tajikistan (+992)', value: '+992'},
                { id: 'TZ', text: 'Tanzania (+255)', value: '+255'},
                { id: 'TH', text: 'Thailand (+66)', value: '+66'},
                { id: 'TL', text: 'Timor-Leste (+670)', value: '+670'},
                { id: 'TG', text: 'Togo (+228)', value: '+228'},
                { id: 'TK', text: 'Tokelau (+690)', value: '+690'},
                { id: 'TO', text: 'Tonga (+676)', value: '+676'},
                { id: 'TT', text: 'Trinidad And Tobago (+1868)', value: '+1868'},
                { id: 'TN', text: 'Tunisia (+216)', value: '+216'},
                { id: 'TR', text: 'Turkey (+90)', value: '+90'},
                { id: 'TM', text: 'Turkmenistan (+993)', value: '+993'},
                { id: 'TC', text: 'Turks And Caicos Islands (+1649)', value: '+1649'},
                { id: 'TV', text: 'Tuvalu (+688)', value: '+668'},
                { id: 'UG', text: 'Uganda (+256)', value: '+256'},
                { id: 'UA', text: 'Ukraine (+380)', value: '+380'},
                { id: 'AE', text: 'United Arab Emirates (+971)', value: '+971'},
                { id: 'GB', text: 'United Kingdom (+44)', value: '+44'},
                { id: 'US', text: 'United States (+1)', value: '+1'},
                { id: 'UM', text: 'United States Outlying Islands (+1-340)', value: '+1-340'},
                { id: 'UY', text: 'Uruguay (+598)', value: '+598'},
                { id: 'UZ', text: 'Uzbekistan (+998)', value: '+998'},
                { id: 'VU', text: 'Vanuatu (+678)', value: '+678'},
                { id: 'VE', text: 'Venezuela (+58)', value: '+58'},
                { id: 'VN', text: 'Vietnam (+84)', value: '+84'},
                { id: 'VG', text: 'Virgin Islands, British (+1)', value: '+1'},
                { id: 'VI', text: 'Virgin Islands, U.S. (+1)', value: '+1'},
                { id: 'WF', text: 'Wallis And Futuna (+681)', value: '+681'},
                { id: 'EH', text: 'Western Sahara (+212)', value: '+212'},
                { id: 'YE', text: 'Yemen (North)(+969)', value: '+969'},
                { id: 'YE', text: 'Yemen (South)(+967)', value: '+967'},
                { id: 'ZM', text: 'Zambia (+260)', value: '+260'},
                { id: 'ZW', text: 'Zimbabwe (+263)', value: '+263'}
            ];
            $.ajax({
                url: "/hr/public/getUserLocation",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                complete: function(resp){
                    $.each(isoCountries, function(index, value) {
                        if(resp.responseJSON.countryCode != undefined && resp.responseJSON.countryCode == value.id){
                            $('.select2-chosen')[0].innerHTML = '<span class="flag-icon flag-icon-'+ value.id.toLowerCase() +' flag-icon-squared"></span>' + '<span class="flag-text" style="margin-left: 5px;">'+ value.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\-*\s*/g,"").replace(/,/g,"").replace(/'/g,"").replace(/&/g,"")+"</span>";
                            $('.select2-chosen')[0].title = value.text;
                            var country = $('input[name=country]');
                            country.val(value.text);
                            var phone = $('#countryCustom');
                            phone.value = value.value.replace("+","");
                            localStorage.setItem("phone",  phone.value);
                        }
                    });
                }
            });
        }, 0);

        var userLang = navigator.language || navigator.userLanguage;
        var lST = userLang.substring(0, 2);
    })
    .controller('PublicVacancyController', ["$rootScope", "$scope", "$filter", "$location", "$routeParams", "$sce" , "$translate", "Service",
                "notificationService", "FileInit", "serverAddress", "$window", "Company", "$uibModal" ,
      function($rootScope, $scope, $filter, $location, $routeParams, $sce , $translate, Service,
               notificationService, FileInit, serverAddress, $window, Company, $uibModal) {


        $rootScope.closeModal = function(){
          $scope.modalInstance.close();
          $('body').removeClass('modal-open-public-vacancy-form');
        };

        if($location.$$absUrl.indexOf('/pv/') >= 0){
            var string = $location.$$path;
            string = string.replace("/pv/", "vacancy-");
            console.log(string);
            $window.location.replace('/i#/' + string);
        }
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
        $.getScript('//connect.facebook.net/en_UK/all.js', function () {
            FB.init({
                appId: apiKey.facebook.appId,
                version: 'v2.9'
            });
        });

          $(window).scroll(function(){
              if($('.vacancy-info').offset() && $(window).scrollTop() >= $('.vacancy-info').offset().top - 10) {
                  $('.apply-buttons').addClass("fixed")
              } else {
                  if($('.apply-buttons').hasClass("fixed")) {
                      $('.apply-buttons').removeClass("fixed");
                  }
              }
      });

          // let timeout;
          // $scope.companyInfoHoverIn = function() {
          //     let logo = $('.logo:eq( 1 )'),
          //         companyInfo = $('.comp-abs'),
          //         nameWrap = $('.name_wrap'),
          //         infoSite = $('.info--site:eq(2)'),
          //         name = $('.block-company-public-vacancy .companyInfo h2:eq(1)'),
          //         site = $('.info--site:eq(2) a'),
          //         fb = $('.info--site:eq(3) a');
          //
          //     console.log(logo);
          //     console.log(companyInfo);
          //     console.log(nameWrap);
          //     console.log(infoSite);
          //     console.log(name);
          //     console.log(site);
          //     console.log(fb);
          //
          //     clearTimeout(timeout);
          //
          //     if(infoSite.width() - site.width() <= 44.64 || infoSite.width() - fb.width() <= 44.64 || nameWrap.width() <= name.width()) {
          //         $scope.adaptiveImgWidth = logo.height();
          //         logo.height($scope.adaptiveImgWidth);
          //         timeout = setTimeout(() => nameWrap.css('white-space', 'normal'),300);
          //         companyInfo.addClass('hovered');
          //     }
          // };
          //
          // $scope.companyInfoHoverOut = function() {
          //     let nameWrap = $('.name_wrap');
          //     nameWrap.css('white-space', 'nowrap');
          //     $('.comp-abs').removeClass('hovered');
          //     clearTimeout(timeout);
          // };

        $scope.share = function (sourse) {
            if ($scope.companyLogo != undefined && $scope.companyLogo !== '') {
                $scope.publicImgLink = $location.$$protocol + "://" + $location.$$host + $scope.serverAddress + '/getlogo?id=' + $scope.companyLogo;
            } else {
                $scope.publicImgLink = "https://cleverstaff.net/images/sprite/icon_128_128_png.png";
            }
            $scope.publicDescr = '';
            var link = $location.$$protocol + "://" + $location.$$host + "/i#/pv/" + $scope.vacancy.localId;
            angular.forEach(angular.element($scope.vacancy.descr).text().replace("\r\n", "\n").split("\n"), function (val) {
                if (val !== undefined && val !== '') {
                    $scope.publicDescr += val + " ";
                }
            });

            if ($scope.serverAddress === '/hrdemo') {
                link = $location.$$protocol + "://" + $location.$$host + "/di#/pv/" + $scope.vacancy.localId;
            }
            if (sourse === 'linkedin') {
                if (!IN.User.isAuthorized()) {
                    IN.User.authorize(function () {
                        IN.API.Raw("/people/~/shares")
                            .method("POST")
                            .body(JSON.stringify({
                                "content": {
                                    "title": $filter('translate')('Vacancy') + ' ' + $scope.vacancy.position,
                                    "description": $scope.publicDescr,
                                    "submitted-url": link,
                                    "submitted-image-url": $scope.publicImgLink
                                },
                                "visibility": {
                                    "code": "anyone"
                                },
                                "comment": ''
                            }))
                            .result(function (r) {
                                notificationService.success($filter('translate')('Vacancy posted on your LinkedIn'));
                            })
                            .error(function (r) {
                                notificationService.error(r.message);
                            });
                    }, "w_share");
                } else {
                    IN.API.Raw("/people/~/shares")
                        .method("POST")
                        .body(JSON.stringify({
                            "content": {
                                "title": $filter('translate')('Vacancy') + ' ' + $scope.vacancy.position,
                                "description": $scope.publicDescr,
                                "submitted-url": link,
                                "submitted-image-url": $scope.publicImgLink
                            },
                            "visibility": {
                                "code": "anyone"
                            },
                            "comment": ""
                        }))
                        .result(function (r) {
                            notificationService.success($filter('translate')('Vacancy posted on your LinkedIn'));
                        })
                        .error(function (r) {
                            notificationService.error(r.message);
                        });
                }
            }
            if (sourse === 'facebook') {

                FB.getLoginStatus(function (response) {
                    if (response.status === 'connected') {
                        FB.ui({
                                method: 'feed',
                                name: $filter('translate')('Vacancy') + ' ' + $scope.vacancy.position,
                                caption: '',
                                description: $scope.publicDescr,
                                link: link,
                                picture: $scope.publicImgLink
                            },
                            function (response) {
                                if (response && response.post_id) {
                                    notificationService.success($filter('translate')('Vacancy posted on your Facebook'));
                                } else {
                                    notificationService.error($filter('translate')('Vacancy hasn\'t shared'));
                                }
                            });
                    }
                    else {
                        FB.login(function () {
                            FB.ui({
                                    method: 'feed',
                                    name: $filter('translate')('Vacancy') + ' ' + $scope.vacancy.position,
                                    caption: '',
                                    description: $scope.publicDescr,
                                    link: link,
                                    picture: $scope.publicImgLink
                                },
                                function (response) {
                                    if (response && response.post_id) {
                                        a;
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
                IN.API.Profile("me").fields(["site-standard-profile-request", "public-profile-url", "first-name", "last-name", "email-address", "phone-numbers", "bound-account-types", "headline", "summary", "specialties", "positions", "educations"]).result(function (me) {
                    parseLinkedInInformationForRecall(me, $scope);
                    $scope.showRecallFromModal();
                });
            });
        };
        $scope.show = true;
        FileInit.initFileOption($scope, "public", {
            allowedType: ["docx", "doc", "pdf", "odt"],
            maxSize: 5242880
        }, $filter);
        $scope.filesForRecall = [];
        $scope.callbackFile = function (var1, var2) {
            $scope.message = 'def';
            $scope.filesForRecall.push({name: var2, attId: var1})
        };

        $scope.callbackFileError = function () {
            $scope.message = 'error_file';
        };
        var vacancyId = null;
        if ($routeParams.vacancyId.indexOf("#") != -1) {
            vacancyId = $routeParams.vacancyId.split("#")[0];
        } else {
            vacancyId = $routeParams.vacancyId;
        }
        $scope.getCompanyParams = function(){
            Company.getParams(function(resp){
                $scope.companyParams = resp.object;
                $rootScope.publicLink = $location.$$protocol + "://" + $location.$$host + ":8080/i#/" + $scope.companyParams.nameAlias + "-vacancies";
            });
        };
        // $scope.getCompanyParams();
        $scope.orgName = null;
        $scope.loadStatusForPublicVacancy = false;
        Service.publicVacancy({id: vacancyId, host: document.referrer}, function (resp) {
            console.log(resp);
            if (resp.status && resp.status === 'error' && resp.message) {
                $scope.vacancyFound = false;
            } else {
                $scope.vacancyId = resp.object.vacancyId;
                $scope.request.vacancyId = resp.object.vacancyId;
                $rootScope.title = resp.object.position + " - " + $filter('translate')('vacancy_in') + " CleverStaff";
                $rootScope.vacancyName = resp.object.position;
                if (resp.object.region != undefined) {
                    $rootScope.region = resp.object.region.fullName;
                }
                $scope.vacancy = resp.object;
                $scope.companyPublicInfo = {};
                $scope.companyPublicInfo.fb = $scope.vacancy.linkToCompanyFaceBookPage;
                $scope.companyPublicInfo.companyWebSite = $scope.vacancy.linkToCompanySite;
                $scope.companyPublicInfo.orgName = $scope.vacancy.orgName;
                $scope.vacancyFound = true;
                //$location.hash('');
                $location.search($filter('transliteration')(resp.object.position.replace(/\W+/g, '_'))).replace();
                $scope.loadStatusForPublicVacancy = true;
                //setTimeout(function(){
                //    if (performance.navigation.type == 1) {
                //        $location.$$absUrl
                //    } else {
                //        history.pushState(null, "", $rootScope.publicLink);
                //    }
                //    if($location.$$host == '127.0.0.1'){
                //        history.pushState(null, "", $location.$$protocol + "://" + $location.$$host + ":8080/i#" + $location.$$path + "?" + deleteTenSpaces);
                //    }else{
                //        history.pushState(null, "", $location.$$protocol + "://" + $location.$$host + "/i#" + $location.$$path + "?" + deleteTenSpaces);
                //    }
                //}, 1000);
                // Service.getOrgLogoId({orgId: resp.object.orgId}, function (logoResp) {
                //     if (logoResp.status && logoResp.status === 'ok') {
                //         $scope.companyLogo = logoResp.object;
                //     }
                // });
            }
        }, function () {
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
        $scope.incorrectPhoneNumber = false;
        $('#email2').on('input', function () {
            $scope.request.email = $(this).val();
            $scope.changeEmail();
            $scope.$apply();
        });
        $rootScope.changeEmail = function(email){
            if(email.length > 0){
                $scope.showErrorEmailMessage = false;
            }
        };
        $scope.showErrorPhoneMessage = false;
        $('#phone').on('input', function () {
            $scope.showErrorPhoneMessage = false;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
        $scope.changeEmail = function () {
            if ($scope.request.email == undefined) {
                $scope.showErrorEmailMessage = true;
            } else $scope.showErrorEmailMessage = $scope.request.email.length == 0;
        };
          $scope.enterPhoneNumber = false;
          $scope.changePhone = function (phone) {
            //$scope.recallForm.phone.$invalid = false;
            if(phone == undefined){
                $scope.enterPhoneNumber = true;
                $scope.incorrectPhoneNumber = false;
                $scope.showErrorPhoneMessage = true;
            }else if(phone.length > 0){
                $scope.showErrorPhoneMessage = false;
            }
        };
          $scope.$watch('request.phone', function (newVal, oldVal) {
              if(newVal != undefined && oldVal != newVal){
                  $scope.showErrorPhoneMessage = false;
              }
          });

        $scope.showModalInfoAboutVacancy = function() {
          $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '../partials/modal/vacancy-added-response.html',
            size: '',
            resolve: {

            }
          });
        };



        $scope.showRecallFromModal = function() {
            $scope.showErrorEmailMessage = false;
            $scope.showErrorPhoneMessage = false;
            $scope.showErrorCvFileMessage = false;
            $('body').addClass('modal-open-public-vacancy-form');
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/public-vacancy-form.html?b=10',
                size: '',
                scope: $scope,
                resolve: {

                }
            });
        };
        $scope.sendRequest = function (recallForm) {
            $scope.recallForm = recallForm;
            $scope.showErrorCvFileMessage = true;
          if ($scope.recallForm.$valid) {
                if ($scope.request.email != undefined && $scope.request.email.length == 0) {
                    $scope.request.email = "";
                }
                if (validEmail($scope.request.email)) {
                    $scope.showErrorEmailMessage = true;
                    return;
                }else{
                    $scope.showErrorEmailMessage = false;
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
                $scope.request.phone = String($scope.request.phone);
                if ($scope.request.phone == undefined || $scope.request.phone.match(/^[\(\)\s\-\+\d]{9,20}$/) == null) {
                    $scope.showErrorPhoneMessage = true;
                    $scope.enterPhoneNumber = false;
                    $scope.incorrectPhoneNumber = true;
                    return false;
                }else{
                    $scope.showErrorPhoneMessage = false;
                }
                if($scope.filesForRecall.length == 0){
                    $scope.showErrorCvFileMessage = true;
                }else{
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
                            // $("#email2").val("");
                            $scope.filesForRecall = [];
                            $scope.recallForm.name.$pristine = true;
                            $scope.recallForm.last_name.$pristine = true;
                            $scope.recallForm.phone.$pristine = true;
                            $scope.recallForm.phone.$invalid = false;
                            $scope.recallForm.email2.$invalid = false;
                            $scope.recallForm.email2.$pristine = false;
                            $scope.showErrorEmailMessage = false;
                            $('body').removeClass('modal-open-public-vacancy-form');
                            $rootScope.closeModal();
                            $scope.showModalInfoAboutVacancy();
                        }

                    }, function (resp) {
                        $scope.message = "error";
                    });
                }
            } else {
                $scope.recallForm.name.$pristine = false;
                $scope.recallForm.last_name.$pristine = false;
                if (validEmail($scope.request.email)) {
                    $scope.showErrorEmailMessage = true;
                }
                $scope.recallForm.phone.$pristine = false;
                if($scope.request.phone == null || $scope.request.phone.length == 0){
                    $scope.enterPhoneNumber = true;
                }else if($scope.request.phone.length < 9 || $scope.request.phone.length > 20){
                    $scope.showErrorPhoneMessage = true;
                    $scope.incorrectPhoneNumber = true;
                    $scope.enterPhoneNumber = false;
                }else{
                    $scope.incorrectPhoneNumber = true;
                    $scope.enterPhoneNumber = false;
                }
            }
        };
    }])
    .controller('PublicVacancyAddController', function($rootScope, $scope, $filter, $location, $translate, Service, notificationService) {
        $rootScope.hasJS = true;
        $scope.orgId = 'c0f3bac6a94e4c2290618907e8dba636';
        Service.saveAccessLogEntry({value: $scope.orgId, host: document.referrer, type: "public_add_vacancy"});


        $rootScope.title = "Форма додавання вакансії";
        $translate.use("ua");

        var google_url = "https://accounts.google.com/o/oauth2/auth" +
            "?client_id=" + apiKey.google.client_id +
            "&scope=email%20profile" +
            "&state=/profile" +
            "&redirect_uri=" + location.protocol + "//" + document.domain + "/white.html" +
            "&response_type=code%20token" +
            "&approval_prompt=auto";

        $scope.employmentType = Service.employmentType();
        Service.genderTwo($scope);
        $scope.currency = Service.currency();
        $scope.langs = ["Англійський розмовний",
            "Англійський професійний",
            "Англійський середній",
            "Англійський починаючий",
            "Російський розмовний",
            "Російський професійний",
            "Російський середній",
            "Російський починаючий",
            "Український розмовний",
            "Український професійний",
            "Український середній",
            "Український починаючий",
            "Білоруський розмовний",
            "Білоруський професійний",
            "Білоруський середній",
            "Білоруський починаючий",
            "Казахський розмовний",
            "Казахський професійний",
            "Казахський середній",
            "Казахський починаючий",
            "Молдавський розмовний",
            "Молдавський професійний",
            "Молдавський середній",
            "Молдавський починаючий"];
        $scope.industries = Service.getIndustries();

        $('.select2-lang').select2({
            tags: $scope.langs,
            tokenSeparators: [",", " "]
        });

        $scope.errorMessage = {
            show: false,
            message: ""
        };
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
                mapTypeControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
        };
        $scope.marker = {
            id: 1,
            title: "",
            coords: {
                latitude: null,
                longitude: null
            }
        };
        $scope.companyData = {
            input: "",
            inputFocused: false,
            clients: [],
            clientsAfterSearch: [],
            wrongName: false
        };
        $scope.company = {
            name: "",
            firstName: "",
            phone: "",
            email: "",
            industry: "",
            site: "",
            descr: ""
        };

        $scope.focusOffCompany = function() {
            var checkName = false;
            angular.forEach($scope.companyData.clients, function(val) {
                if (val == $scope.companyData.input) {
                    checkName = true;
                }
            });
            if (checkName) {
                $scope.companyData.wrongName = false;
            } else {
                $scope.companyData.wrongName = $scope.companyData.input && $scope.companyData.input.length != 0;
            }
            $scope.companyData.inputFocused = true;
        };


        Service.getClientNames({orgId: $scope.orgId}, function(resp) {
            $scope.companyData.clients = resp.object;
            var arr = [];
            angular.forEach($scope.companyData.clients, function(val) {
                arr.push({id: val, text: val})
            });

            $(".search-client-name").select2({
                data: arr,
                minimumInputLength: 2,
                selectOnBlur: true,
                formatInputTooShort: function() {
                    return "";
                },
                createSearchChoice: function(term, data) {
                    if ($(data).filter(function() {
                            return this.text.localeCompare(term) === 0;
                        }).length === 0) {
                        return {id: term, text: term};
                    }
                }
            }).on("select2-close", function(e) {
                $scope.companyData.input = $(this).select2('data').id;
                var valueExist = false;
                angular.forEach($scope.companyData.clients, function(resp) {
                    if (resp == $scope.companyData.input) {
                        valueExist = true;
                    }
                });
                if (valueExist) {
                    $scope.companyData.wrongName = false;
                    $scope.goToStepTwo();

                } else {
                    $scope.companyData.wrongName = $scope.companyData.input && $scope.companyData.input.length != 0;
                }
                $scope.companyData.inputFocused = true;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });

        });

        $scope.goToStepTwo = function(withoutContacts) {
            if (!withoutContacts) {
                $("#pac-input").wrap('<div class="ui labeled input">');
                $("#pac-input").after('<div class="ui corner label"><i class="asterisk icon"></i></div>');
            }
            if ($scope.companyData.wrongName && !$scope.companyForm.$valid) {
                $scope.companyForm.email.$pristine = false;
                $scope.companyForm.phone.$pristine = false;
                $scope.companyForm.firstName.$pristine = false;
                return;
            }
            if ($scope.validCompanyData()) {
                $scope.company.name = $scope.companyData.input;
                $scope.client = {
                    name: $scope.companyData.input,
                    industry: $scope.company.industry,
                    site: $scope.company.site,
                    descr: $scope.company.descr
                };
                if ($scope.companyData.wrongName && !withoutContacts) {
                    $scope.contacts = [
                        {
                            firstName: $scope.company.firstName,
                            contacts: [
                                {
                                    type: "mphone",
                                    value: $scope.company.phone
                                },
                                {
                                    type: "email",
                                    value: $scope.company.email
                                }
                            ]
                        }
                    ]
                } else {
                    $scope.contacts = [];
                }
                $scope.step = 2;
                $scope.companyForm2.position.$pristine = true;
            } else {

            }
        };

        $scope.goToStepThree = function() {
            $scope.vacancy = {};
            $('.select2-lang').select2('data', null);
            $("#pac-input").val("");
            $scope.region = {};
            $scope.step = 3;
            $scope.companyForm2.position.$pristine = true;
        };

        $scope.changeStep = function(step) {
            if ($scope.step > step) {
                $scope.step = step;
            }
        };

        $scope.validCompanyData = function() {
            if ($scope.companyData.wrongName == false && $scope.companyData.input.length > 0) {
                return true;
            }
            if ($scope.company.firstName.length > 0 && $scope.company.phone.length > 0 && $scope.company.email.length > 0) {
                return true;
            }
            return false;
        };

        $("#pac-input").on("change", function() {
            if ($(this).val().length == 0) {
                $("#pac-input").parent().parent().parent().addClass("error");
                $("#pac-input").css("border-color", "#E7BEBE");
                $("#pac-input").css("box-shadow", ".3em 0 0 0 #D95C5C inset");
            } else {
                $("#pac-input").parent().parent().parent().removeClass("error");
                $("#pac-input").css("border-color", "");
                $("#pac-input").css("box-shadow", "");
            }
        });

        $scope.$watch('regionInput', function(newValue, oldValue) {
            if (newValue && newValue.length == 0) {
                $("#pac-input").parent().parent().parent().addClass("error");
                $("#pac-input").css("border-color", "#E7BEBE");
                $("#pac-input").css("box-shadow", ".3em 0 0 0 #D95C5C inset");
            } else {
                $("#pac-input").parent().parent().parent().removeClass("error");
                $("#pac-input").css("border-color", "");
                $("#pac-input").css("box-shadow", "");
            }
        });

        $scope.saveFacebook = function() {
            var r = false;
            if (!$scope.companyForm2.$valid) {
                $scope.companyForm2.position.$pristine = false;
                notificationService.error("Будь-ласка, заповніть назву вакансії");
                r = true;
            }
            if ($("#pac-input").val().length == 0) {
                $("#pac-input").parent().parent().parent().addClass("error");
                $("#pac-input").css("border-color", "#E7BEBE");
                $("#pac-input").css("box-shadow", ".3em 0 0 0 #D95C5C inset");
                notificationService.error("Будь-ласка, заповніть регіон");
                r = true;
            }
            if (r) return;
            FB.login(function(response) {
                if (response.authResponse) {
                    var code = response.authResponse.accessToken; //get access token
                    FB.api('/me', function(u) {
                        var user = {
                            id: u.id,
                            name: u.name,
                            email: u.email,
                            source: "facebook"
                        };
                        save(user)

                    });
                }
            }, {
                scope: 'email'
            });

        };

        $scope.saveGoogle = function() {
            var r = false;
            if (!$scope.companyForm2.$valid) {
                $scope.companyForm2.position.$pristine = false;
                notificationService.error("Будь-ласка, заповніть назву вакансії");
                r = true;
            }
            if ($("#pac-input").val().length == 0) {
                $("#pac-input").parent().parent().parent().addClass("error");
                $("#pac-input").css("border-color", "#E7BEBE");
                $("#pac-input").css("box-shadow", ".3em 0 0 0 #D95C5C inset");
                notificationService.error("Будь-ласка, заповніть регіон");
                r = true;
            }
            if (r) return;
            var win = window.open(google_url, "windowname3", getPopupParams());
            var pollTimer = window.setInterval(function() {
                try {
                    if (win.document.URL.indexOf(gup(google_url, 'redirect_uri')) !== -1) {
                        window.clearInterval(pollTimer);
                        var url = win.document.URL;
                        var code = gup(url, 'code');
                        var access_token = gup(url, 'access_token');
                        win.close();
                        $.ajax({
                            url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + access_token,
                            data: null,
                            success: function(u) {
                                var user = {
                                    id: u.id,
                                    name: u.name,
                                    email: u.email,
                                    source: "googleplus"
                                };
                                save(user)
                            },
                            dataType: "jsonp"
                        });
                    }
                } catch (e) {
                }
            }, 500);

        };

        function save(user) {
            if ($("#pac-input").val().length == 0) {
                $scope.vacancy.region = null;
            } else if ($("#pac-input").val().length > 0) {
                $scope.vacancy.region = $scope.region;
            }
            $scope.vacancy.langs = $('.select2-lang').select2('val').toString();
            var saveObject = {
                history: user,
                orgId: $scope.orgId,
                client: $scope.client,
                contacts: $scope.contacts,
                vacancies: [
                    $scope.vacancy
                ]
            };
            Service.addVacancyPackage(saveObject,
                function(resp) {
                    if (resp && resp.status == "ok") {
                        $scope.goToStepThree();
                    }
                }, function(resp) {
                }
            );

        }

        window.fbAsyncInit = function() {
            FB.init({
                appId: apiKey.facebook.appId,
                oauth: true,
                status: true, // check login status
                cookie: true, // enable cookies to allow the server to access the session
                xfbml: true, // parse XFBML
                version: 'v2.9'
            });
        };
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id))
                return;
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=" + apiKey.facebook.appId + "&version=v2.9";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
);


function validEmail(email, notificationService) {
    if (email == undefined) return true;
    var r = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi;
    return !email.match(r);
}

function gup(url, name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    if (results === null)
        return "";
    else
        return results[1];
}
function getPopupParams() {
    var w = 650;
    var h = 550;
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    return 'width=' + w + ', height=' + h + ', top=' + top + ', left=' + left;
}