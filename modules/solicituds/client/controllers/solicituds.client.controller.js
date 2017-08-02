(function () {
  'use strict';

  // Solicituds controller
  angular
    .module('solicituds')
    .controller('SolicitudsController', SolicitudsController);

  SolicitudsController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'solicitudResolve', 'CategoriaserviciosService', 'ArticlesService'];

  function SolicitudsController ($scope, $filter, $state, $window, Authentication, solicitud, CategoriaserviciosService, ArticlesService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.solicitud = solicitud;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;


    CategoriaserviciosService.query({}).$promise.then(function (res) {
      vm.categories = [];
      res.forEach(function(cathegory) {
        vm.categories.push({id: cathegory._id, name: cathegory.category});
      });
    });

    ArticlesService.query({}).$promise.then(function (res) {
      vm.organism = [];
      res.forEach(function(organisms) {
        vm.organism.push({id: organisms._id, name: organisms.name, category: organisms.category});
      });
    });

    //Coloca la categoria de acuerdo al organismo
    $scope.putCategory = function(organism) {

      vm.categoria_organismo = [];

      for (var i=0;i<vm.categories.length;i++) {
        if (organism.category === vm.categories[i].id) {
          vm.categoria_organismo.push({id: vm.categories[i].id, name: vm.categories[i].name});
        }
      }

        //$scope.thing = $filter('filter')(vm.categories, { id: organism.category});
    };

    //Coloca las preguntas de acuerdo a la categoria
    $scope.putQuestion = function () {

    };

    // Remove existing Solicitud
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.solicitud.$remove($state.go('solicituds.list'));
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
