'use strict';


// Declare app level module which depends on filters, and services
angular.module('RecruitingAppStart', [
    'pascalprecht.translate',
    'ngRoute',
    'ngCookies',
    'RecruitingAppStart.filters',
    'services',
    'RecruitingAppStart.directives',
    'RecruitingAppStart.controllers',
    'ui.notify',
    'oi.file',
    'pasvaz.bindonce',
    'tmh.dynamicLocale',
    'uiGmapgoogle-maps'
]).constant('serverAddress', '/hrdemo').config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/start/start.html',
            controller: 'StartController',
            title: ""
        })
        .when('/pc/:candidateId', {
            templateUrl: 'partials/public/candidate.html',
            controller: 'PublicCandidateController',
            title: "Candidate |"
        })
        .when('/pv/:vacancyId', {
            templateUrl: 'partials/public/vacancy.html',
            controller: 'PublicVacancyController',
            title: "Vacancy |"
        })
        .otherwise({redirectTo: '/'});
}]).config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
}]).run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        $rootScope.title = current.$$route.title + " CleverStaff";
    });
}]).config(function($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'languange/locale-',
        suffix: '.json'
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
});