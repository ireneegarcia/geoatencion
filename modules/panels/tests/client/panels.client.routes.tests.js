(function () {
  'use strict';

  describe('Panels Route Tests', function () {
    // Initialize global variables
    var $scope,
      PanelsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PanelsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PanelsService = _PanelsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('panels');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/panels');
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
          PanelsController,
          mockPanel;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('panels.view');
          $templateCache.put('modules/panels/client/views/view-panel.client.view.html', '');

          // create mock Panel
          mockPanel = new PanelsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Panel Name'
          });

          // Initialize Controller
          PanelsController = $controller('PanelsController as vm', {
            $scope: $scope,
            panelResolve: mockPanel
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:panelId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.panelResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            panelId: 1
          })).toEqual('/panels/1');
        }));

        it('should attach an Panel to the controller scope', function () {
          expect($scope.vm.panel._id).toBe(mockPanel._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/panels/client/views/view-panel.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PanelsController,
          mockPanel;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('panels.create');
          $templateCache.put('modules/panels/client/views/form-panel.client.view.html', '');

          // create mock Panel
          mockPanel = new PanelsService();

          // Initialize Controller
          PanelsController = $controller('PanelsController as vm', {
            $scope: $scope,
            panelResolve: mockPanel
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.panelResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/panels/create');
        }));

        it('should attach an Panel to the controller scope', function () {
          expect($scope.vm.panel._id).toBe(mockPanel._id);
          expect($scope.vm.panel._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/panels/client/views/form-panel.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PanelsController,
          mockPanel;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('panels.edit');
          $templateCache.put('modules/panels/client/views/form-panel.client.view.html', '');

          // create mock Panel
          mockPanel = new PanelsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Panel Name'
          });

          // Initialize Controller
          PanelsController = $controller('PanelsController as vm', {
            $scope: $scope,
            panelResolve: mockPanel
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:panelId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.panelResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            panelId: 1
          })).toEqual('/panels/1/edit');
        }));

        it('should attach an Panel to the controller scope', function () {
          expect($scope.vm.panel._id).toBe(mockPanel._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/panels/client/views/form-panel.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
