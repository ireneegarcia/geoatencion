(function() {
  'use strict';

  angular
    .module('networks')
    .controller('UserListNetworksController', UserListNetworksController);

  UserListNetworksController.$inject = ['$scope', '$filter', 'UsersService'];

  function UserListNetworksController($scope, $filter, UsersService) {
    var vm = this;

    // User list networks controller logic
    // ...

    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    vm.userNetworks = UsersService.query(function (data) {
      // vm.users = data;

      vm.userNetworks = data.filter(function (userNetwork) {
        return (userNetwork.roles.indexOf('operator') >= 0 || userNetwork.roles.indexOf('userService') >= 0);
      });

      // vm.userNetworks = $filter('filter')(data, { roles: 'operator' || 'userService'});
      // vm.userService = $filter('filter')(data, { roles: 'userService'});

      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 5;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.userNetworks, {
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

    init();

    function init() {
    }
  }
})();
