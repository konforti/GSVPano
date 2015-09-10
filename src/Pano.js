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
  /**
   * @attribute _ctx
   * @type {Canvas 2d Context}
   * @default null
   */
  this._ctx = null;
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
  // this._ctx.translate( this.canvas.width, 0 );
  // this._ctx.scale( -1, 1 );
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
  this.initCanvas();

  var w = (this.zoom == 3) ? 7 : Math.pow(2, this.zoom),
    h = Math.pow(2, this.zoom - 1),
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
 */
Pano.prototype.composeFromTile = function(x, y, texture) {
  this._ctx.drawImage(texture, x * 512, y * 512);
  console.log(x, y, this._count);

  this._count++;

  var p = Math.round(this._count * 100 / this._total);
  this.onProgress(p);

  if (this._count === this._total) {
    // Remove onProgress Callback (no pointers attached)
    if (this.hasOwnProperty('onProgress')) {
      this.onProgress = null;
    }
    if (this.callback) {
      this.callback(this);
    }
  }
};

module.exports = Pano;