angular.module('RecruitingApp', [
    'ngRoute',
    'ngCookies',
    'RecruitingApp.filters',
    'services',
    'RecruitingApp.directives',
    'ngTable',
    'once',
    "infinite-scroll",
    'oi.file',
    'oi.list',
    'ui.tinymce',
    'ui.notify',
    'LocalStorageModule',
    'pascalprecht.translate',
    'pasvaz.bindonce',
    'tmh.dynamicLocale',
    'uiGmapgoogle-maps',
    'googlechart',
    'googleApi',
    'controller',
    'constant',
    'ng-sortable',
    'angulartics',
    'angulartics.google.analytics',
    'ngQuickDate',
    'ui.bootstrap',
    'outlookApi'
]).config(['$routeProvider', '$locationProvider','$analyticsProvider', function ($routeProvider, $locationProvider, $analyticsProvider) {
    var universalResolves = {
        app: function ($q, $rootScope, $location, $route, $http, serverAddress,$filter, notificationService) {
            var defer = $q.defer();
            SecurityFilter($rootScope, defer, $location, $route, $http, serverAddress,$filter, notificationService);
            return defer.promise;
        }
    };
    var customRouteProvider = angular.extend({}, $routeProvider, {
        when: function (path, route) {
            route.resolve = (route.resolve) ? route.resolve : {};
            angular.extend(route.resolve, universalResolves);
            $routeProvider.when(path, route);
            return this;
        }
    });
    customRouteProvider
        .when('/organizer', {
            templateUrl: 'partials/future.html',
            title: 'Organizer',
            controller: 'ActivityFutureController',
            pageName: "Activity"
        })
        .when('/organizer/calendar', {
            templateUrl: 'partials/GoogleCalendar.html',
            title: 'Google Calendar',
            controller: 'ActivityCalendarController',
            pageName: "Activity Calendar"
        }).when('/efficiency', {
            templateUrl: 'partials/efficiency.html',
            title: 'Efficiency',
            controller: 'EfficiencyController',
            pageName: "Efficiency"
        })
        .when('/reports/statistics', {
            templateUrl: 'partials/statistics.html',
            title: 'statistics',
            controller: 'ActivityStatisticsController',
            pageName: "Statistics client"
        })
        .when('/company/settings/:param', {
            templateUrl: 'partials/companysettings.html',
            title: 'Company settings',
            controller: 'ActivityCompanySettingsController',
            pageName: "Company settings"
        })
        .when('/company/settings', {
            templateUrl: 'partials/companysettings.html',
            title: 'Company settings',
            controller: 'ActivityCompanySettingsController',
            pageName: "Company settings"
        })
        .when('/clients/statistics', {
            title: 'Clients',
            templateUrl: 'partials/statisticsС.html',
            controller: "ClientsStatisticsController",
            pageName: "Statistics client"
        }).when('/company/history', {
            templateUrl: 'partials/history.html',
            title: 'Activity History',
            controller: 'ActivityGlobalHistoryController',
            pageName: "Company History"
        }).when('/notices', {
            templateUrl: 'partials/notices.html',
            title: 'Notifications',
            controller: 'ActivityNoticesController',
            pageName: "ActivityNotice"
        }).when('/candidates', {
            title: 'Candidates',
            templateUrl: 'partials/candidates.html',
            controller: "CandidateController",
            pageName: "Candidates"
        })
        .when('/notifications', {
            title: "Email_notifications",
            templateUrl: 'partials/notification.html',
            controller: "NotificationController",
            pageName: "Notification"
        })
        //.when('/pay', {
        //    title: 'pay',
        //    templateUrl: 'partials/pay.html',
        //    controller: "payController",
        //    pageName: "pay"
        //})
        //.when('/payPlaton', {
        //    title: 'Pay',
        //    templateUrl: 'partials/payPlaton.html',
        //    controller: "payPlatonController",
        //    pageName: "pay"
        //})
        .when('/pay', {
            title: 'Pay',
            templateUrl: 'partials/pay.html',
            controller: "payWay4PayController",
            pageName: "pay"
        })
        .when('/candidates/:id', {
            title: 'Candidate',
            templateUrl: 'partials/candidate.html',
            controller: "CandidateOneController",
            pageName: "Candidate",
            reloadOnSearch: false
        })
        .when('/candidates/:id/:test', {
            title: 'Candidate',
            templateUrl: 'partials/candidate.html',
            controller: "CandidateOneController",
            pageName: "Candidates",
            reloadOnSearch: false
        })
        .when('/candidate/add/', {
            title: 'Add candidate',
            templateUrl: "partials/candidate-add.html",
            controller: "CandidateAddController",
            pageName: "Candidate add"
        })
        .when('/candidate/edit/:id', {
            title: 'Edit candidate',
            templateUrl: "partials/candidate-add.html",
            controller: "CandidateEditController",
            pageName: "Candidate edit",
            reloadOnSearch: false
        })
        .when('/candidate/merge/:id', {
            title: 'Merge candidate',
            templateUrl: "partials/candidate-merge.html",
            controller: "CandidateMergeController",
            pageName: "Candidate merge",
            reloadOnSearch: false
        }).when('/candidate/tests', {
            title: "Tests and forms",
            templateUrl: "partials/tests.html",
            controller: "testsAndForms",
            pageName: "Tests and forms"
        }).when('/candidate/test/:id', {
            title: "Tests and forms",
            templateUrl: "partials/test.html",
            controller: "testsAndForms",
            pageName: "Test page"
        }).when('/candidate/test/results/:id', {
            title: "Test results",
            templateUrl: "partials/test-result.html",
            controller: "testResults",
            pageName: "Test results"
        }).when('/candidate/test/details/:id', {
            title: "Detailed test results",
            templateUrl: "partials/test-detail.html",
            controller: "testResults",
            pageName: "Detailed test results"
        }).when('/candidate/tests/results/:id', {
            title: "Tests results",
            templateUrl: "partials/test-result.html",
            controller: "testResults",
            pageName: "Tests results"
        }).when('/candidate/send-test-candidate-to-email/:id', {
            title: "Send test candidate to email",
            templateUrl: "partials/sendTestCandidateToEmail.html",
            controller: "testsAndForms",
            pageName: "Send test candidate to email"
        }).when('/candidate/send-test-candidate-to-email-from-vacancy', {
            title: "Send test candidate to email",
            templateUrl: "partials/sendTestCandidateToEmail.html",
            controller: "testsAndForms",
            pageName: "Send test candidate to email from vacancy"
        }).when('/candidate/send-test-candidate-to-email-from-candidate', {
            title: "Send test candidate to email",
            templateUrl: "partials/sendTestCandidateToEmail.html",
            controller: "testsAndForms",
            pageName: "Send test candidate to email from candidate"
        }).when('/candidate/add/email', {
            title: "Get candidates from email",
            templateUrl: "partials/candidateAddFromEmail.html",
            controller: "CandidateAddFromEmailController",
            pageName: "Candidates add from email"
        }).when('/candidate/add/zip', {
            title: "Get candidates from zip",
            templateUrl: "partials/candidateAddFromZip.html",
            controller: "CandidateAddFromZipController",
            pageName: "Zip"
        }).when('/candidates_link', {
            title: 'Candidates',
            templateUrl: 'partials/candidateslink.html',
            controller: "CandidateLINKController",
            pageName: "Candidates"
        }).when('/xray_link', {
            title: 'Candidates X-Ray LinkedIn Search',
            templateUrl: 'partials/xraylink.html',
            controller: "CandidateXRayLinkController",
            pageName: "Candidates"
        })
        .when('/clients', {
            title: 'Clients',
            templateUrl: "partials/clients.html",
            controller: "ClientsController",
            pageName: "Clients"
        })
        .when('/client/add/', {
            title: 'New client',
            templateUrl: 'partials/client-add.html',
            controller: "ClientAddController",
            pageName: "Client add"
        })
        .when('/client/edit/:id', {
            title: 'Edit client',
            templateUrl: 'partials/client-add.html',
            controller: "ClientEditController",
            pageName: "Client edit",
            reloadOnSearch: false
        })
        .when('/clients/:id', {
            title: 'Client',
            templateUrl: "partials/client.html",
            controller: "ClientOneController",
            reloadOnSearch: false,
            pageName: "Clients"
        })
        .when('/contacts/:id', {
            title: 'Contacts',
            templateUrl: "partials/contacts.html",
            controller: "ContactsOneController",
            reloadOnSearch: false,
            pageName: "Clients"
        })
        .when('/contact/add/:id', {
            title: 'Add contact',
            templateUrl: "partials/contact-add.html",
            controller: "ContactAddController",
            pageName: "Clients"
        })
        .when('/contact/edit/:contactId', {
            title: 'Edit contact',
            templateUrl: "partials/contact-add.html",
            controller: "ContactEditController",
            pageName: "Contact Edit",
            reloadOnSearch: false
        })
        .when('/vacancies', {
            title: 'Vacancies',
            templateUrl: 'partials/vacancies.html',
            controller: "vacanciesController",
            pageName: "Vacancies"
        })
        .when('/vacancies/:id', {
            title: 'Vacancy',
            templateUrl: 'partials/vacancy.html',
            controller: "vacancyController",
            reloadOnSearch: false,
            pageName: "Vacancies"
        })
        .when('/vacancy/add', {
            title: 'Add vacancy',
            templateUrl: 'partials/vacancy-add.html',
            controller: "vacancyAddController",
            pageName: "Vacancy add",
            resolve: {
                CustomFieldList: function(CustomField) {
                    return new Promise((resolve, reject) => {
                        CustomField.getFullFields({objectType: 'vacancy'},
                            resp => resolve(resp),error => reject(error));
                    });
                }
            }
        })
        .when('/vacancy/edit/:id', {
            title: 'Edit vacancy',
            templateUrl: 'partials/vacancy-add.html',
            controller: "vacancyEditController",
            pageName: "Vacancy edit",
            reloadOnSearch: false
        })
        .when('/vacancy/report/:id', {
            title: 'Vacancy report',
            templateUrl: 'partials/vacancy-reports.html',
            controller: 'vacancyReportController',
            pageName: 'Vacancies'
        })
        .when('/reports/vacancy', {
            title: 'Vacancy report',
            templateUrl: 'partials/vacancy-report.html',
            controller: 'reportsController',
            pageName: 'Vacancy report'
        })
        .when('/reports/vacancy/:id', {
            title: 'Vacancy report',
            templateUrl: 'partials/vacancy-reports.html',
            controller: 'vacancyReportController',
            pageName: 'Vacancy report'
        })
        .when('/reports/reportall', {
            templateUrl: 'partials/report-all.html',
            title: 'Report',
            controller: 'reportAllController',
            pageName: "Report all"
        })
        .when('/company/users', {
            title: 'Users',
            templateUrl: "partials/users.html",
            controller: "usersController",
            pageName: "Company users"
        })
        .when('/company/custom-fields', {
            title: "Custom fields",
            templateUrl: "partials/customFields.html",
            controller: "CustomFieldController",
            pageName: "Custom fields"
        })
        .when('/users/:id', {
            title: "User",
            templateUrl: "partials/user.html",
            controller: "userOneController",
            pageName: "Users"
        })
        .when('/personInfo/:id', {
            title: "User Info",
            templateUrl: "partials/user.html",
            controller: "userOneController",
            pageName: "User"
        }).when('/recalls/:id', {
            title: "Recalls Info",
            templateUrl: "partials/recall.html",
            controller: "recallController",
            pageName: "Recalls Info"
        }).when('/email/vacancy/:vacancyId', {
            title: "Send email",
            templateUrl: "partials/vacancy-send-candidates-to-client.html",
            controller: "CandidateEmailSend",
            pageName: "Vacancies"
        }).when('/excelHistory', {
            title: "Excel History",
            templateUrl: "partials/excel-history.html",
            controller: "excelHistoryController",
            pageName: "Excel History"
        }).when('/company/employees', {
            title: "employees",
            templateUrl: "partials/employees.html",
            controller: "EmployeesController",
            pageName: "Company employees"
        })
        .when('/company/employees/:id', {
            title: "employees",
            templateUrl: "partials/employee.html",
            controller: "EmployeeOneController",
            pageName: "Employee User"
        })
        .when('/company/employee/add', {
            title: "Adding an employee",
            templateUrl: "partials/employee-add.html",
            controller: "EmployeeAddController",
            pageName: "Employee add"
        })
        .when('/company/employee/add/:candidateId', {
            title: "Adding an employee",
            templateUrl: "partials/employee-add-from-candidate.html",
            controller: "EmployeeAddFromCandidateController",
            pageName: "Users"
        })
        .when('/company/employees/edit/:employeeId', {
            title: "Edit candidate",
            templateUrl: "partials/employee-add.html",
            controller: "EmployeeEditController",
            pageName: "Employee Edit User"
        }).when('/company/departmentCatalog', {
            templateUrl: 'partials/departmentCatalog.html',
            title: 'Department catalog',
            controller: 'DepartmentCatalogController',
            pageName: "Department Catalog"
        }).when('/faq', {
            templateUrl: 'partials/faq.html',
            title: 'FAQ',
            controller: 'FeedbackController',
            pageName: "FAQ"
        }).when('/ask_question', {
            templateUrl: 'partials/feedback-page.html',
            title: 'Ask question',
            controller: 'FeedbackController',
            pageName: "Ask question"
        }).when('/report_problem_on_this_page', {
            templateUrl: 'partials/feedback-page.html',
            title: 'Report problem on this page',
            controller: 'FeedbackController',
            pageName: "Report problem on this page"
        }).when('/suggest_improvement_or_request_feature', {
            templateUrl: 'partials/feedback-page.html',
            title: 'Suggest improvement or request feature',
            controller: 'FeedbackController',
            pageName: "Suggest improvement or request feature"
        }).when('/feedback/thanks', {
            templateUrl: 'partials/feedback-page-thanks.html',
            title: 'Thanks for feedback',
            controller: 'FeedbackController',
            pageName: "Thanks for feedback"
        }).when('/feedback-new-design', {
            templateUrl: 'partials/feedback-page-new-design.html',
            title: 'Feedback for new design',
            controller: 'FeedbackController',
            pageName: "Feedback for new design"
        }).when('/feedback-new-design-thanks', {
            templateUrl: 'partials/feedback-page-new-design-thanks.html',
            title: 'Thanks for feedback',
            controller: 'FeedbackController',
            pageName: "Thanks for feedback"
        }).when('/email-integration', {
            title: "Integration with email",
            templateUrl: "partials/addEmailForTemplate.html",
            controller: "addEmailForTemplateController",
            pageName: "Integration with email"
        }).when('/news', {
            title: "News",
            templateUrl: "partials/news.html",
            controller: "newsController",
            pageName: "News"
        })
        .when('/cloud-admin',{
            templateUrl: "partials/cloud-admin.html",
            controller: "cloudAdminController",
            pageName: "Cloud Admin"
        })
        .when('/reports/pipeline',{
            title: "Pipeline",
            templateUrl: "partials/pipeline.html",
            controller: "pipelineController",
            pageName: "Pipeline"
        })
        .when('/reports',{
            title: "Reports",
            templateUrl: "partials/reports.html",
            controller: "MyReportsCtrl",
            controllerAs: "myReportsCtrl",
            pageName: "Reports"
        })
        .when('/reports/custom-reports',{
            title: "Custom Reports",
            templateUrl: "partials/custom-reports.html",
            controller: "CustomReports",
            controllerAs: "ctrlReport",
            pageName: "Custom Reports"
        })
        .when('/reports/edit-reports',{
            title: "Edit Reports",
            templateUrl: "partials/edit-custom-report.html",
            controller: "CustomReportEditCtrl",
            controllerAs: "editReport",
            pageName: "Edit Reports"
        })
        .when('/constructor-reports',{
            title: "Reports constructor",
            templateUrl: "partials/constructor-reports.html",
            controller: "constructorReports",
            pageName: "Reports constructor"
        })
        .when('/settings', {
           title: "Settings",
           templateUrl: "partials/settings.html",
           controller: "NavbarController",
           pageName: "Settings"
        })
        .when('/invoice', {
            templateUrl: 'partials/invoice.html',
            controller: 'invoiceController',
            title: "Invoice ",
            pageName: "Invoice generation",
        })
        //.when('/hr-module-info', {
        //    title: "HR-module",
        //    templateUrl: "partials/hr-module-info.html",
        //    controller: "hrModuleInfoController",
        //    pageName: "Hr-module info"
        //})
        .otherwise({redirectTo: '/organizer'});
}]).config(['$provide', '$httpProvider', 'serverAddress', 'frontMode', function ($provide, $httpProvider, serverAddress, frontMode) {
    var allRequest = {};
    var isExecuted = false;

    function stopCheckQueryTime(respUrl, $rootScope) {
        var obj = allRequest[respUrl];
        var length = 0;
        if (obj) {
            obj.stop();
            delete allRequest[respUrl];
            angular.forEach(allRequest, function (val) {
                length = length + 1;
            });
            //if (length == 0) {
            //    $rootScope.badInternetObj.show = false;
            //}
        }
    }

    $httpProvider.interceptors.push(function ($q, $rootScope, $window, $location) {
        return {
            'request': function (requestConfig) {
                if (!allRequest[requestConfig.url] && checkUrl(serverAddress, requestConfig.url, requestConfig.method)) {
                    allRequest[requestConfig.url] = new CheckQueryTime(requestConfig.url, $rootScope);
                    allRequest[requestConfig.url].start();
                }
                return requestConfig;
            },
            'response': function (responseConfig) {
                if (checkUrl(serverAddress, responseConfig.config.url, responseConfig.config.method)) {
                    if (responseConfig.status >= 400 && responseConfig.status < 500) {
                        handErrorException(isExecuted, serverAddress, val.status, frontMode, $window, $location);
                        stopCheckQueryTime(responseConfig.config.url, $rootScope);
                    } else {
                        stopCheckQueryTime(responseConfig.config.url, $rootScope);
                    }
                }
                return responseConfig;
            }, 'responseError': function (val) {
                if(val.config.url == '/hr/person/authping'){
                    $rootScope.notAuthorized = true;
                }else{
                    if($rootScope.notAuthorized == undefined){
                        $rootScope.notAuthorized = false;
                    }
                }
                handErrorException(isExecuted, serverAddress, val.status, frontMode, $window, $location, $rootScope);
                stopCheckQueryTime(val.config.url, $rootScope);
                return $q.reject(val);
            }
        };
    });
//    --------------------------------------------------------------------------------------------------------- Interceptor on every response
    $httpProvider.interceptors.push('responseObserver');
}]).run(function ($rootScope, $templateCache, CheckAccess, $window) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if (current != undefined && current.$$route != undefined) {
            $rootScope.previousLocation = current.$$route.originalPath;
        }
        if (next != undefined && next.$$route != undefined) {
            $rootScope.currentLocation = next.$$route.originalPath;
        }

        if (typeof (current) !== 'undefined') {
            $templateCache.remove(current.templateUrl);
        }
    });
}).run(function ($location, $rootScope, CheckAccess, $window, $filter, $localStorage, Vacancy, notificationService, translateWords) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {


        if(previous && previous.$$route != undefined){
            if( previous.$$route.pageName === "Custom fields" ){
                delete $rootScope['tabsForFields'];
                delete $rootScope['setAccess'];
            }

            if(current.originalPath == "/candidates/:id"&& previous.originalPath != "/vacancies/:id"){
                $rootScope.stageUrl = false;
            }
        }else{
            $rootScope.stageUrl = false;
        }

        if (current.$$route != undefined) {
            if (current.$$route.title !== undefined) {
                // $rootScope.notFormatedTitle = $filter('translate')(current.$$route.title);
                translateWords.getTranslete(current.$$route.title, $rootScope, 'title', true);
                $rootScope.title = $filter('translate')(current.$$route.title) + " | CleverStaff";
                //var firstPage = "http://127.0.0.1:8080/!#/ask_question";
                //var secondPage = "http://127.0.0.1:8080/!#/report_problem_on_this_page";
                //var thirdPage = "http://127.0.0.1:8080/!#/suggest_improvement_or_request_feature";
                var firstPage = $location.$$protocol + "://" + $location.$$host + "/!#/ask_question";
                var secondPage = $location.$$protocol + "://" + $location.$$host + "/!#/report_problem_on_this_page";
                var thirdPage = $location.$$protocol + "://" + $location.$$host + "/!#/suggest_improvement_or_request_feature";
                $rootScope.previousHistoryFeedback = $location.$$absUrl;
                //console.log($location.$$path.replace('/candidates/'+$scope.candidate.localId, '/candidates/'));
                if($rootScope.previousHistoryFeedback != firstPage && $rootScope.previousHistoryFeedback != secondPage && $rootScope.previousHistoryFeedback != thirdPage){
                    $localStorage.set('previousHistoryFeedback', $rootScope.previousHistoryFeedback);
                }

            }
            if(current.$$route.originalPath != undefined && current.$$route.originalPath == "/cloud-admin"){
                if($rootScope.me){
                    if($rootScope['me']['personParams']['domainAdmin'] == 'all'){
                        document.title = 'Admin Panel of all accounts | CleverStaff';
                    }else{
                        document.title =  "Admin Panel of domain" + $rootScope['me']['personParams']['domainAdmin'];
                    }
                }

            }
            if (current.$$route.pageName !== undefined) {
                $rootScope.activePage = current.$$route.pageName;
                if($rootScope.activePage == 'Candidate'){
                    if(angular.element($window).width() < 992){
                        $rootScope.hideContainer = false;
                    }
                }else{
                    $rootScope.hideContainer = true;
                }
                if($rootScope.activePage != 'Candidate edit'){
                    $('#select2-drop').hide();
                    $('#select2-drop-mask').hide();
                }
            }
        }
        $rootScope.stageName = '';
        $('.showCustomStage').hide();
        $rootScope.sendTestFromVacancyStage = function (stage, longlist, dataForVacancy) {
            if(stage == undefined){
                stage = longlist;
            }
            $localStorage.set('activeCustomStageId', stage);
            $rootScope.vacancySearchParams = {
                state: stage,
                vacancyId: $rootScope.vacancy.vacancyId,
                withCandidates: true,
                withVacancies: true
            };
            Vacancy.getCandidatesInStages($rootScope.vacancySearchParams, function(resp){
                if(resp.objects.length == 0){
                    notificationService.error($filter('translate')('add candidates to the stage'));
                }else{
                    $rootScope.candidatesInStages = resp.objects;
                    $localStorage.set('vacancyForTest', $rootScope.candidatesInStages);
                    $location.path('/candidate/send-test-candidate-to-email-from-vacancy');
                }
            });
        };
        $rootScope.sendCandidateToTest = function(candidate, count){
            if(count == 0){
                notificationService.error($filter('translate')('Please add an email before sending a test to this candidate'))
            }else{
                if(candidate != undefined){
                    $localStorage.set('candidateForTest', candidate);
                    $rootScope.candidateToTest = JSON.parse($localStorage.get('candidateForTest'));
                    $location.path('/candidate/send-test-candidate-to-email-from-candidate');
                    $rootScope.fromCandidate = [candidate];
                    $rootScope.emailCandidateId = candidate.candidateId;
                    if(candidate.contacts.length > 0){
                        angular.forEach(candidate.contacts, function (nval) {
                            if (nval.type == "email") {
                                delete  $rootScope.emailCandidate;
                                var email = nval.value.split(" ")[0];
                                $rootScope.emailCandidate = email.replace(/,/g,"");
                            }
                        });
                    }else{
                        notificationService.error($filter('translate')('Please add an email before sending a test to this candidate'))
                    }
                }
            }
        };
        $('#candidate_preview').css({
            "top": 0,
            "left": 0,
            "display": "none"
        });

    });
}).config(function (googleServiceProvider, $logProvider, $translateProvider, tmhDynamicLocaleProvider) {
    /************************************/
    googleServiceProvider.configure({
        clientIdT: '195081582460-eo4qmmi7o6hii0ckmrc004lhkh9m3596.apps.googleusercontent.com',
        clientIdW: apiKey.google.client_id,
        calendarName: 'CleverStaff events',
        scopes: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/calendar"],
        gmailScopes: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/gmail.readonly"]
    });
    /************************************/
    $logProvider.debugEnabled(false);
    /************************************/
    $translateProvider.useStaticFilesLoader({
        prefix: 'languange/locale-',
        suffix: '.json?b=93'
    });
    $translateProvider.translations('en');
    $translateProvider.translations('ru');
    $translateProvider.translations('ua');
    var userLang = navigator.language || navigator.userLanguage;
    var lST = userLang.substring(0, 2);
    if (lST == "ru" || lST == "be") {
        $translateProvider.preferredLanguage('ru');
    }
    if (lST == "uk") {
        $translateProvider.preferredLanguage('ua');
    } else {
      $translateProvider.preferredLanguage('en');
    }

    $translateProvider.useLocalStorage();
    /************************************/
    tmhDynamicLocaleProvider.localeLocationPattern('lib/angular/i18n/angular-locale_{{locale}}.js');
    tmhDynamicLocaleProvider.useCookieStorage();
    /************************************/
    if (!navigator.saysWho) {
        navigator.saysWho = (function () {
            var ua = navigator.userAgent, tem,
                M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return 'IE ' + (tem[1] || '');
            }
            if (M[1] === 'Chrome') {
                tem = ua.match(/\bOPR\/(\d+)/);
                if (tem != null) return 'Opera ' + tem[1];
            }
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
            return M.join(' ');
        })();
    }
});

