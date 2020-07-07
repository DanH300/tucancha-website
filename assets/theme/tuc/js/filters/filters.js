uvodApp
.filter('dotsCenter', function() {
    return function(input, optional1, optional2) {
        var parts = input.split('.');
        return parts[1];
    };
}).filter('commerceCut', function() {
    return function(input, optional1, optional2) {
        if(input){
            var parts = input.split('_');
            return parts[1];
        }
    };
})
.filter('nl2br', function($sce){
    return function(msg,is_xhtml) {
        var is_xhtml = is_xhtml || true;
        var breakTag = (is_xhtml) ? '<br />' : '<br>';
        var msg = (msg + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n|<br>)/g, '$1'+ breakTag +'$2');
        return $sce.trustAsHtml(msg);
    }
})
.filter('trim', function () {
    return function(value) {
        if(!angular.isString(value)) {
            return value;
        }
        return "ID" + value.replace(/\s+/g, '');
    };
})
.filter('epgTitle', function () {
    return function(value) {
        if(!angular.isString(value)) {
            return value;
        }
        if(value.split("|").length)
            return value.split("|")[value.split("|").length-1];
        return value;
    };
})

.filter('https', function ($location) {
    return function(value) {
        if(!angular.isString(value)) {
            return value;
        }
        var str =$location.absUrl();
        var pattern = /^((https):\/\/)/;
        if (pattern.test(str)) {
            return value.replace('http://', 'https://');
        }else {
            return value;
        }

    };
})
.filter('split', function() {
      return function(input, splitChar, splitIndex) {
        if (input.indexOf('|') > -1){
          return input.split(splitChar)[splitIndex];
        }
        else{
          return input;
        }

      }
});
