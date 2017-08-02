(function () {
  'use strict';

  angular
    .module('articles.admin')
    .controller('ArticlesAdminListController', ArticlesAdminListController);

  ArticlesAdminListController.$inject = ['ArticlesService', '$filter', 'AdminService', 'CategoriaserviciosService'];

  function ArticlesAdminListController(ArticlesService, $filter, CategoriaserviciosService) {
    var vm = this;

    vm.categories = [
      {id: 1, name: 'Asistencia bomberil'},
      {id: 2, name: 'Asistencia de seguridad'},
      {id: 3, name: 'Asistencia médica'},
      {id: 4, name: 'Todas las anteriores'},
      {id: 5, name: 'Otra categoría'},
      {id: 6, name: 'Diversas categorías'}
    ];

    CategoriaserviciosService.query({}).$promise.then(function (res) {
      vm.categories = [];
      res.forEach(function(cathegory) {
        vm.categories.push({id: cathegory._id, name: cathegory.category});
      });
    });

    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    vm.articles = ArticlesService.query(function (data) {
      vm.articles = data;
      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 5;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.articles, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }
  }
}());
