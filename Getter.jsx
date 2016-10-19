// Version 2016.10.19
// Git public version on 2016.10.19

// Get all the keys and values from Photoshop

// If you are looking for information but cannot find it in the DOM.
// Run this script with your document/layer/channel or other in question
// as the target and look at the Getter_JSX.txt on your desktop for
// the information.

// Dumps application, document, layer, channel, path, history, actions and action sets

// Converts ActionDescriptor to JavaScript object

var myLogging = new MyLogging(false /* Alert */, 
                              false /* WriteLine */, 
                              true /* Log File */, 
                              Folder.desktop + "/Getter_JSX_Extra.txt");

var totalTime = new Timer();

var outputFile = new File(Folder.desktop + "/Getter_JSX.txt"); 
outputFile.remove();

// TODO: convert all of these to the string equivalents for easier reading
// some runtime id's
var classActionSet = app.charIDToTypeID('ASet');
var classAction = app.charIDToTypeID('Actn');
var classApplication = app.charIDToTypeID('capp');
var classBackgroundLayer = app.charIDToTypeID('BckL');
var classChannel = app.charIDToTypeID('Chnl');
var classDocument = app.charIDToTypeID('Dcmn');
var classHistoryState = app.charIDToTypeID('HstS');
var classLayer = app.charIDToTypeID('Lyr ');
var classPath = app.charIDToTypeID('Path');
var classProperty = app.charIDToTypeID('Prpr');
var enumTarget = app.charIDToTypeID('Trgt');
var enumZoom = app.charIDToTypeID('Zm  ');
var eventSet = app.charIDToTypeID( "setd" );
var keyBackground = app.charIDToTypeID('Bckg');
var keyCount = app.stringIDToTypeID("count");
var keyTo = app.charIDToTypeID( 'T   ' );
var kcachePrefs = app.stringIDToTypeID("cachePrefs");
var kgeneratorEnabledStrID = app.stringIDToTypeID("generatorEnabled");
var kgeneratorSettingsStrID = app.stringIDToTypeID("generatorSettings");
var kgeneratorStatusStrID = app.stringIDToTypeID("generatorStatus");
var kLayerID = app.stringIDToTypeID("layerID");
var kLayerName = app.stringIDToTypeID("name");
var kopenglEnabled = app.stringIDToTypeID("openglEnabled");
var kpluginPickerStrID = app.stringIDToTypeID("pluginPicker");
var kreadBytesStrID = app.stringIDToTypeID("readBytes");
var kreadMessagesStrID = app.stringIDToTypeID("readMessages");
var kreadStatusStrID = app.stringIDToTypeID("readStatus");
var ksmartObjectMoreStr = app.stringIDToTypeID("smartObjectMore");
var kwriteBytesStrID = app.stringIDToTypeID("writeBytes");
var kwriteMessagesStrID = app.stringIDToTypeID("writeMessages");
var kwriteStatusStrID = app.stringIDToTypeID("writeStatus");
var kzoomStr = app.stringIDToTypeID("zoom");
var typeOrdinal = app.charIDToTypeID('Ordn');
var typeNULL = app.charIDToTypeID('null');
var unitPercent = app.charIDToTypeID('#Prc');
            


var ref = new ActionReference();
ref.putEnumerated(classApplication, typeOrdinal, enumTarget);
var desc = executeActionGet(ref);

var appObj = new Object();
appObj.objectName = "Photoshop Application";
DescriptorToObject(appObj, desc);
ObjectToFile(appObj, outputFile);
appObj.documents = new Array();
var docArray = appObj.documents;

appObj.actionSets = new Array();
GetActionInfo(appObj.actionSets, outputFile);

// Check my results against some known properties that should exist
if (appObj.numberOfDocuments == undefined)
    myLogging.LogIt("FAIL: appObj.numberOfDocuments == undefined " + 
                   appObj.numberOfDocuments + " == " + undefined);
                   
// Check against the DOM to see if they match as well
if (appObj.numberOfDocuments != documents.length) 
    myLogging.LogIt("FAIL: appObj.numberOfDocuments != documents.length " + 
                   appObj.numberOfDocuments + " != " + documents.length);

if (documents.length > 1)
    var rememberDocument = activeDocument;

