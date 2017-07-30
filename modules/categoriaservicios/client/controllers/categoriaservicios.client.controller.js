(function () {
  'use strict';

  // Categoriaservicios controller
  angular
    .module('categoriaservicios')
    .controller('CategoriaserviciosController', CategoriaserviciosController);

  CategoriaserviciosController.$inject = ['$scope', '$state', '$window', 'Authentication', 'categoriaservicioResolve', 'Upload'];

  function CategoriaserviciosController ($scope, $state, $window, Authentication, categoriaservicio, Upload) {
    var vm = this;

    vm.authentication = Authentication;
    vm.categoriaservicio = categoriaservicio;
    vm.error = null;
    vm.form = {};
    vm.fileSelected = false;
    vm.loading = false;
    vm.remove = remove;
    vm.save = save;

    vm.uploadIcon = function (dataUrl, id) {
      Upload.upload({
        url: '/api/categoriaservicios/' + id,
        data: {
          newIconPicture: dataUrl
        }
      }).then(function (res) {
        vm.fileSelected = false;
        vm.loading = false;
        $state.go('categoriaservicios.view', {
          categoriaservicioId: res.data._id
        });
      }, function (res) {
        vm.error = res.data.message;
      }, function (evt) {
        vm.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
      });
    };

    // Remove existing Categoriaservicio
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.categoriaservicio.$remove($state.go('categoriaservicios.list'));
      }
    }

    // Save Categoriaservicio
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.categoriaservicioForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.categoriaservicio._id) {
        vm.categoriaservicio.$update(successCallback, errorCallback);
      } else {
        vm.categoriaservicio.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        if (vm.fileSelected) {
          vm.uploadIcon(vm.picFile, res._id);
        } else {
          $state.go('categoriaservicios.view', {
            categoriaservicioId: res._id
          });
        }
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
