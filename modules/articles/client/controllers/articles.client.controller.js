(function () {
  'use strict';

  angular
    .module('articles')
    .controller('ArticlesController', ArticlesController);

  ArticlesController.$inject = ['$scope', 'articleResolve', 'Authentication', 'CategoriaserviciosService'];

  function ArticlesController($scope, article, Authentication, CategoriaserviciosService) {
    var vm = this;

    vm.article = article;
    vm.authentication = Authentication;
    vm.categories = [
      {id: 1, name: 'Asistencia bomberil'},
      {id: 2, name: 'Asistencia de seguridad'},
      {id: 3, name: 'Asistencia médica'},
      {id: 4, name: 'Todas las anteriores'},
      {id: 5, name: 'Otra categoría'},
      {id: 6, name: 'Diversas categorías'},
    ];

    CategoriaserviciosService.query({}).$promise.then(function (res) {
      vm.categories = [];
      res.forEach(function(cathegory) {
        vm.categories.push({id: cathegory._id, name: cathegory.category});
      });
    });


  }
}());
