'use strict';

/**
 * @ngdoc function
 * @name spheresortApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the spheresortApp
 */
angular.module( 'spheresortApp' )

.controller( 'HeaderCtrl', [ '$scope', '$location', function ( $scope, $location ) {
  $scope.isActive = function ( viewLocation ) { 
      return viewLocation === $location.path();
  };
} ] );
