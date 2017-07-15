(function () {
  'use strict';

  angular
    .module('formularios')
    .controller('FormulariosListController', FormulariosListController);

  FormulariosListController.$inject = ['FormulariosService'];

  function FormulariosListController(FormulariosService) {
    var vm = this;

    vm.formularios = FormulariosService.query();
  }
}());
