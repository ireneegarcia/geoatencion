(function () {
  'use strict';

  describe('Catalogos List Controller Tests', function () {
    // Initialize global variables
    var CatalogosListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      CatalogosService,
      mockCatalogo;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _CatalogosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      CatalogosService = _CatalogosService_;

      // create mock article
      mockCatalogo = new CatalogosService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Catalogo Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Catalogos List controller.
      CatalogosListController = $controller('CatalogosListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockCatalogoList;

      beforeEach(function () {
        mockCatalogoList = [mockCatalogo, mockCatalogo];
      });

      it('should send a GET request and return all Catalogos', inject(function (CatalogosService) {
        // Set POST response
        $httpBackend.expectGET('api/catalogos').respond(mockCatalogoList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.catalogos.length).toEqual(2);
        expect($scope.vm.catalogos[0]).toEqual(mockCatalogo);
        expect($scope.vm.catalogos[1]).toEqual(mockCatalogo);

      }));
    });
  });
}());
