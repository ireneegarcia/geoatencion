(function () {
  'use strict';

  describe('Estadisticas Route Tests', function () {
    // Initialize global variables
    var $scope,
      EstadisticasService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _EstadisticasService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      EstadisticasService = _EstadisticasService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('estadisticas');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/estadisticas');
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
          EstadisticasController,
          mockEstadistica;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('estadisticas.view');
          $templateCache.put('modules/estadisticas/client/views/view-estadistica.client.view.html', '');

          // create mock Estadistica
          mockEstadistica = new EstadisticasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Estadistica Name'
          });

          // Initialize Controller
          EstadisticasController = $controller('EstadisticasController as vm', {
            $scope: $scope,
            estadisticaResolve: mockEstadistica
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:estadisticaId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.estadisticaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            estadisticaId: 1
          })).toEqual('/estadisticas/1');
        }));

        it('should attach an Estadistica to the controller scope', function () {
          expect($scope.vm.estadistica._id).toBe(mockEstadistica._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/estadisticas/client/views/view-estadistica.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          EstadisticasController,
          mockEstadistica;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('estadisticas.create');
          $templateCache.put('modules/estadisticas/client/views/form-estadistica.client.view.html', '');

          // create mock Estadistica
          mockEstadistica = new EstadisticasService();

          // Initialize Controller
          EstadisticasController = $controller('EstadisticasController as vm', {
            $scope: $scope,
            estadisticaResolve: mockEstadistica
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.estadisticaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/estadisticas/create');
        }));

        it('should attach an Estadistica to the controller scope', function () {
          expect($scope.vm.estadistica._id).toBe(mockEstadistica._id);
          expect($scope.vm.estadistica._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/estadisticas/client/views/form-estadistica.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          EstadisticasController,
          mockEstadistica;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('estadisticas.edit');
          $templateCache.put('modules/estadisticas/client/views/form-estadistica.client.view.html', '');

          // create mock Estadistica
          mockEstadistica = new EstadisticasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Estadistica Name'
          });

          // Initialize Controller
          EstadisticasController = $controller('EstadisticasController as vm', {
            $scope: $scope,
            estadisticaResolve: mockEstadistica
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:estadisticaId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.estadisticaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            estadisticaId: 1
          })).toEqual('/estadisticas/1/edit');
        }));

        it('should attach an Estadistica to the controller scope', function () {
          expect($scope.vm.estadistica._id).toBe(mockEstadistica._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/estadisticas/client/views/form-estadistica.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
