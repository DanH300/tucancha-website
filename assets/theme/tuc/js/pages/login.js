var lo = null;
uvodApp.controller('LoginController', function($scope, AuthService, User, $rootScope, $anchorScroll, $location, $window) {
    lo = $scope;
    $window.scrollTo(0, 0);
    $scope.categories = {};
    $scope.channels = {};
    $scope.root = $rootScope;
    $scope.user = User;
    $scope.devices = [];
    $scope.validDni = false;
    $scope.isForgotPassword = false;
    $scope.forgotInput = {
        email: ''
    };
    $scope.fbRegister = false;

    $scope.dniUpdate = {
        dni: '',
        dni_verify: '',
    }

    $scope.userLogin = {
        email: '',
        password: '',
        first_name: '',
        last_name: '',
    };

    $scope.userRegister = {
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        country: $rootScope.geo ? $rootScope.geo.countryCode : null,
        country_name: $rootScope.geo ? $rootScope.geo.country : null,
        user_ip: $rootScope.geo ? $rootScope.geo.query : null
    };

    $scope.go = function(url) {
        if (url == "terms-and-conditions") {
            $window.open('/#!/' + url, '_blank');
        } else {
            $location.path('/' + url);
            $('.loginModal').modal('hide');
        }
    };
    $scope.enableForgot = function() {
        // console.log('true!!');
        $scope.isForgotPassword = true;
    }
    $scope.logout = function() {
        AuthService.logout();
        $location.url('/');
    };

    $scope.deleteDevice = function(deviceId) {
        $scope.deletingDevice = true;
        $scope.userLogin = AuthService.getLoginUser();
        AuthService.deleteDevice(deviceId, $scope.userLogin.token).then(function(data) {
            $scope.loginUser();
        });
    };

    $scope.length = function(obj) {
        if (angular.isArray(obj)) {
            return obj.length;
        }
        if (!obj) {
            return 0;
        }
        return Object.keys(obj).length;
    };

    // Login model
    $scope.fbLogin = function() {
        $scope.fbLogging = true;
        FB.login(function(response) {
            if (response.authResponse) {

                FB.api('/me', { locale: 'en_US', fields: 'id,name,first_name,last_name,birthday,gender,email,picture' }, function(response) {
                    var geocode = $rootScope.geo ? $rootScope.geo.countryCode : null;
                    var countryName = $rootScope.geo ? $rootScope.geo.country : null;
                    var userIp = $rootScope.geo ? $rootScope.geo.query : null;
                    var deviceId = navigator.userAgent;
                    var fbData = response;

                    $scope.userLogin.fb_id = response.id;
                    $scope.loggedIn = true;
                    AuthService.setLoginUser($scope.userLogin);
                    AuthService.fbLogin(response.id, fbData, geocode, countryName, userIp, deviceId);
                });
            }
        }, { scope: 'public_profile,email' })

    }

    $scope.socialRegister = function() {
        if (!$scope.userRegister.termsFacebook) {
            $scope.noTerms = true;
            return;
        }
        window.open('index.php/hauth/login/Facebook', 'fb', 'left=20,top=20,width=500,height=400,toolbar=1,resizable=0');
        $scope.root.showRegister = false;
        $scope.fbRegister = true;
        $rootScope.socialLogin = true;
    }

    $scope.loginUser = function() {
        $scope.loginError = null;
        $scope.passwordSuccess = null;
        var geocode = $rootScope.geo ? $rootScope.geo.countryCode : null;
        var countryName = $rootScope.geo ? $rootScope.geo.country : null;
        var userIp = $rootScope.geo ? $rootScope.geo.query : null;
        var deviceId = navigator.userAgent;
        if (!$scope.userLogin.email || !$scope.userLogin.password)
            $scope.loginError = "Please Type Email and Password";
        else {
            $scope.logging = true;
            $scope.loggedIn = true;
            AuthService.setLoginUser($scope.userLogin);
            AuthService.login($scope.userLogin.email, $scope.userLogin.password, $scope.userLogin.remember_me, geocode, countryName, userIp, deviceId);
        }

    };

    $scope.allowLogin = function() {
        if ($scope.userLogin.email && $scope.userLogin.password && $scope.userLogin.password.length > 0)
            return true;
        return false;
    }

    $scope.openRegisterModel = function() {
        $scope.root.showRegister = true;
        $('.loginModal').modal('show');
    };


    $scope.resetPassword = function() {
        if ($scope.forgotInput.email)
            AuthService.resetPassword($scope.forgotInput.email).then(function(data) {
                if (data.data) {
                    $scope.isForgotPassword = false;
                    $scope.passwordSuccess = "Your new Password has been sent to your e-mail";
                } else
                    $scope.forgotError = "You are not registered please register";
            });
        else {
            $scope.forgotError = "Please Type Your Email";
        }
    };

    $scope.$on("auth-login-success", function() {
        $scope.user = angular.copy(User);
        if ($scope.user && $scope.user.email) $('.loginModal').modal('hide');
        if ($scope.loggedIn) {
            $('.loginModal').modal('hide');
            $('#devicesModal').modal('hide');
        }

        if ($scope.fbRegister) {
            setTimeout(function() {
                $('.registrationComplete').modal('show');
            }, 1200);
        }
        $scope.outOfDevicesList = false;
        $scope.logging = false;
        $scope.fbLogging = false;
        $scope.deletingDevice = false;
        $scope.userLogin = {
            email: '',
            password: '',
            first_name: '',
            last_name: '',
            remember_me: false
        };

        $scope.loginError = "";
        $scope.error = "";
        $scope.registering = false;
        $scope.updatingDni = false;
        $scope.fbRegister = false;

        //    $location.path('/');
    });

    $scope.$on("auth-login-error", function(event, args) {
        $scope.logging = false;
        $scope.loggedIn = false;
        $scope.loginError = args.message;
        $scope.userRegister.email = args.mail;
    });

    $scope.$on("device-login-error", function(event, args) {
        $('.loginModal').modal('hide');
        $scope.devices = args.content.devices;
        $('#devicesModal').modal('show');
        console.log('llego al device error');
        $scope.logging = false;
        $scope.fbLogging = false;
        $scope.userLogin.token = args.content.token;
        $scope.loggedIn = false;
        $scope.loginError = args.message;
        $scope.userRegister.email = args.mail;
    });

    $scope.$on("auth-register-success", function() {
        $scope.userRegister = {
            email: '',
            email_verify: '',
            password: '',
            password_verify: '',
            first_name: '',
            last_name: ''
        };
        $('.loginModal').modal('hide');
        // setTimeout(function() {
        //     $('.registrationComplete').modal('show');
        // }, 1200);

        // $scope.go('phone-validation');
    });

    $scope.$on("auth-register-error", function(event, args) {
        $scope.registering = false;
        if (args.message.includes('User already registered'))
            $scope.RegisterError = "User already registered!";
        else
            $scope.RegisterError = args.message;
    });

    $scope.$on("out-of-devices-error", function(event, args) {
        $scope.outOfDevicesList = true;
        $('.loginModal').modal('show');
    });

    $scope.$on("auth-logout", function() {
        $scope.user = User;
        $scope.loggedIn = false;
    });

    $('.loginModal').on('hidden.bs.modal', function() {
        $scope.userRegister = {
            email: '',
            email_verify: '',
            password: '',
            password_verify: '',
            first_name: '',
            last_name: ''
        };
        $scope.isForgotPassword = false;
        $scope.forgotInput = {
            email: ''
        };
        $scope.loginError = '';
        $scope.error = false;
        $scope.noTerms = false;
        $scope.loggedIn = false;
        $scope.root.showRegister = false;
        $scope.forgotError = false;
    })

    $scope.finished_login = function(data) {
        console.log('getting new user login');
        AuthService.getCurrentUser();
    };

    // Register model
    $scope.root.showRegister = false;

    $scope.userRegister = {
        email: '',
        email_verify: '',
        password: '',
        password_verify: '',
        first_name: '',
        last_name: '',
        dni: '',
        dni_verify: '',
        termsRegular: false,
        termsFacebook: false,
        country: $rootScope.geo ? $rootScope.geo.countryCode : null
    };

    $scope.openRegisterModel = function() {
        $scope.root.showRegister = true;
        $('.loginModal').modal('show');
    };

    $scope.openLoginModel = function() {
        $scope.root.showRegister = false;
        $('.loginModal').modal('show');
    };

    $scope.closeModel = function() {
        $('.loginModal').modal('hide');
    };

    $scope.closeDevicesModal = function() {
        $('#devicesModal').modal('hide');
    }

    $scope.disableUpdateDni = function() {
        if (!$scope.dniUpdate.dni || !$scope.dniUpdate.dni_verify || $scope.dniUpdate.dni != $scope.dniUpdate.dni_verify) return true;
    };

    $scope.disableRegister = function() {
        if (!$scope.userRegister.email || !$scope.userRegister.email_verify || !$scope.userRegister.password || !$scope.userRegister.password_verify || !$scope.userRegister.first_name || !$scope.userRegister.last_name || !$scope.userRegister.dni) return true;
    };

    $scope.updateDni = function() {
        $scope.updatingDni = true;
        AuthService.updateDni($scope.dniUpdate.dni).then(function() {
            $scope.updatingDni = false;
        });
    }

    $scope.validateDni = function() {
        var cad = document.getElementById("dni").value.trim();
        var total = 0;
        var longitud = cad.length;
        var longcheck = longitud - 1;

        if (cad !== "" && longitud === 10) {
            for (i = 0; i < longcheck; i++) {
                if (i % 2 === 0) {
                    var aux = cad.charAt(i) * 2;
                    if (aux > 9) aux -= 9;
                    total += aux;
                } else {
                    total += parseInt(cad.charAt(i)); // parseInt o concatenará en lugar de sumar
                }
            }

            total = total % 10 ? 10 - total % 10 : 0;

            if (cad.charAt(longitud - 1) == total) {
                $scope.validDni = true;
            } else {
                $scope.validDni = false;
            }
        }
    }

    $scope.registerUser = function() {
        $scope.noTerms = false;
        $scope.error = false;
        $scope.RegisterError = false;
        if ($scope.userRegister.email != $scope.userRegister.email_verify) {
            $scope.error = 'email';

        } else if ($scope.userRegister.password != $scope.userRegister.password_verify || $scope.userRegister.password.length < 8) {
            $scope.error = 'password';
        } else if ($scope.userRegister.dni != $scope.userRegister.dni_verify) {
            $scope.error = 'cédula';
        } else if (!$scope.userRegister.termsRegular) {
            $scope.noTerms = true;
        } else {
            $scope.registering = true;
            $scope.userRegister.country = $rootScope.geo ? $rootScope.geo.countryCode : null;
            $scope.data = angular.copy($scope.userRegister);
            delete $scope.data.email_verify;
            delete $scope.data.password_verify;
            delete $scope.data.termsRegular;
            delete $scope.data.termsFacebook;
            AuthService.register($scope.data);
        }
    };
});