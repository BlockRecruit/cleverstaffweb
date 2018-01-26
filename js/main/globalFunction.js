function deleteUnnecessaryFields(object) {
    if (object) {
        delete object.actions;
        delete object.creator;
        delete object.responsible;
        delete object.files;
        delete object.interviews;
        delete object.customFields;
        delete object.level;
    }
}
function checkAccessLevel($rootScope, $location, Person) {
    if ($rootScope.me == undefined) {
        Person.getMe(function(resp) {
            if (resp != undefined && resp.personParams != undefined && resp.personParams.clientAccessLevel == 'hide') {
                $location.path('/organizer');
            }
        });
    } else if ($rootScope.me.personParams.clientAccessLevel == 'hide') {
        $location.path('/organizer');
    }
}
function pageScrollOnTop() {
    $("html, body").animate({scrollTop: 0}, "slow");
}
function listenerForScope($scope, $rootScope) {
    if ($rootScope.curentOnlyMenWatch !== undefined) {
        $rootScope.curentOnlyMenWatch();
    }
    if ($rootScope.curentRegionWatch !== undefined) {
        $rootScope.curentRegionWatch();
    }
    $rootScope.curentOnlyMenWatch = $rootScope.$watch('onlyMeChange', function(val) {
        if ($rootScope.onlyMeChange === true) {
            $scope.onlyMe = $rootScope.onlyMe;
            $rootScope.regionId = null;
            $scope.regionId = null;
            $scope.tableParams.reload();
        } else if ($rootScope.onlyMeChange === false) {
            $scope.tableParams.reload();
        }
        $rootScope.onlyMeChange = null;
    });
    $rootScope.curentRegionWatch = $rootScope.$watch('regionChange', function(val) {
        $scope.regionId = $rootScope.regionId;
        $scope.regionIdType = $rootScope.regionIdType;
        // console.log( $scope.regionId)
        if (val) {
            $rootScope.onlyMe = null;
            $scope.tableParams.reload();
            $rootScope.regionChange = false;
        }
    });
}
function listenerForScopeLight($scope, $rootScope) {
    if ($rootScope.curentOnlyMenWatch !== undefined) {
        $rootScope.curentOnlyMenWatch();
    }
    if ($rootScope.curentRegionWatch !== undefined) {
        $rootScope.curentRegionWatch();
    }
    $rootScope.curentOnlyMenWatch = $rootScope.$watch('onlyMeChange', function(val) {
        // console.log("Doasdoaosdkkpasdkopaskopdkoasokpd")
        if ($rootScope.onlyMeChange === true) {
            $scope.onlyMe = $rootScope.onlyMe;
            $rootScope.regionId = null;
            $scope.regionIdType = null;
            $scope.regionId = null;
            $scope.search();
        } else if ($rootScope.onlyMeChange === false) {
            $scope.search();
        }
        $rootScope.onlyMeChange = null;
    });
    $rootScope.curentRegionWatch = $rootScope.$watch('regionChange', function(val) {
        $scope.regionId = $rootScope.regionId;
        $scope.regionIdType = $rootScope.regionIdType;
        if (val) {
            $rootScope.onlyMe = null;
            $scope.search();
            $rootScope.regionChange = false;
        }
    });
}

