
// Declare app level module which depends on filters, and services
var app = angular.module('RecruitingAppStart', [
    'ngRoute',
    'ngCookies',
    'RecruitingAppStart.filters',
    'services',
    'RecruitingAppStart.directives',
    'RecruitingAppStart.controllers',
    'ui.notify',
    'ui.tinymce',
    'ui.select2',
    'oi.file',
    'oi.list',
    'pascalprecht.translate',
    'tmh.dynamicLocale',
    'pasvaz.bindonce',
    'uiGmapgoogle-maps',
    'ngMeta',
    'ui.bootstrap',
    'ngAnimate'
]).constant('serverAddress', '/hr').config(['$routeProvider', 'ngMetaProvider', '$locationProvider', function($routeProvider, ngMetaProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    //$locationProvider.hashPrefix('i');
    //inject(function($location) {
    //    console.log($location);
    //});
    $routeProvider
        .when('/confirmRegistration/finishReg/:personId/:key', {
            templateUrl: 'partials/start/finishreg.html',
            controller: 'ConfirmController',
            title: "Confirm |"
        })
        .when('/signup', {
            templateUrl: 'partials/start/invitereg.html',
            controller: 'SignupController',
            title: "Регистрация |"
        })
        .when('/pv/:vacancyId', {
            templateUrl: 'partials/public/vacancy.html',
            controller: 'PublicVacancyController',
            title: "Vacancy |"
        })
        .when('/vacancy-:vacancyId', {
            title: "Vacancy |",
            templateUrl: 'partials/public/vacancy.html',
            controller: 'PublicVacancyController',
            pageName: "Public vacancy",
            meta: {
                description: 'Vacancy in CleverStaff Recruitment Software'
            }
        })
        .when('/:nameAlias', {
            templateUrl: 'partials/public/company.html',
            controller: 'PublicCompanyController',
            title: "Company |",
            meta: {
                description: 'Vacancies in CleverStaff Recruitment Software'
            }
        })
        .when('/pass_the_test/:id', {
            templateUrl: 'partials/public/testCandidate.html',
            controller: 'PublicTestController',
            title: "Test |",
            pageName: "Public test candidate",
            meta: {
                description: 'Test in CleverStaff Recruitment Software'
            }
        })
        .when('/pc/:candidateId', {
            templateUrl: 'partials/public/candidate.html',
            controller: 'PublicCandidateController',
            title: "Candidate |"
        })
        .when('/duzhe_potribna_robota', {
            templateUrl: 'partials/public/vacancyAdd.html',
            controller: 'PublicVacancyAddController',
            title: "Форма додавання вакансії"
        })
        .when('/in/:id/:key', {
            templateUrl: 'partials/start/finishreg.html',
            controller: 'InController'
        })
        .when('/restore/:id/:key', {
            templateUrl: 'partials/start/restore_password.html',
            controller: 'RestorePasswordController',
            title: "CleverStaff |"
        })
        .when('/redirect', {
            templateUrl: "partials/start/finishreg.html",
            controller: 'test_redirect_controller',
            title: 'Redirect'
        })
        .otherwise({redirectTo: '/redirect'});
}]).config(function($translateProvider,tmhDynamicLocaleProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'languange/locale-',
        suffix: '.json?b=3'
    });
    $translateProvider.translations('en');
    $translateProvider.translations('ru');
    $translateProvider.translations('ua');
    var userLang = navigator.language || navigator.userLanguage;
    var lST = userLang.substring(0, 2);
    if (lST == "ru" || lST == "be") {
        $translateProvider.preferredLanguage('ru');
    } else if (lST == "uk") {
        $translateProvider.preferredLanguage('ua');
    } else {
        $translateProvider.preferredLanguage('en');
    }
    $translateProvider.useLocalStorage();
    /************************************/
    tmhDynamicLocaleProvider.localeLocationPattern('lib/angular/i18n/angular-locale_{{locale}}.js');
    tmhDynamicLocaleProvider.useCookieStorage();
    /************************************/
}).run(['$location', '$rootScope', 'ngMeta', '$routeParams', function($location, $rootScope, ngMeta, $routeParams) {
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        //$rootScope.title = current.$$route.title + " CleverStaff";
        $rootScope.activeController = current.$$route.controller;
    });
    ngMeta.init();
}]);

