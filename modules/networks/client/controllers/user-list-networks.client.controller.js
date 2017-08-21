(function () {
  'use strict';

  angular
    .module('networks')
    .controller('UserListNetworksController', UserListNetworksController);

  UserListNetworksController.$inject = ['$scope', '$filter', 'UsersService', 'Authentication'];

  function UserListNetworksController($scope, $filter, UsersService, Authentication) {
    var vm = this;

    // User list networks controller logic
    // ...

    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    //Condicional para encontrar el organismo relacionado
    if(Authentication.user.roles[0] === 'organism'){
      UsersService.query(function (data) {
        // El organismo logueado
        vm.organism = data.filter(function (data) {
          return (data.email.indexOf(Authentication.user.email) >= 0);
        });
        userListNetwork(vm.organism);
      });
    }else{
      if(Authentication.user.roles[0] === 'operator'){
        UsersService.query(function (data) {
          //El operador logueado
          var operator = data.filter(function (data) {
            return (data.email.indexOf(Authentication.user.email) >= 0);
          });
          // El organismo al que pertence el operador logueado
          vm.organism = data.filter(function (data) {
            return (data._id.indexOf(operator[0].user._id)>= 0);
          });
          userListNetwork(vm.organism);
        });
      }
    }

    // Funcion para listar Los usuarios operadores y responsables que sean de este organismo
    function userListNetwork(organism) {
      vm.userNetworks = UsersService.query(function (data) {
        vm.userNetworks = data.filter(function (userNetwork) {
          return ((userNetwork.roles.indexOf('operator') >= 0 ||
          userNetwork.roles.indexOf('serviceUser') >= 0) &&
          userNetwork.user._id.indexOf(organism[0]._id) >= 0);
        });
        vm.buildPager();
      });

      /*NetworksService.query(function (data) {
        data.forEach(function(network) {
          if(network.user._id === organism[0]._id){
            vm.networks.push(network);
          }
        });
        vm.buildPager();
      });*/
    }

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
}());
