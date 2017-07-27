/**
* @author Jack Considine <jackconsidine3@gmail.com>
* @package
* 2017-07-26
*/


/**
 * Object that controls interaction between table model (see data mock), and the
 * the ultimate view that is produced. Functions include finding width of each
 * column, finding height of each column, and actually rendering the table
 * @constructor
 */
function TableController  (td, rowHeaders, ctxWrapper) {
  // construct 2d array containing table
    var self = this;
    this.tableArray = []; /* 2d array constituting table */
    this.colMinWidths = [];/* Each column needs to conform to this size, the biggest word in the column */
    this.colMaxRows = []; /* The maximum sized row for each column, in terms of pixels */
    this.colWidths = []; /* Final widths allocated to each column */
    var cartesianRow = 0; // the row we're on, but there can be multiple of these
                            //  per table row, if the table wraps around
    this.currentRow = 0;
    constructTable();
    getMinWidths();
    getMaxCells();
    getProportionalWidth();

    this.writeRow =  function () {
      // for each row, find it's width and the max width of the row
      var xOffset = 0;
      var yOffset =  ctxWrapper.getRowHeight(cartesianRow);
      for (var i=0; i<self.tableArray[this.currentRow].length; i++) {
        // Width of this particular row
        var thisWidth = (ctxWrapper.getTextSize(self.tableArray[this.currentRow][i]).width);
        // Max width of the line
        var maxWidth = self.colWidths[i];
        // Starting point for x
        if (maxWidth > thisWidth) {
          startX = (maxWidth - thisWidth) / 2 + xOffset;
          ctxWrapper.writeTet(self.tableArray[this.currentRow][i], startX, yOffset, this.currentRow===0);
        }
        else {
          writeWrappedText(self.tableArray[this.currentRow][i], xOffset, maxWidth);
        }

        var xOffset =  maxWidth + xOffset;
      }
      this.currentRow +=1;
      cartesianRow +=1;
    }


  function writeWrappedText (line, startingXOffset, endOfLine) {
    var currX = 0;
    // Go word by word writing text
    var words = line.split(" ");
    for (var i=0; i<words.length; i++) {
      words[i] += " "; // add end space
    }
    // write each word, until it will put us over the end of the line
    var it = 0;

    while (it < words.length)
     {
       if ((currX + ctxWrapper.getRawTextSize(words[it]).width) > endOfLine) {
        cartesianRow +=1;
        currX = 0;
        // return;
       }

      ctxWrapper.writeTet(words[it], currX + startingXOffset, ctxWrapper.getRowHeight(cartesianRow), self.currentRow === 0);
      currX += ctxWrapper.getRawTextSize(words[it]).width;
      it++;
    }

    // while ((currX + ctxWrapper.getTextSize(words[it]).width) < endOfLine)

  }

    this.rowHeaders = rowHeaders || false;
    /**
     * 2d array containing table data
     * @type {[type]}
     */


     /**
      * Given the maxcelll widths, and the width constraint, and the minimum widths, allocate a
      * fair width to each column
      * @return {void}
      */
     function getProportionalWidth () {
       var constraint = ctxWrapper.canvasMaxWidth;

        // Set min Widths
        for (var i=0; i<self.colMinWidths.length; i++) {
          var mWidth =  ctxWrapper.getTextSize(self.colMinWidths[i]).width;
          self.colWidths.push(mWidth);
          constraint -= mWidth;

        }

        // Get total width of largest rows from each column
        var sumWidth = 0;
        for (var i=0; i<self.colMaxRows.length; i++) {

          sumWidth += self.colMaxRows[i];
        }
        // Donate rest proportionally
        for (var i=0; i<self.colMaxRows.length; i++) {
          self.colWidths[i] += ((self.colMaxRows[i] / sumWidth) * constraint);
        }
     }

    /**
     * Gets the maximum sized row from each column to later determine the proportion
     * of each column to each other based on the maximum
     * @return {void}
     */
    function getMaxCells () {
      var maxRowsText = minHelperFunction((phrase) => {
        return phrase;
      });
      for (var i=0; i<maxRowsText.length; i++) {
        self.colMaxRows.push(ctxWrapper.getTextSize(maxRowsText[i]).width);
      }
    }

     /**
      * Gets the largest word from each column, which will be the smallest width the column can be
      * since the largest word will not be able to be broken
      * @return {void}
      */
    function getMinWidths () {
      self.colMinWidths =  minHelperFunction((phrase) => {
        return getMinWord(phrase.split(" "));
      });
    }

    /**
     * used in cases like finding min sized word, and finding max sized cell.
     * @param  {(String) => String} minDeterminingFunction function for deriving min based on cell
     * @param  {boolean} minComparison indicates whether we are sorting least first
     * @return {[type]}                        [description]
     */
    function minHelperFunction (minDeterminingFunction) {
      var minmaxList = [];
      iterateOnTableData((colHeader) => {
        var smallestWord = minDeterminingFunction(colHeader);
        // getMinWord(colHeader.split(" "));
        var minWidth = ctxWrapper.getTextSize(smallestWord).width;

        for (var i=0; i<td.data[colHeader].length; i++) {
            var w = ctxWrapper.getTextSize(minDeterminingFunction(td.data[colHeader][i])).width
            if ((w > minWidth)) {
              minWidth = w;
              smallestWord = minDeterminingFunction(td.data[colHeader][i]);
            }
        }
        minmaxList.push(smallestWord);
      });
      return minmaxList;

    }




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

    /**
     * Converts table model into 2d array for easy reference
     * @param  {[type]} td [description]
     * @return {[type]}    [description]
     */
    function constructTable () {

      setRowArrays(); //create empty array for each row
      iterateOnTableData((colHeader) => {
        self.tableArray[0].push(colHeader);
        for (var i=1; i<=td.data[colHeader].length; i++) {
          self.tableArray[i].push(td.data[colHeader][i-1]);
        }
      });
    }

    /**
     * Helper function for easily accessing JSON data of table by supplying
     * mapping function parameter
     * @param  {(colheader) => void} mappedFunction what to do on each property of the table object
     * @return {void}
     */
    function iterateOnTableData (mappedFunction) {
      for (var colHeader in td.data) {
        if (td.data.hasOwnProperty(colHeader)) {
          mappedFunction(colHeader);
        }
      }
    }


    /**
     * helper method. Creates empty array  for each row in the table, as
     * well as one for the column headers
     */
   function setRowArrays ()  {
      for (var colHeader in td.data) {
        if (td.data.hasOwnProperty(colHeader)) {

          for (var i=0; i<td.data[colHeader].length + 1; i++) {
            self.tableArray.push([]); // push empty array
          }
          return;
        }
      }
    }

}


module.exports = TableController;
