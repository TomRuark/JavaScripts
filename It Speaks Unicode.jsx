﻿$.level = 0;
var fontAlert = false;

main();

function main()
{
	var textArray = new Array();
	textArray.push("1 Arabic عندما يريدالعالم أن يتكلّم, فهو يتحدّث بلغة يونيكود.");
	textArray.push("2 Catalan Quan el món vol conversar, parla Unicode");
	textArray.push("3 Chinese (Simplified) 当世界需要沟通时，请用Unicode！");
	textArray.push("4 Chinese (Traditional) 當世界需要溝通時，請用統一碼（Unicode）");
	textArray.push("5 Danish Når verden vil tale, taler den Unicode");
	textArray.push("6 Dutch Als de wereld wil praten, spreekt hij Unicode ");
	textArray.push("7 English When the world wants to talk, it speaks Unicode");
	textArray.push("8 Esperanto Kiam la mondo volas paroli, ĝi parolas Unicode");
	textArray.push("9 Finnish Kun maailma haluaa puhua, se puhuu Unicodea");
	textArray.push("10 French Quand le monde veut communiquer, il parle en Unicode");
	textArray.push("11 Georgian როდესაც მსოფლიოს ურთირთობა სურს, იგი Unicode-ის ენაზე ლაპარაკობს");
	textArray.push("12 German Wenn die Welt miteinander spricht, spricht sie Unicode");
	textArray.push("13 Hebrew 	כאשר העולםרוצה לדבר, הוא מדבר ב־Unicode");
	textArray.push("14 Hungarian Ha a világ beszélni akar, azt Unicode-ul mondja");
	textArray.push("15 Irish Gaelic Nuair a bhualann fonn cainte an domhan, is as Unicode a labhrann sé");
	textArray.push("16 Italian Quando il mondo vuole comunicare, parla Unicode");
	textArray.push("17 Japanese 世界的に話すなら、Unicode です。");
	textArray.push("18 Korean 세계를 향한 대화, 유니코드로 하십시오");
	textArray.push("19 Norwegian (Bokmål) Når verden vil snakke, snakker den Unicode");
	textArray.push("20 Norwegian (Nynorsk) Når verda ønskjer å snakke, talar ho Unicode");
	textArray.push("21 Occitan Quan lo mond vòl conversar, parla en Unicode");
	textArray.push("22 Portuguese (Brazil) Quando o mundo quer falar, fala Unicode");
	textArray.push("23 Portuguese (Portugal) Quando o mundo quer falar, fala Unicode");
	textArray.push("24 Romanian Când lumea vrea să comunice, vorbeşte Unicode");
	textArray.push("25 Russian Когда мир желает общаться, он общается на Unicode");
	textArray.push("26 Slovenian Ko se želi svet pogovarjati, govori Unicode");
	textArray.push("27 Spanish Cuando el mundo quiere conversar, habla Unicode");
	textArray.push("28 Swedish När världen vill tala, så talar den Unicode");
	textArray.push("29 Yiddish אַז די װעלט װיל רעדן, רעדט זי אוניקאָד");				
	
	var w = new UnitValue(20, "in");
	var h = new UnitValue(1, "in");
	app.documents.add(w, h, 72, textArray[0]);

	var textColor = new SolidColor;
	textColor.rgb.red = 255;
	textColor.rgb.green = 0;
	textColor.rgb.blue = 0;
	
	for (var i = 0; i < textArray.length; i++)
	{
		var newTextLayer = activeDocument.artLayers.add();
		newTextLayer.name = textArray[i];
		newTextLayer.kind = LayerKind.TEXT;
		newTextLayer.textItem.contents = textArray[i];
		newTextLayer.textItem.position = Array(UnitValue(1, "in"), UnitValue(.5, "in"));
		newTextLayer.textItem.size = 36;
		newTextLayer.textItem.color = textColor;
		newTextLayer.textItem.font = "Code2000"; // "ArialUnicodeMS"; // "Code2000";  // "Times"; // 
        if (newTextLayer.textItem.font != "Code2000" && !fontAlert) {
        	alert("Font does not exist! Code2000");
			fontAlert = true;
        }
		newTextLayer.visible = false;
		AdjustColor(textColor);
	}
	
	for (var i = 0; i < textArray.length; i++)
	{
		activeDocument.activeLayer = activeDocument.artLayers[i];
		activeDocument.activeLayer.visible = true;
        app.refresh();
		var text = activeDocument.activeLayer.textItem.contents;
		if (text != textArray[textArray.length - i - 1])
		{
			alert(text + " != " + textArray[textArray.length - i - 1]);
		}
		activeDocument.activeLayer.visible = false;
	}

	activeDocument.activeLayer.visible = true;
}

function AdjustColor(textColor)
{
	var r = textColor.rgb.red;
	var g = textColor.rgb.green;
	var b = textColor.rgb.blue;
	
	r = r + 100;
	if (r > 255)
	{
		r = 0;
		g = g + 100;
		if (g > 255)
		{
			g = 0;
			b = b + 100;
			if (b > 255)
			{
				b = 0;
			}
		}
	}
	textColor.rgb.red = r;
	textColor.rgb.green = g;
	textColor.rgb.blue = b;
}

