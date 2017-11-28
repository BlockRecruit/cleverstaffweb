angular.module('services.translateWords', [
    'ngResource',
    'ngCookies'
]).factory('translateWords', ['$resource', 'serverAddress', '$filter', '$localStorage','$rootScope','$translate', function($resource, serverAddress, $filter, $localStorage, $rootScope,  $translate) {

    class Translate{
        constructor(){
        }
        getTranslete(str, $csope, name, ifTranslateForTitlePage){
            $csope[name] = $translate.instant(str);
            $rootScope.$on('$translateChangeSuccess', ()=> {
                if(ifTranslateForTitlePage){
                    $csope[name] = $translate.instant(str) + " | CleverStaff";
                }else{
                    $csope[name] = $translate.instant(str);
                }
            });
        }
    }
    const translate = new Translate();

    return translate;
}]);