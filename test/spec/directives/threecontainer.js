'use strict';

describe( 'Directive: threeContainer', function() {

  // load the directive's module
  beforeEach( module( 'spheresortApp') );

  var element, scope;

  beforeEach( inject( function( $rootScope ) {
    scope = $rootScope.$new();
  } ) );

  it( 'should make hidden element visible', inject( function( $compile ) {
    element = angular.element( '<div three-container></div>' );
    element = $compile( element )( scope );
    //expect( element.text() ).toBe( 'this is the threeContainer directive' );
  }));
});
