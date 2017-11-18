(function () {
  'use strict';

  angular
    .module('users')
    .controller('AuthenticationController', AuthenticationController);

  AuthenticationController.$inject = ['$scope', '$state', 'UsersService', '$location', '$window', 'Authentication', 'PasswordValidator', 'Notification', 'OrganismsService', 'AdminlogsServiceCreate'];

  function AuthenticationController($scope, $state, UsersService, $location, $window, Authentication, PasswordValidator, Notification, OrganismsService, AdminlogsServiceCreate) {
    var vm = this;

    vm.authentication = Authentication;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
    vm.signup = signup;
    vm.signin = signin;
    vm.callOauthProvider = callOauthProvider;
    vm.usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;

    // Get an eventual error defined in the URL query string:
    if ($location.search().err) {
      Notification.error({ message: $location.search().err });
    }

    // If user is signed in then redirect back home
    /* if (vm.authentication.user) {
     $location.path('/');
     }*/

    function signup(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      if (vm.credentials.organism) {
        OrganismsService.query(function (data) {
          vm.organism = data.filter(function (data) {
            return (data.rif.indexOf(vm.credentials.organism) >= 0);
          });
          if (vm.organism.length !== 0) {
            AdminlogsServiceCreate.charge({
              description: 'Ha registrado al usuario: ' + vm.credentials.firstName + ' ' + vm.credentials.lastName,
              module: 'usuario',
              organism: vm.authentication.user.organism}, function (data) {
              // se realizo el post
            });
            UsersService.userSignup(vm.credentials)
              .then(onUserSignupSuccess)
              .catch(onUserSignupError);
          } else {
            Notification.error({ title: '<i class="glyphicon glyphicon-remove"></i> RIF inválido!', delay: 6000 });
          }
        });
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
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Signup successful!' });
        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      } else {
        if (vm.credentials.organism !== undefined) {
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Signup successful!' });
          $state.go('home');
        } else {
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Signup successful!' });
        }

      }
    }

    function onUserSignupError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Signup Error!', delay: 6000 });
    }

    function onUserSigninSuccess(response) {
      // If successful we assign the response to the global user model
      vm.authentication.user = response;
      Notification.info({ message: 'Welcome ' + response.firstName });
      // And redirect to the previous or home page
      $state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function onUserSigninError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Signin Error!', delay: 6000 });
    }
  }
}());
