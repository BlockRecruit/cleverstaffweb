angular.module('services.scope', []).factory('ScopeService', ['$rootScope', 'localStorageService', function($rootScope, localStorageService) {
    var currentControllerUpdateFunc = null;
    var defaultScopeIsInitialized = false;
    var navBarUpdateFunction = null;

    var initDefaultScope = function(name, val) {
        defaultScopeIsInitialized = true;
        if (name != null) {
            setActiveScopeObject(name, val);
        }
    };

    function defaultScopeIsInitializedFc() {
        return defaultScopeIsInitialized;
    }

    var scopeObject = [
        {name: "onlyMy", check: false, value: null, prevVal: null},
        {name: "region", check: false, value: null, prevVal: null},
        {name: "company", check: false, value: null, prevVal: null}
    ];

    function setActiveScopeObject(name, value) {
        var active = null;
        angular.forEach(scopeObject, function(val) {
            if (val.name == name) {
                val.check = true;
                if (value != undefined) {
                    val.value = value;
                } else {
                    val.value = null;
                }
                active = val;
            } else {
                val.check = false;
            }
        });
        updateControllerInformation(active);
    }

    function setCurrentControllerUpdateFunc(val) {
        currentControllerUpdateFunc = val;
    }

    function setNavBarUpdateFunction(val) {
        navBarUpdateFunction = val;
    }

    function getScopeObject() {
        return scopeObject;
    }

    function updateControllerInformation(val) {
        var value = getActiveScopeObject();
        if (currentControllerUpdateFunc != undefined) {
            if (val != undefined) {
                currentControllerUpdateFunc(val);
            } else {
                currentControllerUpdateFunc(value);
            }
        }
        if(navBarUpdateFunction!=undefined){
            if (val != undefined) {
                navBarUpdateFunction(val);
            } else {
                navBarUpdateFunction(value);
            }
        }
    }

    function getActiveScopeObject() {
        var active = null;
        angular.forEach(scopeObject, function(val) {
            if (val.check) {
                active = val;
            }
        });
        return active;
    }

    return {
        setCurrentControllerUpdateFunc: setCurrentControllerUpdateFunc,
        getScopeObject: getScopeObject,
        initDefaultScope: initDefaultScope,
        setActiveScopeObject: setActiveScopeObject,
        getActiveScopeObject: getActiveScopeObject,
        setNavBarUpdateFunction: setNavBarUpdateFunction,
        isInit: defaultScopeIsInitializedFc
    };

}

])
;
