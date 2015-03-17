'use strict';

/**
 * @ngdoc function
 * @name spheresortApp.controller:DemoCtrl
 * @description
 * # DemoCtrl
 * Controller of the spheresortApp
 */
angular.module( 'spheresortApp' )

.controller( 'DemoCtrl', [ '$scope', '$window', 'spheresort', function ( $scope, $window, spheresort ) {
  $scope.spheresort = spheresort.instance( {
    force: 0,
    equalize: true,
    rate: 0.1,
  } );
  
  console.log( 'democtrl', $scope );
  
  $scope.length = 160;
  $scope.data = new Array( $scope.length );
  $scope.materials = new Array( $scope.length );
  
  var i, h, s, l;
  for ( i = $scope.length; i-- > 0; ) {
    // uniform random integers on [10, 245]
    h = 360 * Math.random();
    s = //Math.random();//Math.random();// Math.acos( 1 - 2*Math.random() ) / Math.PI;
    l = Math.random();
    $scope.data[ i ] = $window.d3.hsl( h, s, l );
  }
  
  $scope.materials = new Array( $scope.length );
  for ( i = $scope.length; i-- > 0; ) {
    //console.log( 'hello', $scope.data[ i ].toString(), $scope.data[ i ].toString().substring( 1 ), parseInt( $scope.data[ i ].toString().substring( 1 ), 16 ) );
    $scope.materials[ i ] = new $window.THREE.MeshBasicMaterial( {
      color: parseInt( $scope.data[ i ].toString().substring( 1 ), 16 ),
      opacity: 0.9,
      transparent: true
    } );
    //console.log( 'material ', $scope.materials[ i ].color.getHexString(), $scope.data[ i ].toString() );
    
  }
  
  $scope.spheresort.data( $scope.data, function( hsl1, hsl2 ) {
    var dh = Math.abs(hsl1.h - hsl2.h) / 180
    , ds = (hsl1.s - hsl2.s)
    , dl = (hsl1.l - hsl2.l);
    if ( dh > 1 ) {
      dh = 2 - dh;
    }
    var d = Math.sqrt( ((dh*dh) + (ds*ds) + (dl*dl)) / 3 );
    //console.log( 'dist', hsl1.toString(), hsl2.toString(), hsl1.h, hsl2.h, d );
    return d;
  } );
  
} ] );