var controller = angular.module('controller', []);

function handErrorException(isExecuted, serverAddress, status, frontMode, $window, route, $rootScope) {
    if (status == 403 || status == 502) {
        if (!isExecuted) {
            isExecuted = true;
            if (route.$$path.indexOf('/vacancies/') == 0) {
                var path = route.$$path.replace('vacancies/', 'vacancy-');
                $window.location.replace('/i#' + path);
            }
        }
    }
    if (status == 404) {
        checkAuth(serverAddress, function (resp) {
            if (resp != 200) {
                $window.location.replace('/');
            }
        })

    }
}

function checkAuth(serverType, $rootScope, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', serverType + '/person/authping', true);
    request.onload = function () {
        callback(request.status);
    };

    request.send();

}

function checkUrl(serverAddress, url, method) {
    if (url == "partials/client.html" ||
        url == "partials/candidate.html" ||
        url == "partials/vacancy.html" ||
        url == "partials/user.html" ||
        url == "partials/candidates.html" ||
        url == "partials/vacancies.html" ||
        url == "partials/future.html" ||
        url == "partials/employees.html" ||
        url == "partials/statistics.html" ||
        url == "partials/pay.html" ||
        url == "partials/payPlaton.html" ||
        url == "partials/clients.html" ||
        url == "partials/users.html") {
        return true;
    } else if ((url == serverAddress + "/candidate/get" && method == "GET") ||
        (url == serverAddress + "/vacancy/get" && method == "GET") ||
        (url == serverAddress + "/client/get" && method == "GET") ||
        (url == serverAddress + "/contact/get" && method == "GET") ||
        (url == serverAddress + '/person/getPerson' && method == "GET")) {
        return true;
    } else {
        return false;
    }

}

