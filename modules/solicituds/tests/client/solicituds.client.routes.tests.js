(function () {
  'use strict';

  describe('Solicituds Route Tests', function () {
    // Initialize global variables
    var $scope,
      SolicitudsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SolicitudsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SolicitudsService = _SolicitudsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('solicituds');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/solicituds');
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
          SolicitudsController,
          mockSolicitud;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('solicituds.view');
          $templateCache.put('modules/solicituds/client/views/view-solicitud.client.view.html', '');

          // create mock Solicitud
          mockSolicitud = new SolicitudsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Solicitud Name'
          });

          // Initialize Controller
          SolicitudsController = $controller('SolicitudsController as vm', {
            $scope: $scope,
            solicitudResolve: mockSolicitud
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:solicitudId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.solicitudResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            solicitudId: 1
          })).toEqual('/solicituds/1');
        }));

        it('should attach an Solicitud to the controller scope', function () {
          expect($scope.vm.solicitud._id).toBe(mockSolicitud._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/solicituds/client/views/view-solicitud.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SolicitudsController,
          mockSolicitud;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('solicituds.create');
          $templateCache.put('modules/solicituds/client/views/form-solicitud.client.view.html', '');

          // create mock Solicitud
          mockSolicitud = new SolicitudsService();

          // Initialize Controller
          SolicitudsController = $controller('SolicitudsController as vm', {
            $scope: $scope,
            solicitudResolve: mockSolicitud
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.solicitudResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/solicituds/create');
        }));

        it('should attach an Solicitud to the controller scope', function () {
          expect($scope.vm.solicitud._id).toBe(mockSolicitud._id);
          expect($scope.vm.solicitud._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/solicituds/client/views/form-solicitud.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SolicitudsController,
          mockSolicitud;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('solicituds.edit');
          $templateCache.put('modules/solicituds/client/views/form-solicitud.client.view.html', '');

          // create mock Solicitud
          mockSolicitud = new SolicitudsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Solicitud Name'
          });

          // Initialize Controller
          SolicitudsController = $controller('SolicitudsController as vm', {
            $scope: $scope,
            solicitudResolve: mockSolicitud
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:solicitudId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.solicitudResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            solicitudId: 1
          })).toEqual('/solicituds/1/edit');
        }));

        it('should attach an Solicitud to the controller scope', function () {
          expect($scope.vm.solicitud._id).toBe(mockSolicitud._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/solicituds/client/views/form-solicitud.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
