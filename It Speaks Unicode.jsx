﻿var fontOK = false;
var tryTheseFonts = [ "Code2000", "ArialUnicodeMS", "Times" ];
var fontIndex = 0; 

main();

function main()
{
	var textArray = new Array();
	textArray.push(" 1 Arabic عندما يريدالعالم أن يتكلّم, فهو يتحدّث بلغة يونيكود.");
	textArray.push(" 2 Armenian Երբ աջխհարը կուզէ խոսիլ կը գործածէ յունիգոտ լէզուն");
	textArray.push(" 3 Basque Munduak hitz egin nahi duenean, Unicodez hitz egiten du");
	textArray.push(" 4 Bulgarian Когато светът иска да общува, той говори на Unicode");
	textArray.push(" 5 Catalan Quan el món vol conversar, parla Unicode");
	textArray.push(" 6 Chinese (Simplified) 当世界需要沟通时，请用 Unicode");
	textArray.push(" 7 Chinese (Traditional) 當世界需要溝通時，請用統一碼 Unicode");
	textArray.push(" 8 Croatian Kad svijet želi razgovarati, govori Unicode");
	textArray.push(" 9 Czech Když chce svět mluvit, mluví Unicode");
	textArray.push("10 Danish Når verden vil tale, taler den Unicode");
	textArray.push("11 Dutch Als de wereld wil praten, spreekt hij Unicode ");
	textArray.push("12 English When the world wants to talk, it speaks Unicode");
	textArray.push("13 Esperanto Kiam la mondo volas paroli, ĝi parolas Unicode");
	textArray.push("14 Estonian Kui maailm tahab rääkida, siis ta kõneleb Unicode is");
	textArray.push("15 Farsi وقتى که دنيا صحبت ميکند، با زبان Unicode حرف ميزند<");
	textArray.push("16 Finnish Kun maailma haluaa puhua, se puhuu Unicodea");
	textArray.push("17 French Quand le monde veut communiquer, il parle en Unicode");
	textArray.push("18 Georgian როდესაც მსოფლიოს ურთირთობა სურს, იგი Unicode-ის ენაზე ლაპარაკობს");
	textArray.push("19 German Wenn die Welt miteinander spricht, spricht sie Unicode");
	textArray.push("20 Greek Όταν ο κόσμος θέλει να μιλήσει, μιλάει Unicode ");
	textArray.push("21 Hebrew 	כאשר העולםרוצה לדבר, הוא מדבר ב־Unicode");
	textArray.push("22 Hindi जब दुनिया बोलती है तो Unicode में बोलती है");
	textArray.push("23 Hungarian Ha a világ beszélni akar, azt Unicode-ul mondja");
	textArray.push("24 Icelandic Thegar heimurinn vill tala talar hann Unicode ");
	textArray.push("25 Inuktitut ᓯᓚᕐᔪᐊᕐᒥᐅᑦ ᑐᓴᖅᑕᐅᔪᒪᔭᕌᖓᒥᒃ ᑎᑎᕈᓯᑐᐊᑎᒍᑦ ᐅᖃᖅᐸᒃᐳᑦ");
	textArray.push("26 Irish Gaelic Nuair a bhualann fonn cainte an domhan, is as Unicode a labhrann sé");
	textArray.push("27 Italian Quando il mondo vuole comunicare, parla Unicode");
	textArray.push("28 Japanese 世界的に話すなら、Unicode です。");
	textArray.push("29 Marathi जगाचे संभाषण Unicode मध्ये होते");
	textArray.push("30 Korean 세계를 향한 대화, 유니코드로 하십시오");
	textArray.push("31 Norwegian (Bokmål) Når verden vil snakke, snakker den Unicode");
	textArray.push("32 Norwegian (Nynorsk) Når verda ønskjer å snakke, talar ho Unicode");
	textArray.push("33 Occitan Quan lo mond vòl conversar, parla en Unicode");
	textArray.push("34 Polish Kiedy świat chce mówić, mówi w Unicode ");
 	textArray.push("35 Portuguese (Brazil) Quando o mundo quer falar, fala Unicode");
	textArray.push("36 Portuguese (Portugal) Quando o mundo quer falar, fala Unicode");
	textArray.push("37 Romanian Când lumea vrea să comunice, vorbeşte Unicode");
	textArray.push("38 Russian Когда мир желает общаться, он общается на Unicode");
	textArray.push("39 Serbian Кад свет жели да разговара, говори Unicode ");
	textArray.push("40 Slovenian Ko se želi svet pogovarjati, govori Unicode");
	textArray.push("41 Spanish Cuando el mundo quiere conversar, habla Unicode");
	textArray.push("42 Swedish När världen vill tala, så talar den Unicode");
	textArray.push("43 Tamil உலகம் பேச நினைக்கும் போது Unicode பேசுகிறது");
	textArray.push("44 Thai ‘ยูนิโค้ด’ ภาษาเพื่อการสื่อสารของคนทั่วโลก");
	textArray.push("45 Turkish Dünya birbiriyle konuşmak isterse bunu Unicode vasıtası ile yapar ");
	textArray.push("46 Urdu جب دنيا بات كرتى ہے تو يه يونيكوڈ بولتى ہے");
	textArray.push("47 Vietnamese Khi thế giới muốn đàm thoại với nhau, họ sẽ dùng Unicode");
	textArray.push("48 Yiddish אַז די װעלט װיל רעדן, רעדט זי אוניקאָד");				
	
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
		newTextLayer.textItem.font = tryTheseFonts[fontIndex];
		if ( ! fontOK ) 
		{
			var error = FindAFont(newTextLayer.textItem);
			if (error) 
			{
				throw(new Error("No Font"));
			}
			fontOK = true;
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
			var lookFor = textArray[textArray.length - i - 1];
			var msg = text + " != " + lookFor + " ";
			if (text.length != lookFor.length)
			{
				msg += "lenghts are off " + text.length + " != " + lookFor.length + " ";
			}
			for (var ii = 0; ii < Math.min(text.length, lookFor.length); ii++)
			{
				if (text[ii].charCodeAt() != lookFor[ii].charCodeAt()) 
				{
					msg += "no match at " + ii + " ";
					msg += text[ii].charCodeAt() + " != " + lookFor[ii].charCodeAt() + " ";
					msg += text[ii] + " != " + lookFor[ii];
					break;
				}
			}
			alert(msg);
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

function FindAFont(inTextItem)
{
	do 
	{
		if (inTextItem.font == tryTheseFonts[fontIndex])
		{
			return 0;
		}
		fontIndex++;
		if (fontIndex >= tryTheseFonts.length)
		{
			alert('No Fonts Work! ' + tryTheseFonts.toString());
			return -1;
		}
		inTextItem.font = tryTheseFonts[fontIndex];
	}
	while(true);
	return -1;
}
