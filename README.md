# spheresort

Provided with an arbitrary dataset and a distance function, we map each element
in the set onto the surface of a sphere. Initially their positions are random,
and then we let them exert forces upon one another in accordance with the
provided distance function, such that their actual distances on the sphere will
correspond better and better with the target distance given by your function.

Please see http://erikkemperman.github.io/spheresort/ for a demo (built with
AngularJS, Bootstrap, ThreeJS and D3).

In this little demo, the dataset consists of randomly generated colors, and the
distance function simply returns a value proportional to the Euclidean distance
in the chosen colorspace.

I use colors in the demo because I believe it makes the underlying idea quite
clear, but do note that it will work with any kind of data so long as you
provide a suitable distance function.

The nice thing about using a sphere surface as the space in which the dataset
reorganizes itself is that it is unbounded (there are no edges, so the local
geometry is the same everywhere) without being infinite.

Optionally, you can enable 'histogram equalization' which will transform the
distances returned by your function in such a way that their distribution
resembles the distribution you'd get if you assigned positions on the sphere
with uniform probability.

# TODO

The main source file resides in bower_components/spheresort. Eventually, I ought
to split the demo and the core script in two separate branches, where the latter
is a bower dependency of the former.

I've published this a bit prematurely, I suppose, and really should add some
explanation and documentation ASAP.
