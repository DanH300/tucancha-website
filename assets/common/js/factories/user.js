uvodApp.factory('AuthService', function($http, $rootScope, $window, User, $q, $interval) {
    var scope = {};
    scope.user = {};
    scope.loginUser = {};


    scope.getCurrentUser = function() {
        
        var deffered = $q.defer();
        var user = scope.RestoreState();
        if(!user){
            $rootScope.$broadcast("auth-current-error");
        }else{
      
            User.set(user);
            scope.user = User;
            deffered.resolve(user);
        }
        
        return deffered.promise;
    };

    scope.getUserProfile = function() {

        var deffered = $q.defer();
        $http({ method: 'GET', url: 'index.php/api/account/get_current' }).
        then(function(data, status, headers, config) {
 
                User.set(data.data);
                scope.user = User;
            
            deffered.resolve(data.data);
        }).
        catch(function(data, status, headers, config) {
            $rootScope.$broadcast("auth-current-error");
            deffered.reject(data);
        });
        return deffered.promise;
    };

    scope.updateProfile = function(user) {
        var deffered = $q.defer();
        $http({ method: 'POST', url: 'index.php/api/account/update_profile', data: user }).
        then(function(data, status, headers, config) {
            //Get user from the localstorage
            var user = scope.RestoreState();
            user.profile = data.data
            User.set(user);
            //Save the updated profile into the localstorage
            scope.SaveState(user);
            deffered.resolve(data.data);
        }).
        catch(function(data, status, headers, config) {
            deffered.reject(data)
        });
        return deffered.promise;
    }

    scope.updateDni = function(dni) {
        var deffered = $q.defer();
        $http({ method: 'POST', url: 'index.php/api/account/update_user', data: {data: {dni: dni}, id: User._id} }).
        then(function(data, status, headers, config) {

            if(data.data.error){
                if( data.data.message === 'dni_used'){
                    var message = 'La cédula ya está en uso'
                }else {
                    var message = data.data.message;
                }
                throw Error(message);
            }
            //Get user from the localstorage
            var user = scope.RestoreState();
            user.dni = data.data.content.dni;
            User.set(user);
            //Save the updated profile into the localstorage
            scope.SaveState(user);
            deffered.resolve(data.data);
        }).
        catch(function(data, status, headers, config) {
            deffered.reject(data)
        });
        return deffered.promise;
    }

    scope.getOrders = function() {
        var deffered = $q.defer();
        $http({ method: 'POST', url: 'index.php/api/account/get_customer_orders', data: {token: User.token} }).
        then(function(data, status, headers, config) {
            //Get user from the localstorage
            if(data.data.content && data.data.content.entries){
 
            var user = scope.RestoreState();
            user.ppvTickets = data.data.content.entries;
            User.set(user);
            //Save the updated profile into the localstorage
            scope.SaveState(user);
            deffered.resolve(data.data.content.entries);
            }else{
                effered.resolve([]);
            }
    
   
        }).
        catch(function(data, status, headers, config) {
            deffered.reject(data)
        });
        return deffered.promise;
    }

    

    scope.setLoginUser = function(user) {
        scope.loginUser = user;
    }

    scope.getLoginUser = function() {
        return scope.loginUser;
    }

    scope.register = function(args) {
        ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'Register', eventLabel: 'Registration Start' });
        var deferred = $q.defer();
        $http({ method: 'POST', url: 'index.php/api/account/register', data: args }).
        then(function(data, status, headers, config) {
            if (data.data.error) {
                ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'Register', eventLabel: 'Registration Error' });
                $rootScope.$broadcast("auth-register-error", data.data);
            } else {
                ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'Register', eventLabel: 'Registration Success' });
                scope.SaveState(data.data);
                User.set(data.data);
                $rootScope.$broadcast("auth-register-success", data.data);
            }
        }).
        catch(function(data, status, headers, config) {
            ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'Register', eventLabel: 'Registration Server Error' });
            $rootScope.$broadcast("auth-register-error");
            deferred.reject(data);
        });
        return deferred.promise;
    };

    scope.login = function(email, pass, remember, geocode, countryName, userIp, deviceId) {
        ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'Login', eventLabel: 'Login Start' });
        if (scope.activateLinkByFacebook) {
            scope.linkFacebook(email, pass);
        } else {
            $http({ method: 'POST', url: 'index.php/api/account/login_user', data: { email: email, password: pass, remember: remember, geocode: geocode, country_name: countryName, user_ip: userIp, device_id: deviceId, device_name: deviceId } }).
            then(function(data, status, headers, config) {
                if (data.data.error) {
                    $rootScope.$broadcast("auth-login-error", data.data);
                    ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'Login', eventLabel: 'Login Error' });
                } else if (data.data.content.device_error) {
                    console.log('device error');
                    $rootScope.$broadcast("device-login-error", data.data);

                } else {
                    ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'Login', eventLabel: 'Login Success' });
                    scope.SaveState(data.data.content);
                    User.set(data.data.content);        
                    $rootScope.$broadcast("auth-login-success");
                }
            }).
            catch(function(data, status, headers, config) {
                ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'Login', eventLabel: 'Login Server Error' });
                $rootScope.$broadcast("auth-login-error", data.message);
            });
        }

    };

    scope.fbLogin = function(fbId, fbData, geocode, countryName, userIp, deviceId) {
        ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'Login', eventLabel: 'Login Start' });

        $http({ method: 'POST', url: 'index.php/api/account/fb_login', data: { fb_id: fbId, fb_data: fbData, geocode: geocode, country_name: countryName, user_ip: userIp, device_id: deviceId, device_name: deviceId } }).
        then(function(data, status, headers, config) {
            if (data.data.error) {
                $rootScope.$broadcast("auth-login-error", data.data);
                ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'Login', eventLabel: 'Login Error' });
            } else if (data.data.content.device_error) {
                console.log('device error');
                $rootScope.$broadcast("device-login-error", data.data);
            } else {
                ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'Login', eventLabel: 'Login Success' });
                User.set(data.data.content);
                scope.SaveState(data.data.content);
                $rootScope.$broadcast("auth-login-success");
            }
        }).
        catch(function(data, status, headers, config) {
            ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'Login', eventLabel: 'Login Server Error' });
            $rootScope.$broadcast("auth-login-error", data.message);
        });
    };

    scope.checkDevices = function() {
        var deffered = $q.defer();
        $http({ method: 'POST', url: 'index.php/api/account/check_devices', data: { device_id: navigator.userAgent, device_name: navigator.userAgent, userId: User._id, token: User.token } }).
        then(function(data, status, headers, config) {
            if (data.data.content.enabled == false) {
                scope.logout();
                $rootScope.$broadcast("out-of-devices-error", data.data);
            } else {
                User.deviceId = data.data.content.device.id;
            }
            deffered.resolve(data);
        }).
        catch(function(data, status, headers, config) {
            deffered.reject(data)
        });
        return deffered.promise;
    }

    scope.getWallet = function() {
        var deffered = $q.defer();
        $http({ method: 'GET', url: 'index.php/api/account/get_wallet?userId=' + User._id }).
        then(function(data, status, headers, config) {
            if (data.data.content) {
                User.wallet = data.data.content;
            }
            deffered.resolve(data);
        }).
        catch(function(data, status, headers, config) {
            deffered.reject(data)
        });
        return deffered.promise;
    }

    scope.deleteDevice = function(deviceId, token) {
        var deffered = $q.defer();
        $http({ method: 'POST', url: 'index.php/api/account/delete_device', data: { deviceId: deviceId, token: token } }).
        then(function(data, status, header, config) {
            deffered.resolve(data);
        }).
        catch(function(data, status, headers, config) {
            deffered.reject(data)
        });
        return deffered.promise;
    }

    scope.resetPassword = function(email) {
        var deffered = $q.defer();
        $http({ method: 'GET', url: 'index.php/api/account/send_password_email/?email=' + email }).
        then(function(data, status, header, config) {
            deffered.resolve(data);
        }).
        catch(function(data, status, headers, config) {
            deffered.reject(data)
        });
        return deffered.promise;
    }

    scope.linkFacebook = function(email, pass) {
        $http({ method: 'POST', url: 'index.php/api/account/link_facebook', data: { email: email, password: pass } }).
        then(function(data, status, headers, config) {
            if (data.data.code == '10') {
                $rootScope.$broadcast("auth-login-error", data.data);
            } else {
                User.set(data.data);
                $rootScope.$broadcast("auth-login-success");
            }

        }).
        catch(function(data, status, headers, config) {
            $rootScope.$broadcast("auth-login-error", data);
        });

    }

    scope.logout = function() {
        $http({ method: 'POST', url: 'index.php/api/account/logout', data: { deviceId: User.deviceId } }).
        then(function(data, status, headers, config) {
            $rootScope.$broadcast("auth-logout-success", data);
            scope.ClearState();
            User.destroy();
            scope.getCurrentUser();
        }).
        catch(function(data, status, headers, config) {
            User.destroy();
            scope.ClearState();
        });
    }

    scope.setSubscription = function(subscription){

        var subscriptionObj = [];
        subscriptionObj['subscriptionPlan'] = subscription;
        var user = scope.RestoreState();
        user.subscriptionPlans = subscription;
        //Save the updated subscription into the localstorage
        User.setProperties(subscriptionObj);
        scope.SaveState(user);
        $rootScope.$broadcast("auth-login-success");
    }

    scope.setBillingInfo = function(billingInfo){

        var billingObj = [];
        billingObj['billingInfo'] = billingInfo;
        User.setProperties(billingObj);
       
        var user = scope.RestoreState();
        user.billingInfo = billingInfo;
        //Save the updated subscription into the localstorage
        scope.SaveState(user);
        $rootScope.$broadcast("auth-login-success");
      
    }

    scope.googleLogin = function() {
        window.open('index.php/hauth/login/Google', 'google', 'left=20,top=20,width=500,height=400,toolbar=1,resizable=0');
    }

    scope.twitterLogin = function() {
        scope.socialLogin = true;
        window.open('index.php/hauth/login/Twitter?ref=' + location.hash.substring(3) + '&network=twitter', 'twitter', 'left=20,top=20,width=500,height=400,toolbar=1,resizable=0');
    }

    scope.instagramLogin = function() {
        scope.socialLogin = true;
        window.open('index.php/hauth/login/Instagram', 'instagram', 'left=20,top=20,width=500,height=400,toolbar=1,resizable=0');
    }

    scope.inLogin = function() {
        window.open('index.php/hauth/login/LinkedIn', 'in', 'left=20,top=20,width=500,height=400,toolbar=1,resizable=0');
    }

    scope.vkontakteLogin = function() {
        window.open('index.php/hauth/login/Vkontakte', 'in', 'left=20,top=20,width=500,height=400,toolbar=1,resizable=0');
    }

    scope.setDevices = function(devices) {
        scope.devices = devices;
    }

    scope.getDevices = function() {
        return scope.devices;
    }

    scope.refreshAuth = function(){
        return $http({ method: 'GET', url: 'index.php/api/account/refresh_pixellot_token?token=' + User.token}).
        then(function(resp, status, headers, config) {
            const signaturePayload = (resp.data.content.token) ? resp.data.content.token.authSignature : null;
            if(signaturePayload){
                var Auth = $window['pixellot-web-sdk'].Auth;
                Auth.setSession(signaturePayload.token, signaturePayload.signature);
                User.Auth = Auth;
                User.AuthExpire = signaturePayload.expire;
                var user_tmp = scope.RestoreState();
                user_tmp.Auth = Auth;
                user_tmp.AuthExpire = signaturePayload.expire;
                scope.SaveState(user_tmp);
                
            }
            return signaturePayload;
        });
    }

    scope.SaveState= function (user) {
        $window.localStorage.setItem('userData',btoa(utf8_encode(angular.toJson(user))));
    },

    scope.RestoreState = function () {

        var user = null;
        if($window.localStorage.getItem('userData') !== null) {
            user = angular.fromJson(atob(utf8_decode($window.localStorage.getItem("userData"))));
        }
        return user;
    }

    scope.ClearState = function () {
        $window.localStorage.removeItem('userData');
    }

    $interval(scope.retentionUser, 1200000);

    return scope;
});

