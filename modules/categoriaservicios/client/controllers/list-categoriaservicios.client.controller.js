(function () {
  'use strict';

  angular
    .module('categoriaservicios')
    .controller('CategoriaserviciosListController', CategoriaserviciosListController);

  CategoriaserviciosListController.$inject = ['CategoriaserviciosService'];

  function CategoriaserviciosListController(CategoriaserviciosService) {
    var vm = this;

    vm.categoriaservicios = CategoriaserviciosService.query();
  }
}());
