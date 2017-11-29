controller.controller('newsController',["$scope", "Notice", "Service","Person","$rootScope", "$filter",
    function($scope, Notice, Service, Person, $rootScope, $filter) {
        var TIMEOUT = null;
            if(TIMEOUT === null) {
                TIMEOUT = window.setTimeout(function() {
                    TIMEOUT = null;
                    //fb_iframe_widget class is added after first FB.FXBML.parse()
                    //fb_iframe_widget_fluid is added in same situation, but only for mobile devices (tablets, phones)
                    //By removing those classes FB.XFBML.parse() will reset the plugin widths.
                    $('.fb-page').removeClass('fb_iframe_widget fb_iframe_widget_fluid');
                    console.log('parse');
                    FB.XFBML.parse();
                }, 50);
            }
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
}]);