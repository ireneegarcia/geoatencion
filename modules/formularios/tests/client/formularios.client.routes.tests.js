(function () {
  'use strict';

  describe('Formularios Route Tests', function () {
    // Initialize global variables
    var $scope,
      FormulariosService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _FormulariosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      FormulariosService = _FormulariosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('formularios');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/formularios');
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
          FormulariosController,
          mockFormulario;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('formularios.view');
          $templateCache.put('modules/formularios/client/views/view-formulario.client.view.html', '');

          // create mock Formulario
          mockFormulario = new FormulariosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Formulario Name'
          });

          // Initialize Controller
          FormulariosController = $controller('FormulariosController as vm', {
            $scope: $scope,
            formularioResolve: mockFormulario
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:formularioId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.formularioResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            formularioId: 1
          })).toEqual('/formularios/1');
        }));

        it('should attach an Formulario to the controller scope', function () {
          expect($scope.vm.formulario._id).toBe(mockFormulario._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/formularios/client/views/view-formulario.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          FormulariosController,
          mockFormulario;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('formularios.create');
          $templateCache.put('modules/formularios/client/views/form-formulario.client.view.html', '');

          // create mock Formulario
          mockFormulario = new FormulariosService();

          // Initialize Controller
          FormulariosController = $controller('FormulariosController as vm', {
            $scope: $scope,
            formularioResolve: mockFormulario
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.formularioResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/formularios/create');
        }));

        it('should attach an Formulario to the controller scope', function () {
          expect($scope.vm.formulario._id).toBe(mockFormulario._id);
          expect($scope.vm.formulario._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/formularios/client/views/form-formulario.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          FormulariosController,
          mockFormulario;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('formularios.edit');
          $templateCache.put('modules/formularios/client/views/form-formulario.client.view.html', '');

          // create mock Formulario
          mockFormulario = new FormulariosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Formulario Name'
          });

          // Initialize Controller
          FormulariosController = $controller('FormulariosController as vm', {
            $scope: $scope,
            formularioResolve: mockFormulario
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:formularioId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.formularioResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            formularioId: 1
          })).toEqual('/formularios/1/edit');
        }));

        it('should attach an Formulario to the controller scope', function () {
          expect($scope.vm.formulario._id).toBe(mockFormulario._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/formularios/client/views/form-formulario.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
