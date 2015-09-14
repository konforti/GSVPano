/**
 * @module GSVPANO
 */

var eventEmitter = require('event-emitter');
eventEmitter.alloff = require('event-emitter/all-off');

/**
 * One single Panoramic item
 * @class Pano
 * @author juampi92
 * @extends {EventEmitter}
 * @constructor
 * @param  {Object} params
 * @param {Hash} params.panoId
 * @param {Number} params.rotation (on degrees)
 * @param {Number} params.pitch
 * @param {Google.Maps.LatLng} params.location
 * @param {String} params.copyright
 * @param {Date} params.imageDate
 * @example
 *         var pano = new GSVPANO.Pano({
 *           id: panoId,
 *           rotation: rotation,
 *           pitch: pitch,
 *           location: location,
 *           imageDate: imageDate,
 *           copyright: copyright,
 *           zoom: zoom
 *         });
 */
var Pano = function(params) {
  eventEmitter(this);

  var _params = params || {};

  /**
   * @attribute id
   * @type {Hash}
   */
  this.id = params.id;
  /**
   * @attribute rotation
   * @type {Number}
   */
  this.setRotation(params.rotation || 0);
  /**
   * @attribute pitch
   * @type {Number}
   */
  this.pitch = params.pitch;
  /**
   * @attribute location
   * @type {Google.Maps.LatLng}
   */
  this.location = params.location;
  /**
   * @attribute imageDate
   * @type {Date}
   */
  this.imageDate = params.imageDate;
  /**
   * @attribute copyright
   * @type {String}
   */
  this.copyright = params.copyright;
  /**
   * @attribute zoom
   * @type {Number}
   */
  this.zoom = parseInt(params.zoom);
  /**
   * @attribute canvas
   * @type {Canvas Element}
   * @default null
   */
  this.canvas = null;
  /**
   * @attribute _ctx
   * @type {Canvas 2d Context}
   * @default null
   */
  this._ctx = null;
  /**
   * @attribute _loaded
   * @type {Boolean}
   */
  this._loaded = false;
};

/**
 * Saves rotation. Input in degrees
 * @method setRotation
 * @param  {Number} deg
 * @chainable
 */
Pano.prototype.setRotation = function(deg) {
  this.rotation = deg * Math.PI / 180.0;
  return this;
};

/**
 * @method initCanvas
 * @private
 */
Pano.prototype.initCanvas = function() {
  this.canvas = document.createElement('canvas');
  this._ctx = this.canvas.getContext('2d');

  var w = 416 * Math.pow(2, this.zoom),
    h = (416 * Math.pow(2, this.zoom - 1));
  this.canvas.width = w;
  this.canvas.height = h;
};

/**
 * Progress notification
 * @event progress
 * @param  {Number} p
 * @chainable
 * @example
 *         pano.on('progress', function(p) {
 *           console.log('Pano download progress: ' + p + '%');
 *         });
 */
/**
 * Complete notification
 * @event complete
 * @param  {Pano} pano
 * @chainable
 * @example
 *         pano.on('complete', function(p) {
 *           console.log('Pano completed progress: ' + p + '%');
 *         });
 */
/**
 * Will fire 'callback' when completed
 * @method compose
 * @param {Hash} panoId
 * @chainable
 * @example
 *         var pano = new Pano(...);
 *         pano.compose();
 */
Pano.prototype.compose = function() {
  this.initCanvas();

  var w,
    h = Math.pow(2, this.zoom - 1),
    url, x, y;

  switch (this.zoom) {
    case 5:
      w = 26;
      h = 13;
      break;
    case 4:
      w = 13;
      h = 7;
      break;
    case 3:
      w = 7;
      break;
    default:
      w = Math.pow(2, this.zoom);
  }

  this._count = 0;
  this._total = w * h;

  // Get the tiles
  for (y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      this.createImage(x, y);
    }
  }
  return this;
};

/**
 * Creates an Image with the appropiate load callback
 * @method createImage
 * @param  {Number} x
 * @param  {Number} y
 * @private
 */
Pano.prototype.createImage = function(x, y) {
  var url = GSVPANO._url + '&panoid=' + this.id + '&zoom=' + this.zoom + '&x=' + x + '&y=' + y + '&' + Date.now(),
    img = new Image();

  img.addEventListener('load', this.composeFromTile.bind(this, x, y, img));
  img.crossOrigin = '';
  img.src = url;
};

/**
 * @method composeFromTile
 * @param {Number} x
 * @param {Number} y
 * @param {Image} texture
 * @private
 */
Pano.prototype.composeFromTile = function(x, y, texture) {
  // Complete this section of the frame
  this._ctx.drawImage(texture, x * 512, y * 512);
  this._count++;

  var p = Math.round(this._count * 100 / this._total);
  this.emit('progress', p);

  // If finished
  if (this._count === this._total) {
    // Done loading
    this._loaded = true;
    // Trigger complete event
    this.emit('complete', this);
    // Remove all events
    eventEmitter.alloff(this);
  }
};

module.exports = Pano;