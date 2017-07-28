(function () {
  'use strict';

  describe('Categoriaservicios Route Tests', function () {
    // Initialize global variables
    var $scope,
      CategoriaserviciosService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CategoriaserviciosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CategoriaserviciosService = _CategoriaserviciosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('categoriaservicios');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/categoriaservicios');
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
          CategoriaserviciosController,
          mockCategoriaservicio;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('categoriaservicios.view');
          $templateCache.put('modules/categoriaservicios/client/views/view-categoriaservicio.client.view.html', '');

          // create mock Categoriaservicio
          mockCategoriaservicio = new CategoriaserviciosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Categoriaservicio Name'
          });

          // Initialize Controller
          CategoriaserviciosController = $controller('CategoriaserviciosController as vm', {
            $scope: $scope,
            categoriaservicioResolve: mockCategoriaservicio
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:categoriaservicioId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.categoriaservicioResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            categoriaservicioId: 1
          })).toEqual('/categoriaservicios/1');
        }));

        it('should attach an Categoriaservicio to the controller scope', function () {
          expect($scope.vm.categoriaservicio._id).toBe(mockCategoriaservicio._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/categoriaservicios/client/views/view-categoriaservicio.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CategoriaserviciosController,
          mockCategoriaservicio;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('categoriaservicios.create');
          $templateCache.put('modules/categoriaservicios/client/views/form-categoriaservicio.client.view.html', '');

          // create mock Categoriaservicio
          mockCategoriaservicio = new CategoriaserviciosService();

          // Initialize Controller
          CategoriaserviciosController = $controller('CategoriaserviciosController as vm', {
            $scope: $scope,
            categoriaservicioResolve: mockCategoriaservicio
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.categoriaservicioResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/categoriaservicios/create');
        }));

        it('should attach an Categoriaservicio to the controller scope', function () {
          expect($scope.vm.categoriaservicio._id).toBe(mockCategoriaservicio._id);
          expect($scope.vm.categoriaservicio._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/categoriaservicios/client/views/form-categoriaservicio.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CategoriaserviciosController,
          mockCategoriaservicio;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('categoriaservicios.edit');
          $templateCache.put('modules/categoriaservicios/client/views/form-categoriaservicio.client.view.html', '');

          // create mock Categoriaservicio
          mockCategoriaservicio = new CategoriaserviciosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Categoriaservicio Name'
          });

          // Initialize Controller
          CategoriaserviciosController = $controller('CategoriaserviciosController as vm', {
            $scope: $scope,
            categoriaservicioResolve: mockCategoriaservicio
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:categoriaservicioId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.categoriaservicioResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            categoriaservicioId: 1
          })).toEqual('/categoriaservicios/1/edit');
        }));

        it('should attach an Categoriaservicio to the controller scope', function () {
          expect($scope.vm.categoriaservicio._id).toBe(mockCategoriaservicio._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/categoriaservicios/client/views/form-categoriaservicio.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
