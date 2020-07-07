uvodApp.service("notificationsFactroy", function($q, $http) {

    return {
        sendTags: function(user) {

            var tags = {};

            if (user && user._id) {
                tags.user_id = user._id;
                tags.user_name = user.email;
                tags.firstname = user.firstName;
                tags.lastname = user.lastName;
                tags.gender = user.gender;
                tags.birthdate = user.birthdate;
                tags.phone = user.phone;

                tags.addressLine1 = user.addressLine1;
                tags.addressLine2 = user.addressLine2;
                tags.postcode = user.postalCode;
                tags.city = user.city;
                tags.state = user.state;
                tags.countryName = user.countryName;

                tags.ppvTickets = user.ppvTickets ? user.ppvTickets.length : 0;
                tags.tvod = user.transactionalPlans ? user.transactionalPlans.length : 0;

                if (user.subscriptionPlan) {
                    tags.user_type = user.subscriptionPlan.active ? 'Subscriber' : 'Registered';
                    tags.subscriptionTitle = user.subscriptionPlan.title;
                    tags.subscriptionStartDate = user.subscriptionPlan.contractStartDate ? (new Date(user.subscriptionPlan.contractStartDate)).toISOString() : '';
                    tags.subscriptionEndDate = user.subscriptionPlan.contractEndDate ? (new Date(user.subscriptionPlan.contractEndDate)).toISOString() : '';
                }

            }

            if (OneSignal) {
                // OneSignal.isPushNotificationsEnabled(function(isEnabled) {
                //     if (isEnabled) {
                //         OneSignal.sendTags(tags);

                //     }
                // });

            }
        },

        syncHashedEmail: function(email) {
            if (email && OneSignal) {
                // OneSignal.isPushNotificationsEnabled(function(isEnabled) {
                //     if (isEnabled) {
                //         OneSignal.syncHashedEmail(email);

                //     }
                // });

            }
        }
    };

});