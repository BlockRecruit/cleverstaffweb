directive.directive('mailingCandidateAutocompleter', ["$filter", "serverAddress", function($filter, serverAddress) {
    return {
        restrict: 'EA',
        replace: true,
        link: function(scope, element, attrs) {
            if ($(element[0])) {
                element.select2({
                    placeholder: $filter('translate')('select candidate'),
                    minimumInputLength: 0,
                    ajax: {
                        url: serverAddress + "/candidate/autocompleate",
                        dataType: 'json',
                        crossDomain: true,
                        quietMillis: 500,
                        type: "POST",
                        data: function(term, page) {
                            return {
                                name: term.trim(),
                                withPersonalContacts: true
                            };
                        },
                        results: function(data, page) {
                            var results = [];
                            if (data['objects'] !== undefined) {
                                angular.forEach(data['objects'], function(item) {
                                    if(!scope.$parent.candidatesForMailing.some((candidate) => {
                                        return candidate.candidateId.localId == item.localId
                                    })) {
                                        results.push({
                                            id: item.localId,
                                            text: item.fullName,
                                            contacts: item.contacts
                                        });
                                    }
                                });
                            }
                            return {
                                results: results
                            };
                        }
                    },
                    dropdownCssClass: "bigdrop"
                }).on('change', (e) => {
                    if(e.added) {
                        scope.$parent.newRecipient = e.added;
                    }
                });
            }
        }
    }
}]).directive('mailingVacancyAutocompleter', ["$filter", "$localStorage", "serverAddress", "$translate", "$rootScope", "Vacancy","Mailing", function($filter, $localStorage, serverAddress, $translate, $rootScope, Vacancy, Mailing) {
        return {
            restrict: 'EA',
            replace: true,
            link: function($scope, element) {
                let candidatesCount = [];
                $(element[0]).select2({
                    placeholder: $filter('translate')('enter job title'),
                    minimumInputLength: 0,
                    ajax: {
                        url: serverAddress + "/vacancy/autocompleter",
                        dataType: 'json',
                        crossDomain: true,
                        quietMillis: 500,
                        type: "POST",
                        data: function(term, page) {
                            return {
                                name: term.trim()
                            };
                        },
                        results: function(data, page) {
                            var results = [];
                            if (data['objects'] !== undefined) {
                                $.each(data['objects'], function(index, item) {
                                    var clientName = "";
                                    if (item.clientId.name.length > 20) {
                                        clientName = item.clientId.name.substring(0, 20);
                                    } else {
                                        clientName = item.clientId.name;
                                    }
                                    var inVacancy = false;
                                    var interviewStatus;
                                    if (item.interviewStatus == undefined) {
                                        item.interviewStatus = 'longlist,shortlist,interview,approved,notafit,declinedoffer';
                                    }
                                    var extraText = "";
                                    if (item.interviews != null) {
                                        interviewStatus = item.interviews[0].state;
                                        angular.forEach($rootScope.customStages, function(stage){
                                            if(interviewStatus == stage.customInterviewStateId){
                                                interviewStatus = stage.name
                                            }
                                        });
                                        extraText = " [ " + $filter('translate')(interviewStatus) + " ]";
                                        inVacancy = true;
                                    }
                                    results.push({
                                        vacancy: item,
                                        id: item.vacancyId,
                                        localId: item.localId,
                                        status: interviewStatus,
                                        text: item.position + " (" + clientName + ")" + extraText,
                                        interviewStatus: item.interviewStatus,
                                        inVacancy: inVacancy
                                    });
                                });
                            }
                            return {
                                results: results
                            };
                        }
                    },
                    dropdownCssClass: "bigdrop"
                }).on("change", function(e) {
                    $scope.vacancy = e.added;
                    $scope.emptyEmails.count = 0;
                    statusListForming($scope.vacancy.id, $scope.vacancy.interviewStatus);
                });

                function setSelect2Vacancy() {
                    let recipientsSource = JSON.parse($localStorage.get('mailingRecipientsSource'));
                    if(recipientsSource && recipientsSource.state && recipientsSource.localId) {
                        Mailing.getVacancyParams(recipientsSource.localId).then((result) => {
                            $(element[0]).select2("data", {id: result.vacancyId, text: result.position});
                            statusListForming(result.vacancyId, result.statuses).then((result) => {
                                $scope.VacancyStatusFiltered.some((status)=> {
                                    if(status.value == recipientsSource.state) {
                                        recipientsSource.fullState = status;
                                        return true
                                    } else {
                                        return false
                                    }
                                });
                                $('#stageSelect').val(JSON.stringify(recipientsSource.fullState));
                            });
                        }, (error) =>{
                            notificationService.error(error)
                        })
                    }
                }
                setSelect2Vacancy();

                function statusListForming(vacancyId, statuses) {
                    return new Promise((resolve, reject) => {
                        if(vacancyId) {
                            Vacancy.getCounts({vacancyId: vacancyId}, (resp) => {
                                candidatesCount = resp.object;
                                var sortedStages = [];
                                var array = statuses?statuses.split(','):[];
                                var VacancyStatus = Vacancy.interviewStatusNew();
                                var i = 0;
                                angular.forEach(array, function(resp) {
                                    angular.forEach(VacancyStatus, function(vStatus) {
                                        if (vStatus.used) {
                                            if(i == 0){
                                                angular.forEach($rootScope.customStages, function(res) {
                                                    res.value = res.name;
                                                    res.movable = true;
                                                    res.added = false;
                                                    res.count = 0;
                                                    vStatus.status.push(res);
                                                    i = i+1;
                                                });
                                            }
                                            angular.forEach(vStatus.status, function(vStatusIn) {
                                                if(resp == vStatusIn.value){
                                                    vStatusIn.added = true;
                                                    sortedStages.push(vStatusIn);
                                                } else if(resp == vStatusIn.customInterviewStateId){
                                                    vStatusIn.added = true;
                                                    sortedStages.push(vStatusIn);
                                                }
                                            })
                                        }
                                    })
                                });
                                candidatesCount.forEach((candidateCount) => {
                                    sortedStages.forEach((stage) => {
                                        if(stage.customInterviewStateId) {
                                            if(stage.customInterviewStateId == candidateCount.item) {
                                                stage.count =  candidateCount.count
                                            }
                                        } else {
                                            if(stage.value == candidateCount.item) {
                                                stage.count =  candidateCount.count
                                            }
                                        }
                                    })
                                });
                                $scope.VacancyStatusFiltered = sortedStages;

                                if (!$scope.$$phase && !$rootScope.$$phase) {
                                    $scope.$apply();
                                }
                                resolve();
                            }, (error) => {
                                notificationService.error(error.message);
                                reject();
                            });
                        }
                    })

                }
            }
        }
    }]).directive('mailingFetchCandidates',["$q", "$localStorage", "$filter", "$rootScope", "notificationService", "Vacancy", function ($q, $localStorage, $filter, $rootScope, notificationService, Vacancy) {
        return {
            restrict: 'EA',
            template: `<div class="item" ng-show="statuses">
                            <label ng-show="statuses && (status.value != 'approved' && status.value != 'notafit')">{{'interview_status'|translate}}</label>
                            <div ng-show="$root.hover && $root.status2 === false" style="position: absolute">{{"longlist"|translate}}</div>
                            <select ng-model="currentStatus" class="stage-select" ng-change="fetchCandidates()" id="stageSelect">
                                <option ng-repeat="status in statuses track by status.value"
                                        value="{{status}}">
                                    {{status.value|translate}} ({{status.count?status.count:'0'}})
                                </option>
                            </select>
                        </div>`,
            scope: {
              statuses: '=',
              vacancyId: '@',
              localId: '@',
              candidates: '='
            },
            link: function (scope, element) {
                scope.currentStatus = {};
                let regForMailSplit = /[\s,;]+/;
                let maxCandidatesPerRequest = 500;
                let vacancySearchParams = {
                    state: status.value,
                    page: {number:0, count: maxCandidatesPerRequest},
                    vacancyId: scope.vacancyId,
                    interviewSortEnum: 'addInVacancyDate',
                    withCandidates: true,
                    withVacancies: false
                };
                let recipientsSource = JSON.parse($localStorage.get('mailingRecipientsSource'));
                recipientsSource = recipientsSource?recipientsSource:{localId: "", vacancyId: "",};
                scope.fetchCandidates = function () {
                    if(scope.currentStatus) {
                        let statusPicked = JSON.parse(scope.currentStatus);
                        vacancySearchParams.page.count = statusPicked.count;
                        vacancySearchParams.vacancyId = scope.vacancyId||recipientsSource.vacancyId;
                        vacancySearchParams.state = statusPicked.customInterviewStateId?statusPicked.customInterviewStateId:statusPicked.value;
                        if(statusPicked.count > 0 && statusPicked.count < maxCandidatesPerRequest) {
                            fetchCandidate(vacancySearchParams, statusPicked.value).then((result) => {
                                setTable(result);
                            }, (error) => {
                            });
//If candidates count too large, load through several requests
                        } else if (statusPicked.count >= maxCandidatesPerRequest){
                            let pagesCount = Math.ceil(statusPicked.count/maxCandidatesPerRequest);
                            vacancySearchParams.page.count = maxCandidatesPerRequest;
                            recursiveFetch(pagesCount, []);
                        }
                    }
                };


                function recursiveFetch(pages,candidates) {
                    let countPages = pages;
                    let allFetched = candidates;
                    if(pages > 0) {
                        countPages--;
                        vacancySearchParams.page.number = countPages;
                        fetchCandidate(vacancySearchParams).then((result) => {
                            allFetched = allFetched.concat(result);
                            recursiveFetch(countPages,allFetched);
                        }, (error) => {
                        });
                    } else {
                        setTable(allFetched);
                    }
                }

                function setTable(result) {
                    let candidates = candidatesToTable(result);
                    if(candidates && candidates.length > 0) {
                        scope.candidates = candidates;
                        $localStorage.set('candidatesForMailing', scope.candidates);
                        scope.$parent.emptyEmails.count = 0;
                    } else {
                        notificationService.error($filter('translate')('No active candidates on this stage'));
                    }
                }


                function fetchCandidate(params, stageName) {
                    return new $q((resolve, reject) => {
                        $rootScope.loading = true;
                        Vacancy.getCandidatesInStages(params, (resp) => {
                            if(resp.status != 'error') {
                                saveVacancyParams(params.state, scope.localId, scope.vacancyId, stageName);
                                $rootScope.loading = false;
                                if(!$rootScope.$$phase)
                                    $rootScope.$apply();
                                resolve(resp.objects);
                            } else {
                                notificationService.error(resp.message);
                                $rootScope.loading = false;
                                if(!$rootScope.$$phase)
                                    $rootScope.$apply();
                                reject();
                            }
                        }, (error) => {
                            notificationService.error(error.message);
                            $rootScope.loading = false;
                            if(!$rootScope.$$phase)
                                $rootScope.$apply();
                            reject();
                        })
                    })
                }


                function saveVacancyParams(state, localId, vacancyId, stageName) {
                    $localStorage.set('mailingRecipientsSource', JSON.stringify({
                        localId: localId?localId:recipientsSource.localId,
                        vacancyId: vacancyId?vacancyId:recipientsSource.vacancyId,
                        state: state,
                        stageName: stageName,
                        fullState: JSON.parse(scope.currentStatus)
                    }));
                }

                
                function candidatesToTable(fetched) {
                    let transformed = [];
                    fetched.forEach((candidate)=> {
                        if(candidate.candidateId.status != 'archived') {
                            transformed.push({
                                candidateId: {
                                    fullName:  candidate.candidateId.fullName,
                                    firstName: candidate.candidateId.fullName.split(' ')[0],
                                    lastName: candidate.candidateId.fullName.split(' ')[1]?candidate.candidateId.fullName.split(' ')[1]:'',
                                    email: candidate.candidateId.email?candidate.candidateId.email.split(regForMailSplit)[0]:'',
                                    localId: candidate.candidateId.localId
                                },
                                mailing: true
                            });
                        }
                    });
                    return transformed
                }

            }
        }
}]).directive('uiTinymceMailing', ['uiTinymceConfig', '$translate', function (uiTinymceConfig, $translate) {
    uiTinymceConfig = uiTinymceConfig || {};
    var generatedIds = 0;
    return {
        priority: 10,
        scope: {
            disabledMce: '=',
            resizable: '='
        },
        require: 'ngModel',
        link: function (scope, elm, attrs, ngModel) {
            var expression, options, tinyInstance,
                updateView = function () {
                    ngModel.$setViewValue(elm.val());
                    if (scope.tinymceChanged != undefined) {
                        scope.tinymceChanged(elm.val());
                    }
                    if (!scope.$root.$$phase) {
                        scope.$apply();
                    }

                };

            // generate an ID if not present
            if (!attrs.id) {
                attrs.$set('id', 'uiTinymce' + generatedIds++);
            }

            if (attrs.uiTinymce) {
                expression = scope.$eval(attrs.uiTinymce);
            } else {
                expression = {};
            }

            // make config'ed setup method available
            if (expression.setup) {
                var configSetup = expression.setup;
                delete expression.setup;
            }

            var plugin = [];
            if (!scope.tinyMcePlugin) {
                plugin = [
                    "advlist autolink lists link image charmap print preview hr anchor pagebreak",
                    "searchreplace visualblocks visualchars code fullscreen",
                    "insertdatetime media nonbreaking save table directionality",
                    "template paste textcolor  "
                ];
            } else {
                plugin = scope.tinyMcePlugin;
            }
            var lang = localStorage.getItem('NG_TRANSLATE_LANG_KEY');

            options = {
                // Update model when calling setContent (such as from the source editor popup)
                setup: function (ed) {
                    var args;
                    ed.on('init', function (args) {
                        ngModel.$render();
                        ngModel.$setPristine();
                    });
                    // Update model on button click
                    ed.on('ExecCommand', function (e) {
                        ed.save();
                        updateView();
                    });
                    // Update model on keypress
                    ed.on('KeyUp', function (e) {
                        ed.save();
                        updateView();
                    });
                    // Update model on change, i.e. copy/pasted text, plugins altering content
                    ed.on('SetContent', function (e) {
                        if (!e.initial && ngModel.$viewValue !== e.content) {
                            ed.save();
                            updateView();
                        }
                    });
                    ed.on('blur', function (e) {
                        elm.blur();
                    });
                    // Update model when an object has been resized (table, image)
                    ed.on('ObjectResized', function (e) {
                        ed.save();
                        updateView();
                    });
                    ed.on('change', function(e) {
                        ngModel.$viewValue = tinyInstance.getContent();
                        ed.save();
                        updateView();
                    });
                    if (configSetup) {
                        configSetup(ed);
                    }
                },
                mode: 'exact',
                theme: "modern",
                resize: scope.resizable === true ? true : false,
                readonly: 0,
                height: 300,
                language: lang != undefined || lang != null ? lang : "ru",
                browser_spellcheck: true,
                menu: {
                    format: {title: 'Format', items: 'underline strikethrough superscript subscript | formats | removeformat'},
                    insert: {title: 'Insert', items: 'media image | charmap hr insertdatetime'}
                },
                statusbar: scope.resizable === true ? true : false,
                theme_advanced_resizing: true,
                plugins: plugin,
                fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
                toolbar1: "undo redo | bold italic forecolor backcolor fontsizeselect | bullist numlist outdent indent | table | link",
                image_advtab: true,
                toolbar_items_size: 'small',
                relative_urls: false,
                link_assume_external_targets: true,

                elements: attrs.id,
                content_css: "/dist/css/tinymce.css"
            };
            // extend options with initial uiTinymceConfig and options from directive attribute value
            angular.extend(options, uiTinymceConfig, expression);
            setTimeout(function () {
                tinymce.init(options);
            });

            ngModel.$render = function () {
                if (!tinyInstance) {
                    tinyInstance = tinymce.get(attrs.id);
                }
                if (tinyInstance) {
                    tinyInstance.setContent(ngModel.$viewValue || '');
                    personalDataField();
                }
            };

            scope.$on('$destroy', function () {
                if (!tinyInstance) {
                    tinyInstance = tinymce.get(attrs.id);
                }
                if (tinyInstance) {
                    tinyInstance.remove();
                    tinyInstance = null;
                }
            });


            function personalDataField() {
                let customButton = $("#custom_mceu_1");
                if(customButton.length === 0) {
                    const tinyMceBody = $(".mce-tinymce[role='application']");
                    const $personalizedInfoButton = $("<div id=\"custom_mceu_1\" class=\"mce-widget mce-btn mce-menubtn mce-flow-layout-item mce-first mce-btn-has-text mce-toolbar-item\" tabindex=\"-1\" aria-haspopup=\"true\" aria-expanded=\"false\"><button id=\"custom_mceu_1-open\"  type=\"button\" tabindex=\"-1\"><span class=\"mce-txt\">" + $translate.instant('Personalization') + "</span> <i class=\"mce-caret\"></i></button></div>");
                    const $personalizedInfoMenu = $("<div id=\"custom_mceu_1-body\" class=\"mce-container-body mce-stack-layout mce-menu\"  style=\"width: 161.391px;display: none\"><div id=\"custom_mceu_2\" class=\"mce-menu-item mce-menu-item-normal mce-stack-layout-item mce-first\" tabindex=\"-1\" >&nbsp;<span id=\"custom_mceu_1-text\" class=\"mce-text\">" + $translate.instant('name') + "</span></div><div id=\"custom_mceu_3\" class=\"mce-menu-item mce-menu-item-normal mce-stack-layout-item\" tabindex=\"-1\" >&nbsp;<span id=\"custom_mceu_2-text\" class=\"mce-text\">" + $translate.instant('last_name') +"</span></div><div id=\"custom_mceu_4\" class=\"mce-menu-item mce-menu-item-normal mce-stack-layout-item\" tabindex=\"-1\" >&nbsp;<span id=\"mceu_30-text\" class=\"mce-text\">Email</span></div></div>");

                    if($("#custom_mceu_1-body").length === 0) {
                        $('#mailing_editor_page').append($personalizedInfoMenu);
                    }
                    tinyMceBody.find(".mce-menubar[role='menubar']").children().first().append($personalizedInfoButton);
                }
                let showMenuFlag = false;
                $('#mailing_editor_page').on("click",(event) => {
                    customButton = $("#custom_mceu_1")
                    let menuBody = $("#custom_mceu_1-body");
                    if($.contains(document.getElementById("custom_mceu_1"),event.target)) {
                        customButtonClick(menuBody);
                    } else {
                        menuBody.css("display","none");
                        showMenuFlag = false;
                        switch (true) {
                            case document.getElementById("custom_mceu_2") == event.target ||$.contains(document.getElementById("custom_mceu_2"),event.target)  :
                                customMenuClick("first_name");
                                break;
                            case document.getElementById("custom_mceu_3") == event.target ||$.contains(document.getElementById("custom_mceu_3"),event.target) :
                                customMenuClick("last_name");
                                break;
                            case document.getElementById("custom_mceu_4") == event.target || $.contains(document.getElementById("custom_mceu_4"),event.target) :
                                customMenuClick("email");
                                break;
                        }
                    }
                });

                function customMenuClick(personsParam) {
                    let currentInstance = tinymce.get(attrs.id);
                    ngModel.$viewValue = currentInstance.getContent();
                    let currentModel = ngModel.$viewValue;
                    let lastP = currentModel.lastIndexOf("</p>");
                    currentModel = currentModel.slice(0,lastP) + "[" + personsParam + "]" +  currentModel.slice(lastP,currentModel.length);
                    ngModel.$setViewValue(currentModel);
                    currentInstance.setContent(ngModel.$viewValue || '');
                }

                function customButtonClick(menuBody) {
                    menuBody.css({
                        "left": customButton.offset().left,
                        "top": customButton.offset().top + 30
                    });
                    showMenuFlag ? menuBody.css("display","none"): menuBody.css("display","block");
                    showMenuFlag = !showMenuFlag;
                }

            };

        }
    };
}]);