function historyButton($scope, resp, Service, CacheCandidates) {
    $scope.history = resp.objects !== undefined ? resp.objects : null;
    $scope.historyLimit = resp.objects !== undefined ? resp.size : null;
    $scope.historyTotal = resp.objects !== undefined ? resp.total : null;
    var keepGoing = true;
    angular.forEach($scope.history, function(val) {
        if(keepGoing) {
        if(val.type == 'vacancy_message' ||
            val.type == 'candidate_message' ||
            val.type == 'interview_message' ||
            val.type == 'client_message'){
            $scope.showHistoryForPrint = true;
            keepGoing = false;
        }else{
        }
        }
    });
    var array = [];
    angular.forEach($scope.history, function(value){
        if(value.stateNew && value.type == "set_interview_status"){
            array = value.stateNew.split(",");
            angular.forEach($scope.customStagesFull,function(val){
                angular.forEach(array,function(resp){
                    if(val.customInterviewStateId == resp){
                        array[array.indexOf(val.customInterviewStateId)] = val.name;
                    }
                });
            });
            value.stateNew = array.toString();
        }
    });
    $scope.getMoreHistory = function() {
        Service.history({
            "vacancyId": $scope.vacancy != undefined ? $scope.vacancy.vacancyId : null,
            "page": {"number": 0, "count": $scope.historyLimit *= 2},
            "candidateId": $scope.candidate !== undefined ? $scope.candidate.candidateId : null,
            "clientId": $scope.client !== undefined ? $scope.client.clientId : null,
            "onlyWithComment": $scope.onlyComments ? true : false
        }, function(res) {
            if(res.status == 'ok'){
                $scope.history = res.objects;
            } else{
                notificationService.error(res.message);
            }
        });
    };
    $scope.getLastEvent = function(count) {z
        if (!count) {
            count = 1;
        }
        Service.history({
            "vacancyId": ($scope.vacancy !== undefined && $scope.vacancy !== null) ? $scope.vacancy.vacancyId : null,
            "page": {"number": 0, "count": count},
            "candidateId": ($scope.candidate !== undefined && $scope.candidate !== null) ? $scope.candidate.candidateId : null,
            "clientId": ($scope.client !== undefined && $scope.client !== null) ? $scope.client.clientId : null
        }, function(res) {
            if (res.status == 'ok') {
                $scope.showHistoryForPrint = false;
                var keepGoing = true;
                angular.forEach($scope.history, function(val, index) {
                    if(res.objects[0].actionId){
                        if (val.actionId == res.objects[0].actionId) {
                            $scope.history.splice(index, 1);
                        }
                    }
                    if(keepGoing) {
                        if(val.type == 'vacancy_message' ||
                            val.type == 'candidate_message' ||
                            val.type == 'interview_message' ||
                            val.type == 'client_message'){
                            $scope.showHistoryForPrint = true;
                            $scope.showCommentsFirstTime();
                            keepGoing = false;
                        }
                    }
                });
                if (res.objects) {
                    res.objects.reverse();
                    angular.forEach(res.objects, function(val, index) {
                        $scope.history.unshift(val)
                    });
                }
                angular.forEach($scope.history, function(value){
                    if(value.stateNew && value.type == "set_interview_status"){
                        array = value.stateNew.split(",");
                        angular.forEach($scope.customStages,function(val){
                            angular.forEach(array,function(resp){
                                if(val.customInterviewStateId == resp){
                                    array[array.indexOf(val.customInterviewStateId)] = val.name;
                                }
                            });
                        });
                        value.stateNew = array.toString();
                    }
                });

            }
            if ($scope.candidate || res && res.objects && res.objects[0].candidate) {
                CacheCandidates.updateLastHistory(res.objects[0]);
            }
        }, function(error) {
        });
    };


}

var openSelect = function(selector) {
    var element = $(selector)[0], worked = false;
    if (element != undefined) {
        if (document.createEvent) { // all browsers
            var e = document.createEvent("MouseEvents");
            e.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            worked = element.dispatchEvent(e);
        } else if (element.fireEvent) { // ie
            worked = element.fireEvent("onmousedown");
        }
        if (!worked) { // unknown browser / error
            alert("It didn't worked in your browser.");
        }
    }
};

function toISOStringWithoutTimeZone(date) {
    var _userOffset = date.getTimezoneOffset() * 60000;
    var _helsenkiTime = new Date(date.getTime() + _userOffset);
    return _helsenkiTime.toISOString();

}

function withoutISOStringWithoutTimeZoneDateObject(date) {
    var _userOffset = date.getTimezoneOffset() * 60000;
    var _helsenkiTime = new Date(date.getTime() - _userOffset);
    return _helsenkiTime;
}


function toISOStringWithoutTimeZoneDateObject(date) {
    var _userOffset = date.getTimezoneOffset() * 60000;
    var _helsenkiTime = new Date(date.getTime() + _userOffset);
    return _helsenkiTime;
}


function googleCalendarCreateEvent(googleService, startDate, fullName, vacancyPos, calId, comment, id, $filter) {
    var endDate = angular.copy(startDate);
    endDate.setHours(endDate.getHours() + 1);
    googleService.createEvent({
        "end": {
            "dateTime": endDate
        },
        "start": {
            "dateTime": startDate
        },
        "summary": $filter("translate")("Interview for") + " " + fullName
        + ". " + $filter("translate")("Vacancy") + ":" + vacancyPos,
        "calendarId": calId,
        "description": comment,
        "id": id + Math.floor(Math.random() * (9999999999999 - 0 + 1)) + 0

});
}
function createEventEndDate(startDate) {
    var endDate = angular.copy(startDate);
    endDate.setHours(endDate.getHours() + 1);
    return endDate;
}


