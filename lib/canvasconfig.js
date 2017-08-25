/**
* @author Jack Considine <jackconsidine3@gmail.com>
* @package
* 2017-07-26
*/

const Canvas = require('canvas');
/* Configuration parameters */
const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 2000;
const TEXT_PADDING = 6; // 4px
const TEXT_SIZE = 16;
const FONT_FAMILY = "Helvetica";


var Image = Canvas.Image;

/**
 * Contains information for other library classes to use a singleton
 * configuration object
 * @type {CanvasConfig}
 */
function CanvasConfig () {
  this.canvas = new Canvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  this.contextWrapper = new Context2dWrapper(this.canvas, TEXT_PADDING, TEXT_SIZE, FONT_FAMILY, CANVAS_WIDTH, CANVAS_HEIGHT);
}

module.exports = new CanvasConfig();

/**
 *
 * @param       {Canvas} canvas           Canvas object for rendering images
 * @param       {Number} padding          [description]
 * @param       {[type]} textsize         [description]
 * @param       {[type]} font             [description]
 * @param       {[type]} constraintwidth  [description]
 * @param       {[type]} constraintHeight [description]
 * @constructor
 */
function Context2dWrapper (canvas, padding, textsize, font, constraintwidth, constraintHeight) {
  var ctx = canvas.getContext('2d');
  this.getCanvasMaxWidth = function() {return constraintwidth;}
  this.canvasMaxHeight = constraintHeight;
  this.padding = padding;

  this.getCanvas = () => {return canvas;}

  /**
   * Given a starting x and y, a string of text, and whether it's bold, applies this text to the image
   * @param  {string} text the text to draw on the canvas
   * @param  {number} x    starting x-coordinate
   * @param  {number} y    starting y-coordinate
   * @param  {boolean} bold whether the text being written is bold or not
   * @return {void}
   */
  this.writeText = (text, x, y, bold) => {
    if (bold) ctx.font = "bold " + textsize + "pt " + font;
    else ctx.font = textsize + "pt " + font;

    ctx.fillText(text,  x, y + padding * 2);
  }

  /**
   * Draws a line from x1, y1 to x2, y2 after accounting for padding on the X's
   * @param  {number} x1 starting x position
   * @param  {number} x2 ending x position
   * @param  {number} y1 starting y position
   * @param  {number} y2 ending y position
   * @return {void}
   */
  this.writeLine = (x1, x2, y1, y2)  => {
    x1 = (x1-padding < 0) ? 0 : x1-padding;
    x2 =(x2-padding < 0) ? 0 : x2-padding;

    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
  }

  /**
   * Returns the Y offset of a row which is a product of the row and the height of each row
   * @param  {number} rowNum number row from the top
   * @return {number} y offset
   */
  this.getRowHeight = (cartesianRow, tableRow) => {
    return tableRow * (padding * 2) + (cartesianRow) *(textsize) +  padding + 0;
  }

  /**
   * Same as above, but exclude last padding. This is to be able to draw strokes
   * @param {integer} cartesianRow the number of physical text rows down, that arent separated by tabele row
   * @param {integer} tableRow the number of table rows down.
   * @return {number} the offset from the top of the canvas to the position of
   * the given line
   */
  this.getStartingRowHeight = (cartesianRow, tableRow) => {
    return tableRow * (padding * 2) + (cartesianRow) *(textsize)  + 0;
  }

  /**
   * Uses 2d context function to
   * @param  {[type]} text [description]
   * @return {[type]}      [description]
   */
  this.getTextSize = (text, bold) => {
    if (bold != null && bold) {
      ctx.font = "bold " + textsize + "pt " + font;
    }
    else {
      ctx.font = textsize + "pt " + font;
    }
    var rawMeasure = ctx.measureText(text);
    rawMeasure.width += padding * 2; // apply padding on both sides
    ctx.font = textsize + "pt " + font;
    return rawMeasure;
  }
  /**
   * Get width without paddign
   * @param  {string} text text that we are getting width of
   * @return {object}     measure text object where width is an attribue
   */
  this.getRawTextSize = (text) => {
    return ctx.measureText(text);
  }
  /**
   * Draws a rectangle of a certain color
   * @param   {number}  x1   left most point
   * @param   {number}  y1   top most point
   * @param   {number}  x2   right most point
   * @param   {number}  y2   bottom most point
   * @param   {string}  color  string containing hex color. Needs hash prefix
   * @return  {void}
   */
  this.shadeRect = (x1, y1, x2, y2, color) => {
      ctx.fillStyle=color;
      ctx.fillRect(x1, y1, x2, y2 + padding * 2);
      ctx.fillStyle = "#000";
  }



  /**
   * Draws the frame of a rectangle (the outline)
   * @param   {number}  x1   left most point
   * @param   {number}  y1   top most point
   * @param   {number}  x2   right most point
   * @param   {number}  y2   bottom most point
   * @return  {void}
   */
  this.hollowRect = (x1, y1, x2, y2) => {
    ctx.rect(x1, y1, x2, y2 + padding * 2);
  }

}