var ref = new ActionReference();
ref.putEnumerated(classDocument, typeOrdinal, enumTarget);

for (var i = 0; i < documents.length; i++) {
    activeDocument = documents[i];
    desc = executeActionGet(ref);
    var docData = new Object();
    docData.objectName = "Photoshop Document";
    DescriptorToObject(docData, desc);
    ObjectToFile(docData, outputFile);
    
    // the following have DescriptorToObject and ObjectToFile calls included
    docData.historyInfo = new Array();
    GetHistoryInfo(docData.historyInfo, outputFile);
    docData.flatLayers = new Array();
    GetBackgroundInfo(docData.flatLayers, outputFile);
    GetLayerInfo(docData.flatLayers, docData.numberOfLayers, outputFile);
    docData.channels = new Array();
    GetChannelInfo(docData.channels, docData.numberOfChannels, outputFile);
    docData.paths = new Array();
    GetPathInfo(docData.paths, docData.numberOfPaths, outputFile);
    docArray.push(docData);
}

if (documents.length > 1)
    activeDocument = rememberDocument;

if (documents.length) {
	myLogging.LogIt("Layer ids: " + GetLayerIDs(docArray[0].numberOfLayers));
    myLogging.LogIt("Layer names: " + GetLayerNames(docArray[0].numberOfLayers));
}

// Some specific things to dump to the Extras file to prove all is working
myLogging.LogIt("GPU Enabled: " + GetGPUEnabled());

myLogging.LogIt("GetGeneratorData: " + GetGeneratorData());

myLogging.LogIt("GetGeneratorPreference: " + GetGeneratorPreference());

myLogging.LogIt("GetGeneratorStatus: " + GetGeneratorStatus());

myLogging.LogIt("GetSmartObjectInfo: " + GetSmartObjectInfo());

myLogging.LogIt("Script Time: " + totalTime.getElapsed());

outputFile.execute();

myLogging.execute();

'DONE';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Function: GetBackgroundInfo
// Usage: Get all info about the current documents background layer
// Input: JavaScript Array (inOutArray), current Array of layers found
//        JavaScript File (inLogFile), file to append to information to
// Return: Nothing, inOutArray is updated and log file is appended
///////////////////////////////////////////////////////////////////////////////
function GetBackgroundInfo(inOutArray, inLogFile) {
    try {
        var ref = new ActionReference();
        ref.putProperty(classBackgroundLayer, keyBackground);
        ref.putEnumerated(classDocument, typeOrdinal, enumTarget);
        desc = executeActionGet(ref);
        var backgroundData = new Object();
        backgroundData.objectName = "Photoshop Background Layer";
        DescriptorToObject(backgroundData, desc);
        ObjectToFile(backgroundData, inLogFile);
        inOutArray.push(backgroundData);
   }
   catch(e) {
       ; // current document might not have a background or no document open
   }
}

///////////////////////////////////////////////////////////////////////////////
// Function: GetHistoryInfo
// Usage: Get all info about the current documents history
// Input: JavaScript Array (inOutArray), current Array of layers found
//        JavaScript File (inLogFile), file to append to information to
// Return: Nothing, inOutArray is updated and log file is appended
///////////////////////////////////////////////////////////////////////////////
function GetHistoryInfo(inOutArray, inLogFile) {
    try {
        var ref = new ActionReference();
        ref.putProperty(classProperty, keyCount);
        ref.putEnumerated(classHistoryState, typeOrdinal, enumTarget);
        desc = executeActionGet(ref);
        if (desc.hasKey(keyCount))
            var hCount = desc.getInteger(keyCount);
        for (var i = hCount; i > 0; i--) {
            var ref = new ActionReference();
            ref.putIndex(classHistoryState, i);
            desc = executeActionGet(ref);
            var historyData = new Object();
            historyData.objectName = "Document History";
            DescriptorToObject(historyData, desc);
            ObjectToFile(historyData, inLogFile);
            inOutArray.push(historyData);
        }
   }
   catch(e) {
       ; // did you call me with no document open
   }
}

