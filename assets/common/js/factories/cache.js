uvodApp.factory('cacheFactory', function($q) {
    var scope = {};
    var cache = {};
    var ttl = {};
    var _deferred = {};


    scope.defer = function(key) {
        // console.log("cache deferred get ?", key, _deferred[key]);
        if (_deferred[key]) {
            return $.extend(_deferred[key], { cache: true });
        } else { // we have no def, lets create one
            var d = $q.defer();
            d.promise.then(function() {
                // console.log("cache def kill", key);
                delete _deferred[key];
            }, function(reason) {
                // console.log("cache def kill error", key);
                delete _deferred[key];
            });
            _deferred[key] = d;
            return d;
        }
    }

    scope.set = function(type, key, value, ttl) {
        if (!cache[type]) cache[type] = {};
        if (!ttl) ttl = new Date().getTime() + 60000;
        else ttl = ttl * 1000 + new Date().getTime();
        cache[type][key] = { data: value, ttl: ttl };
        return true;
    }
    scope.get = function(type, key) {
        //return false;
        try {
            var res = cache[type][key];
            if (res.ttl >= new Date().getTime()) return res.data;
            else return false;
        } catch (e) {
            return false;
        }
    }
    scope.clear = function(type, key) {
            if (_deferred[type] && _deferred[type][key]) delete _deferred[type][key];
        }
        /************************/
    scope.deferred = function(type, key, def) {
        // console.log("cache deferred get ?", type, key, _deferred[type+key]);
        if (_deferred[type + key]) return _deferred[type + key];

        if (def) {

            _deferred[type + key] = def;
            def.promise.then(function(greeting) {
                delete _deferred[type + key];
            }, function(reason) {
                delete _deferred[type + key];
            });
        }
        return null;
    }

    return scope;
});