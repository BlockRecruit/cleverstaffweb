angular.module('services.globalService', [
        'ngResource',
        'pascalprecht.translate',
        'services.notice'
    ]
).factory('Service', ['$resource', 'serverAddress', '$filter', '$translate', '$location', 'notificationService', '$rootScope', function($resource, serverAddress, $filter, $translate, $location, notificationService, $rootScope) {
    var service = $resource(serverAddress + '/:service/:action', {service: "@service", action: "@action"}, {
        getRegions: {
            method: "GET",
            params: {
                service: "region",
                action: "get"
            }
        },
        getRegionsTwo: {
            method: "GET",
            params: {
                service: "region",
                action: "get2"
            }
        },
        history: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                service: "action",
                action: "get"
            }
        },
        notice: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                service: "notice",
                action: "get"
            }
        },
        readNotice: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                service: "notice",
                action: "read"
            }
        },
        publicVacancy: {
            method: "GET",
            params: {
                service: "public",
                action: "getVacancy"
            }
        },
        publicCandidate:{
          method:"GET",
            params: {
                service: "public",
                action: "getCandidate"
            }
        },
        saveAccessLogEntry: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                service: "public",
                action: "saveAccessLogEntry"
            }
        },
        addCandidate: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                service: "public",
                action: "addRecall"
            }
        },
        getEvaluation: {
            method: "GET",
            params: {
                service: "public",
                action: "getEvaluation"
            }
        },
        sendDailyReportExample: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                service: "public",
                action: "sendDailyReportExample"
            }
        },
        getClientNames: {
            method: "GET",
            params: {
                service: "public",
                action: "getClientNames"
            }
        },
        addVacancyPackage: {
            method: "POST",
            params: {
                service: "public",
                action: "addVacancyPackage"
            }
        },
        saveBrowserWithPlugin: {
            method: "GET",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params : {
                service: "person",
                action: "saveBrowserWithPlugin"
            }
        },
        getOrgLogoId: {
            method: "GET",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params : {
                service : "company",
                action : "getOrgLogoId"
            }
        },
        removeLogo: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                service: "company",
                action: "removeLogo"
            }
        },
        readAt: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params : {
                service : "at",
                action : "read"
            }
        },
        getGroups: {
            method: "GET",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params : {
                service : "candidateGroup",
                action : "getGroups"
            }
        },
        getAllOpenVacancy: {
            method: "GET",
            params: {
                service: "public",
                action: "getAllOpenVacancy"
            }
        }

    });
    service.regions = function(callbacl) {

    };
    service.getRegions2 = function(callback) {
        service.getRegionsTwo(function(resp) {
            var country = [];
            var cities = [];
            var sortArrayCountry = [];
            var sortArrayCities = [];
            var sortObjectCountry = {};
            var sortObjectCities = {};
            angular.forEach(resp.object, function(valC, keyC) {
                country.push({id:keyC,value: keyC, name: keyC, type: "country", showName: keyC, country: keyC, nameRu: keyC});
                angular.forEach(valC, function(val, key) {
                    if (val.type == 'country') {
                        country.push({
                            id:val.displayCity+keyC,
                            value: val.regionId,
                            name: val.displayCity,
                            type: "country",
                            showName: val.displayCity,
                            nameRu: (val.googlePlaceId == undefined || val.googlePlaceId.cityRu == undefined) ? val.city : val.googlePlaceId.cityRu,
                            nameEn: (val.googlePlaceId == undefined || val.googlePlaceId.cityEn == undefined) ? val.city : val.googlePlaceId.cityEn,
                            country: keyC,
                            countryRu: (val.googlePlaceId == undefined || val.googlePlaceId.countryRu == undefined) ? val.country : val.googlePlaceId.countryRu
                        });
                    }else{
                        cities.push({
                            id:val.displayCity+keyC,
                            value: val.regionId,
                            name: val.displayCity,
                            type: "city",
                            showName: val.displayCity,
                            nameRu: (val.googlePlaceId == undefined || val.googlePlaceId.cityRu == undefined) ? val.city : val.googlePlaceId.cityRu,
                            nameEn: (val.googlePlaceId == undefined || val.googlePlaceId.cityEn == undefined) ? val.city : val.googlePlaceId.cityEn,
                            country: keyC,
                            countryRu: (val.googlePlaceId == undefined || val.googlePlaceId.countryRu == undefined) ? val.country : val.googlePlaceId.countryRu
                        });
                    }
                    angular.forEach(country, function(valIn, keyIn) {
                        if (valIn.value == val.country) {
                            valIn.name = val.displayCountry;
                            valIn.showName = val.displayCountry;
                            valIn.nameRu = (val.googlePlaceId == undefined || val.googlePlaceId.countryRu == undefined) ? val.country : val.googlePlaceId.countryRu;
                        }
                    })
                });
            });
            angular.forEach(country,function(data){
                sortArrayCountry.push(data.id)
            });
            angular.forEach(cities,function(data){
                sortArrayCities.push(data.id)
            });
            sortArrayCountry = sortArrayCountry.sort();
            sortArrayCities = sortArrayCities.sort();

            angular.forEach(sortArrayCountry,function(name,key){
                    angular.forEach(country,function(obj){
                        if(name == obj.id){
                            sortObjectCountry[key] = obj;
                        }
                    })
            });
            angular.forEach(sortArrayCities,function(name,key){
                angular.forEach(cities,function(obj){
                    if(name == obj.id){
                        sortObjectCities[key] = obj;
                    }
                })
            });
            //angular.forEach(sortObjectCities,function(obj){
            //    if(obj.name == 'Одесса'){
            //        console.log(obj)
            //    }
            //});
            if (callback != undefined)
                callback(sortObjectCountry, sortObjectCities);
        });
    };
    service.getIndustries = function() {
        return [
            {value: "Accounting, Auditing"},
            {value: "Agriculture, agribusiness"},
            {value: "Automotive"},
            {value: "Aviation & Aerospace"},
            {value: "Beauty, fitness and sports"},
            {value: "Charity & NGO"},
            {value: "Chemicals"},
            {value: "Construction and architecture"},
            {value: "Consulting"},
            {value: "Consumer Goods"},
            {value: "Culture, music, show business"},
            {value: "Design, creativity"},
            {value: "Energy industry"},
            {value: "E-Commerce"},
            {value: "Education"},
            {value: "Engineering"},
            {value: "Engineering Consulting"},
            {value: "Engineering Services"},
            {value: "Finance, bank"},
            {value: "FMCG"},
            {value: "Government"},
            {value: "Healthcare, hospital"},
            {value: "HR Management, HR"},
            {value: "Hotel and restaurant business, tourism"},
            {value: "Insurance"},
            {value: "IT, computers, the Internet"},
            {value: "IT Consulting"},
            {value: "Logistics, warehouse, Foreign Trade"},
            {value: "Legal"},
            {value: "Manufacturing"},
            {value: "Marketing, Advertising, PR"},
            {value: "Media, publishing, printing"},
            {value: "Medicine, pharmacy"},
            {value: "Mining"},
            {value: "Network Marketing and MLM"},
            {value: "Oil & Gas"},
            {value: "Real Estate"},
            {value: "Retail"},
            {value: "Sales Jobs"},
            {value: "Secretariat, outsourcing, ACS"},
            {value: "Security, Safety"},
            {value: "Service industries"},
            {value: "Telecommunications"},
            {value: "Top management, senior management"},
            {value: "Transport, Telecom"},
            {value: "Travel & Tourism"},
            {value: "Work at home"},
            {value: "Work for students, early career"},
            {value: "Work without special training"},
            {value: "Other areas of activity"}
        ];
    };

    service.getSalary = function() {
        return [
            {name: "up to 500", salaryFrom: "0", salaryTo: "500"},
            {name: "500-1500", salaryFrom: "500", salaryTo: "1500"},
            {name: "1500-2500", salaryFrom: "1500", salaryTo: "2500"},
            {name: "2500-3500", salaryFrom: "2500", salaryTo: "3500"},
            {name: "3500-4500", salaryFrom: "3500", salaryTo: "4500"},
            {name: "more", salaryFrom: "4500", salaryTo: ""}
        ];
    };

    service.currency = function() {
        return [
            {value: "USD"},
            {value: "EUR"},
            {value: "ARS"},
            {value: "AUD"},
            {value: "BRL"},
            {value: "BYN"},
            {value: "CAD"},   
            {value: "CNY"},
            {value: "GBP"},    
            {value: "HKD"},
            {value: "IDR"},
            {value: "INR"},
            {value: "JPY"},
            {value: "KZT"},
            {value: "LKR"},
            {value: "MXN"},
            {value: "MYR"},
            {value: "PHP"},
            {value: "PLN"},
            {value: "RMB"},
            {value: "RUB"},            
            {value: "SGD"},
            {value: "THB"},
            {value: "UAH"},
            {value: "ZAR"}
        ];
    };
    service.positionLevel = function() {
        return [
            {value: "specialty workers"},
            {value: "specialist  (entry level)"},
            {value: "specialist"},
            {value: "Senior Specialist / Team Leader"},
            {value: "middle manager / head of department"},
            {value: "top manager / CEO / President"}
        ];
    };

    service.employmentType = function() {
        return [
            {value: "full employment"},
            {value: "underemployment"},
            {value: "telework"},
            {value: "training_practice"},
            {value: "project work"},
            {value: "seasonal_temporary_work"},
            {value: "Relocate"}
        ];

    };
    service.numberPosition = function() {
        return [
            {value: "1"},
            {value: "2"},
            {value: "3"},
            {value: "4"},
            {value: "5"},
            {value: "6"},
            {value: "7"},
            {value: "8"},
            {value: "9"},
            {value: "10"}
        ];
    };
    service.employmentTypeTwo = function() {
        if ($translate.use() == 'ua') {
            return [
                {text: "повна зайнятість", id: "full employment"},
                {text: "неповна зайнятість ", id: "underemployment"},
                {text: "Віддалена робота ", id: "telework"},
                {text: "навчання, практика", id: "training_practice"},
                {text: "проектна робота", id: "project work"},
                {text: "сезонна, тимчасова робота", id: "seasonal_temporary_work"}
            ];
        } else if ($translate.use() == 'ru') {
            return [
                {text: "полная занятость", id: "full employment"},
                {text: "неполная занятость ", id: "underemployment"},
                {text: "удаленная работа ", id: "telework"},
                {text: "обучение, практика", id: "training_practice"},
                {text: "проектная работа", id: "project work"},
                {text: "сезонная, временная работа", id: "seasonal_temporary_work"},
                {text: "переезд", id: "Relocate"}
            ];
        } else {
            return [
                {text: "Full Time", id: "full employment"},
                {text: "Part Time", id: "underemployment"},
                {text: "Remote", id: "telework"},
                {text: "Training, Practice", id: "training_practice"},
                {text: "Project", id: "project work"},
                {text: "Temporary", id: "seasonal_temporary_work"},
                {text: "Relocate", id: "Relocate"}
            ];
        }
    };
    service.createArrayByEmploymentType = function(arrayOfName) {
        var array = service.employmentTypeTwo();
        var respArray = [];
        angular.forEach(arrayOfName, function(valueOfName) {
            angular.forEach(array, function(vlOfArr) {
                if (valueOfName == vlOfArr.id) {
                    respArray.push(vlOfArr);
                }
            });
        });
        return respArray;
    };

    service.experience = function() {
        return [
            {value: "no experience"},
            {value: "least a year"},
            {value: "1-2 years"},
            {value: "2-3 years"},
            {value: "3-4 years"},
            {value: "4-5 years"},
            {value: "5-10 years"},
            {value: "over 10 years"}
        ];
    };
    var UALang = [
        "Англійська розмовна",
        "Англійська професійна",
        "Англійська середня",
        "Англійська початківець",
        "Білоруська розмовна",
        "Білоруська професійна",
        "Білоруська середня",
        "Білоруська початківець",
        "Іспанська розмовна",
        "Іспанська професійна",
        "Іспанська середня",
        "Іспанська початківець",
        "Італійська розмовна",
        "Італійська професійна",
        "Італійська середня",
        "Італійська початківець",
        "Казахська розмовна",
        "Казахська професійна",
        "Казахська середня",
        "Казахська початківець",
        "Китайська розмовна",
        "Китайська професійна",
        "Китайська середня",
        "Китайська початківець",
        "Малайська розмовна",
        "Малайська професійна",
        "Малайська середня",
        "Малайська початківець",
        "Мандаринська розмовна",
        "Мандаринська професійна",
        "Мандаринська середня",
        "Мандаринська початківець",
        "Молдавська розмовна",
        "Молдавська професійна",
        "Молдавська середня",
        "Молдавська початківець",
        "Німецька розмовна",
        "Німецька професійна",
        "Німецька середня",
        "Німецька початківець",
        "Португальська розмовна",
        "Португальська професійна",
        "Португальська середня",
        "Португальська початківець",
        "Російська розмовна",
        "Російська професійна",
        "Російська середня",
        "Російська початківець",
        "Тамільська розмовна",
        "Тамільська професійна",
        "Тамільська середня",
        "Тамільська початківець",
        "Українська розмовна",
        "Українська професійна",
        "Українська середня",
        "Українська початківець",
        "Французька розмовна",
        "Французька професійна",
        "Французька середня",
        "Французька початківець",
        "Гінді розмовна",
        "Гінді професійна",
        "Гінді середня",
        "Гінді початківець",
        "Японська розмовна",
        "Японська професійна",
        "Японська середня",
        "Японська початківець",
     ];

    var RULang = ["Английский разговорный",
        "Английский профессиональный",
        "Английский средний",
        "Английский начинающий",
        "Белорусский разговорный",
        "Белорусский профессиональный",
        "Белорусский средний",
        "Белорусский начинающий",
        "Испанский разговорный",
        "Испанский профессиональный",
        "Испанский средний",
        "Испанский начинающий",
        "Итальянский разговорный",
        "Итальянский профессиональный",
        "Итальянский средний",
        "Итальянский начинающий",
        "Казахский разговорный",
        "Казахский профессиональный",
        "Казахский средний",
        "Казахский начинающий",
        "Китайский разговорный",
        "Китайский профессиональный",
        "Китайский средний",
        "Китайский начинающий",
        "Малайский разговорный",
        "Малайский профессиональный",
        "Малайский средний",
        "Малайский начинающий",
        "Мандаринский разговорный",
        "Мандаринский профессиональный",
        "Мандаринский средний",
        "Мандаринский начинающий",
        "Молдавский разговорный",
        "Молдавский профессиональный",
        "Молдавский средний",
        "Молдавский начинающий",
        "Немецкий разговорный",
        "Немецкий профессиональный",
        "Немецкий средний",
        "Немецкий начинающий",
        "Португальский разговорный",
        "Португальский профессиональный",
        "Португальский средний",
        "Португальский начинающий",
        "Русский разговорный",
        "Русский профессиональный",
        "Русский средний",
        "Русский начинающий",
        "Тамильский разговорный",
        "Тамильский профессиональный",
        "Тамильский средний",
        "Тамильский начинающий",
        "Украинский разговорный",
        "Украинский профессиональный",
        "Украинский средний",
        "Украинский начинающий",
        "Французский разговорный",
        "Французский профессиональный",
        "Французский средний",
        "Французский начинающий",
        "Хинди разговорный",
        "Хинди профессиональный",
        "Хинди средний",
        "Хинди начинающий",
        "Японский разговорный",
        "Японский профессиональный",
        "Японский средний",
        "Японский начинающий"

    ];
    var ENLang = [
        "English Oral",
        "English Professional",
        "English Intermediate",
        "English Elementary",
        "Belarusian Oral",
        "Belarusian Professional",
        "Belarusian Intermediate",
        "Belarusian Elementary",
        "Spanish Oral",
        "Spanish Professional",
        "Spanish Intermediate",
        "Spanish Elementary",
        "Italian Oral",
        "Italian Professional",
        "Italian Intermediate",
        "Italian Elementary",
        "Kazakh Oral",
        "Kazakh Professional",
        "Kazakh Intermediate",
        "Kazakh Elementary",
        "Chinese Oral",
        "Chinese Professional",
        "Chinese Intermediate",
        "Chinese Elementary",
        "Malay Oral",
        "Malay Professional",
        "Malay Intermediate",
        "Malay Elementary",
        "Mandarin Oral",
        "Mandarin Professional",
        "Mandarin Intermediate",
        "Mandarin Elementary",
        "Moldovan Oral",
        "Moldovan Professional",
        "Moldovan Intermediate",
        "Moldovan Elementary",
        "German Oral",
        "German Professional",
        "German Intermediate",
        "German Elementary",
        "Portuguese Oral",
        "Portuguese Professional",
        "Portuguese Intermediate",
        "Portuguese Elementary",
        "Russian Oral",
        "Russian Professional",
        "Russian Intermediate",
        "Russian Elementary",
        "Tamil Oral",
        "Tamil Professional",
        "Tamil Intermediate",
        "Tamil Elementary",
        "Ukrainian Oral",
        "Ukrainian Professional",
        "Ukrainian Intermediate",
        "Ukrainian Elementary",
        "French Oral",
        "French Professional",
        "French Intermediate",
        "French Elementary",
        "Hindi Oral",
        "Hindi Professional",
        "Hindi Intermediate",
        "Hindi Elementary",
        "Japanese Oral",
        "Japanese Professional",
        "Japanese Intermediate",
        "Japanese Elementary",
    ];

        service.lang = function() {
        if ($translate.use() == 'ua') {
            return UALang;
        } else if ($translate.use() == 'ru') {
            return RULang;
        } else {
            return ENLang;
        }
    };
    service.langTranslator = function(currentLang) {
        if (!currentLang || currentLang.length == 0) {
            return currentLang;
        }
        currentLang = currentLang.replace(/,/g, ', ');
        for (var i = 0; i < ENLang.length; i++) {
            if ($translate.use() == 'ua') {
                currentLang = currentLang.replace(ENLang[i], UALang[i]).replace(RULang[i], UALang[i]);
            }
            if ($translate.use() == 'en') {
                currentLang = currentLang.replace(UALang[i], ENLang[i]).replace(RULang[i], ENLang[i]);
            }
            if ($translate.use() == 'ru') {
                currentLang = currentLang.replace(ENLang[i], RULang[i]).replace(UALang[i], RULang[i]);
            }
        }
        return currentLang;
    };

    service.gender = function($scope) {
        $scope.sexObjectRU = [
            {name: "Мужчина", value: true},
            {name: "Женщина", value: false}
        ];
        $scope.sexObject = [
            {name: "Male", value: true},
            {name: "Female", value: false}
        ];
        $scope.sexObjectUA = [
            {name: "Чоловік", value: true},
            {name: "Жінка", value: false}
        ];
    };


    service.genderTwo = function($scope) {
        $scope.sexObjectRU = [
            {name: "Мужчина", value: true},
            {name: "Женщина", value: false},
            {name: "Не имеет значения", value: null}
        ];
        $scope.sexObject = [
            {name: "Male", value: true},
            {name: "Female", value: false},
            {name: "Doesn't matter", value: null}
        ];
        $scope.sexObjectUA = [
            {name: "Чоловік", value: true},
            {name: "Жінка", value: false},
            {name: "Не має значення", value: null}
        ];
    };

    service.toAddCandidate = function(path) {
        if ($rootScope && $rootScope.me && angular.equals($rootScope.me.recrutRole, "salesmanager")) {
            if (path) {
                $location.path(path);
            }
            notificationService.error($filter('translate')("Sales Manager cannot add candidates"));
        } else {
            $location.path("candidate/add/");
        }
    };
    service.toEditCandidate = function(id, path) {
        if ($rootScope && $rootScope.me && angular.equals($rootScope.me.recrutRole, "salesmanager")) {
            if (path) {
                $location.path(path);
            }
            notificationService.error($filter('translate')("Sales Manager cannot edit candidates"));
        } else {
            $location.path("candidate/edit/" + id);
        }
    };
    service.toMergeCandidate = function(id, path) {
        if ($rootScope && $rootScope.me && angular.equals($rootScope.me.recrutRole, "salesmanager")) {
            if (path) {
                $location.path(path);
            }
            notificationService.error($filter('translate')("Sales Manager cannot edit candidates"));
        } else {
            $location.path("candidate/merge/" + id);
        }
    };

    service.getCountryLinkedIn = function() {
        return [
            {key: "ru", value: "Россия"},
            {key: "au", value: "Австралия"},
            {key: "at", value: "Австрия"},
            {key: "az", value: "Азербайджан"},
            {key: "ax", value: "Аландские о-ва"},
            {key: "al", value: "Албания"},
            {key: "dz", value: "Алжир"},
            {key: "as", value: "Американское Самоа"},
            {key: "ai", value: "Ангилья"},
            {key: "ao", value: "Ангола"},
            {key: "ad", value: "Андорра"},
            {key: "aq", value: "Антарктида"},
            {key: "ag", value: "Антигуа и Барбуда"},
            {key: "ar", value: "Аргентина"},
            {key: "am", value: "Армения"},
            {key: "aw", value: "Аруба"},
            {key: "af", value: "Афганистан"},
            {key: "bs", value: "Багамские о-ва"},
            {key: "bd", value: "Бангладеш"},
            {key: "bb", value: "Барбадос"},
            {key: "bh", value: "Бахрейн"},
            {key: "by", value: "Беларусь"},
            {key: "bz", value: "Белиз"},
            {key: "be", value: "Бельгия"},
            {key: "bj", value: "Бенин"},
            {key: "bm", value: "Бермудские о-ва"},
            {key: "bg", value: "Болгария"},
            {key: "bo", value: "Боливия"},
            {key: "ba", value: "Босния и Герцеговина"},
            {key: "bw", value: "Ботсвана"},
            {key: "br", value: "Бразилия"},
            {key: "io", value: "Британская территория в Индийском океане"},
            {key: "bn", value: "Бруней-Даруссалам"},
            {key: "bf", value: "Буркина-Фасо"},
            {key: "bi", value: "Бурунди"},
            {key: "bt", value: "Бутан"},
            {key: "vu", value: "Вануату"},
            {key: "va", value: "Ватикан"},
            {key: "gb", value: "Великобритания"},
            {key: "hu", value: "Венгрия"},
            {key: "ve", value: "Венесуэла"},
            {key: "vg", value: "Виргинские о-ва (Британские)"},
            {key: "vi", value: "Виргинские о-ва (США)"},
            {key: "tl", value: "Восточный Тимор"},
            {key: "tp", value: "Восточный Тимор"},
            {key: "tl", value: "Восточный Тимор"},
            {key: "tp", value: "Восточный Тимор"},
            {key: "vn", value: "Вьетнама"},
            {key: "ga", value: "Габон"},
            {key: "ht", value: "Гаити"},
            {key: "gy", value: "Гайана"},
            {key: "gm", value: "Гамбия"},
            {key: "gh", value: "Гана"},
            {key: "gp", value: "Гваделупа"},
            {key: "gt", value: "Гватемала"},
            {key: "gn", value: "Гвинея"},
            {key: "gw", value: "Гвинея-Бисау"},
            {key: "de", value: "Германия"},
            {key: "gg", value: "Гернси"},
            {key: "gi", value: "Гибралтар"},
            {key: "hn", value: "Гондурас"},
            {key: "hk", value: "Гонконг"},
            {key: "gd", value: "Гренада"},
            {key: "gl", value: "Гренландия"},
            {key: "gr", value: "Греция"},
            {key: "ge", value: "Грузия"},
            {key: "gu", value: "Гуам"},
            {key: "dk", value: "Дания"},
            {key: "cd", value: "Демократическая Республика Конго"},
            {key: "je", value: "Джерси"},
            {key: "dj", value: "Джибути"},
            {key: "dm", value: "Доминика"},
            {key: "do", value: "Доминиканская Республика"},
            {key: "eg", value: "Египет"},
            {key: "zm", value: "Замбия"},
            {key: "eh", value: "Западная Сахара"},
            {key: "zw", value: "Зимбабве"},
            {key: "il", value: "Израиль"},
            {key: "in", value: "Индия"},
            {key: "id", value: "Индонезия"},
            {key: "jo", value: "Иордания"},
            {key: "iq", value: "Ирак"},
            {key: "ir", value: "Иран"},
            {key: "ie", value: "Ирландия"},
            {key: "is", value: "Исландия"},
            {key: "es", value: "Испания"},
            {key: "it", value: "Италия"},
            {key: "ye", value: "Йемен"},
            {key: "cv", value: "Кабо-Верде"},
            {key: "kz", value: "Казахстан"},
            {key: "ky", value: "Каймановы о-ва"},
            {key: "kh", value: "Камбоджа"},
            {key: "cm", value: "Камерун"},
            {key: "ca", value: "Канада"},
            {key: "cb", value: "Карибский бассейн (страны и территории)"},
            {key: "qa", value: "Катар"},
            {key: "ke", value: "Кения"},
            {key: "cy", value: "Кипр"},
            {key: "kg", value: "Киргизия"},
            {key: "ki", value: "Кирибати"},
            {key: "cn", value: "Китай"},
            {key: "cc", value: "Кокосовые о-ва (о-ва Килинг)"},
            {key: "co", value: "Колумбия"},
            {key: "km", value: "Коморские о-ва"},
            {key: "cg", value: "Конго"},
            {key: "ko", value: "Косово"},
            {key: "cr", value: "Коста-Рика"},
            {key: "ci", value: "Кот-д'Ивуар"},
            {key: "cu", value: "Куба"},
            {key: "kw", value: "Кувейт"},
            {key: "la", value: "Лаос"},
            {key: "lv", value: "Латвия"},
            {key: "ls", value: "Лесото"},
            {key: "lr", value: "Либерия"},
            {key: "lb", value: "Ливан"},
            {key: "ly", value: "Ливия"},
            {key: "lt", value: "Литва"},
            {key: "li", value: "Лихтенштейн"},
            {key: "lu", value: "Люксембург"},
            {key: "mu", value: "Маврикий"},
            {key: "mr", value: "Мавритания"},
            {key: "mg", value: "Мадагаскар"},
            {key: "yt", value: "Майотта"},
            {key: "mo", value: "Макао"},
            {key: "mk", value: "Македония"},
            {key: "mw", value: "Малави"},
            {key: "my", value: "Малайзия"},
            {key: "ml", value: "Мали"},
            {key: "mv", value: "Мальдивские о-ва"},
            {key: "mt", value: "Мальта"},
            {key: "ma", value: "Марокко"},
            {key: "mq", value: "Мартиника"},
            {key: "mh", value: "Маршалловы о-ва"},
            {key: "mx", value: "Мексика"},
            {key: "mz", value: "Мозамбик"},
            {key: "md", value: "Молдова"},
            {key: "mc", value: "Монако"},
            {key: "mn", value: "Монголия"},
            {key: "ms", value: "Монтсеррат"},
            {key: "mm", value: "Мьянма"},
            {key: "na", value: "Намибия"},
            {key: "nr", value: "Науру"},
            {key: "np", value: "Непал"},
            {key: "ne", value: "Нигер"},
            {key: "ng", value: "Нигерия"},
            {key: "an", value: "Нидерландские Антильские о-ва"},
            {key: "nl", value: "Нидерланды"},
            {key: "ni", value: "Никарагуа"},
            {key: "nu", value: "Ниуэ"},
            {key: "nz", value: "Новая Зеландия"},
            {key: "nc", value: "Новая Каледония"},
            {key: "no", value: "Норвегия"},
            {key: "nf", value: "Норфолк (о-в)"},
            {key: "ae", value: "ОАЭ"},
            {key: "om", value: "Оман"},
            {key: "ck", value: "Острова Кука"},
            {key: "im", value: "Остров Мэн"},
            {key: "cx", value: "Остров Рождества"},
            {key: "pk", value: "Пакистан"},
            {key: "pw", value: "Палау"},
            {key: "ps", value: "Палестинская территория"},
            {key: "pa", value: "Панама"},
            {key: "pg", value: "Папуа-Новая Гвинея"},
            {key: "py", value: "Парагвай"},
            {key: "pe", value: "Перу"},
            {key: "pn", value: "Питкэрн"},
            {key: "pl", value: "Польша"},
            {key: "pt", value: "Португалия"},
            {key: "pr", value: "Пуэрто-Рико"},
            {key: "re", value: "Реюньон"},
            {key: "rw", value: "Руанда"},
            {key: "ro", value: "Румыния"},
            {key: "sv", value: "Сальвадор"},
            {key: "ws", value: "Самоа"},
            {key: "sm", value: "Сан-Марино"},
            {key: "st", value: "Сан-Томе и Принсипи"},
            {key: "sa", value: "Саудовская Аравия"},
            {key: "sz", value: "Свазиленд"},
            {key: "sj", value: "Свальбард и Ян-Майен (о-ва)"},
            {key: "sh", value: "Святая Елена (о-в)"},
            {key: "kp", value: "Северная Корея"},
            {key: "mp", value: "Северные Марианские о-ва"},
            {key: "sc", value: "Сейшельские о-ва"},
            {key: "sn", value: "Сенегал"},
            {key: "pm", value: "Сен-Пьер и Микелон"},
            {key: "vc", value: "Сент-Винсент и Гренадины"},
            {key: "kn", value: "Сент-Китс и Невис"},
            {key: "lc", value: "Сент-Люсия"},
            {key: "rs", value: "Сербия"},
            {key: "sg", value: "Сингапур"},
            {key: "sy", value: "Сирия"},
            {key: "sk", value: "Словацкая Республика"},
            {key: "si", value: "Словения"},
            {key: "sb", value: "Соломоновы о-ва"},
            {key: "so", value: "Сомали"},
            {key: "sd", value: "Судан"},
            {key: "sr", value: "Суринам"},
            {key: "us", value: "США"},
            {key: "sl", value: "Сьерра-Леоне"},
            {key: "tj", value: "Таджикистан"},
            {key: "th", value: "Таиланд"},
            {key: "tw", value: "Тайвань"},
            {key: "tz", value: "Танзания"},
            {key: "tc", value: "Теркс и Кайкос (о-ва)"},
            {key: "tg", value: "Того"},
            {key: "tk", value: "Токелау"},
            {key: "to", value: "Тонга"},
            {key: "tt", value: "Тринидад и Тобаго"},
            {key: "tv", value: "Тувалу"},
            {key: "tn", value: "Тунис"},
            {key: "tm", value: "Туркменистан"},
            {key: "tr", value: "Турция"},
            {key: "ug", value: "Уганда"},
            {key: "uz", value: "Узбекистан"},
            {key: "ua", value: "Украина"},
            {key: "wf", value: "Уоллис и Футуна"},
            {key: "uy", value: "Уругвай"},
            {key: "fo", value: "Фарерские о-ва"},
            {key: "fm", value: "Федеративные Штаты Микронезии"},
            {key: "fj", value: "Фиджи"},
            {key: "ph", value: "Филиппины"},
            {key: "fi", value: "Финляндия"},
            {key: "fk", value: "Фолклендские о-ва (Мальвинские о-ва)"},
            {key: "fr", value: "Франция"},
            {key: "gf", value: "Французская Гвиана"},
            {key: "pf", value: "Французская Полинезия"},
            {key: "tf", value: "Французские Южные Территории"},
            {key: "hr", value: "Хорватия"},
            {key: "cf", value: "Центральноафриканская Республика"},
            {key: "td", value: "Чад"},
            {key: "me", value: "Черногория"},
            {key: "cz", value: "Чешская Республика"},
            {key: "cl", value: "Чили"},
            {key: "ch", value: "Швейцария"},
            {key: "se", value: "Швеция"},
            {key: "lk", value: "Шри-Ланка"},
            {key: "ec", value: "Эквадор"},
            {key: "gq", value: "Экваториальная Гвинея"},
            {key: "er", value: "Эритрея"},
            {key: "ee", value: "Эстония"},
            {key: "et", value: "Эфиопия"},
            {key: "za", value: "ЮАР"},
            {key: "kr", value: "Южная Корея"},
            {key: "ss", value: "Южный Судан"},
            {key: "jm", value: "Ямайка"},
            {key: "jp", value: "Япония"},
            {key: "oo", value: "Другое"},
            {key: "us", value: "United States"},
            {key: "af", value: "Afghanistan"},
            {key: "ax", value: "Aland Islands"},
            {key: "al", value: "Albania"},
            {key: "dz", value: "Algeria"},
            {key: "as", value: "American Samoa"},
            {key: "ad", value: "Andorra"},
            {key: "ao", value: "Angola"},
            {key: "ai", value: "Anguilla"},
            {key: "aq", value: "Antarctica"},
            {key: "ag", value: "Antigua and Barbuda"},
            {key: "ar", value: "Argentina"},
            {key: "am", value: "Armenia"},
            {key: "aw", value: "Aruba"},
            {key: "au", value: "Australia"},
            {key: "at", value: "Austria"},
            {key: "az", value: "Azerbaijan"},
            {key: "bs", value: "Bahamas"},
            {key: "bh", value: "Bahrain"},
            {key: "bd", value: "Bangladesh"},
            {key: "bb", value: "Barbados"},
            {key: "by", value: "Belarus"},
            {key: "be", value: "Belgium"},
            {key: "bz", value: "Belize"},
            {key: "bj", value: "Benin"},
            {key: "bm", value: "Bermuda"},
            {key: "bt", value: "Bhutan"},
            {key: "bo", value: "Bolivia"},
            {key: "ba", value: "Bosnia and Herzegovina"},
            {key: "bw", value: "Botswana"},
            {key: "br", value: "Brazil"},
            {key: "io", value: "British Indian Ocean Territory"},
            {key: "bn", value: "Brunei Darussalam"},
            {key: "bg", value: "Bulgaria"},
            {key: "bf", value: "Burkina Faso"},
            {key: "bi", value: "Burundi"},
            {key: "kh", value: "Cambodia"},
            {key: "cm", value: "Cameroon"},
            {key: "ca", value: "Canada"},
            {key: "cv", value: "Cape Verde"},
            {key: "cb", value: "Caribbean Nations"},
            {key: "ky", value: "Cayman Islands"},
            {key: "cf", value: "Central African Republic"},
            {key: "td", value: "Chad"},
            {key: "cl", value: "Chile"},
            {key: "cn", value: "China"},
            {key: "cx", value: "Christmas Island"},
            {key: "cc", value: "Cocos (Keeling) Islands"},
            {key: "co", value: "Colombia"},
            {key: "km", value: "Comoros"},
            {key: "cg", value: "Congo"},
            {key: "ck", value: "Cook Islands"},
            {key: "cr", value: "Costa Rica"},
            {key: "ci", value: "Cote D\"Ivoire (Ivory Coast)"},
            {key: "hr", value: "Croatia"},
            {key: "cu", value: "Cuba"},
            {key: "cy", value: "Cyprus"},
            {key: "cz", value: "Czech Republic"},
            {key: "cd", value: "Democratic Republic of the Congo"},
            {key: "dk", value: "Denmark"},
            {key: "dj", value: "Djibouti"},
            {key: "dm", value: "Dominica"},
            {key: "do", value: "Dominican Republic"},
            {key: "tp", value: "East Timor"},
            {key: "ec", value: "Ecuador"},
            {key: "eg", value: "Egypt"},
            {key: "sv", value: "El Salvador"},
            {key: "gq", value: "Equatorial Guinea"},
            {key: "er", value: "Eritrea"},
            {key: "ee", value: "Estonia"},
            {key: "et", value: "Ethiopia"},
            {key: "fk", value: "Falkland Islands (Malvinas)"},
            {key: "fo", value: "Faroe Islands"},
            {key: "fm", value: "Federated States of Micronesia"},
            {key: "fj", value: "Fiji"},
            {key: "fi", value: "Finland"},
            {key: "fr", value: "France"},
            {key: "gf", value: "French Guiana"},
            {key: "pf", value: "French Polynesia"},
            {key: "tf", value: "French Southern Territories"},
            {key: "ga", value: "Gabon"},
            {key: "gm", value: "Gambia"},
            {key: "ge", value: "Georgia"},
            {key: "de", value: "Germany"},
            {key: "gh", value: "Ghana"},
            {key: "gi", value: "Gibraltar"},
            {key: "gr", value: "Greece"},
            {key: "gl", value: "Greenland"},
            {key: "gd", value: "Grenada"},
            {key: "gp", value: "Guadeloupe"},
            {key: "gu", value: "Guam"},
            {key: "gt", value: "Guatemala"},
            {key: "gg", value: "Guernsey"},
            {key: "gn", value: "Guinea"},
            {key: "gw", value: "Guinea-Bissau"},
            {key: "gy", value: "Guyana"},
            {key: "ht", value: "Haiti"},
            {key: "hn", value: "Honduras"},
            {key: "hk", value: "Hong Kong"},
            {key: "hu", value: "Hungary"},
            {key: "is", value: "Iceland"},
            {key: "in", value: "India"},
            {key: "id", value: "Indonesia"},
            {key: "ir", value: "Iran"},
            {key: "iq", value: "Iraq"},
            {key: "ie", value: "Ireland"},
            {key: "im", value: "Isle of Man"},
            {key: "il", value: "Israel"},
            {key: "it", value: "Italy"},
            {key: "jm", value: "Jamaica"},
            {key: "jp", value: "Japan"},
            {key: "je", value: "Jersey"},
            {key: "jo", value: "Jordan"},
            {key: "kz", value: "Kazakhstan"},
            {key: "ke", value: "Kenya"},
            {key: "ki", value: "Kiribati"},
            {key: "kr", value: "Korea"},
            {key: "kp", value: "Korea (North)"},
            {key: "ko", value: "Kosovo"},
            {key: "kw", value: "Kuwait"},
            {key: "kg", value: "Kyrgyzstan"},
            {key: "la", value: "Laos"},
            {key: "lv", value: "Latvia"},
            {key: "lb", value: "Lebanon"},
            {key: "ls", value: "Lesotho"},
            {key: "lr", value: "Liberia"},
            {key: "ly", value: "Libya"},
            {key: "li", value: "Liechtenstein"},
            {key: "lt", value: "Lithuania"},
            {key: "lu", value: "Luxembourg"},
            {key: "mo", value: "Macao"},
            {key: "mk", value: "Macedonia"},
            {key: "mg", value: "Madagascar"},
            {key: "mw", value: "Malawi"},
            {key: "my", value: "Malaysia"},
            {key: "mv", value: "Maldives"},
            {key: "ml", value: "Mali"},
            {key: "mt", value: "Malta"},
            {key: "mh", value: "Marshall Islands"},
            {key: "mq", value: "Martinique"},
            {key: "mr", value: "Mauritania"},
            {key: "mu", value: "Mauritius"},
            {key: "yt", value: "Mayotte"},
            {key: "mx", value: "Mexico"},
            {key: "md", value: "Moldova"},
            {key: "mc", value: "Monaco"},
            {key: "mn", value: "Mongolia"},
            {key: "me", value: "Montenegro"},
            {key: "ms", value: "Montserrat"},
            {key: "ma", value: "Morocco"},
            {key: "mz", value: "Mozambique"},
            {key: "mm", value: "Myanmar"},
            {key: "na", value: "Namibia"},
            {key: "nr", value: "Nauru"},
            {key: "np", value: "Nepal"},
            {key: "nl", value: "Netherlands"},
            {key: "an", value: "Netherlands Antilles"},
            {key: "nc", value: "New Caledonia"},
            {key: "nz", value: "New Zealand"},
            {key: "ni", value: "Nicaragua"},
            {key: "ne", value: "Niger"},
            {key: "ng", value: "Nigeria"},
            {key: "nu", value: "Niue"},
            {key: "nf", value: "Norfolk Island"},
            {key: "mp", value: "Northern Mariana Islands"},
            {key: "no", value: "Norway"},
            {key: "pk", value: "Pakistan"},
            {key: "pw", value: "Palau"},
            {key: "ps", value: "Palestinian Territory"},
            {key: "pa", value: "Panama"},
            {key: "pg", value: "Papua New Guinea"},
            {key: "py", value: "Paraguay"},
            {key: "pe", value: "Peru"},
            {key: "ph", value: "Philippines"},
            {key: "pn", value: "Pitcairn"},
            {key: "pl", value: "Poland"},
            {key: "pt", value: "Portugal"},
            {key: "pr", value: "Puerto Rico"},
            {key: "qa", value: "Qatar"},
            {key: "re", value: "Reunion"},
            {key: "ro", value: "Romania"},
            {key: "ru", value: "Russian Federation"},
            {key: "ru", value: "Russia"},
            {key: "rw", value: "Rwanda"},
            {key: "sh", value: "Saint Helena"},
            {key: "kn", value: "Saint Kitts and Nevis"},
            {key: "lc", value: "Saint Lucia"},
            {key: "pm", value: "Saint Pierre and Miquelon"},
            {key: "vc", value: "Saint Vincent and the Grenadines"},
            {key: "ws", value: "Samoa"},
            {key: "sm", value: "San Marino"},
            {key: "st", value: "Sao Tome and Principe"},
            {key: "sa", value: "Saudi Arabia"},
            {key: "sn", value: "Senegal"},
            {key: "rs", value: "Serbia"},
            {key: "sc", value: "Seychelles"},
            {key: "sl", value: "Sierra Leone"},
            {key: "sg", value: "Singapore"},
            {key: "sk", value: "Slovak Republic"},
            {key: "si", value: "Slovenia"},
            {key: "sb", value: "Solomon Islands"},
            {key: "so", value: "Somalia"},
            {key: "za", value: "South Africa"},
            {key: "ss", value: "South Sudan"},
            {key: "es", value: "Spain"},
            {key: "lk", value: "Sri Lanka"},
            {key: "sd", value: "Sudan"},
            {key: "om", value: "Sultanate of Oman"},
            {key: "sr", value: "Suriname"},
            {key: "sj", value: "Svalbard and Jan Mayen"},
            {key: "sz", value: "Swaziland"},
            {key: "se", value: "Sweden"},
            {key: "ch", value: "Switzerland"},
            {key: "sy", value: "Syria"},
            {key: "tw", value: "Taiwan"},
            {key: "tj", value: "Tajikistan"},
            {key: "tz", value: "Tanzania"},
            {key: "th", value: "Thailand"},
            {key: "tl", value: "Timor-Leste"},
            {key: "tg", value: "Togo"},
            {key: "tk", value: "Tokelau"},
            {key: "to", value: "Tonga"},
            {key: "tt", value: "Trinidad and Tobago"},
            {key: "tn", value: "Tunisia"},
            {key: "tr", value: "Turkey"},
            {key: "tm", value: "Turkmenistan"},
            {key: "tc", value: "Turks and Caicos Islands"},
            {key: "tv", value: "Tuvalu"},
            {key: "ug", value: "Uganda"},
            {key: "ua", value: "Ukraine"},
            {key: "ae", value: "United Arab Emirates"},
            {key: "gb", value: "United Kingdom"},
            {key: "uy", value: "Uruguay"},
            {key: "uz", value: "Uzbekistan"},
            {key: "vu", value: "Vanuatu"},
            {key: "va", value: "Vatican City State (Holy See)"},
            {key: "ve", value: "Venezuela"},
            {key: "vn", value: "Vietnam"},
            {key: "vg", value: "Virgin Islands (British)"},
            {key: "vi", value: "Virgin Islands (U.S.)"},
            {key: "wf", value: "Wallis and Futuna"},
            {key: "eh", value: "Western Sahara"},
            {key: "ye", value: "Yemen"},
            {key: "zm", value: "Zambia"},
            {key: "zw", value: "Zimbabwe"},
            {key: "oo", value: "Other"}
        ];
    };

    service.getAllCounties = function(lang) {
        const countries =  {
            en : {"AF":"Afghanistan","AX":"\u00c5land Islands","AL":"Albania","DZ":"Algeria","AS":"American Samoa","AD":"Andorra","AO":"Angola","AI":"Anguilla","AQ":"Antarctica","AG":"Antigua & Barbuda","AR":"Argentina","AM":"Armenia","AW":"Aruba","AC":"Ascension Island","AU":"Australia","AT":"Austria","AZ":"Azerbaijan","BS":"Bahamas","BH":"Bahrain","BD":"Bangladesh","BB":"Barbados","BY":"Belarus","BE":"Belgium","BZ":"Belize","BJ":"Benin","BM":"Bermuda","BT":"Bhutan","BO":"Bolivia","BA":"Bosnia & Herzegovina","BW":"Botswana","BR":"Brazil","IO":"British Indian Ocean Territory","VG":"British Virgin Islands","BN":"Brunei","BG":"Bulgaria","BF":"Burkina Faso","BI":"Burundi","KH":"Cambodia","CM":"Cameroon","CA":"Canada","IC":"Canary Islands","CV":"Cape Verde","BQ":"Caribbean Netherlands","KY":"Cayman Islands","CF":"Central African Republic","EA":"Ceuta & Melilla","TD":"Chad","CL":"Chile","CN":"China","CX":"Christmas Island","CC":"Cocos (Keeling) Islands","CO":"Colombia","KM":"Comoros","CG":"Congo - Brazzaville","CD":"Congo - Kinshasa","CK":"Cook Islands","CR":"Costa Rica","CI":"C\u00f4te d\u2019Ivoire","HR":"Croatia","CU":"Cuba","CW":"Cura\u00e7ao","CY":"Cyprus","CZ":"Czechia","DK":"Denmark","DG":"Diego Garcia","DJ":"Djibouti","DM":"Dominica","DO":"Dominican Republic","EC":"Ecuador","EG":"Egypt","SV":"El Salvador","GQ":"Equatorial Guinea","ER":"Eritrea","EE":"Estonia","ET":"Ethiopia","FK":"Falkland Islands","FO":"Faroe Islands","FJ":"Fiji","FI":"Finland","FR":"France","GF":"French Guiana","PF":"French Polynesia","TF":"French Southern Territories","GA":"Gabon","GM":"Gambia","GE":"Georgia","DE":"Germany","GH":"Ghana","GI":"Gibraltar","GR":"Greece","GL":"Greenland","GD":"Grenada","GP":"Guadeloupe","GU":"Guam","GT":"Guatemala","GG":"Guernsey","GN":"Guinea","GW":"Guinea-Bissau","GY":"Guyana","HT":"Haiti","HN":"Honduras","HK":"Hong Kong SAR China","HU":"Hungary","IS":"Iceland","IN":"India","ID":"Indonesia","IR":"Iran","IQ":"Iraq","IE":"Ireland","IM":"Isle of Man","IL":"Israel","IT":"Italy","JM":"Jamaica","JP":"Japan","JE":"Jersey","JO":"Jordan","KZ":"Kazakhstan","KE":"Kenya","KI":"Kiribati","XK":"Kosovo","KW":"Kuwait","KG":"Kyrgyzstan","LA":"Laos","LV":"Latvia","LB":"Lebanon","LS":"Lesotho","LR":"Liberia","LY":"Libya","LI":"Liechtenstein","LT":"Lithuania","LU":"Luxembourg","MO":"Macau SAR China","MK":"Macedonia","MG":"Madagascar","MW":"Malawi","MY":"Malaysia","MV":"Maldives","ML":"Mali","MT":"Malta","MH":"Marshall Islands","MQ":"Martinique","MR":"Mauritania","MU":"Mauritius","YT":"Mayotte","MX":"Mexico","FM":"Micronesia","MD":"Moldova","MC":"Monaco","MN":"Mongolia","ME":"Montenegro","MS":"Montserrat","MA":"Morocco","MZ":"Mozambique","MM":"Myanmar (Burma)","NA":"Namibia","NR":"Nauru","NP":"Nepal","NL":"Netherlands","NC":"New Caledonia","NZ":"New Zealand","NI":"Nicaragua","NE":"Niger","NG":"Nigeria","NU":"Niue","NF":"Norfolk Island","KP":"North Korea","MP":"Northern Mariana Islands","NO":"Norway","OM":"Oman","PK":"Pakistan","PW":"Palau","PS":"Palestinian Territories","PA":"Panama","PG":"Papua New Guinea","PY":"Paraguay","PE":"Peru","PH":"Philippines","PN":"Pitcairn Islands","PL":"Poland","PT":"Portugal","PR":"Puerto Rico","QA":"Qatar","RE":"R\u00e9union","RO":"Romania","RU":"Russia","RW":"Rwanda","WS":"Samoa","SM":"San Marino","ST":"S\u00e3o Tom\u00e9 & Pr\u00edncipe","SA":"Saudi Arabia","SN":"Senegal","RS":"Serbia","SC":"Seychelles","SL":"Sierra Leone","SG":"Singapore","SX":"Sint Maarten","SK":"Slovakia","SI":"Slovenia","SB":"Solomon Islands","SO":"Somalia","ZA":"South Africa","GS":"South Georgia & South Sandwich Islands","KR":"South Korea","SS":"South Sudan","ES":"Spain","LK":"Sri Lanka","BL":"St. Barth\u00e9lemy","SH":"St. Helena","KN":"St. Kitts & Nevis","LC":"St. Lucia","MF":"St. Martin","PM":"St. Pierre & Miquelon","VC":"St. Vincent & Grenadines","SD":"Sudan","SR":"Suriname","SJ":"Svalbard & Jan Mayen","SZ":"Swaziland","SE":"Sweden","CH":"Switzerland","SY":"Syria","TW":"Taiwan","TJ":"Tajikistan","TZ":"Tanzania","TH":"Thailand","TL":"Timor-Leste","TG":"Togo","TK":"Tokelau","TO":"Tonga","TT":"Trinidad & Tobago","TA":"Tristan da Cunha","TN":"Tunisia","TR":"Turkey","TM":"Turkmenistan","TC":"Turks & Caicos Islands","TV":"Tuvalu","UM":"U.S. Outlying Islands","VI":"U.S. Virgin Islands","UG":"Uganda","UA":"Ukraine","AE":"United Arab Emirates","GB":"United Kingdom","US":"United States","UY":"Uruguay","UZ":"Uzbekistan","VU":"Vanuatu","VA":"Vatican City","VE":"Venezuela","VN":"Vietnam","WF":"Wallis & Futuna","EH":"Western Sahara","YE":"Yemen","ZM":"Zambia","ZW":"Zimbabwe"},
            ru : {"AU":"\u0410\u0432\u0441\u0442\u0440\u0430\u043b\u0438\u044f","AT":"\u0410\u0432\u0441\u0442\u0440\u0438\u044f","AZ":"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d","AX":"\u0410\u043b\u0430\u043d\u0434\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430","AL":"\u0410\u043b\u0431\u0430\u043d\u0438\u044f","DZ":"\u0410\u043b\u0436\u0438\u0440","AS":"\u0410\u043c\u0435\u0440\u0438\u043a\u0430\u043d\u0441\u043a\u043e\u0435 \u0421\u0430\u043c\u043e\u0430","AI":"\u0410\u043d\u0433\u0438\u043b\u044c\u044f","AO":"\u0410\u043d\u0433\u043e\u043b\u0430","AD":"\u0410\u043d\u0434\u043e\u0440\u0440\u0430","AQ":"\u0410\u043d\u0442\u0430\u0440\u043a\u0442\u0438\u0434\u0430","AG":"\u0410\u043d\u0442\u0438\u0433\u0443\u0430 \u0438 \u0411\u0430\u0440\u0431\u0443\u0434\u0430","AR":"\u0410\u0440\u0433\u0435\u043d\u0442\u0438\u043d\u0430","AM":"\u0410\u0440\u043c\u0435\u043d\u0438\u044f","AW":"\u0410\u0440\u0443\u0431\u0430","AF":"\u0410\u0444\u0433\u0430\u043d\u0438\u0441\u0442\u0430\u043d","BS":"\u0411\u0430\u0433\u0430\u043c\u044b","BD":"\u0411\u0430\u043d\u0433\u043b\u0430\u0434\u0435\u0448","BB":"\u0411\u0430\u0440\u0431\u0430\u0434\u043e\u0441","BH":"\u0411\u0430\u0445\u0440\u0435\u0439\u043d","BY":"\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u044c","BZ":"\u0411\u0435\u043b\u0438\u0437","BE":"\u0411\u0435\u043b\u044c\u0433\u0438\u044f","BJ":"\u0411\u0435\u043d\u0438\u043d","BM":"\u0411\u0435\u0440\u043c\u0443\u0434\u044b","BG":"\u0411\u043e\u043b\u0433\u0430\u0440\u0438\u044f","BO":"\u0411\u043e\u043b\u0438\u0432\u0438\u044f","BQ":"\u0411\u043e\u043d\u044d\u0439\u0440, \u0421\u0438\u043d\u0442-\u042d\u0441\u0442\u0430\u0442\u0438\u0443\u0441 \u0438 \u0421\u0430\u0431\u0430","BA":"\u0411\u043e\u0441\u043d\u0438\u044f \u0438 \u0413\u0435\u0440\u0446\u0435\u0433\u043e\u0432\u0438\u043d\u0430","BW":"\u0411\u043e\u0442\u0441\u0432\u0430\u043d\u0430","BR":"\u0411\u0440\u0430\u0437\u0438\u043b\u0438\u044f","IO":"\u0411\u0440\u0438\u0442\u0430\u043d\u0441\u043a\u0430\u044f \u0442\u0435\u0440\u0440\u0438\u0442\u043e\u0440\u0438\u044f \u0432 \u0418\u043d\u0434\u0438\u0439\u0441\u043a\u043e\u043c \u043e\u043a\u0435\u0430\u043d\u0435","BN":"\u0411\u0440\u0443\u043d\u0435\u0439-\u0414\u0430\u0440\u0443\u0441\u0441\u0430\u043b\u0430\u043c","BF":"\u0411\u0443\u0440\u043a\u0438\u043d\u0430-\u0424\u0430\u0441\u043e","BI":"\u0411\u0443\u0440\u0443\u043d\u0434\u0438","BT":"\u0411\u0443\u0442\u0430\u043d","VU":"\u0412\u0430\u043d\u0443\u0430\u0442\u0443","VA":"\u0412\u0430\u0442\u0438\u043a\u0430\u043d","GB":"\u0412\u0435\u043b\u0438\u043a\u043e\u0431\u0440\u0438\u0442\u0430\u043d\u0438\u044f","HU":"\u0412\u0435\u043d\u0433\u0440\u0438\u044f","VE":"\u0412\u0435\u043d\u0435\u0441\u0443\u044d\u043b\u0430","VG":"\u0412\u0438\u0440\u0433\u0438\u043d\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430 (\u0411\u0440\u0438\u0442\u0430\u043d\u0441\u043a\u0438\u0435)","VI":"\u0412\u0438\u0440\u0433\u0438\u043d\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430 (\u0421\u0428\u0410)","UM":"\u0412\u043d\u0435\u0448\u043d\u0438\u0435 \u043c\u0430\u043b\u044b\u0435 \u043e-\u0432\u0430 (\u0421\u0428\u0410)","TL":"\u0412\u043e\u0441\u0442\u043e\u0447\u043d\u044b\u0439 \u0422\u0438\u043c\u043e\u0440","VN":"\u0412\u044c\u0435\u0442\u043d\u0430\u043c","GA":"\u0413\u0430\u0431\u043e\u043d","HT":"\u0413\u0430\u0438\u0442\u0438","GY":"\u0413\u0430\u0439\u0430\u043d\u0430","GM":"\u0413\u0430\u043c\u0431\u0438\u044f","GH":"\u0413\u0430\u043d\u0430","GP":"\u0413\u0432\u0430\u0434\u0435\u043b\u0443\u043f\u0430","GT":"\u0413\u0432\u0430\u0442\u0435\u043c\u0430\u043b\u0430","GN":"\u0413\u0432\u0438\u043d\u0435\u044f","GW":"\u0413\u0432\u0438\u043d\u0435\u044f-\u0411\u0438\u0441\u0430\u0443","DE":"\u0413\u0435\u0440\u043c\u0430\u043d\u0438\u044f","GG":"\u0413\u0435\u0440\u043d\u0441\u0438","GI":"\u0413\u0438\u0431\u0440\u0430\u043b\u0442\u0430\u0440","HN":"\u0413\u043e\u043d\u0434\u0443\u0440\u0430\u0441","HK":"\u0413\u043e\u043d\u043a\u043e\u043d\u0433 (\u0441\u043f\u0435\u0446\u0438\u0430\u043b\u044c\u043d\u044b\u0439 \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u0438\u0432\u043d\u044b\u0439 \u0440\u0430\u0439\u043e\u043d)","GD":"\u0413\u0440\u0435\u043d\u0430\u0434\u0430","GL":"\u0413\u0440\u0435\u043d\u043b\u0430\u043d\u0434\u0438\u044f","GR":"\u0413\u0440\u0435\u0446\u0438\u044f","GE":"\u0413\u0440\u0443\u0437\u0438\u044f","GU":"\u0413\u0443\u0430\u043c","DK":"\u0414\u0430\u043d\u0438\u044f","JE":"\u0414\u0436\u0435\u0440\u0441\u0438","DJ":"\u0414\u0436\u0438\u0431\u0443\u0442\u0438","DG":"\u0414\u0438\u0435\u0433\u043e-\u0413\u0430\u0440\u0441\u0438\u044f","DM":"\u0414\u043e\u043c\u0438\u043d\u0438\u043a\u0430","DO":"\u0414\u043e\u043c\u0438\u043d\u0438\u043a\u0430\u043d\u0441\u043a\u0430\u044f \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430","EG":"\u0415\u0433\u0438\u043f\u0435\u0442","ZM":"\u0417\u0430\u043c\u0431\u0438\u044f","EH":"\u0417\u0430\u043f\u0430\u0434\u043d\u0430\u044f \u0421\u0430\u0445\u0430\u0440\u0430","ZW":"\u0417\u0438\u043c\u0431\u0430\u0431\u0432\u0435","IL":"\u0418\u0437\u0440\u0430\u0438\u043b\u044c","IN":"\u0418\u043d\u0434\u0438\u044f","ID":"\u0418\u043d\u0434\u043e\u043d\u0435\u0437\u0438\u044f","JO":"\u0418\u043e\u0440\u0434\u0430\u043d\u0438\u044f","IQ":"\u0418\u0440\u0430\u043a","IR":"\u0418\u0440\u0430\u043d","IE":"\u0418\u0440\u043b\u0430\u043d\u0434\u0438\u044f","IS":"\u0418\u0441\u043b\u0430\u043d\u0434\u0438\u044f","ES":"\u0418\u0441\u043f\u0430\u043d\u0438\u044f","IT":"\u0418\u0442\u0430\u043b\u0438\u044f","YE":"\u0419\u0435\u043c\u0435\u043d","CV":"\u041a\u0430\u0431\u043e-\u0412\u0435\u0440\u0434\u0435","KZ":"\u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d","KY":"\u041a\u0430\u0439\u043c\u0430\u043d\u043e\u0432\u044b \u043e-\u0432\u0430","KH":"\u041a\u0430\u043c\u0431\u043e\u0434\u0436\u0430","CM":"\u041a\u0430\u043c\u0435\u0440\u0443\u043d","CA":"\u041a\u0430\u043d\u0430\u0434\u0430","IC":"\u041a\u0430\u043d\u0430\u0440\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430","QA":"\u041a\u0430\u0442\u0430\u0440","KE":"\u041a\u0435\u043d\u0438\u044f","CY":"\u041a\u0438\u043f\u0440","KG":"\u041a\u0438\u0440\u0433\u0438\u0437\u0438\u044f","KI":"\u041a\u0438\u0440\u0438\u0431\u0430\u0442\u0438","CN":"\u041a\u0438\u0442\u0430\u0439","KP":"\u041a\u041d\u0414\u0420","CC":"\u041a\u043e\u043a\u043e\u0441\u043e\u0432\u044b\u0435 \u043e-\u0432\u0430","CO":"\u041a\u043e\u043b\u0443\u043c\u0431\u0438\u044f","KM":"\u041a\u043e\u043c\u043e\u0440\u044b","CG":"\u041a\u043e\u043d\u0433\u043e - \u0411\u0440\u0430\u0437\u0437\u0430\u0432\u0438\u043b\u044c","CD":"\u041a\u043e\u043d\u0433\u043e - \u041a\u0438\u043d\u0448\u0430\u0441\u0430","XK":"\u041a\u043e\u0441\u043e\u0432\u043e","CR":"\u041a\u043e\u0441\u0442\u0430-\u0420\u0438\u043a\u0430","CI":"\u041a\u043e\u0442-\u0434\u2019\u0418\u0432\u0443\u0430\u0440","CU":"\u041a\u0443\u0431\u0430","KW":"\u041a\u0443\u0432\u0435\u0439\u0442","CW":"\u041a\u044e\u0440\u0430\u0441\u0430\u043e","LA":"\u041b\u0430\u043e\u0441","LV":"\u041b\u0430\u0442\u0432\u0438\u044f","LS":"\u041b\u0435\u0441\u043e\u0442\u043e","LR":"\u041b\u0438\u0431\u0435\u0440\u0438\u044f","LB":"\u041b\u0438\u0432\u0430\u043d","LY":"\u041b\u0438\u0432\u0438\u044f","LT":"\u041b\u0438\u0442\u0432\u0430","LI":"\u041b\u0438\u0445\u0442\u0435\u043d\u0448\u0442\u0435\u0439\u043d","LU":"\u041b\u044e\u043a\u0441\u0435\u043c\u0431\u0443\u0440\u0433","MU":"\u041c\u0430\u0432\u0440\u0438\u043a\u0438\u0439","MR":"\u041c\u0430\u0432\u0440\u0438\u0442\u0430\u043d\u0438\u044f","MG":"\u041c\u0430\u0434\u0430\u0433\u0430\u0441\u043a\u0430\u0440","YT":"\u041c\u0430\u0439\u043e\u0442\u0442\u0430","MO":"\u041c\u0430\u043a\u0430\u043e (\u0441\u043f\u0435\u0446\u0438\u0430\u043b\u044c\u043d\u044b\u0439 \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u0438\u0432\u043d\u044b\u0439 \u0440\u0430\u0439\u043e\u043d)","MK":"\u041c\u0430\u043a\u0435\u0434\u043e\u043d\u0438\u044f","MW":"\u041c\u0430\u043b\u0430\u0432\u0438","MY":"\u041c\u0430\u043b\u0430\u0439\u0437\u0438\u044f","ML":"\u041c\u0430\u043b\u0438","MV":"\u041c\u0430\u043b\u044c\u0434\u0438\u0432\u044b","MT":"\u041c\u0430\u043b\u044c\u0442\u0430","MA":"\u041c\u0430\u0440\u043e\u043a\u043a\u043e","MQ":"\u041c\u0430\u0440\u0442\u0438\u043d\u0438\u043a\u0430","MH":"\u041c\u0430\u0440\u0448\u0430\u043b\u043b\u043e\u0432\u044b \u041e\u0441\u0442\u0440\u043e\u0432\u0430","MX":"\u041c\u0435\u043a\u0441\u0438\u043a\u0430","MZ":"\u041c\u043e\u0437\u0430\u043c\u0431\u0438\u043a","MD":"\u041c\u043e\u043b\u0434\u043e\u0432\u0430","MC":"\u041c\u043e\u043d\u0430\u043a\u043e","MN":"\u041c\u043e\u043d\u0433\u043e\u043b\u0438\u044f","MS":"\u041c\u043e\u043d\u0442\u0441\u0435\u0440\u0440\u0430\u0442","MM":"\u041c\u044c\u044f\u043d\u043c\u0430 (\u0411\u0438\u0440\u043c\u0430)","NA":"\u041d\u0430\u043c\u0438\u0431\u0438\u044f","NR":"\u041d\u0430\u0443\u0440\u0443","NP":"\u041d\u0435\u043f\u0430\u043b","NE":"\u041d\u0438\u0433\u0435\u0440","NG":"\u041d\u0438\u0433\u0435\u0440\u0438\u044f","NL":"\u041d\u0438\u0434\u0435\u0440\u043b\u0430\u043d\u0434\u044b","NI":"\u041d\u0438\u043a\u0430\u0440\u0430\u0433\u0443\u0430","NU":"\u041d\u0438\u0443\u044d","NZ":"\u041d\u043e\u0432\u0430\u044f \u0417\u0435\u043b\u0430\u043d\u0434\u0438\u044f","NC":"\u041d\u043e\u0432\u0430\u044f \u041a\u0430\u043b\u0435\u0434\u043e\u043d\u0438\u044f","NO":"\u041d\u043e\u0440\u0432\u0435\u0433\u0438\u044f","AC":"\u043e-\u0432 \u0412\u043e\u0437\u043d\u0435\u0441\u0435\u043d\u0438\u044f","IM":"\u043e-\u0432 \u041c\u044d\u043d","NF":"\u043e-\u0432 \u041d\u043e\u0440\u0444\u043e\u043b\u043a","CX":"\u043e-\u0432 \u0420\u043e\u0436\u0434\u0435\u0441\u0442\u0432\u0430","SH":"\u043e-\u0432 \u0421\u0432. \u0415\u043b\u0435\u043d\u044b","TC":"\u043e-\u0432\u0430 \u0422\u0451\u0440\u043a\u0441 \u0438 \u041a\u0430\u0439\u043a\u043e\u0441","AE":"\u041e\u0410\u042d","OM":"\u041e\u043c\u0430\u043d","CK":"\u041e\u0441\u0442\u0440\u043e\u0432\u0430 \u041a\u0443\u043a\u0430","PN":"\u043e\u0441\u0442\u0440\u043e\u0432\u0430 \u041f\u0438\u0442\u043a\u044d\u0440\u043d","PK":"\u041f\u0430\u043a\u0438\u0441\u0442\u0430\u043d","PW":"\u041f\u0430\u043b\u0430\u0443","PS":"\u041f\u0430\u043b\u0435\u0441\u0442\u0438\u043d\u0441\u043a\u0438\u0435 \u0442\u0435\u0440\u0440\u0438\u0442\u043e\u0440\u0438\u0438","PA":"\u041f\u0430\u043d\u0430\u043c\u0430","PG":"\u041f\u0430\u043f\u0443\u0430 \u2013 \u041d\u043e\u0432\u0430\u044f \u0413\u0432\u0438\u043d\u0435\u044f","PY":"\u041f\u0430\u0440\u0430\u0433\u0432\u0430\u0439","PE":"\u041f\u0435\u0440\u0443","PL":"\u041f\u043e\u043b\u044c\u0448\u0430","PT":"\u041f\u043e\u0440\u0442\u0443\u0433\u0430\u043b\u0438\u044f","PR":"\u041f\u0443\u044d\u0440\u0442\u043e-\u0420\u0438\u043a\u043e","KR":"\u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u041a\u043e\u0440\u0435\u044f","RE":"\u0420\u0435\u044e\u043d\u044c\u043e\u043d","RU":"\u0420\u043e\u0441\u0441\u0438\u044f","RW":"\u0420\u0443\u0430\u043d\u0434\u0430","RO":"\u0420\u0443\u043c\u044b\u043d\u0438\u044f","SV":"\u0421\u0430\u043b\u044c\u0432\u0430\u0434\u043e\u0440","WS":"\u0421\u0430\u043c\u043e\u0430","SM":"\u0421\u0430\u043d-\u041c\u0430\u0440\u0438\u043d\u043e","ST":"\u0421\u0430\u043d-\u0422\u043e\u043c\u0435 \u0438 \u041f\u0440\u0438\u043d\u0441\u0438\u043f\u0438","SA":"\u0421\u0430\u0443\u0434\u043e\u0432\u0441\u043a\u0430\u044f \u0410\u0440\u0430\u0432\u0438\u044f","SZ":"\u0421\u0432\u0430\u0437\u0438\u043b\u0435\u043d\u0434","MP":"\u0421\u0435\u0432\u0435\u0440\u043d\u044b\u0435 \u041c\u0430\u0440\u0438\u0430\u043d\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430","SC":"\u0421\u0435\u0439\u0448\u0435\u043b\u044c\u0441\u043a\u0438\u0435 \u041e\u0441\u0442\u0440\u043e\u0432\u0430","BL":"\u0421\u0435\u043d-\u0411\u0430\u0440\u0442\u0435\u043b\u0435\u043c\u0438","MF":"\u0421\u0435\u043d-\u041c\u0430\u0440\u0442\u0435\u043d","PM":"\u0421\u0435\u043d-\u041f\u044c\u0435\u0440 \u0438 \u041c\u0438\u043a\u0435\u043b\u043e\u043d","SN":"\u0421\u0435\u043d\u0435\u0433\u0430\u043b","VC":"\u0421\u0435\u043d\u0442-\u0412\u0438\u043d\u0441\u0435\u043d\u0442 \u0438 \u0413\u0440\u0435\u043d\u0430\u0434\u0438\u043d\u044b","KN":"\u0421\u0435\u043d\u0442-\u041a\u0438\u0442\u0441 \u0438 \u041d\u0435\u0432\u0438\u0441","LC":"\u0421\u0435\u043d\u0442-\u041b\u044e\u0441\u0438\u044f","RS":"\u0421\u0435\u0440\u0431\u0438\u044f","EA":"\u0421\u0435\u0443\u0442\u0430 \u0438 \u041c\u0435\u043b\u0438\u043b\u044c\u044f","SG":"\u0421\u0438\u043d\u0433\u0430\u043f\u0443\u0440","SX":"\u0421\u0438\u043d\u0442-\u041c\u0430\u0440\u0442\u0435\u043d","SY":"\u0421\u0438\u0440\u0438\u044f","SK":"\u0421\u043b\u043e\u0432\u0430\u043a\u0438\u044f","SI":"\u0421\u043b\u043e\u0432\u0435\u043d\u0438\u044f","US":"\u0421\u043e\u0435\u0434\u0438\u043d\u0435\u043d\u043d\u044b\u0435 \u0428\u0442\u0430\u0442\u044b","SB":"\u0421\u043e\u043b\u043e\u043c\u043e\u043d\u043e\u0432\u044b \u041e\u0441\u0442\u0440\u043e\u0432\u0430","SO":"\u0421\u043e\u043c\u0430\u043b\u0438","SD":"\u0421\u0443\u0434\u0430\u043d","SR":"\u0421\u0443\u0440\u0438\u043d\u0430\u043c","SL":"\u0421\u044c\u0435\u0440\u0440\u0430-\u041b\u0435\u043e\u043d\u0435","TJ":"\u0422\u0430\u0434\u0436\u0438\u043a\u0438\u0441\u0442\u0430\u043d","TH":"\u0422\u0430\u0438\u043b\u0430\u043d\u0434","TW":"\u0422\u0430\u0439\u0432\u0430\u043d\u044c","TZ":"\u0422\u0430\u043d\u0437\u0430\u043d\u0438\u044f","TG":"\u0422\u043e\u0433\u043e","TK":"\u0422\u043e\u043a\u0435\u043b\u0430\u0443","TO":"\u0422\u043e\u043d\u0433\u0430","TT":"\u0422\u0440\u0438\u043d\u0438\u0434\u0430\u0434 \u0438 \u0422\u043e\u0431\u0430\u0433\u043e","TA":"\u0422\u0440\u0438\u0441\u0442\u0430\u043d-\u0434\u0430-\u041a\u0443\u043d\u044c\u044f","TV":"\u0422\u0443\u0432\u0430\u043b\u0443","TN":"\u0422\u0443\u043d\u0438\u0441","TM":"\u0422\u0443\u0440\u043a\u043c\u0435\u043d\u0438\u0441\u0442\u0430\u043d","TR":"\u0422\u0443\u0440\u0446\u0438\u044f","UG":"\u0423\u0433\u0430\u043d\u0434\u0430","UZ":"\u0423\u0437\u0431\u0435\u043a\u0438\u0441\u0442\u0430\u043d","UA":"\u0423\u043a\u0440\u0430\u0438\u043d\u0430","WF":"\u0423\u043e\u043b\u043b\u0438\u0441 \u0438 \u0424\u0443\u0442\u0443\u043d\u0430","UY":"\u0423\u0440\u0443\u0433\u0432\u0430\u0439","FO":"\u0424\u0430\u0440\u0435\u0440\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430","FM":"\u0424\u0435\u0434\u0435\u0440\u0430\u0442\u0438\u0432\u043d\u044b\u0435 \u0428\u0442\u0430\u0442\u044b \u041c\u0438\u043a\u0440\u043e\u043d\u0435\u0437\u0438\u0438","FJ":"\u0424\u0438\u0434\u0436\u0438","PH":"\u0424\u0438\u043b\u0438\u043f\u043f\u0438\u043d\u044b","FI":"\u0424\u0438\u043d\u043b\u044f\u043d\u0434\u0438\u044f","FK":"\u0424\u043e\u043b\u043a\u043b\u0435\u043d\u0434\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430","FR":"\u0424\u0440\u0430\u043d\u0446\u0438\u044f","GF":"\u0424\u0440\u0430\u043d\u0446\u0443\u0437\u0441\u043a\u0430\u044f \u0413\u0432\u0438\u0430\u043d\u0430","PF":"\u0424\u0440\u0430\u043d\u0446\u0443\u0437\u0441\u043a\u0430\u044f \u041f\u043e\u043b\u0438\u043d\u0435\u0437\u0438\u044f","TF":"\u0424\u0440\u0430\u043d\u0446\u0443\u0437\u0441\u043a\u0438\u0435 \u042e\u0436\u043d\u044b\u0435 \u0442\u0435\u0440\u0440\u0438\u0442\u043e\u0440\u0438\u0438","HR":"\u0425\u043e\u0440\u0432\u0430\u0442\u0438\u044f","CF":"\u0426\u0410\u0420","TD":"\u0427\u0430\u0434","ME":"\u0427\u0435\u0440\u043d\u043e\u0433\u043e\u0440\u0438\u044f","CZ":"\u0427\u0435\u0445\u0438\u044f","CL":"\u0427\u0438\u043b\u0438","CH":"\u0428\u0432\u0435\u0439\u0446\u0430\u0440\u0438\u044f","SE":"\u0428\u0432\u0435\u0446\u0438\u044f","SJ":"\u0428\u043f\u0438\u0446\u0431\u0435\u0440\u0433\u0435\u043d \u0438 \u042f\u043d-\u041c\u0430\u0439\u0435\u043d","LK":"\u0428\u0440\u0438-\u041b\u0430\u043d\u043a\u0430","EC":"\u042d\u043a\u0432\u0430\u0434\u043e\u0440","GQ":"\u042d\u043a\u0432\u0430\u0442\u043e\u0440\u0438\u0430\u043b\u044c\u043d\u0430\u044f \u0413\u0432\u0438\u043d\u0435\u044f","ER":"\u042d\u0440\u0438\u0442\u0440\u0435\u044f","EE":"\u042d\u0441\u0442\u043e\u043d\u0438\u044f","ET":"\u042d\u0444\u0438\u043e\u043f\u0438\u044f","ZA":"\u042e\u0410\u0420","GS":"\u042e\u0436\u043d\u0430\u044f \u0413\u0435\u043e\u0440\u0433\u0438\u044f \u0438 \u042e\u0436\u043d\u044b\u0435 \u0421\u0430\u043d\u0434\u0432\u0438\u0447\u0435\u0432\u044b \u043e-\u0432\u0430","SS":"\u042e\u0436\u043d\u044b\u0439 \u0421\u0443\u0434\u0430\u043d","JM":"\u042f\u043c\u0430\u0439\u043a\u0430","JP":"\u042f\u043f\u043e\u043d\u0438\u044f"}
        };

        return countries[lang];
    };

    service.dynamicTableLoading = function (total, page, count, getDataFunction) {
        let rocketElement = document.getElementById('scrollup');
        let pagesPerOneLoad = count,
            currentPage = page,
            pagesCount = Math.ceil(total/pagesPerOneLoad);
                if(currentPage < pagesCount - 1) {
                    $rootScope.loading = true;
                    currentPage++;
                    updateData(currentPage);
                }

        function updateData(pageNext) {
            if(getDataFunction) {
                if(rocketElement) {
                    moveUpFunc();
                }
                getDataFunction(pageNext, pagesPerOneLoad);
            }
        }
        function moveUpFunc(){
            let scrollUp = rocketElement; // найти элемент
            scrollUp.style.display = 'block';
            scrollUp.style.position = 'fixed';
            scrollUp.style.bottom = '20px';
            scrollUp.style.left = '0px';
            scrollUp.onmouseover = function() { // добавить прозрачность
                scrollUp.style.opacity=0.3;
                scrollUp.style.filter  = 'alpha(opacity=30)';
            };

            scrollUp.onmouseout = function() { //убрать прозрачность
                scrollUp.style.opacity = 0.5;
                scrollUp.style.filter  = 'alpha(opacity=50)';
            };

            scrollUp.onclick = function() { //обработка клика
                window.scrollTo(0,0);
            };
        }
    };

    service.cookiesConsent = function() {
        var bodyElement = $("body");
        var translatedText = setTranslates();

        if(getCookie("consentCookies") !== "yes") {
            appendCockiesBlock();
        }


        function getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }


        function appendCockiesBlock() {
            var cookieElementText = "<div class='cookie-wrapper' id='cookie-block'>" +
                "<span class='inner-text'>" +
                "<span class='first-sentence'>" +
                "<span>" + translatedText.bestExp +  "</span>" +
                "</span>" +
                "<span class='second-sentence'>" +
                "<span>" + translatedText.findMore +  "</span>" +
                "<a href='https://cleverstaff.net/privacy.html' target='_blank'>" + translatedText.findMoreLink +  "</a>" +
                "</span>" +
                "</span>" +
                "</div>";
            var closeIconElement = $("<i class='close-icon'>" +
                "<svg aria-hidden=\"true\" data-prefix=\"far\" data-icon=\"times\" role=\"img\" width=\"12px\" height=\"12px\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 384 512\" class=\"svg-inline--fa fa-times fa-w-12 fa-2x\"><path fill=\"currentColor\" d=\"M231.6 256l130.1-130.1c4.7-4.7 4.7-12.3 0-17l-22.6-22.6c-4.7-4.7-12.3-4.7-17 0L192 216.4 61.9 86.3c-4.7-4.7-12.3-4.7-17 0l-22.6 22.6c-4.7 4.7-4.7 12.3 0 17L152.4 256 22.3 386.1c-4.7 4.7-4.7 12.3 0 17l22.6 22.6c4.7 4.7 12.3 4.7 17 0L192 295.6l130.1 130.1c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17L231.6 256z\" class=\"\"></path></svg>" +
                "</i>");
            closeIconElement.on("click", function() {
                console.log("click close");
                cookieElement.remove();
            });
            var cookieElement = $(cookieElementText);
            var agreeButtonElement = $("<button>" + translatedText.iAgree + "</button>");
            agreeButtonElement.on("click", function () {
                setCookies("consentCookies", "yes");
                cookieElement.remove();
            });
            cookieElement.append(closeIconElement);
            cookieElement.find(".first-sentence").append(agreeButtonElement);
            bodyElement.append(cookieElement);
        }


        function setTranslates() {
            var textsEn = {
                iAgree: "I agree",
                bestExp: "To give you the best possible experience, this site uses cookies. If you agree with cookie usage, press ",
                findMore: "Should you want to find out more about our cookie policy - press ",
                findMoreLink: "read more"
            };
            var textsRu = {
                iAgree: "Согласен",
                bestExp: "Чтобы предоставить вам наилучший опыт, на этом сайте используются cookie. Если вы согласны с использованием cookie, нажмите кнопку ",
                findMore: "Если вы хотите ознакомиться с  нашей политикой cookie, нажмите ",
                findMoreLink: "узнать больше"
            };
            if($rootScope.currentLang == 'ru'){
                return textsRu;
            } else {
                return textsEn;
            }
        }

        function setCookies(key, value) {
            document.cookie = key + "=" + value;
        }
    };

    return service;
}]);
