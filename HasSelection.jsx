// Version: 2016.10.4
// Result: Tue Oct 04 2016 12:49:29 GMT-0700

HasSelection();

// Ask the document if there is a selection
// Only works on the active document
function HasSelection() {
    var hasSelection = false;
    if ( documents.length > 0 ) {
        var keySelection = stringIDToTypeID( 'selection' );
        var classProperty = stringIDToTypeID( 'property' );
        var ref = new ActionReference();
        ref.putProperty( classProperty, keySelection );
        ref.putEnumerated( stringIDToTypeID( 'document' ), stringIDToTypeID( 'ordinal' ), stringIDToTypeID( 'targetEnum' ) ); 
        var desc = executeActionGet( ref );
        if ( desc.count ) {
            hasSelection = true;
        }
    }
    return hasSelection;
}
