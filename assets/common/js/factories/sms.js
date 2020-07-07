uvodApp.factory("smsFactory", function($http) {
    return {
        sendValidationSMS: function(number) {
            return $http.get('index.php/api/sms/send_validation_sms/?number='+number).then(function(data) {
                return data.data;
            }).catch(function(err){
                // for example, "re-throw" to "hide" HTTP specifics
                return "Data not available";
            })
        },
        validatePin: function(number,phone) {
            return $http.get('index.php/api/sms/validate_pin_and_save_phone/?number='+number+'&phone='+phone).then(function(data) {
                return data.data;
            }).catch(function(err){
                // for example, "re-throw" to "hide" HTTP specifics
                return "Data not available";
            })
        }
    }
});
