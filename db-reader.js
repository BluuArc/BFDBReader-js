//to be used with DBReader (js version) web page

function readSkillsFile(e){
	var file = e.target.files[0];
	if (!file) {
	 	return;
	}
	//console.log("reading contents");
	updateStatus("Reading file contents of feskills database. Please wait until this message <br>changes before doing anything else on the page; the page may seem to freeze. <br>You may get messages about the page being unresponsive during this process, <br>but please wait and do not exit or kill the page.");
	var reader = new FileReader();
	reader.onload = function(e) {//event
		var contents = e.target.result;
		var output = document.getElementById('sp-content');
		output.innerHTML = contents;
		fileLoadedFunction();
	};
	reader.readAsText(file);
}

function readInfoFile(e) {
	var file = e.target.files[0];
	if (!file) {
	 	return;
	}
	//console.log("reading contents");
	updateStatus("Reading file contents of info database. Please wait until this message <br>changes before doing anything else on the page; the page may seem to freeze. <br>You may get messages about the page being unresponsive during this process, <br>but please wait and do not exit or kill the page.");
	var reader = new FileReader();
	reader.onload = function(e) {//event
		var contents = e.target.result;
		var output = document.getElementById('file-content');
		output.innerHTML = contents;
		fileLoadedFunction();
	};
	reader.readAsText(file);
}

function loadFile(url, destID){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById(destID).innerHTML = this.responseText;
		}
	};
  	xhttp.open("GET", url, true);
  	xhttp.send();		
}

function loadFiles() {
	var url = {
		info: document.getElementById("server-info-url").href,
		sp: document.getElementById("server-skill-url").href,
	};
	document.getElementById("sample-button").style = "display: none";
	document.getElementById("file-content").oninput = function(){ fileLoadedFunction() };
	document.getElementById("sp-content").oninput = function(){ fileLoadedFunction() };
	updateStatus("Reading file contents of info database. Please wait until the file contents text area below is filled before pressing 'Refresh Status.'<br>You may get messages about the page being unresponsive during this process, <br>but please wait and do not exit or kill the page.");
 	//loadInfo(url.info);
 	loadFile(url.info, "file-content");
 	if(url.sp != "" && url.sp != "None"){
	 	updateStatus("Reading file contents of info and feskills databases. Please wait until the <br>file contents text area below is filled before pressing 'Refresh Status'.<br>You may get messages about the page being unresponsive during this process, <br>but please wait and do not exit or kill the page.");
	 	//loadSkills(url.sp);
	 	loadFile(url.sp, "sp-content");
	 }
	document.getElementById("status-refresh").style = "margin-bottom: 10px; margin-top: 10px;";
}

function loadURL(){
	var server = document.getElementById("server-name").value;
	var url = {info:"", sp:""};
	switch(server){
		case "Global":
			url.info = "https://raw.githubusercontent.com/Deathmax/bravefrontier_data/master/info.json";
			url.sp = "https://raw.githubusercontent.com/Deathmax/bravefrontier_data/master/feskills.json";
			break;
		case "Japan":
			url.info = "https://raw.githubusercontent.com/Deathmax/bravefrontier_data/master/jp/info.json";
			url.sp = "https://raw.githubusercontent.com/Deathmax/bravefrontier_data/master/jp/feskills.json";
			break;
		case "Europe":
			url.info = "https://raw.githubusercontent.com/Deathmax/bravefrontier_data/master/eu/info.json";
			url.sp = "None";
			break;
		default:
			url.info = "https://bluuarc.github.io/BFDBReader-js/info-gl-small.json";
			url.sp = "https://bluuarc.github.io/BFDBReader-js/feskills-gl-small.json";
	}	

	document.getElementById("server-info-url").innerHTML = document.getElementById("server-info-url").href = url.info;
	document.getElementById("server-skill-url").innerHTML = url.sp;
	if(url.sp != "None"){
		document.getElementById("server-skill-url").href = url.sp;
	}
	document.getElementById("sample-button").disabled = false;
	document.getElementById("sample-button").style = "display: float;";
}