uvodApp.service('User', function($rootScope, $location, $q, $http, notificationsFactroy, $window) {
    u = this;
    // this.data=null;
    this.get = function() {
        return this.data;
    }
    this.set = function(user) {
        // console.log('Setting User',user);
        this._id = user.id ;
        this.token = user.token ? user.token : null;
        this.accountId = user.profile ? user.profile.accountId : user.accountId;
        this.avatar = user.profile.avatar ? user.profile.avatar : "/assets/theme/tuc/images/profile.png";
        this.billingInfo = user.billingInfo;
        this.birthdate = user.profile ? user.profile.birthdate : user.birthdate;
        this.city = user.profile ? user.profile.city : user.city;
        this.addressLine1 = user.profile ? user.profile.addressLine1 : user.addressLine1;
        this.addressLine2 = user.profile ? user.profile.addressLine2 : user.addressLine2;
        this.state = user.profile ? user.profile.state : user.state;
        this.countryCode = user.profile ? user.profile.countryCode : user.countryCode;
        this.phone = user.profile ? user.profile.phone : user.phone;
        this.countryName = user.profile ? user.profile.countryName: user.countryName;
        this.email = user.profile ? user.profile.email : user.email;
        this.fbId = user.profile ? user.profile.fbId : user.fbId;
        this.firstName = user.profile ? user.profile.firstName : user.firstName;
        this.gender = user.profile ? user.profile.gender : user.gender;
        this.lastName = user.profile ? user.profile.lastName : user.lastName;
        this.metroCode = user.profile ? user.profile.metroCode : user.metroCode;
        this.metroName = user.profile ? user.profile.metroName : user.metroName;
        this.operations = user.profile ? user.profile.operations : user.operations;
        this.paymentData = user.profile ? user.profile.paymentData : user.paymentData;
        this.postalCode = user.profile ? user.profile.postalCode : user.postalCode;
        this.ppvTickets = user.ppvTickets;
        this.privateDataMap = user.privateDataMap;
        this.publicDataMap = user.publicDataMap;
        this.regionCode = user.regionCode;
        this.regionName = user.regionName;
        this.registeredDevices = user.registeredDevices;
        this.subscriptionPlan = user.subscriptionPlans;
        this.title = user.title;
        this.userid = user.id;
        this.username = user.username;
        this.watchlist = user.profile ? user.profile.watchlist : user.watchlist;
        this.devices = user.devices;
        this.wallet = user.wallet;
        this.dni = user.dni;
        this.transactionalPlans = user.transactionalPlans;
        this.deviceId = user.current_device ? user.current_device.id : null;
        this.globalTags =  user.profile ? user.profile.globalTags : false;
        notificationsFactroy.sendTags(this);
        notificationsFactroy.syncHashedEmail(this.email);
        $rootScope.$broadcast("auth-login-success");
        if(!user.dni){
            $('.dniModal').modal('show');
        }else{
            $('.dniModal').modal('hide');
        }
        if(user.authSignature){
            var Auth = $window['pixellot-web-sdk'].Auth;
            Auth.setSession(user.authSignature.token, user.authSignature.signature);
            this.Auth = Auth;
            this.AuthExpire = user.authSignature.expire;
        }

    };

    this.setProperties = function(val){
        for (var key in val) {
            this[key] = val[key]
        }
    }

    this.destroy = function() {
        this._id = null;
        this.token = null;
        this.accountId = null;
        this.avatar = null;
        this.billingInfo = null;
        this.birthdate = null;
        this.city = null;
        this.addressLine1 = null;
        this.addressLine2 = null;
        this.state = null;
        this.countryCode = null;
        this.countryName = null;
        this.email = null;
        this.fbId = null;
        this.firstName = null;
        this.gender = null;
        this.lastName = null;
        this.metroCode = null;
        this.metroName = null;
        this.operations = null;
        this.paymentData = null;
        this.postalCode = null;
        this.ppvTickets = null;
        this.privateDataMap = null;
        this.publicDataMap = null;
        this.regionCode = null;
        this.regionName = null;
        this.registeredDevices = null;
        this.subscriptionPlan = null;
        this.title = null;
        this.userid = null;
        this.username = null;
        this.watchlist = null;
        this.phone = null;
        this.wallet = null;
        this.dni = null;
        this.devices = null;
        this.transactionalPlans = null;
        this.deviceId = null;
        this.globalTags = null;
        $rootScope.$broadcast("auth-logout");
        this.Auth = null;
    };

    this.subscribe = function(billingInfo, subscriptionId) {
        return $http({ method: 'POST', url: 'index.php/api/account/subscribe', data: { billing: billingInfo, id: subscriptionId } }).
        then(function(data, status, headers, config) {
            return data;
        }).
        catch(function(data, status, headers, config) {
            return data;
        });
    };

    this.tvodSubscribe = function(billingInfo, subscriptionId) {
        return $http({ method: 'POST', url: 'index.php/api/account/tvod_subscribe', data: { billing: billingInfo, id: subscriptionId } }).
        then(function(data, status, headers, config) {
            return data;
        }).
        catch(function(data, status, headers, config) {
            return data;
        });
    };

    this.deleteDevice = function(deviceId) {
        return $http({ method: 'POST', url: 'index.php/api/account/delete_device', data: { deviceId: deviceId } }).
        then(function(data, status, headers, config) {
            return data;
        }).
        catch(function(data, status, headers, config) {
            return data;
        });
    };

    this.sendUserShippingAddress = function(id, shippingInfo) {
        return $http({ method: 'POST', url: 'index.php/api/account/submit_campaign', data: { subscription_id: id, shipping: shippingInfo } }).
        then(function(data, status, headers, config) {
            return data;
        }).
        catch(function(data, status, headers, config) {
            return data;
        });
    };

    this.subscribeWithExistingCC = function(subscriptionId) {
        // console.log("subscribeWithExistingCC", subscriptionId);
        return $http({ method: 'POST', url: 'index.php/api/account/subscribe_existing_cc', data: { id: subscriptionId } }).
        then(function(data, status, headers, config) {
            return data;
        }).
        catch(function(data, status, headers, config) {
            console.log('subscription error', data);
        });
    };

    this.subscribeWithWallet = function(subscriptionId) {
        // console.log("subscribeWithExistingCC", subscriptionId);
        return $http({ method: 'POST', url: 'index.php/api/account/subscribe_wallet', data: { id: subscriptionId } }).
        then(function(data, status, headers, config) {
            return data;
        }).
        catch(function(data, status, headers, config) {
            console.log('subscription error', data);
        });
    };

    this.buyWithWallet = function(productId) {
        // console.log("subscribeWithExistingCC", subscriptionId);
        return $http({ method: 'POST', url: 'index.php/api/account/buy_with_wallet', data: { id: productId } }).
        then(function(data, status, headers, config) {
            return data;
        }).
        catch(function(data, status, headers, config) {
            console.log('buy error', data);
        });
    };

    this.tvodSubscribeWithExistingCC = function(subscriptionId) {
        // console.log("subscribeWithExistingCC", subscriptionId);
        return $http({ method: 'POST', url: 'index.php/api/account/tvod_subscribe_existing_cc', data: { id: subscriptionId } }).
        then(function(data, status, headers, config) {
            return data;
        }).
        catch(function(data, status, headers, config) {
            console.log('subscription error', data);
        });
    };

    this.getSubscription = function(user, success, error) {
        $http({ method: 'GET', url: 'index.php/api/account/get_subscription', data: user._id }).
        then(success, error);
    };

    this.cancelSubscription = function(subscriptionId, success, error) {
        return $http({ method: 'POST', url: 'index.php/api/account/cancel_subscription', data: { subscription_id: subscriptionId } }).
        then(function(data, status, headers, config) {
            return data;
        }).
        catch(function(data, status, headers, config) {
            //    console.log('subscription error', data);
        });
    };

    this.changePassword = function(email, old_password, newPassword) {
        var defer = $q.defer();
        $http({ method: 'POST', url: 'index.php/api/account/change_password', data: { email: email, old_password: old_password, new_password: newPassword } }).
        then(function(data, status, headers, config) {
            //        console.log('change password success', data);
            defer.resolve(data.data);
        }).
        catch(function(data, status, headers, config) {
            //        console.log('change password error', data);
        });
        return defer.promise;
    };

    this.editBillingInformation = function(billingInfo) {
        $http({ method: 'POST', url: 'index.php/api/account/edit_billing_information', data: { id: this._id, billing: billingInfo } }).
        then(function(data, status, headers, config) {
            $rootScope.$broadcast("billing-success", data);
        }).
        catch(function(data, status, headers, config) {
            data.error = true
            $rootScope.$broadcast("billing-error", data.data);
        });
    };

    this.addBillingInformation = function(billingInfo) {
        $http({ method: 'POST', url: 'index.php/api/account/add_billing_information', data: { id: this._id, billing: billingInfo } }).
        then(function(data, status, headers, config) {
            $rootScope.$broadcast("billing-success", data);
        }).
        catch(function(data, status, headers, config) {
            $rootScope.$broadcast("billing-error", data.data);
        });
    };

    this.deleteCard = function(billingInfo, success, error) {
        $http({ method: 'GET', url: 'index.php/api/account/delete_credit_card?id=' + billingInfo.id }).
        then(success, error);

    };

    this.getNotifications = function(success, error) {
        $http({ method: 'GET', url: 'index.php/api/account/get_user_notifications' }).
        then(success, error);
    };

    this.markNotifications = function(notifications, success, error) {
        $http({ method: 'POST', url: 'index.php/api/account/mark_notifications_as_read', data: notifications }).
        then(success, error);
    };

    this.purchaseEvent = function(billingInfo, ticket, success, error) {
        $http({ method: 'POST', url: 'index.php/api/ppv/event_subscription', data: { billing: billingInfo, user: this, ticket: ticket } }).
        then(success, error);
    };

    this.sendConfirmation = function(purchaseData, success, error) {
        $http({ method: 'POST', url: 'index.php/api/ppv/send_confirmation_email', data: { purchaseData: purchaseData, user: this } }).
        then(success, error);
    };

    this.sendTVODEmail = function(purchaseData, userdata, tvoddata, success, error) {
        $http({ method: 'POST', url: 'index.php/api/tvod/send_tvod_email', data: { purchaseData: purchaseData, user: userdata, tvod: tvoddata } }).
        then(success, error);
    };

    this.purchaseEventByStoredCC = function(ticket, success, error) {
        $http({ method: 'POST', url: 'index.php/api/ppv/buy_event_by_stored_cc', data: { user: this, ticket: ticket } }).
        then(success, error);
    };

    return this.data;

});