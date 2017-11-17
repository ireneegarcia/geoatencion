(function () {
  'use strict';

  describe('Mobileunitlogs Route Tests', function () {
    // Initialize global variables
    var $scope,
      MobileunitlogsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MobileunitlogsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MobileunitlogsService = _MobileunitlogsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('mobileunitlogs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/mobileunitlogs');
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
          MobileunitlogsController,
          mockMobileunitlog;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('mobileunitlogs.view');
          $templateCache.put('modules/mobileunitlogs/client/views/view-mobileunitlog.client.view.html', '');

          // create mock Mobileunitlog
          mockMobileunitlog = new MobileunitlogsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Mobileunitlog Name'
          });

          // Initialize Controller
          MobileunitlogsController = $controller('MobileunitlogsController as vm', {
            $scope: $scope,
            mobileunitlogResolve: mockMobileunitlog
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:mobileunitlogId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.mobileunitlogResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            mobileunitlogId: 1
          })).toEqual('/mobileunitlogs/1');
        }));

        it('should attach an Mobileunitlog to the controller scope', function () {
          expect($scope.vm.mobileunitlog._id).toBe(mockMobileunitlog._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/mobileunitlogs/client/views/view-mobileunitlog.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MobileunitlogsController,
          mockMobileunitlog;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('mobileunitlogs.create');
          $templateCache.put('modules/mobileunitlogs/client/views/form-mobileunitlog.client.view.html', '');

          // create mock Mobileunitlog
          mockMobileunitlog = new MobileunitlogsService();

          // Initialize Controller
          MobileunitlogsController = $controller('MobileunitlogsController as vm', {
            $scope: $scope,
            mobileunitlogResolve: mockMobileunitlog
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.mobileunitlogResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/mobileunitlogs/create');
        }));

        it('should attach an Mobileunitlog to the controller scope', function () {
          expect($scope.vm.mobileunitlog._id).toBe(mockMobileunitlog._id);
          expect($scope.vm.mobileunitlog._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/mobileunitlogs/client/views/form-mobileunitlog.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MobileunitlogsController,
          mockMobileunitlog;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('mobileunitlogs.edit');
          $templateCache.put('modules/mobileunitlogs/client/views/form-mobileunitlog.client.view.html', '');

          // create mock Mobileunitlog
          mockMobileunitlog = new MobileunitlogsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Mobileunitlog Name'
          });

          // Initialize Controller
          MobileunitlogsController = $controller('MobileunitlogsController as vm', {
            $scope: $scope,
            mobileunitlogResolve: mockMobileunitlog
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:mobileunitlogId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.mobileunitlogResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            mobileunitlogId: 1
          })).toEqual('/mobileunitlogs/1/edit');
        }));

        it('should attach an Mobileunitlog to the controller scope', function () {
          expect($scope.vm.mobileunitlog._id).toBe(mockMobileunitlog._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/mobileunitlogs/client/views/form-mobileunitlog.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