function fileLoadedFunction(){
	var infoLoaded = document.getElementById("file-content").innerHTML != "Info input from file will be output here.";
	var spLoaded = document.getElementById("sp-content").innerHTML != "SP input from file will be output here.";
	if(!infoLoaded && !spLoaded){
		updateStatus("Waiting for file(s) to be chosen. <br>Choose your files using the 'Automatic' or 'Manual' tabs above.");
		document.getElementById("parse-button").disabled = true;
	}else if(!infoLoaded){
		updateStatus("Please choose an info.json file.");
		document.getElementById("parse-button").disabled = true;
		document.getElementById("print-button").disabled = true;
	}else if(!spLoaded){
		updateStatus("Click the 'Parse File' button to parse the contents of the file, or choose a feskills.json file manually then click the button.");
		document.getElementById("parse-button").disabled = false;
		document.getElementById("parse-button").style = "margin-bottom: 10px; margin-top: 10px;";
		document.getElementById("print-button").disabled = true;
		document.getElementById("unit-names").options[0].innerHTML = "Please press the 'Parse File(s)' button."
	}else{
		updateStatus("Click the 'Parse File' button to parse the contents of the files.");
		document.getElementById("parse-button").disabled = false;
		document.getElementById("parse-button").style = "margin-bottom: 10px; margin-top: 10px;";
		document.getElementById("print-button").disabled = true;
		document.getElementById("unit-names").options[0].innerHTML = "Please press the 'Parse File(s)' button."
	}
}

function displayContents() {
	//var notes = document.getElementById('notes');
	//console.log("parsing contents");
	var contents = document.getElementById('file-content').innerHTML;
	updateStatus("Parsing file contents as a JSON object. Please wait.")
	var json_obj = JSON.parse(contents);
	//console.log(json_obj.constructor.toString());
	//analyzeUnits(json_obj, output, notes);
	//printUnits(json_obj, output, notes);
	updateStatus("Populating dropdown menu with unit names. Please wait.");
	populateList(json_obj);
	document.getElementById("print-button").disabled = false;
	document.getElementById("search-box").disabled = false;
	updateStatus("Ready! Pick a unit from the dropdown and press the 'Print Info' button to print the info for that unit.<br>Alternatively, you can use the search box above the dropdown. Clear all text in the box to reset the list.");
	//console.log("please allow some time for page to update for large JSON files");
}

function updateStatus(msg) {
	console.log(msg);
	document.getElementById("status").innerHTML = "Status: " + msg;
	//postscribe("#status","<p>Status: " + msg + "</p>");
}

function populateList(json_obj){
	var list = document.getElementById("unit-names");
	while(list.length > 0){
	 list.remove(0); //clear old list
	}
	for(x in json_obj){
		console.log(x);
		var option = document.createElement("option");
		option.text = json_obj[x]["guide_id"] + ": " + json_obj[x]["name"] + " (" + json_obj[x]["id"] + ")";
		list.add(option);
	}
}

function searchList(){
	var query = document.getElementById("search-box").value;
	var status = document.getElementById("search-info-text");
	if(query == ""){
		displayContents(); //reset list
		status.innerHTML = "List reset";
	}else{
		var options = document.getElementById("unit-names").options;
		var resultIndices = [];
		for(o in options){
			if(!isNaN(parseInt(o))){
				//console.log("Checking " + o);
				try{
					if(options[o].innerHTML.toLowerCase().search(query.toLowerCase()) == -1){
						options[o].innerHTML = "-";
					}else{
						resultIndices.push(parseInt(o)); //result found
					}
				}catch(err){
					console.log("Error at " + o + "\n" + err);
				}
			}
		}//end for each option

		var length = resultIndices.length;
		status.innerHTML = length + " results found."
		if(length > 0){
			for(o in options){
				if(!isNaN(parseInt(o))){
					var curIndex = parseInt(o);
					if(options[o].innerHTML.length < 3){//focus only on non-results
						if(curIndex < resultIndices[0]){
							options[o].innerHTML = "v";//results are under this index
						}else if(curIndex > resultIndices[length-1]){
							options[o].innerHTML = "^";//results are above this index
						}else{
							options[o].innerHTML = "v^";//results above and below this index
						}
					}

					//console.log("Checking " + o);
					// try{
					// 	if(options[o].innerHTML.length < 3){
					// 		options[o].innerHTML = getPositionChars(parseInt(o), resultIndices);
					// 	}
					// }catch(err){
					// 	console.log("Error at " + o + "\n" + err);
					// }
				}
			}
		}//end if length
	}
}

