/**
* @author Jack Considine <jackconsidine3@gmail.com>
* @package
* 2017-07-26
*/

const Canvas = require('canvas');
/* Configuration parameters */
const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 500;
const TEXT_PADDING = 4; // 4px
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
  var ctx = this.canvas.getContext('2d');
  this.contextWrapper = new Context2dWrapper(ctx, TEXT_PADDING, TEXT_SIZE, FONT_FAMILY, CANVAS_WIDTH, CANVAS_HEIGHT);
}

module.exports = new CanvasConfig();

function Context2dWrapper (ctx, padding, textsize, font, constraintwidth, constraintHeight) {

  this.canvasMaxWidth = constraintwidth;
  this.canvasMaxHeight = constraintHeight;


  this.writeTet = (text, x, y, bold) => {
    if (bold) ctx.font = "bold " + textsize + "px " + font;
    else ctx.font = textsize + "px " + font;

    ctx.fillText(text,  x, y + padding);
  }

  /**
   * Returns the Y offset of a row which is a product of the row and the height of each row
   * @param  {number} rowNum number row from the top
   * @return {number} y offset
   */
  this.getRowHeight = (rowNum) => {
    return rowNum * (textsize  + padding * 2) + padding + 25;
  }

  this.getTextSize = (text) => {
    var rawMeasure = ctx.measureText(text);
    rawMeasure.width += padding * 2; // apply padding on both sides
    return rawMeasure;
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
