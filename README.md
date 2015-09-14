## GSVPano - Google Street View Panorama lib
[![Build Status](https://travis-ci.org/juampi92/GSVPano.svg?branch=master)](https://travis-ci.org/juampi92/GSVPano)

Library to help requesting and stitching Google Street View panoramas.

Given a Google Maps Location, this library downloads each part of the corresponding panorama, and gives you the complete image ready to use.

## Simple Example

```js
// Create a PanoLoader object
var loader = new GSVPANO.PanoLoader({
	zoom: 3
});

// Implement the onPanoramaLoad handler
loader.on('panorama.load', function(panorama) {
	// panorama will now be loaded
  // panorama.on('progress', changeProgress); for individual progress
  // panorama.on('complete', completeCallback); for individual completeness progress
});

// Invoke the load method with a LatLng point
loader.load( new google.maps.LatLng( 42.216188,-75.726578 ) );
```

## Installation

##### Dependencies:

Remember that you'll need google.maps API, so don't forget this script tag.

```html
<script src="http://maps.google.com/maps/api/js?sensor=false"></script>
````

##### Github CDN

```html
<script src="//juampi92.github.io/GSVPano/build/GSVPano.min.js"></script>
````

Or you can just use it with a specific version:

```html
<script src="//juampi92.github.io/GSVPano/build/GSVPano-1.0.0.min.js"></script>
````

##### Bower

    $ bower install GSVPano

##### npm

    $ npm install GSVPano

And you can require the source files and compile it using browserify

## API Reference

##### Events

 * `panorama.data ( pano )` When a new panorama has been added and its about to start downloading
 * `panorama.nodata ( location, status )` When the location had trouble fetching the panorama
 * `panorama.progress ( p , pano )` Shows the panorama load progress
 * `panorama.load ( pano )` When the panorama has finished loading
 * `error ( message )` When the panorama has finished loading

```js
loader.on('panorama.data', function(pano) { 
	console.log('Panorama ' + pano.id + ' has been added');
});
```

##### Methods
 * `on ( eventName, callback )` EventEmitter inheritance
 * `load ( location )` Starts the load of the panorama on that location
 * `setZoom ( z )` Sets the zoom

##### Read the [Documentation](https://juampi92.github.io/GSVPano/docs/) for more detail

## Contribute

First, do

		$ npm install
		$ npm install -g grunt-cli

to get all the dependencies.

    $ grunt build

lints the project, browserifies it, minifies it and builds the documentation also.

If you just wanna build it with browserify, use

    $ grunt watch

that will watchify the `src/` folder.


##### Forks, pull requests and code critiques are welcome!

## License

MIT License (MIT)