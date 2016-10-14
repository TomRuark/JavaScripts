// Version: 2016.10.13

// Cycle all the open documents forcing into full screen mode 
// Having some fun with zoom and then filling the screen

// Photoshop version of a slide show

var c = documents.length;
if ( c ) {
    MenuItem( "screenModeFullScreen" );
    for ( var i = 0; i < c; i++ ) {
        activeDocument = documents[i];
        for (var ii = 0; ii < 10; ii++)
            MenuItem( "zoomOut" );
        for (var ii = 0; ii < 10; ii++)
            MenuItem( "zoomIn" );
        MenuItem( "fitOnScreen" );
        app.refresh();
    }
}

function MenuItem( itemName ) {
    var idselect = stringIDToTypeID( "select" );
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated( stringIDToTypeID( "menuItemClass" ), 
                       stringIDToTypeID( "menuItemType" ), 
                       stringIDToTypeID( itemName ) );
    desc.putReference( stringIDToTypeID( "null" ), ref );
    executeAction( idselect, desc, DialogModes.NO );

}