///////////////////////////////////////////////////////////////////////////////
// Function: GetLayerInfo
// Usage: Get all info about the current documents layers
// Input: JavaScript Array (inOutArray), current Array of layers found
//        inFlatLayerCount, the number of layers in the document, not counting background layer
//        JavaScript File (inLogFile), file to append to information to
// Return: Nothing, inOutArray is updated and log file is appended
///////////////////////////////////////////////////////////////////////////////
function GetLayerInfo(inOutArray, inFlatLayerCount, inLogFile) {
    for (var i = inFlatLayerCount; i > 0; i--) {
        var ref = new ActionReference();
        ref.putIndex(classLayer, i);
        ref.putEnumerated(classDocument, typeOrdinal, enumTarget);
        desc = executeActionGet(ref);
        var layerData = new Object();
        layerData.objectName = "Photoshop Layer";
        DescriptorToObject(layerData, desc);
        ObjectToFile(layerData, inLogFile);
        inOutArray.push(layerData);
   }
}

///////////////////////////////////////////////////////////////////////////////
// Function: GetChannelInfo
// Usage: Get all info about the current documents channels
// Input: JavaScript Array (inOutArray), current Array of channels found
//        inChannelCount, the number of channels in the document
//        JavaScript File (inLogFile), file to append to information to
// Return: Nothing, inOutArray is updated and log file is appended
///////////////////////////////////////////////////////////////////////////////
function GetChannelInfo(inOutArray, inChannelCount, inLogFile) {
    for (var i = inChannelCount; i > 0; i--) {
        var ref = new ActionReference();
        ref.putIndex(classChannel, i);
        ref.putEnumerated(classDocument, typeOrdinal, enumTarget);
        desc = executeActionGet(ref);
        var channelData = new Object();
        channelData.objectName = "Photoshop Channel";
        DescriptorToObject(channelData, desc);
        ObjectToFile(channelData, inLogFile);
        inOutArray.push(channelData);
   }
}

///////////////////////////////////////////////////////////////////////////////
// Function: GetPathInfo
// Usage: Get all info about the current documents paths (vector paths)
// Input: JavaScript Array (inOutArray), current Array of channels found
//        inPathCount, the number of paths in the document
//        JavaScript File (inLogFile), file to append to information to
// Return: Nothing, inOutArray is updated and log file is appended
///////////////////////////////////////////////////////////////////////////////
function GetPathInfo(inOutArray, inPathCount, inLogFile) {
    for (var i = inPathCount; i > 0; i--) {
        var ref = new ActionReference();
        ref.putIndex(classPath, i);
        ref.putEnumerated(classDocument, typeOrdinal, enumTarget);
        desc = executeActionGet(ref);
        var pathData = new Object();
        pathData.objectName = "Photoshop Path";
        DescriptorToObject(pathData, desc);
        ObjectToFile(pathData, inLogFile);
        inOutArray.push(pathData);
   }
}

///////////////////////////////////////////////////////////////////////////////
// Function: GetActionInfo
// Usage: Get all info about the applications action sets and actions in the set
// Input: JavaScript Array (inOutArray), current Array of action sets
//        JavaScript File (inLogFile), file to append to information to
// Return: Nothing, inOutArray is updated and log file is appended
///////////////////////////////////////////////////////////////////////////////
function GetActionInfo(inOutArray, inLogFile) {
    try {
        var setCounter = 1;
        while (setCounter) {
            // the action stuff doesn't work so well, no way to get a count of the sets
            // try to get information out of each set until we fail
            // then exit gracefully
            var ref = new ActionReference();
            ref.putIndex(classActionSet, setCounter);
            desc = executeActionGet(ref);
            var actionSetCount = 0;
            if (desc.hasKey(keyCount))
                actionSetCount = desc.getInteger(keyCount);
            
            var actionSetInfo = new Object();
            actionSetInfo.objectName = "Photoshop Action Set";
            DescriptorToObject(actionSetInfo, desc);
            ObjectToFile(actionSetInfo, inLogFile);
            
            actionSetInfo.actions = new Array();
            
            for (var i = 1; i <= actionSetCount; i++) {
                var ref = new ActionReference();
                ref.putIndex(classAction, i);
                ref.putIndex(classActionSet, setCounter);
                desc = executeActionGet(ref);
                var actionInfo = new Object();
                actionInfo.objectName = "Photoshop Action";
                DescriptorToObject(actionInfo, desc);
                ObjectToFile(actionInfo, inLogFile);
                actionSetInfo.actions.push(actionInfo);
            }

            inOutArray.push(actionSetInfo);
            
            setCounter++;
        }
    } catch(e) {
        ;
    }
}

