var google_url = "https://accounts.google.com/o/oauth2/auth" +
    "?client_id=" + apiKey.google.client_id +
    "&scope=email%20profile" +
    "&state=/profile" +
    "&redirect_uri=" + location.protocol + "//" + document.domain + "/white.html" +
    "&response_type=code%20token" +
    "&approval_prompt=auto";

var linkedin_url = "https://www.linkedin.com/uas/oauth2/authorization" +
    "?response_type=code" +
    "&client_id=" + apiKey.linkedIn.api_key +
    "&scope=r_fullprofile%20r_contactinfo%20r_emailaddress" +
    "&state=STATUS123asd33342" +
    "&redirect_uri=" + location.protocol + "//" + document.domain + "/white.html";

function facebookReq(type) {
    FB.login(function(response) {

        if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            //console.log(response); // dump complete info
            var access_token = response.authResponse.accessToken; //get access token
            getUserInfoFacebook(access_token, type);
        } else {
            //user hit cancel button
            if (type === 'signin') {
                authError(messages.auth_cancel);
            }
            if (type === 'demo') {
                signupDemoError(messages.facebook_demo_cancel);
            }
        }
    }, {
        scope: 'email'
    });
}


function googleReq(type) {
    resetError();
    var win = window.open(google_url, "windowname1", getPopupParams());
    var pollTimer = window.setInterval(function() {
        try {
            if (win.document.URL.indexOf(gup(google_url, 'redirect_uri')) !== -1) {
                window.clearInterval(pollTimer);
                var url = win.document.URL;
                var code = gup(url, 'code');
                var access_token = gup(url, 'access_token');
                win.close();
                if (access_token !== '') {
                    getUserInfoGoogle(access_token, code, type);
                } else {
                    if (type === 'signin') {
                        authError(messages.auth_cancel);
                    }
                    if (type === 'demo') {
                        signupDemoError(messages.google_demo_cancel);
                    }
                }
            }
        } catch (e) {
        }
    }, 500);
}

function linkedinReq(type) {
    resetError();
    var win = window.open(linkedin_url, "windowname2", getPopupParams());
    var pollTimer = window.setInterval(function() {
        try {
            if (win.document.URL.indexOf(gup(google_url, 'redirect_uri')) !== -1) {
                window.clearInterval(pollTimer);
                var url = win.document.URL;
                var code = gup(url, 'code');
                win.close();
                console.log(code);
                if (type === 'signin') {
                    signinSocial("linkedin", code);
                }
                if (type === 'signup') {
                    signupLinkedin(code);
                }

            }
        } catch (e) {
        }
    }, 500);
}

function linkedinDemo() {
    console.log(IN.User.isAuthorized());
    IN.User.authorize(function() {
        signupDemoSuccess(messages.send);
        IN.API.Profile("me").fields(["formatted-name", "email-address", "public-profile-url"]).result(function(me) {
            console.log(me);
            var user = {
                email: me.values[0].emailAddress,
                name: me.values[0].formattedName,
                link: me.values[0].publicProfileUrl
            };
            localStorage.removeItem("demo_social_code");
            //demoSocial(user, "linkedin");
        });
    });

}

function getUserInfoGoogle(token, code, type) {
    $.ajax({
        url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + token,
        data: null,
        success: function(user) {
            console.log(user);
            if (type === 'signin') {
                signinSocial("google", code);
            }
            if (type === 'signup') {
                signupGoogle(code, user);
            }
            //if (type === 'demo') {
            //    localStorage.setItem("demo_social_code", code);
            //    demoSocial(user, "google");
            //}
        },
        dataType: "jsonp"
    });
}
function getUserInfoFacebook(code, type) {
    FB.api('/me', function(user) {
        console.log(user);
        if (type === 'signin') {
            signinFacebook(code, user);
        }
        if (type === 'signup') {
            signupFacebook(code, user);
        }
        //if (type === 'demo') {
        //    localStorage.setItem("demo_social_code", code);
        //    demoSocial(user, "facebook");
        //}
    });
}

function signinFacebook(code, user) {
    var lang = localStorage.getItem("NG_TRANSLATE_LANG_KEY");
    if(!lang){
        lang = 'en'
    }
    $.ajax({
        url: "/hr/person/auth",
        type: "POST",
        data: '{"socialKey":"' + code + '","timeZoneOffset":"' + userTimeZoneOffset + '","social":"facebook","lang":"' + lang + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function() {
            authSuccess(messages.send);
        },
        success: function(data) {

            if(data.object){
                localStorage.otherSessionsRemoves = data.object.otherSessionsRemoves;
            }else if(data.status == 'error'){
                authError(data.message);
                return;
            }


            $(".enter_forgot_pass").hide();
            if (data.object.personId !== undefined) {
                if (!isIE()) {
                    authSuccess(messages.redirect);
                    sendGA('signin_success');
                    window.location.replace("/!#/organizer");
                } else {
                    downloadNewBrowser();
                }
            } else if (data.status === "error") {
                if (data.message == 'unknownEmail') {
                    authError(messages.unknownEmail);
                } else {
                    authError(data.message);
                }
            }
        },
        error: function(data) {
            console.log(data);
            $(".enter_forgot_pass").hide();
            if (data.status === "error") {
                authError(data.message);
            }
        }
    });
}

