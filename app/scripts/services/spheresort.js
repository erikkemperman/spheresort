'use strict';

/**
 * @ngdoc service
 * @name spheresortApp.spheresort
 * @description
 * # spheresort
 * Service in the spheresortApp.
 */
angular.module( 'spheresortApp' )

.service( 'spheresort', [ '$window', function spheresort( $window ) {
  // this service just wraps the global spheresort constructor 
  this.instance = $window.spheresort;
} ] );
