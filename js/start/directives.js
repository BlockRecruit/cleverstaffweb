'use strict';

/* Directives */


angular.module('RecruitingAppStart.directives', [])
    .directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    }])
    .directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keypress", function(event) {
                if (event.which === 13) {
                    scope.authClick();
                }
            });
        };
    }).directive('intTelNumber', function() {
        return {
            // Restrict it to being an attribute
            restrict: 'A',
            // responsible for registering DOM listeners as well as updating the DOM
            link: function(scope, element, attrs) {
                scope.$watch('loaded', function() {
                    if (scope.loaded == true) {
                        // apply plugin
                        element.intlTelInput(scope.options);
                        //validate loaded number
                        var countryCode = element[0].nextSibling.children[0].children[0].className.split(" ")[1];
                        scope.validateTelephoneNumber(element[0].value, countryCode);

                    }
                });
            }
        }
    })
    .directive('googleplace', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, model) {
                var options = {
                    types: ['(regions)']
                };
                var gPlace = new google.maps.places.Autocomplete(element[0], options);
                google.maps.event.addListener(gPlace, 'place_changed', function(val) {
                    var place = gPlace.getPlace();
                    if (place) {
                        place.formatted_address = $('#pac-input').val();
                        var fullNameAr = place.formatted_address.split(',');

                        if (similar_text(fullNameAr[1], fullNameAr[0]) == fullNameAr[0].length || (similar_text(fullNameAr[0], fullNameAr[1]) / fullNameAr[0].length) * 100 > 80) {
                            place.formatted_address = fullNameAr[0] + "," + fullNameAr[2];
                        }
                        var lat = place.geometry.location.k;
                        var lng = place.geometry.location.D;
                        if (scope.mapObject != null) {
                            var location = new google.maps.LatLng(lat, lng);
                            scope.mapObject.marker.setPosition(location);
                            scope.mapObject.map.setCenter(location);
                        }
                        scope.$apply(function() {
                            scope.region = convertToRegionObject(place, scope);
                            if (scope.region != undefined && scope.region.country == null) {
                                scope.region.country = scope.region.city != null ? scope.region.city : scope.region.area != null ? scope.region.area : " ";
                                if (scope.region.fullName != undefined) {
                                    scope.region.fullName = scope.region.fullName.replace(",undefined", "");
                                }
                            }
                            model.$setViewValue(place.formatted_address);
                        });
                        if (scope.progressUpdate != undefined) {
                            scope.progressUpdate();
                        }

                    } else {
                        scope.regionInputOk = false;
                        scope.region = null;
                    }
                });
            }
        };
    })
    .directive('googleplacerelocate', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, model) {
                var options = {
                    types: ['(regions)']
                };
                var gPlace = new google.maps.places.Autocomplete(element[0], options);
                google.maps.event.addListener(gPlace, 'place_changed', function(val) {
                    var place = gPlace.getPlace();
                    place.formatted_address = $('#pac-input2').val();
                    var fullNameAr = place.formatted_address.split(',');
                    if (similar_text(fullNameAr[1], fullNameAr[0]) == fullNameAr[0].length || (similar_text(fullNameAr[0], fullNameAr[1]) / fullNameAr[0].length) * 100 > 80) {
                        place.formatted_address = fullNameAr[0] + "," + fullNameAr[2];
                    }
                    scope.$apply(function() {
                        scope.regionToRelocate.push(convertToRegionObject(place, scope));
                        model.$setViewValue("");
                        $('#pac-input2').val("");
                    });
                });
            }
        };
    })
    .directive('googlePlaces', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {location: '='},
            template: '<input id="google_places_ac" name="google_places_ac" type="text" class="input-block-level"/>',
            link: function($scope, elm, attrs) {
                var autocomplete = new google.maps.places.Autocomplete($("#google_places_ac")[0], {});
                google.maps.event.addListener(autocomplete, 'place_changed', function() {
                    var place = autocomplete.getPlace();
                    $scope.location = place.geometry.location.lat() + ',' + place.geometry.location.lng();
                    $scope.$apply();
                });
            }
        }
    }).directive('keyboardPoster', ['$timeout', function($timeout) {
        var DELAY_TIME_BEFORE_POSTING = 200;
        return function(scope, elem, attrs) {
            var element = angular.element(elem)[0];
            var currentTimeout = null;

            element.oninput = function() {
                var poster = scope[attrs.postFunction];

                if (currentTimeout) {
                    $timeout.cancel(currentTimeout)
                }

                currentTimeout = $timeout(function() {
                    poster(angular.element(element).val());
                }, DELAY_TIME_BEFORE_POSTING);
            }
        }
    }]).directive('descriptionTreatment', [function() {
        return {
            restrict: 'EA',
            scope: {
                description: "="
            },
            link: function(scope, element, attrs) {
                var watch = scope.$watch('description', function(newval, oldval) {
                    if (newval) {
                        console.log("TRUE!");
                        element.html(scope.description);
                        $(element).linkify();
                        watch();
                    }
                });

            }
        }
    }]
).directive('checkPassword',['$filter', function($filter){
        return {
            restrict: 'EA',
            scope: {
                password: "="
            },
            link: function(scope, element, attrs) {
              scope.$watch('password',function(newVal,oldVal){
                  var password1 = /^[a-zA-Z0-9!,.?%$#@*_\-+=\\|/[\]{}()]{0,99}$/;
                  var password2 = /.*[a-zA-Z].*/;
                  var password3 = /.*\d.*/;
                  var checkpassword1 = password1.test(newVal);
                  var checkpassword2 = password2.test(newVal);
                  var checkpassword3 = password3.test(newVal);
                  if(newVal != undefined){
                      var checkpassword4 = newVal.length > 7 && newVal.length < 31;
                  }
                  if((!checkpassword1 || !checkpassword2 || !checkpassword3 || !checkpassword4) && scope.$parent.restoreForm.password.$dirty){
                      scope.$parent.showError = true;
                      if(!checkpassword1){
                          scope.$parent.errorMessage = $filter('translate')('Password should contain only numbers and latin letters, allowed characters: !,.?%$#@*_-+=\\|/[]{}()')
                      } else if(!checkpassword2){
                          scope.$parent.errorMessage = $filter('translate')('Password should contain at least one latin letter')
                      } else if(!checkpassword3){
                          scope.$parent.errorMessage = $filter('translate')('Password should contain at least one number')
                      } else if(!checkpassword4){
                          scope.$parent.errorMessage = $filter('translate')('Password must be 8-30 characters long')
                      }
                  }else{
                      scope.$parent.showError = false;
                  }
              })
            }
        }
    }]).directive('select2PhoneCode', ["$filter", "serverAddress", "Service", "notificationService", "$window", function($filter, serverAddress, Service, notificationService, $window) {
        return {
            restrict: 'EA',
            replace: true,
            link: function($scope, element) {
                function formatCountry (country) {
                    if (!country.id) { return country.text; }
                    var $country = $(
                        '<span class="flag-icon flag-icon-'+ country.id.toLowerCase() +' flag-icon-squared"></span>' +
                        '<span class="flag-text" style="margin-left: 5px;">'+ country.text+"</span>"
                    );
                    return $country;
                }

                function format(state) {
                    if(state != undefined && state.value != undefined){
                        var phone = state.value.replace("+","");
                        localStorage.setItem("phone", phone);
                    }
                    if (!state.id) return state.text;

                    var $state = $(
                        '<span class="flag-icon flag-icon-'+ state.id.toLowerCase() +' flag-icon-squared"></span>' +
                        '<span class="flag-text" style="margin-left: 5px;">'+ state.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\-*\s*/g,"").replace(/,/g,"").replace(/'/g,"").replace(/&/g,"")+"</span>");
                    return $state;
                }

                var isoCountries = [
                    { id: 'AF', text: 'Afghanistan (+93)', value: '+93'},
                    { id: 'AX', text: 'Aland Islands (+358)', value: '+358'},
                    { id: 'AL', text: 'Albania (+355)', value: '+355'},
                    { id: 'DZ', text: 'Algeria (+213)', value: '+213'},
                    { id: 'AS', text: 'American Samoa (+1)', value: '+1'},
                    { id: 'AD', text: 'Andorra (+376)', value: '+376'},
                    { id: 'AO', text: 'Angola (+244)', value: '+244'},
                    { id: 'AI', text: 'Anguilla (+1264)', value: '+1264'},
                    { id: 'AQ', text: 'Antarctica (+672)', value: '+672'},
                    { id: 'AG', text: 'Antigua And Barbuda (+1268)', value: '+1268'},
                    { id: 'AR', text: 'Argentina (+54)', value: '+54'},
                    { id: 'AM', text: 'Armenia (+374)', value: '+374'},
                    { id: 'AW', text: 'Aruba (+297)', value: '+297'},
                    { id: 'AU', text: 'Australia (+61)', value: '+61'},
                    { id: 'AT', text: 'Austria (+43)', value: '+43'},
                    { id: 'AZ', text: 'Azerbaijan (+994)', value: '+994'},
                    { id: 'BS', text: 'Bahamas (+1242)', value: '+1242'},
                    { id: 'BH', text: 'Bahrain (+973)', value: '+973'},
                    { id: 'BD', text: 'Bangladesh (+880)', value: '+880'},
                    { id: 'BB', text: 'Barbados (+1246)', value: '+1246'},
                    { id: 'BY', text: 'Belarus (+375)', value: '+375'},
                    { id: 'BE', text: 'Belgium (+32)', value: '+32'},
                    { id: 'BZ', text: 'Belize (+501)', value: '+501'},
                    { id: 'BJ', text: 'Benin (+229)', value: '+229'},
                    { id: 'BM', text: 'Bermuda (+1441)', value: '+1441'},
                    { id: 'BT', text: 'Bhutan (+975)', value: '+975'},
                    { id: 'BO', text: 'Bolivia (+591)', value: '+591'},
                    { id: 'BA', text: 'Bosnia And Herzegovina (+387)', value: '+387'},
                    { id: 'BW', text: 'Botswana (+267)', value: '+267'},
                    { id: 'BV', text: 'Bouvet Island (+47)', value: '+47'},
                    { id: 'BR', text: 'Brazil (+55)', value: '+55'},
                    { id: 'IO', text: 'British Indian Ocean Territory (+246)', value: '+246'},
                    { id: 'BN', text: 'Brunei Darussalam (+673)', value: '+673'},
                    { id: 'BG', text: 'Bulgaria (+359)', value: '+359'},
                    { id: 'BF', text: 'Burkina Faso (+226)', value: '+226'},
                    { id: 'BI', text: 'Burundi (+257)', value: '+257'},
                    { id: 'KH', text: 'Cambodia (+855)', value: '+855'},
                    { id: 'CM', text: 'Cameroon (+237)', value: '+237'},
                    { id: 'CA', text: 'Canada (+1)', value: '+1'},
                    { id: 'CV', text: 'Cape Verde Islands (+238)', value: '+238'},
                    { id: 'KY', text: 'Cayman Islands (+1345)', value: '+1345'},
                    { id: 'CF', text: 'Central African Republic (+236)', value: '+236'},
                    { id: 'TD', text: 'Chad (+235)', value: '+235'},
                    { id: 'CL', text: 'Chile (+56)', value: '+56'},
                    { id: 'CN', text: 'China (+86)', value: '+86'},
                    { id: 'CX', text: 'Christmas Island (+672)', value: '+672'},
                    { id: 'CC', text: 'Cocos (Keeling) Islands (+225)', value: '+225'},
                    { id: 'CO', text: 'Colombia (+57)', value: '+57'},
                    { id: 'KM', text: 'Comoros (+269)', value: '+269'},
                    { id: 'CG', text: 'Congo (+242)', value: '+242'},
                    { id: 'CD', text: 'Congo, Democratic Republic (+243)', value: '+243'},
                    { id: 'CK', text: 'Cook Islands (+682)', value: '+682'},
                    { id: 'CR', text: 'Costa Rica (+506)', value: '+506'},
                    { id: 'CI', text: 'Cote D\'Ivoire (+225)', value: '+225'},
                    { id: 'HR', text: 'Croatia (+385)', value: '+385'},
                    { id: 'CU', text: 'Cuba (+53)', value: '+53'},
                    { id: 'CY', text: 'Cyprus (+90)', value: '+90'},
                    { id: 'CZ', text: 'Czech Republic (+420)', value: '+420'},
                    { id: 'DK', text: 'Denmark (+45)', value: '+45'},
                    { id: 'DJ', text: 'Djibouti (+253)', value: '+253'},
                    { id: 'DM', text: 'Dominica (+1809)', value: '+1809'},
                    { id: 'DO', text: 'Dominican Republic (+1809)', value: '+1809'},
                    { id: 'EC', text: 'Ecuador (+593)', value: '+593'},
                    { id: 'EG', text: 'Egypt (+20)', value: '+20'},
                    { id: 'SV', text: 'El Salvador (+503)', value: '+503'},
                    { id: 'GQ', text: 'Equatorial Guinea (+240)', value: '+240'},
                    { id: 'ER', text: 'Eritrea (+291)', value: '+291'},
                    { id: 'EE', text: 'Estonia (+372)', value: '+372'},
                    { id: 'ET', text: 'Ethiopia (+251)', value: '+251'},
                    { id: 'FK', text: 'Falkland Islands (Malvinas) (+500)', value: '+500'},
                    { id: 'FO', text: 'Faroe Islands (+298)', value: '+298'},
                    { id: 'FJ', text: 'Fiji (+679)', value: '+679'},
                    { id: 'FI', text: 'Finland (+358)', value: '+358'},
                    { id: 'FR', text: 'France (+33)', value: '+33'},
                    { id: 'GF', text: 'French Guiana (+594)', value: '+594'},
                    { id: 'PF', text: 'French Polynesia (+689)', value: '+689'},
                    { id: 'TF', text: 'French Southern Territories (+689)', value: '+689'},
                    { id: 'GA', text: 'Gabon (+241)', value: '+241'},
                    { id: 'GM', text: 'Gambia (+220)', value: '+220'},
                    { id: 'GE', text: 'Georgia (+7880)', value: '+7880'},
                    { id: 'DE', text: 'Germany (+49)', value: '+49'},
                    { id: 'GH', text: 'Ghana (+233)', value: '+233'},
                    { id: 'GI', text: 'Gibraltar (+350)', value: '+350'},
                    { id: 'GR', text: 'Greece (+30)', value: '+30'},
                    { id: 'GL', text: 'Greenland (+299)', value: '+299'},
                    { id: 'GD', text: 'Grenada (+1473)', value: '+1473'},
                    { id: 'GP', text: 'Guadeloupe (+590)', value: '+590'},
                    { id: 'GU', text: 'Guam (+671)', value: '+671'},
                    { id: 'GT', text: 'Guatemala (+502)', value: '+502'},
                    { id: 'GG', text: 'Guernsey (+44)', value: '+44'},
                    { id: 'GN', text: 'Guinea (+224)', value: '+224'},
                    { id: 'GW', text: 'Guinea-Bissau (+245)', value: '+245'},
                    { id: 'GY', text: 'Guyana (+592)', value: '+592'},
                    { id: 'HT', text: 'Haiti (+509)', value: '+509'},
                    { id: 'HM', text: 'Heard Island & Mcdonald Islands (+61)', value: '+61'},
                    { id: 'VA', text: 'Holy See (Vatican City State) (+39)', value: '+39'},
                    { id: 'HN', text: 'Honduras (+504)', value: '+504'},
                    { id: 'HK', text: 'Hong Kong (+852)', value: '+852'},
                    { id: 'HU', text: 'Hungary (+36)', value: '+36'},
                    { id: 'IS', text: 'Iceland (+354)', value: '+354'},
                    { id: 'IN', text: 'India(+91)', value: '+91'},
                    { id: 'ID', text: 'Indonesia (+62)', value: '+62'},
                    { id: 'IR', text: 'Iran, Islamic Republic Of (+98)', value: '+98'},
                    { id: 'IQ', text: 'Iraq (+964)', value: '+964'},
                    { id: 'IE', text: 'Ireland (+353)', value: '+353'},
                    { id: 'IM', text: 'Isle Of Man (+44)', value: '+44'},
                    { id: 'IL', text: 'Israel (+972)', value: '+975'},
                    { id: 'IT', text: 'Italy (+39)', value: '+39'},
                    { id: 'JM', text: 'Jamaica (+1876)', value: '+1876'},
                    { id: 'JP', text: 'Japan (+81)', value: '+81'},
                    { id: 'JE', text: 'Jersey (+44-1534)', value: '+44-1534'},
                    { id: 'JO', text: 'Jordan (+962)', value: '+962'},
                    { id: 'KZ', text: 'Kazakhstan (+7)', value: '+7'},
                    { id: 'KE', text: 'Kenya (+254)', value: '+254'},
                    { id: 'KI', text: 'Kiribati (+686)', value: '+686'},
                    { id: 'KP', text: 'Korea - North (+850)', value: '+850'},
                    { id: 'KR', text: 'Korea - South (+82)', value: '+82'},
                    { id: 'KW', text: 'Kuwait (+965)', value: '+965'},
                    { id: 'KG', text: 'Kyrgyzstan (+996)', value: '+996'},
                    { id: 'LA', text: 'Lao People\'s Democratic Republic (+856)', value: '+856'},
                    { id: 'LV', text: 'Latvia (+371)', value: '+371'},
                    { id: 'LB', text: 'Lebanon (+961)', value: '+961'},
                    { id: 'LS', text: 'Lesotho (+266)', value: '+266'},
                    { id: 'LR', text: 'Liberia (+231)', value: '+231'},
                    { id: 'LY', text: 'Libyan Arab Jamahiriya (+218)', value: '+218'},
                    { id: 'LI', text: 'Liechtenstein (+417)', value: '+417'},
                    { id: 'LT', text: 'Lithuania (+370)', value: '+370'},
                    { id: 'LU', text: 'Luxembourg (+352)', value: '+352'},
                    { id: 'MO', text: 'Macao (+853)', value: '+853'},
                    { id: 'MK', text: 'Macedonia (+389)', value: '+389'},
                    { id: 'MG', text: 'Madagascar (+261)', value: '+261'},
                    { id: 'MW', text: 'Malawi (+265)', value: '+265'},
                    { id: 'MY', text: 'Malaysia (+60)', value: '+60'},
                    { id: 'MV', text: 'Maldives (+960)', value: '+960'},
                    { id: 'ML', text: 'Mali (+223)', value: '+223'},
                    { id: 'MT', text: 'Malta (+356)', value: '+356'},
                    { id: 'MH', text: 'Marshall Islands (+692)', value: '+692'},
                    { id: 'MQ', text: 'Martinique (+596)', value: '+596'},
                    { id: 'MR', text: 'Mauritania (+222)', value: '+222'},
                    { id: 'MU', text: 'Mauritius (+230)', value: '+230'},
                    { id: 'YT', text: 'Mayotte (+269)', value: '+269'},
                    { id: 'MX', text: 'Mexico (+52)', value: '+52'},
                    { id: 'FM', text: 'Micronesia, Federated States Of (+691)', value: '+691'},
                    { id: 'MD', text: 'Moldova (+373)', value: '+373'},
                    { id: 'MC', text: 'Monaco (+377)', value: '+377'},
                    { id: 'MN', text: 'Mongolia (+976)', value: '+976'},
                    { id: 'ME', text: 'Montenegro (+382)', value: '+382'},
                    { id: 'MS', text: 'Montserrat (+1664)', value: '+1664'},
                    { id: 'MA', text: 'Morocco (+212)', value: '+212'},
                    { id: 'MZ', text: 'Mozambique (+258)', value: '+258'},
                    { id: 'MM', text: 'Myanmar (+95)', value: '+95'},
                    { id: 'NA', text: 'Namibia (+264)', value: '+264'},
                    { id: 'NR', text: 'Nauru (+674)', value: '+674'},
                    { id: 'NP', text: 'Nepal (+977)', value: '+977'},
                    { id: 'NL', text: 'Netherlands (+31)', value: '+31'},
                    { id: 'AN', text: 'Netherlands Antilles (+599)', value: '+599'},
                    { id: 'NC', text: 'New Caledonia (+687)', value: '+687'},
                    { id: 'NZ', text: 'New Zealand (+64)', value: '+64'},
                    { id: 'NI', text: 'Nicaragua (+505)', value: '+505'},
                    { id: 'NE', text: 'Niger (+227)', value: '+227'},
                    { id: 'NG', text: 'Nigeria (+234)', value: '+234'},
                    { id: 'NU', text: 'Niue (+683)', value: '+683'},
                    { id: 'NF', text: 'Norfolk Island (+672)', value: '+672'},
                    { id: 'MP', text: 'Northern Mariana Islands (+670)', value: '+670'},
                    { id: 'NO', text: 'Norway (+47)', value: '+47'},
                    { id: 'OM', text: 'Oman (+968)', value: '+968'},
                    { id: 'PK', text: 'Pakistan (+92)', value: '+92'},
                    { id: 'PW', text: 'Palau (+680)', value: '+680'},
                    { id: 'PS', text: 'Palestinian Territory (+970)', value: '+970'},
                    { id: 'PA', text: 'Panama (+507)', value: '+507'},
                    { id: 'PG', text: 'Papua New Guinea (+675)', value: '+675'},
                    { id: 'PY', text: 'Paraguay (+595)', value: '+595'},
                    { id: 'PE', text: 'Peru (+51)', value: '+51'},
                    { id: 'PH', text: 'Philippines (+63)', value: '+63'},
                    { id: 'PN', text: 'Pitcairn (+64)', value: '+64'},
                    { id: 'PL', text: 'Poland (+48)', value: '+48'},
                    { id: 'PT', text: 'Portugal (+351)', value: '+351'},
                    { id: 'PR', text: 'Puerto Rico (+1787)', value: '+1787'},
                    { id: 'QA', text: 'Qatar (+974)', value: '+974'},
                    { id: 'RE', text: 'Reunion (+262)', value: '+262'},
                    { id: 'RO', text: 'Romania (+40)', value: '+40'},
                    { id: 'RU', text: 'Russian Federation (+7)', value: '+7'},
                    { id: 'RW', text: 'Rwanda (+250)', value: '+250'},
                    { id: 'BL', text: 'Saint Barthelemy (+590)', value: '+590'},
                    { id: 'SH', text: 'Saint Helena (+290)', value: '+94'},
                    { id: 'KN', text: 'Saint Kitts And Nevis (+1869)', value: '+94'},
                    { id: 'LC', text: 'Saint Lucia (+1758)', value: '+94'},
                    { id: 'MF', text: 'Saint Martin (+590)', value: '+590'},
                    { id: 'PM', text: 'Saint Pierre And Miquelon (+508)', value: '+508'},
                    { id: 'VC', text: 'Saint Vincent And Grenadines (+1-784)', value: '+1-784'},
                    { id: 'WS', text: 'Samoa (+685)', value: '+685'},
                    { id: 'SM', text: 'San Marino (+378)', value: '+378'},
                    { id: 'ST', text: 'Sao Tome And Principe (+239)', value: '+239'},
                    { id: 'SA', text: 'Saudi Arabia (+966)', value: '+966'},
                    { id: 'SN', text: 'Senegal (+221)', value: '+221'},
                    { id: 'RS', text: 'Serbia (+381)', value: '+381'},
                    { id: 'SC', text: 'Seychelles (+248)', value: '+248'},
                    { id: 'SL', text: 'Sierra Leone (+232)', value: '+232'},
                    { id: 'SG', text: 'Singapore (+65)', value: '+65'},
                    { id: 'SK', text: 'Slovakia (+421)', value: '+421'},
                    { id: 'SI', text: 'Slovenia (+386)', value: '+386'},
                    { id: 'SB', text: 'Solomon Islands (+677)', value: '+677'},
                    { id: 'SO', text: 'Somalia (+252)', value: '+252'},
                    { id: 'ZA', text: 'South Africa (+27)', value: '+27'},
                    { id: 'GS', text: 'South Georgia And Sandwich Isl. (+500)', value: '+500'},
                    { id: 'ES', text: 'Spain (+34)', value: '+34'},
                    { id: 'LK', text: 'Sri Lanka (+94)', value: '+94'},
                    { id: 'SD', text: 'Sudan (+249)', value: '+249'},
                    { id: 'SR', text: 'Suriname (+597)', value: '+597'},
                    { id: 'SJ', text: 'Svalbard And Jan Mayen (+47)', value: '+47'},
                    { id: 'SZ', text: 'Swaziland (+268)', value: '+268'},
                    { id: 'SE', text: 'Sweden (+46)', value: '+46'},
                    { id: 'CH', text: 'Switzerland (+41)', value: '+41'},
                    { id: 'SY', text: 'Syrian Arab Republic (+963)', value: '+963'},
                    { id: 'TW', text: 'Taiwan (+886)', value: '+886'},
                    { id: 'TJ', text: 'Tajikistan (+992)', value: '+992'},
                    { id: 'TZ', text: 'Tanzania (+255)', value: '+255'},
                    { id: 'TH', text: 'Thailand (+66)', value: '+66'},
                    { id: 'TL', text: 'Timor-Leste (+670)', value: '+670'},
                    { id: 'TG', text: 'Togo (+228)', value: '+228'},
                    { id: 'TK', text: 'Tokelau (+690)', value: '+690'},
                    { id: 'TO', text: 'Tonga (+676)', value: '+676'},
                    { id: 'TT', text: 'Trinidad And Tobago (+1868)', value: '+1868'},
                    { id: 'TN', text: 'Tunisia (+216)', value: '+216'},
                    { id: 'TR', text: 'Turkey (+90)', value: '+90'},
                    { id: 'TM', text: 'Turkmenistan (+993)', value: '+993'},
                    { id: 'TC', text: 'Turks And Caicos Islands (+1649)', value: '+1649'},
                    { id: 'TV', text: 'Tuvalu (+688)', value: '+668'},
                    { id: 'UG', text: 'Uganda (+256)', value: '+256'},
                    { id: 'UA', text: 'Ukraine (+380)', value: '+380'},
                    { id: 'AE', text: 'United Arab Emirates (+971)', value: '+971'},
                    { id: 'GB', text: 'United Kingdom (+44)', value: '+44'},
                    { id: 'US', text: 'United States (+1)', value: '+1'},
                    { id: 'UM', text: 'United States Outlying Islands (+1-340)', value: '+1-340'},
                    { id: 'UY', text: 'Uruguay (+598)', value: '+598'},
                    { id: 'UZ', text: 'Uzbekistan (+998)', value: '+998'},
                    { id: 'VU', text: 'Vanuatu (+678)', value: '+678'},
                    { id: 'VE', text: 'Venezuela (+58)', value: '+58'},
                    { id: 'VN', text: 'Vietnam (+84)', value: '+84'},
                    { id: 'VG', text: 'Virgin Islands, British (+1)', value: '+1'},
                    { id: 'VI', text: 'Virgin Islands, U.S. (+1)', value: '+1'},
                    { id: 'WF', text: 'Wallis And Futuna (+681)', value: '+681'},
                    { id: 'EH', text: 'Western Sahara (+212)', value: '+212'},
                    { id: 'YE', text: 'Yemen (North)(+969)', value: '+969'},
                    { id: 'YE', text: 'Yemen (South)(+967)', value: '+967'},
                    { id: 'ZM', text: 'Zambia (+260)', value: '+260'},
                    { id: 'ZW', text: 'Zimbabwe (+263)', value: '+263'}
                ];

                $(element[0]).select2({
                        data:{
                            results:  isoCountries,
                            text: function(item) { return item.text; }
                        },
                        formatSelection: format,
                        formatResult: formatCountry
                    }
                ).on("change", function(e) {

                });
            }
        }
    }]).directive('customScrollbar',function() {
            return function(scope, element, attrs) {
                $(element).mCustomScrollbar({
                    theme: 'dark',
                    scrollInertia:600
                });
            }
    }).directive('customTooltip', ['$filter',function($filter) {
       return {
           restrict: 'A',
           scope: {
               tooltipText: "=",
               tooltipClass: "=",
               tooltipHover: "=",
               tooltipShow: "="
           },
           link: function(scope, element) {
               let tooltip = $('<span></span>');

               console.log(scope);

               console.log(scope.tooltipShow);

               $(element).css('position','relative');
               $(element).append(tooltip);

               tooltip.text(scope.tooltipText);
               tooltip.addClass(scope.tooltipClass);
               tooltip.addClass('custom-tooltip');
               tooltip.css('top', -(tooltip.height()*1.5)+ "px");

               console.log(scope.$parent.errorHandler.vacanciesFilter.error.show);

               scope.$watch(scope.$parent.errorHandler.vacanciesFilter.error.show, function() {
                  if(scope.$parent.errorHandler.vacanciesFilter.error.show) {
                      tooltip.addClass('visible')
                  } else {
                      tooltip.removeClass('visible')
                  }
               },true);

               if(!scope.tooltipShow) {
                   tooltip.addClass('visible');
               }

               element.on({
                   mouseover: () => showToolTip(),
                   mouseleave: () => tooltip.removeClass('visible')
               });


               function showToolTip() {
                   if(scope.tooltipHover === 'true') {
                       tooltip.addClass('visible')
                   }
               }
               console.log(tooltip);
           }
       }
    }]).directive('passThroughList', [function() {
        return {
            restrict: "A",
            scope: {
              onSelect: "="
            },
            link: function(scope,element,attrs) {
                let list = document.getElementById(attrs.id).getElementsByTagName('li'),
                    selectedItemIndex = -1;

                $(element).parent().on(
                    {
                        keydown: () => checkForArrows(event),
                        blur: () => reset(),
                        click: function(event) {
                            if(event.target.tagName.toLowerCase() === 'input') {
                                $(event.target).focus();
                                $(event.target).unbind('blur').on('blur', reset());
                            } else {
                                $(this).attr('tabindex','0');
                                $(this).focus();
                            }
                        }
                    }
                );

                function checkForArrows(e) {
                    if(e.target.tagName.toLowerCase() !== 'input') e.preventDefault();
                    if(e.keyCode === 38) {
                        goUp();
                        scrollElement();
                    } else if(e.keyCode === 40){
                        goDown();
                        scrollElement();
                    } else if(e.keyCode === 13) {
                        selectItem();
                    }
                }

                function goUp() {
                    selectedItemIndex = list[selectedItemIndex - 1] ? --selectedItemIndex : selectedItemIndex;

                    $(list[selectedItemIndex]).addClass('selected');
                    $(list[selectedItemIndex + 1]).removeClass('selected');
                }

                function goDown() {
                    selectedItemIndex = list[selectedItemIndex + 1] ? ++selectedItemIndex : selectedItemIndex;

                    $(list[selectedItemIndex]).addClass('selected');
                    $(list[selectedItemIndex - 1]).removeClass('selected');
                }

                function selectItem() {
                    if($(list[selectedItemIndex]).text().trim()) {
                        scope.$parent[scope.onSelect]($(list[selectedItemIndex]).text().trim());
                        scope.$apply();
                    }
                }

                function scrollElement() {
                    let parentHeight = $(element).height(),
                        currentItemHeight = $(list[selectedItemIndex]).outerHeight(),
                        currentItemPosition = $(list[selectedItemIndex]).position().top,
                        relativePosition = ((currentItemPosition + 1) % parentHeight),
                        scrollPosition = $('#' + attrs.id + ' .mCSB_container').position().top;


                    if(parentHeight - relativePosition - currentItemHeight < currentItemHeight / 3 || Math.abs(+(scrollPosition)) > currentItemPosition) {
                        $(element).mCustomScrollbar("scrollTo", $(list[selectedItemIndex]));
                    }
                }

                function reset() {
                    selectedItemIndex = -1;
                }
            }
        }
    }]).directive('toggleCompanyBlock', ['$timeout', function($timeout){
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                let logo, nameWrap, linksWrap, name, siteLink, fbLink,
                    id = '#' + attrs.id,
                    timeout;

                $timeout(() => {
                    nameWrap = $(id + ' .name_wrap');
                    name = $(id +  ' .name_wrap h2');

                    linksWrap = $(id + ' .info--site:eq(0)');
                    siteLink = $(id + ' .info--site .site-link');
                    fbLink = $(id + ' .info--site .fb-link');

                    console.log($(id));
                    console.log(logo);
                });

                element.on({
                    mouseenter: () => showBlock(),
                    mouseleave: () => hideBlock()
                });

                function showBlock() {
                    logo = $(id + ' .logo');

                    clearTimeout(timeout);

                    if(linksWrap.width() - siteLink.width() <= 44.64 || linksWrap.width() - fbLink.width() <= 44.64 || nameWrap.width() <= name.width()) {
                        let adaptiveImgWidth = logo.height();
                        logo.height(adaptiveImgWidth);
                        timeout = setTimeout(() => nameWrap.css('white-space', 'normal'),300);
                        element.addClass('hovered');
                    }
                }

                function hideBlock() {
                    nameWrap.css('white-space', 'nowrap');
                    element.removeClass('hovered');
                    clearTimeout(timeout);
                }
            }
        }
    }]);