///////////////////////////////////////////////////////////////////////////////
// Function: GetLayerIDs
// Usage: Get all layer ids from the current document
// Input: inFlatLayerCount, the number of layers in the document, not counting background layer
// Return: Array of layer ids
///////////////////////////////////////////////////////////////////////////////
function GetLayerIDs(inFlatLayerCount) {
    var ids = new Array();
    for (var i = inFlatLayerCount; i > 0; i--) {
        var ref = new ActionReference();
        ref.putProperty(classProperty, kLayerID);
        ref.putIndex(classLayer, i);
        ref.putEnumerated(classDocument, typeOrdinal, enumTarget);
        desc = executeActionGet(ref);
        if (desc.hasKey(kLayerID)) {
            var anID = desc.getInteger(kLayerID);
            var anObj = new Object();
            DescriptorToObject(anObj, desc);
            // quick test to see that all is working as expected
            if (anID != anObj.layerID) {
                myLogging.LogIt("FAIL: anID != anObj.layerID " + anID + " : " + anObj.layerID);
            }
            ids.push(anID);
        }
   }
    return ids;
}

///////////////////////////////////////////////////////////////////////////////
// Function: GetLayerNames
// Usage: Get all layer names from the current document
// Input: inFlatLayerCount, the number of layers in the document, not counting background layer
// Return: Array of layer names
///////////////////////////////////////////////////////////////////////////////
function GetLayerNames(inFlatLayerCount) {
    var ids = new Array();
    for (var i = inFlatLayerCount; i > 0; i--) {
        var ref = new ActionReference();
        ref.putProperty(classProperty, kLayerName);
        ref.putIndex(classLayer, i);
        ref.putEnumerated(classDocument, typeOrdinal, enumTarget);
        desc = executeActionGet(ref);
        if (desc.hasKey(kLayerName)) {
            var aName = desc.getString(kLayerName);
            var anObj = new Object();
            DescriptorToObject(anObj, desc);
            // quick test to see that all is working as expected
            if (aName != anObj.name) {
                myLogging.LogIt("FAIL: aName != anObj.name " + aName + " : " + anObj.name);
            }
            ids.push(aName);
        }
   }
    return ids;
}

///////////////////////////////////////////////////////////////////////////////
// Function: GetGPUEnabled
// Usage: See if the GPU is currently enabled by looking at cache preferences
// Input: None
// Return: true for gpu enabled, false for gpu disabled
///////////////////////////////////////////////////////////////////////////////
function GetGPUEnabled() {
    var gpuEnabled = false;

    var ref = new ActionReference();
    ref.putProperty(classProperty, kcachePrefs);
    ref.putEnumerated(classApplication, typeOrdinal, enumTarget);
    var desc = executeActionGet(ref);
    if (desc.hasKey(kcachePrefs)) {
        var cacheDesc = desc.getObjectValue(kcachePrefs);
        if (cacheDesc.hasKey(kopenglEnabled)) {
            gpuEnabled = cacheDesc.getBoolean(kopenglEnabled);
        }
    }
    var anObj = new Object();
    DescriptorToObject(anObj, desc);
    if (gpuEnabled != anObj.cachePrefs.openglEnabled) {
        myLogging.LogIt("FAIL: gpuEnabled != anObj.cachePrefs.openglEnabled " + gpuEnabled + " : " + anObj.cachePrefs.openglEnabled);
    }
    return gpuEnabled;
}

///////////////////////////////////////////////////////////////////////////////
// Function: GetGeneratorData
// Usage: Get information about the generator settings for the current document
// Input: None
// Return: JavaScript object converted using toSource
///////////////////////////////////////////////////////////////////////////////
function GetGeneratorData() {
    var anObj = new Object();
    try {
        var ref = new ActionReference();
        ref.putProperty(classProperty, kgeneratorSettingsStrID);
        ref.putEnumerated(classDocument, typeOrdinal, enumTarget);
        desc = executeActionGet(ref);
        if (desc.hasKey(kgeneratorSettingsStrID)) {
            var genDesc = desc.getObjectValue(kgeneratorSettingsStrID);
            DescriptorToObject(anObj, genDesc);
        }
   } catch( e ) {
       ; // no generator info for this document
   }
   return anObj.toSource();
}