//unit functions
function printUnitClick(){
	try{
		updateStatus("Getting unit info. Please wait.")
		document.getElementById("unit-full-img").src = "http://i.imgur.com/LHkoVqZ.gif"; //loading GIF
		var json_obj = JSON.parse(document.getElementById("file-content").innerHTML);
		var index = document.getElementById("unit-names").selectedIndex;
		var output = document.getElementById("unit-info");
		var rawOutput = document.getElementById("unit-info-raw");
		var unitID = printUnit(json_obj,index,output,rawOutput);
		//print unit to formmated element
		//document.getElementById("unit-info-formatted").innerHTML =  document.getElementById("unit-info").innerHTML;
		loadUnitArt(unitID);
	}catch(err){
		alert("Error has occured. \n" + err);
		console.log(err);
	}

	updateStatus("Ready! Pick a unit from the dropdown and press the 'Print Info' button to print the info for that unit.<br>Alternatively, you can use the search box above the dropdown. Clear all text in the box to reset the list.");
}

function printUnit(json_obj,index,formattedOutput,rawOutput){
	var count = 0;
	var unitID;
	for(unitID in json_obj){ //"search" for unit by getting correct index number
		if(count == index) 	break;
		else				++count;
	}
	var unit = json_obj[unitID];
	console.log(unit["id"]);
	rawOutput.innerHTML = JSON.stringify(unit);
	//console.log(unit.constructor.toString());
	formattedOutput.innerHTML = "### " + unit["guide_id"] + ": " + unit["name"] + " (" + unit["id"]+")  \n";

	//print rarity, element, and cost
	formattedOutput.innerHTML += "**Rarity/Element/Cost:** " ;
	if(unit["rarity"] == 8) formattedOutput.innerHTML += "OE/";
	else					formattedOutput.innerHTML += unit["rarity"] + "\\*/";
	formattedOutput.innerHTML += unit["element"] + "/";
	formattedOutput.innerHTML += unit["cost"] + "  \n";

	formattedOutput.innerHTML += "**Gender:** " + unit["gender"] + "  \n";
	
	//print hitcount info
	formattedOutput.innerHTML += "**Hit Count:** "; 
	formattedOutput.innerHTML += printHitCounts(unit["damage frames"]["hits"], unit["damage frames"]["frame times"], unit["drop check count"]);

	formattedOutput.innerHTML += "**Move Speed Type for attack/skill:** " + unit["movement"]["attack"]["move speed type"] + "/" + 
		unit["movement"]["skill"]["move speed type"]+ "  \n";

	//formattedOutput.innerHTML += "**Attack Pattern:** `[" + unit["damage frames"]["frame times"] + "]`  \n";
	//formattedOutput.innerHTML += "**Damage Distribution:** `[" + unit["damage frames"]["hit dmg% distribution"] + "]`  \n";
	formattedOutput.innerHTML += printAtkPattern(unit["damage frames"]["frame times"],unit["damage frames"]["hit dmg% distribution"]);

	formattedOutput.innerHTML += "**Merit Type:** " + unit["getting type"] + "  \n";

	//print stat info
	formattedOutput.innerHTML += "**Lord Stats:**\n\n";
	formattedOutput.innerHTML += "    HP: " + unit["stats"]["_lord"]["hp"] + " (" + unit["imp"]["max hp"] + ")\n";
	formattedOutput.innerHTML += "    ATK: " + unit["stats"]["_lord"]["atk"] + " (" + unit["imp"]["max atk"] + ")\n";
	formattedOutput.innerHTML += "    DEF: " + unit["stats"]["_lord"]["def"] + " (" + unit["imp"]["max def"] + ")\n";
	formattedOutput.innerHTML += "    REC: " + unit["stats"]["_lord"]["rec"] + " (" + unit["imp"]["max rec"] + ")\n";

	formattedOutput.innerHTML += "\n";
	
	//print leader skill info
	try{
		var text = "**LS:** ";
		var leader_skill = unit["leader skill"];
		text += "*" + leader_skill["name"] + "* - " + leader_skill["desc"] + "\n\n";
		for(e in leader_skill["effects"]){
			text += printEffects(leader_skill["effects"][e]);
		}
		formattedOutput.innerHTML += text;
	}catch(err){
		formattedOutput.innerHTML += "**LS:** None\n";
		console.log(err);
	}

	formattedOutput.innerHTML += "  \n";

	//print ES info
	if(unit["rarity"] > 6){
		try{
			var text = "**ES:** ";
			var extra_skill = unit["extra skill"];
			text += "*" + extra_skill["name"] + "* - " + extra_skill["desc"] + "\n\n";
			text += " * *target:* " + extra_skill["target"] + "\n";
			for(e in extra_skill["effects"]){
				text += printEffects(extra_skill["effects"][e]);
			}
			formattedOutput.innerHTML += text;
		}catch(err){
			formattedOutput.innerHTML += "**ES:** None\n";
			console.log(err);
		}
		formattedOutput.innerHTML += "  \n";
	}

	//print bb info
	try{
		var text = "**BB:** ";
		var bb = unit["bb"];
		text += printBurst(bb);
		formattedOutput.innerHTML += text;
	}catch(err){
		formattedOutput.innerHTML += "**BB:** None\n";
		console.log(err);
	}

	formattedOutput.innerHTML += "  \n";

	//print sbb info
	try{
		var text = "**SBB:** ";
		var sbb = unit["sbb"];
		text += printBurst(sbb);
		formattedOutput.innerHTML += text;
	}catch(err){
		if(unit["rarity"] > 5){ 
			formattedOutput.innerHTML += "**SBB:** None\n";
			console.log(err);
		}
	}

	if(unit["rarity"] > 5){
		formattedOutput.innerHTML += "  \n";
	}

	//print ubb info
	try{
		var text = "**UBB:** ";
		var ubb = unit["ubb"];
		text += printBurst(ubb);
		formattedOutput.innerHTML += text;
	}catch(err){
		if(unit["rarity"] > 6) {
			formattedOutput.innerHTML += "**SBB:** None\n";
			console.log(err);
		}
	}

	if(unit["rarity"] > 6){
		formattedOutput.innerHTML += "  \n";
	}

	//print sp info
	if(unit["rarity"] > 7){
		try{
			var text = "**SP Enhancements:** \n\n";
			text += printSP(unit["id"]);
			formattedOutput.innerHTML += text; 
		}catch(err){
			formattedOutput.innerHTML += "**SP Enhancements:** None\n";
		}
		formattedOutput.innerHTML += "  \n";
	} 

	//print arena ai
	try{
		var text = "**Arena AI:** \n\n";
		var ai = unit["ai"];
		for(a in ai){
			text += printEffects(ai[a]);
		}
		formattedOutput.innerHTML += text;
	}catch(err){
		formattedOutput.innerHTML += "**Arena AI:** None\n";
	}
	formattedOutput.innerHTML += "  \n";


	formattedOutput.innerHTML += "---\n";
	return unit["id"];
}