function googleCalendarUpdateEvent(googleService, startDate, fullName, vacancyPos, calId, comment, id, $filter) {
    var endDate = angular.copy(startDate);
    endDate.setHours(endDate.getHours() + 1);
    googleService.updateEvent({
        "end": {
            "dateTime": endDate
        },
        "start": {
            "dateTime": startDate
        },
        "calendarId": calId,
        "summary": $filter("translate")("Interview for") + " " + fullName
        + ". " + $filter("translate")("Vacancy") + ":" + vacancyPos,
        "description": comment,
        "eventId": id
    });
}


function select2VacancyAutocompleter(serverAddress, id, $filter) {

}

function googleCalendarDeleteEvent(googleService, selectedCalendarId, eventId, statusOld) {
    googleService.deleteEvent({
        calendarId: selectedCalendarId,
        eventId: eventId
    });
}

function vacancyAddInterview(Vacancy, vacancyId, position, candidateId, comment, interviewState, date, callback, errorBack, frontMode, notificationService, googleService, selectedCalendarId, $filter, lang, $rootScope) {

    console.log(interviewState,'interviewState213');

    // $rootScope.status2 = false;
    $rootScope.hover = false;

    Vacancy.addInterview({
            "vacancyId": vacancyId,
            "candidateId": candidateId,
            "comment": comment,
            "interviewState": interviewState,
            "lang": lang,
            "date": date != null ? date.getTime() : null
        },
        function(resp,e) {
            if (angular.equals(resp.status, "ok")) {
                if (frontMode === 'war' && date !== null) {
                    if (position == null) {
                        Vacancy.one({"id": vacancyId}, function(res) {
                            if (resp.status == "ok") {
                                googleCalendarCreateEvent(googleService, date, resp.object.candidateId.fullName, res.object.position, selectedCalendarId, comment, resp.object.interviewId+interviewState, $filter);
                            }
                        });
                    } else {
                        googleCalendarCreateEvent(googleService, date, resp.object.candidateId.fullName, position, selectedCalendarId, comment, resp.object.interviewId+interviewState, $filter);
                    }
                }
                //if (date && $rootScope.candnotify.send && $rootScope.candnotify.sendMail.length > 1) {
                //    var candnotify = $rootScope.candnotify;
                //    Vacancy.sendInterviewCreateMail({
                //            "email": candnotify.sendMail,
                //            "vacancyId": vacancyId,
                //            "candidateId": candidateId,
                //            "fullName": candnotify.fullName,
                //            "date": date,
                //            "lang": lang
                //        },
                //        function(resp) {
                //        });
                //}
                callback(resp);
                notificationService.success($filter('translate')('added_candidate'));
            } else {
                notificationService.error($filter('translate')('Candidate has been added to this position'));
                errorBack(resp);
            }
        }, function(err) {
            //notificationService.error($filter('translate')('service temporarily unvailable'));
        });
}
function vacancyAddInterviewFromAdvice(Vacancy, vacancyId, position, candidateId, comment, interviewState, date, callback, errorBack, frontMode, notificationService, googleService, selectedCalendarId, $filter, lang, $rootScope) {
    console.log(interviewState);
    Vacancy.addInterview({
            "vacancyId": vacancyId,
            "candidateId": candidateId,
            "comment": comment,
            "interviewState": interviewState,
            "lang": lang,
            "date": date != null ? date.getTime() : null,
            interviewSource: 'advice'
        },
        function(resp) {
            if (angular.equals(resp.status, "ok")) {
                if (frontMode === 'war' && date !== null) {
                    if (position == null) {
                        Vacancy.one({"id": vacancyId}, function(res) {
                            if (resp.status == "ok") {
                                googleCalendarCreateEvent(googleService, date, resp.object.candidateId.fullName, res.object.position, selectedCalendarId, comment, resp.object.interviewId+interviewState, $filter);
                            }
                        });
                    } else {
                        googleCalendarCreateEvent(googleService, date, resp.object.candidateId.fullName, position, selectedCalendarId, comment, resp.object.interviewId+interviewState, $filter);
                    }
                }
                if (date && $rootScope.candnotify.send && $rootScope.candnotify.sendMail) {
                    var candnotify = $rootScope.candnotify;
                    Vacancy.sendInterviewCreateMail({
                            "email": candnotify.sendMail,
                            "vacancyId": vacancyId,
                            "candidateId": candidateId,
                            "fullName": candnotify.fullName,
                            "date": date,
                            "lang": lang
                        },
                        function(resp) {
                        });
                }
                callback(resp);
            } else {
                errorBack(resp);
            }
        }, function(err) {
            //notificationService.error($filter('translate')('service temporarily unvailable'));
        });
}