///////////////////////////////////////////////////////////////////////////////
// Function: SetGeneratorData
// Usage: Test to see if we can set the generator information for current document
// Input: None
// Return: ActionDescriptor, should be same as what we set
///////////////////////////////////////////////////////////////////////////////
function SetGeneratorData() {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty( classProperty, kgeneratorSettingsStrID );
    ref.putEnumerated( classDocument, typeOrdinal, enumTarget );
    desc.putReference( typeNULL, ref );
    var toDesc = new ActionDescriptor();
    toDesc.putUnitDouble(enumZoom, unitPercent, 3.333333);
    desc.putObject( keyTo, kzoomStr, toDesc );
    executeAction( eventSet, desc, DialogModes.NO );
}

///////////////////////////////////////////////////////////////////////////////
// Function: GetGeneratorPreference
// Usage: Check generator settings for the application
// Input: None
// Return: true for generator enabled at the application level, false otherwise
///////////////////////////////////////////////////////////////////////////////
function GetGeneratorPreference() {
    var generatorEnabled = false;
    try {
        var ref = new ActionReference();
        ref.putProperty(classProperty, kpluginPickerStrID);
        ref.putEnumerated(classApplication, typeOrdinal, enumTarget);
        var desc = executeActionGet(ref);
        if (desc.hasKey(kpluginPickerStrID)) {
            var pluginPickerDesc = desc.getObjectValue(kpluginPickerStrID);
            if (pluginPickerDesc.hasKey(kgeneratorEnabledStrID)) {
                generatorEnabled = pluginPickerDesc.getBoolean(kgeneratorEnabledStrID);
            }
        }
        var anObj = new Object();
        if ( typeof DescriptorToObject == "function" ) {
            DescriptorToObject(anObj, desc);
            if ( generatorEnabled != anObj.pluginPicker.generatorEnabled ) {
                myLogging.LogIt( "FAIL: generatorEnabled != anObj.pluginPicker.generatorEnabled " + generatorEnabled + " : " + anObj.pluginPicker.generatorEnabled );
            }
        }
    } catch( e ) {
        ;
    }
    return generatorEnabled;
}

///////////////////////////////////////////////////////////////////////////////
// Function: GetGeneratorStatus
// Usage: Get some status of generator, including read/write statistics
// Input: None
// Return: JavaScript object converted using toSource
///////////////////////////////////////////////////////////////////////////////
function GetGeneratorStatus() {
    var generatorStatus = {};
    try {
        var ref = new ActionReference();
        ref.putProperty(classProperty, kgeneratorStatusStrID);
        ref.putEnumerated(classApplication, typeOrdinal, enumTarget);
        var desc = executeActionGet(ref);
        if (desc.hasKey(kgeneratorStatusStrID)) {
            var generatorStatusDesc = desc.getObjectValue(kgeneratorStatusStrID);
            if (generatorStatusDesc.hasKey(kgeneratorStatusStrID)) {
                generatorStatus.generatorStatus = generatorStatusDesc.getBoolean(kgeneratorStatusStrID);
            }
            if (generatorStatusDesc.hasKey(kreadStatusStrID)) {
                generatorStatus.readStatus = generatorStatusDesc.getInteger(kreadStatusStrID);
            }
            if (generatorStatusDesc.hasKey(kwriteStatusStrID)) {
                generatorStatus.writeStatus = generatorStatusDesc.getInteger(kwriteStatusStrID);
            }
            if (generatorStatusDesc.hasKey(kreadBytesStrID)) {
                generatorStatus.readBytes = generatorStatusDesc.getLargeInteger(kreadBytesStrID);
            }
            if (generatorStatusDesc.hasKey(kreadMessagesStrID)) {
                generatorStatus.readMessages = generatorStatusDesc.getInteger(kreadMessagesStrID);
            }
            if (generatorStatusDesc.hasKey(kwriteBytesStrID)) {
                generatorStatus.writeBytes = generatorStatusDesc.getLargeInteger(kwriteBytesStrID);
            }
            if (generatorStatusDesc.hasKey(kwriteMessagesStrID)) {
                generatorStatus.writeMessages = generatorStatusDesc.getInteger(kwriteMessagesStrID);
            }
        }
        var anObj = new Object();
        if ( typeof DescriptorToObject == "function" ) {
            DescriptorToObject(anObj, desc);
            if ( generatorStatus.readBytes != anObj.generatorStatus.readBytes ) {
                myLogging.LogIt( " generatorStatus.readBytes != anObj.generatorStatus.readBytes " + generatorStatus.readBytes + " : " + anObj.generatorStatus.readBytes );
            }
        }
    } catch( e ) {
        ;
    }
    return generatorStatus.toSource();
}