function CheckQueryTime(url, $root) {
    var active = false;
    return {
        getActive: function () {
            return active;
        },
        stop: function () {
            active = false;
        },
        start: function () {
            this.timer();
        },
        check: function () {
            if (active) {
                /** @namespace $root.badInternetObj */
                if (!$root.badInternetObj.show) {
                    $root.badInternetObj.show = true;
                    if (!$root.$$phase) {
                        $root.$apply();
                    }
                }
            }
        },
        timer: function () {
            if (!active) {
                active = true;
                setTimeout(this.check, 5000);
            }
        }
    }
}

var defaultRoute = '/organizer';
function checkUrlByRole(url, Role,  accessLevel, $location, serverAddress, $http, $filter, notificationService) {
    if (Role == 'client'){
        if (url == '/candidate/add/' || url == '/candidate/edit/' ||
            url == '/client/add/') {
            $location.path(defaultRoute);
        } else if (url == '/company/statistics') {
            $location.path('/clients/statistics');
        } else {
            return true;
        }
    }else if ((accessLevel == 'hide') && (url == "/vacancy/add" || url == "/vacancy/edit/:id" || url == "/clients" ||
        url == '/client/add/' || url == '/client/edit/:id' || url == '/email/vacancy/:vacancyId')) {

        notificationService.error($filter('translate')('This function is not available'));
        $location.path('/vacancies');
    } else {
        return true;
    }
}

