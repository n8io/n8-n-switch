'use strict';

var configKey = 'config';
var __data = null;

angular.module('LightingResources', ['ngResource'])
  .factory(
    'Devices',
    function($resource){
      return $resource('/api/:user/:pwd/:isy_url/:isy_port/devices', {user:-1,pwd:-1,isy_url:-1,isy_port:-1}, {
        Get: {
          method:'GET',
          isArray:false
        }
      });
    }
  )
  .factory(
    'Commands',
    function($resource){
      return $resource('/api/:user/:pwd/:isy_url/:isy_port/:device/:cmd', {user:-1,pwd:-1,isy_url:-1,isy_port:-1,device:-1,cmd:-1}, {
        Get: {
          method:'GET',
          isArray:false
        }
      });
    }
  );

var app = angular.module('ngApp', ['LightingResources']).
  config([
    '$routeProvider',
    '$locationProvider',
    function($routeProvider, $locationProvider) {
      var rand = Math.floor(Math.random()*10000001);
      $routeProvider.
        when('/', {
          templateUrl: '/partials/index?' + rand
        }).
        when('/config', {
          templateUrl: '/partials/config?' + rand
        })
        .otherwise({
          templateUrl: '/partials/index?' + rand
        });
    $locationProvider.html5Mode(true);
  }
]);

app.controller('Main_Controller', function($scope, $log, Devices, Commands){
  var store = new Persist.Store(configKey);
  $scope.config = store.get(configKey);
  $scope.level = null;
  $scope.init = function init(){
    if($scope.config && $scope.config !== null){
      var cfg = angular.fromJson($scope.config);
      Devices.Get({user:cfg.user,pwd:cfg.pwd,isy_url:cfg.isy_url,isy_port:cfg.isy_port}, function(data){
        $scope.devices = data.nodes.node;
        __data = data.nodes.node;
        $scope.initDimmers();
      }, function(err){

      });
    }

    $scope.$watch('level', function(){
      $log.log('changed!');
    })

    $('.device-listing').hammer().on('swipeleft', function(){
      window.location.href='/config';
    });
  }

  $scope.initDimmers = function(){
    $scope.dimmerValues = [
      { label: 'On', value: 255 },
      { label: 'Off', value: 0 },
      { label: '25%', value: 256 * .25 },
      { label: '50%', value: 128 },
      { label: '75%', value: 256 * .75 }
    ];

    $scope.dimmers = _.filter($scope.devices, function(d){
      return d.property[0].$.uom.indexOf('%') > -1;
    });

  }

  $scope.toggleDevice = function toggleDevice(device){
    var cfg = angular.fromJson($scope.config);
    var cmd = 'DOF';
    if(parseInt(device.property[0].$.value) === 0){
      cmd = 'DON';
    }
    var options = {"user":cfg.user,"pwd":cfg.pwd,"isy_url":cfg.isy_url,"isy_port":cfg.isy_port,"device":device.address[0],"cmd":cmd};
    Commands.Get(options, function(data){
        if(data.RestResponse.$.succeeded == 'true'){
          device.property[0].$.value = cmd === 'DOF' ? "0" : "255";
        }
      }, function(err){

      });
  }

  $scope.init();
});

app.controller('Device_Controller', function($scope, $log){
  var store = new Persist.Store(configKey);

  $scope.init = function init(){

  }
});

app.controller('Config_Controller', function($scope, $log){
  var store = new Persist.Store(configKey);
  var config = store.get(configKey);

  $scope.init = function init(){
    if(!config || config === null || config == 'null'){
      setDefaultConfig();
    }
    else{
      $scope.config = angular.fromJson(config);
    }

    $('.config-listing').hammer().on('swiperight', function(){
      window.location.href='/';
    });
  }

  $scope.onSaveConfig = function onSaveConfig(){
    store.set(configKey, angular.toJson($scope.config));
    window.location.href = '/';
  }

  $scope.setLevel = function(dimmer){
    console.log('here');
  }

  function setDefaultConfig(){
    var config = {
      "user":"",
      "pwd":"",
      "isy_url":"",
      "isy_port":"80"
    };

    store.set(configKey, angular.toJson(config));
  }

  function clickSelect(selector){
    var element = $(selector)[0];
    var pos = $(element).position();
    if(pos.left < 0) pos.left--;
    if(pos.top < 0) pos.top--;

    if (document.createEvent) {
      $log.log('supports createEvent');
      var e = document.createEvent("MouseEvents");
      e.initMouseEvent("mousedown", true, true, window, 0, pos.left, pos.top, 0, 0, false, false, false, false, 0, null);
      worked = element.dispatchEvent(e);
    } else if (element.fireEvent) {
      $log.log('supports fireEvent');
      worked = element.fireEvent("onmousedown");
    }
  }

  $scope.init();
});