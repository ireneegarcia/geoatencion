(function () {
  'use strict';

  // Solicituds controller
  angular
    .module('solicituds')
    .controller('SolicitudsController', SolicitudsController);

  SolicitudsController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'solicitudResolve', 'CategoriaserviciosService', 'UsersService', 'FormulariosService'];

  function SolicitudsController ($scope, $filter, $state, $window, Authentication, solicitud, CategoriaserviciosService, UsersService, FormulariosService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.solicitud = solicitud;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.updateStatus = updateStatus;

    CategoriaserviciosService.query({}).$promise.then(function (res) {
      vm.categories = [];
      res.forEach(function(cathegory) {
        vm.categories.push({id: cathegory._id, name: cathegory.category});
      });
    });

    vm.organism = UsersService.query(function (data) {
      vm.organism = $filter('filter')(data, { roles: 'organism'});
    });

    FormulariosService.query({}).$promise.then(function (res) {
      vm.forms = [];
      res.forEach(function(forms) {
        vm.forms.push({id: forms._id, name: forms.name, category: forms.category, question1: forms.question1, question2: forms.question2, question3: forms.question3, question4: forms.question4});
      });
    });

    // PARA EL FORMULARIO DE CREAR
    $scope.putCategory = function(organism) {

      // Filtrar organismo
      vm.organismo = $filter('filter')(vm.organism, { _id: organism});
      // Filtrar fomrulario de acuerdo a la categoría del organismo
      vm.formulario = $filter('filter')(vm.forms, { category: vm.organismo[0].category});
    };

    // PARA EL FORMULARIO DE ACTUALIZAR
    vm.categorySelected = CategoriaserviciosService.query(function (data) {
      vm.categorySelected = $filter('filter')(data, { _id: vm.solicitud.category});
    });

    vm.formSelected = FormulariosService.query(function (data) {
      vm.formSelected = $filter('filter')(data, { category: vm.solicitud.category});
    });

    // Remove existing Solicitud
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.solicitud.$remove($state.go('solicituds.list'));
      }
    }

    function updateStatus(status) {

      vm.solicitud.isCurrentUserOwner = true;
      vm.solicitud.status = status;

      if (status === 'aceptado') {
        vm.solicitud.iconUrl = './modules/solicituds/client/img/accept.png';
      }
      if (status === 'rechazado') {
        vm.solicitud.iconUrl = './modules/solicituds/client/img/decline.png';
      }

      vm.solicitud.$update(successCallback, errorCallback);

      function successCallback(res) {
        $state.go('solicituds.list', {
          // solicitudId: res._id
        });
      }
      function errorCallback(res) {

        vm.error = res.data.message;
      }
    }

    // Save Solicitud
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.solicitudForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.solicitud._id) {
        vm.solicitud.$update(successCallback, errorCallback);
      } else {
        vm.solicitud.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('solicituds.view', {
          solicitudId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
