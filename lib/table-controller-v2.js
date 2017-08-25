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
   *  @description
   * Gets the longest single word, by length on canvas, for each column as well as the longest
   * overall cell for each column
   * @access private
   * @return {[type]} [description]
   */
  function getMinWidths () {
    var shortestWordsPerColumn = [];
    var longestCellsPerColumn = [];
    // iterate through columns. Get longest word in each column
    for (var i=0; i<self.tableArray.length; i++) {
      /*  Keep track of the biggest word from the column and its size */
      var colMaxWordWidth = 0; // max word width for this col
      var colLargestWord = null;
      var colMaxTotalWidth = 0;
      var colLargestCell = null;
      for (var j=0; j<self.tableArray[i].length; j++) {
        var thisCol = self.tableArray[i][j];
        var maxWord = getMinWord(thisCol.text.split(" "), thisCol.bold);
        // now we have maxword, add to shortestWordPerColumn
        if (ctxWrapper.getTextSize(maxWord, thisCol.bold).width > colMaxWordWidth) {
          colLargestWord = {text : maxWord, bold : thisCol.bold};
          colMaxWordWidth = ctxWrapper.getTextSize(maxWord, thisCol.bold).width;
        }
        if (ctxWrapper.getTextSize(thisCol.text, thisCol.bold).width > colMaxTotalWidth) {
          colLargestCell = thisCol;
          colMaxTotalWidth = ctxWrapper.getTextSize(thisCol.text, thisCol.bold).width;
        }
      }
      shortestWordsPerColumn.push(colLargestWord);
      longestCellsPerColumn.push(colLargestCell);
    }
    self.colMinWidths = shortestWordsPerColumn;
    self.colMaxRows = longestCellsPerColumn;
  }


  /**
   * TODO move to utility class
   * Calculates the smallest word in an array based on the ctx.getWordLength tool
   * @param  {Array} wordArray Array of words
   * @return {String}           the smallest word in the array
   */
  function getMinWord (wordArray, bold) {
    var minW = 0;
    var smallestWord = "";
    for (var i=0; i<wordArray.length; i++) {
      // get width of word
      var w = ctxWrapper.getTextSize(wordArray[i], bold).width;
      if (w > minW) {
        smallestWord = wordArray[i];
        minW = w;
      }
    }
    return smallestWord;
  }


  /**
   * Allocates minimum size per word, then donates rest based on proportion of max cell size in the column
   * @return {void} sets the colWidth Array
   */
  function getProportionalWidth () {
    // get max canvas width siz
    var cMaxWidth = ctxWrapper.getCanvasMaxWidth();
    var sumWidth = 0;
    // subtract minimum cell lengths, and add maximum cell lengths
    for (var i=0; i<self.colMinWidths.length; i++) {
      var maxMinWordLength = ctxWrapper.getTextSize(self.colMinWidths[i].text, self.colMinWidths[i].bold).width;
      sumWidth += ctxWrapper.getTextSize(self.colMaxRows[i].text, self.colMaxRows[i].bold).width;
      cMaxWidth -= maxMinWordLength;
      self.colWidths.push(maxMinWordLength);

    }
    // allocate rest of the length
    for (var i=0;i<self.colMinWidths.length; i++) {
      self.colWidths[i] += ((ctxWrapper.getTextSize(self.colMaxRows[i].text, self.colMaxRows[i].bold).width / sumWidth) * cMaxWidth);
    }

  }

  /* Begin testing */
  self.__testing__ = {};
  self.__testing__.getMinWidths = getMinWidths;
  self.__testing__.getMinWord = getMinWord;
  self.__testing__.getProportionalWidth = getProportionalWidth;
  /* End testing */


}

module.exports = TableController;
