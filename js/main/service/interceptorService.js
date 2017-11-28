angular.module('services.interceptorHandler',[]).factory('responseObserver', function responseObserver($q, $window, notificationService, $filter, $rootScope) {
    return {
        'responseError': function(errorResponse) {
            switch (errorResponse.status) {
                case 403:
                    setTimeout(function(){
                        console.log($rootScope.notAuthorized);
                        if($rootScope.notAuthorized == false){
                            if(errorResponse.config.url != '/hr/person/authping'){
                                ////////////////////////////////////////////////////////////////////<--------------Checking for not spaming error messages for every request(e.g. when you not logged)
                                var exists = false;
                                $(".ui-pnotify-text").each(function() {
                                    if ($(this).html() == $filter('translate')("It look's like some problem with connection"))
                                        exists = true;
                                });
                                if (!exists) {
                                    notificationService.error($filter('translate')("It look's like some problem with connection"));
                                }
                            }
                        }
                    },0);
                    break;
                default :
                    var exists = false;
                    $(".ui-pnotify-text").each(function() {
                        console.log($(this).html());
                        if ($(this).html() == $filter('translate')('service temporarily unvailable'))
                            exists = true;
                    });
                    if (!exists) {
                        notificationService.error($filter('translate')('service temporarily unvailable'));
                    }
                //case 500:
                //    $window.location = './500.html';
                //    break;
            }
            return $q.reject(errorResponse);
        }
    };
});