// GSVPano.js
// Copyright (c) 2014 Heganoo
// https://github.com/heganoo/GSVPano

var eventEmitter = require('event-emitter');

/**
 * @module GSVPANO
 * @author Hegano
 * @author juampi92
 */
var GSVPANO = GSVPANO || {};


/**
 * Fetch URL. Use this parameter in case the URL stops working. At
 * the end of this string, the parameters &panoid, &x, &y, &zoom 
 * and the current timestamp are appended.
 * @property GSVPANO._url
 * @type {String}
 * @default 'http://maps.google.com/cbk?output=tile'
 */
// 'https://geo0.ggpht.com/cbk?cb_client=maps_sv.tactile&authuser=0&hl=en&output=tile&nbt&fover=2'
// 'https://cbks2.google.com/cbk?cb_client=maps_sv.tactile&authuser=0&hl=en&output=tile'

GSVPANO._url = 'http://maps.google.com/cbk?output=tile';

/**
 * Data Fetch URL. Use this parameter in case the URL stops working.
 * At the end of this string, the parameter &ll is appended.
 * @property GSVPANO._data_url
 * @type {String}
 * @default 'https://cbks0.google.com/cbk?cb_client=maps_sv.tactile&authuser=0&hl=en&output=polygon&it=1%3A1&rank=closest&radius=350'
 */
GSVPANO._data_url = 'https://cbks0.google.com/cbk?cb_client=maps_sv.tactile&authuser=0&hl=en&output=polygon&it=1%3A1&rank=closest&radius=350';

GSVPANO.Pano = require('./Pano');

/**
 * @class PanoLoader
 * @extends {EventEmitter}
 * @constructor
 * @param {Object} parameters
 * @param {Number} parameters.zoom Zoom (default 1)
 * @example
 *       var loader = GSVPANO.PanoLoader({ zoom: 3 });
 */
GSVPANO.PanoLoader = function(parameters) {
  'use strict';

  eventEmitter(this);

  var self = this,
    _parameters = parameters || {},
    _location,
    _zoom,
    _panoId,
    _panoClient = new google.maps.StreetViewService(),
    _count = 0,
    _total = 0,
    _canvas = document.createElement('canvas'),
    _ctx = _canvas.getContext('2d'),
    rotation = 0,
    pitch = 0,
    copyright = '';

  /**
   * @event panorama.data
   * @param {Pano} pano
   * @example
   *     loader.on('panorama.data', function(pano){
   *       console.log('Pano ' + pano.id + ' added');
   *     });
   */

  /**
   * @event panorama.nodata
   * @param {Google.Maps.LatLng} location
   * @param {Google.Maps.StreetViewStatus} status
   */

  /**
   * @event panorama.progress
   * @param {Number} p
   * @param {Pano} pano
   * @example
   *         loader.on('progress', function(p, pano) {
   *           console.log('Pano progress: ' + p + '%');
   *         });
   */
  var setProgress = function(pano, p) {
    self.emit('panorama.progress', p, pano);
  };
  /**
   * @event panorama.load
   * @param {Pano} pano
   * @example
   *     loader.on('panorama.load', function(pano){
   *       $container.append(pano.canvas);
   *     });
   */
  var handlePanoLoad = function(callback, pano) {
    self.emit('panorama.load', pano);
    if (callback) {
      callback(pano);
    }
  };

  /**
   * @event error
   * @param {String} message
   * @example
   *     loader.on('error', function(message){
   *       console.log(message)
   *     });
   */
  var throwError = function(message) {
    self.emit('error', message);
  };

  /**
   * Middle function for working with IDs.
   * @method loadData
   * @param {Google.Maps.Location} location
   * @deprecated Disabled right now
   */
  /*this.loadData = function(location) {
    var self = this;
    var url;

    //url = 'https://maps.google.com/cbk?output=json&hl=x-local&ll=' + location.lat() + ',' + location.lng() + '&cb_client=maps_sv&v=3';
    url = GSVPANO._data_url + '&ll=' + location.lat() + ',' + location.lng();

    var http_request = new XMLHttpRequest();
    http_request.open("GET", url, true);
    http_request.onreadystatechange = function() {
      if (http_request.readyState == 4 && http_request.status == 200) {
        var data = JSON.parse(http_request.responseText);
        // self.loadPano(location, data.result[0].id);
      }
    };
    http_request.send(null);
  };*/

  /**
   * Fires panorama.data, panorama.nodata
   * @method load
   * @param {Google.Maps.Location} location
   * @param {Function} callback
   * @example
   *         // Let the panorama.load event handle it's load
   *         loader.load(new google.maps.LatLng(lat, lng));
   * @example
   *         // Also handle the load individually
   *         loader.load(new google.maps.LatLng(lat, lng), function(pano){
   *           // This individual load has been completed
   *           container.append(pano.canvas);
   *         });
   */
  this.load = function(location, callback) {
    var self = this;

    _panoClient.getPanoramaByLocation(location, 50, function(result, status) {
      if (status === google.maps.StreetViewStatus.OK) {

        var pano = new GSVPANO.Pano({
            id: result.location.pano,
            rotation: result.tiles.centerHeading,
            pitch: result.tiles.originPitch,
            copyright: result.copyright,
            imageDate: result.imageDate,
            location: result.location,
            zoom: _zoom
          })
          .on('complete', handlePanoLoad.bind(self, callback))
          .on('progress', setProgress.bind(self, pano));

        pano.compose();
        self.emit('panorama.data', pano);
      } else {
        self.emit('panorama.nodata', location, status);
        throwError('Could not retrieve panorama for the following reason: ' + status);
      }
    });
  };

  /**
   * @method setZoom
   * @param {Number} z
   */
  this.setZoom = function(z) {
    _zoom = z;
  };

  // Default zoom.
  this.setZoom(_parameters.zoom || 1);

};

global.GSVPANO = module.exports = GSVPANO;