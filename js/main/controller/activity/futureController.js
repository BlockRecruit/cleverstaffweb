controller.controller('ActivityFutureController', ["$scope", "$translate", "$rootScope", "Vacancy", "frontMode", "$filter", "Sticker",
    "Service", "ScopeService","Person", "$location", "notificationService","Task","$document", "$uibModal", "$sce", "$timeout", "$route", "Achieve",
    function($scope, $translate, $rootScope, Vacancy, frontMode, $filter, Sticker, Service, ScopeService, Person, $location,
             notificationService,Task, $document, $uibModal, $sce, $timeout, $route, Achieve) {
    $rootScope.loading = true;
    $rootScope.showAchieves = true;
    $scope.activeVacancy = null;
        localStorage.setItem("isAddCandidates", false);
        Task.task($scope, $rootScope, $location, $translate, $uibModal, $route);
        //if(localStorage.showAchieves == 'true'){
        //    $scope.showAchieves = true;
        //}else if(localStorage.showAchieves == 'false'){
        //    $scope.showAchieves = false;
        //} else{
        //    $scope.showAchieves = true;
        //}



        if(localStorage.upcomingEventsScope != undefined) {
            $rootScope.upcomingEventsScope = JSON.parse(localStorage.upcomingEventsScope);
            console.log('rootUpcom',$rootScope.upcomingEventsScope, JSON.parse(localStorage.upcomingEventsScope));
            $(".upcomingScopeSwticher").prop( "checked", $rootScope.upcomingEventsScope );
        } else {
            if($rootScope.me.recrutRole != 'admin' ) {
                $rootScope.upcomingEventsScope = false;
            }else {
                $(".upcomingScopeSwticher").prop( "checked", true );
                $rootScope.upcomingEventsScope = true;
            }
        }
        if($rootScope.me.recrutRole != 'admin' && $rootScope.me.recrutRole != 'recruter'){
            $rootScope.showAchieves = false;
        }
        if(frontMode === 'demo'){
            $rootScope.showAchieves = false;
        }
    $scope.showEvents = null;
    $scope.popoverStyleElem = false;
    $rootScope.responsiblePersons =[];
    $scope.todayDate = new Date().getTime();
    $rootScope.stickerViewInfo = {text: null, title: null, author: null, show: true, object: null};
    $rootScope.stickerEditInfo = {text: null, title: null, author: null, show: false};
    $scope.extensionHas = null;
    $scope.publicLink = $location.$$protocol + "://" + $location.$$host;
    $scope.publicImgLink = "http://dev.cleverstaff.net/img/congratAchievesBigForSoc.jpg";
    $rootScope.vacancyChangeInterviewDate = {
        date: null,
        dateOld: null,
        candidate: null,
        interviewObject: null,
        comment: null
    };
    $(".changeVacancyInterviewDatePicker").datetimepicker({
        format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy hh:ii" : "mm/dd/yyyy hh:ii",
        startView: 2,
        minView: 0,
        autoclose: true,
        weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
        language: $translate.use()
    }).on('changeDate', function(data) {
        $rootScope.vacancyChangeInterviewDate.date = data.date;
    }).on('hide', function() {
        if ($('.changeVacancyInterviewDatePicker').val() == "") {
            $rootScope.vacancyChangeInterviewDate.date = null;
        }
    });

    listenerForScope($scope, $rootScope);

    $scope.getBrowser = function() {
        if (navigator.saysWho.indexOf("Chrome") != -1) {
            return "chrome";
        } else if (navigator.saysWho.indexOf("Firefox") != -1) {
            return "firefox";
        } else {
            return "all";
        }
    };

    $rootScope.readAt = function(answer) {
        Service.readAt({answer: answer, at: {atId: $rootScope.at.atId}}, function(resp) {
            $("#atwindow.modal").modal("hide");
            $rootScope.at = null;
            $("#atwindow.modal .field").html('');
        });
    };

    function scope_update(val) {
        $scope.tableParams.reload();
    }
        $scope.upcomingEventsUpdate = function (val) {
            var previousScope = $rootScope.upcomingEventsScope;
            if(val == 'onlyMy') {
                $rootScope.upcomingEventsScope = true;
                $(".upcomingScopeSwticher").prop( "checked", true );
            }else if(val == 'allUsers') {
                $rootScope.upcomingEventsScope = false;
                $(".upcomingScopeSwticher").prop( "checked", false );
            }else if(val == 'switch') {
                $rootScope.upcomingEventsScope = !$rootScope.upcomingEventsScope;
            }
            if(previousScope != $rootScope.upcomingEventsScope) {
                $scope.tableParams.reload();
            }
            localStorage.upcomingEventsScope = $rootScope.upcomingEventsScope;
    };

    ScopeService.setCurrentControllerUpdateFunc(scope_update);
    //this function created for  care about correct change user information after as change inform in scope happened
    $scope.tableParams = {
        reload: function() {
            if (ScopeService.isInit()) {
                var activeParam = ScopeService.getActiveScopeObject();
                $scope.activeScopeParam = activeParam;
                var requestQuery = {
                    personId: activeParam.name == 'onlyMy' || $rootScope.upcomingEventsScope ? $rootScope.userId : null
                };
                requestQuery.country = activeParam.name == 'region' && activeParam.value.type == "country" ? activeParam.value.value : null;
                requestQuery.city = activeParam.name == 'region' && activeParam.value.type == "city" ? activeParam.value.value : null;
                Vacancy.getEvents(requestQuery, function(resp) {
                    $scope.events = $filter('getorders')(resp.objects);
                    if (activeParam.name == 'region' || activeParam.name == 'onlyMy') {
                        $scope.showEvents = true
                    } else {

                        if($rootScope.me.recrutRole!='admin'){
                            $scope.showEvents=true
                        }else{
                            $scope.showEvents = resp.objects != undefined && resp.objects.length > 0;
                        }
                    }
                    $rootScope.loading = false;
                });
            }
        }
    };

    Person.getAllPersons(function (resp) {
        $scope.persons = [];
        if(resp.status == "ok"){
            $scope.associativePerson = resp.object;
            angular.forEach($scope.associativePerson, function (val, key) {
                $scope.persons.push($scope.associativePerson[key]);
            });
            $rootScope.persons = $scope.persons;
        }
    });
    $scope.newStickerObject = {text: "", "title": ""};

    $scope.saveNewSticker = function() {
        $scope.newStickerObject.scope = "user";
        Sticker.save($scope.newStickerObject, function(val) {
            if (val.status != "error") {
                val.object.color = val.color = {
                    "background-color": $scope.paletteColorMap.white.color,
                    name: $scope.paletteColorMap.white.name
                };
                if ($scope.stickers == undefined)  $scope.stickers = [];
                $scope.stickers.unshift(val.object);
                $scope.newStickerObject = {text: "", "title": ""};
                $scope.show_add = false;
            }
        });

    };

    $scope.hidePalette = function(object) {
        object.mouseover = false;
        setTimeout(function() {
            if (!object.mouseover) {
                object.palette_show = false;
                if (!object.$$phase) {
                    object.$apply();
                }
            }
        }, 300);
    };

    $scope.showPalette = function(object) {
        object.mouseover = true;
        object.palette_show = true;
    };


    $scope.paletteColor = [
        {color: "rgb(255, 255, 255)", name: "white"},
        {color: "rgb(255, 109, 63)", name: "red"},
        {color: "rgb(255, 155, 0)", name: "orange"},
        {color: "rgb(255, 218, 0)", name: "yellow"},
        {color: "rgb(149, 214, 65)", name: "green"},
        {color: "rgb(28, 232, 181)", name: "teal"},
        {color: "rgb(63, 195, 255)", name: "blue"},
        {color: "rgb(184, 196, 201)", name: "gray"}
    ];

    $scope.paletteColorMap = {
        "white": {color: "rgb(255, 255, 255)", name: "white"},
        "red": {color: "rgb(255, 109, 63)", name: "red"},
        "orange": {color: "rgb(255, 155, 0)", name: "orange"},
        "yellow": {color: "rgb(255, 218, 0)", name: "yellow"},
        "green": {color: "rgb(149, 214, 65)", name: "green"},
        "teal": {color: "rgb(28, 232, 181)", name: "teal"},
        "blue": {color: "rgb(63, 195, 255)", name: "blue"},
        "gray": {color: "rgb(184, 196, 201)", name: "gray"}
    };

    $scope.changeColor = function(sticker, color) {
        if (color && sticker) {
            sticker.color = {"background-color": color.color, name: color.name};

            var stickerS = angular.copy(sticker);
            stickerS.color = color.name;
            Sticker.save(stickerS, function(val) {
                console.log(val);
            });
        }

    };
    $scope.test_one = function(element) {
        $(this).parent().find(".sticker-palette").css({display: "inline-block"});
    };

    $scope.stickerDelete = function(index) {
        if (confirm($filter('translate')('Are you sure you want to remove this sticker?')) == true) {
            var sticker = $scope.stickers[index];
            var stickerS = angular.copy(sticker);
            stickerS.color = stickerS.color.name;
            stickerS.status = "deleted";
            Sticker.save(stickerS, function(val) {
                $scope.stickers.splice(index, 1);
            });
        }
    };

    $scope.openModal = function(object) {
        if ($filter('countOfTextInSticker')(object.text) > 210) {
            $rootScope.stickerViewInfo.show = true;
            $rootScope.stickerEditInfo.show = false;
            $rootScope.stickerViewInfo.text = object.text;
            $rootScope.stickerViewInfo.object = object;
            $rootScope.stickerViewInfo.title = object.title;
            $rootScope.stickerViewInfo.author = object.creator;
            $(".viewingStickerInfo").modal("show");
        }
    };

    $scope.editSticker = function(scope) {
        var sticker = scope.sticker;
        scope.newStickerText = sticker.text != undefined && sticker.text.length > 0 ? sticker.text : "";
        scope.newStickerTitle = sticker.title != undefined && sticker.title.length > 0 ? sticker.title : "";
        scope.sticker_text_show = false;
    };

    $rootScope.closeAddSticker = function() {
        if (!$rootScope.stickerViewInfo.object)
            $(".viewingStickerInfo").modal("hide");
        $rootScope.stickerViewInfo.show = true;
        $rootScope.stickerEditInfo.show = false;
    };

    $rootScope.saveSticker = function(scope) {
        scope.sticker.text = scope.newStickerText;
        scope.sticker.title = scope.newStickerTitle;
        var stickerS = angular.copy(scope.sticker);
        stickerS.color = stickerS.color.name;
        Sticker.save(stickerS, function(val) {
            if (val.status != "error") {
                scope.sticker_text_show = true;
                scope.newStickerText = "";
                scope.newStickerTitle = "";
            }
        });
    };
    $scope.vacancyAll = {
        personId: $rootScope.userId,
        pages: {count: 15}
    };
    Vacancy.getWithLastAction($scope.vacancyAll, function(resp){
        $scope.activeVacancy = resp.objects;
        //console.log($scope.activeVacancy);
    });

    if ($rootScope.eventListenerPing) {
        document.removeEventListener('cleverstaffExtensionPong', $rootScope.eventListenerPing);
    }
    $rootScope.eventListenerPing = function (event) {
        $scope.extensionHas = true;
    };
    document.addEventListener('cleverstaffExtensionPong', $rootScope.eventListenerPing);
    document.dispatchEvent(new CustomEvent('cleverstaffExtensionPing'));
    $scope.achieveParametr = {
        names: ["changeInterviewState","createOrg","addInterview","orgLogo","addClient","addEmailForParsing","addContactClient","candidateToVacancy","addUsers",
            "sendCandidatesToClient","publishVacancy","plugin","browser","addVacancy","closeVacancy","addCandidateFromLink"],
        browser: $scope.getBrowser(),
        plugin: $scope.extensionHas
    };

    $scope.updateAchieve = function(){
        Achieve.get($scope.achieveParametr, function(resp){
            if(resp.status == "ok"){
                $scope.achieveDone = resp.object.first_wave.countAll - resp.object.first_wave.countHas;
                $scope.achieveDone2 = resp.object.second_wave.countAll - resp.object.second_wave.countHas;
                $scope.publicBrowser = $scope.getBrowser();
                $scope.achieves = resp.object.first_wave.achieves;
                $scope.achieves2 = resp.object.second_wave.achieves;
                if(resp.object.first_wave.countHas){
                    $scope.achievePercent = Math.round(resp.object.first_wave.countHas * 100 / resp.object.first_wave.countAll + 0.22222222222222222222);
                }else{
                    $scope.achievePercent = 0;
                }
                if(resp.object.second_wave.countHas){
                    $scope.achievePercent2 = Math.round(resp.object.second_wave.countHas * 100 / resp.object.second_wave.countAll + 0.22222222222222222222);
                }else{
                    $scope.achievePercent2 = 0;
                }
                $scope.achievePercentNotDone = 100 - $scope.achievePercent;
                $scope.achievePercentNotDone2 = 100 - $scope.achievePercent2;
                if ($scope.achievePercent < 40) {
                    color = '#C5393A'; //red
                } else if ($scope.achievePercent >= 40 && $scope.achievePercent < 85) {
                    color = '#E78409'; //orange
                } else if ($scope.achievePercent >= 85) {
                    color = '#74B830'; //green
                } else {
                    var color = '#CCCCCC'; //grey
                }
                if ($scope.achievePercent2 < 40) {
                    colorTwo = '#C5393A'; //red
                } else if ($scope.achievePercent2 >= 40 && $scope.achievePercent2 < 85) {
                    colorTwo = '#E78409'; //orange
                } else if ($scope.achievePercent2 >= 85) {
                    colorTwo = '#74B830'; //green
                } else {
                    var colorTwo = '#CCCCCC'; //grey
                }
                $scope.progressAchieve = {width: $scope.achievePercent + '%', 'background-color': color};
                $scope.progressAchieve2 = {width: $scope.achievePercent2 + '%', 'background-color': colorTwo};
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
                if($scope.achieves){
                    if($rootScope.me.personId == $rootScope.me.org.creatorId){
                        if($scope.achieves.createOrg && $scope.achieves.createOrg.value == 'false'){
                            $scope.source = 'createAcc';
                        } else if($scope.achieves.addEmailForParsing && $scope.achieves.addEmailForParsing.value == 'false'){
                            $scope.source = 'linkMail';
                        } else if($scope.achieves.addUsers && $scope.achieves.addUsers.value == 'false'){
                            $scope.source = 'addUsers';
                        } else if($scope.achieves.browser && $scope.achieves.browser.value == 'false'){
                            $scope.source = 'browser';
                        } else if($scope.achieves.plugin && $scope.achieves.plugin.value == 'false'){
                            $scope.source = 'browser';
                        } else if($scope.achieves.addCandidateFromLink && $scope.achieves.addCandidateFromLink.value == 'false'){
                            $scope.source = 'addCandidateFromLink';
                        } else if($scope.achieves.addClient && $scope.achieves.addClient.value == 'false'){
                            $scope.source = 'addClient';
                        } else if($scope.achieves.addContactClient && $scope.achieves.addContactClient.value == 'false'){
                            $scope.source = 'addContactClient';
                        } else if($scope.achieves.addVacancy && $scope.achieves.addVacancy.value == 'false'){
                            $scope.source = 'addVacancy';
                        } else if($scope.achieves.changeInterviewState && $scope.achieves.changeInterviewState.value == 'false'){
                            $scope.source = 'changeInterviewState';
                        }else if($scope.achieves.orgLogo && $scope.achieves.orgLogo.value == 'false'){
                            $scope.source = 'orgLogo';
                        }else if($scope.achieves.publishVacancy && $scope.achieves.publishVacancy.value == 'false'){
                            $scope.source = 'publishVacancy';
                        }else if($scope.achieves.candidateToVacancy && $scope.achieves.candidateToVacancy.value == 'false'){
                            $scope.source = 'candidateToVacancy';
                        }else if($scope.achieves.sendCandidatesToClient && $scope.achieves.sendCandidatesToClient.value == 'false'){
                            $scope.source = 'sendCandidatesToClient';
                        }else if($scope.achieves.addInterview && $scope.achieves.addInterview.value == 'false'){
                            $scope.source = 'addInterview';
                        }else if($scope.achieves.closeVacancy && $scope.achieves.closeVacancy.value == 'false'){
                            $scope.source = 'closeVacancy';
                        }else if($scope.achieves.uploadArchive && $scope.achieves.uploadArchive.value == 'false'){
                            $scope.source = 'uploadArchive';
                        }else if($scope.achieves.addCandidateFromCV && $scope.achieves.addCandidateFromCV.value == 'false'){
                            $scope.source = 'addCandidateFromCV';
                        }
                    } else{
                        if( $scope.achieves.addEmailForParsing && $scope.achieves.addEmailForParsing.value == 'false'){
                            $scope.source = 'linkMail';
                        } else if($scope.achieves.browser && $scope.achieves.browser.value == 'false'){
                            $scope.source = 'browser';
                        } else if($scope.achieves.plugin && $scope.achieves.plugin.value == 'false'){
                            $scope.source = 'browser';
                        } else if($scope.achieves.addCandidateFromLink && $scope.achieves.addCandidateFromLink.value == 'false'){
                            $scope.source = 'addCandidateFromLink';
                        } else if($scope.achieves.addClient && $scope.achieves.addClient.value == 'false'){
                            $scope.source = 'addClient';
                        } else if($scope.achieves.addContactClient && $scope.achieves.addContactClient.value == 'false'){
                            $scope.source = 'addContactClient';
                        } else if($scope.achieves.addVacancy && $scope.achieves.addVacancy.value == 'false'){
                            $scope.source = 'addVacancy';
                        } else if($scope.achieves.changeInterviewState && $scope.achieves.changeInterviewState.value == 'false'){
                            $scope.source = 'changeInterviewState';
                        }else if($scope.achieves.publishVacancy && $scope.achieves.publishVacancy.value == 'false'){
                            $scope.source = 'publishVacancy';
                        }else if($scope.achieves.candidateToVacancy && $scope.achieves.candidateToVacancy.value == 'false'){
                            $scope.source = 'candidateToVacancy';
                        }else if($scope.achieves.sendCandidatesToClient && $scope.achieves.sendCandidatesToClient.value == 'false'){
                            $scope.source = 'sendCandidatesToClient';
                        }else if($scope.achieves.addInterview && $scope.achieves.addInterview.value == 'false'){
                            $scope.source = 'addInterview';
                        }else if($scope.achieves.closeVacancy && $scope.achieves.closeVacancy.value == 'false'){
                            $scope.source = 'closeVacancy';
                        }else if($scope.achieves.uploadArchive && $scope.achieves.uploadArchive.value == 'false'){
                            $scope.source = 'uploadArchive';
                        }
                    }
                }
                if($scope.achieves2){
                    if($rootScope.me.personId == $rootScope.me.org.creatorId){
                        if($scope.achieves2.closeVacancyUser3OrOrg6 && $scope.achieves2.closeVacancyUser3OrOrg6.value == 'false'){
                            $scope.source = 'closeVacancyUser3OrOrg6';
                        } else if($scope.achieves2.addCandidateFromLink400 && $scope.achieves2.addCandidateFromLink400.value == 'false'){
                            $scope.source = 'addCandidateFromLink400';
                        }else if($scope.achieves2.upload300resumeFromArchiveOrEmail && $scope.achieves2.upload300resumeFromArchiveOrEmail.value == 'false'){
                            $scope.source = 'upload300resumeFromArchiveOrEmail';
                        }else if($scope.achieves2.makePay && $scope.achieves2.makePay.value == 'false'){
                            $scope.source = 'makePay';
                        }
                    } else{
                        if($scope.achieves2.closeVacancyUser3OrOrg6 && $scope.achieves2.closeVacancyUser3OrOrg6.value == 'false'){
                            $scope.source = 'closeVacancyUser3OrOrg6';
                        } else if($scope.achieves2.addCandidateFromLink400 && $scope.achieves2.addCandidateFromLink400.value == 'false'){
                            $scope.source = 'addCandidateFromLink400';
                        }else if($scope.achieves2.upload300resumeFromArchiveOrEmail && $scope.achieves2.upload300resumeFromArchiveOrEmail.value == 'false'){
                            $scope.source = 'upload300resumeFromArchiveOrEmail';
                        }
                    }
                }
            }
        });
    };
    $scope.updateAchieve();
    $scope.achievePopup = function(){
        $('.helpIcon').popup({
            position : 'top center',
            on: 'click'
        });
        $('.achieveContainer').on('click',function(e){
            var kids = $(e.target).children('.helpIcon');
            kids.click();
        })
    };
    $scope.achievePopup();
    $scope.getPlugin = function() {
        if (navigator.saysWho.indexOf("Chrome") != -1) {
            window.open("https://chrome.google.com/webstore/detail/cleverstaff-extension/komohkkfnbgjojbglkikdfbkjpefkjem");
        } else if (navigator.saysWho.indexOf("Firefox") != -1) {
            //$window.open("https://addons.mozilla.org/firefox/addon/cleverstaff_extension");
            window.open("/extension/CleverstaffExtension4Firefox.xpi");
        } else {
            $("#bad-browser-modal").modal("show");
        }
    };
    $scope.achieveClicked = function(source){
        $scope.source = source;
    };

    $scope.share = function(sourse) {

        var link = $location.$$protocol + "://" + $location.$$host;
        if (sourse === 'linkedin') {
            if (!IN.User.isAuthorized()) {
                console.log('photoLink ' + $scope.publicImgLink);
                IN.User.authorize(function() {
                    IN.API.Raw("/people/~/shares")
                        .method("POST")
                        .body(JSON.stringify({
                            "content": {
                                "submitted-url": link,
                                "title": $filter('translate')('Congratulations') + ', CleverStaff Guru ' + $rootScope.me.cutFullName + '!',
                                "description": $filter('translate')('Text for social achieves'),
                                "submitted-image-url": $scope.publicImgLink
                            },
                            "visibility": {
                                "code": "anyone"
                            },
                            "comment": ''
                        }))
                        .result(function(r) {
                            notificationService.success($filter('translate')('News posted on your LinkedIn'));
                            //$scope.addPublish('linkedin');
                            autoRefreshIN();
                        })
                        .error(function(r) {
                            notificationService.error(r.message);
                        });
                }, "w_share");
            } else {
                console.log('photoLink ' + $scope.publicImgLink);
                IN.API.Raw("/people/~/shares")
                    .method("POST")
                    .body(JSON.stringify({
                        "content": {
                            "submitted-url": link,
                            "title": $filter('translate')('Congratulations') + ', CleverStaff Guru ' + $rootScope.me.cutFullName + '!',
                            "description": $filter('translate')('Text for social achieves'),
                            "submitted-image-url": $scope.publicImgLink
                        },
                        "visibility": {
                            "code": "anyone"
                        },
                        "comment": ""
                    }))
                    .result(function(r) {
                        notificationService.success($filter('translate')('News posted on your LinkedIn'));
                        //$scope.addPublish('linkedin');
                        autoRefreshIN();
                    })
                    .error(function(r) {
                        notificationService.error(r.message);
                    });
            }
        }
        if (sourse === 'facebook') {
            FB.getLoginStatus(function(response) {
                console.log('photoLink ' + $scope.publicImgLink);
                if (response.status === 'connected') {
                    FB.ui({
                            method: 'feed',
                            name: $filter('translate')('Congratulations') + ', CleverStaff Guru ' + $rootScope.me.cutFullName + '!',
                            caption: '',
                            description: $filter('translate')('Text for social achieves'),
                            link: link,
                            picture: $scope.publicImgLink
                        },
                        function(response) {
                            if (response && response.post_id) {
                                notificationService.success($filter('translate')('News posted on your Facebook'));
                                //$scope.addPublish('facebook');
                            } else {
                                notificationService.error($filter('translate')('News was not published.'));
                            }
                        });
                }
                else {
                    console.log('photoLink ' + $scope.publicImgLink);

                    FB.login(function() {
                        FB.ui({
                                method: 'feed',
                                name: $filter('translate')('Congratulations') + ', CleverStaff Guru ' + $rootScope.me.cutFullName + '!',
                                caption: '',
                                description:$filter('translate')('Text for social achieves'),
                                link: link,
                                picture: $scope.publicImgLink
                            },
                            function(response) {
                                if (response && response.post_id) {
                                    notificationService.success($filter('translate')('News posted on your Facebook'));
                                } else {
                                    notificationService.error($filter('translate')('News was not published.'));
                                }
                            });
                    });
                }
            });
        }
    };
    $scope.toggleAchieve1 = function ($event){
        $("#achieve1").slideToggle("slow");
        var toggleIconPlus = $($event.currentTarget).find('.indicator');

            toggleIconPlus.toggleClass('fa-plus fa-minus');


    };
    $scope.toggleAchieve2 = function ($event){
        if($scope.achievePercent >= 100){
            $("#achieve2").slideToggle("slow");
            $($event.currentTarget).find(" .indicator").toggleClass('fa-minus fa-plus');
        }
    };



        $scope.popoverPosition = function (event, height) {
            var popoverTop = $(event.target).position().top - height - 5 + "px";
            if(!$scope.popoverStyleElem){
                $scope.popoverStyleElem = $("<style>").prop("type", "text/css")
                    .html("\
                .achievement-block .achievement-list .events_c .achieveContainer .popover{\
                top: " + popoverTop + " !important;\
                }")
                    .appendTo("head");
            }else{
                $scope.popoverStyleElem.html("\
                .achievement-block .achievement-list .events_c .achieveContainer .popover{\
                top: " + popoverTop + " !important;\
                }");
            }
        };


    $scope.htmlPopover = $sce.trustAsHtml("<div class='popupOuter'><a href='#/email-integration' target='_blank'><img src='../images/sprite/achievesImg/Import_from_email.png' alt='' class='achieveImg'/></a><i class='fa fa-times stlForImg' aria-hidden='true'></i></div>");
    $scope.htmlPopover2 = $sce.trustAsHtml("<div class='popupOuter'><img src='../images/sprite/achievesImg/3.png' alt='' class='achieveImg'/><i class='fa fa-times stlForImg' aria-hidden='true'></i></div>");
    $scope.htmlPopover3 = $sce.trustAsHtml("<div class='popupOuter'><img src='../images/sprite/achievesImg/4.png' alt='' class='achieveImg'/><i class='fa fa-times stlForImg' aria-hidden='true'></i></div>");
    $scope.htmlPopover4 = $sce.trustAsHtml("<div class='popupOuter'><img src='../images/sprite/achievesImg/ustanovit-vascherenie-dlya-Chome.png' alt='' class='achieveImg'/><i class='fa fa-times stlForImg' aria-hidden='true'></i></div>");
    $scope.htmlPopover5 = $sce.trustAsHtml("<div class='popupOuter'><a href='#/email-integration' target='_blank'><img src='../images/sprite/achievesImg/6.png' alt='' class='achieveImg'/></a><i class='fa fa-times stlForImg' aria-hidden='true'></i></div>");
    $scope.htmlPopover6 = $sce.trustAsHtml("<div class='popupOuter'><a href='#/candidate/add' target='_blank'><img src='../images/sprite/achievesImg/Upload_cv.png' alt='' class='achieveImg'/></a><i class='fa fa-times stlForImg' aria-hidden='true'></i></div>");
    $scope.htmlPopover7 = $sce.trustAsHtml("<div class='popupOuter'><a href='#/client/add' target='_blank'><img src='../images/sprite/achievesImg/Dobavit-zakazchika.png' alt='' class='achieveImg'/></a><i class='fa fa-times stlForImg' aria-hidden='true'></i></div>");
    $scope.htmlPopover8 = $sce.trustAsHtml("<div class='popupOuter'><a href='#/email-integration' target='_blank'><img src='../images/sprite/achievesImg/Add_contact.png' alt='' class='achieveImg'/></a><i class='fa fa-times stlForImg' aria-hidden='true'></i></div>");
    $scope.htmlPopover9 = $sce.trustAsHtml("<div class='popupOuter'><a href='#/vacancy/add' target='_blank'><img src='../images/sprite/achievesImg/Add_vacancy.png' alt='' class='achieveImg'/></a><i class='fa fa-times stlForImg' aria-hidden='true'></i></div>");
    $scope.htmlPopover10 = $sce.trustAsHtml("<div class='popupOuter'><a href='#/candidate/add/zip' target='_blank'><img src='../images/sprite/achievesImg/upload_cvs_arcive.png' alt='' class='achieveImg'/></a><i class='fa fa-times stlForImg' aria-hidden='true'></i></div>");
    $scope.htmlPopover11 = $sce.trustAsHtml("<div class='popupOuter'><img src='../images/sprite/achievesImg/izmenit-etapi-kandidatov.png' alt='' class='achieveImg'/></a><i class='fa fa-times stlForImg' aria-hidden='true'></i></div>");
    $scope.htmlPopover12 = $sce.trustAsHtml("<div class='popupOuter'><a href='#/company/settings' target='_blank'><img src='../images/sprite/achievesImg/Upload_logo.png' alt='' class='achieveImg'/></a><i class='fa fa-times stlForImg' aria-hidden='true'></i></div>");
    $scope.htmlPopover13 = $sce.trustAsHtml("<div class='popupOuter'><img src='../images/sprite/achievesImg/opublikovat-vakansiy-v-sotsseti.png' alt='' class='achieveImg'/><i class='fa fa-times stlForImg' aria-hidden='true'></i></div>");
    $scope.htmlPopover14 = $sce.trustAsHtml("<div class='popupOuter'><img src='../images/sprite/achievesImg/add_candidate_to_vacancy.png' alt='' class='achieveImg'/><i class='fa fa-times stlForImg' aria-hidden='true'></i></div>");
    $scope.htmlPopover15 = $sce.trustAsHtml("<div class='popupOuter'><img src='../images/sprite/achievesImg/Send-candidates-to-the-client-by-email.png' alt='' class='achieveImg'/><i class='fa fa-times stlForImg' aria-hidden='true'></i></div>");
    $scope.htmlPopover16 = $sce.trustAsHtml("<div class='popupOuter'><img src='../images/sprite/achievesImg/naznachit-sobesedovanie.png' alt='' class='achieveImg'/><i class='fa fa-times stlForImg' aria-hidden='true'></i></div>");
    $scope.htmlPopover17 = $sce.trustAsHtml("<div class='popupOuter'><img src='../images/sprite/achievesImg/zakrit-vakansiy.png' alt='' class='achieveImg'/><i class='fa fa-times stlForImg' aria-hidden='true'></i></div>");

            angular.element(document.body).bind('click', function (e) {
                var popups = document.querySelectorAll('.popover');
                if(popups) {
                    for(var i=0; i<popups.length; i++) {
                        var popup = popups[i];
                        var popupElement = angular.element(popup);
                        var content;
                        var arrow;
                        if(popupElement.next()) {
                            //The following is the content child in the popovers first sibling
                            // For the classic popover with Angularjs Ui Bootstrap
                            content = popupElement[0].querySelector('.popover-content');
                            // For the templating popover (popover-template attrib) with Angularjs Ui Bootstrap
                            bodytempl = popupElement[0].querySelector('.popover-body');
                            headertempl= popupElement[0].querySelector('.popover-title');
                            //The following is the arrow child in the popovers first sibling
                            // For both cases.
                            arrow = popupElement[0].querySelector('.arrow');
                        }
                        //console.log(content);
                        //console.log(bodytempl);
                        //console.log(headertempl);
                        if(popupElement[0].previousSibling!=e.target && e.target != content && e.target != arrow && e.target != bodytempl && e.target != headertempl){
                            //popupElement.scope().$parent.isOpen=false;
                            popupElement.remove();
                        }
                    }
                }
            });




        $.getScript("https://platform.linkedin.com/in.js?async=true", function success() {
        IN.init({
            api_key: apiKey.linkedIn.api_key,
            scope: "r_emailaddress w_share"
        });
    });
    $.getScript('//connect.facebook.net/en_UK/sdk.js', function() {
        FB.init({
            appId: apiKey.facebook.appId,
            version: 'v2.9'
        });
    });

    $rootScope.switchTabs = function(){
        $rootScope.showAchieves = !$rootScope.showAchieves;
        localStorage.showAchieves = $rootScope.showAchieves;
    };
    $scope.tableParams.reload();

    $rootScope.openAchievesCongrat = function () {
        $('.congrat.modal').modal('show');
    };
    //
    //$scope.openChangeVacancyInterviewDate = function(interviewObject) {
    //    $rootScope.vacancyChangeInterviewDate.interviewObject = interviewObject;
    //    $rootScope.vacancyChangeInterviewDate.date = interviewObject.date;
    //    $rootScope.vacancyChangeInterviewDate.candidate = interviewObject.candidate.candidateId;
    //    $rootScope.vacancyChangeInterviewDate.dateOld = angular.copy(interviewObject.date);
    //    if ($rootScope.vacancyChangeInterviewDate.date != undefined) {
    //        $(".changeVacancyInterviewDatePicker").datetimepicker("setDate", new Date(angular.copy(interviewObject.date)));
    //    } else {
    //        $(".changeVacancyInterviewDatePicker").val("");
    //    }
    //    $('.changeVacancyInterviewDate.modal').modal('show');
    //};

    $rootScope.saveChangedVacancyInterview = function() {
        var object = $rootScope.vacancyChangeInterviewDate;
        var newDate = $('.changeVacancyInterviewDatePicker').datetimepicker('getDate') != null ?
            $('.changeVacancyInterviewDatePicker').datetimepicker('getDate').getTime() : null;
        Vacancy.changeInterviewDate({
            interviewId: object.interviewObject.interviewId,
            date: newDate,
            comment: object.comment != null ? object.comment : "",
            lang: $translate.use()
        }, function(resp) {
            $scope.tableParams.reload();
            object.interviewObject.dateInterview = newDate;
           $rootScope.closeModal();
            if ($rootScope.selectedCalendar != undefined) {
                googleCalendarUpdateEvent(googleService, new Date(newDate), resp.object.candidateId.fullName,
                    $scope.vacancy.position, $scope.selectedCalendar != undefined ? $scope.selectedCalendar.id : null,
                    resp.object.comment, resp.object.interviewId + object.interviewObject.state, $filter);

            }
            var activeParam = ScopeService.getActiveScopeObject();
            $scope.activeScopeParam = activeParam;
            var requestQuery = {
                personId: activeParam.name == 'onlyMy' ? $rootScope.userId : null
            };
            requestQuery.country = activeParam.name == 'region' && activeParam.value.type == "country" ? activeParam.value.value : null;
            requestQuery.city = activeParam.name == 'region' && activeParam.value.type == "city" ? activeParam.value.value : null;
            Vacancy.getEvents(requestQuery, function(resp) {
                $scope.events = $filter('getorders')(resp.objects);
                if (activeParam.name == 'region' || activeParam.name == 'onlyMy') {
                    $scope.showEvents = true
                } else {

                    if($rootScope.me.recrutRole!='admin'){
                        $scope.showEvents=true
                    }else{
                        $scope.showEvents = resp.objects != undefined && resp.objects.length > 0;
                    }
                }
                $rootScope.loading = false;
            });
        });
    };
        if($rootScope.me.recrutRole != 'client'){
            $timeout(function(){
                if($rootScope.questStatus){
                    if ($rootScope.questStatus.letsCelebratePopup == 'Y') {
                        $rootScope.modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: '../partials/modal/HelloQuest/helloQuestStart.html',
                            size: 'lg',
                            backdrop: 'static',
                            keyboard: false,
                            resolve: function () {

                            }
                        });
                    }
                    if ($rootScope.questStatus.onboardingQuestPopup == 'Y') {
                        $rootScope.modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: '../partials/modal/HelloQuest/helloQuestOnBoard.html',
                            size: '',
                            backdrop: 'static',
                            keyboard: false,
                            resolve: function () {

                            }
                        });
                    }
                }
            },0);
            //Person.changeUserParam({
            //    userId: 'userId',
            //    name: 'letsCelebratePopup',
            //    value: 'Y'
            //}, function (resp){});
            $rootScope.continueQuest = function (key) {
                $rootScope.loading = true;
                Person.changeUserParam({
                    name: key,
                    value: 'Y'
                }, function (resp) {
                    if (resp.status == "ok") {
                        $rootScope.updateQuestStatus();
                        $location.path("/candidates");
                        $timeout(function(){
                            $rootScope.loading = false;
                        }, 500);
                    }else{
                        notificationService.error(resp.message);
                    }
                });
            };
            $rootScope.finishQuest = function () {
                $rootScope.closeModal();
                Person.changeUserParam({
                    name: 'onboardingQuestPopup',
                    value: 'N'
                }, function (resp) {
                    if (resp.status == "ok") {
                        $rootScope.updateQuestStatus();
                    }else{
                        notificationService.error(resp.message);
                    }
                });
            };
        }
            $rootScope.closeModal = function () {
                $scope.modalInstance.close();
            };

    $rootScope.changeTaskState = function(task){
        Task.changeState({
            "taskId": task.taskId,
            "taskState":task.status == 'open'? "completed" : 'open'
        }, function(resp){
            if(resp.status == 'ok'){
                if($rootScope.editableTask){
                    $rootScope.editableTask = resp.object;
                }
                $scope.tableParams.reload();
            }else{
                notificationService.error(resp.message);
            }
        })
    };
        $(".changeDateNewTask").datetimepicker({
            format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy hh:00" : "mm/dd/yyyy hh:00",
            startView: 2,
            minView: 1,
            autoclose: true,
            weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
            language: $translate.use(),
            initialDate: new Date(),
            startDate: new Date()
        }).on('changeDate', function (data) {
            console.log(data);
            $rootScope.newTask.targetDate = $('.changeDateNewTask').datetimepicker('getDate');
            $scope.roundMinutes($rootScope.newTask.targetDate)
        }).on('hide', function () {
            if ($('.changeDateNewTask').val() == "") {
                $rootScope.newTask.date = "";
            }
        });
        $(".withoutTimeTask").datetimepicker({
            format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy hh:00" : "mm/dd/yyyy hh:00",
            startView: 2,
            minView: 1,
            autoclose: true,
            weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
            language: $translate.use(),
            initialDate: new Date(),
            startDate: new Date()
        }).on('changeDate', function (data) {
            $rootScope.editableTask.targetDate = $('.withoutTimeTask').datetimepicker('getDate');
            $scope.roundMinutes($rootScope.editableTask.targetDate);
            Task.changeTargetDate({
                "taskId": $rootScope.editableTask.taskId,
                "date":$rootScope.editableTask.targetDate
            }, function(resp){
                $scope.tableParams.reload();
            })
        }).on('hide', function () {
            if ($('.withoutTimeTask').val() == "") {
                $rootScope.editableTask.date = "";
            }
        });


    //    $rootScope.editNameTask = function(hideModal){
    //    if($rootScope.editableTask.title.length > 0){
    //        $rootScope.editableTask.responsibleIds = [];
    //        angular.forEach($rootScope.responsiblePersons, function(resp){
    //            $rootScope.editableTask.responsibleIds.push(resp.userId)
    //        });
    //        Task.edit({
    //            "taskId": $rootScope.editableTask.taskId,
    //            "status": $rootScope.editableTask.status,
    //            "title": $rootScope.editableTask.title,
    //            "text": $rootScope.editableTask.text,
    //            "targetDate": $rootScope.editableTask.targetDate,
    //            "responsibleIds": $rootScope.editableTask.responsibleIds,
    //            "type": $rootScope.editableTask.type
    //        }, function(resp){
    //            if(resp.status == 'ok'){
    //                $rootScope.showEditNameTask = false;
    //                $rootScope.showEditTextTask = false;
    //                $scope.tableParams.reload();
    //                if(!hideModal){
    //                    $rootScope.closeModal();
    //                }
    //            }else{
    //                notificationService.error(resp.message);
    //            }
    //        })
    //    }else{
    //        notificationService.error($filter('translate')('Please enter a title for the task'));
    //    }
    //};
    //$rootScope.deleteTask = function(){
    //    Task.changeState({
    //        "taskId": $rootScope.editableTask.taskId,
    //        "taskState":'deleted'
    //    }, function(resp){
    //        if(resp.status == 'ok'){
    //            $rootScope.closeModal();
    //            //$('.editTaskInCandidate').modal('hide');
    //            $scope.tableParams.reload();
    //        }else{
    //            notificationService.error(resp.message);
    //        }
    //    })
    //};

    $scope.roundMinutes = function(date) {

        date.setHours(date.getHours());
        date.setMinutes(0);

        return date;
    };
        //$rootScope.addResponsibleInEdit = function(responsible){
        //    var i = 0;
        //    angular.forEach($rootScope.responsiblePersons, function(resp){
        //        if (resp.userId == responsible.userId){
        //            i++;
        //        }
        //    });
        //    if (i > 0){
        //        notificationService.error($filter('translate')('This user already responsible for this task'));
        //    }else{
        //        responsible.notShown = true;
        //        $rootScope.responsiblePersons.unshift(responsible);
        //    }
        //    $rootScope.editNameTask(true);
        //};
        //$rootScope.deleteResponsibleInEdit = function(responsible){
        //    if($rootScope.responsiblePersons.length > 1){
        //        angular.forEach($rootScope.responsiblePersons, function(resp){
        //            if (resp.userId == responsible.userId){
        //                responsible.notShown = false;
        //                $rootScope.responsiblePersons.splice($rootScope.responsiblePersons.indexOf(resp), 1);
        //            }
        //        });
        //        $rootScope.editNameTask(true);
        //    }else{
        //        notificationService.error($filter('translate')('The task must have at least one responsible'));
        //    }
        //};

        $scope.showModalUsersLogoutNotification = function(){
            $('.usersLogoutNotification').modal('setting',{
                onHide: function(){
                    localStorage.otherSessionsRemoves = false;
                }
            }).modal('show');
        };
        $document.ready(function(){
            if(localStorage.otherSessionsRemoves == 'true'){
                $scope.showModalUsersLogoutNotification();
            }
        });
        $rootScope.changeTabOnTask = function(val){
            if (val == "Task") {
                $rootScope.editableTask.type = 'Task';
            } else if (val == "Call") {
                $rootScope.editableTask.type = 'Call';
            } else if (val == "Meeting") {
                $rootScope.editableTask.type = 'Meeting';
            }
            $rootScope.editNameTask(true);
        };
        $scope.open = function (size) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/send-vacancy-by-email.html',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.getFirstLetters = function(str){
            return firstLetters(str)
        };
        $scope.CSNewsFeed = function(name){
            $scope.variable = $("." + name);
            if($scope.variable.css('display') == 'none'){
                $($scope.variable).slideDown();
                $('body').mouseup(function (e) {
                    if ($($scope.variable).has(e.target).length === 0) {
                        $scope.variable.slideUp();
                        $(document).off('mouseup');
                    }
                });
            }
        };

        $scope.showChangeInterviewTime = function(interviewObject){
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/organizer-change-interview-time.html',
                size: '',
                resolve: function () {

                }
            });
            $scope.modalInstance.opened.then(function() {
                setTimeout(function(){
                    $(".changeVacancyInterviewDatePicker").datetimepicker({
                        format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy hh:ii" : "mm/dd/yyyy hh:ii",
                        startView: 2,
                        minView: 0,
                        autoclose: true,
                        weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                        language: $translate.use()
                    }).on('changeDate', function(data) {
                        $rootScope.vacancyChangeInterviewDate.date = data.date;
                    }).on('hide', function() {
                        if ($('.changeVacancyInterviewDatePicker').val() == "") {
                            $rootScope.vacancyChangeInterviewDate.date = null;
                        }
                    });
                    $rootScope.vacancyChangeInterviewDate.interviewObject = interviewObject;
                    $rootScope.vacancyChangeInterviewDate.date = interviewObject.date;
                    $rootScope.vacancyChangeInterviewDate.candidate = interviewObject.candidate.candidateId;
                    $rootScope.vacancyChangeInterviewDate.dateOld = angular.copy(interviewObject.date);
                    if ($rootScope.vacancyChangeInterviewDate.date != undefined) {
                        $(".changeVacancyInterviewDatePicker").datetimepicker("setDate", new Date(angular.copy(interviewObject.date)));
                    } else {
                        $(".changeVacancyInterviewDatePicker").val("");
                    }
                },0)
            });
        };

        if($rootScope.currentLang == 'en'){
            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_EN/all.js#xfbml=1&version=v2.8&appId=1106253812731158";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }else{
            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/ru_RU/all.js#xfbml=1&version=v2.8&appId=1106253812731158";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }
}]);