//recursively print an array into a string
function printArray(arr, brackets){
	var text = "";
	if(brackets){
		text = "[";
	}
	for(i in arr){
		if(arr[i] instanceof Array) text += printArray(arr[i], brackets);
		else if(arr[i] instanceof Object) text += JSON.stringify(arr[i]); //most likely a JSON object
		else text += arr[i];

		text += ",";	
	}

	text = text.substring(0, text.length - 1);

	if(brackets){
		text += "]";
	}
	return text;
}

//print the effects into a string
function printEffects(effects){
	var text = " * ";
	var effectArr = [];
	for(param in effects){ //get proper text data
		if(param != "passive id"){//skip passive id
			var tempText = effects[param];
			if(effects[param] instanceof Array) tempText = printArray(effects[param], true); //parse array
			else if(effects[param] instanceof Object) tempText = JSON.stringify(effects[param]); //parse JSON object
			effectArr.push("*" + param + ":* " + tempText);
		}
	}

	var i = 0;
	for(i = 0; i < effectArr.length; ++i){//save parsed data
		text += effectArr[i];
		if(i + 1 != effectArr.length) text += " / ";
	}
	text += "\n";
	return text;
}

//print the attack pattern info as a table in a string
function printAtkPattern(timeArr,distrArr){
	//print hit number
	var text = "\n| Hit | ";
	var len = timeArr.length;
	var i = 0;
	for(i = 1; i <= len; ++i){
		text += i + " | ";
	}
	text +="\n| :---: | ";

	for(t in timeArr){
		text += ":---: | ";
	}

	//print frame times
	text += "\n| Frame Time | ";
	for(t in timeArr){
		text += timeArr[t] + " | ";
	}

	//print damage distribution
	text += "\n| Damage% Distribution | ";
	for(d in distrArr){
		text += distrArr[d] + " | ";
	}
	text += "  \n";
	return text;
}

