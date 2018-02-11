(function () {
  'use strict';

  angular
    .module('users')
    .controller('AuthenticationController', AuthenticationController);

  AuthenticationController.$inject = ['$scope', '$state', 'UsersService', '$location', '$window', 'Authentication', 'PasswordValidator', 'Notification', 'OrganismsService', 'AdminlogsServiceCreate', 'CategoriaserviciosService', 'OrganismsServiceCreate'];

  function AuthenticationController($scope, $state, UsersService, $location, $window, Authentication, PasswordValidator, Notification, OrganismsService, AdminlogsServiceCreate, CategoriaserviciosService, OrganismsServiceCreate) {
    var vm = this;

    vm.authentication = Authentication;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
    vm.signup = signup;
    vm.signupOrganism = signupOrganism;
    vm.signin = signin;
    vm.callOauthProvider = callOauthProvider;
    vm.usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;
    vm.categories = CategoriaserviciosService.query();

    // Get an eventual error defined in the URL query string:
    if ($location.search().err) {
      Notification.error({ message: $location.search().err });
    }

    // If user is signed in then redirect back home
    /* if (vm.authentication.user) {
     $location.path('/');
     }*/

    function signupOrganism(isValid) {
      if (vm.credentials) {

        if (!vm.credentials.organismName || !vm.credentials.organismEmail ||
          !vm.credentials.organismPhone || !vm.credentials.country ||
          !vm.credentials.organismAddress || !vm.credentials.organismCategory ||
          !vm.credentials.organism) {
          Notification.error({ title: '<i class="glyphicon glyphicon-remove"></i> Datos del organismo incompletos', delay: 6000 });
          return false;
        } else {
          // se valida que el rif y el email no esten en uso por otro organismo
          OrganismsService.query(function (data) {
            vm.organismRif = data.filter(function (data) {
              return (data.rif.indexOf(vm.credentials.organism) >= 0);
            });

            vm.organismEmail = data.filter(function (data) {
              return (data.email.indexOf(vm.credentials.organismEmail) >= 0);
            });

            if (vm.organismRif.length !== 0) {
              Notification.error({ title: '<i class="glyphicon glyphicon-remove"></i> Error, RIF en uso', delay: 6000 });
              return false;
            }

            if (vm.organismEmail.length !== 0) {
              Notification.error({ title: '<i class="glyphicon glyphicon-remove"></i> Error, Correo en uso', delay: 6000 });
              return false;
            }

            if (!isValid) {
              Notification.error({ title: '<i class="glyphicon glyphicon-remove"></i> Datos del administrador incompletos', delay: 6000 });
              return false;
            }

            // se crea el usuario
            // vm.credentials.typeUser = 'adminOrganism';
            UsersService.userSignup(vm.credentials)
              .then(onUserSignupSuccess)
              .catch(onUserSignupError);

            // se crea el organismo
            OrganismsServiceCreate.charge({
              name: vm.credentials.organismName,
              rif: vm.credentials.organism,
              phone: vm.credentials.organismPhone,
              category: vm.credentials.organismCategory,
              email: vm.credentials.organismEmail,
              country: vm.credentials.country,
              address: vm.credentials.organismAddress}, function (data) {
              // se realizo el post
            });

          });
        }

      } else {
        Notification.error({ title: '<i class="glyphicon glyphicon-remove"></i> Datos incompletos', delay: 6000 });
      }
    }

    function signup(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      if (vm.authentication.user !== null) {
        if (vm.authentication.user.organism !== null) {
          AdminlogsServiceCreate.charge({
            description: 'Ha registrado al usuario: ' + vm.credentials.firstName + ' ' + vm.credentials.lastName,
            module: 'usuario',
            organism: vm.authentication.organism}, function (data) {
            // se realizo el post
          });

          vm.credentials.organism = vm.authentication.user.organism;
          UsersService.userSignup(vm.credentials)
            .then(onUserSignupSuccess)
            .catch(onUserSignupError);
        }
      } else {
        UsersService.userSignup(vm.credentials)
          .then(onUserSignupSuccess)
          .catch(onUserSignupError);
      }
    }

    function signin(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      UsersService.userSignin(vm.credentials)
        .then(onUserSigninSuccess)
        .catch(onUserSigninError);
    }

    // OAuth provider request
    function callOauthProvider(url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    }

    // Authentication Callbacks

    function onUserSignupSuccess(response) {
      // If successful we assign the response to the global user model

      if (!response.user) {
        vm.authentication.user = response;
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Registro exitoso!' });
        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      } else {
        if (vm.credentials.organism !== undefined) {
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Registro exitoso!' });
          $state.go('user-list-networks');
        } else {
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Registro exitoso!' });
        }

      }
    }

    function onUserSignupError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Signup Error!', delay: 6000 });
    }

    function onUserSigninSuccess(response) {
      // If successful we assign the response to the global user model
      vm.authentication.user = response;
      Notification.info({ message: 'Bienvenido ' + response.firstName });
      // And redirect to the previous or home page
      $state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function onUserSigninError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Signin Error!', delay: 6000 });
    }
  }
}());
