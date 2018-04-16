angular.module('RecruitingApp', [
    'ngRoute',
    'ui.router',
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
    'components',
    'constant',
    'ng-sortable',
    'angulartics',
    'angulartics.google.analytics',
    'ngQuickDate',
    'ui.bootstrap',
    'outlookApi'
]).config(['$routeProvider', '$locationProvider','$analyticsProvider', '$stateProvider', '$urlRouterProvider', function ($routeProvider, $locationProvider, $analyticsProvider, $stateProvider, $urlRouterProvider) {
    $locationProvider.hashPrefix('');

    let states = [{
        url: "/organizer",
        name: 'organizer',
        component: 'organizer',
        data: {
            title: 'Organizer',
            pageName: 'Activity'
        }
    },{
        url:'/organizer/calendar',
        name: 'calendar',
        templateUrl: 'partials/GoogleCalendar.html?b1',
        controller: 'ActivityCalendarController',
        data: {
            title: 'Google Calendar',
            pageName: 'Activity Calendar'
        }
    },{
        url: "/mailing",
        name: 'mailing',
        component: 'mailing',
        data: {
            title: 'Mailing',
            pageName: "Mailing"
        }
    },{
        name: 'mailing.details',
        component: 'mDetails',
    },{
        name: 'mailing.editor',
        component: 'editor'
    },{
        name: 'mailing.preview',
        component: 'preview'
    },{
        url: "/mailings",
        name: 'mailings',
        component: 'mailings',
        data: {
            title: 'My mailings',
            pageName: "Mailings"
        }
    },{
        url: "/prepared",
        name: 'mailings.saved',
        component: 'saved'
    },{
        url: "/sent",
        name: 'mailings.sent',
        component: 'mailingsSent'
    },{
        url: "/sent-mailing",
        name: 'sent-mailing',
        component: 'mailingSent'
    },{
        url: "/users/{id}",
        name: 'user',
        component: 'user'
    },{
        url: "/candidates",
        templateUrl: 'partials/candidates.html?b1',
        controller: "CandidateController",
        name: 'candidates',
        data: {
            title: 'Candidates',
            pageName: "Candidates"
        }
    }, {
        url:'/candidates/{id}',
        name: 'candidate',
        templateUrl: 'partials/candidate.html?b1',
        controller: "CandidateOneController",
        data: {
            title: "Candidate",
            pageName: "Candidate"
        },
        reloadOnSearch: false
    },{
        url:'/candidates/{id}/{test}',
        name: 'candidate-test-one',
        templateUrl: 'partials/candidate.html?b1',
        controller: "CandidateOneController",
        data: {
            title: "Candidate",
            pageName: "Candidates"
        },
        reloadOnSearch: false
    },{
        url:'/candidate/add',
        name:'candidate-add',
        templateUrl: "partials/candidate-add.html?b1",
        controller: "CandidateAddController",
        data: {
            title: "Add candidate",
            pageName: "Candidate add"
        }
    },{
        url:'/candidate/edit/{id}',
        name: 'candidate-edit',
        templateUrl: "partials/candidate-add.html?b1",
        controller: "CandidateEditController",
        data: {
            title: "Edit candidate",
            pageName: "Candidate edit"
        },
        reloadOnSearch: false
    },{
        url:'/candidate/merge/{id}',
        name:"candidate-merge",
        templateUrl: "partials/candidate-merge.html?b1",
        controller: "CandidateMergeController",
        data: {
            title: 'Merge candidate',
            pageName: "Candidate merge"
        },
            reloadOnSearch: false
    },{
        url:'/candidate/tests',
        name:'candidate-tests',
        templateUrl: "partials/tests.html?b1",
        controller: "testsAndForms",
        data: {
            title: "Tests and forms",
            pageName: "Tests and forms"
        }
    },{
        url:'/candidate/tests/results/:id',
        name: 'test-results-one',
        templateUrl: "partials/test-result.html?b1",
        controller: "testResults",
        data: {
            title: "Tests results",
            pageName: "Tests results"
        }
    },{
        url:'/candidate/test/{id}',
        name:'candidate-test',
        templateUrl: "partials/test.html?b1",
        controller: "testsAndForms",
        data: {
            title: "Tests and forms",
            pageName: "Test page"
        }
    },{
        url:'/candidate/test/results/{id}',
        name: 'candidate-test-result',
        templateUrl: "partials/test-result.html?b1",
        controller: "testResults",
        data: {
            title: "Test results",
            pageName: "Test results"
        }
    },{
        url:'/candidate/test/details/{id}',
        name:'candidate-test-details',
        templateUrl: "partials/test-detail.html?b1",
        controller: "testResults",
        data: {
            title: "Detailed test results",
            pageName: "Detailed test results"
        }
    },{
        url:'/candidate/send-test-candidate-to-email/{id}',
        name: "candidate-send-test",
        templateUrl: "partials/sendTestCandidateToEmail.html?b1",
        controller: "testsAndForms",
        data: {
            title: "Send test candidate to email",
            pageName: "Send test candidate to email"
        }
    },{
        url:'/candidate/send-test-candidate-to-email-from-vacancy',
        templateUrl: "partials/sendTestCandidateToEmail.html?b1",
        name: "candidate-send-test-from-vacancy",
        controller: "testsAndForms",
        data: {
            title: "Send test candidate to email",
            pageName: "Send test candidate to email from vacancy"
        }
    },{
        url:'/candidate/send-test-candidate-to-email-from-candidate',
        name: 'candidate-send-test-from-candidate',
        templateUrl: "partials/sendTestCandidateToEmail.html?b1",
        controller: "testsAndForms",
        data: {
            title: "Send test candidate to email",
            pageName: "Send test candidate to email from candidate"
        }
    },{
        url: '/candidate/add/email',
        name: "candidate-add-from-email",
        templateUrl: "partials/candidateAddFromEmail.html?b1",
        controller: "CandidateAddFromEmailController",
        data: {
            title: "Get candidates from email",
            pageName: "Candidates add from email"
        }
    },{
        url: '/candidate/add/zip',
        name: "candidate-add-zip",
        templateUrl: "partials/candidateAddFromZip.html?b1",
        controller: "CandidateAddFromZipController",
        data: {
            title: "Get candidates from zip",
            pageName: "Zip"
        }
    },{
        url:'/candidates_link',
        name:"candidate-link",
        templateUrl: 'partials/candidateslink.html?b1',
        controller: "CandidateLINKController",
        data: {
            title: 'Candidates',
            pageName: "Candidates"
        }
    },{
        url:'/efficiency',
        name:"efficiency",
        templateUrl: 'partials/efficiency.html?b1',
        controller: 'EfficiencyController',
        data: {
            title: 'Efficiency',
            pageName: "Efficiency"
        }
    }, {
        url:'/reports/statistics',
        name: "statistics",
        templateUrl: 'partials/statistics.html?b1',
        controller: 'ActivityStatisticsController',
        data: {
            title: 'statistics',
            pageName: "Statistics client"
        }
    }, {
        url:'/company/settings/{param}',
        name: "company-settings-param",
        templateUrl: 'partials/companysettings.html?b1',
        controller: 'ActivityCompanySettingsController',
        data: {
            title: 'Company settings',
            pageName: "Company settings"
        }
    },{
        url:'/company/settings',
        name: "company-settings",
        templateUrl: 'partials/companysettings.html?b1',
        controller: 'ActivityCompanySettingsController',
        data: {
            title: 'Company settings',
            pageName: "Company settings"
        }
    },{
        url:'/clients/statistics',
        name: 'statistics-clients',
        templateUrl: 'partials/statisticsС.html?b1',
        controller: "ClientsStatisticsController",
        data: {
            title: 'Clients',
            pageName: "Statistics client"
        }
    },{
        url:'/company/history',
        name: "history",
        templateUrl: 'partials/history.html?b1',
        controller: 'ActivityGlobalHistoryController',
        data: {
            title: 'Activity History',
            pageName: "Company History"
        }
    },{
        url:'/notices',
        name: "notices",
        templateUrl: 'partials/notices.html?b1',
        controller: 'ActivityNoticesController',
        data: {
            title: 'Notifications',
            pageName: "ActivityNotice"
        }
    },{
        url:'/notifications',
        name: "notifications",
        templateUrl: 'partials/notification.html?b1',
        controller: "NotificationController",
        data: {
            title: "Email_notifications",
            pageName: "Notification"
        }
    },{
        url:'/pay',
        name: "pay",
        templateUrl: 'partials/pay.html?b1',
        controller: "payWay4PayController",
        data: {
            title: 'Pay',
            pageName: "pay"
        }
    },{
        url:'/xray_link',
        name: "xray-link",
        templateUrl: 'partials/xraylink.html',
        controller: "CandidateXRayLinkController",
        data: {
            title: 'Candidates X-Ray LinkedIn Search',
            pageName: "Candidates"
        }
    },{
        url:'/clients',
        name: "clients",
        templateUrl: "partials/clients.html?b1",
        controller: "ClientsController",
        data: {
            title: 'Clients',
            pageName: "Clients"
        }
    },{
        url:'/client/add/',
        name: "client-add",
        templateUrl: 'partials/client-add.html?b1',
        controller: "ClientAddController",
        data: {
            title: 'New client',
            pageName: "Client add"
        }
    },{
        url:'/client/edit/{id}',
        name: "client-edit",
        templateUrl: 'partials/client-add.html?b1',
        controller: "ClientEditController",
        data: {
            title: 'Edit client',
            pageName: "Client edit",
        },
        reloadOnSearch: false
    },{
        url:'/clients/{id}',
        name: "clients-id",
        templateUrl: "partials/client.html?b1",
        controller: "ClientOneController",
        reloadOnSearch: false,
        data: {
            title: 'Client',
            pageName: "Clients"
        }
    },{
        url:'/contacts/{id}',
        name: "client-contacts",
        templateUrl: "partials/contacts.html?b1",
        controller: "ContactsOneController",
        reloadOnSearch: false,
        data: {
            title: 'Contacts',
            pageName: "Clients"
        }
    },{
        url:'/contact/add/{id}',
        name: "client-contact-add",
        templateUrl: "partials/contact-add.html?b1",
        controller: "ContactAddController",
        data: {
            title: 'Add contact',
            pageName: "Clients"
        }
    },{
        url:'/contact/edit/{contactId}',
        name:"contact-edit",
        templateUrl: "partials/contact-add.html?b1",
        controller: "ContactEditController",
        data: {
            title: 'Edit contact',
            pageName: "Contact Edit",
        },
        reloadOnSearch: false
    },{
        url:'/vacancies',
        name: "vacancies",
        templateUrl: 'partials/vacancies.html?b1',
        controller: "vacanciesController",
        data: {
            title: 'Vacancies',
            pageName: "Vacancies"
        }
    },{
        url:'/vacancies/{id}',
        name:"vacancies-id",
        templateUrl: 'partials/vacancy.html?b1',
        controller: "vacancyController",
        reloadOnSearch: false,
        data: {
            title: 'Vacancy',
            pageName: "Vacancies"
        }
    },{
        url:'/vacancy/add',
        name: "vacancy-add",
        templateUrl: 'partials/vacancy-add.html?b1',
        controller: "vacancyAddController",
        data: {
            title: 'Add vacancy',
            pageName: "Vacancy add",
        },
        resolve: {
            CustomFieldList: function(CustomField) {
                return new Promise((resolve, reject) => {
                    CustomField.getFullFields({objectType: 'vacancy'},
                        resp => resolve(resp),error => reject(error));
                });
            }
        }
    },{
        url:'/vacancy/edit/{id}',
        name: "vacancy-edit",
        templateUrl: 'partials/vacancy-add.html?b1',
        controller: "vacancyEditController",
        reloadOnSearch: false,
        data: {
            title: 'Edit vacancy',
            pageName: "Vacancy edit",
        }
    },{
        url:'/vacancy/report/{id}',
        name: "vacancy-report-id",
        templateUrl: 'partials/vacancy-reports.html?b1',
        controller: 'vacancyReportController',
        data: {
            title: 'Vacancy report',
            pageName: 'Vacancies'
        }
    },{
        url:'/reports/vacancy',
        name: 'vacancy-report',
        templateUrl: 'partials/vacancy-report.html?b1',
        controller: 'reportsController',
        data: {
            title: 'Vacancy report',
            pageName: 'Vacancy report'
        }
    },{
        url:'/reports/vacancy/{id}',
        name:'report-vacancy-id',
        templateUrl: 'partials/vacancy-reports.html?b1',
        controller: 'vacancyReportController',
        data: {
            title: 'Vacancy report',
            pageName: 'Vacancy report'
        }
    },{
        url:'/reports/reportall',
        name: "reportall",
        templateUrl: 'partials/report-all.html?b1',
        controller: 'reportAllController',
        data: {
            title: 'Report',
            pageName: "Report all"
        }
    },{
        url:'/company/users',
        name: "users",
        templateUrl: "partials/users.html?b1",
        controller: "usersController",
        data: {
            title: 'Users',
            pageName: "Company users"
        }
    },{
        url:'/company/custom-fields',
        name: "custom-fields",
        templateUrl: "partials/customFields.html?b1",
        controller: "CustomFieldController",
        data: {
            title: "Custom fields",
            pageName: "Custom fields"
        }
    },{
        url:'/users/{id}',
        name: "users-id",
        templateUrl: "partials/user.html?b1",
        controller: "userOneController",
        data: {
            title: "User",
            pageName: "Users"
        }
    },{
        url:'/personInfo/{id}',
        name: "person-info",
        templateUrl: "partials/user.html?b1",
        controller: "userOneController",
        data: {
            title: "User Info",
            pageName: "User"
        }
    },{
        url:'/recalls/{id}',
        name: "recalls-id",
        templateUrl: "partials/recall.html?b1",
        controller: "recallController",
        data: {
            title: "Recalls Info",
            pageName: "Recalls Info"
        }
    },{
        url:'/email/vacancy/{vacancyId}',
        name: "vacancy-send-to-client",
        templateUrl: "partials/vacancy-send-candidates-to-client.html?b1",
        controller: "CandidateEmailSend",
        data: {
            title: "Send email",
            pageName: "Vacancies"
        }
    },{
        url:'/excelHistory',
        name: "excel-history",
        templateUrl: "partials/excel-history.html?b1",
        controller: "excelHistoryController",
        data: {
            title: "Excel History",
            pageName: "Excel History"
        }
    },{
        url:'/company/employees',
        name: "employees",
        templateUrl: "partials/employees.html?b1",
        controller: "EmployeesController",
        data: {
            title: "employees",
            pageName: "Company employees"
        }
    },{
        url:'/company/employees/{id}',
        name: "employee",
        templateUrl: "partials/employee.html?b1",
        controller: "EmployeeOneController",
        data: {
            title: "employees",
            pageName: "Employee User"
        }
    },{
        url:'/company/employee/add',
        name: "employee-add",
        templateUrl: "partials/employee-add.html?b1",
        controller: "EmployeeAddController",
        data: {
            title: "Adding an employee",
            pageName: "Employee add"
        }
    },{
        url:'/company/employee/add/{candidateId}',
        name: "company-employee-add",
        templateUrl: "partials/employee-add-from-candidate.html?b1",
        controller: "EmployeeAddFromCandidateController",
        data: {
            title: "Adding an employee",
            pageName: "Users"
        }
    },{
        url:'/company/employees/edit/{employeeId}',
        name: "employee-edit",
        templateUrl: "partials/employee-add.html?b1",
        controller: "EmployeeEditController",
        data: {
            title: "Edit candidate",
            pageName: "Employee Edit User"
        }
    },{
        url:'/company/departmentCatalog',
        name: "department",
        templateUrl: 'partials/departmentCatalog.html?b1',
        controller: 'DepartmentCatalogController',
        data: {
            title: 'Department catalog',
            pageName: "Department Catalog"
        }
    },{
        url:'/faq',
        name: "faq",
        templateUrl: 'partials/faq.html?b1',
        controller: 'FeedbackController',
        data: {
            title: 'FAQ',
            pageName: "FAQ"
        }
    },{
        url:'/ask_question',
        name: "ask-question",
        templateUrl: 'partials/feedback-page.html?b1',
        controller: 'FeedbackController',
        data: {
            title: 'Ask question',
            pageName: "Ask question"
        }
    },{
        url:'/report_problem_on_this_page',
        name: 'report-problem',
        templateUrl: 'partials/feedback-page.html?b1',
        controller: 'FeedbackController',
        data: {
            title: 'Report problem on this page',
            pageName: "Report problem on this page"
        }
    },{
        url:'/suggest_improvement_or_request_feature',
        name: "suggest-improvement",
        templateUrl: 'partials/feedback-page.html?b1',
        controller: 'FeedbackController',
        data: {
            title: 'Suggest improvement or request feature',
            pageName: "Suggest improvement or request feature"
        }
    },{
        url:'/feedback/thanks',
        name: "thanks",
        templateUrl: 'partials/feedback-page-thanks.html?b1',
        controller: 'FeedbackController',
        data: {
            title: 'Thanks for feedback',
            pageName: "Thanks for feedback"
        }
    },{
        url:'/feedback-new-design',
        name:'feedback-new-design',
        templateUrl: 'partials/feedback-page-new-design.html?b1',
        controller: 'FeedbackController',
        data: {
            title: 'Feedback for new design',
            pageName: "Feedback for new design"
        }
    },{
        url:'/feedback-new-design-thanks',
        name: "feedback-new-design-thanks",
        templateUrl: 'partials/feedback-page-new-design-thanks.html?b1',
        controller: 'FeedbackController',
        data: {
            title: 'Thanks for feedback',
            pageName: "Thanks for feedback"
        }
    },{
        url:'/email-integration',
        name: "email-integration",
        templateUrl: "partials/addEmailForTemplate.html?b1",
        controller: "addEmailForTemplateController",
        data: {
            title: "Integration with email",
            pageName: "Integration with email"
        }
    },{
        url:'/news',
        name: "news",
        templateUrl: "partials/news.html?b1",
        controller: "newsController",
        data: {
            title: "News",
            pageName: "News"
        }
    },{
        url:'/cloud-admin',
        name: "cloud-admin",
        templateUrl: "partials/cloud-admin.html?b1",
        controller: "cloudAdminController",
        data: {
            title: "CLoud Admin",
            pageName: "Cloud Admin"
        }
    },{
        url:'/reports/pipeline',
        name: "pipeline",
        templateUrl: "partials/pipeline.html?b1",
        controller: "pipelineController",
        data: {
            title: "Pipeline",
            pageName: "Pipeline"
        }
    },{
        url:'/reports',
        name: "reports",
        templateUrl: "partials/reports.html?b1",
        controller: "MyReportsCtrl",
        controllerAs: "myReportsCtrl",
        data: {
            title: "Reports",
            pageName: "Reports"
        }
    },{
        url:'/reports/custom-reports',
        name: "custom-reports",
        templateUrl: "partials/custom-reports.html?b1",
        controller: "CustomReports",
        controllerAs: "ctrlReport",
        data: {
            title: "Custom Reports",
            pageName: "Custom Reports"
        }
    },{
        url:'/reports/edit-reports',
        name: "edit-reports",
        templateUrl: "partials/edit-custom-report.html?b1",
        controller: "CustomReportEditCtrl",
        controllerAs: "editReport",
        data: {
            title: "Edit Reports",
            pageName: "Edit Reports"
        }
    },{
        url:'/constructor-reports',
        name: "constructor-reports",
        templateUrl: "partials/constructor-reports.html?b1",
        controller: "constructorReports",
        data: {
            title: "Reports constructor",
            pageName: "Reports constructor"
        }
    }
    //,{url:'/hr-module-info', {
    //    title: "HR-module",
    //    templateUrl: "partials/hr-module-info.html?b1",
    //    controller: "hrModuleInfoController",
    //    pageName: "Hr-module info"
    //})
    ];
    states.forEach((state) => {
        $stateProvider.state(state);
    });
    $urlRouterProvider.otherwise("/organizer");
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
}]).run(function ($rootScope, $templateCache, CheckAccess, $window, $transitions, $q, $location, $http, serverAddress,$filter, notificationService) {
    $transitions.onBefore({}, function (transition) {
        if(transition.to() !== undefined && transition.to().url !== undefined) {
            $rootScope.currentLocation = transition.to().url;
        }
        if(transition.from() !== undefined && transition.from().url !== undefined) {
            $rootScope.previousLocation = transition.from().url;
        }
        var defer = $q.defer();
        SecurityFilter($rootScope, defer, $location, $http, serverAddress,$filter, notificationService, $rootScope.currentLocation);
        return defer.promise;
    });
}).run(function ($location, $rootScope, CheckAccess, $window, $filter, $localStorage, Vacancy, notificationService, translateWords,$transitions, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
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
    $transitions.onSuccess({}, function (transition) {
        if(transition.from() && transition.from().url != undefined){
            if( transition.from().url === "/company/custom-fields" ){
                delete $rootScope['tabsForFields'];
                delete $rootScope['setAccess'];
            }

            if(transition.to().url == "/candidates/{id}" && transition.to().url != "/vacancies/{id}"){
                $rootScope.stageUrl = false;
            }
        }else{
            $rootScope.stageUrl = false;
        }
        var firstPage = $location.$$protocol + "://" + $location.$$host + "/!#/ask_question";
        var secondPage = $location.$$protocol + "://" + $location.$$host + "/!#/report_problem_on_this_page";
        var thirdPage = $location.$$protocol + "://" + $location.$$host + "/!#/suggest_improvement_or_request_feature";
        $rootScope.previousHistoryFeedback = $location.$$absUrl;
        //console.log($location.$$path.replace('/candidates/'+$scope.candidate.localId, '/candidates/'));
        if($rootScope.previousHistoryFeedback != firstPage && $rootScope.previousHistoryFeedback != secondPage && $rootScope.previousHistoryFeedback != thirdPage){
            $localStorage.set('previousHistoryFeedback', $rootScope.previousHistoryFeedback);
        }
        if (transition.to() != undefined) {
            if(transition.to().url != undefined && transition.to().url == "/cloud-admin"){
                if($rootScope.me){
                    if($rootScope['me']['personParams']['domainAdmin'] == 'all'){
                        document.title = 'Admin Panel of all accounts | CleverStaff';
                    }else{
                        document.title =  "Admin Panel of domain" + $rootScope['me']['personParams']['domainAdmin'];
                    }
                }

            }
            if (transition.to().url !== undefined) {
                if(transition.to().url == '/candidates/{id}'){
                    if(angular.element($window).width() < 992){
                        $rootScope.hideContainer = false;
                    }
                }else{
                    $rootScope.hideContainer = true;
                }
                if(transition.to().url != '/candidate/edit/{id}'){
                    $('#select2-drop').hide();
                    $('#select2-drop-mask').hide();
                }
            }
        }
        $rootScope.stageName = '';
        $('.showCustomStage').hide();
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
        suffix: '.json?b=72'
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
var component = angular.module('components', []);
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
        try {
            callback(request.status);
        }catch (error) {
            console.log(error.status)
        }
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
        if (url == '/candidate/add' || url == '/candidate/edit/{id}' ||
            url == '/client/add') {
            $location.path(defaultRoute);
        } else if (url == '/company/statistics') {
            $location.path('/clients/statistics');
        } else {
            return true;
        }
    }else if ((accessLevel == 'hide') && (url == "/vacancy/add" || url == "/vacancy/edit/{id}" || url == "/clients" ||
        url == '/client/add/' || url == '/client/edit/{id}' || url == '/email/vacancy/{vacancyId}')) {

        notificationService.error($filter('translate')('This function is not available'));
        $location.path('/vacancies');
    } else {
        return true;
    }
}

function setPersonParams($http, userId, paramName, paramValue, serverAddress) {
    $http.get(serverAddress + '/person/changeUserParam?userId=' + userId + "&name=" + paramName + "&value=" + paramValue).then(function (resp) {
    });
}

function SecurityFilter($rootScope, deffer, $location, $http, serverAddress, $filter, notificationService, urlTo) {
    if (urlTo != undefined) {
        var routeName = urlTo;
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