(function () {
  'use strict';

  // Solicituds controller
  angular
    .module('solicituds')
    .controller('SolicitudsController', SolicitudsController);

  SolicitudsController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'solicitudResolve', 'CategoriaserviciosService', 'UsersService', 'FormulariosService', 'OrganismsService', 'Notification'];

  function SolicitudsController ($scope, $filter, $state, $window, Authentication, solicitud, CategoriaserviciosService, UsersService, FormulariosService, OrganismsService, Notification) {
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

    OrganismsService.query(function (data) {
      // Organismos

      vm.organism = data.filter(function (data) {
        return (data.isActive.indexOf('activo') >= 0);
      });
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
      // categoría
      vm.categorySelectedCreate = CategoriaserviciosService.query(function (data) {
        vm.categorySelectedCreate = $filter('filter')(data, { _id: vm.organismo[0].category});
      });
      // Filtrar fomrulario de acuerdo a la categoría del organismo
      vm.formulario = $filter('filter')(vm.forms, { category: vm.organismo[0].category});
    };

    // PARA EL FORMULARIO DE ACTUALIZAR
    vm.categorySelected = '';
    vm.categorySelected = CategoriaserviciosService.query(function (data) {
      vm.categorySelected = $filter('filter')(data, { _id: vm.solicitud.category});
    });

    vm.formSelected = FormulariosService.query(function (data) {
      vm.formSelected = $filter('filter')(data, { category: vm.solicitud.category});
    });

    // Remove existing Solicitud
    function remove() {
      if ($window.confirm('¿Está seguro de que desea eliminar esta solicitud?')) {
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
        $state.go('solicituds.list-organism', {
          // solicitudId: res._id
        });
      }
      function errorCallback(res) {

        vm.error = res.data.message;
      }
    }


    // Save Solicitud
    function save(isValid, num) {

      if (num === 0) {
        if (vm.categorySelectedCreate.length !== 0) {
          vm.solicitud.category = vm.categorySelectedCreate[0]._id;
        } else {
          Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Campo categoría vacío', delay: 6000 });
          vm.solicitud.category = '';
        }
      }


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
