var app = angular.module('googleApi', []).value('version', '0.1');

app.provider('googleService', function () {
    this.configure = function (conf) {
        this.config = conf;
    };


    this.$get = function ($rootScope, $timeout, $location, notificationService) {
        var config = this.config;

        var checkCreatingGoogleCalendar = false;

        // function createCleverStaffEventCalendar(callback) {
        //     console.log("Google api invoke: createCleverStaffEventCalendar");
        //     console.log(config);
        //     if (!checkCreatingGoogleCalendar) {
        //         checkCreatingGoogleCalendar = true;
        //         var calendar = {
        //             summary: config.calendarName,
        //             description: config.calendarName
        //         };
        //         var request = gapi.client.request({
        //             'path': '/calendar/v3/calendars',
        //             'method': 'POST',
        //             'body': calendar
        //         });
        //         request.execute(function (resp) {
        //             $rootScope.selectedCalendar = resp;
        //             if (!$rootScope.$$phase) {
        //                 $rootScope.$apply();
        //             }
        //             if (callback != undefined) callback($rootScope.selectedCalendar);
        //         });
        //     }
        // }
        return {
            checkAuthTimeout: function () {
                console.log("Google api call :checkAuthTimeout");
                $timeout(function () {
                    gapi.auth.authorize({
                        client_id: apiKey.google.client_id,
                        scope: config.scopes,
                        immediate: true
                    }, function (authResult) {
                        if (authResult && !authResult.error) {
                            var resp_g;
                            $rootScope.g_access_token = gapi.auth.getToken().access_token;
                            gapi.client.load('oauth2', 'v2', function () {
                                gapi.client.oauth2.userinfo.get().execute(function (resp) {
                                    if ($rootScope.me && ($rootScope.me.googleMail === resp.email)) {
                                        $rootScope.g_info = resp;
                                        gapi.client.load('calendar', 'v3', function () {
                                            gapi.client.calendar.calendarList.list().execute(function (resp) {
                                                $rootScope.calendars = resp.items;
                                                angular.forEach($rootScope.calendars, function (value, key) {
                                                    if (value.summary === config.calendarName) {
                                                        $rootScope.selectedCalendar = value;
                                                    }
                                                });
                                                if (!$rootScope.selectedCalendar) {
                                                    // gapi.client.load('calendar', 'v3', function () {
                                                    //     var calendar = {
                                                    //         summary: config.calendarName,
                                                    //         description: config.calendarName
                                                    //     };
                                                    //     var request = gapi.client.request({
                                                    //         'path': '/calendar/v3/calendars',
                                                    //         'method': 'POST',
                                                    //         'body': calendar
                                                    //     });
                                                    //     request.execute(function (resp) {
                                                    //         $rootScope.selectedCalendar = resp;
                                                    //         if (!$rootScope.$$phase) {
                                                    //             $rootScope.$apply();
                                                    //         }
                                                    //     });
                                                    // });
                                                }
                                                if (!$rootScope.$$phase) {
                                                    $rootScope.$apply();
                                                }
                                            });
                                        });
                                        if (!$rootScope.$$phase) {
                                            $rootScope.$apply();
                                        }
                                    } else {
                                        $rootScope.g_email = undefined;
                                        $rootScope.calendars = undefined;
                                        $rootScope.selectedCalendar = undefined;
                                        $rootScope.g_info = undefined;
                                        $rootScope.g_access_token = undefined;
                                        resp_g = undefined;
                                        if (!$rootScope.$$phase) {
                                            $rootScope.$apply();
                                        }
                                    }
                                });
                            });
                        } else {
                            $rootScope.g_email = undefined;
                            $rootScope.calendars = undefined;
                            $rootScope.selectedCalendar = undefined;
                            $rootScope.g_info = undefined;
                            $rootScope.g_access_token = undefined;
                            if (!$rootScope.$$phase) {
                                $rootScope.$apply();
                            }
                        }

                    });
                }, 2000);
            },
            checkAuth: function () {
                console.log("Google api call :checkAuth");
                gapi.auth.authorize({
                    client_id: apiKey.google.client_id,
                    scope: config.scopes,
                    immediate: true
                }, function (authResult) {
                    // console.log(config);
                    if (authResult && !authResult.error) {
                        $rootScope.g_access_token = gapi.auth.getToken().access_token;
                        gapi.client.load('oauth2', 'v2', function () {
                            gapi.client.oauth2.userinfo.get().execute(function (resp) {
                                if ($rootScope.me.googleMail === resp.email) {
                                    $rootScope.g_info = resp;
                                    if (!$rootScope.selectedCalendar) {
                                        //gapi.client.load('calendar', 'v3', function () {
                                        //    gapi.client.calendar.calendarList.list().execute(function (resp) {
                                        //        $rootScope.calendars = resp.items;
                                        //        angular.forEach($rootScope.calendars, function (value, key) {
                                        //            if (value.summary === config.calendarName) {
                                        //                $rootScope.selectedCalendar = value;
                                        //            }
                                        //        });
                                        //        if (!$rootScope.selectedCalendar) {
                                        //            // gapi.client.load('calendar', 'v3', function () {
                                        //            //     // createCleverStaffEventCalendar();
                                        //            // });
                                        //        }
                                        //        if (!$rootScope.$$phase) {
                                        //            $rootScope.$apply();
                                        //        }
                                        //    });
                                        //});
                                    }
                                    if (!$rootScope.$$phase) {
                                        $rootScope.$apply();
                                    }
                                } else {
                                    $rootScope.g_email = undefined;
                                    $rootScope.calendars = undefined;
                                    $rootScope.selectedCalendar = undefined;
                                    $rootScope.g_info = undefined;
                                    $rootScope.g_access_token = undefined;
                                    if (!$rootScope.$$phase) {
                                        $rootScope.$apply();
                                    }
                                }
                            });
                        });

                    } else {
                        $rootScope.g_email = undefined;
                        $rootScope.calendars = undefined;
                        $rootScope.selectedCalendar = undefined;
                        $rootScope.g_info = undefined;
                        $rootScope.g_access_token = undefined;
                        if (!$rootScope.$$phase) {
                            $rootScope.$apply();

                        }
                    }

                });
            },
            // checkAuthWithoutCalendar: function () {
            //     console.log("Google api call :checkAuthWithoutCalendar");
            //     gapi.auth.authorize({
            //         client_id: apiKey.google.client_id,
            //         scope: config.scopes,
            //         immediate: true
            //     }, function (authResult) {
            //         if (authResult && !authResult.error) {
            //             $rootScope.g_access_token = gapi.auth.getToken().access_token;
            //             gapi.client.load('oauth2', 'v2', function () {
            //                 gapi.client.oauth2.userinfo.get().execute(function (resp) {
            //                     if ($rootScope.me.googleMail === resp.email) {
            //                         $rootScope.g_info = resp;
            //                         if (!$rootScope.$$phase) {
            //                             $rootScope.$apply();
            //                         }
            //                     } else {
            //                         $rootScope.g_email = undefined;
            //                         $rootScope.calendars = undefined;
            //                         $rootScope.selectedCalendar = undefined;
            //                         $rootScope.g_info = undefined;
            //                         $rootScope.g_access_token = undefined;
            //                         if (!$rootScope.$$phase) {
            //                             $rootScope.$apply();
            //                         }
            //                     }
            //                 });
            //             });
            //         } else {
            //             $rootScope.g_email = undefined;
            //             $rootScope.calendars = undefined;
            //             $rootScope.selectedCalendar = undefined;
            //             $rootScope.g_info = undefined;
            //             $rootScope.g_access_token = undefined;
            //             $rootScope.calendarShow = false;
            //             if (!$rootScope.$$phase) {
            //                 $rootScope.$apply();
            //             }
            //         }
            //
            //     });
            // },
            addCalendar: function (event) {
                var result = {status: "", code: "", email: ""};
                var abc = "https://accounts.google.com/o/oauth2/auth" +
                    "?client_id=" + "195081582460-eo4qmmi7o6hii0ckmrc004lhkh9m3596.apps.googleusercontent.com" +
                    "&scope=" + "https://www.googleapis.com/auth/calendar" +
                    "%20email" +
                    "&state=/profile989a" +
                    "&redirect_uri=" + location.protocol + "//" + document.domain + "/white.html" +
                    "&response_type=code,token" +
                    "&access_type=offline&approval_prompt=auto";
                // var abc = "https://accounts.google.com/o/oauth2/auth" +
                //     "?client_id=" + "195081582460-eo4qmmi7o6hii0ckmrc004lhkh9m3596.apps.googleusercontent.com" +
                //     "&scope=" + "https://www.googleapis.com/auth/calendar" +
                //     "%20email" +
                //     "&state=/profile989a" +
                //     "&redirect_uri=" + location.protocol + "//" + document.domain + "/white.html" +
                //     "&response_type=code,token" +
                //     "&access_type=offline&approval_prompt=force";
                console.log(abc);

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

                var win = window.open(abc, "windowname2", getPopupParams());
                
                var pollTimer = window.setInterval(function () {
                    try {
                        console.log(win.document.URL);
                        console.log(win.document.URL.indexOf(gup(abc, 'redirect_uri')));
                        if (win.document.URL.indexOf(gup(abc, 'redirect_uri')) !== -1) {
                            window.clearInterval(pollTimer);
                            var url = win.document.URL;
                            var code = gup(url, 'code');

                            var access_token = gup(url, 'access_token');
                            win.close();
                            console.log(code);
                            console.log(access_token);
                            result.code = code;
                            return event(result);

                        }
                    } catch (e) {

                    }
                }, 500);

            }

            ,
            login: function (callback) {
                return new Promise((resolve, reject) => {
                    console.log("Google api call :login");
                    if ($rootScope.g_info) {
                        console.log("if");
                        gapi.client.load('calendar', 'v3', function () {
                            gapi.client.calendar.calendarList.list().execute(function (resp) {
                                $rootScope.calendars = resp.items;
                                angular.forEach($rootScope.calendars, function (value, key) {
                                    if (value.summary === config.calendarName) {
                                        $rootScope.selectedCalendar = value;
                                    }
                                });
                                if (!$rootScope.selectedCalendar) {
                                    // gapi.client.load('calendar', 'v3', function () {
                                    //     // createCleverStaffEventCalendar(callback);
                                    // });
                                } else {
                                    if (callback != undefined) callback();
                                    if (!$rootScope.$$phase) {
                                        $rootScope.$apply();
                                    }
                                }
                                resolve('resp');
                            });
                        });
                    } else {

                        setTimeout(function(){
                            let calendarIntegrated = false;
                            if(JSON.parse(localStorage.getItem('calendarShow')) == true) {
                                calendarIntegrated = true;
                            }
                            console.log('hey',calendarIntegrated, localStorage.getItem('calendarShow'));
                            gapi.auth.authorize({
                                client_id: apiKey.google.client_id,
                                scope: config.scopes,
                                immediate: calendarIntegrated,
                                cookie_policy: 'single_host_origin'
                            }, function(authResult) {
                                if (authResult && !authResult.error) {
                                    $rootScope.g_access_token = gapi.auth.getToken().access_token;
                                    gapi.client.load('oauth2', 'v2', function() {
                                        gapi.client.oauth2.userinfo.get().execute(function(resp) {
                                            //if ($rootScope.me.googleMail === resp.email) {
                                            // $rootScope.g_info = resp;
                                            gapi.client.load('calendar', 'v3', function() {
                                                gapi.client.calendar.calendarList.list().execute(function(resp) {
                                                    console.log('calendars', resp);
                                                    // console.log(resp);
                                                    $rootScope.calendars = resp.items;
                                                    angular.forEach($rootScope.calendars, function(value, key) {
                                                        if (value.summary === config.calendarName) {
                                                            $rootScope.selectedCalendar = value;
                                                        }
                                                    });
                                                    if (!$rootScope.selectedCalendar) {
                                                        gapi.client.load('calendar', 'v3', function() {
                                                            // createCleverStaffEventCalendar(callback);
                                                            resolve('resp');
                                                        });
                                                    } else {
                                                        if (!$rootScope.$$phase) {
                                                            $rootScope.$apply();
                                                        }
                                                        if (callback != undefined) callback();
                                                        resolve('resp');
                                                    }

                                                });
                                            });
                                            //} else {
                                            //    $rootScope.g_email = undefined;
                                            //    $rootScope.calendars = undefined;
                                            //    $rootScope.selectedCalendar = undefined;
                                            //    $rootScope.g_info = undefined;
                                            //    $rootScope.g_access_token = undefined;
                                            //    if (!$rootScope.$$phase) {
                                            //        $rootScope.$apply();
                                            //    }
                                            //}
                                        });
                                    });
                                }
                                resolve('resp');
                            });
                        },0)
                    }
                });

            },
            signOut: function (callback) {
                gapi.auth.signOut();
                console.log("Google api call :signOut");
            },
            loginLink: function () {
                gapi.auth.authorize({
                    client_id: apiKey.google.client_id,
                    scope: config.scopes,
                    immediate: false
                }, function (authResult) {
                    if (authResult && !authResult.error) {
                        $rootScope.g_access_token = gapi.auth.getToken().access_token;
                        gapi.client.load('oauth2', 'v2', function () {
                            gapi.client.oauth2.userinfo.get().execute(function (resp) {
                                $rootScope.g_info = resp;
                                if (!$rootScope.$$phase) {
                                    $rootScope.$apply();
                                }
                            });
                        });
                    }
                });
            },
            // getCalendar: function () {
            //     gapi.client.load('calendar', 'v3', function () {
            //         gapi.client.calendar.calendarList.list().execute(function (resp) {
            //             $rootScope.calendars = resp.items;
            //             angular.forEach($rootScope.calendars, function (value, key) {
            //                 if (value.summary === config.calendarName) {
            //                     $rootScope.selectedCalendar = value;
            //                 }
            //             });
            //             if (!$rootScope.selectedCalendar) {
            //                 gapi.client.load('calendar', 'v3', function () {
            //                     createCleverStaffEventCalendar(callback);
            //                 });
            //             }
            //             if (!$rootScope.$$phase) {
            //                 $rootScope.$apply();
            //             }
            //         });
            //     });
            // },
            createEvent: function (event) {
                if (event.calendarId != null) {
                    event.id = event.id.replace(/[w-zW-Z_-]/g, '');
                    var object = this;
                    this.getEvent(event.calendarId, event.id, function (val) {
                        // if (val == null) {
                        //     console.log("google api: this event is NOT!! exist, create event!");
                        //     gapi.client.load('calendar', 'v3', function () {
                        //         var request = gapi.client.request({
                        //             'path': '/calendar/v3/calendars/' + event.calendarId + "/events",
                        //             'method': 'POST',
                        //             'body': event
                        //         });
                        //         request.execute(function (resp) {
                        //         });
                        //     });
                        // } else {
                        //     console.log("google api: this event is already exist");
                        //     event.eventId = event.id;
                        //     delete  event.id;
                        //     object.updateEvent(event)
                        // }
                    });
                }
            },
            // //GET https://www.googleapis.com/calendar/v3/calendars/**calendarId**/events
            // getEvent: function (calendarId, eventId, callback) {
            //     if (calendarId != null) {
            //         eventId = eventId.replace(/[w-zW-Z_-]/g, '');
            //         gapi.client.load('calendar', 'v3', function () {
            //             var request = gapi.client.request({
            //                 'path': '/calendar/v3/calendars/' + calendarId + '/events',
            //                 'method': 'GET'
            //             });
            //             request.execute(function (resp) {
            //                 if (resp != undefined && resp.items != undefined && resp.items.length > 0) {
            //                     var founded = false;
            //                     for (var i = 0; i <= resp.items.length - 1; i++) {
            //                         var element = resp.items[i];
            //                         if (element.id == eventId) {
            //                             console.log("EVENT FOUND!");
            //                             callback(element);
            //                             founded = true;
            //                             break;
            //                         }
            //                     }
            //                     if (!founded) {
            //                         console.log("EVENT have been not founded!");
            //                         callback(null);
            //                     }
            //                 } else {
            //                     callback(null)
            //                 }
            //             });
            //         });
            //     }
            // },
            // updateEvent: function (event) {
            //     if (event.calendarId != null) {
            //         event.eventId = event.eventId.replace(/[w-zW-Z_-]/g, '');
            //         console.log("google api: updateEvent!");
            //         gapi.client.load('calendar', 'v3', function () {
            //             var request = gapi.client.request({
            //                 'path': '/calendar/v3/calendars/' + event.calendarId + "/events/" + event.eventId,
            //                 'method': 'PUT',
            //                 'body': event
            //             });
            //             request.execute(function (resp) {
            //                 console.log(resp);
            //             });
            //         });
            //     }
            // },
            // deleteEvent: function (event) {
            //     gapi.client.load('calendar', 'v3', function () {
            //         var request = gapi.client.request({
            //             'path': '/calendar/v3/calendars/' + event.calendarId + "/events/" + event.eventId,
            //             'method': 'DELETE',
            //             'body': event
            //         });
            //         request.execute(function (resp) {
            //         });
            //     });
            // },
            gmailAuth: function (type, event) {
                var httpTypeUrl = "";
                switch (type) {
                    case "manageCalendars":
                        httpTypeUrl = "https://www.googleapis.com/auth/calendar";
                        break;
                    case "compose":
                        httpTypeUrl = "https://www.googleapis.com/auth/gmail.compose";
                        break;
                    case "modify":
                        httpTypeUrl = "https://www.googleapis.com/auth/gmail.modify";
                        break;
                    case "readonly":
                        httpTypeUrl = "https://www.googleapis.com/auth/gmail.readonly";
                        break;
                    case "fullAccess":
                        httpTypeUrl = "https://mail.google.com/";
                        break;
                    default :
                        httpTypeUrl = "https://www.googleapis.com/auth/gmail.readonly";
                        break;
                }

                var result = {status: "", code: "", email: ""};
                var google_url = "https://accounts.google.com/o/oauth2/auth" +
                    "?client_id=" + apiKey.google.client_id +
                    "&scope=" + httpTypeUrl + "%20email" +
                    "&state=/profile989a" +
                    "&redirect_uri=" + location.protocol + "//" + document.domain + "/white.html" +
                    "&response_type=code,token" +
                    "&access_type=offline&approval_prompt=auto";
                console.log(google_url);

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

                var win = window.open(google_url, "windowname2", getPopupParams());
                var pollTimer = window.setInterval(function () {
                    try {
                        if (win.document.URL.indexOf(gup(google_url, 'redirect_uri')) !== -1) {
                            window.clearInterval(pollTimer);
                            var url = win.document.URL;
                            var code = gup(url, 'code');
                            var access_token = gup(url, 'access_token');
                            win.close();
                            result.code = code;
                            $.ajax({
                                url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + access_token,
                                data: null,
                                success: function (resp) {
                                    console.log(resp);
                                    result.status = "ok";
                                    result.email = resp.email;
                                    result.ownerName = resp.given_name;

                                    return event(result);
                                },
                                error: function () {
                                    result.status = "error";
                                    return event(result);
                                },
                                dataType: "jsonp"
                            });
                        }
                    } catch (e) {
                    }
                }, 500);

                //gapi.auth.authorize({
                //    client_id: config.clientId,
                //    scope: config.gmailScopes,
                //    response_type: "code,token",
                //    immediate: false,
                //    authuser: "",
                //    redirect_uri: redirect_uri
                //}, function(resp) {
                //    if (resp && !resp.error) {
                //        result.code = resp.code;
                //        gapi.client.load('oauth2', 'v2', function() {
                //            gapi.client.oauth2.userinfo.get().execute(function(resp) {
                //                if (resp && !resp.error) {
                //                    result.status = "ok";
                //                    result.email = resp.email;
                //                    return event(result);
                //                } else {
                //                    result.status = "error";
                //                    result.code = resp ? resp.error : "";
                //                    return event(result);
                //                }
                //            })
                //        });
                //    } else {
                //        result.status = "error";
                //        result.code = resp.error;
                //        return event(result);
                //    }
                //});
            },
            signin: function(social){
                if(social == 'google'){
                    var userTimeZoneOffset = new Date().getTimezoneOffset();
                    function getPopupParams() {
                        var w = 650;
                        var h = 550;
                        var left = (screen.width / 2) - (w / 2);
                        var top = (screen.height / 2) - (h / 2);
                        return 'width=' + w + ', height=' + h + ', top=' + top + ', left=' + left;
                    }
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
                    var google_url = "https://accounts.google.com/o/oauth2/auth" +
                        "?client_id=" + apiKey.google.client_id +
                        "&scope=email%20profile" +
                        "&state=/profile" +
                        "&redirect_uri=" + location.protocol + "//" + document.domain + "/white.html" +
                        "&response_type=code%20token" +
                        "&approval_prompt=auto";
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
                                    getUserInfoGoogle(access_token, code);
                                }
                            }
                        } catch (e) {
                        }
                    }, 500);
                    function getUserInfoGoogle(token, code) {
                        console.log('here!!!');
                        $.ajax({
                            url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + token,
                            data: null,
                            success: function(user) {
                                console.log(user);
                                signinSocial("google", code);
                            },
                            dataType: "jsonp"
                        });
                    }
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
                            success: function(data) {
                                localStorage.otherSessionsRemoves = data.object.otherSessionsRemoves;
                                if (data.object.personId !== undefined) {
                                    location.reload();
                                } else if (data.status === "error") {
                                    notificationService.error(data.message);
                                }
                            },
                            error: function(data) {
                                if (data.status === "error") {
                                    notificationService.error(data.message);
                                }
                            }
                        });
                    }
                }else if(social == 'fb'){
                        FB.login(function(response) {
                            console.log(response);
                            if (response.authResponse) {
                                console.log('Welcome!  Fetching your information.... ');
                                var access_token = response.authResponse.accessToken; //get access token
                                getUserInfoFacebook(access_token);
                            }
                        }, {
                            scope: 'email'
                        });
                    function getUserInfoFacebook(code) {
                        FB.api('/me', function(user) {
                                signinFacebook(code, user);
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
                            success: function(data) {
                                localStorage.otherSessionsRemoves = data.object.otherSessionsRemoves;
                                if (data.object.personId !== undefined) {
                                        location.reload();
                                } else if (data.status === "error") {
                                    notificationService.error(data.message);
                                }
                            },
                            error: function(data) {
                                console.log(data);
                                if (data.status === "error") {
                                    notificationService.error(data.message);
                                }
                            }
                        });
                    }
                }
            }
        };
    };
});