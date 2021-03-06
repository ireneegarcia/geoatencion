(function () {
  'use strict';

  describe('Organisms Route Tests', function () {
    // Initialize global variables
    var $scope,
      OrganismsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _OrganismsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      OrganismsService = _OrganismsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('organisms');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/organisms');
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
          OrganismsController,
          mockOrganism;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('organisms.view');
          $templateCache.put('modules/organisms/client/views/view-organism.client.view.html', '');

          // create mock Organism
          mockOrganism = new OrganismsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Organism Name'
          });

          // Initialize Controller
          OrganismsController = $controller('OrganismsController as vm', {
            $scope: $scope,
            organismResolve: mockOrganism
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:organismId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.organismResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            organismId: 1
          })).toEqual('/organisms/1');
        }));

        it('should attach an Organism to the controller scope', function () {
          expect($scope.vm.organism._id).toBe(mockOrganism._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/organisms/client/views/view-organism.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          OrganismsController,
          mockOrganism;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('organisms.create');
          $templateCache.put('modules/organisms/client/views/form-organism.client.view.html', '');

          // create mock Organism
          mockOrganism = new OrganismsService();

          // Initialize Controller
          OrganismsController = $controller('OrganismsController as vm', {
            $scope: $scope,
            organismResolve: mockOrganism
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.organismResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/organisms/create');
        }));

        it('should attach an Organism to the controller scope', function () {
          expect($scope.vm.organism._id).toBe(mockOrganism._id);
          expect($scope.vm.organism._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/organisms/client/views/form-organism.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          OrganismsController,
          mockOrganism;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('organisms.edit');
          $templateCache.put('modules/organisms/client/views/form-organism.client.view.html', '');

          // create mock Organism
          mockOrganism = new OrganismsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Organism Name'
          });

          // Initialize Controller
          OrganismsController = $controller('OrganismsController as vm', {
            $scope: $scope,
            organismResolve: mockOrganism
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:organismId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.organismResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            organismId: 1
          })).toEqual('/organisms/1/edit');
        }));

        it('should attach an Organism to the controller scope', function () {
          expect($scope.vm.organism._id).toBe(mockOrganism._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/organisms/client/views/form-organism.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
