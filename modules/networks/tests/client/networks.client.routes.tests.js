(function () {
  'use strict';

  describe('Networks Route Tests', function () {
    // Initialize global variables
    var $scope,
      NetworksService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _NetworksService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      NetworksService = _NetworksService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('networks');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/networks');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          NetworksController,
          mockNetwork;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('networks.view');
          $templateCache.put('modules/networks/client/views/view-network.client.view.html', '');

          // create mock Network
          mockNetwork = new NetworksService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Network Name'
          });

          // Initialize Controller
          NetworksController = $controller('NetworksController as vm', {
            $scope: $scope,
            networkResolve: mockNetwork
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:networkId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.networkResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            networkId: 1
          })).toEqual('/networks/1');
        }));

        it('should attach an Network to the controller scope', function () {
          expect($scope.vm.network._id).toBe(mockNetwork._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/networks/client/views/view-network.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          NetworksController,
          mockNetwork;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('networks.create');
          $templateCache.put('modules/networks/client/views/form-network.client.view.html', '');

          // create mock Network
          mockNetwork = new NetworksService();

          // Initialize Controller
          NetworksController = $controller('NetworksController as vm', {
            $scope: $scope,
            networkResolve: mockNetwork
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.networkResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/networks/create');
        }));

        it('should attach an Network to the controller scope', function () {
          expect($scope.vm.network._id).toBe(mockNetwork._id);
          expect($scope.vm.network._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/networks/client/views/form-network.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          NetworksController,
          mockNetwork;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('networks.edit');
          $templateCache.put('modules/networks/client/views/form-network.client.view.html', '');

          // create mock Network
          mockNetwork = new NetworksService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Network Name'
          });

          // Initialize Controller
          NetworksController = $controller('NetworksController as vm', {
            $scope: $scope,
            networkResolve: mockNetwork
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:networkId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.networkResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            networkId: 1
          })).toEqual('/networks/1/edit');
        }));

        it('should attach an Network to the controller scope', function () {
          expect($scope.vm.network._id).toBe(mockNetwork._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/networks/client/views/form-network.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