$('.plussHover').hover(function() {
    var block = $(this).next('.plussBlock');
    block.removeClass("blockDisplay");
    block.offset({top: $(this).position().top + $(this)[0].scrollHeight, left: $(this).position().left});
    block.css("width", $(this)[0].scrollWidth);
});
$('.plussHover').mouseleave(function(event) {
    var block = $(this).next('.plussBlock');
    block.addClass("blockDisplay");
});
$('.plussBlock').hover(function() {
    $(this).removeClass("blockDisplay");
});
$('.plussBlock').mouseleave(function() {
    $(this).addClass("blockDisplay");
});

var isAutoRefreshed = false;
function autoRefreshIN() {
    if (!isAutoRefreshed) {
        setInterval(function() {
            IN.User.refresh();
        }, 600000);
        isAutoRefreshed = true;
    }
}


function getExternalObject(source, external) {
    angular.forEach(source, function(val1) {
        var founded = false;
        var value;
        if (val1.check) {
            angular.forEach(external, function(val2) {
                if (val1.value == val2) {
                    founded = true;
                }
            })
        } else {
            founded = true;
        }
        if (!founded) {
            external.push(val1.value);
        }

    });
}
/**
 *
 **/

function getPlaceInfo(placeText, callback) {
    try {
        $("#crutchGoogleMap").append("<div id='googleCrutch'></div>");
        var map = new google.maps.Map(document.getElementById('googleCrutch'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoom: 15
        });
        var placeService = new google.maps.places.PlacesService(map);
        var service = new google.maps.places.AutocompleteService();
        service.getPlacePredictions({input: placeText, types: ['(regions)']}, function(val) {
            console.log(val);
            placeService.getDetails({"placeId": val[0].place_id}, function(val) {
                $("#crutchGoogleMap").empty();
                callback(val)
            });

        });
    } catch (e) {

    }
}

function isNotBlank(str) {
    if (!str) return false;
    if (str.trim() == "null" || str.trim() == "undefined") return false;
    return !/^\s*$/.test(str);
}


function convertToRegionObject(place, scope) {
    var object = {
        country: null,
        area: null,
        city: null,
        lat: null,
        lng: null,
        lang: "ru",
        regionId: null,
        fullName: "full"
    };
    console.log(place);
    if (place != null) {
        angular.forEach(place.address_components, function(val) {
            angular.forEach(val.types, function(valT) {
                switch (valT) {
                    case "country":
                        object.country = val.long_name;
                        break;
                    case "administrative_area_level_1":
                        object.area = val.long_name;
                        break;
                    case "locality":
                        object.city = val.long_name;
                        break;
                }
            });
        });
        object.regionId = place.id;
        object.googlePlaceId = {googlePlaceId: place.place_id};
        if (scope) {
            if (scope.map != undefined) {
                scope.map.center.latitude = place.geometry.location.lat();
                scope.map.center.longitude = place.geometry.location.lng();
            }
            if (scope.marker != undefined) {
                scope.marker.coords.latitude = place.geometry.location.lat();
                scope.marker.coords.longitude = place.geometry.location.lng();
            }
        }
        if (place.geometry != null) {
            object.lat = place.geometry.location.k;
            object.lng = place.geometry.location.D;
        } else {
            object.lat = 48.379433;
            object.lng = 31.165579999999977
        }
        object.fullName = place.formatted_address;
        return object;
    } else {
        return null;
    }
}
function addContactsInCandidateObject($scope) {
    var candidate = $scope.pageObject.employee.candidateId;
    var contacts = $scope.pageObject.contacts;
    var array = [];
    if (!candidate.contacts) {
        candidate.contacts = [];
    }
    if (contacts.email) {
        array.push({type: "email", value: contacts.email});
    }
    if (contacts.mphone) {
        array.push({type: "mphone", value: contacts.mphone});
    }
    if (contacts.skype) {
        array.push({type: "skype", value: contacts.skype});
    }
    if (contacts.linkedin) {
        array.push({type: "linkedin", value: contacts.linkedin});
    }
    if (contacts.facebook) {
        array.push({type: "facebook", value: contacts.facebook});
    }
    if (contacts.googleplus) {
        array.push({type: "googleplus", value: contacts.googleplus});
    }
    if (contacts.homepage) {
        array.push({type: "homepage", value: contacts.homepage});
    }
    candidate.contacts = array;
}

