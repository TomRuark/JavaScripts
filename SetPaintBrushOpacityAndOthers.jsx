// Version: 2016.9.15

// Set the options for the paint brush tool
// blend modes, opacity, flow and others

if (documents.length == 0) {
    var d = documents.add();
} else {
    var d = activeDocument;
}

// two layers so behind and clear are available
if (d.layers.length == 1) {
    d.artLayers.add(); 
}


// Select the paint brush tool
var idslct = stringIDToTypeID( "select" );
var desc226 = new ActionDescriptor();
var idnull = stringIDToTypeID( "null" );
var ref170 = new ActionReference();
var idPbTl = stringIDToTypeID( "paintbrushTool" );
ref170.putClass( idPbTl );
desc226.putReference( idnull, ref170 );
executeAction( idslct, desc226, DialogModes.NO );

// 29 blend modes for paint brush in CC 2015.5
var bmsS = ["normal", "dissolve", "behind", "clearEnum",
            "darken", "multiply", "colorBurn", "linearBurn", "darkerColor",
            "lighten", "screen", "colorDodge", "linearDodge", "lighterColor",
            "overlay", "softLight", "hardLight", "vividLight", "linearLight", "pinLight", "hardMix",
            "difference", "exclusion", "blendSubtraction", "blendDivide",
            "hue", "saturation", "color", "luminosity",  ]; 

var bi = 0; // blend mode index

var pfo = true;  // pressure overrides opacity
var eab = false; // enable air brush
var pfs = true;  // pressure overrides size

var refreshScreen = true;

for (var i = 1; i <= 100; i++) {
	var idset = stringIDToTypeID( "set" );
	var desc226 = new ActionDescriptor();
	var idnull = stringIDToTypeID( "null" );
	var ref170 = new ActionReference();
    var idPbTl = stringIDToTypeID( "paintbrushTool" );
    ref170.putClass( idPbTl );
    desc226.putReference( idnull, ref170 );
    var id12 = stringIDToTypeID( "to" );
    var desc5 = new ActionDescriptor();
    // opacity
    var id13 = stringIDToTypeID( "opacity" );
    var id14 = stringIDToTypeID( "percentUnit" );
    desc5.putUnitDouble( id13, id14, i );
    // blend mode
    var id15 = stringIDToTypeID( "mode" );
    var id16 = stringIDToTypeID( "blendModel" );
    var id17 = stringIDToTypeID( bmsS[bi] );
    bi++;
    if (bi >= bmsS.length)
        bi = 0;
    desc5.putEnumerated( id15, id16, id17 );
    // flow
    var id19 = stringIDToTypeID( "flow" );
    desc5.putUnitDouble( id19, id14, 100 - i );
    // pressure for opacity
    desc5.putBoolean( stringIDToTypeID( "usePressureOverridesOpacity" ), pfo );
    pfo = ! pfo;
    // pressure for size
    desc5.putBoolean( stringIDToTypeID( "usePressureOverridesSize" ), pfs );
    pfs = ! pfs;
    // enable air brush
    desc5.putBoolean( stringIDToTypeID( "repeat" ), eab );
    eab = ! eab;
    var id18 = stringIDToTypeID( "null" );
    desc226.putObject( id12, id18, desc5 );
	executeAction( idset, desc226, DialogModes.NO );
    if (refreshScreen)
        app.refresh(); // slow it down so you can see it, VERY SLOW!!
	}

'DONE';
