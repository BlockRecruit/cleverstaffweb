angular.module('services.vacancy', [
    'ngResource'
]).factory('Vacancy', ['$resource', 'serverAddress','$rootScope','$q', '$http', function($resource, serverAddress, $rootScope, $q, $http) {
    var options;
    var vacancy = $resource(serverAddress + '/vacancy/:param', {param: "@param"}, {
        all: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                param: "get"
            }
        },
        add: {
            method: "PUT",
            params: {
                param: "add"
            }
        },
        setInterviewStatus: {
            method: "POST",
            params: {
                param: "setInterviewStatus"
            }
        },
        edit: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                param: "edit"
            }
        },
        one: {
            method: "GET",
            params: {
                param: "get"
            }
        },
        editInterview: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                param: "changeInterview"
            }
        },
        editInterviews: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                param: "changeInterviews"
            }
        },
        addInterview: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                param: "setInterview"
            }
        },
        addResponsible: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                param: "setResponsible"
            }
        },
        removeResponsible: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                param: "removeResponsible"
            }
        },
        changeState: {
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            method: "POST",
            params: {
                param: "changeState"
            }
        },
        addFile: {
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            method: "POST",
            params: {
                param: "addFile"
            }
        },
        removeFile: {
            method: "GET",
            params: {
                param: "removeFile"
            }
        },
        recalls: {
            method: "GET",
            params: {
                param: "recalls"
            }
        },
        oneRecall: {
            method: "GET",
            params: {
                param: "recall"
            }
        },
        getEvents: {
            method: "POST",
            params: {
                param: "getEvents"
            }
        },
        recallRewieved: {
            method: "GET",
            params: {
                param: "recallRewieved"
            }
        },
        setMessage: {
            method: "POST",
            params: {
                param: "setMessage"
            }
        },
        addFileFromCache: {
            method: "GET",
            params: {
                param: "addFile"
            }
        },
        addPublish: {
            method: "GET",
            params: {
                param: "addPublish"
            }
        },
        deletePublish: {
            method: "GET",
            params: {
                param: "deletePublish"
            }
        },
        getAdvices: {
            method: "GET",
            params: {
                param: "getAdvices"
            }
        },
        changeInterviewDate: {
            method: "POST",
            params: {
                param: "changeInterviewDate"
            }
        },
        sendInterviewCreateMail: {
            method: "POST",
            params: {
                param: "sendInterviewCreateMail"
            }
        },
        sendInterviewUpdateMail: {
            method: "POST",
            params: {
                param: "sendInterviewUpdateMail"
            }
        },
        getVacancyExampleForLogoDemo: {
            method: "GET",
            params: {
                param: "getVacancyExampleForLogoDemo"
            }
        },
        removeInterview: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                param: "removeInterview"
            }
        },
        setMessageToCandidate: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                param: "messageInterview"
            }
        },
        changeInterviewEmployeeDetail: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                param: "changeInterviewEmployeeDetail"
            }
        },
        getWithLastAction: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                param: "getWithLastAction"
            }
        },
        getCandidatesInStages: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                param: "interview/get"
            }
        },
        getCounts: {
            method: "GET",
            params: {
                param: "interview/getCounts"
            }
        },
        setInterviewList: {
            method: "POST",
            params: {
                param: "setInterviewList"
            }
        },
        hideState:{
            method:"GET",
            params:{
                param:'hideState'
            }
        },
        openHideState:{
            method:"GET",
            params:{
                param:'openHideState'
            }
        },
        getVacanciesForReport:{
            method:"POST",
            params:{
                param:'getVacanciesForReport'
            }
        },
        changeVacanciesForCandidatesAccess :{
            method:"POST",
            params:{
                param:'changeVacanciesForCandidatesAccess'
            }
        },
        saveImg:{
            method:"POST",
            params:{
                param:'saveImg'
            }
        },
        removeImg:{
            method:"POST",
            params:{
                param:'removeImg'
            }
        }
    });

    vacancy.requestHideState = function (params){
        $rootScope.loading = true;

        return new Promise((resolve, reject) => {
            vacancy.hideState(params, resp => resolve(resp),error => reject(error));
        });
    };

    vacancy.requestOpenHideState = function (params){
        $rootScope.loading = true;

        return new Promise((resolve, reject) => {
            vacancy.openHideState(params, resp => resolve(resp),error => reject(error));
        });
    };

    vacancy.requestChangeVacanciesForCandidatesAccess =  (access, vacancyId) => vacancy.changeVacanciesForCandidatesAccess({vacancyId,vacanciesForCandidatesAccess:(access)?"privateAccess":"publicAccess"}, resp => console.log(resp));

    vacancy.interviewStatusNew = function() {
        return [
            {
                vacancyType: "simpleVacancy",
                used: true,
                status: [
                    {
                        value: "longlist",
                        forHistory: false,
                        withDate: false,
                        defaultS: true,
                        single: false,
                        added: true,
                        active_color: "longlist_color",
                        count: 0,
                        forAdd: true,
                        googleCalendarPrefix:"",
                        movable: false
                    },
                    {
                        value: "shortlist",
                        forHistory: false,
                        withDate: false,
                        defaultS: false,
                        single: false,
                        added: true,
                        active_color: "shortlist_color",
                        count: 0,
                        forAdd: true,
                        movable: true
                    },
                    {
                        value: "test_task",
                        forHistory: true,
                        withDate: false,
                        defaultS: false,
                        single: true,
                        added: false,
                        count: 0,
                        forAdd: false,
                        movable: true
                    },

                    {
                        value: "interview",
                        forHistory: true,
                        withDate: true,
                        defaultS: false,
                        single: true,
                        added: true,
                        active_color: "interview_color",
                        count: 0,
                        forAdd: true,
                        movable: true
                    },
                    {
                        value: "interview_with_the_boss",
                        forHistory: true,
                        withDate: true,
                        single: false,
                        defaultS: false,
                        added: false,
                        count: 0,
                        forAdd: false,
                        movable: true
                    },

                    {
                        value: "security_check",
                        forHistory: true,
                        withDate: false,
                        defaultS: false,
                        single: false,
                        added: false,
                        count: 0,
                        forAdd: false,
                        movable: true
                    },
                    {
                        value: "tech_screen",
                        forHistory: true,
                        withDate: false,
                        defaultS: false,
                        added: false,
                        single: true,
                        isEnclosed: true,
                        count: 0,
                        forAdd: false,
                        movable: true
                    },
                    {
                        value: "hr_interview",
                        forHistory: true,
                        withDate: true,
                        defaultS: false,
                        added: false,
                        single: true,
                        active_color: "interview_color",
                        count: 0,
                        forAdd: false,
                        movable: true
                    },
                    {
                        value: "tech_interview",
                        forHistory: true,
                        withDate: true,
                        defaultS: false,
                        added: false,
                        single: true,
                        active_color: "interview_color",
                        count: 0,
                        forAdd: false,
                        movable: true
                    },
                    {
                        value: "interview_with_the_client",
                        forHistory: true,
                        withDate: true,
                        defaultS: false,
                        single: true,
                        added: false,
                        isEnclosed: true,
                        count: 0,
                        forAdd: false,
                        movable: true
                    },
                    {
                        value: "sent_offer",
                        forHistory: true,
                        withDate: false,
                        defaultS: false,
                        added: false,
                        single: true,
                        active_color: "interview_color",
                        count: 0,
                        forAdd: false,
                        movable: true
                    },
                    {
                        value: "accept_offer",
                        forHistory: true,
                        withDate: false,
                        defaultS: false,
                        added: false,
                        single: true,
                        active_color: "interview_color",
                        count: 0,
                        forAdd: false,
                        movable: true
                    },

                    {
                        value: "approved",
                        forHistory: false,
                        withDate: false,
                        defaultS: true,
                        single: false,
                        added: true,
                        active_color: "approved_color",
                        count: 0,
                        forAdd: false,
                        movable: false
                    },
                    {
                        value: "notafit",
                        forHistory: false,
                        withDate: false,
                        defaultS: false,
                        single: false,
                        added: true,
                        active_color: "notafit_color",
                        count: 0,
                        forAdd: false,
                        movable: false,
                        type: 'refuse'
                    },
                    {
                        value: "declinedoffer",
                        forHistory: false,
                        withDate: false,
                        defaultS: false,
                        single: false,
                        added: true,
                        active_color: "declinedoffer_color",
                        count: 0,
                        forAdd: false,
                        movable: false,
                        type: 'refuse'
                    },
                    {
                        value: "no_response",
                        forHistory: false,
                        withDate: false,
                        defaultS: false,
                        added: true,
                        single: false,
                        active_color: "no_response_color",
                        count: 0,
                        forAdd: true,
                        movable: false,
                        type: 'refuse'
                    },
                    {
                        value: "no_contacts",
                        forHistory: true,
                        withDate: false,
                        defaultS: false,
                        added: false,
                        single: true,
                        isEnclosed: true,
                        count: 0,
                        forAdd: false,
                        movable: false,
                        type: 'refuse'
                    },
                    {
                        value: "is_not_looking_for_job",
                        forHistory: true,
                        withDate: false,
                        defaultS: false,
                        added: false,
                        single: true,
                        isEnclosed: true,
                        count: 0,
                        forAdd: false,
                        movable: false,
                        type: 'refuse'
                    },
                    {
                        value: "accepted_counter_offer",
                        forHistory: true,
                        withDate: false,
                        defaultS: false,
                        added: false,
                        single: true,
                        isEnclosed: true,
                        count: 0,
                        forAdd: false,
                        movable: false,
                        type: 'refuse'
                    },
                    {
                        value: "found_another_job",
                        forHistory: true,
                        withDate: false,
                        defaultS: false,
                        added: false,
                        single: true,
                        isEnclosed: true,
                        count: 0,
                        forAdd: false,
                        movable: false,
                        type: 'refuse'
                    }
                ]
            },
            //{
            //    vacancyType: "itVacancy",
            //    used: false,
            //    status: [
            //        {
            //            value: "longlist",
            //            forHistory: false,
            //            withDate: false,
            //            defaultS: true,
            //            added: true,
            //            single: false,
            //            useAnimation: false,
            //            active_color: "longlist_color",
            //            count: 0,
            //            forAdd: true,
            //            movable: false
            //        },
            //        {
            //            value: "shortlist",
            //            forHistory: false,
            //            withDate: false,
            //            defaultS: true,
            //            added: true,
            //            single: false,
            //            useAnimation: false,
            //            active_color: "shortlist_color",
            //            count: 0,
            //            forAdd: true,
            //            movable: true
            //        },
            //        {
            //            value: "tech_screen",
            //            forHistory: true,
            //            withDate: false,
            //            defaultS: false,
            //            added: false,
            //            single: true,
            //            useAnimation: false,
            //            isEnclosed: true,
            //            count: 0,
            //            forAdd: false,
            //            movable: true
            //        },
            //        {
            //            value: "test_task",
            //            forHistory: true,
            //            withDate: false,
            //            defaultS: false,
            //            added: false,
            //            single: true,
            //            useAnimation: false,
            //            isEnclosed: true,
            //            count: 0,
            //            forAdd: false,
            //            movable: true
            //        },
            //        {
            //            value: "hr_interview",
            //            forHistory: true,
            //            withDate: true,
            //            defaultS: true,
            //            added: true,
            //            single: true,
            //            useAnimation: false,
            //            active_color: "interview_color",
            //            count: 0,
            //            forAdd: true,
            //            movable: true
            //        },
            //        {
            //            value: "tech_interview",
            //            forHistory: true,
            //            withDate: true,
            //            defaultS: false,
            //            added: false,
            //            single: true,
            //            useAnimation: false,
            //            active_color: "interview_color",
            //            count: 0,
            //            forAdd: false,
            //            movable: true
            //        },
            //        {
            //            value: "interview_with_the_client",
            //            forHistory: true,
            //            withDate: true,
            //            defaultS: false,
            //            single: true,
            //            added: false,
            //            useAnimation: false,
            //            isEnclosed: true,
            //            count: 0,
            //            forAdd: false,
            //            movable: true
            //        },
            //        {
            //            value: "sent_offer",
            //            forHistory: true,
            //            withDate: false,
            //            defaultS: false,
            //            added: false,
            //            single: true,
            //            useAnimation: false,
            //            active_color: "interview_color",
            //            count: 0,
            //            forAdd: false,
            //            movable: true
            //        },
            //        {
            //            value: "accept_offer",
            //            forHistory: true,
            //            withDate: false,
            //            defaultS: false,
            //            added: false,
            //            single: true,
            //            useAnimation: false,
            //            active_color: "interview_color",
            //            count: 0,
            //            forAdd: false,
            //            movable: true
            //        },
            //        {
            //            value: "approved",
            //            forHistory: false,
            //            withDate: false,
            //            defaultS: true,
            //            added: true,
            //            single: false,
            //            useAnimation: false,
            //            active_color: "approved_color",
            //            count: 0,
            //            forAdd: false,
            //            movable: false
            //        },
            //        {
            //            value: "notafit",
            //            withDate: false,
            //            defaultS: true,
            //            added: true,
            //            single: false,
            //            useAnimation: false,
            //            active_color: "notafit_color",
            //            count: 0,
            //            forAdd: false,
            //            movable: false
            //        },
            //        {
            //            value: "declinedoffer",
            //            withDate: false,
            //            defaultS: true,
            //            added: true,
            //            single: false,
            //            useAnimation: false,
            //            active_color: "declinedoffer_color",
            //            count: 0,
            //            forAdd: false,
            //            movable: false
            //        },
            //        {
            //            value: "no_response",
            //            forHistory: false,
            //            withDate: false,
            //            defaultS: true,
            //            added: true,
            //            single: false,
            //            useAnimation: false,
            //            active_color: "no_response_color",
            //            count: 0,
            //            forAdd: true,
            //            movable: false
            //        },
            //        {
            //            value: "no_contacts",
            //            forHistory: true,
            //            withDate: false,
            //            defaultS: false,
            //            added: false,
            //            single: true,
            //            useAnimation: false,
            //            active_color: "no_contacts",
            //            isEnclosed: true,
            //            count: 0,
            //            forAdd: false,
            //            movable: false
            //        }
            //    ]
            //}
        ]
    };
    vacancy.standardInterviewStatus = function(type) {
        var cand;
        if (type == 'simple_vacancy') {
            cand = [
                {value: "longlist", active_color: "longlist_color", name: "long_list"},
                {value: "shortlist", active_color: "shortlist_color", name: "short_list"},
                {value: "interview", active_color: "interview_color", name: "interview"},
                {value: "approved", active_color: "approved_color", name: "approved"},
                {value: "notafit", active_color: "notafit_color", name: "not_a_fit"},
                {value: "declinedoffer", active_color: "declinedoffer_color", name: "declined_offer"}
            ]
        } else if (type == 'it_vacancy') {
            cand = [
                {value: "longlist", active_color: "longlist_color", name: "long_list"},
                {value: "shortlist", active_color: "shortlist_color", name: "short_list"},
                {value: "tech_interview", active_color: "interview_color", name: "tech_interview"},
                {value: "hr_interview", active_color: "interview_color", name: "hr_interview"},
                {value: "job_offer", active_color: "interview_color", name: "job_offer"},
                {value: "approved", active_color: "approved_color", name: "approved"},
                {value: "notafit", active_color: "notafit_color", name: "not_a_fit"},
                {value: "declinedoffer", active_color: "declinedoffer_color", name: "declined_offer"}
            ]
        }
        return cand;

    };

    vacancy.languageLevelData = ['_undefined', 'Basic', 'Pre_Intermediate', 'Intermediate', 'Upper_Intermediate', 'Advanced', 'Native'];

    vacancy.getInterviewStatus = function() {
        return [
            {name: "Long list", value: "longlist"},
            {name: "Short list", value: "shortlist"},
            {name: "Interview", value: "interview"}
        ];
    };

    vacancy.getInterviewStatusFull = function() {
        return [
            {name: "Long list", value: "longlist"},
            {name: "Short list", value: "shortlist"},
            {name: "Interview", value: "interview"},
            {name: "notafit", value: "notafit"},
            {name: "declinedoffer", value: "declinedoffer"},
        ];
    };


    vacancy.status = function() {
        return [
            {value: "open", name: "open"},
            {value: "expects", name: "wait"},
            {value: "inwork", name: "in work"},
            {value: "payment", name: "payment"},
            {value: "completed", name: "completed"},
            {value: "replacement", name: "replacement"},
            {value: "canceled", name: "canceled"},
            {value: "deleted", name: "deleted"}
        ];
    };

    vacancy.getStatusAssociated = function() {
        return {
            "open": "open",
            "expects": "wait",
            "inwork": "in work",
            "payment": "payment",
            "completed": "completed",
            "canceled": "canceled",
            "deleted": "deleted"
        };
    };

    vacancy.searchOptions = function() {
        return options;
    };
    vacancy.setOptions = function(name, value) {
        options[name] = value;
    };

    vacancy.init = function() {
        options = {
            "state": null,
            "id": null,
            "creator": null,
            "regions": null,
            "org": null,
            "responsible": null,
            "city": null,
            "country": null,
            "personId": null,
            "ids": null,
            "page": {"number": 0, "count": 100},
            "words": null,
            "position": null,
            "clientId": null,
            "salaryFrom": null,
            "salaryTo": null
        };
    };
    vacancy.init();
    vacancy.getAllVacansies = (params) => $q((resolve, reject) =>vacancy.getVacanciesForReport(params, response => resolve(response), error => reject(error)));
    vacancy.requestGetCandidatesInStages = function (params) {
        $rootScope.loading = true;
        return new Promise((resolve, reject) => {
            vacancy.getCandidatesInStages(params, (response) => {
                console.log('!!!!!!!!!!!!!!')
                vacancy.candidateLastRequestParams = params;
                vacancy.getCandidate = response.objects.map(item => item.candidateId.localId);
                localStorage.setItem('candidateLastRequestParams', JSON.stringify(params));
                localStorage.setItem('getAllCandidates', JSON.stringify(vacancy.getCandidate));
                resolve(response, params);
            },() =>{
                reject();
            });
        });
    };
    vacancy.uploadPromoLogo = function(fileUp){
        var FD  = new FormData();
        var blobBin = atob(fileUp.split(',')[1]);
        var array = [];
        for(var i = 0; i < blobBin.length; i++) {
            array.push(blobBin.charCodeAt(i));
        }
        var file=new Blob([new Uint8Array(array)], {type: 'image/png'});
        FD.append('image', file);
        return $http({
            url: serverAddress + "/vacancy/saveImg/" + $rootScope.vacancy.vacancyId,
            method: 'POST',
            data: FD,
            withCredentials: true,
            headers: { 'Content-Type': undefined},
            transformRequest: angular.identity
        });
    };

    return vacancy;
}
]);