//function signupFacebook(code, user) {
//    $("#mod_registration").fadeOut();
//    $("#signup_facebook_mail").val(user.email);
//    $("#signup_facebook_code").val(code);
//    $("#mod_signup_facebook").fadeIn();
//}

function signinSocial(social, code) {
    var lang = localStorage.getItem("NG_TRANSLATE_LANG_KEY");
    if(!lang){
        lang = 'en'
    }
    $.ajax({
        url: "/hr/person/auth",
        type: "POST",
        data: '{"socialKey":"' + code + '","timeZoneOffset":"' + userTimeZoneOffset + '","social":"' + social + '","lang":"' + lang + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function() {
            authSuccess(messages.send);
        },
        success: function(data) {
            $(".enter_forgot_pass").hide();
            if (data.object && data.object.personId !== undefined) {
                localStorage.otherSessionsRemoves = data.object.otherSessionsRemoves;
                if (!isIE()) {
                    authSuccess(messages.redirect);
                    sendGA('signin_success');
                    window.location.replace("/!#/organizer");
                } else {
                    downloadNewBrowser();
                }
            } else if (data.status === "error") {
                if (data.message == 'unknownEmail') {
                    authError(messages.unknownEmail);
                } else {
                    authError(data.message);
                }
            }
        },
        error: function(data) {
            console.log(data);
            $(".enter_forgot_pass").hide();
            if (data.status === "error") {
                authError(data.message);
            }
        }
    });
}

//function signupGoogle(code, user) {
//    $("#mod_registration").fadeOut();
//    $("#signup_google_mail").val(user.email);
//    $("#signup_google_code").val(code);
//    $("#mod_signup_google").fadeIn();
//}
//
//function signupLinkedin(code) {
//    $("#mod_registration").fadeOut();
//    $("#signup_linkedin_code").val(code);
//    $("#mod_signup_linkedin").fadeIn();
//}

//function demoSocial(user, social) {
//    var requestSocial = {
//        email: user.email,
//        name: user.name,
//        company: user.link,
//        country: "null",
//        lang: localStorage.getItem("NG_TRANSLATE_LANG_KEY")? localStorage.getItem("NG_TRANSLATE_LANG_KEY"): 'en',
//        utms: localStorage.getItem("UTMS")
//    };
//    $.ajax({
//        url: "/hr/public/demo",
//        type: "POST",
//        data: JSON.stringify(requestSocial),
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        beforeSend: function(xhr) {
//            signupDemoSuccess(messages.send);
//        },
//        success: function(data) {
//            var lang = localStorage.getItem("NG_TRANSLATE_LANG_KEY");
//            if(!lang){
//                lang = 'en'
//            }
//            if (data.status === "ok") {
//                $.ajax({
//                    url: "/hrdemo/person/auth",
//                    type: "POST",
//                    data: '{"login":"' + user.email + '","name":"' + user.name + '","companyName":"Demo Company","timeZoneOffset":"'+ userTimeZoneOffset+'","password":"password","lang":"' + lang + '"}',
//                    contentType: "application/json; charset=utf-8",
//                    dataType: "json",
//                    success: function(data) {
//                        console.log(data);
//                        if (!isIE()) {
//                            signupDemoSuccess(messages.redirect);
//                            sendGA('demo_success');
//                            localStorage.setItem("demo_social", social);
//                            window.location.replace("/hdemo.html#/organizer");
//                        } else {
//                            downloadNewBrowser();
//                        }
//                    }
//                });
//            } else if (data.message !== undefined) {
//                if (data.status === "ok") {
//                } else {
//                    signupDemoError(data.message);
//                    demo_loading = false;
//                }
//            }
//        },
//        error: function(data) {
//            console.log(data);
//            if (data.status === "error") {
//                signupDemoError(data.message);
//            }
//            demo_loading = false;
//        }
//    });
//}

function gup(url, name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    if (results === null)
        return "";
    else
        return results[1];
}

function getPopupParams() {
    var w = 650;
    var h = 550;
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    return 'width=' + w + ', height=' + h + ', top=' + top + ', left=' + left;
}


window.fbAsyncInit = function() {
    FB.init({
        appId: apiKey.facebook.appId,
        oauth: true,
        status: true, // check login status
        cookie: true, // enable cookies to allow the server to access the session
        xfbml: true, // parse XFBML
        version: 'v2.9'
    });

};
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id))
        return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=305967169564826&version=v2.9";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