function similar_text(first, second, percent) {
    if (first === null || second === null || typeof first === 'undefined' || typeof second === 'undefined') {
        return 0;
    }
    first += '';
    second += '';
    var pos1 = 0,
        pos2 = 0,
        max = 0,
        firstLength = first.length,
        secondLength = second.length,
        p, q, l, sum;
    max = 0;
    for (p = 0; p < firstLength; p++) {
        for (q = 0; q < secondLength; q++) {
            for (l = 0;
                 (p + l < firstLength) && (q + l < secondLength) && (first.charAt(p + l) === second.charAt(q + l)); l++)
                ;
            if (l > max) {
                max = l;
                pos1 = p;
                pos2 = q;
            }
        }
    }
    sum = max;
    if (sum) {
        if (pos1 && pos2) {
            sum += similar_text(first.substr(0, pos1), second.substr(0, pos2));
        }
        if ((pos1 + max < firstLength) && (pos2 + max < secondLength)) {
            sum += similar_text(first.substr(pos1 + max, firstLength - pos1 - max), second.substr(pos2 + max,
                secondLength - pos2 - max));
        }
    }
    if (!percent) {
        return sum;
    } else {
        return (sum * 200) / (firstLength + secondLength);
    }
}

function convertToRegionObject(place, scope) {
    var object = {
        country: null,
        area: null,
        city: null,
        lat: null,
        lng: null,
        lang: "ru",
        regionId: null,
        fullName: "full"
    };
    if (place != null) {
        angular.forEach(place.address_components, function(val) {
            angular.forEach(val.types, function(valT) {
                switch (valT) {
                    case "country":
                        object.country = val.long_name;
                        break;
                    case "administrative_area_level_1":
                        object.area = val.long_name;
                        break;
                    case "locality":
                        object.city = val.long_name;
                        break;
                }
            });
        });
        object.regionId = place.id;
        object.googlePlaceId = {googlePlaceId: place.place_id};
        if (scope) {
            if (scope.map != undefined) {
                scope.map.center.latitude = place.geometry.location.k;
                scope.map.center.longitude = place.geometry.location.D;
            }
            if (scope.marker != undefined) {
                scope.marker.coords.latitude = place.geometry.location.k;
                scope.marker.coords.longitude = place.geometry.location.D;
            }
        }
        if (place.geometry != null) {
            object.lat = place.geometry.location.k;
            object.lng = place.geometry.location.D;
        } else {
            object.lat = 48.379433;
            object.lng = 31.165579999999977
        }
        object.fullName = place.formatted_address;
        return object;
    } else {
        return null;
    }
}
