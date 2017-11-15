(function () {
  'use strict';

  describe('Mobileunithistories Route Tests', function () {
    // Initialize global variables
    var $scope,
      MobileunithistoriesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MobileunithistoriesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MobileunithistoriesService = _MobileunithistoriesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('mobileunithistories');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/mobileunithistories');
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
          MobileunithistoriesController,
          mockMobileunithistory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('mobileunithistories.view');
          $templateCache.put('modules/mobileunithistories/client/views/view-mobileunithistory.client.view.html', '');

          // create mock Mobileunithistory
          mockMobileunithistory = new MobileunithistoriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Mobileunithistory Name'
          });

          // Initialize Controller
          MobileunithistoriesController = $controller('MobileunithistoriesController as vm', {
            $scope: $scope,
            mobileunithistoryResolve: mockMobileunithistory
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:mobileunithistoryId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.mobileunithistoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            mobileunithistoryId: 1
          })).toEqual('/mobileunithistories/1');
        }));

        it('should attach an Mobileunithistory to the controller scope', function () {
          expect($scope.vm.mobileunithistory._id).toBe(mockMobileunithistory._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/mobileunithistories/client/views/view-mobileunithistory.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MobileunithistoriesController,
          mockMobileunithistory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('mobileunithistories.create');
          $templateCache.put('modules/mobileunithistories/client/views/form-mobileunithistory.client.view.html', '');

          // create mock Mobileunithistory
          mockMobileunithistory = new MobileunithistoriesService();

          // Initialize Controller
          MobileunithistoriesController = $controller('MobileunithistoriesController as vm', {
            $scope: $scope,
            mobileunithistoryResolve: mockMobileunithistory
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.mobileunithistoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/mobileunithistories/create');
        }));

        it('should attach an Mobileunithistory to the controller scope', function () {
          expect($scope.vm.mobileunithistory._id).toBe(mockMobileunithistory._id);
          expect($scope.vm.mobileunithistory._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/mobileunithistories/client/views/form-mobileunithistory.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MobileunithistoriesController,
          mockMobileunithistory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('mobileunithistories.edit');
          $templateCache.put('modules/mobileunithistories/client/views/form-mobileunithistory.client.view.html', '');

          // create mock Mobileunithistory
          mockMobileunithistory = new MobileunithistoriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Mobileunithistory Name'
          });

          // Initialize Controller
          MobileunithistoriesController = $controller('MobileunithistoriesController as vm', {
            $scope: $scope,
            mobileunithistoryResolve: mockMobileunithistory
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:mobileunithistoryId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.mobileunithistoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            mobileunithistoryId: 1
          })).toEqual('/mobileunithistories/1/edit');
        }));

        it('should attach an Mobileunithistory to the controller scope', function () {
          expect($scope.vm.mobileunithistory._id).toBe(mockMobileunithistory._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/mobileunithistories/client/views/form-mobileunithistory.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
