'use strict';

/**
 * @ngdoc directive
 * @name spheresortApp.directive:threeContainer
 * @description
 * # threeContainer
 */
angular.module( 'spheresortApp' )

.directive( 'threeContainer', [ '$window', function ( $window ) {
  return {
    restrict: 'A',

    link: function postLink( $scope, element, attrs ) {
      
      // Set up scene, camera and renderer
      var ratio = attrs.ratio || 4/3
      , shape = attrs.shape || 'sphere'
      , width = element.innerWidth()
      , height = width / ratio
      , i;
      $scope.three = {
        scene: new $window.THREE.Scene(),
        camera: new $window.THREE.PerspectiveCamera( 50, ratio, 0.01, 4 ),
        renderer: new $window.THREE.WebGLRenderer(),
        geometry: shape.toLowerCase() === 'cube'
          ? new $window.THREE.BoxGeometry( 0.1, 0.1, 0.1 )
          : new $window.THREE.SphereGeometry( 0.1, 32, 32 ),
        objects: new $window.THREE.Group()
      };
      
      $scope.three.camera.position.set( 0, 0, 5 );
      $scope.three.objects.position.set( 0, 0, 2 );
      
      $scope.three.renderer.setSize( width, height );
      angular.extend( $scope.three.renderer, {
        autoClear: true,
        antialias: true
      } );
      $scope.three.renderer.setClearColor( 0xffffff );
      
      $scope.three.scene.fog = new $window.THREE.FogExp2( 0xffffff, 0.1 );
      $scope.three.scene.add( $scope.three.objects );
      
      element.innerHeight( height );
      element.append( $scope.three.renderer.domElement );
      
      
      for ( i = 0; i < $scope.length; i++ ) {
        var mesh = new $window.THREE.Mesh( $scope.three.geometry, $scope.materials[ i ] );
        mesh.position.set.apply( mesh.position, $scope.spheresort.positions[ i ] );
        $scope.three.objects.add( mesh );
      }
      
      var count = -1; // TODO remove
      var render = function () {
        if ( count < 0 || count-- > 0 ) {
          requestAnimationFrame( render );
        }
        $scope.spheresort.sort();
        for ( i = $scope.length; i-- > 0; ) {
          var mesh = $scope.three.objects.children[ i ];
          mesh.position.set.apply( mesh.position, $scope.spheresort.positions[ i ] );
          //console.log( 'veclen', mesh.position.length() );
        }
        
        $scope.three.objects.rotation.y += 0.005;
        $scope.three.renderer.render( $scope.three.scene, $scope.three.camera );
      };
      render();
      
    }
  
  };
} ] );
