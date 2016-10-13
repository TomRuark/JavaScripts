// Version: 2016.10.13

// Close all documents except the one in the front.
// This will pop the save dialog as necessary

var c = documents.length;
if ( c > 1 ) {
    var d = activeDocument;
    c--;
    while ( c >= 0 ) {
        var t = documents[c];
        if ( d != t ) {
            t.close(); // Add in an option here if you know your saving conditions already
        }
        c--;
    }
}