///////////////////////////////////////////////////////////////////////////////
// Function: GetSmartObjectInfo
// Usage: Get some details about the smart object for current layer
// Input: None
// Return: JavaScript object converted using toSource
///////////////////////////////////////////////////////////////////////////////
function GetSmartObjectInfo() {
    var anObj = new Object();
    if (documents.length) {
        var ref = new ActionReference();
        ref.putProperty(classProperty, ksmartObjectMoreStr);
        ref.putEnumerated(classLayer, typeOrdinal, enumTarget);
        var desc = executeActionGet(ref);
        if (desc.hasKey(ksmartObjectMoreStr)) {
            DescriptorToObject(anObj, desc);
        }
    }
    return anObj.toSource();
}

///////////////////////////////////////////////////////////////////////////////
// Function: ObjectToFile
// Usage: Dump out a JavaScript object to File
// Input: JavaScript Object (o), current object to output
//        JavaScript File (f), file to append to
// Return: error, 0 means OK, -1 means could not open, positive means issues with
//         certain items in the object
// TODO: why can't I just toSource() the entire thing?
///////////////////////////////////////////////////////////////////////////////
function ObjectToFile(o, f) {
    var returnValue = 0;
    if (f.open('a')) {
        for (var i in o) { 
            if ( ! f.writeln(i + " : " + o[i].toSource())) {
                myLogging.LogIt("FAIL: Could not write: " + i + " : " + o[i].toSource());
                returnValue++;
            }
        }
        f.writeln();
        f.close();
    } else {
        myLogging.LogIt("FAIL: Could not append to file.");
        returnValue = -1;
    }
    return returnValue;
}



///////////////////////////////////////////////////////////////////////////////
// Function: DescriptorToObject
// Usage: update a JavaScript Object from an ActionDescriptor
// Input: JavaScript Object (o), current object to update (output)
//  Photoshop ActionDescriptor (d), descriptor to pull new params for object from
//  JavaScript Function (f), post process converter utility to convert
// Return: Nothing, update is applied to passed in JavaScript Object (o)
///////////////////////////////////////////////////////////////////////////////
function DescriptorToObject(o, d, f) {
	var l = d.count;
	for (var i = 0; i < l; i++) {
		var k = d.getKey(i);
		var t = d.getType(k);
		var strk = app.typeIDToStringID(k);
        if (strk.length == 0) {
            strk = app.typeIDToCharID(k);
        }
		switch (t) {
			case DescValueType.BOOLEANTYPE:
				o[strk] = d.getBoolean(k);
				break;
			case DescValueType.STRINGTYPE:
				o[strk] = d.getString(k);
				break;
			case DescValueType.DOUBLETYPE:
				o[strk] = d.getDouble(k);
				break;
			case DescValueType.INTEGERTYPE:
                o[strk] = d.getInteger(k);
                break;
            case DescValueType.LARGEINTEGERTYPE:
            	o[strk] = d.getLargeInteger(k);
            	break;
			case DescValueType.OBJECTTYPE:
                var newT = d.getObjectType(k);
                var newV = d.getObjectValue(k);
                o[strk] = new Object();
                DescriptorToObject(o[strk], newV, f);
                break;
			case DescValueType.UNITDOUBLE:
                var newT = d.getUnitDoubleType(k);
                var newV = d.getUnitDoubleValue(k);
                o[strk] = new Object();
                o[strk].type = typeIDToCharID(newT);
                o[strk].typeString = typeIDToStringID(newT);
                o[strk].value = newV;
                break;
			case DescValueType.ENUMERATEDTYPE:
                var newT = d.getEnumerationType(k);
                var newV = d.getEnumerationValue(k);
                o[strk] = new Object();
                o[strk].type = typeIDToCharID(newT);
                o[strk].typeString = typeIDToStringID(newT);
                o[strk].value = typeIDToCharID(newV);
                o[strk].valueString = typeIDToStringID(newV);
                break;
			case DescValueType.CLASSTYPE:
                o[strk] = d.getClass(k);
                break;
			case DescValueType.ALIASTYPE:
                o[strk] = d.getPath(k);
                break;
			case DescValueType.RAWTYPE:
                var tempStr = d.getData(k);
                o[strk] = new Array();
                for (var tempi = 0; tempi < tempStr.length; tempi++) { 
                    o[strk][tempi] = tempStr.charCodeAt(tempi); 
                }
                break;
			case DescValueType.REFERENCETYPE:
                var ref = d.getReference(k);
                o[strk] = new Object();
                ReferenceToObject(o[strk], ref, f);
                break;
			case DescValueType.LISTTYPE:
                var list = d.getList(k);
                o[strk] = new Array();
                ListToObject(o[strk], list, f);
                break;
			default:
				myLogging.LogIt("Unsupported type in descriptorToObject " + t);
		}
	}
	if (undefined != f) {
		o = f(o);
	}
}



