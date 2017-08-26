/**
* @author Jack Considine <jackconsidine3@gmail.com>
* @package
* 2017-07-26
*/

var CanvasConfig = require("./lib/canvasconfig.js");
var wordLengthUtils = require("./lib/wordlengthutils.js");


// Get data
const DATA_TABLE = require("./tests/test-data");
var DataController = require("./lib/table-controller-v2");
wordLengthUtils.columnCheck(DATA_TABLE);

var dc = new DataController(DATA_TABLE, CanvasConfig.contextWrapper);

module.exports = dc;
