(function () {
  'use strict';

  angular
    .module('alarms')
    .controller('AlarmsListController', AlarmsListController);

  AlarmsListController.$inject = ['AlarmsService', '$filter', 'UsersService', 'Authentication', 'LogsServiceCreate', '$timeout'];

  function AlarmsListController(AlarmsService, $filter, UsersService, Authentication, LogsServiceCreate, $timeout) {
    var vm = this;
    vm.alarmsEsperando = [];
    vm.alarmsEnAtencion = [];
    vm.alarmsRechazado = [];
    vm.alarmsCanceled = [];
    vm.alarmsAtendido = [];
    vm.alarmsCanceladoCliente = [];
    // vm.alarmsCanceladoUnidad = [];

    // Condicional para encontrar el organismo relacionado
    function me() {
      UsersService.query(function (data) {

        if (Authentication.user.roles[0] === 'user') {
          // El cliente logueado
          vm.client = data.filter(function (data) {
            return (data.email.indexOf(Authentication.user.email) >= 0);
          });

          AlarmsService.query(function (data) {

            vm.clientAlarmsSinCalificar = data.filter(function (data) {
              return ((data.user._id.indexOf(vm.client[0]._id) >= 0) &&
              (data.status.indexOf('atendido') >= 0) &&
              (data.rating.indexOf('sin calificar') >= 0));
            });

            vm.clientAlarmsCalificado = data.filter(function (data) {
              return ((data.user._id.indexOf(vm.client[0]._id) >= 0) &&
              (data.status.indexOf('atendido') >= 0) &&
              (data.rating.indexOf('sin calificar') < 0));
            });

          });
        }
        if (Authentication.user.roles[0] === 'organism') {
          // El organismo logueado
          vm.organism = data.filter(function (data) {
            return (data.email.indexOf(Authentication.user.email) >= 0);
          });
        }

        if (Authentication.user.roles[0] === 'operator') {

          // El operador logueado
          vm.operator = data.filter(function (data) {
            return (data.email.indexOf(Authentication.user.email) >= 0);
          });
          // El organismo al que pertence el operador logueado
          vm.organism = data.filter(function (data) {
            return (data._id.indexOf(vm.operator[0].user._id) >= 0);
          });
          getMyAlarms(vm.organism[0]._id);
        }

      });
    }
    me();


    // CALIFICACIÓN

    vm.getRating = function (rating) {

      vm.gotRating = rating;

    };

    vm.sendRating = function (rating) {
      var message = '';

      if (!rating) {
        vm.message = 'Ops algo salió mal..';
      } else {

        // Se actualiza la alarma (PUT)
        vm.clientAlarmsSinCalificar[0].rating = rating;
        AlarmsService.update({alarmId: vm.clientAlarmsSinCalificar[0]._id}, vm.clientAlarmsSinCalificar[0]);


        // Se registra en el log
        logServicePOST('El cliente ha dado una calificación de: ' + rating + ' a la atención recibida');

        vm.message = '¡Gracias por su calificación :)!';

        // After 3 seconds, remove the show class from DIV
        $timeout(function() {me(); }, 5000);

      }

      // LISTADO DE ALARMAS

      function logServicePOST(description) {

        LogsServiceCreate.charge({ description: description,
          alarm: vm.clientAlarmsSinCalificar[0]._id,
          network: vm.clientAlarmsSinCalificar[0].network,
          client: vm.clientAlarmsSinCalificar[0].user._id,
          user: '',
          organism: vm.clientAlarmsSinCalificar[0].organism}, function (data) {
          // se realizo el post
        });

      }

    };

    function getMyAlarms(organism) {

      /*
       Todas las alarmas
       * */
      AlarmsService.query(function (data) {

        data.forEach(function(alarm) {
          if (alarm.organism === organism) {
            if (alarm.status === 'esperando') {
              vm.alarmsEsperando.push(alarm);
            }

            if (alarm.status === 'en atencion') {
              vm.alarmsEnAtencion.push(alarm);
            }

            if (alarm.status === 'rechazado') {
              vm.alarmsRechazado.push(alarm);
            }

            if (alarm.status === 'cancelado por el operador') {
              vm.alarmsCanceled.push(alarm);
            }

            if (alarm.status === 'atendido') {
              vm.alarmsAtendido.push(alarm);
            }

            if (alarm.status === 'cancelado por el cliente') {
              vm.alarmsCanceladoCliente.push(alarm);
            }

            /* if (alarm.status === 'cancelado por la unidad') {
              vm.alarmsCanceladoUnidad.push(alarm);
            }*/
          }
        });

      });
    }
  }
}());
