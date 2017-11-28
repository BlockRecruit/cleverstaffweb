var module = angular.module('outlookApi',[]);
module.factory('outlookService',['$location', function($location) {
    return{
        getAccessForCalendar: function(){
            function PopupCenter(url, title, w, h) {
                // Fixes dual-screen position                         Most browsers      Firefox
                var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
                var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

                var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
                var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

                var left = ((width / 2) - (w / 2)) + dualScreenLeft;
                var top = ((height / 2) - (h / 2)) + dualScreenTop;
                var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

                // Puts focus on the newWindow
                if (window.focus) {
                    newWindow.focus();
                }
            }
            PopupCenter('https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=ce36854c-93f8-4f1c-9b94-d060a809ffad&redirect_uri=https%3A%2F%2F' + $location.$$host + '%2Foutlook-white.html&response_type=code&scope=openid%20offline_access%20profile%20https%3A%2F%2Foutlook.office.com%2Fcalendars.readwrite','xtf','900','500');
            //window.open ('https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=ce36854c-93f8-4f1c-9b94-d060a809ffad&redirect_uri=https%3A%2F%2Fdev.cleverstaff.net%2Foutlook-white.html&response_type=code&scope=openid%20offline_access%20profile%20https%3A%2F%2Foutlook.office.com%2Fcalendars.readwrite', 'newwindow', config='height=400,width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, directories=no, status=no');
        }
    }
}]);
