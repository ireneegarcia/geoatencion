(function () {
  'use strict';

  describe('Alarms Route Tests', function () {
    // Initialize global variables
    var $scope,
      AlarmsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AlarmsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AlarmsService = _AlarmsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('alarms');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/alarms');
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
          AlarmsController,
          mockAlarm;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('alarms.view');
          $templateCache.put('modules/alarms/client/views/view-alarm.client.view.html', '');

          // create mock Alarm
          mockAlarm = new AlarmsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Alarm Name'
          });

          // Initialize Controller
          AlarmsController = $controller('AlarmsController as vm', {
            $scope: $scope,
            alarmResolve: mockAlarm
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:alarmId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.alarmResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            alarmId: 1
          })).toEqual('/alarms/1');
        }));

        it('should attach an Alarm to the controller scope', function () {
          expect($scope.vm.alarm._id).toBe(mockAlarm._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/alarms/client/views/view-alarm.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AlarmsController,
          mockAlarm;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('alarms.create');
          $templateCache.put('modules/alarms/client/views/form-alarm.client.view.html', '');

          // create mock Alarm
          mockAlarm = new AlarmsService();

          // Initialize Controller
          AlarmsController = $controller('AlarmsController as vm', {
            $scope: $scope,
            alarmResolve: mockAlarm
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.alarmResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/alarms/create');
        }));

        it('should attach an Alarm to the controller scope', function () {
          expect($scope.vm.alarm._id).toBe(mockAlarm._id);
          expect($scope.vm.alarm._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/alarms/client/views/form-alarm.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AlarmsController,
          mockAlarm;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('alarms.edit');
          $templateCache.put('modules/alarms/client/views/form-alarm.client.view.html', '');

          // create mock Alarm
          mockAlarm = new AlarmsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Alarm Name'
          });

          // Initialize Controller
          AlarmsController = $controller('AlarmsController as vm', {
            $scope: $scope,
            alarmResolve: mockAlarm
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:alarmId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.alarmResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            alarmId: 1
          })).toEqual('/alarms/1/edit');
        }));

        it('should attach an Alarm to the controller scope', function () {
          expect($scope.vm.alarm._id).toBe(mockAlarm._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/alarms/client/views/form-alarm.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
