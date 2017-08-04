(function () {
  'use strict';

  describe('Catalogos Route Tests', function () {
    // Initialize global variables
    var $scope,
      CatalogosService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CatalogosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CatalogosService = _CatalogosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('catalogos');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/catalogos');
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
          CatalogosController,
          mockCatalogo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('catalogos.view');
          $templateCache.put('modules/catalogos/client/views/view-catalogo.client.view.html', '');

          // create mock Catalogo
          mockCatalogo = new CatalogosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Catalogo Name'
          });

          // Initialize Controller
          CatalogosController = $controller('CatalogosController as vm', {
            $scope: $scope,
            catalogoResolve: mockCatalogo
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:catalogoId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.catalogoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            catalogoId: 1
          })).toEqual('/catalogos/1');
        }));

        it('should attach an Catalogo to the controller scope', function () {
          expect($scope.vm.catalogo._id).toBe(mockCatalogo._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/catalogos/client/views/view-catalogo.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CatalogosController,
          mockCatalogo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('catalogos.create');
          $templateCache.put('modules/catalogos/client/views/form-catalogo.client.view.html', '');

          // create mock Catalogo
          mockCatalogo = new CatalogosService();

          // Initialize Controller
          CatalogosController = $controller('CatalogosController as vm', {
            $scope: $scope,
            catalogoResolve: mockCatalogo
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.catalogoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/catalogos/create');
        }));

        it('should attach an Catalogo to the controller scope', function () {
          expect($scope.vm.catalogo._id).toBe(mockCatalogo._id);
          expect($scope.vm.catalogo._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/catalogos/client/views/form-catalogo.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CatalogosController,
          mockCatalogo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('catalogos.edit');
          $templateCache.put('modules/catalogos/client/views/form-catalogo.client.view.html', '');

          // create mock Catalogo
          mockCatalogo = new CatalogosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Catalogo Name'
          });

          // Initialize Controller
          CatalogosController = $controller('CatalogosController as vm', {
            $scope: $scope,
            catalogoResolve: mockCatalogo
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:catalogoId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.catalogoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            catalogoId: 1
          })).toEqual('/catalogos/1/edit');
        }));

        it('should attach an Catalogo to the controller scope', function () {
          expect($scope.vm.catalogo._id).toBe(mockCatalogo._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/catalogos/client/views/form-catalogo.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
