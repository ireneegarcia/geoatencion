(function () {
  'use strict';

  describe('Branches Route Tests', function () {
    // Initialize global variables
    var $scope,
      BranchesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _BranchesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      BranchesService = _BranchesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('branches');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/branches');
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
          BranchesController,
          mockBranch;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('branches.view');
          $templateCache.put('modules/branches/client/views/view-branch.client.view.html', '');

          // create mock Branch
          mockBranch = new BranchesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Branch Name'
          });

          // Initialize Controller
          BranchesController = $controller('BranchesController as vm', {
            $scope: $scope,
            branchResolve: mockBranch
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:branchId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.branchResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            branchId: 1
          })).toEqual('/branches/1');
        }));

        it('should attach an Branch to the controller scope', function () {
          expect($scope.vm.branch._id).toBe(mockBranch._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/branches/client/views/view-branch.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          BranchesController,
          mockBranch;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('branches.create');
          $templateCache.put('modules/branches/client/views/form-branch.client.view.html', '');

          // create mock Branch
          mockBranch = new BranchesService();

          // Initialize Controller
          BranchesController = $controller('BranchesController as vm', {
            $scope: $scope,
            branchResolve: mockBranch
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.branchResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/branches/create');
        }));

        it('should attach an Branch to the controller scope', function () {
          expect($scope.vm.branch._id).toBe(mockBranch._id);
          expect($scope.vm.branch._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/branches/client/views/form-branch.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          BranchesController,
          mockBranch;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('branches.edit');
          $templateCache.put('modules/branches/client/views/form-branch.client.view.html', '');

          // create mock Branch
          mockBranch = new BranchesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Branch Name'
          });

          // Initialize Controller
          BranchesController = $controller('BranchesController as vm', {
            $scope: $scope,
            branchResolve: mockBranch
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:branchId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.branchResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            branchId: 1
          })).toEqual('/branches/1/edit');
        }));

        it('should attach an Branch to the controller scope', function () {
          expect($scope.vm.branch._id).toBe(mockBranch._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/branches/client/views/form-branch.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
