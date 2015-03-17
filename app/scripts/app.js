'use strict';

/**
 * @ngdoc overview
 * @name spheresortApp
 * @description
 * # spheresortApp
 *
 * Main module of the application.
 */
angular.module( 'spheresortApp', [
  'ngRoute'
] )

.config( function ( $routeProvider ) {
  $routeProvider
    .when( '/', {
      templateUrl: 'views/demo.html',
      controller: 'DemoCtrl'
    } )
    .when( '/about', {
      templateUrl: 'views/about.html',
      controller: 'AboutCtrl'
    } )
    .otherwise( {
      redirectTo: '/'
    } );
} );
