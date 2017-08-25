/**
* @author Jack Considine <jackconsidine3@gmail.com>
* @package table-to-png
* 2017-08-24
*/
// Test Data
var testdata = require("./test-data.js");
var CanvasConfig = require("../lib/canvasconfig.js");
// Controller
var TableController = new require("../lib/table-controller-v2.js");


var assert = require("assert");
describe('TableController', function () {
  // get private methods
  var tcontroller = new TableController(testdata, CanvasConfig.contextWrapper);
  tcontroller.__testing__.getMinWidths();
});