function differenceBetweenTwoDates(firstDate,secondDate){
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds

    return Math.round((new Date(firstDate) - secondDate)/(oneDay));
}
function getUrlVars(url) {
    var hash;
    var myJson = {};
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        myJson[hash[0]] = hash[1];
    }
    return myJson;
}
function initDocuments(file){
    var filenameArr = file.fileName.split(".");
    if(filenameArr[1]){
        filenameArr[1] = filenameArr[filenameArr.length - 1].toLowerCase();
        if( filenameArr[1] == 'doc' || filenameArr[1] == 'xls' || filenameArr[1] == 'xlsx' || filenameArr[1] == 'pptx' || filenameArr[1] == 'ttf' || filenameArr[1] == 'pdf' || filenameArr[1] == 'ppt' || filenameArr[1] == 'txt' || filenameArr[1] == 'rtf' || filenameArr[1] == 'odt'){
            file.showGDocs = true;
        }else if(filenameArr[1] == 'jpg' || filenameArr[1] == 'jpeg' || filenameArr[1] == 'png' || filenameArr[1] == 'gif'){
            file.showImg = true;
        }else if(filenameArr[1] == 'docx') {
            file.showGDocs = false;
        }
    }
}
function showModalResume(file,$scope,$rootScope,$location,$sce,$uibModal){
    var filenameArr = file.fileName.split(".");
    if(filenameArr[1]){
        filenameArr[1] = filenameArr[filenameArr.length - 1].toLowerCase();
        if(filenameArr[1] == 'doc' || filenameArr[1] == 'xls' || filenameArr[1] == 'xlsx' || filenameArr[1] == 'pptx' || filenameArr[1] == 'ttf' || filenameArr[1] == 'pdf' || filenameArr[1] == 'ppt' || filenameArr[1] == 'txt' || filenameArr[1] == 'rtf' || filenameArr[1] == 'odt'){
            file.showGDocs = true;
        }else if(filenameArr[1] == 'jpg' || filenameArr[1] == 'jpeg' || filenameArr[1] == 'png' || filenameArr[1] == 'gif'){
            file.showImg = true;
        } else if(filenameArr[1] == 'docx') {
            file.showGDocs = false;
        }
    }
    $rootScope.shownResume = file;
    if(file.showGDocs){
        $rootScope.linkFileForShow = "https://docs.google.com/viewer?embedded=true&url=http://" + $location.$$host + "/hr/showFile/" + file.fileId + "/" + encodeURI(file.fileName) + '?decache=' + Math.random();
        $rootScope.linkFileForShow = $sce.trustAsResourceUrl($rootScope.linkFileForShow);
    }else if(file.showImg){
        $rootScope.linkImgForShow = "/hr/getapp?id=" + file.fileId + "/";
    }
    if(file.showGDocs || file.showImg){
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '../partials/modal/candidate-show-file.html',
            size: 'lg',
            windowClass: 'show-resume'
        });
    }else{
        window.location = $scope.serverAddress + '/getapp/' + file.fileId + '/' +  file.fileName
    }
}
function showModalImg(imgName,$scope,$rootScope,$location,$sce){
    $rootScope.linkImgForShow = "../img/" + imgName;
    $('.showImg.modal').modal('show');
}
function roundMinutes (date) {

    date.setHours(date.getHours());
    date.setMinutes(0);

    return date;
}
var iter = 0;
function setDatePickerForOnce($rootScope, $translate, Task){
    iter++;
    if(iter == 1){
        $("#editDateTaskVacancy").datetimepicker({
            format: "dd/mm/yyyy hh:00",
            startView: 2,
            minView: 1,
            autoclose: true,
            weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
            language: $translate.use(),
            initialDate: new Date(),
            startDate: new Date()
        }).on('changeDate', function (data) {
            $rootScope.editableTask.targetDate = $('#editDateTaskVacancy').datetimepicker('getDate');
            roundMinutes($rootScope.editableTask.targetDate);
            Task.changeTargetDate({
                "taskId": $rootScope.editableTask.taskId,
                "date":$rootScope.editableTask.targetDate
            }, function(resp){
                $rootScope.updateTaskInModal();
            })
        }).on('hide', function () {
            if ($('#editDateTaskVacancy').val() == "") {
                $rootScope.editableTask.date = "";
            }
        });
    }
}
function createEmailTemplateFunc($scope,$rootScope,id, Mail, $location){
    let dataContacts = {};

    $rootScope.me.contacts.forEach(item =>  dataContacts[item["contactType"].toLowerCase()] = item['value'] || ' ');
    console.log(dataContacts, 'dataContacts')
    $rootScope.staticEmailTemplate = {
        candidateName: "John Dou",
        date: 1463749200000,
        recruiterName: $rootScope.me.fullName,
        recruiterEmail: $rootScope.me.emails.length > 0 ? $rootScope.me.emails[0].email : $rootScope.me.login
    };

   setTimeout(function(){
       tinymce.init({
           selector: '#' + id,
           mode: 'exact',
           theme: "modern",
           height: 145,
           language: $scope.lang!=undefined ||$scope.lang!=null?$scope.lang:"ru",
           browser_spellcheck: true,
           menubar: false,
           statusbar: false,
           theme_advanced_resizing: true,
           plugins: ["advlist autolink lists link image charmap print preview hr anchor pagebreak",
               "searchreplace visualblocks visualchars code fullscreen",
               "insertdatetime media nonbreaking save table directionality",
               "template paste textcolor  "],
           fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
           toolbar1: "bold italic forecolor backcolor fontsizeselect | bullist numlist | link",
           image_advtab: true,
           toolbar_items_size: 'small',
           relative_urls: false,
           setup: function (ed) {
               ed.on('SetContent', function (e) {

               });
               ed.on('change', function(e) {
                   let tinyMCEgetId = tinyMCE.get(id);
                   if(tinyMCEgetId) {
                       $rootScope.emailTemplateInModal.text = tinyMCEgetId.getContent();
                   }
               });
           }
       });
   },0);
    $rootScope.hover = false;

    $rootScope.Hover = function () {
        $rootScope.hover = false;
    };
    $rootScope.HoverLeave = function () {
        $rootScope.hover = true;
    };
    $rootScope.status2 = false;



    if(id == "addCandidateInVacancyMCE"){
        $rootScope.changeTemplateInAddCandidate = function(status){
            if($rootScope.status2 == undefined ){
                $rootScope.hover = false;
            }else{
                $rootScope.hover = true;
            }

            if(status['googleCalendarPrefix'] !== ""){ // Отличить два объекта чтоб разпарсить второй
                status = JSON.parse(status);            // первый при выборе вакансии он имеет свойство status['googleCalendarPrefix'] не обязатнльго ""// второй при выборе этапа -в нем такого свойства нет он нам для парсинга нужен
            }

            $rootScope.addCandidateInVacancy.status = status;

            if($rootScope.addCandidateInVacancy.status.value == 'interview' ||
                $rootScope.addCandidateInVacancy.status.withDate ||
                $rootScope.addCandidateInVacancy.status.value == 'longlist' ||
                $rootScope.addCandidateInVacancy.status.value == 'shortlist' ||
                $rootScope.addCandidateInVacancy.status.value == 'notafit' ||
                $rootScope.addCandidateInVacancy.status.value == 'declinedoffer' ||
                $rootScope.addCandidateInVacancy.status.value == 'no_response' ||
                $rootScope.addCandidateInVacancy.status.value == 'no_contacts' ||
                $rootScope.addCandidateInVacancy.status.type == 'interview' ||
                $rootScope.addCandidateInVacancy.status.type == 'refuse'){
                var templateType = 'candidateCreateInterviewNotification';
                if($rootScope.addCandidateInVacancy.status.value == 'notafit' ||
                    $rootScope.addCandidateInVacancy.status.value == 'declinedoffer' ||
                    $rootScope.addCandidateInVacancy.status.value == 'no_response' ||
                    $rootScope.addCandidateInVacancy.status.value == 'no_contacts' ||
                    $rootScope.addCandidateInVacancy.status.type == 'refuse'){
                    templateType = 'refuseCandidateInVacancy'
                }else if($rootScope.addCandidateInVacancy.status.value == 'longlist' ||
                    $rootScope.addCandidateInVacancy.status.value == 'shortlist'){
                    templateType = 'seeVacancy'
                }
                Mail.getTemplateVacancy({vacancyId: $rootScope.VacancyAddedInCandidate.vacancyId,type:templateType},function(data){
                    $rootScope.fileForSave = [];
                    if(!$scope.publicLink) {
                        $scope.publicLink = $location.$$protocol + "://" + $location.$$host + "/i#/vacancy-" + $rootScope.vacancyForAddCandidate;
                    }
                    $rootScope.emailTemplateInModal = data.object;
                    $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[candidate name\]\]/g, $rootScope.candnotify.fullName);
                    $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[vacancy link\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $scope.publicLink+ '">' + $rootScope.VacancyAddedInCandidate.position + '</a>');
                    $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's name\]\]/g, $rootScope.me.fullName);
                    $rootScope.emailTemplateInModal.title = $rootScope.emailTemplateInModal.title.replace(/\[\[vacancy link\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $scope.publicLink+ '">' + $rootScope.VacancyAddedInCandidate.position + '</a>');
                    $rootScope.emailTemplateInModal.title = $rootScope.emailTemplateInModal.title.replace(/\[\[vacancy name\]\]/g, $rootScope.VacancyAddedInCandidate.position);
                    $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's phone\]\]/g, $rootScope.me.phone ? $rootScope.me.phone : "");
                    $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's Skype\]\]/g, $rootScope.staticEmailTemplate.skype ? $rootScope.staticEmailTemplate.skype : "");
                    if(!$rootScope.staticEmailTemplate.skype){
                        $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/Skype:/g, "");
                    }
                    if($rootScope.staticEmailTemplate.facebook){
                        $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's Facebook\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $rootScope.staticEmailTemplate.facebook+ '">' + $rootScope.staticEmailTemplate.facebook + '</a>');
                    }else{
                        $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's Facebook\]\]/g, '');
                    }
                    if($rootScope.staticEmailTemplate.linkedin){
                        $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's LinkedIn\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $rootScope.staticEmailTemplate.linkedin+ '">' + $rootScope.staticEmailTemplate.linkedin + '</a>');
                    }else{
                        $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's LinkedIn\]\]/g, '');
                    }
                    if($rootScope.me.emails.length == 1){
                        $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiterEmail\]\]/g, $rootScope.me.emails[0].email);
                    }
                    tinyMCE.get(id).setContent($rootScope.emailTemplateInModal.text);
                    if(localStorage.emailThatAlreadyUsed){
                        $scope.addEmailFromLocalStorage(localStorage.emailThatAlreadyUsed);
                    }
                    if($rootScope.emailTemplateInModal.fileId && $rootScope.emailTemplateInModal.fileName){
                        $rootScope.fileForSave.push({"fileId": $rootScope.emailTemplateInModal.fileId, "fileName": $rootScope.emailTemplateInModal.fileName});
                    }
                })
            }
        };
    }else{
        $rootScope.changeTemplateInChangeStatusCandidate = function(status){
            if($rootScope.changeStatusOfInterviewInVacancy.status.value == 'interview' ||
                $rootScope.changeStatusOfInterviewInVacancy.status.withDate ||
                $rootScope.changeStatusOfInterviewInVacancy.status.value == 'longlist' ||
                $rootScope.changeStatusOfInterviewInVacancy.status.value == 'shortlist' ||
                $rootScope.changeStatusOfInterviewInVacancy.status.value == 'notafit' ||
                $rootScope.changeStatusOfInterviewInVacancy.status.value == 'declinedoffer' ||
                $rootScope.changeStatusOfInterviewInVacancy.status.value == 'no_response' ||
                $rootScope.changeStatusOfInterviewInVacancy.status.value == 'no_contacts' ||
                $rootScope.changeStatusOfInterviewInVacancy.status.type == 'interview' ||
                $rootScope.changeStatusOfInterviewInVacancy.status.type == 'refuse'){
                var templateType = 'candidateCreateInterviewNotification';
                if($rootScope.changeStatusOfInterviewInVacancy.status.value == 'notafit' ||
                    $rootScope.changeStatusOfInterviewInVacancy.status.value == 'declinedoffer' ||
                    $rootScope.changeStatusOfInterviewInVacancy.status.value == 'no_response' ||
                    $rootScope.changeStatusOfInterviewInVacancy.status.value == 'no_contacts' ||
                    $rootScope.changeStatusOfInterviewInVacancy.status.type == 'refuse'){
                    templateType = 'refuseCandidateInVacancy'
                }else if($rootScope.changeStatusOfInterviewInVacancy.status.value == 'longlist' ||
                    $rootScope.changeStatusOfInterviewInVacancy.status.value == 'shortlist'){
                    templateType = 'seeVacancy'
                }
                console.log('123')
                Mail.getTemplateVacancy({vacancyId: $rootScope.changedStatusVacancy.vacancyId,type:templateType},function(data){
                    $scope.publicLink = $location.$$protocol + "://" + $location.$$host + "/i#/vacancy-"  + $rootScope.changedStatusVacancy.localId;
                    $rootScope.fileForSave = [];
                    $rootScope.emailTemplateInModal = data.object;
                    $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[candidate name\]\]/g, $rootScope.candnotify.fullName);
                    $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[vacancy link\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $scope.publicLink+ '">' + $rootScope.changedStatusVacancy.position + '</a>');
                    $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's name\]\]/g, $rootScope.me.fullName);
                    $rootScope.emailTemplateInModal.title = $rootScope.emailTemplateInModal.title.replace(/\[\[vacancy link\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $scope.publicLink+ '">' + $rootScope.changedStatusVacancy.position + '</a>');
                    $rootScope.emailTemplateInModal.title = $rootScope.emailTemplateInModal.title.replace(/\[\[vacancy name\]\]/g, $rootScope.changedStatusVacancy.position);
                    $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's phone\]\]/g, dataContacts["phonework"]);
                    $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's Skype\]\]/g, dataContacts['skype']);
                    $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's Facebook\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + dataContacts["facebook"] + '">' +  dataContacts["facebook"] + '</a>');
                    $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's LinkedIn\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + dataContacts["linkedin"] + '">' + dataContacts["linkedin"] + '</a>');
                    if($rootScope.me.emails.length == 1){
                        $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiterEmail\]\]/g, $rootScope.me.emails[0].email);
                    }

                    new Promise((resolve, reject) => {
                        let interval = setInterval(()=>{
                            if(tinyMCE.editors.length > 0){
                                clearInterval(interval);
                                resolve(tinyMCE.editors);
                            }
                        },0);
                    })
                        .then(resp => tinyMCE.editors[id].setContent($rootScope.emailTemplateInModal.text))
                        .then(resp => {
                            if(localStorage.emailThatAlreadyUsed){
                                $scope.addEmailFromLocalStorage(localStorage.emailThatAlreadyUsed);
                            }
                            if($rootScope.emailTemplateInModal.fileId && $rootScope.emailTemplateInModal.fileName){
                                $rootScope.fileForSave.push({"fileId": $rootScope.emailTemplateInModal.fileId, "fileName": $rootScope.emailTemplateInModal.fileName});
                            }
                        });

                })
            }
        };
    }
    $rootScope.addEmailFromWhatSend = function(email){
        if($rootScope.emailThatAlreadyUsed){
            $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace($rootScope.emailThatAlreadyUsed.email, email.email);
        }
        $rootScope.emailTemplateInModal.email = [];
        $rootScope.emailThatAlreadyUsed = email;
        localStorage.emailThatAlreadyUsed = email.email;
        $rootScope.emailTemplateInModal.email = $rootScope.emailTemplateInModal.email + email.email;
        console.log($rootScope.emailTemplateInModal);
        $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiterEmail\]\]/g, $rootScope.emailTemplateInModal.email);
        tinyMCE.get(id).setContent($rootScope.emailTemplateInModal.text);
    };
    $scope.addEmailFromLocalStorage = function(email){
        angular.forEach($rootScope.me.emails,function(resp){
            if(resp.email == localStorage.emailThatAlreadyUsed){
                $rootScope.addEmailFromWhatSend(resp);
            }
        })
    };
}
function firstLetters(string){
    var array = [];
    var word1 = [];
    var word2 = [];
    var words = string.split(" ");
    word1.push(words[0]);
    var letter1 = word1[0].split("");
    array.push(letter1[0]);
    if(words.length > 1){
        word2.push(words[1]);
        var letter2 = word2[0].split("");
        array.push(letter2[0]);
    }
    var acronym = array.join('');
    return acronym
}
function removeDuplicates(arr, prop) {
    var new_arr = [];
    var lookup  = {};

    for (var i in arr) {
        lookup[arr[i][prop]] = arr[i];
    }

    for (i in lookup) {
        new_arr.push(lookup[i]);
    }
    return new_arr;
}
