var acc = null;
uvodApp.controller('AccountController',
    function($scope, globalFactory, User, $routeParams, $window, AuthService, $location, $log, $window, Upload, countriesFactory, smsFactory, tVodFactory) {
        acc = $scope;
        $scope.subscriptionSuccess = false;
        $window.scroll(0, 0);
        $scope.activeTab = $routeParams.tab;
        if (!$scope.activeTab) {
            $scope.activeTab = "profile";
        }
        $scope.profile = User;
        $scope.editing = false;
        $scope.changingPlan = false;
        $scope.billingInfo = $scope.profile.billingInfo
        $scope.newCard = false;
        $scope.changePasswordDetails = {};
        $scope.submitted = {
            billingForm: false,
            payment: false
        };
        $scope.phoneValidated = $scope.profile.phone;
        $scope.subscription = User.subscriptionPlan && User.subscriptionPlan.length > 0 ? User.subscriptionPlan[0]: null ;
        $scope.payment = $scope.profile.billingInfo;
        $scope.pay = false;
        $scope.country = -1;
        $scope.wallet = User.wallet || null;
        $scope.transactions = [];
        $scope.editPhone = true;
        $scope.validationError = '';
        $scope.campain = false;
        $scope.shippingInfo = {};
        $scope.campainMessage = false;
        $scope.clips = null;
        $scope.paymentType = "none";
        $scope.showMoreTransactions = false;
        $scope.transactionsPage = 0;
        $scope.transactionsPerPage = 10;
        $scope.loadingTransactions = false;

        $scope.transactions;

        
        globalFactory.getAllP2PPay().then(function(data){
            var transactions = data.content;
            for(var i = 0; i < transactions.length ; i++){
                var transaction = transactions[i];
                if(transaction.status != 'COLLECTING'){
                    $scope.transactions.push(transaction);
                }  
            }
            console.log($scope.transactions);

        });

        $scope.menu = [
            { name: "Perfil", id: "profile" },
            { name: "Subscripcion", id: "subscription" },
            { name: "Billing Information", id: "billing-information" },
            { name: "Mi wallet", id: "wallet" },
            // { name: "Pay-Per-View Tickets", id: "tickets" },
            // { name: "My Tvod", id: "tvod" },
            { name: "Mis Clips", id: "clips" },
            { name: "Mis Dispositivos", id: "devices" },
            { name: "Cambiar Contraseña", id: "change-password" }
        ];

        if ($scope.subscription) {
            $scope.subscription.status = "active";
        }
        $scope.changingPlan = !User.subscriptionPlan;
        if (User.billingInfo) {
            $scope.billingInfo.exDate = $scope.billingInfo.expire_month + '/' + $scope.billingInfo.expire_year;
            $scope.billingInfo.security = "XXX";
        }

        $scope.uploadFiles = function(file) {
            Upload.upload({
                url: 'index.php/api/account/upload_profile_pic',
                data: { file: file, 'file-name': $scope.profile._id }
            }).then(function(resp) {
                AuthService.getCurrentUser().then(function(user){
                    user.avatar = resp.data.content.avatar;
                    user.profile.avatar = resp.data.content.avatar;
                    User.set(user);
                    AuthService.SaveState(user);
                    $scope.profile = User;
                });
            }, function(resp) {

            }, function(evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

            });
        };


        $scope.printDiv = function(transaction) {
            var mywindow = window.open('', 'PRINT', 'height=400,width=600');

            mywindow.document.write('<html><head><title>' + transaction.added  + '</title>');
            mywindow.document.write('</head><body >');
            mywindow.document.write('<h1>tucancha.ec | Comprobante de Pago</h1>');
            mywindow.document.write('<h2>Pagado $' + transaction.value  + '</h2>');
            mywindow.document.write('<h3>Estado del pago: ' + transaction.status  + '</h3>');
            mywindow.document.write('<h3>Identificador: ' + transaction.paymentInfo.id  + '</h3>');
            mywindow.document.write('<h3>Documento: ' + transaction.paymentInfo.document? transaction.paymentInfo.document : ""  + '</h3>');
            mywindow.document.write('</body></html>');
        
            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus(); // necessary for IE >= 10*/
        
            mywindow.print();
            mywindow.close();
        
            return true;
        }

        $scope.length = function(obj) {
            if (!obj) {
                return 0;
            }
            return Object.keys(obj).length;
        };

        $scope.edit = function() {
            $scope.editing = !$scope.editing;
        };

        $scope.update = function(form) {
            $scope.editing = false;
            AuthService.updateProfile($scope.profile).then(function(data) {
                $scope.profile = User;
            });
        };

        $scope.logout = function() {
            AuthService.logout();
        };

        $scope.changePlan = function(form) {
            $scope.changingPlan = true;
        };

        $scope.goBack = function() {
            $scope.changingPlan = false;
            $scope.pay = false;
            $scope.campain = false;
        }

        $scope.showActiveTab = function(tab) {
            $scope.activeTab = tab;
        }

        $scope.cancelSubscription = function(form) {
            $scope.loading = true;
            if ($scope.profile.subscriptionPlan) {
                User.cancelSubscription($scope.profile.subscriptionPlan[0]._id).then(
                    function(data) {
                        AuthService.getCurrentUser();
                        $scope.profile = User;
                        $scope.subscription = false;
                        $scope.payment = {};
                        $scope.submitted.payment = false;
                        //$scope.changingPlan = true;
                        $scope.billingInfo = false;
                        $scope.loading = false;
                        $scope.cancelSubscriptionMessage = true;
                        var subscription = [];
                        subscription.push(data.data.content)
                        AuthService.setSubscription(subscription);

                        if ($scope.profile.subscriptionPlan[0].platform == 'android') {
                            $window.location.href = 'https://play.google.com/store/account/subscriptions';
                        } else if ($scope.profile.subscriptionPlan[0].platform == 'ios') {
                            $window.location.href = 'https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/manageSubscriptions';
                        }
                    });
            }
        };

        $scope.cancelCardAdd = function(form) {
            $scope.billing = {};
            form.$setPristine();
            form.$setUntouched();
            $scope.newCard = false;
            cardInformation.userIsCardHolder = false;
            $scope.changeIsUserCardHolder();
        }

        $scope.changeCard = function(form) {
            $scope.billing = {};
            form.$setPristine();
            form.$setUntouched();
            $scope.newCard = true;
        };

        $scope.subscribeWithWallet = function() {
            $scope.subscribing = true;
            User.subscribeWithWallet($scope.currentPlan._id).then(
                function(data) {
                    if (!data.data.error) {
                        $scope.payment = {};
                        $scope.submitted.payment = false;
                        var subscription = [];
                        subscription.push(data.data.content)
                        AuthService.setSubscription(subscription);
                        $scope.subscriptionSuccess = true;
                        $scope.go("account/subscription");
                        if (($scope.currentPlan.subscriptionLength == 12 || $scope.currentPlan.subscriptionLength == 6) && $scope.currentPlan.campaign_count < $scope.currentPlan.campaign_max_count && $scope.currentPlan.campaign_active) {
                            $scope.campain = true;
                        }
                    } else {
                        ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'Subscribe', eventLabel: 'Subscription Error' });
                        $scope.subscriptionError = data.data.message;
                    }
                    $scope.subscribing = false;
                }
            );
        };

        $scope.changeIsUserCardHolder = function(cardInformation) {
            if (cardInformation.userIsCardHolder) {
                cardInformation.firstName = $scope.profile.firstName;
                cardInformation.lastName = $scope.profile.lastName;
                cardInformation.email = $scope.profile.email;
            } else {
                cardInformation.firstName = '';
                cardInformation.lastName = '';
                cardInformation.email = '';
            }
        }

        $scope.changePassword = function(passwordForm) {
            $scope.changePasswordError = false;
            $scope.changePasswordSuccess = false;
            if ($scope.changePasswordDetails.newPassword != $scope.changePasswordDetails.confirmNewPassword) {
                $scope.changePasswordError = "Password Confirmation dosen't match";
                return;
            }
            $scope.loading = true;
            $scope.profile.changePassword($scope.profile.email, $scope.changePasswordDetails.current, $scope.changePasswordDetails.newPassword).then(function(data) {
                if (data.content) {
                    $scope.loading = false;
                    $scope.changePasswordSuccess = "Contraseña cambiada con éxito";
                    $scope.changePasswordDetails = {};
                    passwordForm.$setPristine();
                    passwordForm.$setUntouched();
                    return;
                } else {
                    $scope.loading = false;
                    $scope.changePasswordError = "Contraseña invalida";
                    return;
                }
            });

        };

        $scope.resetPassword = function() {
            $scope.loading = true;
            $scope.changePasswordError = false;
            if ($scope.profile.email) {
                AuthService.resetPassword($scope.profile.email).then(function(data) {
                    $scope.loading = false;
                    if (data.data) {
                        $scope.changePasswordSuccess = "Su nueva contraseña ha sido enviada a su correo electrónico";
                    } else
                        $scope.changePasswordError = "No se puede restablecer tu contraseña";
                });
            } else {
                $scope.loading = false;
                $scope.changePasswordError = "No se puede restablecer tu contraseña";
            }


        };

        $scope.deleteDevice = function(deviceId) {
            User.deleteDevice(deviceId).then(function(data) {
                if (data && data.data && data.data.content) {
                    var deletedId = data.data.content._id;
                    AuthService.getCurrentUser().then(function(user){
                        var newUser = user;
                        var devices = user.devices;
                        for (var i = 0; i <  devices.length; i++) {
                            if (devices[i]._id == deletedId) {
                                devices.splice(i,1);
                                break;
                            }
                        }
                        User.set(user);
                        AuthService.SaveState(user);
                        $scope.profile = User;
                        // newUser.devices = devices;
                        // $scope.profile = newUser;
                    });
                }
            }).catch(function(err) {
                console.error("deleteDevice error: ", err);
            });
        }

        $scope.saveCard = function(form) {
            $scope.submitted.billingForm = true;
            if (form.$invalid) {
                return
            }
            $scope.loading = true;

            $scope.billing.pi_year = $scope.billing.pi_month + '/' + ($scope.billing.pi_year < 2000 ? $scope.billing.pi_year + 2000 : $scope.billing.pi_year);
            if ($scope.profile.billingInfo) {
                User.editBillingInformation($scope.billing);
            } else {
                User.addBillingInformation($scope.billing);
            }
            AuthService.getCurrentUser();
            $scope.profile = User;
            $scope.loading = false;
        };

        $scope.deleteCard = function() {
            $scope.loading = true;
            if ($scope.profile.billingInfo) {
                User.deleteCard($scope.profile.billingInfo,
                    function(response) {
                        $log.log("success");
                        $scope.billing = {};
                        $scope.newCard = false;
                        AuthService.getCurrentUser();
                        $scope.profile = User;
                        $scope.loading = false;
                    },
                    function() {
                        $log.log("error");
                        $scope.loading = false;
                    });
            }
        }
        $scope.$on("auth-logout-success", function() {
            $scope.profile = {};
            $scope.go('');
        });

        $scope.$on("billing-success", function() {
            $scope.submitted.billingForm = false;
            AuthService.getCurrentUser();
            $scope.profile = User;
            $scope.billingInfo = $scope.profile.billing;
            if ($scope.billingInfo) {
                $scope.billingInfo.exDate = $scope.billingInfo.expire_month + '/' + $scope.billingInfo.expire_year;
            }
            $scope.newCard = false;
        });

        $scope.$on("billing-error", function(event, args) {
            $scope.billingError = args.message;
        });

        $scope.$on("auth-login-success", function(event, args) {
            $scope.profile = User;
            $scope.subscription = User.subscriptionPlan;
            if ($scope.subscription) {
                $scope.subscription.status = "active";
            }
            if (!$scope.pay)
                $scope.changingPlan = !User.subscriptionPlan;
            $scope.billingInfo = $scope.profile.billingInfo;
            $scope.phoneValidated = $scope.profile.phone;
            if (User.billingInfo) {
                $scope.billingInfo.exDate = $scope.billingInfo.expire_month + '/' + $scope.billingInfo.expire_year;
                $scope.billingInfo.security = "XXX";
            }
        });

        $scope.go = function(url) {
            if (url == "terms-and-conditions") {
                $window.open('/#!/' + url, '_blank');
            } else {
                $location.path('/' + url);
            }
        };
        $scope.subscribe = function(form) {
            if ($scope.subscriptionSuccess) {
                return;
            };
            if (!$scope.profile.billingInfo && form.$invalid) {
                $scope.submitted.payment = true;
                return;
            }
            $scope.subscribing = true;
            $scope.subscriptionError = false;
            if ($scope.profile.billingInfo) {
                ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'Subscribe', eventLabel: 'Subscription Start' });
                User.subscribeWithExistingCC($scope.currentPlan._id).then(function(data) {
                    if (!data.data.error) {
                        ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'Subscribe', eventLabel: 'Subscription Success' });
                        form.$setPristine();
                        form.$setUntouched();
                        $scope.payment = {};
                        $scope.submitted.payment = false;
                        $scope.subscriptionSuccess = true;
                        var subscription = [];
                        subscription.push(data.data.content)
                        AuthService.setSubscription(subscription);
                        $scope.subscription = data.data.content;
                        // $scope.profile = User;


                        if (($scope.currentPlan.subscriptionLength == 12 || $scope.currentPlan.subscriptionLength == 6) && $scope.currentPlan.campaign_count < $scope.currentPlan.campaign_max_count && $scope.currentPlan.campaign_active) {
                            $scope.campain = true;

                        }
                    } else {
                        ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'Subscribe', eventLabel: 'Subscription Error' });
                        $scope.subscriptionError = data.data.message;
                    }
                    $scope.subscribing = false;
                });

            } else {
                $scope.payment.pi_year = $scope.payment.pi_month + '/' + $scope.payment.pi_year;
                $scope.payment.pi_number = $scope.payment.pi_number.replace(/\s+/g, '');
                ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'Subscribe', eventLabel: 'Subscription Start' });
                User.subscribe($scope.payment, $scope.currentPlan._id).then(
                    function(data) {
                        if (!data.data.error) {
                            ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'Subscribe', eventLabel: 'Subscription Success' });
                            form.$setPristine();
                            form.$setUntouched();
                            $scope.payment = {};
                            $scope.submitted.payment = false;
                            var subscription = [];
                            subscription.push(data.data.content)
                            AuthService.setSubscription(subscription);
                            $scope.subscription = data.data.content;
                            // User.subscriptionPlan = data.data.content;
                            // $scope.profile = User;
                            $scope.subscriptionSuccess = true;
                            if (($scope.currentPlan.subscriptionLength == 12 || $scope.currentPlan.subscriptionLength == 6) && $scope.currentPlan.campaign_count < $scope.currentPlan.campaign_max_count && $scope.currentPlan.campaign_active) {
                                $scope.campain = true;
                            }
                        } else {
                            ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'Subscribe', eventLabel: 'Subscription Error' });
                            $scope.subscriptionError = data.data.message;
                        }
                        $scope.subscribing = false;
                    }
                );
            }

        };

        $scope.showPlan = function() {
            $scope.pay = false;
            $scope.changingPlan = false;
            $scope.subscriptionSuccess = false;
        }

        countriesFactory.getCountries().then(function(data) {
            $scope.countries = data;
        });

        $scope.sendSms = function() {
            if ($scope.country >= 0 && $scope.phone >= 10000000) {
                $scope.validationError = '';
                $scope.editPhone = false;
                smsFactory.sendValidationSMS($scope.countries[$scope.country].callingCodes[0] + $scope.phone);
            }
        }

        $scope.validate = function() {
            if ($scope.code >= 99999) {
                $scope.validationError = '';
                smsFactory.validatePin($scope.code, $scope.countries[$scope.country].callingCodes[0] + $scope.phone).then(function(data) {
                    if (data) {
                        $scope.phoneValidated = true;
                        $scope.editPhone = true;
                    } else
                        $scope.validationError = "Incorrect Code";
                });
            } else
                $scope.validationError = "Incorrect Code";
        }

        $scope.modify = function() {
            $scope.pay = false;
            $scope.paymentType = "none";
        };
    
        $scope.changePaymentType = function(type) {
            $scope.paymentType = type;
        };

        $scope.buy = function(plan) {
            $scope.currentPlan = plan;
            $scope.pay = true;

            $scope.currentPlan = plan;
            $scope.pay = true;
       
        };

        $scope.payWithCreditCard = function() {
            globalFactory.createRequest($scope.currentPlan).then(function(data) {
                console.log(data)
                if(data.message == 'ok'){
                    window.location.href = data.content.processUrl;
                }
            });
        };

        globalFactory.getSubscriptionPlans().then(function(data) {
            $scope.plans = data.content.entries;
        });

        $scope.$watch('profile', function(newValue, oldValue) {
            if ($scope.profile.transactionalPlans && $scope.profile.transactionalPlans.length)
                $scope.getMyTVods();
        }, true);


        $scope.getMyTVods = function() {
            var ids = [];
            $scope.profile.transactionalPlans.forEach(plan => {
                if (plan.contractEndDate >= (new Date()).valueOf())
                    ids.push(plan.media_id);
            });
            if (ids.length) {
                tVodFactory.list_clips(ids.join("|")).then(function(data) {
                    $scope.myTransClips = data;
                });
                tVodFactory.list_shows(ids.join("|")).then(function(data) {
                    $scope.myTransShows = data;
                });
            }
        };

        $scope.cancelCampaign = function() {
            $scope.campain = false;
        };

        $scope.sendShippingAddress = function() {
            $scope.campaignUpdate = true;
            $scope.shippingInfo.email = User.email;
            //console.log($scope.shippingInfo);
            User.sendUserShippingAddress($scope.plans[3]._id, $scope.shippingInfo).then(function(data) {
                if (!data.data.error) {
                    $scope.campainMessage = true;
                }
                $scope.campaignUpdate = false;

            });
        };

        globalFactory.getUserClips($scope.profile._id).then(function(clips){
            $scope.clips = clips;
        })


        $scope.getWalletTransactions = function(userId, page) {

            var params = {};
            params["paymentInfo.type"] = "wallet";

            return globalFactory.getUserTransactions(userId, page, $scope.transactionsPerPage, "added", -1, params);
        }

        //Paginate
        $scope.getTransactionsPage = function(pageNum) {
            $scope.loadingTransactions = true;
            $scope.getWalletTransactions($scope.profile._id, pageNum).then(function(result) {;
                if (!pageNum)
                    $scope.transactions = result.content.entries;
                else {
                    $scope.transactions = $scope.transactions.concat(result.content.entries);
                }

                if (result.content.entries.length < $scope.transactionsPerPage) {
                    $scope.showMoreTransactions = false;
                } else {
                    $scope.showMoreTransactions = true;
                }
                $scope.loadingTransactions = false;
            })


        }

        $scope.nextPageTransactions = function() {
            $scope.getTransactionsPage(++$scope.transactionsPage);
        }

        if($scope.wallet){
            $scope.getTransactionsPage(0);
        }

        $scope.enoghCredits = function() {

            return $scope.currentPlan.price <= $scope.wallet.credits;
    
        }

        AuthService.getWallet().then(function(data) {
            $scope.wallet = data.data.content;
        });



    });