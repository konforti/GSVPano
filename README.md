## GSVPano - Google Street View Panorama lib

Library to help requesting and stitching Google Street View panoramas.

### Examples

* [WebGL Google Street View Panorama Viewer](http://www.clicktorelease.com/code/street).
* [Heganoo.com story map 'North America 360'](http://heganoo.com/node/8177/8179).

#### Using the code

Include GSVPano.[min.]js and Google Maps API lib.

The lib uses google.maps.LatLng to specify the location and google.maps.StreetViewService.

```html
<script src="GSVPano.min.js"></script>
<script src="http://maps.google.com/maps/api/js?sensor=false"></script>
````

Add this basic code:

```js
// Create a PanoLoader object
var loader = new GSVPANO.PanoLoader();

// Implement the onPanoramaLoad handler
loader.onPanoramaLoad = function() {

	/*
		Do your thing with the panorama:
		this.canvas: an HTML5 canvas with the texture
		this.copyright: the copyright of the images
	*/

};

// Invoke the load method with a LatLng point
loader.load( new google.maps.LatLng( 42.216188,-75.726578 ) );
```

### hooks

```js
loader.onSizeChange = function() { 
	showMessage( 'Size changed' );
}

loader.onPanoramaData = function( result ) {
	showMessage( 'Panorama OK.<br/>Load started' );
}

loader.onNoPanoramaData = function( status ) {
	showError("Could not retrieve panorama for the following reason: " + status);
}

loader.onProgress = function( p ) {
	showMessage( '.' );
};

loader.onError = function( message ) {
	showMessage( 'Error: ' + message );
};

loader.onPanoramaLoad = function() {
	showMessage( ' finished.<br/>' );
	document.body.appendChild( this.canvas );
	showMessage( 'Panorama loaded, street view data ' + this.copyright + '.<br/>' );
};
```

Forks, pull requests and code critiques are welcome!
