angular.module('services.slider', [
    'ngResource',
    'ngCookies'
]).factory('sliderElements', ['$resource', 'serverAddress', '$filter', '$localStorage',"notificationService","$rootScope","$translate","$location","Candidate","Vacancy", function($resource, serverAddress, $filter, $localStorage,notificationService, $rootScope,$translate, $location, Candidate, Vacancy) {
   try{
       let sliderElements = {},currentPage,
           iterator = (function () {
               let index = 0,
                   collection = [],
                   length = 0;

               function getNewPackCandidatesNext($scope) {
                   if(currentPage === 'candidates'){
                       Candidate.getAllCandidates(sliderElements.params)
                           .then((resp, params) => {
                               collection = collection.concat(resp.objects.map(item => item.localId))
                               return {
                                   collection: collection,
                                   params: sliderElements.params
                               }
                           })
                           .then(data => {
                               $scope.$apply(() =>{
                                   Candidate.getCandidate = data.collection;
                                   localStorage.setItem('getAllCandidates', JSON.stringify(Candidate.getCandidate));
                                   sliderElements.params = data.params;
                                   console.log(sliderElements.params, 'sliderElements.params')
                                   $location.path("candidates/" +  (data["collection"][length]));
                                   length = data.collection.length;
                                   sliderElements.nextElement["cacheCurrentPosition"] =  getPosition.apply(sliderElements, [false, 'up']);
                                   $rootScope.loading = false;
                               })
                           });
                   }else{
                       Vacancy.requestGetCandidatesInStages(sliderElements.params)
                           .then((resp) => {
                               console.log(resp, 'resp');
                               collection = collection.concat(resp.objects.map(item => item.candidateId.localId));
                               console.log(collection, 'collection!2222!!!!!');
                               return {
                                   collection: collection,
                                   params: sliderElements.params
                               }
                           })
                           .then(data => {
                               $scope.$apply(() =>{
                                   Vacancy.getCandidate = data.collection;
                                   localStorage.setItem('getAllCandidates', JSON.stringify(Vacancy.getCandidate));
                                   sliderElements.params = data.params;
                                   $location.path("candidates/" +  (data["collection"][length]));
                                   length = data.collection.length;
                                   sliderElements.nextElement["cacheCurrentPosition"] =  getPosition.apply(sliderElements, [false, 'up']);
                                   $rootScope.setCurrent = false;
                                   localStorage.setItem('setCurrent', false);
                                   $rootScope.loading = false;
                               })
                           });
                   }
                   return null;
               }

               function getNewPackCandidatesPrevious($scope, type) {
                   if(currentPage === 'candidates'){
                       Candidate.getAllCandidates(sliderElements.params)
                           .then((resp, params) => {
                               console.log(resp, 'resp');
                               resp.objects.reverse().map(item =>{
                                   collection.unshift(item.localId)
                               });
                               return {
                                   collection: collection,
                                   params: sliderElements.params
                               }
                           })
                           .then(data => {
                               $scope.$apply(() =>{
                                   Candidate.getCandidate = data.collection;
                                   localStorage.setItem('getAllCandidates', JSON.stringify(Candidate.getCandidate));
                                   sliderElements.params = data.params;
                                   $location.path("candidates/" +  (data["collection"][data.params.page.count - 1]));
                                   length = data.collection.length;
                                   index  = data.params.page.count - 2;
                                   sliderElements.nextElement["cacheCurrentPosition"] =  getPosition.apply(sliderElements, [false, 'down']);
                                   $rootScope.loading = false;
                               })
                           });
                   }else{
                       Vacancy.requestGetCandidatesInStages(sliderElements.params)
                           .then((resp, params) => {
                               resp.objects.reverse().map(item =>collection.unshift(item.candidateId.localId));
                               return {
                                   collection: collection,
                                   params: sliderElements.params
                               }
                           })
                           .then(data => {
                               $scope.$apply(() =>{
                                   Vacancy.getCandidate = data.collection;
                                   localStorage.setItem('getAllCandidates', JSON.stringify(Vacancy.getCandidate));
                                   sliderElements.params = data.params;
                                   $location.path("candidates/" +  (data["collection"][data.params.page.count - 1]));
                                   length = data.collection.length;
                                   index  = data.params.page.count - 2;
                                   sliderElements.nextElement["cacheCurrentPosition"] =  getPosition.apply(sliderElements, [false, 'down']);
                                   $rootScope.loading = false;
                               })
                           });
                   }
                   return null;
               }


               // currentPage = getLocation();
               //      sliderElements.getData = getData;
               function getData() {
                   sliderElements.params ;

                   if(currentPage === 'candidates'){ // проверка от куда зашел пользователь
                       sliderElements.params = Candidate.candidateLastRequestParams || JSON.parse(localStorage.getItem('candidateLastRequestParams'));
                       if(Candidate.getCandidate){
                           collection = Candidate.getCandidate;
                           length = collection.length;
                       }else if(localStorage.getItem('getAllCandidates')){
                           collection = JSON.parse(localStorage.getItem('getAllCandidates'));
                           length = collection.length;
                       }
                   }else if(currentPage == 'vacancies'){
                       sliderElements.params = Vacancy.candidateLastRequestParams  || JSON.parse(localStorage.getItem('candidateLastRequestParams'));
                       if(localStorage.getItem('candidatesInStagesVac')){
                           collection = Vacancy.getCandidate || JSON.parse(localStorage.getItem('candidatesInStagesVac'));
                           length =  collection.length;
                       }
                   }
               }

               getData();

               return{ // патерн итератор
                   next($scope){
                       var element = '';

                       if(!this.hasNext()){
                           return getNewPackCandidatesNext($scope);
                       }else{
                           getData();
                           index = index  + 1;
                           element = collection[index];
                           this.index = index;
                           return element;
                       }
                   },
                   previous($scope){
                       var element;

                       if(!this.hasPrevious()){
                           return getNewPackCandidatesPrevious($scope);
                       }
                       (index !== 0)? index = index - 1 : index = 0;
                       element = collection[index];
                       this.index = index;
                       return element;
                   },
                   hasNext(){
                       (index > 0 && ((index + 1) % sliderElements.params.page.count == 0))? sliderElements.params.page.number += 1 : false;
                       return index < length - 1;
                   },
                   hasPrevious(){
                       (index > 0 && (index % sliderElements.params.page.count === 0) || index == 0)? sliderElements.params.page.number -= 1 : false;
                       return index > 0;
                   },
                   current(){
                       let localId = $location.path().split('/')[2];
                       getData();
                       index = collection.indexOf(localId);
                       length = collection.length;
                       console.log(collection, 'collection')
                       console.log(index, 'index')
                       this.length = length;
                       this.index = index;
                   }
               }
           })();
       sliderElements.nextOrPrevElements = function ($scope, event) {
           let i = event.pageX, j = event.pageY,
               buttons = document.querySelectorAll('.leftBlockArrow, .rightBlockArrow'),
               mass = [].slice.apply(event.target.classList);

           const   mainBlock = document.querySelector('.main-block'),
               coords = getCoords(mainBlock.firstElementChild),
               blockElementOffsetLeft = coords.left,
               blockCandidateOffsetRight = coords.right;

           if( event.target.classList[1] === 'fa-chevron-left'  ||
               event.target.classList[1] === 'fa-chevron-right' ||
               event.target.classList[0] === 'leftBlockArrow'        ||
               event.target.classList[0] === 'rightBlockArrow') return;

           if(buttons && buttons.length >= 1 && mass.indexOf('main-block') === -1){
               buttons.forEach((elem)=>{
                   elem.remove();
               });
               return;
           }

           if( i <= blockElementOffsetLeft){
               iterator.current();
               event.target.style.cursor = 'pointer';
               createArrowLeft(blockElementOffsetLeft, mainBlock);
           }else if( i >= blockCandidateOffsetRight){
               iterator.current();
               event.target.style.cursor = 'pointer';
               createArrowRight(blockElementOffsetLeft, mainBlock);
           }else{
               mainBlock.style.cursor = 'initial';
           }
       };

       sliderElements.nextElement = function ($scope, event) {
           let element;

           console.log(sliderElements.nextElement["cacheCurrentPosition"], 'sliderElements.nextElement["cacheCurrentPosition"]');
           sliderElements.nextElement["cacheCurrentPosition"] = +localStorage.getItem('numberPage');
           console.log(sliderElements.nextElement["cacheCurrentPosition"], 'sliderElements.nextElement["cacheCurrentPosition"]');

           if(event.target.dataset.btn === 'right'){
               element =  iterator.next($scope);
               sliderElements.nextElement["cacheCurrentPosition"] += 1;
               localStorage.setItem('numberPage', sliderElements.nextElement["cacheCurrentPosition"]);
           }else if(event.target.dataset.btn  === "left"){
               element = iterator.previous($scope);
               sliderElements.nextElement["cacheCurrentPosition"] -= 1;
               localStorage.setItem('numberPage',  sliderElements.nextElement["cacheCurrentPosition"]);
           }

           if(!element) return;

           $location.path("candidates/" + element);
       };

       // sliderElements.nextElement["cacheCurrentPosition"] = +localStorage.getItem('numberPage');

       sliderElements.setCurrent = () =>{
           currentPage = getLocation();
           $rootScope.setCurrent = $rootScope.setCurrent || JSON.parse(localStorage.getItem('setCurrent'));

           if(+$rootScope.setCurrent){
               sliderElements.nextElement["cacheCurrentPosition"] =  getPosition.apply(sliderElements, [true]);
           }
           $rootScope.setCurrent = false;
           localStorage.setItem('setCurrent', false);
       };

       function getPosition(flag, route){
           let pageNumber = this.params.page.number + 1, count = this.params.page.count, index, resault;

           if(flag){
               iterator.current();
               index = iterator.index;
               resault = ((pageNumber * count) - count) + index;
           }else{
               if(route == 'up'){
                   resault = ((pageNumber * count) - count);
               }else if(route == 'down'){
                   resault = pageNumber * count;
                   resault--;
               }
           }
           localStorage.setItem('numberPage', resault);
           return resault;
       }

       function createArrowLeft(width, mainBlock) {
           let currentIndex = iterator.index,
               number = sliderElements.params.page.number + 1;
           console.log(sliderElements.nextElement.cacheCurrentPosition, 'sliderElements.nextElement.cacheCurrentPosition');

           if((number === 1) && (currentIndex == 0) || !$rootScope.isAddCandidates || sliderElements.nextElement.cacheCurrentPosition < 0){
               mainBlock.style.cursor = 'initial';
               return;
           }

           $('.main-block').append('<div class="leftBlockArrow" ng-show="currentIndex" data-btn="left" style="width:' + width + 'px" data-btn="left"><i data-btn="left" class="fa fa-chevron-left nextElements"></i> </div>');
       }

       function createArrowRight(width, mainBlock) {
           let max = $rootScope.objectSize || localStorage.getItem('objectSize'),
               currentIndex = iterator.index,
               currentLength = iterator.length - 1,
               number = sliderElements.params.page.number + 1,
               count = sliderElements.params.page.count;

           console.log(sliderElements.nextElement.cacheCurrentPosition, 'sliderElements.nextElement.cacheCurrentPosition');

           if((number === Math.ceil(max / count)) && (currentIndex == currentLength) || !$rootScope.isAddCandidates || sliderElements.nextElement.cacheCurrentPosition < 0){
               mainBlock.style.cursor = 'initial';
               return;
           }

           $('.main-block').append('<div class="rightBlockArrow" ng-show="currentIndex" data-btn="right"  style="width:' + width + 'px"; data-btn="right"><i  data-btn="right" class="fa fa-chevron-right nextElements"></i></div>');
       };

       function getCoords(elem) {
           var box = elem.getBoundingClientRect();
           return {
               right: box.right + pageXOffset,
               left: box.left + pageXOffset
           };
       }

       function getLocation() {
           currentPage =  localStorage.getItem('currentPage');
           return currentPage;
       }


       return sliderElements;
   }catch (e) {
       console.log(e, 'ошибка ')
       localStorage.setItem("isAddCandidates", false);
        $rootScope.isAddCandidates = false;
   }
}]);