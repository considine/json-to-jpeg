/**
* @author Jack Considine <jackconsidine3@gmail.com>
* @package
* 2017-08-24
*/

require("./utils/transpose.js")();

function TableController  (td, ctxWrapper)  {
  var self = this;
  this.tableRowArray = td.data; /* 2d array constituting table, array of rows */
  this.colMinWidths = [];/* Each column needs to conform to this size, the biggest word in the column */
  this.colMaxRows = []; /* The maximum sized row for each column, in terms of pixels */
  this.colWidths = []; /* Final widths allocated to each column */
  this.tableArray = td.data.transpose(); /* Array of columns */

  /**
   * Gets the longest single word, by length on canvas, for each column
   * @return {[type]} [description]
   */
  function getMinWidths () {
    var shortestWordsPerColumn = [];
    // iterate through columns. Get longest word in each column
    for (var i=0; i<self.tableArray.length; i++) {
      var colMinWidth = 0; // min width for this col
      for (var j=0; j<self.tableArray[i].length; j++) {
        var thisCol =
        // max size word from this col:
        var maxWord = getMinWord(self.tableArray[i][j].text.split(" "), );
      }
    }
  }


  /**
   * TODO move to utility class
   * Calculates the smallest word in an array based on the ctx.getWordLength tool
   * @param  {Array} wordArray Array of words
   * @return {String}           the smallest word in the array
   */
  function getMinWord (wordArray) {
    var minW = 0;
    var smallestWord = "";
    for (var i=0; i<wordArray.length; i++) {
      // get width of word
      var w = ctxWrapper.getTextSize(wordArray[i]).width;
      if (w > minW) {
        smallestWord = wordArray[i];
        minW = w;
      }
    }
    return smallestWord;
  }

  /* Begin testing */
  self.__testing__ = {};
  self.__testing__.getMinWidths = getMinWidths;
  self.__testing__.getMinWord = getMinWord;
  /* End testing */


}

module.exports = TableController;