///////////////////////////////////////////////////////////////////////////////
// Function: ListToObject
// Usage: update a JavaScript Object from an ActionList
// Input: JavaScript Array (a), current array to update (output)
//        Photoshop ActionList (l), list to pull new params for object from
//        JavaScript Function (f), post process converter utility to convert
// Return: Nothing, update is applied to passed in JavaScript Object (o)
///////////////////////////////////////////////////////////////////////////////
function ListToObject(a, l, f) {
	var c = l.count;
	for (var i = 0; i < c; i++) {
		var t = l.getType(i);
		switch (t) {
			case DescValueType.BOOLEANTYPE:
				a.push(l.getBoolean(i));
				break;
			case DescValueType.STRINGTYPE:
				a.push(l.getString(i));
				break;
			case DescValueType.DOUBLETYPE:
				a.push(l.getDouble(i));
				break;
			case DescValueType.INTEGERTYPE:
                a.push(l.getInteger(i));
                break;
            case DescValueType.LARGEINTEGERTYPE:
            	a.push(l.getLargeInteger(i));
            	break;
			case DescValueType.OBJECTTYPE:
                var newT = l.getObjectType(i);
                var newV = l.getObjectValue(i);
                var newO = new Object();
                a.push(newO);
                DescriptorToObject(newO, newV, f);
                break;
			case DescValueType.UNITDOUBLE:
                var newT = l.getUnitDoubleType(i);
                var newV = l.getUnitDoubleValue(i);
                var newO = new Object();
                a.push(newO);
                newO.type = typeIDToCharID(newT);
                newO.typeString = typeIDToStringID(newT);
                newO.value = newV;
                break;
			case DescValueType.ENUMERATEDTYPE:
                var newT = l.getEnumerationType(i);
                var newV = l.getEnumerationValue(i);
                var newO = new Object();
                a.push(newO);
                newO.type = typeIDToCharID(newT);
                newO.typeString = typeIDToStringID(newT);
                newO.value = typeIDToCharID(newV);
                newO.valueString = typeIDToStringID(newV);
                break;
			case DescValueType.CLASSTYPE:
                a.push(l.getClass(i));
                break;
			case DescValueType.ALIASTYPE:
                a.push(l.getPath(i));
                break;
			case DescValueType.RAWTYPE:
                var tempStr = l.getData(i);
                tempArray = new Array();
                for (var tempi = 0; tempi < tempStr.length; tempi++) { 
                    tempArray[tempi] = tempStr.charCodeAt(tempi); 
                }
                a.push(tempArray);
                break;
			case DescValueType.REFERENCETYPE:
                var ref = l.getReference(i);
                var newO = new Object();
                a.push(newO);
                ReferenceToObject(newO, ref, f);
                break;
			case DescValueType.LISTTYPE:
                var list = l.getList(i);
                var newO = new Object();
                a.push(newO);
                ListToObject(newO, list, f);
                break;
			default:
				myLogging.LogIt("Unsupported type in descriptorToObject " + t);
		}
	}
	if (undefined != f) {
		o = f(o);
	}
}


