angular.module('services.candidate', [
    'ngResource',
    'ngCookies'
]).factory('Candidate', ['$resource', 'serverAddress', '$filter', '$localStorage',"notificationService","$rootScope","$translate", function($resource, serverAddress, $filter, $localStorage,notificationService, $rootScope, $translate ) {
    var options;

    var candidate = $resource(serverAddress + '/candidate/:param', {param: "@param"}
            , {
            all: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "get"
                }
            },
            getLangInOrg: {
                method: 'POST',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "getLangInOrg"
                }
            },
            createExcel: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "createExcel"
                }
            },
            getExternal: {
                method: "POST",
                params: {
                    param: "getExternal"
                }
            },
            add: {
                method: "PUT",
                params: {
                    param: "add"
                }
            },
            edit: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "edit"
                }
            },
            sendToMail: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "sendToMail"
                }
            },
            one: {
                method: "GET",
                params: {
                    param: "get"
                }
            },
            changeState: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "changeState"
                }

            },
            setResponsible: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "setResponsible"
                }
            },
            removeFile: {
                method: "GET",
                params: {
                    param: "removeFile"
                }
            },
            setMessage: {
                method: "POST",
                params: {
                    param: "setMessage"
                }
            },
            addFile: {
                method: "GET",
                params: {
                    param: "addFile"
                }
            },
            addFromRecall: {
                method: "GET",
                params: {
                    param: "addFromRecall"
                }
            },
            "mathRecallWithCandidate": {
                method: "GET",
                params: {
                    param: "mathRecallWithCandidate"
                }
            },
            mergeCandidates: {
                method: "PUT",
                params: {
                    param: "mergeCandidates"
                }

            },
            getAdvices: {
                method: "GET",
                params: {
                    param: "getAdvices"
                }
            },
            fromLinkFile: {
                method: "POST",
                params: {
                    param: "fromLinkFile"
                }
            },
            fromLinkSite: {
                method: "POST",
                params: {
                    param: "fromLinkSite"
                }
            },
            fromText: {
                method: "POST",
                params: {
                    param: "fromText"
                }
            },
            getContacts: {
                method: "GET",
                params: {
                    param: "getContacts"
                }
            },
            getDuplicates: {
                method: "POST",
                params: {
                    param: "getDuplicates"
                }
            },
            getDuplicatesByName: {
                method: "POST",
                params: {
                    param: "getDuplicatesByName"
                }
            },
            getDuplicatesByNameAndContacts: {
                method: "POST",
                params: {
                    param: "getDuplicatesByNameAndContacts"
                }
            },
            addToParserQueue: {
                method: "POST",
                params: {
                    param: "addToParserQueue"
                }
            },
            removeFromParserQueue: {
                method: "POST",
                params: {
                    param: "removeFromParserQueue"
                }
            },
            getParseEmailData: {
                method: "GET",
                params: {
                    param: "getParseEmailData"
                }
            },
            getMessages: {
                method: "GET",
                params: {
                    param: "getMessages"
                }
            },
            getParseEmailHistory: {
                method: "POST",
                params: {
                    param: "getParseEmailHistory"
                }
            },
            saveSearchFilter: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "saveSearchFilter"
                }
            },
            getSearchHistory: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "getSearchHistory"
                }
            },
            getSearchHistoryAdmin: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "getSearchHistoryAdmin"
                }
            },
            checkMailbox: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "checkMailbox"
                }
            },
            addLink: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "addLink"
                }
            },
            getCandidateLinks: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "getCandidateLinks"
                }
            },
            removeCandidateLink: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "removeCandidateLink"
                }
            },
            autocompleteSkill: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "autocompleteSkill"
                }
            },
            updateFromFile: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "updateFromFile"
                }
            },
            getCV: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "getCV"
                }
            },
            addEmailAccess: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "addEmailAccess"
                }
            },
            editEmailAccess: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "editEmailAccess"
                }
            },
            editOriginAll: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "editOriginAll"
                }
            },
            removeOriginAll: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "removeOriginAll"
                }
            },
            getCandidateProperties: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "getCandidateProperties"
                }
            },
            setPreferableContact: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "setPreferableContact"
                }
            }
        });



    function unCheckFavoriteContact(checkElement, $scope){
        checkElement.classList.remove('fa-star');
        checkElement.classList.add('fa-star-o');
        $scope.contactType = null;
        $scope.candidate.preferableContact = '';
    }

    function checkFavoriteContact(contacts, checkElement, $scope, type){
        $scope.contactType = type;
        contacts.forEach(elem => {
            if(elem.classList.contains('fa-star')){
                elem.classList.remove('fa-star');
                elem.classList.add('fa-star-o');
            }
        });

        checkElement.classList.add('fa-star');
        checkElement.classList.remove('fa-star-o');
    }

    function restAngularContext($scope){
        if($rootScope.loading){
            $rootScope.loading = false;
        }
        $scope.$apply();
    }

    function selectFavoriteContact(checkElement, $scope, type){
        let contacts = document.querySelectorAll('.contactCandidate .fa');

        if(checkElement.classList.contains('fa-star')){
            unCheckFavoriteContact(checkElement, $scope);
        }else{
            checkFavoriteContact(contacts, checkElement, $scope, type);
        }
    }

    candidate.setSelectFavoriteContacts = function($scope, type, event){
        $scope.candidate.preferableContact = type;
        selectFavoriteContact(event.target, $scope, type);
    };

    candidate.getSearchHistoryUniqueLink = function(callback) {
        candidate.getSearchHistory({type: 'linkedin'}, function(resp) {
            var history = [];
            angular.forEach(resp.objects, function(val, key) {
                if (history.length < 8) {
                    var has = false;
                    angular.forEach(history, function(valHistory, keyHistory) {
                        if (
                            (
                                valHistory.company === val.company ||
                                (
                                    valHistory.company && val.company &&
                                    $.trim(valHistory.company.toUpperCase()) === $.trim(val.company.toUpperCase())
                                )
                            )
                            &&
                            (
                                valHistory.position === val.position ||
                                (
                                    valHistory.position && val.position &&
                                    $.trim(valHistory.position.toUpperCase()) === $.trim(val.position.toUpperCase())
                                )
                            )
                            &&
                            (
                                valHistory.words === val.words ||
                                (
                                    valHistory.words && val.words &&
                                    $.trim(valHistory.words.toUpperCase()) === $.trim(val.words.toUpperCase())
                                )
                            )
                            && valHistory.countryCode == val.countryCode) {
                            has = true;
                        }
                    });
                    if (!has) {
                        history.push(val);
                    }
                }
            });
            if (callback != undefined)
                callback(history);
        });
    };
    candidate.searchOptions = function() {
        return options;
    };
    candidate.setOptions = function(name, value) {
        options[name] = value;
    };
    candidate.init = function() {
        options = {
            "state": null,
            "id": null,
            "personId": null,
            "regions": null,
            "employmentType": null,
            "industry": null,
            "sort": null,
            "sortOrder": "DESC",
            "org": null,
            "origin": null,
            "city": null,
            "country": null,
            "responsibleId": null,
            "ids": null,
            "page": {"number": 0, "count": 100},
            "words": null,
            "name": null,
            "position": null,
            "salary": null,
            "sex": null,
            "candidateGroupId" : null
        };
    };

    candidate.getStatus = function() {
        return [
            {value: "active_search", name: "active search"},
            {value: "not_searching", name: "not searching"},
            {value: "passive_search", name: "passive search"},
            {value: "employed", name: "employed"},
            {value: "freelancer", name: "freelancer"},
            //{value: "reserved", name: "reserved"},
            {value: "archived", name: "archived"},
            {value: "work", name: "Our employee"},
            {value: "only_remote", name: "Only remote"},
            {value: "only_relocation_abroad", name: "Only relocation abroad"}
        ];
    };
    candidate.getStatusAssociative = function() {
        return {
            "active_search": "active search",
            "not_searching": "not searching",
            "passive_search": "passive search",
            "employed": "employed"
        };
    };

    candidate.fromFile = function($scope, $rootScope, $location) {
        $scope.optionsForResumeFile = {
            change: function(file) {
                $rootScope.loading = true;
                $scope.fastCandLoading = true;
                file.$preview(file).then(function(data) {
                    $scope.newImgSrc = data.item.thumb;
                    $scope.ngShowNewImage = true;
                });
                file.$upload(serverAddress + '/candidate/fromFile', file).then(function(data) {
                    //candidate.convert($scope, data.data.object);
                    //$scope.candidate.source = 'cvfile';
                    //if (data.data.object.position) {
                    //    $scope.setPositionAutocompleterValue(data.data.object.position);
                    //}
                    //$scope.callbackFile(data.data.objects[0], file.filename);
                    $rootScope.file = file;
                    $rootScope.resumeToSave = data;
                    $scope.fastCandLoading = false;
                    $rootScope.loading = false;
                    setTimeout(function(){
                        $scope.imgWidthFunc();
                    }, 3000);
                    if(data.data.status != 'error' ){
                        $location.path("candidate/add");
                    } else {
                        $scope.callbackErr(data.data.message);
                        $scope.fastCandLoading = false;
                    }

                }).catch(function(data) {
                    $scope.callbackErr(data.statusText);
                    $scope.fastCandLoading = false;
                });
            },
            setError: function(err, data) {
                $scope.callbackErr(data.statusText);
                $scope.fastCandLoading = false;
            }
        };
    };
    candidate.setPhoto = function($scope, error) {
        $scope.file = {}; //Model
        $scope.optionsForPhoto = {
            change: function(file) {
                file.$preview(file).then(function(data) {
                    $scope.newImgSrc = data.item.thumb;
                    $scope.ngShowNewImage = true;
                });
                file.$upload(serverAddress + '/candidate/addPhoto', file).then(function(data) {
                    $scope.callbackAddPhoto(data.data.objects[0]);
                    setTimeout(function(){
                        $scope.imgWidthFunc();
                    }, 2000);
                });
            },
            setError: function(err, data) {
                $scope.callbackErr(data.statusText);
            }
        };
    };

    var duplicatesByNameAndContacts = false;
    candidate.checkDuplicatesByNameAndContacts = function($scope) {
        console.log(duplicatesByNameAndContacts);
        $scope.dublicetesTypeName = '';
        $scope.dublicetesTypeMphone = '';
        $scope.dublicetesTypeEmail = '';
        $scope.dublicetesTypeSkype = '';
        $scope.dublicetesTypeLinkedin = '';
        if ((!duplicatesByNameAndContacts && $scope.contacts && $scope.contacts.email && $scope.contacts.email.length > 4) || (!duplicatesByNameAndContacts && $scope.contacts && $scope.contacts.skype && $scope.contacts.skype.length > 4) || (!duplicatesByNameAndContacts && $scope.contacts && $scope.contacts.linkedin && $scope.contacts.linkedin.length > 4) || (!duplicatesByNameAndContacts && $scope.contacts && $scope.contacts.mphone && $scope.contacts.mphone.length > 4) || (!duplicatesByNameAndContacts && $scope.candidate.fullName && $scope.candidate.fullName.length > 3)) {
        //if (!duplicatesByNameAndContacts && $scope.contacts && $scope.contacts.email && $scope.contacts.email.length > 4 && $scope.contacts.skype && $scope.contacts.skype.length > 4 && $scope.contacts.linkedin && $scope.contacts.linkedin.length > 4 && $scope.contacts.mphone && $scope.contacts.mphone.length > 4 && $scope.candidate.fullName && $scope.candidate.fullName.length > 3) {
            duplicatesByNameAndContacts = true;
            setTimeout(function(){
                if ($scope.contacts.mphone == undefined && $scope.contacts.mphone2 && $scope.contacts.mphone3) {
                    $scope.addPhone = $scope.contacts.mphone.concat(", ", $scope.contacts.mphone2).concat(", ", $scope.contacts.mphone3);
                }
                if ($scope.contacts.mphone == undefined && $scope.contacts.mphone2 == undefined && $scope.contacts.mphone3) {
                    $scope.addPhone = $scope.contacts.mphone.concat(", ", $scope.contacts.mphone3);
                }
                if ($scope.contacts.mphone == undefined && $scope.contacts.mphone2 && $scope.contacts.mphone3 == undefined) {
                    $scope.addPhone = $scope.contacts.mphone.concat(", ", $scope.contacts.mphone2);
                }
                if($scope.contacts.mphone && $scope.contacts.mphone2 && $scope.contacts.mphone3 == undefined){
                    $scope.addPhone = $scope.contacts.mphone.concat(", ", $scope.contacts.mphone2);
                }
                if($scope.contacts.mphone3 && $scope.contacts.mphone && $scope.contacts.mphone2 == undefined){
                    $scope.addPhone = $scope.contacts.mphone.concat(", ", $scope.contacts.mphone3);
                }
                candidate.getDuplicatesByNameAndContacts({
                    email: $scope.contacts.email,
                    skype: $scope.contacts.skype,
                    linkedInUrl: $scope.contacts.linkedin,
                    phone: $scope.addPhone,
                    fullName: $scope.candidate.fullName
                }, function (res) {
                    $scope.duplicatesByNameAndContacts = [];
                    if (res.status === "ok" && res.objects != undefined && res.objects.length > 0) {
                        angular.forEach(res.objects, function (c, i) {
                            console.log(c.candidateId != $scope.candidate.candidateId, ' candID');
                            if (c.candidateId != $scope.candidate.candidateId) {
                                $scope.duplicatesByNameAndContacts.push(c);
                                if (c.type == "name") {
                                    $scope.dublicetesTypeName = c.type;
                                }
                                if (c.type == "mphone") {
                                    $scope.dublicetesTypeMphone = c.type;
                                }
                                if (c.type == "email") {
                                    $scope.dublicetesTypeEmail = c.type;
                                }
                                if (c.type == "skype") {
                                    $scope.dublicetesTypeSkype = c.type;
                                }
                                if (c.type == "linkedin") {
                                    $scope.dublicetesTypeLinkedin = c.type;
                                }
                            }
                        });
                    } else {
                        $scope.duplicatesByNameAndContacts = [];
                    }
                    duplicatesByNameAndContacts = false;
                }, function (resp) {
                    $scope.duplicatesByNameAndContacts = [];
                    duplicatesByNameAndContacts = false;
                });
            }, 2000);
        } else {
            $scope.duplicatesByNameAndContacts = [];
        }
    };

    //var duplicatesByEmailGO = false;
    //candidate.checkDuplicatesByEmail = function($scope) {
    //    if (!duplicatesByEmailGO && $scope.contacts && $scope.contacts.email && $scope.contacts.email.length > 4) {
    //        duplicatesByEmailGO = true;
    //        candidate.getDuplicates({email: $scope.contacts.email, phone: ""}, function(res) {
    //            $scope.duplicatesByEmail = [];
    //            if (res.status === "ok" && res.objects != undefined && res.objects.length > 0) {
    //                angular.forEach(res.objects, function(c, i) {
    //                    if (c.candidateId != $scope.candidate.candidateId) {
    //                        $scope.duplicatesByEmail.push(c);
    //                    }
    //                });
    //                //$scope.duplicatesByEmail = res.objects;
    //            } else {
    //                $scope.duplicatesByEmail = [];
    //            }
    //            duplicatesByEmailGO = false;
    //        }, function(resp) {
    //            $scope.duplicatesByEmail = [];
    //            duplicatesByEmailGO = false;
    //        });
    //    } else {
    //        $scope.duplicatesByEmail = [];
    //    }
    //};
    //
    //var duplicatesBySkypeGO = false;
    //candidate.checkDuplicatesBySkype = function($scope) {
    //    if (!duplicatesBySkypeGO && $scope.contacts && $scope.contacts.skype && $scope.contacts.skype.length > 4) {
    //        duplicatesBySkypeGO = true;
    //        candidate.getDuplicates({skype: $scope.contacts.skype, phone: ""}, function(res) {
    //            $scope.duplicatesBySkype = [];
    //            if (res.status === "ok" && res.objects != undefined && res.objects.length > 0) {
    //                angular.forEach(res.objects, function(c, i) {
    //                    if (c.candidateId != $scope.candidate.candidateId) {
    //                        $scope.duplicatesBySkype.push(c);
    //                    }
    //                });
    //                //$scope.duplicatesByEmail = res.objects;
    //            } else {
    //                $scope.duplicatesBySkype = [];
    //            }
    //            duplicatesBySkypeGO = false;
    //        }, function(resp) {
    //            $scope.duplicatesBySkype = [];
    //            duplicatesBySkypeGO = false;
    //        });
    //    } else {
    //        $scope.duplicatesBySkype = [];
    //    }
    //};
    //var duplicatesByLinkedinGO = false;
    //candidate.checkDuplicatesByLinkedin = function($scope) {
    //    if (!duplicatesByLinkedinGO && $scope.contacts && $scope.contacts.linkedin && $scope.contacts.linkedin.length > 4) {
    //        duplicatesByLinkedinGO = true;
    //        candidate.getDuplicates({ linkedInUrl: $scope.contacts.linkedin, phone: ""}, function(res) {
    //            $scope.duplicatesByLinkedin = [];
    //            if (res.status === "ok" && res.objects != undefined && res.objects.length > 0) {
    //                angular.forEach(res.objects, function(c, i) {
    //                    if (c.candidateId != $scope.candidate.candidateId) {
    //                        $scope.duplicatesByLinkedin.push(c);
    //                    }
    //                });
    //                //$scope.duplicatesByEmail = res.objects;
    //            } else {
    //                $scope.duplicatesByLinkedin = [];
    //            }
    //            duplicatesByLinkedinGO = false;
    //        }, function(resp) {
    //            $scope.duplicatesByLinkedin = [];
    //            duplicatesByLinkedinGO = false;
    //        });
    //    } else {
    //        $scope.duplicatesByLinkedin = [];
    //    }
    //};
    //
    //var duplicatesByPhoneGO = false;
    //candidate.checkDuplicatesByPhone = function($scope) {
    //    if (!duplicatesByPhoneGO && $scope.contacts && $scope.contacts.mphone && $scope.contacts.mphone.length > 4) {
    //        duplicatesByPhoneGO = true;
    //        candidate.getDuplicates({email: "", phone: $scope.contacts.mphone}, function(res) {
    //            $scope.duplicatesByPhone = [];
    //            if (res.status === "ok" && res.objects != undefined && res.objects.length > 0) {
    //                angular.forEach(res.objects, function(c, i) {
    //                    if (c.candidateId != $scope.candidate.candidateId) {
    //                        $scope.duplicatesByPhone.push(c);
    //                    }
    //                });
    //                //$scope.duplicatesByPhone = res.objects;
    //            } else {
    //                $scope.duplicatesByPhone = [];
    //            }
    //            duplicatesByPhoneGO = false;
    //        }, function(resp) {
    //            $scope.duplicatesByPhone = [];
    //            duplicatesByPhoneGO = false;
    //        });
    //    } else {
    //        $scope.duplicatesByPhone = [];
    //    }
    //};
    //
    //var duplicatesByNameGO = false;C
    //var fullNamePattern = "/^[A-Za-zА-Яа-яёЁІіЇїЄєҐґ’'`\-]+(\s+[A-Za-zА-Яа-яёЁІіЇїЄєҐґ’'`\-]+)+(\s+[A-Za-zА-Яа-яёЁІіЇїЄєҐґ’'`\-]+)*$/";
    //candidate.checkDuplicatesByName = function($scope) {
    //    console.log(duplicatesByNameGO);
    //    console.log($scope.candidate.fullName);
    //    console.log($scope.candidate.fullName.match(fullNamePattern));
    //    if (!duplicatesByNameGO && $scope.candidate.fullName && $scope.candidate.fullName.length > 3) {
    //        duplicatesByNameGO = true;
    //        candidate.getDuplicatesByName({fullName: $scope.candidate.fullName}, function(res) {
    //            $scope.duplicatesByName = [];
    //            if (res.status === "ok" && res.objects != undefined && res.objects.length > 0) {
    //                angular.forEach(res.objects, function(c, i) {
    //                    if (c.candidateId != $scope.candidate.candidateId) {
    //                        $scope.duplicatesByName.push(c);
    //                    }
    //                });
    //            } else {
    //                $scope.duplicatesByName = [];
    //            }
    //            duplicatesByNameGO = false;
    //        }, function(resp) {
    //            $scope.duplicatesByName = [];
    //            duplicatesByNameGO = false;
    //        });
    //    } else {
    //        $scope.duplicatesByName = [];
    //    }
    //};

    function countCandProperties($scope, candidate) {
        var allPuncts = 15;
        var allPuncts3 = allPuncts / 100 * 3;
        var allPuncts5 = allPuncts / 100 * 5;
        var allPuncts50 = allPuncts / 100 * 50;
        var progressMessage = [];
        var count = 0;
        if (candidate) {
            if (candidate.fullName) {
                count = count + allPuncts5;
            } else {
                progressMessage.push($filter('translate')("full_name"));
            }
            if (candidate.contacts !== undefined && candidate.contacts !== null && candidate.contacts.length !== 0) {
                var i = 0;
                angular.forEach(candidate.contacts, function(val) {
                    if (angular.equals(val.type, "email" || val.type, "skype")) {
                        count = count + allPuncts5;
                        i++
                    }
                    if (angular.equals(val.type, "linkedin")) {
                        count = count + allPuncts5;
                        i++
                    }
                    if (angular.equals(val.type, "mphone")) {
                        count = count + allPuncts5;
                        i++
                    }
                });
                if(i < 3){
                    progressMessage.push($filter('translate')("contacts") + "(" + $filter('translate')("Phone, email, linkedin") + ")");
                }
            } else {
                progressMessage.push($filter('translate')("contacts") + "(" + $filter('translate')("Phone, email, linkedin") + ")");
            }
            if (candidate.coreSkills) {
                if(candidate.coreSkills.length > 30){
                    count = count + allPuncts3;
                }else{
                    progressMessage.push($filter('translate')("Skills with text"));
                }
            } else {
                progressMessage.push($filter('translate')("Skills with text"));
            }
            if (candidate.db) {
                count = count + allPuncts3;
            } else {
                progressMessage.push($filter('translate')("date_of_birth"));
            }
            if (candidate.descr || candidate.files || ($scope.fileForSave !== undefined && $scope.fileForSave !== null && $scope.fileForSave.length !== 0)) {
                if(candidate.descr.length > 500){
                    count = count + allPuncts50;
                } else if(candidate.files.length > 0 || ($scope.fileForSave !== undefined && $scope.fileForSave !== null && $scope.fileForSave.length !== 0)){
                    count = count + allPuncts50;
                }
            } else{
                if(!candidate.descr <= 500){
                    progressMessage.push($filter('translate')("description"));
                }
                if(!candidate.files || ($scope.fileForSave == undefined && $scope.fileForSave == null)){
                    progressMessage.push($filter('translate')("files"));
                }
            }

            //if (!candidate.descr || !candidate.files || ($scope.fileForSave == undefined && $scope.fileForSave == null && $scope.fileForSave.length == 0)) {
            //
            //}
            //if (candidate.education) {
            //    count++;
            //} else {
            //    progressMessage.push($filter('translate')("education"));
            //}
            //if (candidate.employmentType) {
            //    count++;
            //} else {
            //    progressMessage.push($filter('translate')("employment_type"));
            //}
            if (candidate.expirence) {
                count = count + allPuncts3;
            } else {
                progressMessage.push($filter('translate')("experience"));
            }
            //if (candidate.files || ($scope.fileForSave !== undefined && $scope.fileForSave !== null && $scope.fileForSave.length !== 0)) {
            //    count++;
            //} else {
            //    progressMessage.push($filter('translate')("files"));
            //}
            //if (candidate.industry) {
            //    count++;
            //} else {
            //    progressMessage.push($filter('translate')("industry"));
            //}
            if (candidate.languages) {
                count = count + allPuncts3;
            } else {
                progressMessage.push($filter('translate')("languages"));
            }
            if (candidate.photo) {
                count = count + allPuncts5;
            } else {
                progressMessage.push($filter('translate')("photo"));
            }
            if (candidate.position) {
                count = count + allPuncts5;
            } else {
                progressMessage.push($filter('translate')("position"));
            }
            if (candidate.region) {
                count = count + allPuncts5;
            } else {
                progressMessage.push($filter('translate')("lives_in"));
            }
            if (candidate.salary) {
                count = count + allPuncts3;
            } else {
                progressMessage.push($filter('translate')("desired_salary"));
            }
        }
        $scope.progressMessage = $filter('translate')("empty_fields") + "(" + progressMessage.length + "): ";
        $.each(progressMessage, function(i, p) {
            $scope.progressMessage += "" + p + "; ";
        });
        return count;
    }
    candidate.externalSource = function() {
        if ($localStorage.isExist("search_external") && JSON.parse($localStorage.get("search_external")).version != undefined && JSON.parse($localStorage.get("search_external")).version == 6) {
            return JSON.parse($localStorage.get("search_external"))
        } else {
            return {
                openSettingsMenu: false,
                externalToSearch: ["rabota", "hhUa", "work", "djinni", "superJobUa"],
                visibleUa: "none",
                visibleRu: "none",
                version: 6,
                visibleKz: "none",
                visibleBy: "none",
                sourcesUa: [
                    {
                        value: "rabota",
                        name: "rabota.ua",
                        check: false
                    },
                    {
                        value: "hhUa",
                        check: false,
                        name: "hh.ua"
                    },
                    {
                        value: "work",
                        check: false,
                        name: "work.ua"
                    },
                    {
                        value: "djinni",
                        check: false,
                        name: "djinni.co"
                    },
                    {
                        value: "superJobUa",
                        check: false,
                        name: "superjob.ua"
                    }
                ],
                sourcesRu: [
                    {
                        value: "hhRu",
                        check: false,
                        name: "hh.ru"
                    },
                    {
                        value: "superJobRu",
                        check: false,
                        name: "superjob.ru"
                    },
                    {
                        value: "djinni",
                        check: false,
                        name: "djinni.co"
                    }

                ],
                sourcesKz: [
                    {
                        value: "hhKz",
                        check: false,
                        name: "hh.kz"
                    }
                ],
                sourcesBy: [
                    {
                        value: "hhBy",
                        check: false,
                        name: "jobs.tut.by"
                    },
                    {
                        value: "superJobBy",
                        check: false,
                        name: "by.superjob.ru"
                    },
                    {
                        value: "djinni",
                        check: false,
                        name: "djinni.co"
                    },

                ]
            }
        }
    };

    candidate.progressUpdate = function($scope, isEdit) {
        var cand = angular.copy($scope.candidate);
        if (isEdit) {
            //candidate.checkDuplicatesByName($scope);
            cand.languages = $scope.getSelect2Lang();
            if(cand.languages && $scope.candidate.languages) {
                if (!cand.languages.length && !$scope.candidate.languages.length){
                    cand.languages = '';
                }
            } else {
                cand.languages = '';
            }
            cand.employmentType = $scope.getSelect2EmploymentType();
            cand.db = $('.datepickerOfBirth').datetimepicker();
            console.log( cand.db, ' cand.db');
            if ($("#pac-input").val() && $("#pac-input").val().length == 0) {
                cand.region = null;
            } else if ($("#pac-input").val() && $("#pac-input").val().length > 0) {
                cand.region = $scope.region == undefined ? cand.region : $scope.region;
            }
            cand.contacts = [];
            if ($scope.contacts !== undefined) {
                if ($scope.contacts.email) {
                    cand.contacts.push({type: "email", value: $scope.contacts.email});
                }
                //candidate.checkDuplicatesByEmail($scope);
                if ($scope.contacts.mphone) {
                    cand.contacts.push({type: "mphone", value: $scope.contacts.mphone});
                }
                //candidate.checkDuplicatesByPhone($scope);
                if ($scope.contacts.skype) {
                    cand.contacts.push({type: "skype", value: $scope.contacts.skype});
                }
                //candidate.checkDuplicatesBySkype($scope);
                if ($scope.contacts.linkedin) {
                    cand.contacts.push({type: "linkedin", value: $scope.contacts.linkedin});
                }
                if ($scope.contacts.facebook) {
                    cand.contacts.push({type: "facebook", value: $scope.contacts.facebook});
                }
                if ($scope.contacts.googleplus) {
                    cand.contacts.push({type: "googleplus", value: $scope.contacts.googleplus});
                }
                if ($scope.contacts.homepage) {
                    cand.contacts.push({type: "homepage", value: $scope.contacts.homepage});
                }
            }
        } else {
            //candidate.checkDuplicatesByEmail($scope);
            //candidate.checkDuplicatesByPhone($scope);
            //candidate.checkDuplicatesByName($scope);
        }
        var c = countCandProperties($scope, cand);
        $scope.progressPct = c / 15 * 100 < 100 ? Math.round(c / 15 * 100) : 100;
        if ($scope.progressPct < 40) {
            color = '#C5393A'; //red
        } else if ($scope.progressPct >= 40 && $scope.progressPct < 85) {
            color = '#E78409'; //orange
        } else if ($scope.progressPct >= 85) {
            color = '#74B830'; //green
        } else {
            var color = '#CCCCCC'; //grey
        }
        $scope.progress = {width: $scope.progressPct + '%', 'background-color': color};
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };


    candidate.convert = function($scope, object) {
        if (!object.fullName && !object.photo && !object.education && !object.position && !object.expirence && !object.languages && !object.coreSkills && !object.contacts && !object.db) {
            new PNotify({
                styling: 'jqueryui',
                type: "error",
                text: $filter('translate')("We found small amount of data, it doesn't look like resume.")
            });
        } else {
            $scope.candidate = null;
            $scope.candidate = object;
            if ($scope.candidate.salary == 0) {
                $scope.candidate.salary = '';
            }
            if (object.city) {
                getPlaceInfo(object.city + ' ' + object.country, function(resp) {
                    var reg = convertToRegionObject(resp);
                    $scope.regionInput = reg.fullName;
                    $("#pac-input").val(reg.fullName);
                    $scope.candidate.region = reg;
                    $scope.region = reg

                });
            }
            if (object.country && !object.city) {
                getPlaceInfo(object.country, function(resp) {
                    var reg = convertToRegionObject(resp);
                    $scope.regionInput = reg.fullName;
                    $("#pac-input").val(reg.fullName);
                    $scope.candidate.region = reg;
                    $scope.region = reg

                });
            }
            if ($scope.candidate.currency == undefined) {
                $scope.candidate.currency = 'USD';
            }
            if ($scope.candidate.status == undefined) {
                $scope.candidate.status = 'active_search';
            }
            $(".datepickerOfBirth").val('');
            if (object.db != undefined) {
                $(".datepickerOfBirth").datetimepicker("setDate", new Date(object.db));
            }
            $scope.photoLink = $scope.serverAddress + "/getapp?id=" + $scope.candidate.photo + "&d=true";
            $scope.fileForSave = [];
            $scope.contacts = [];
            console.log(object.contacts);
            if (object.contacts != undefined) {
                $.each(object.contacts, function(i, c) {
                    if (angular.equals(c.type, "email")) {
                        $scope.contacts.email = c.value;
                    }
                    if (angular.equals(c.type, "skype")) {
                        $scope.contacts.skype = c.value;
                    }
                    if (angular.equals(c.type, "mphone")) {
                        $scope.contacts.mphone = c.value;
                    }
                    if (angular.equals(c.type, "homepage")) {
                        $scope.contacts.homepage = c.value;
                    }
                    if (angular.equals(c.type, "linkedin")) {
                        $scope.contacts.linkedin = c.value;
                    }
                });
            }
        }
    };

    candidate.ZIP = function($scope, $interval) {
        $scope.file = {}; //Model
        $scope.optionsForZIP = {
            change: function(file) {
                file.$upload(serverAddress + '/uploadZipFile', file).then(function(resp){
                    if (resp.status && angular.equals(resp.status, "error")) {
                        notificationService.error(resp.message);
                    } else {
                        $scope.zipInfo = function () {
                            //$scope.zipType = $('#zipType').val();
                            var fullPath = $('#zip').val();
                            if (fullPath) {
                                if($scope.zipBrowser == 'Firefox'){
                                    $scope.filename = fullPath;
                                }
                                else{
                                    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
                                    var filename = fullPath.substring(startIndex);
                                    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                                        $scope.filename = filename.substring(1);
                                    }
                                }
                            }
                            if($('#zipButton1').prop('checked')){
                                $scope.zipType =$('#zipButton1').val()
                            }
                            if($('#zipButton2').prop('checked')){
                                $scope.zipType =$('#zipButton2').val()
                            }
                            if($('#zipButton3').prop('checked')){
                                $scope.zipType =$('#zipButton3').val()
                            }

                            if($('#noFiles').prop('checked')){
                                $scope.zipTypeFiles = true;
                            }
                            if($('#hasFiles').prop('checked')){
                                $scope.zipTypeFiles = false;
                            }
                        };
                        $scope.zipInfo();
                        $scope.response = JSON.parse(resp.response);
                        if($scope.response.status == 'ok'){
                            notificationService.success($filter('translate')('Your archive successfully loaded'));
                            if($scope.regionzip.length <=1){
                                $.ajax({
                                    url: "/hr/setZipFileParams",
                                    type: "POST",
                                    data:'{"fileName":"'+$scope.filename+'","type":"'+$scope.zipType+'","countries":"'+$scope.regionzip[0].country+'","countryIds":"'+$scope.regionzip[0].googlePlaceId.googlePlaceId+'","onlyResume":"'+$scope.zipTypeFiles+'"}',
                                    dataType: "json",
                                    contentType: "application/json"
                                });
                            }
                            else if($scope.regionzip.length <=2){
                                $.ajax({
                                    url: "/hr/setZipFileParams",
                                    type: "POST",
                                    data:'{"fileName":"'+$scope.filename+'","type":"'+$scope.zipType+'","countries":"'+$scope.regionzip[0].country+','+$scope.regionzip[1].country+'","countryIds":"'+$scope.regionzip[0].googlePlaceId.googlePlaceId+','+$scope.regionzip[1].googlePlaceId.googlePlaceId+'","onlyResume":"'+$scope.zipTypeFiles+'"}',
                                    dataType: "json",
                                    contentType: "application/json"
                                });
                            }
                            else{
                                $.ajax({
                                    url: "/hr/setZipFileParams",
                                    type: "POST",
                                    data:'{"fileName":"'+$scope.filename+'","type":"'+$scope.zipType+'","countries":"'+$scope.regionzip[0].country+','+$scope.regionzip[1].country+','+$scope.regionzip[2].country+'","countryIds":"'+$scope.regionzip[0].googlePlaceId.googlePlaceId+','+$scope.regionzip[1].googlePlaceId.googlePlaceId+','+$scope.regionzip[2].googlePlaceId.googlePlaceId+'","onlyResume":"'+$scope.zipTypeFiles+'"}',
                                    dataType: "json",
                                    contentType: "application/json"
                                });
                            }
                        }else{
                            notificationService.error($scope.response.message);
                        }
                        $scope.updateZipList();
                        var stopRefreshing = false;
                        var start = $interval(function(){
                            $scope.updateZipList();
                            angular.forEach($scope.zipUploads, function(data){
                                if($scope.response.object.uplId == data.uplId){
                                    if(data.status == 'finished'){
                                        stopRefreshing = true;
                                    }
                                }
                            });
                            if(stopRefreshing){
                                $interval.cancel(start);
                            }
                        }, 5000);
                    }
                });
            }
        };
    };

    candidate.convert2 = function($scope, object, toSave) {
        var updateText = '';
        if ($('.datepickerOfBirth').datetimepicker('getDate') == null && object.db) {
            $(".datepickerOfBirth").datetimepicker("setDate", new Date(object.db));
            updateText += ' ' + $filter('translate')("date_of_birth");
        }
        if (!$scope.candidate.fullName && object.fullName) {
            $scope.candidate.fullName = object.fullName;
            if (updateText) {
                updateText += ',';
            }
            updateText += ' ' + $filter('translate')("full_name");
        }
        if (!$scope.candidate.position && object.position) {
            $scope.candidate.position=$scope.setPositionAutocompleterValue(object.position);
            //$scope.candidate.position = object.position;
            if (updateText) {
                updateText += ',';
            }
            updateText += ' ' + $filter('translate')("position");
        }
        if (!$scope.candidate.photo && object.photo) {
            $scope.candidate.photo = object.photo;
            if (updateText) {
                updateText += ',';
            }
            updateText += ' ' + $filter('translate')("photo");
        }
        if($scope.candidate.photo){
            $scope.photoLink = $scope.serverAddress + "/getapp?id=" + $scope.candidate.photo + "&d=true"
        }
        if (!$scope.regionInput && object.city) {
            $scope.regionInput = object.city;
            if (updateText) {
                updateText += ',';
            }
            updateText += ' ' + $filter('translate')("city");
        }
        if (!toSave && object.contacts != undefined) {
            $.each(object.contacts, function(i, c) {
                if (angular.equals(c.type, "email") && !$scope.contacts.email && c.value) {
                    $scope.contacts.email = c.value;
                    if (updateText) {
                        updateText += ',';
                    }
                    updateText += ' ' + $filter('translate')("Email");
                }
                candidate.checkDuplicatesByNameAndContacts($scope);
                //candidate.checkDuplicatesByEmail($scope);
                if (angular.equals(c.type, "skype") && !$scope.contacts.skype && c.value) {
                    $scope.contacts.skype = c.value;
                    if (updateText) {
                        updateText += ',';
                    }
                    updateText += ' ' + $filter('translate')("Skype");
                }
                if (angular.equals(c.type, "mphone") && !$scope.contacts.mphone && c.value) {
                    $scope.contacts.mphone = c.value;
                    if (updateText) {
                        updateText += ',';
                    }
                    updateText += ' ' + $filter('translate')("phone");
                }
                //candidate.checkDuplicatesByNameAndContacts($scope);
                //candidate.checkDuplicatesByPhone($scope);
                if (angular.equals(c.type, "homepage") && !$scope.contacts.homepage && c.value) {
                    $scope.contacts.homepage = c.value;
                    if (updateText) {
                        updateText += ',';
                    }
                    updateText += ' ' + $filter('translate')("home_page");
                }
            });
            $scope.candidate.position=$scope.getPositionAutocompleterValue();
        }
        if (toSave && object.contacts != undefined && false) {
            $.each(object.contacts, function(i, c) {
                if (angular.equals(c.type, "email") && c.value) {
                    var needContact = true;
                    $.each($scope.candidate.contacts, function(j, cOld) {
                        if (angular.equals(cOld.type, "email") && cOld.value) {
                            needContact = false;
                        }
                    });
                    if (needContact) {
                        $scope.candidate.contacts.push({type: "email", value: c.value});
                        if (updateText) {
                            updateText += ',';
                        }
                        updateText += ' ' + $filter('translate')("Email");
                    }
                }
                candidate.checkDuplicatesByNameAndContacts($scope);
                //candidate.checkDuplicatesByEmail($scope);
                if (angular.equals(c.type, "skype") && c.value) {
                    var needContact = true;
                    $.each($scope.candidate.contacts, function(j, cOld) {
                        if (angular.equals(cOld.type, "skype") && cOld.value) {
                            needContact = false;
                        }
                    });
                    if (needContact) {
                        $scope.candidate.contacts.push({type: "skype", value: c.value});
                        if (updateText) {
                            updateText += ',';
                        }
                        updateText += ' ' + $filter('translate')("Skype");
                    }
                }
                //candidate.checkDuplicatesByNameAndContacts($scope);
                //candidate.checkDuplicatesBySkype($scope);
                if (angular.equals(c.type, "mphone") && c.value) {
                    var needContact = true;
                    $.each($scope.candidate.contacts, function(j, cOld) {
                        if (angular.equals(cOld.type, "mphone") && cOld.value) {
                            needContact = false;
                        }
                    });
                    if (needContact) {
                        $scope.candidate.contacts.push({type: "mphone", value: c.value});
                        if (updateText) {
                            updateText += ',';
                        }
                        updateText += ' ' + $filter('translate')("phone");
                    }
                }
                //candidate.checkDuplicatesByNameAndContacts($scope);
                //candidate.checkDuplicatesByPhone($scope);
            });
        }
        if (!$scope.candidate.descr && object.descr && updateText !== '') {
            $scope.candidate.descr = object.descr;
            if (updateText) {
                updateText += ',';
            }
            updateText += ' ' + $filter('translate')("description");
        }
        if (updateText) {
            new PNotify({
                styling: 'jqueryui',
                type: "success",
                text: $filter('translate')("Added new data") + ":<br/>" + updateText
            });
        }
    };
    //////////////////////////////////////////////////////////////////////// Search params

    var searchParams = null;
    candidate.getSearchParams = function(){
        return searchParams;
    };
    candidate.setSearchParams = function(data){
        searchParams = data;
    };

    candidate.init();

    candidate.getAllCandidates = function (params) {
        candidate.candidateLastRequestParams = params;
        localStorage.setItem('candidateLastRequestParams', JSON.stringify(params));
        return new Promise((resolve, reject) => {
            let data;
            $rootScope.loading = true;
            candidate.all(params, (response) => {
                if(!response.objects) {
                    $rootScope.loading = false;
                    resolve(response, params);
                    return;
                }
                candidate.getCandidate = response.objects.map(item => item.localId);
                data = candidate.getCandidate;
                localStorage.setItem('getAllCandidates', JSON.stringify(data));
                $rootScope.flag = true;
                resolve(response, params);
            },() =>{
                reject();
            });
        });
    };

    return candidate;
}]);
