/**
* @author Jack Considine <jackconsidine3@gmail.com>
* @package
* 2017-07-26
*/

var CanvasConfig = require("./lib/canvasconfig.js");
var wordLengthUtils = require("./lib/wordlengthutils.js");


// Get data
const DATA_TABLE = require("./table-data.js");
var DataController = require("./lib/table-controller");

var dc = new DataController(DATA_TABLE, false, CanvasConfig.contextWrapper);
dc.writeRow();
dc.writeRow();
dc.writeRow();
dc.writeRow();
dc.writeRow();

console.log("<img src='" + CanvasConfig.canvas.toDataURL() + "'>");

wordLengthUtils.columnCheck(DATA_TABLE);
