(function () {
  'use strict';

  describe('Alarmas Route Tests', function () {
    // Initialize global variables
    var $scope,
      AlarmasService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AlarmasService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AlarmasService = _AlarmasService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('alarmas');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/alarmas');
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
          AlarmasController,
          mockAlarma;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('alarmas.view');
          $templateCache.put('modules/alarmas/client/views/view-alarma.client.view.html', '');

          // create mock Alarma
          mockAlarma = new AlarmasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Alarma Name'
          });

          // Initialize Controller
          AlarmasController = $controller('AlarmasController as vm', {
            $scope: $scope,
            alarmaResolve: mockAlarma
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:alarmaId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.alarmaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            alarmaId: 1
          })).toEqual('/alarmas/1');
        }));

        it('should attach an Alarma to the controller scope', function () {
          expect($scope.vm.alarma._id).toBe(mockAlarma._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/alarmas/client/views/view-alarma.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AlarmasController,
          mockAlarma;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('alarmas.create');
          $templateCache.put('modules/alarmas/client/views/form-alarma.client.view.html', '');

          // create mock Alarma
          mockAlarma = new AlarmasService();

          // Initialize Controller
          AlarmasController = $controller('AlarmasController as vm', {
            $scope: $scope,
            alarmaResolve: mockAlarma
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.alarmaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/alarmas/create');
        }));

        it('should attach an Alarma to the controller scope', function () {
          expect($scope.vm.alarma._id).toBe(mockAlarma._id);
          expect($scope.vm.alarma._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/alarmas/client/views/form-alarma.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AlarmasController,
          mockAlarma;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('alarmas.edit');
          $templateCache.put('modules/alarmas/client/views/form-alarma.client.view.html', '');

          // create mock Alarma
          mockAlarma = new AlarmasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Alarma Name'
          });

          // Initialize Controller
          AlarmasController = $controller('AlarmasController as vm', {
            $scope: $scope,
            alarmaResolve: mockAlarma
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:alarmaId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.alarmaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            alarmaId: 1
          })).toEqual('/alarmas/1/edit');
        }));

        it('should attach an Alarma to the controller scope', function () {
          expect($scope.vm.alarma._id).toBe(mockAlarma._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/alarmas/client/views/form-alarma.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
