/*!
 * 
 */
/* TODO
 * allow other types of export: AMD (RequireJS), Angular module, Node even?
 */
(function( window, undefined ) {
  
  var FORCEMAPS = [
    // uniform
    function( distance ) {
      return 1;
    }
    // linear
    , function( distance ) {
      return 2 * (1 - distance/Math.PI);
    }
    // quadratic
    , function( distance ) {
      var f = 1 - distance/Math.PI;
      return 3 * f*f;
    }
  ]
  
  
  // constructor defers to prototype.init function below
  , spheresort = function( options ) {
    return new prototype.init( options );
  },
  
  // prototype
  prototype = spheresort.prototype = {
    constructor: spheresort,
    
    // declare options and their default values
    options: {
      rate: 0.1,
      equalize: true,
      noise: 0.1,
      noiseDecay: 0.999,
      forceDegree: 2
    },
    
    // declare dataset and comparator
    dataset: undefined,
    comparator: undefined,
    
    // declare distances and positions
    distances: undefined,
    positions: undefined,
    
    // deferred constructor
    init: function( options ) {
      for ( var option in prototype.options ) {
        this.options[ option ] = options.hasOwnProperty( option )
          ? options[ option ]
          : prototype.options[ option ];
      }
      return this;
    },
    
    // set the current dataset and comparator
    data: function( dataset, comparator ) {
      var thiz = this;
      if ( ! Array.isArray( dataset ) ) {
        throw '1st arg must be an array';
      }
      if ( typeof comparator !== 'function' ) {
        throw '2nd arg must be a function';
      }
      var length = dataset.length, i, j;
      thiz.dataset = dataset;
      thiz.comparator = comparator;
      thiz.positions = Array( length );
      for ( i = length; i-- > 0; ) {
        thiz.positions[ i ] = Array( 3 );
      }
      
      // precompute all distances
      thiz.distances = Array( (length * (length-1)) / 2 );
      var min = 1, max = 0, avg = 0, d;
      for ( j = length; j-- > 1; ) {
        for ( i = j; i-- > 0; ) {
          d = comparator( dataset[ i ], dataset[ j ] );
          thiz.distances[ ((j * (j-1)) / 2) + i ] = d;
          avg += d;
          if ( d < min ) {
            min = d;
          }
          if ( d > max ) {
            max = d;
          }
        }
      }
      avg /= thiz.distances.length;
      if ( thiz.options.equalize ) {
        console.log( "pre equalize min, avg, max:", min, avg, max );
        var sorted = Array( thiz.distances.length );
        for ( j = sorted.length; j-- > 0; ) {
          sorted[ j ] = j;
        }
        sorted.sort( function( i, j ) {
          return thiz.distances[ i ] - thiz.distances[ j ];
        } );
        var inc = 1 / sorted.length, cum = inc / 2;
        avg = 0;
        for ( j = 0; j < sorted.length; j++ ) {
          d = Math.acos( 1 - 2*cum ) / Math.PI;
          avg += d;
          //console.log( cum, thiz.distances[ sorted[ j ] ] + " -> " + d );
          thiz.distances[ sorted[ j ] ] = d;
          cum += inc;
        }
        avg /= sorted.length;
        console.log( "post equalize min, avg, max:", thiz.distances[ sorted[ 0 ] ], avg, thiz.distances[ sorted[sorted.length-1 ] ] );
      }
      
      // initially all positions are randomly distributed over the sphere surface
      thiz.randomize();
    },
    
    // get [x, y, z] position of an item
    position: function( i ) {
      _checkIndex( this, i );
      return this.positions[ i ];
    },
    
    // randomize positions uniformly distributed over sphere surface
    randomize: function() {
      var i;
      for ( i = this.dataset.length; i-- > 0; ) {
        _randomize( this.positions[ i ] );
      }
    },
    
    // perform one "round" of sorting
    sort: function() {
      var thiz = this 
      , order = _permute( thiz.distances.length )
      , k, m, n
      , u, v, w = new Array( 3 )
      , dot, target, current, r, sin, cos
      , energy = 0
      , force = FORCEMAPS[ thiz.options.forceDegree ];
      
      // console.log( 'permute', order );
      for ( k = thiz.distances.length; k-- > 0; ) {
        m = order[ k ];
        target = thiz.distances[ m ] * Math.PI;
        n = Math.floor( 0.5 + Math.sqrt( 2 * m + 0.25 ) );
        m = m - n*(n-1)/2;
        
        u = [ thiz.positions[ m ][ 0 ], thiz.positions[ m ][ 1 ], thiz.positions[ m ][ 2 ] ];
        v = [ thiz.positions[ n ][ 0 ], thiz.positions[ n ][ 1 ], thiz.positions[ n ][ 2 ] ];
        /*if ( target !== thiz.comparator( thiz.dataset[m], thiz.dataset[n]) ) {
          throw 'Eek!';
        }*/
        
        // compute (angular) distance between vectors u and v (from dot product)
        dot = u[ 0 ] * v[ 0 ] + u[ 1 ] * v[ 1 ] + u[ 2 ] * v[ 2 ];
        current = Math.acos( dot );
        
        //console.log( m, n, thiz.dataset[ m ].toString(), thiz.dataset[ n ].toString(), target, current );
        
        // compute axis of rotation
        if ( current === 0 || current === Math.PI ) {
          // if u and v are the same vector or exact antipodes, use a random axis
          // thiz will almost never happen, but let's prevent arithmetic exceptions
          _randomize( w );
          // TODO thiz is not right, we have one degree of freedom but
          // must make sure w is perpendicular!
          console.warn( 'fix thiz case' );
        } else {
          // otherwise compute axis perpendicular to both u and v (from cross product)
          r = Math.sin( current ); // Math.sqrt(1-dot*dot);
          w[ 0 ] = (u[ 1 ] * v[ 2 ] - u[ 2 ] * v[ 1 ]) / r;
          w[ 1 ] = (u[ 2 ] * v[ 0 ] - u[ 0 ] * v[ 2 ]) / r;
          w[ 2 ] = (u[ 0 ] * v[ 1 ] - u[ 1 ] * v[ 0 ]) / r;
        }
        
        // determine sine and cosine of the angle of rotation that will bring
        // the distance closer to target, factoring in rate option and dataset size
        // and the force (as a function of distance)
        r = force( current ) * (current - target) / 2;
        energy += Math.abs( r );
        r *= thiz.options.rate / thiz.dataset.length;
        //console.log( thiz.dataset[m].toString(), thiz.dataset[n].toString(), target, current, (current - target), r );
        cos = Math.cos( r );
        sin = Math.sin( r );
        //console.log( 'foo', Math.sqrt( w[0]*w[0] + w[1]*w[1] + w[2]*w[2]) );
        //console.log( 'bar', sin, cos );
        //console.log( 'baz', u[0] * w[0] + u[1] * w[1] + u[2] * w[2] );
        //console.log( 'baq', v[0] * w[0] + v[1] * w[1] + v[2] * w[2] );
        
        // apply Rodrigues' rotation formula to compute new positions u' and v'
        // (simplified because our rotation axis is perpendicular by construction)
        thiz.positions[ m ][ 0 ] = u[ 0 ] * cos + (w[ 1 ] * u[ 2 ] - w[ 2 ] * u[ 1 ]) * sin;
        thiz.positions[ m ][ 1 ] = u[ 1 ] * cos + (w[ 2 ] * u[ 0 ] - w[ 0 ] * u[ 2 ]) * sin;
        thiz.positions[ m ][ 2 ] = u[ 2 ] * cos + (w[ 0 ] * u[ 1 ] - w[ 1 ] * u[ 0 ]) * sin;
        
        // the other vector must be rotated by the negative amount
        // "recomputing" cos and sin is simples
        sin = -sin;
        thiz.positions[ n ][ 0 ] = v[ 0 ] * cos + (w[ 1 ] * v[ 2 ] - w[ 2 ] * v[ 1 ]) * sin; 
        thiz.positions[ n ][ 1 ] = v[ 1 ] * cos + (w[ 2 ] * v[ 0 ] - w[ 0 ] * v[ 2 ]) * sin;
        thiz.positions[ n ][ 2 ] = v[ 2 ] * cos + (w[ 0 ] * v[ 1 ] - w[ 1 ] * v[ 0 ]) * sin;
      }
      /*if ( thiz.options.noise > 0 ) {
        thiz.positions[ j ][ 0 ] += thiz.options.noise * (Math.random() - 0.5);
        thiz.positions[ j ][ 1 ] += thiz.options.noise * (Math.random() - 0.5);
        thiz.positions[ j ][ 2 ] += thiz.options.noise * (Math.random() - 0.5);
        r = Math.sqrt( thiz.positions[ j ][ 0 ] * thiz.positions[ j ][ 0 ]  +  thiz.positions[ j ][ 1 ] * thiz.positions[ j ][ 1 ]  + thiz.positions[ j ][ 2 ] * thiz.positions[ j ][ 2 ] );
        //console.log( 'r', r, Math.sin(current), r-Math.sin(current));
        thiz.positions[ j ][ 0 ] /= r;
        thiz.positions[ j ][ 1 ] /= r;
        thiz.positions[ j ][ 2 ] /= r;
        thiz.options.noise *= thiz.options.noiseDecay;
      }*/
      energy /= thiz.dataset.length;
      //console.log( 'energy', energy, 'noise', thiz.options.noise );
      return energy;
    }
  };
  
  // hide constructor deference in prototype chain
  prototype.init.prototype = prototype;
  
  // export
  window.spheresort = spheresort;
  
  
  // ---- private functions ----
  
  function _checkIndex( instance, i ) {
    if ( typeof i !== 'number' || Math.round( i ) !== i ) {
      throw 'index must be an integer';
    }
    if ( i < 0 || i >= instance.dataset.length ) {
      throw 'index out of bounds';
    }
  }
  
  function _distance( instance, i, j ) {
    return instance.distances[ ((j * (j-1)) / 2) + i ];
  }
  
  
  // return all of the integers 0, 1, ..., length-1 in a random order
  function _permute( length ) {
    var permutation = new Array( length )
    , i, j, k;
    
    // populate array with integers in natural order
    for ( i = length; i-- > 0; ) {
      permutation[ i ] = i;
    }
    
    // now for i decreasing from length-1 to 0 ...
    for ( i = length; i-- > 0; ) {
      // ... generate a random integer j in range [0, i]
      // and swap the value at index j with the one at index i
      j = Math.floor( (i + 1) * Math.random() );
      k = permutation[ j ];
      permutation[ j ] = permutation[ i ];
      permutation[ i ] = k;
    }
    return permutation;
  }
  
  // randomize given vertex, uniformly distributed on the unit sphere surface
  function _randomize( vertex ) {
    var lon = (2 * Math.random() - 1) * Math.PI
    , lat = Math.asin( 2 * Math.random() - 1 );
    vertex[ 0 ] = Math.sin( lon ) * Math.cos( lat );
    vertex[ 1 ] = Math.cos( lon ) * Math.cos( lat );
    vertex[ 2 ] = Math.sin( lat );
  }
  
} )( this );
