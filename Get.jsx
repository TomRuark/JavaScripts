// Version: 2016.10.19
// Git public version on 2016.10.19

// Convert the PIUGet.cpp file from the Adobe Photoshop SDK to JavaScript
// This was just an exercise to show how the C/C++ API was exposed in JavaScript.
// The better script to use is Getter.jsx which dumps all information
// from Photoshop to text files on your desktop. Converting ActionDescriptor to
// JavaScript Object

var o = {};

o.errors = [];

o.numberOfDocuments = GetInfo(stringIDToTypeID("application"), stringIDToTypeID("numberOfDocuments"));

if (o.numberOfDocuments != documents.length)
    o.errors.push("o.numberOfDocuments != documents.length " + o.numberOfDocuments + " : " + documents.length);

if (o.numberOfDocuments) {

    // no key will give you back an ActionDescriptor, check for a count
    o.docDescCount = GetInfo(stringIDToTypeID("document")).count;

    // ask the current document how many layers it has
    // note this does NOT include the background
    // AND a layer group is: group start + group end
    // the DOM is organizing this into a hierarchy that you will have to do manually
    o.targetDocLayerCount = GetInfo(stringIDToTypeID("document"), stringIDToTypeID("numberOfLayers"));

    if (o.targetDocLayerCount) {
        // ask for the name of the current layer
        o.targetLayerName = GetInfo(stringIDToTypeID("layer"), stringIDToTypeID("name"));
        
        if (o.targetLayerName != activeDocument.activeLayer.name)
            o.errors.push("o.targetLayerName != activeDocument.activeLayer.name " + o.targetLayerName + " : " + activeDocument.activeLayer.name);

    }

    // does the current document have a background layer
    o.hasBackground = GetInfo(stringIDToTypeID("document"), stringIDToTypeID("hasBackgroundLayer"));
    
    // two hidden keys that I know about
    o.compInfo = GetInfo(stringIDToTypeID("layer"), stringIDToTypeID("json"));
    
    o.layerTransformation = GetTransformInfo();
    
}

    
alert(o.toSource());

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Function: GetInfo
// Usage: Get information from Photoshop
// Input: desiredClass, classApplication, classLayer, etc.
//        desiredKey, optional specific key to get instead of everything
//                    this is recommended as all keys is an expensive call
// Return: ActionDescriptor or single value depending on what is asked for
///////////////////////////////////////////////////////////////////////////////
function GetInfo(desiredClass, desiredKey) {
    var reference = new ActionReference();
    if (typeof desiredKey != "undefined") {
        reference.putProperty(stringIDToTypeID("property"), desiredKey);
    }
    reference.putEnumerated(desiredClass, stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum")); 
    var desc = executeActionGet(reference);
    if (typeof desiredKey != "undefined") {
        return GetItemFromDescriptor(desc, desiredKey);
    }
    return desc;
}

///////////////////////////////////////////////////////////////////////////////
// Function: GetInfoByIndex
// Usage: Get information from Photoshop by using an index
// Input: index, item index the query is for
//        desiredClass, classApplication, classLayer, etc.
//        desiredKey, optional specific key to get instead of everything
//                    this is recommended as all keys is an expensive call
// Return: ActionDescriptor or single value depending on what is asked for
///////////////////////////////////////////////////////////////////////////////
function GetInfoByIndex(index, desiredClass, desiredKey) {
    var reference = new ActionReference();
    if (typeof desiredKey != "undefined") {
        reference.putProperty(stringIDToTypeID("property"), desiredKey);
    }
    reference.putIndex(desiredClass, index);
    var desc = executeActionGet(reference);
    if (typeof desiredKey != "undefined") {
        return GetItemFromDescriptor(desc, desiredKey);
    }
    return desc;
}

///////////////////////////////////////////////////////////////////////////////
// Function: GetInfoByIndexIndex
// Usage: Get information from Photoshop by using two index's
//        the third layer on the fourth document for example
// Input: indexChild, item index the query is for
//        indexParent, the index of the containing item
//        desiredClassChild, classLayer, classPath, classChannel, etc.
//        desiredClassParent, classDocument is the typical case
//        desiredKey, optional specific key to get instead of everything
//                    this is recommended as all keys is an expensive call
// Return: ActionDescriptor or single value depending on what is asked for
///////////////////////////////////////////////////////////////////////////////
function GetInfoByIndexIndex(indexChild, indexParent, desiredClassChild, desiredClassParent, desiredKey) {
    var reference = new ActionReference();
    if (typeof desiredKey != "undefined") {
        reference.putProperty(stringIDToTypeID("property"), desiredKey);
    }
    reference.putIndex(desiredClassChild, indexChild);
    reference.putIndex(desiredClassParent, indexParent);
    var desc = executeActionGet(reference);
    if (typeof desiredKey != "undefined") {
        return GetItemFromDescriptor(desc, desiredKey);
    }
    return desc;
}

///////////////////////////////////////////////////////////////////////////////
// Function: GetItemFromDescriptor
// Usage: Get a specific key from an ActionDescriptor
// Input: desc (ActionDescriptor), valid ActionDescriptor to pull info from
//        desiredKey (Number), key in question, use charIDToTypeID() or
//                             stringIDToTypeID()
// Return: ActionDescriptor or single value depending on what is asked for
///////////////////////////////////////////////////////////////////////////////
function GetItemFromDescriptor(desc, desiredKey) {
    if (desc.hasKey(desiredKey)) {
        var typeID = desc.getType(desiredKey);
        switch (typeID) {
            case DescValueType.BOOLEANTYPE:
				return desc.getBoolean(desiredKey);
				break;
			case DescValueType.STRINGTYPE:
				return desc.getString(desiredKey);
				break;
			case DescValueType.DOUBLETYPE:
				return desc.getDouble(desiredKey);
				break;
			case DescValueType.INTEGERTYPE:
                return desc.getInteger(desiredKey);
                break;
            case DescValueType.LARGEINTEGERTYPE:
            	return desc.getLargeInteger(desiredKey);
            	break;
			case DescValueType.OBJECTTYPE:
                return desc.getObjectValue(desiredKey);
                break;
			case DescValueType.UNITDOUBLE:
                var newT = desc.getUnitDoubleType(desiredKey);
                var newV = desc.getUnitDoubleValue(desiredKey);
                return new UnitValue(newV, newT);
                break;
			case DescValueType.ENUMERATEDTYPE:
                return desc.getEnumerationValue(desiredKey);
                break;
			case DescValueType.CLASSTYPE:
                return desc.getClass(desiredKey);
                break;
			case DescValueType.ALIASTYPE:
                return desc.getPath(desiredKey);
                break;
			case DescValueType.RAWTYPE:
                var tempStr = desc.getData(desiredKey);
                var rawData = new Array();
                for (var tempi = 0; tempi < tempStr.length; tempi++) { 
                    rawData[tempi] = tempStr.charCodeAt(tempi); 
                }
                return rawData;
                break;
			case DescValueType.REFERENCETYPE:
                return desc.getReference(desiredKey);
                break;
			case DescValueType.LISTTYPE:
                return desc.getList(desiredKey);
                break;
			default:
				return;
        }
    }
	return;
}

///////////////////////////////////////////////////////////////////////////////
// Function: GetErrorStringFromDescriptor
// Usage: Get the error that is in an ActionDescriptor
// Input: desc (ActionDescriptor), valid ActionDescriptor to pull info from
// Return: error string, localized or undefined for no error found
///////////////////////////////////////////////////////////////////////////////
function GetErrorStringFromDescriptor(desc) {
    if (desc.hasKey(stringIDToTypeID("message")))
        return desc.getString(stringIDToTypeID("message"));
    return;
}

///////////////////////////////////////////////////////////////////////////////
// Function: GetBackgroundInfo
// Usage: Get information about the background layer, may not exist
// Input: desiredKey, optional specific key to get instead of everything
//                    this is recommended as all keys is an expensive call
// Return: ActionDescriptor or single value depending on what is asked for
///////////////////////////////////////////////////////////////////////////////
function GetBackgroundInfo(desiredKey) {
    var reference = new ActionReference();
    reference.putProperty(stringIDToTypeID("backgroundLayer"), stringIDToTypeID("background"));
    reference.putEnumerated(stringIDToTypeID("document"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum")); 
    var desc = executeActionGet(reference);
    if (typeof desiredKey != "undefined") {
        return GetItemFromDescriptor(desc, desiredKey);
    }
    return desc;
}

///////////////////////////////////////////////////////////////////////////////
// Function: GetInfoByID
// Usage: Get information from Photoshop by using an index
// Input: ID, unique ID of item the query is for
//        desiredClass, classApplication, classLayer, etc.
//        desiredKey, optional specific key to get instead of everything
//                    this is recommended as all keys is an expensive call
// Return: ActionDescriptor or single value depending on what is asked for
///////////////////////////////////////////////////////////////////////////////
function GetInfoByID(ID, desiredClass, desiredKey) {
    var reference = new ActionReference();
    if (typeof desiredKey != "undefined") {
        reference.putProperty(stringIDToTypeID("property"), desiredKey);
    }
    reference.putIdentifier(desiredClass, ID);
    var desc = executeActionGet(reference);
    if (typeof desiredKey != "undefined") {
        return GetItemFromDescriptor(desc, desiredKey);
    }
    return desc;
}
    
///////////////////////////////////////////////////////////////////////////////
// Function: GetInfoByIDID
// Usage: Get information from Photoshop by using two index's
//        the third layer on the fourth document for example
// Input: IDChild, ID of item the query is for
//        IDParent, ID of item of the containing item
//        desiredClassChild, classLayer, classPath, classChannel, etc.
//        desiredClassParent, classDocument is the typical case
//        desiredKey, optional specific key to get instead of everything
//                    this is recommended as all keys is an expensive call
// Return: ActionDescriptor or single value depending on what is asked for
///////////////////////////////////////////////////////////////////////////////
function GetInfoByIDID(IDChild, IDParent, desiredClassChild, desiredClassParent, desiredKey) {
    var reference = new ActionReference();
    if (typeof desiredKey != "undefined") {
        reference.putProperty(stringIDToTypeID("property"), desiredKey);
    }
    reference.putIdentifier(desiredClassChild, IDChild);
    reference.putIdentifier(desiredClassParent, IDParent);
    var desc = executeActionGet(reference);
    if (typeof desiredKey != "undefined") {
        return GetItemFromDescriptor(desc, desiredKey);
    }
    return desc;
}

///////////////////////////////////////////////////////////////////////////////
// Function: GetTransformInfo
// Usage: Get information about the transform on the layer
// Input: None
// Return: ActionDescriptor of matrix on the layer if it exists
///////////////////////////////////////////////////////////////////////////////
function GetTransformInfo() {
    try {
        var reference = new ActionReference();
        reference.putProperty(stringIDToTypeID("property"), stringIDToTypeID("layerTransformation"));
        reference.putEnumerated(stringIDToTypeID("layer"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum")); 
        var desc = executeActionGet(reference);
        if (desc.count == 1) {
            // odd, we ask for key layerTransformation and get back key transform
            var transformDesc = desc.getObjectValue(desc.getKey(0));
            if (transformDesc.count == 6) {
                var obj = {};
                obj.xx = transformDesc.getDouble(transformDesc.getKey(0));
                obj.xy = transformDesc.getDouble(transformDesc.getKey(1));
                obj.yx = transformDesc.getDouble(transformDesc.getKey(2));
                obj.yy = transformDesc.getDouble(transformDesc.getKey(3));
                obj.tx = transformDesc.getDouble(transformDesc.getKey(4));
                obj.ty = transformDesc.getDouble(transformDesc.getKey(5));
                return obj.toSource();
            } else {
                return "transform is not 6 items";
            }
        } else {
            return "not 1 item in descriptor";
        }
    } catch(e) {
        ; // ok to ignore
    }
    return; // no transform found
}
// end Get.jsx