function setPersonParams($http, userId, paramName, paramValue, serverAddress) {
    $http.get(serverAddress + '/person/changeUserParam?userId=' + userId + "&name=" + paramName + "&value=" + paramValue).success(function (resp) {
    });
}

function SecurityFilter($rootScope, deffer, $location, $route, $http, serverAddress, $filter, notificationService) {
    if ($route.current.$$route != undefined) {
        var routeName = $route.current.$$route.originalPath;
        $rootScope.$watch(
            'me',
            function meWatch(newValue,oldValue){
                if(newValue != undefined){
                    if (newValue.personParams == undefined
                        || newValue.personParams.timeZoneOffset == undefined
                        || newValue.personParams.timeZoneOffset != new Date().getTimezoneOffset()) {
                        setPersonParams($http, newValue.userId, "timeZoneOffset", new Date().getTimezoneOffset(), serverAddress);
                    }
                    if (newValue.status === 'error') {
                        //$window.location.replace('/');
                    } else {
                        $rootScope.me = newValue;
                        if (checkUrlByRole(routeName, newValue.recrutRole, newValue.personParams.clientAccessLevel, $location, serverAddress, $http, $filter, notificationService)) {
                            deffer.resolve();
                        }
                    }
                }
            }
        );

    } else {
        deffer.resolve();
    }
}