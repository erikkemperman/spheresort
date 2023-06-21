'use strict';

describe( 'Service: spheresort', function() {

  // load the service's module
  beforeEach( module( 'spheresortApp' ) );

  // instantiate service
  var spheresort;
  beforeEach( inject( function( _spheresort_ ) {
    spheresort = _spheresort_;
  } ) );

  it( 'should do something', function() {
    expect( !! spheresort ).toBe( true );
  } );

} );