//print all info related to a brave burst
function printBurst(burst){
	var endBBLevel = burst["levels"][burst["levels"].length - 1];
	var text = "*" + burst["name"] + "* - (BC Cost: " + endBBLevel["bc cost"] + ") " + burst["desc"] + "\n\n";
	text += " * " + printHitCounts(burst["damage frames"][0]["hits"], burst["damage frames"][0]["frame times"],
		burst["drop check count"]);
	for(e in endBBLevel["effects"]){
		text += printEffects(endBBLevel["effects"][e]);
	}
	text += printAtkPattern(burst["damage frames"][0]["frame times"],burst["damage frames"][0]["hit dmg% distribution"]);
	return text;
}

//print info about hit counts
function printHitCounts(numHits, frameArr, dropChecks){
	var text = numHits + ((numHits == 1) ? " hit (" : " hits (") + dropChecks + 
		" BC/hit, max " + (dropChecks * numHits) + " BC generated)  \n";// in " + 
		//frameArr[frameArr.length - 1] + " frames  \n";
	return text;
}

//print sp enhancements
function printSP(id){
	if(document.getElementById("sp-content").innerHTML != "SP input from file will be output here."){
		var text = "";
		var json_obj = JSON.parse(document.getElementById("sp-content").innerHTML);
		var unitSkills = json_obj[id]["skills"];
		for(s in unitSkills){
			var curSkill = unitSkills[s]["skill"];
			text += " * " + curSkill["desc"] + " (" + curSkill["id"] + ")\n";
			//text += "  * **Type:** " + getSPCategory(unitSkills[s]["category"]) + "\n";
			text += "  * **Cost:** " + curSkill["bp"] + "\n";
			text += "  * **Dependency:** " + ((unitSkills[s]["dependency"] == "") ? "None\n" : (unitSkills[s]["dependency"] + "\n"));
			for(e in curSkill["effects"])
				if(curSkill["effects"][e] instanceof Array){
					text += "  * " + printArray(curSkill["effects"][e], false) + "\n";
				}else if(curSkill["effects"][e] instanceof Object){
					for(elem in curSkill["effects"][e]){
						text += "  * *" + elem + "*: " + printEffects(curSkill["effects"][e][elem]).slice(3);
					}
				}else{
					text += "  * " + curSkill["effects"][e] + "\n";
				}
				
		}
		
		return text;
	}else{
		return " * Error: SP skills file not loaded.\n";
	}
}

function getSPCategory(num){
	switch(num){
		case "1":	return "Parameter Boost";
		case "2":	return "Spark";
		case "3":	return "Critical Hits";
		case "4":	return "Attack Boost";
		case "5":	return "BB Gauge";
		case "6":	return "HP Recovery";
		case "7":	return "Drops";
		case "8":	return "Ailment Resistance";
		case "9":	return "Ailment Infliction";
		case "10":	return "Damage Reduction";
		case "11":	return "Special";
		default:	return "Undefined";
	}
}

function loadUnitArt(unitID){
	var urls = [
		"http://dlc.bfglobal.gumi.sg/content/unit/img/",
		"http://cdn.android.brave.a-lim.jp/unit/img/",
		"http://static-bravefrontier.gumi-europe.net/content/unit/img/"
	];

	var currURL = "";
	for(u in urls){
		if(u < 2 || unitID > 700000){
			currURL = urls[u] + "unit_ills_full_" + unitID + ".png";
		}
		if(checkImage(currURL) == true){
			break;
		}
	}

	document.getElementById("unit-full-img").src = currURL;
}

//source: http://stackoverflow.com/questions/5678899/change-image-source-if-file-exists
function checkImage(src) {
	var img = new Image();
	img.onload = function() {
		return true;
	};
	img.onerror = function() {
		return false;
 	};

 	img.src = src; // fires off loading of image
}
