(function () {
  'use strict';

  describe('Adminlogs Route Tests', function () {
    // Initialize global variables
    var $scope,
      AdminlogsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AdminlogsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AdminlogsService = _AdminlogsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('adminlogs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/adminlogs');
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
          AdminlogsController,
          mockAdminlog;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('adminlogs.view');
          $templateCache.put('modules/adminlogs/client/views/view-adminlog.client.view.html', '');

          // create mock Adminlog
          mockAdminlog = new AdminlogsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Adminlog Name'
          });

          // Initialize Controller
          AdminlogsController = $controller('AdminlogsController as vm', {
            $scope: $scope,
            adminlogResolve: mockAdminlog
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:adminlogId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.adminlogResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            adminlogId: 1
          })).toEqual('/adminlogs/1');
        }));

        it('should attach an Adminlog to the controller scope', function () {
          expect($scope.vm.adminlog._id).toBe(mockAdminlog._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/adminlogs/client/views/view-adminlog.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AdminlogsController,
          mockAdminlog;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('adminlogs.create');
          $templateCache.put('modules/adminlogs/client/views/form-adminlog.client.view.html', '');

          // create mock Adminlog
          mockAdminlog = new AdminlogsService();

          // Initialize Controller
          AdminlogsController = $controller('AdminlogsController as vm', {
            $scope: $scope,
            adminlogResolve: mockAdminlog
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.adminlogResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/adminlogs/create');
        }));

        it('should attach an Adminlog to the controller scope', function () {
          expect($scope.vm.adminlog._id).toBe(mockAdminlog._id);
          expect($scope.vm.adminlog._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/adminlogs/client/views/form-adminlog.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AdminlogsController,
          mockAdminlog;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('adminlogs.edit');
          $templateCache.put('modules/adminlogs/client/views/form-adminlog.client.view.html', '');

          // create mock Adminlog
          mockAdminlog = new AdminlogsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Adminlog Name'
          });

          // Initialize Controller
          AdminlogsController = $controller('AdminlogsController as vm', {
            $scope: $scope,
            adminlogResolve: mockAdminlog
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:adminlogId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.adminlogResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            adminlogId: 1
          })).toEqual('/adminlogs/1/edit');
        }));

        it('should attach an Adminlog to the controller scope', function () {
          expect($scope.vm.adminlog._id).toBe(mockAdminlog._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/adminlogs/client/views/form-adminlog.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
