(function () {
  'use strict';

  describe('Firebasetokens Route Tests', function () {
    // Initialize global variables
    var $scope,
      FirebasetokensService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _FirebasetokensService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      FirebasetokensService = _FirebasetokensService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('firebasetokens');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/firebasetokens');
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
          FirebasetokensController,
          mockFirebasetoken;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('firebasetokens.view');
          $templateCache.put('modules/firebasetokens/client/views/view-firebasetoken.client.view.html', '');

          // create mock Firebasetoken
          mockFirebasetoken = new FirebasetokensService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Firebasetoken Name'
          });

          // Initialize Controller
          FirebasetokensController = $controller('FirebasetokensController as vm', {
            $scope: $scope,
            firebasetokenResolve: mockFirebasetoken
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:firebasetokenId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.firebasetokenResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            firebasetokenId: 1
          })).toEqual('/firebasetokens/1');
        }));

        it('should attach an Firebasetoken to the controller scope', function () {
          expect($scope.vm.firebasetoken._id).toBe(mockFirebasetoken._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/firebasetokens/client/views/view-firebasetoken.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          FirebasetokensController,
          mockFirebasetoken;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('firebasetokens.create');
          $templateCache.put('modules/firebasetokens/client/views/form-firebasetoken.client.view.html', '');

          // create mock Firebasetoken
          mockFirebasetoken = new FirebasetokensService();

          // Initialize Controller
          FirebasetokensController = $controller('FirebasetokensController as vm', {
            $scope: $scope,
            firebasetokenResolve: mockFirebasetoken
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.firebasetokenResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/firebasetokens/create');
        }));

        it('should attach an Firebasetoken to the controller scope', function () {
          expect($scope.vm.firebasetoken._id).toBe(mockFirebasetoken._id);
          expect($scope.vm.firebasetoken._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/firebasetokens/client/views/form-firebasetoken.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          FirebasetokensController,
          mockFirebasetoken;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('firebasetokens.edit');
          $templateCache.put('modules/firebasetokens/client/views/form-firebasetoken.client.view.html', '');

          // create mock Firebasetoken
          mockFirebasetoken = new FirebasetokensService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Firebasetoken Name'
          });

          // Initialize Controller
          FirebasetokensController = $controller('FirebasetokensController as vm', {
            $scope: $scope,
            firebasetokenResolve: mockFirebasetoken
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:firebasetokenId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.firebasetokenResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            firebasetokenId: 1
          })).toEqual('/firebasetokens/1/edit');
        }));

        it('should attach an Firebasetoken to the controller scope', function () {
          expect($scope.vm.firebasetoken._id).toBe(mockFirebasetoken._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/firebasetokens/client/views/form-firebasetoken.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