///////////////////////////////////////////////////////////////////////////////
// Function: ReferenceToObject
// Usage: update a JavaScript Object from an ActionReference
// Input: JavaScript Object (o), current object to update (output)
//  Photoshop ActionReference (r), reference to pull new params for object from
//  JavaScript Function (f), post process converter utility to convert
// Return: Nothing, update is applied to passed in JavaScript Object (o)
///////////////////////////////////////////////////////////////////////////////
function ReferenceToObject(o, r, f) {
 // TODO : seems like I should output the desiredClass information here
 // maybe all references have a name, index, etc. and then the are either undefined
 // what about clobber, can I get an index in an index and then that would not work
 // should the second loop be doing something different?
    var originalRef = r;
	while (r != null) {
		var refForm = r.getForm();
        var refClass = r.getDesiredClass();
        var strk = app.typeIDToStringID(refClass);
        if (strk.length == 0) {
            strk = app.typeIDToCharID(refClass);
        }
		switch (refForm) {
			case ReferenceFormType.NAME:
				o["name"] = r.getName();
				break;
			case ReferenceFormType.INDEX:
				o["index"] = r.getIndex();
				break;
			case ReferenceFormType.IDENTIFIER:
                o["indentifier"] = r.getIdentifier();
                break;
			case ReferenceFormType.OFFSET:
                o["offset"] = r.getOffset();
                break;
			case ReferenceFormType.ENUMERATED:
                var newT = r.getEnumeratedType();
                var newV = r.getEnumeratedValue();
                o["enumerated"] = new Object();
                o["enumerated"].type = typeIDToCharID(newT);
                o["enumerated"].typeString = typeIDToStringID(newT);
                o["enumerated"].value = typeIDToCharID(newV);
                o["enumerated"].valueString = typeIDToStringID(newV);
                break;
			case ReferenceFormType.PROPERTY:
                o["property"] = app.typeIDToStringID(r.getProperty());
                if (o["property"].length == 0) {
                    o["property"] = app.typeIDToCharID(r.getProperty());
                }
                break;
			case ReferenceFormType.CLASSTYPE:
                o["class"] = refClass; // i already got that r.getDesiredClass(k);
                break;
			default:
				myLogging.LogIt("Unsupported type in referenceToObject " + t);
		}
        r = r.getContainer();
        try {
            r.getDesiredClass();
        } catch(e) {
            r = null;
        }
	}
	if (undefined != f) {
		o = f(o);
	}
}



///////////////////////////////////////////////////////////////////////////////
// Object for logging, alert, ESTK console, or log file in JavaScript
///////////////////////////////////////////////////////////////////////////////
function MyLogging(inUseAlert, inUseWriteln, inUseLogFile, inLogFileString) {
    // member properties
    this.useAlert = undefined != inUseAlert ? inUseAlert : true;
    this.useWriteln = undefined != inUseWriteln ? inUseWriteln : true;
    this.useLogFile = undefined != inUseLogFile ? inUseLogFile : true;
    this.logFileString = undefined != inLogFileString ? inLogFileString : Folder.desktop + "/MyLogging.txt";
    // member methods
    this.LogIt = function(inString) {
        if (this.useAlert)
            alert(inString);
        if (this.useWriteln)
            $.writeln(inString);
        if (this.useLogFile) {
            var f = new File(this.logFileString);
            if (f.open('a')) {
                f.writeln(inString);
                f.close();
            }
        }
    }
    this.execute = function() {
        File( this.logFileString ).execute();
    }
}



///////////////////////////////////////////////////////////////////////////////
// Object for timing things in JavaScript
///////////////////////////////////////////////////////////////////////////////
function Timer() {
	// member properties
	this.startTime = new Date();
	this.endTime = new Date();
	
	// member methods
	
	// reset the start time to now
	this.start = function () { this.startTime = new Date(); }
	
	// reset the end time to now
	this.stop = function () { this.endTime = new Date(); }
	
	// get the difference in milliseconds between start and stop
	this.getTime = function () { return (this.endTime.getTime() - this.startTime.getTime()) / 1000; }
	
	// get the current elapsed time from start to now, this sets the endTime
	this.getElapsed = function () { this.endTime = new Date(); return this.getTime(); }
}

// end Getter.jsx
