/**
 * @module GSVPANO
 */

/**
 * One single Panoramic item
 * @class Pano
 * @author juampi92
 * @constructor
 * @param  {Object} params
 * @param {Hash} params.panoId
 * @param {Number} params.rotation (on degrees)
 * @param {Number} params.pitch
 * @param {Google.Maps.LatLng} params.location
 * @param {String} params.copyright
 * @param {Date} params.imageDate
 * @param {Function} callback Function to call when the Pano is done loading
 */
var Pano = function(params, callback) {
  var _params = params || {};

  /**
   * @attribute id
   * @type {Hash}
   */
  this.id = params.panoId;
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
   * @attribute image_date
   * @type {Date}
   */
  this.image_date = params.imageDate;
  /**
   * @attribute copyright
   * @type {String}
   */
  this.copyright = params.copyright;
  /**
   * @attribute zoom
   * @type {Number}
   */
  this.zoom = params.zoom;
  /**
   * @attribute callback
   * @type {Function}
   */
  this.callback = callback;
  /**
   * @attribute canvas
   * @type {Canvas Element}
   * @default null
   */
  this.canvas = null;
};

/**
 * Saves rotation. Input in degrees
 * @method setRotation
 * @param  {Number} deg
 */
Pano.prototype.setRotation = function(deg) {
  this.rotation = deg * Math.PI / 180.0;
};

/**
 * Progress notification
 * @event onProgress
 * @param  {Number} p
 */
Pano.prototype.onProgress = function(p) {};

/**
 * @method composePanorama
 * @param {Hash} panoId
 */
Pano.prototype.composePanorama = function() {
  var w = (_zoom == 3) ? 7 : Math.pow(2, _zoom),
    h = Math.pow(2, _zoom - 1),
    url, x, y;

  /**
   * @property _count
   * @type {Number}
   * @private
   */
  this._count = 0;
  /**
   * @property _total
   * @type {Number}
   * @private
   */
  this._total = w * h;

  // Get the tiles
  for (y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      this.createImage(x, y);
    }
  }
};

/**
 * Creates an Image with the appropiate load callback
 * @method createImage
 * @param  {Number} x
 * @param  {Number} y
 * @private
 */
Pano.prototype.createImage = function(x, y) {
  var url = _url + '&panoid=' + this.id + '&zoom=' + this.zoom + '&x=' + x + '&y=' + y + '&' + Date.now(),
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
 */
Pano.prototype.composeFromTile = function(x, y, texture) {
  var _canvas = document.createElement('canvas'),
    _ctx = _canvas.getContext('2d');
  _ctx.drawImage(texture, x * 512, y * 512);

  this._count++;

  var p = Math.round(this._count * 100 / this._total);
  this.onProgress(p);

  if (this._count === this._total) {
    this.canvas = _canvas;
    if (this.callback) {
      callback(this);
    }
  }
};

module.exports = Pano;