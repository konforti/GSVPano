// GSVPano.js
// Copyright (c) 2014 Heganoo
// https://github.com/heganoo/GSVPano

/**
 * @type {GSVPANO|*|{}}
 */
var GSVPANO = GSVPANO || {};

/**
 * Panoloader().
 * @param parameters
 * @constructor
 */
GSVPANO.PanoLoader = function ( parameters ) {

  'use strict';

  var _parameters = parameters || {},
    _location,
    _zoom,
    _panoId,
    _panoClient = new google.maps.StreetViewService(),
    _count = 0,
    _total = 0,
    _canvas = document.createElement( 'canvas' ),
    _ctx = _canvas.getContext( '2d' ),
    rotation = 0,
    pitch = 0,
    copyright = '',
    onSizeChange = null,
    onPanoramaLoad = null;

  /**
   * setProgress().
   * @param p
   */
  this.setProgress = function ( p ) {
    if ( this.onProgress ) {
      this.onProgress( p );
    }

  };

  /**
   * throwError().
   * @param message
   */
  this.throwError = function ( message ) {
    if ( this.onError ) {
      this.onError( message );
    }
    else {
      console.error( message );
    }
  };

  /**
   * adaptTextureToZoom().
   */
  this.adaptTextureToZoom = function () {

    var w = 416 * Math.pow( 2, _zoom ),
      h = (416 * Math.pow( 2, _zoom - 1 ));
    _canvas.width = w;
    _canvas.height = h;
//    _ctx.translate( _canvas.width, 0 );
//    _ctx.scale( -1, 1 );
  };

  /**
   * composeFromTile().
   * @param x
   * @param y
   * @param texture
   */
  this.composeFromTile = function ( x, y, texture ) {

    _ctx.drawImage( texture, x * 512, y * 512 );
    _count++;

    var p = Math.round( _count * 100 / _total );
    this.setProgress( p );

    if ( _count === _total ) {
      this.canvas = _canvas;
      if ( this.onPanoramaLoad ) {
        this.onPanoramaLoad();
      }
    }

  };

  /**
   * composePanorama().
   */
  this.composePanorama = function ( panoId ) {
    this.setProgress( 0 );
    var
      w = (_zoom == 3) ? 7 : Math.pow( 2, _zoom ),
      h = Math.pow( 2, _zoom - 1 ),
      self = this,
      url, x, y;

    _count = 0;
    _total = w * h;

    /**
     * Get the tiles.
     */
    for ( y = 0; y < h; y++ ) {
      for ( x = 0; x < w; x++ ) {
        //        url = 'https://geo0.ggpht.com/cbk?cb_client=maps_sv.tactile&authuser=0&hl=en&panoid=' + _panoId + '&output=tile&x=' + x + '&y=' + y + '&zoom=' + _zoom + '&nbt&fover=2';
//        url = 'https://cbks2.google.com/cbk?cb_client=maps_sv.tactile&authuser=0&hl=en&panoid=' + _panoId + '&output=tile&zoom=' + _zoom + '&x=' + x + '&y=' + y + '&' + Date.now();
        url = 'http://maps.google.com/cbk?output=tile&panoid=' + _panoId + '&zoom=' + _zoom + '&x=' + x + '&y=' + y + '&' + Date.now();
        (function ( x, y ) {
          var img = new Image();
          img.addEventListener( 'load', function () {
            self.composeFromTile( x, y, this );
          } );
          img.crossOrigin = '';
          img.src = url;
        })( x, y );
      }
    }
  };

  /**
   * loadData().
   * Middle function for working with IDs.
   * @param location
   */
  this.loadData = function ( location ) {
    var self = this;
    var url;

    url = 'https://maps.google.com/cbk?output=json&hl=x-local&ll=' + location.lat() + ',' + location.lng() + '&cb_client=maps_sv&v=3';
    url = 'https://cbks0.google.com/cbk?cb_client=maps_sv.tactile&authuser=0&hl=en&output=polygon&it=1%3A1&rank=closest&ll=' + location.lat() + ',' + location.lng() + '&radius=350';

    var http_request = new XMLHttpRequest();
    http_request.open( "GET", url, true );
    http_request.onreadystatechange = function () {
      if ( http_request.readyState == 4 && http_request.status == 200 ) {
        var data = JSON.parse( http_request.responseText );
        self.loadPano( location, data.result[ 0 ].id );
      }
    };
    http_request.send( null );
  };


  /**
   * The load().
   * @param location
   * @param id
   */
  this.load = function ( location, id ) {
    var self = this;
//    _panoClient.getPanoramaById( id, function (result, status) {
    _panoClient.getPanoramaByLocation( location, 50, function ( result, status ) {
      if ( status === google.maps.StreetViewStatus.OK ) {
        if ( self.onPanoramaData ) {
          self.onPanoramaData( result );
        }
        rotation = result.tiles.centerHeading * Math.PI / 180.0;
        pitch = result.tiles.originPitch;
        copyright = result.copyright;
        self.copyright = result.copyright;
        _panoId = result.location.pano;
        self.location = location;
        self.rotation = rotation;
        self.pitch = pitch;
        self.image_date = result.imageDate;
        self.id = _panoId;
        self.composePanorama();
      }
      else {
        if ( self.onNoPanoramaData ) {
          self.onNoPanoramaData( status );
        }
        self.throwError( 'Could not retrieve panorama for the following reason: ' + status );
      }
    } );

  };

  /**
  * setZoom().
  * @param z
  */
  this.setZoom = function ( z ) {
    _zoom = z;
    this.adaptTextureToZoom();
  };

  // Default zoom.
  this.setZoom( _parameters.zoom || 1 );

};
