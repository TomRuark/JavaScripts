// Version 2016.11.18

// Show how to get and set the ruler origin point for the current document
// Values are in pixels shifted 16 bits

// some constants to make it more readable
const classProperty                = app.stringIDToTypeID("property");
const krulerOriginHStr             = app.stringIDToTypeID("rulerOriginH");
const krulerOriginVStr             = app.stringIDToTypeID("rulerOriginV");
const classDocument                = app.stringIDToTypeID("document");
const typeOrdinal                  = app.stringIDToTypeID("ordinal");
const enumTarget                   = app.stringIDToTypeID("targetEnum");
const typeNULL                     = app.stringIDToTypeID("null");
const keyTo                        = app.stringIDToTypeID("to");
const eventSet                     = app.stringIDToTypeID("set");



// get the current values
GetRulerOrigin().toSource();

// set them to zero, negative numbers work as well
SetRulerOrigin(0, 0);



//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


function GetRulerOrigin() {
    var ro = {};

    ro.horizontal = GetInfo(classDocument, krulerOriginHStr) >> 16;
    ro.vertical = GetInfo(classDocument, krulerOriginVStr) >> 16;
    
    return ro;
}

function SetRulerOrigin(horiz, vert) {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(classProperty, krulerOriginHStr);
    ref.putEnumerated(classDocument, typeOrdinal, enumTarget);
    desc.putReference(typeNULL, ref);
    desc.putInteger(keyTo, horiz << 16);
    executeAction(eventSet, desc, DialogModes.NO);

    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(classProperty, krulerOriginVStr);
    ref.putEnumerated(classDocument, typeOrdinal, enumTarget);
    desc.putReference(typeNULL, ref);
    desc.putInteger(keyTo, vert << 16);
    executeAction(eventSet, desc, DialogModes.NO);
}



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
