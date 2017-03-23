//to be used with DBReader (js version) web page

//read uploaded skills file to a text box
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
		document.getElementById('sp-content').innerHTML = contents;
		var output = document.getElementById('sp-content-status');
		output.innerHTML = "";
		var json_obj = JSON.parse(contents);
		for(o in json_obj){
			output.innerHTML += o + "\n";
		}
		updateFileLoadStatus();
	};
	reader.readAsText(file);
}

//read uploaded info file to text box
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
		document.getElementById('file-content').innerHTML = contents;
		var output = document.getElementById('file-content-status');
		output.innerHTML = "";
		var json_obj = JSON.parse(contents);
		for(o in json_obj){
			var curUnit = json_obj[o];
			output.innerHTML += o + "," + curUnit["guide_id"] + "," + curUnit["name"] + "\n";
		}
		updateFileLoadStatus();
	};
	reader.readAsText(file);
}

//load remote file to element with id=destID
function loadFile(url, destID, statusElement, callbackFn){
	var xhttp = new XMLHttpRequest();
	var isUnit = true;
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {//load file
			document.getElementById(destID).innerHTML = this.responseText;
			try{
				var output = document.getElementById(statusElement);
				output.innerHTML = "";
				var json_obj = JSON.parse(this.responseText);
				for(o in json_obj){ // output JSON object names to statusElement object
					if(isUnit){ //print names if valid
						try{
							var curUnit = json_obj[o];
							var msg = o + "," + curUnit["guide_id"] + "," + curUnit["name"] + "\n"; //print <id>,<guide_id>,<name>
							output.innerHTML += msg;
						}catch(err){
							output.innerHTML += o + "\n";
							isUnit = false;
						}
					}else{
						output.innerHTML += o + "\n";
					}
				}
				// updateFileLoadStatus();
			}catch(err){
				console.log(err);
			}
			callbackFn();

		}
	};
  	xhttp.open("GET", url, true);
  	xhttp.send();		
}

//function for loading files in auto tab
function loadFilesFromURLs() {
	var url = {
		info: document.getElementById("server-info-url").href,
		sp: document.getElementById("server-skill-url").href,
	};
	document.getElementById("url-file-load-button").style = "display: none";

	//load SP and info files
 	if(url.sp != "" && url.sp != "None"){
	 	updateStatus("Reading file contents of info and feskills databases. Please wait until the <br>file contents text area below is filled before continuing.<br>You may get messages about the page being unresponsive during this process, <br>but please wait and do not exit or kill the page.");
	 	//loadSkills(url.sp);
 		loadFile(url.info, "file-content", "file-content-status", function() {
			 loadFile(url.sp, "sp-content", "sp-content-status", function () {
			 	updateFileLoadStatus();
			 });
		});
	 }else{ //load info file only
		updateStatus("Reading file contents of info database. Please wait until the file contents text area below is filled before continuing.<br>You may get messages about the page being unresponsive during this process, <br>but please wait and do not exit or kill the page.");
		loadFile(url.info, "file-content", "file-content-status", function () {
			updateFileLoadStatus();
		});
	 }
	 
}

//function to get different URLs based on dropdown value
function loadURLNames(){
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
	document.getElementById("url-file-load-button").disabled = false;
	document.getElementById("url-file-load-button").style = "display: inline;";
}

//save number of unitIDs to localStorage
function saveIDLength(){
	//get data to save
	var serverName = document.getElementById("server-name").value.toLowerCase();
	var unitNames = document.getElementById("unit-names").options;
	var status = document.getElementById("search-info-text");
	var oldDataVarName = "old-load-" + serverName;
	var newDataVarName = "new-load-" + serverName;
	var lastUpdateVarName = "last-update-" + serverName;

	//only try to access data if localStorage is supported
	if(typeof(Storage) !== "undefined"){
		var curDate = new Date();
		var oldData = localStorage.getItem(newDataVarName); //access last saved data
		if(oldData == null){//create new data if not initialized yet
			localStorage.setItem(newDataVarName, unitNames.length);
			localStorage.setItem(oldDataVarName, 0);
			localStorage.setItem(lastUpdateVarName, curDate);
		}else{
			//compare old and new data
			if(oldData != unitNames.length){//save cookie if data has changed
				//save old data
				localStorage.setItem(oldDataVarName, oldData);

				//set new data
				localStorage.setItem(newDataVarName, unitNames.length);
				localStorage.setItem(lastUpdateVarName, curDate);
			}
		}
		//print difference
		var diff = unitNames.length - oldData;
		var lastUpdateDate = localStorage.getItem(lastUpdateVarName);
		status.innerHTML = "<br>" + diff + " new units since last update on " + lastUpdateDate + ". (Total: " + localStorage.getItem(newDataVarName) + ")";
	}
}


//function to update status message based on data in text boxes
function updateFileLoadStatus(){
	var infoLoaded = document.getElementById("file-content").innerHTML != "Info input from file will be output here.";
	var spLoaded = document.getElementById("sp-content").innerHTML != "SP input from file will be output here.";
	if(!infoLoaded && !spLoaded){
		updateStatus("Waiting for file(s) to be chosen. <br>Choose your files using the 'Automatic' or 'Manual' tabs in the File Loader area.");
		document.getElementById("parse-button").disabled = true;
	}else if(!infoLoaded){
		updateStatus("Please choose an info.json file.");
		document.getElementById("parse-button").disabled = true;
		document.getElementById("print-button").disabled = true;
	}else if(!spLoaded){
		updateStatus("Click the 'Parse File(s)' button to parse the contents of the file, or choose a feskills.json file manually then click the button.");
		document.getElementById("parse-button").disabled = false;
		document.getElementById("parse-button").style = "margin-bottom: 10px; margin-top: 10px;";
		document.getElementById("print-button").disabled = true;
		document.getElementById("unit-names").options[0].innerHTML = "Please press the 'Parse File(s)' button.";
	}else{
		updateStatus("Click the 'Parse File(s)' button to parse the contents of the files.");
		document.getElementById("parse-button").disabled = false;
		document.getElementById("parse-button").style = "margin-bottom: 10px; margin-top: 10px;";
		document.getElementById("print-button").disabled = true;
		document.getElementById("unit-names").options[0].innerHTML = "Please press the 'Parse File(s)' button.";
	}
}

//function to display the names of the info db to the dropdown and update status
function parseJSON() {
	var server = document.getElementById('url-box').value;
	console.log(server);
	if(server.length == 0){
		var contents = document.getElementById('file-content').innerHTML;
		updateStatus("Parsing file contents as a JSON object. Please wait.")
		var json_obj = JSON.parse(contents);
		
		updateStatus("Populating dropdown menu with unit names. Please wait.");
		populateList(json_obj);
		document.getElementById("print-button").disabled = false;
		document.getElementById("search-box").disabled = false;
		updateStatus("Ready! Pick a unit from the dropdown and press the 'Print Info' button to print the info for that unit.<br>Alternatively, you can use the search box next to the dropdown. Clear all text in the box to reset the list.");
	}else{
		try{
			var option = (document.getElementById("unit_id").checked) ? "unit_id" : "guide_id";
			loadFile(server + "/list/units?type=" + option + "&list_type=range",'temp','file-content-status',
			function(){
				document.getElementById('file-content').innerHTML = document.getElementById('file-content-status').innerHTML;
				document.getElementById('sp-content').innerHTML = document.getElementById('file-content').innerHTML;
				document.getElementById('sp-content-status').innerHTML = document.getElementById('file-content-status').innerHTML;
				// updateFileLoadStatus();
				var arr = JSON.parse(document.getElementById('temp').innerHTML);
				populateListFromArray(arr);
				document.getElementById("print-button").disabled = false;
				document.getElementById("search-box").disabled = false;
				updateStatus("Ready! Pick a unit from the dropdown and press the 'Print Info' button to print the info for that unit.<br>Alternatively, you can use the search box next to the dropdown. Clear all text in the box to reset the list.");
			});
		}catch(err){
			console.log(err);
			alert("Error: Invalid server entered. Please clear the Server Input box or input another URL.")
		}
	}
}

//function to update status
function updateStatus(msg) {
	console.log(msg.replace("<br>","\n"));
	document.getElementById("status").innerHTML = "Status: " + msg;
}

function populateListFromArray(arr){
	var list = document.getElementById("unit-names");
	while (list.length > 0) {
		list.remove(0); //clear old list
	}
	for(x in arr){
		var option = document.createElement("option");
		option.text = arr[x];
		list.add(option);
	}
}
//main function to parse unit names into dropdown
function populateList(json_obj){
	var list = document.getElementById("unit-names");
	while(list.length > 0){
	 list.remove(0); //clear old list
	}
	for(x in json_obj){
		// console.log(x);
		var option = document.createElement("option");
		option.text = json_obj[x]["guide_id"] + ": " + json_obj[x]["name"] + " (" + json_obj[x]["id"] + ")";
		list.add(option);
	}
}

//search function
function searchList(){
	var query = document.getElementById("search-box").value;
	var status = document.getElementById("search-info-text");
	var list = document.getElementById("unit-names");
	if(query == ""){
		parseJSON(); //reset list
		status.innerHTML = "List reset";
		return;
	}else{
		var options = list.options;
		var results = [];
		for(o in options){
			if(!isNaN(parseInt(o))){
				//console.log("Checking " + o);
				try{
					if(options[o].innerHTML.toLowerCase().search(query.toLowerCase()) == -1){
						options[o].innerHTML = "-";
					}else{
						results.push(options[o].innerHTML); //result found
					}
				}catch(err){
					console.log("Error at " + o + "\n" + err);
				}
			}
		}//end for each option

		//clear old list
		while(list.length > 0){
			list.remove(0);
		}

		//add results to dropdown
		var length = results.length;
		status.innerHTML = length + ((length == 1) ? (" result found.") : (" results found."));
		if(length > 0){
			for(r in results){
				var option = document.createElement("option");
				option.text = results[r];
				list.add(option);
			}
		}//end if length
	}//end if-else query check
}

/* unit functions */
//format of optionString: <guide_id>: <name> (<unit_id>)
function getUnitID(optionString){
	return optionString.split('(')[1].split(')')[0];
}

//function to print unit info once button is clicked
function printUnitClick(){
	try{
		var dropdownValue = document.getElementById("unit-names").value;
		if(dropdownValue.length == 0){ //only print if vlaue isn't 0
			return;
		}
		updateStatus("Getting unit info. Please wait.");
		var id = getUnitID(dropdownValue);
		var server = document.getElementById('url-box').value;
		if (server.length == 0) {
			var output = document.getElementById("unit-info");
			var rawOutput = document.getElementById("unit-info-raw");
			var json_obj = JSON.parse(document.getElementById("file-content").innerHTML);
			var unitID = printUnit(json_obj,id,output,rawOutput);
			document.getElementById("unit-full-img").alt = unitID;
			document.getElementById("unit-full-img").src = "http://i.imgur.com/LHkoVqZ.gif"; //loading GIF
			loadUnitArt();
		}else{
			loadFile(server + "/unit/" + id,'temp',null,function(){
				var id = getUnitID(dropdownValue);
				var output = document.getElementById("unit-info");
				var rawOutput = document.getElementById("unit-info-raw");
				var json_obj = {};
				json_obj[id] = JSON.parse(document.getElementById('temp').innerHTML);
				var unitID = printUnit(json_obj, id, output, rawOutput);
				document.getElementById("unit-full-img").alt = unitID;
				document.getElementById("unit-full-img").src = "http://i.imgur.com/LHkoVqZ.gif"; //loading GIF
				loadUnitArt();		

				document.getElementById("formatted-md").innerHTML = marked(document.getElementById("unit-info").innerHTML);
				document.getElementById("formatted-md").innerHTML += marked("Data parsed using [BFDBReader-js](https://bluuarc.github.io/BFDBReader-js/).\n");
				document.getElementById("unit-info-html").innerHTML = document.getElementById("formatted-md").innerHTML;
			});
		}
	}catch(err){ //shouldn't happen
		alert("Error has occured. \n" + err);
		console.log(err);
	}

	updateStatus("Ready! Pick a unit from the dropdown and press the 'Print Info' button to print the info for that unit.<br>Alternatively, you can use the search box next to the dropdown. Clear all text in the box to reset the list.");
}

//unit object
//input: json_obj and index of unit in json_obj
function unit_obj(json_obj, id){
	this.data = json_obj[id];
	this.getName = function(){
		return "### " + this.data["guide_id"] + ": " + this.data["name"] + " (" + this.data["id"]+")  \n";
	}

	this.getRareElemCostGender = function(){
		var msg = "";
		msg += "**Rarity/Element/Cost:** " ;
		if(this.data["rarity"] == 8) msg += "OE/";
		else					msg += this.data["rarity"] + "\\*/";
		msg += this.data["element"] + "/";
		msg += this.data["cost"] + "  \n";

		msg += "**Gender:** " + this.data["gender"] + "  \n";
		return msg;
	}

	this.getNormalHitCountInfo = function(){
		var msg = "";
		msg += "**Hit Count:** "; 
		msg += printHitCounts(this.data["damage frames"]["hits"], this.data["damage frames"]["frame times"], this.data["drop check count"]);
		return msg;
	}

	this.getMoveSpeedInfo = function(){
		var msg = "**Move Speed Type for attack/skill:** " + this.data["movement"]["attack"]["move speed type"] + "/" + 
			this.data["movement"]["skill"]["move speed type"] + "  \n";
		return msg;
	}

	this.getNormalHitCountTable = function(){
		return printAtkPattern(this.data["damage frames"]["frame times"],this.data["damage frames"]["hit dmg% distribution"]);
	}

	this.getMeritType = function(){
		var msg = "";
		msg += "**Merit Type:** " + this.data["getting type"] + "  \n";
		return msg;
	}

	this.getLordStats = function(){
		var msg = "";
		msg += "**Lord Stats:**\n\n";
		msg += "    HP: " + this.data["stats"]["_lord"]["hp"] + " (" + this.data["imp"]["max hp"] + ")\n";
		msg += "    ATK: " + this.data["stats"]["_lord"]["atk"] + " (" + this.data["imp"]["max atk"] + ")\n";
		msg += "    DEF: " + this.data["stats"]["_lord"]["def"] + " (" + this.data["imp"]["max def"] + ")\n";
		msg += "    REC: " + this.data["stats"]["_lord"]["rec"] + " (" + this.data["imp"]["max rec"] + ")\n";
		msg += "\n";
		return msg;
	}

	this.getLeaderSkill = function(){
		var msg = "";
		try{
			var text = "**LS:** ";
			var leader_skill = this.data["leader skill"];
			text += "*" + leader_skill["name"] + "* - " + leader_skill["desc"] + "\n\n";
			for(e in leader_skill["effects"]){
				text += printEffects(leader_skill["effects"][e]);
			}
			msg += text;
		}catch(err){
			msg += "**LS:** None\n";
			console.log(err);
		}
		msg += "  \n";
		return msg;
	}

	this.getExtraSkill = function(){
		var msg = "";
		if(this.data["rarity"] > 6){
			try{
				var text = "**ES:** ";
				var extra_skill = this.data["extra skill"];
				text += "*" + extra_skill["name"] + "* - " + extra_skill["desc"] + "\n\n";
				text += " * *target:* " + extra_skill["target"] + "\n";
				for(e in extra_skill["effects"]){
					text += printEffects(extra_skill["effects"][e]);
				}
				msg += text;
			}catch(err){
				msg += "**ES:** None\n";
				console.log(err);
			}
			msg += "  \n";
		}
		return msg;
	}

	this.getBBInfo = function(){
		var msg = "";
		try{
			var text = "**BB:** ";
			var bb = this.data["bb"];
			text += printBurst(bb);
			msg += text;
		}catch(err){
			msg += "**BB:** None\n";
			console.log(err);
		}

		msg += "  \n";
		return msg;
	}

	this.getSBBInfo = function(){
		var msg = "";
		try{
			var text = "**SBB:** ";
			var sbb = this.data["sbb"];
			text += printBurst(sbb);
			msg += text;
		}catch(err){
			if(this.data["rarity"] > 5){ //print none if rarity > 5 since it's supposed to exist for 6+* units, but may exist for prev units
				msg += "**SBB:** None\n";
				console.log(err);
			}
		}

		if(this.data["rarity"] > 5){
			msg += "  \n";
		}
		return msg;
	}

	this.getUBBInfo = function(){
		var msg = "";
		try{
			var text = "**UBB:** ";
			var ubb = this.data["ubb"];
			text += printBurst(ubb);
			msg += text;
		}catch(err){
			if(this.data["rarity"] > 6) { //print none if rarity > 6 since it's supposed to exist for 7+* units 
				msg += "**SBB:** None\n";
				console.log(err);
			}
		}

		if(this.data["rarity"] > 6){
			msg += "  \n";
		}
		return msg;
	}

	this.getSPInfo = function(){
		var msg = "";
		if(this.data["rarity"] > 7){
			try{
				var text = "**SP Enhancements:** \n\n";
				text += printSP(this.data["id"]);
				msg += text; 
			}catch(err){
				msg += "**SP Enhancements:** None\n";
			}
			msg += "  \n";
		} 
		return msg;
	}

	this.getArenaInfo = function(){
		var msg = "";
		try{
			var text = "**Arena AI:** \n\n";
			var ai = this.data["ai"];
			console.log(ai);
			for(a in ai){
				text += printEffects(ai[a]);
			}
			msg += text;
		}catch(err){
			msg += "**Arena AI:** None\n";
			console.log(err);
		}
		msg += "  \n";
		return msg;
	}

}

//print unit based on its index in json_obj
function printUnit(json_obj,id,formattedOutput,rawOutput){
	var unit = new unit_obj(json_obj,id);
	console.log(unit.data["id"]);
	rawOutput.innerHTML = JSON.stringify(unit.data);
	//console.log(unit.constructor.toString());
	//unit name
	formattedOutput.innerHTML = unit.getName();

	//print rarity, element, cost, and gender
	formattedOutput.innerHTML += unit.getRareElemCostGender();
	
	//print hitcount info
	formattedOutput.innerHTML += unit.getNormalHitCountInfo();
	formattedOutput.innerHTML += unit.getMoveSpeedInfo();

	//print atk pattern table
	formattedOutput.innerHTML += unit.getNormalHitCountTable();

	//print merit type
	formattedOutput.innerHTML += unit.getMeritType();

	//print stat info
	formattedOutput.innerHTML += unit.getLordStats();
	
	//print leader skill info
	formattedOutput.innerHTML += unit.getLeaderSkill();

	//print ES info
	formattedOutput.innerHTML += unit.getExtraSkill();

	//print bb info
	formattedOutput.innerHTML += unit.getBBInfo();

	//print sbb info
	formattedOutput.innerHTML += unit.getSBBInfo();

	//print ubb info
	formattedOutput.innerHTML += unit.getUBBInfo();

	//print sp info
	formattedOutput.innerHTML += unit.getSPInfo();

	//print arena ai
	formattedOutput.innerHTML += unit.getArenaInfo();


	formattedOutput.innerHTML += "---\n";
	return unit.data["id"];
}

//recursively print an array into a string
function printArray(arr, brackets){
	var text = "";
	if(brackets){
		text += "[";
	}
	for(i in arr){
		if(arr[i] instanceof Array) text += printArray(arr[i], brackets);
		else if(arr[i] instanceof Object) text += JSON.stringify(arr[i]); //most likely a JSON object
		else text += arr[i];

		text += ",";	
	}

	if(text.length > 1){
		text = text.substring(0, text.length - 1); //remove last comma
	}

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

	//save parsed data
	var i = 0;
	for(i = 0; i < effectArr.length; ++i){
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

	//print frame differences
	text += "\n| Frame Diffs | ";
	for(t in timeArr){
		if(t != 0){
			text += (timeArr[t] - timeArr[t-1]) + " | ";
		}else{
			text += "0 | ";
		}
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
	var i = 1;
	var proc = burst["damage frames"][0]["proc id"];

	//print name, BC cost, and desc
	var text = "*" + burst["name"] + "* - (BC Cost: " + endBBLevel["bc cost"] + ") " + burst["desc"] + "\n\n";
	
	//print hit count based on if it's not a non-attacking burst
	if(!(proc == "2" || proc == "5" || proc == "51" ||
		proc == "18" || proc == "3" || proc == "38")){
		text += " * " + printHitCounts(burst["damage frames"][0]["hits"], burst["damage frames"][0]["frame times"],
			burst["drop check count"]);
	}else{
		text += " * " + printHitCounts(0, burst["damage frames"][0]["frame times"],
			burst["drop check count"]);
	}

	//print effects of burst
	for(e in endBBLevel["effects"]){
		text += printEffects(endBBLevel["effects"][e]);
	}
	//print atk pattern if not non-attacking burst
	if(!(proc == "2" || proc == "5" || proc == "51" ||
		proc == "18" || proc == "3" || proc == "38")){
		text += printAtkPattern(burst["damage frames"][0]["frame times"],burst["damage frames"][0]["hit dmg% distribution"]);
		//print tables for bursts with multiple attacks
		try{
			for(i = 1; i < burst["damage frames"].length; ++i){
				proc = burst["damage frames"][i]["proc id"];
				if(proc == "1" || proc == "64" || proc == "47" ||
					proc == "13" || proc == "14"){
					text += printAtkPattern(burst["damage frames"][i]["frame times"],burst["damage frames"][i]["hit dmg% distribution"]);
				}
			}
		}catch(err){
			console.log(err);
		}
	}

	return text;
}

//print info about hit counts
function printHitCounts(numHits, frameArr, dropChecks){
	var text = numHits + ((numHits == 1) ? " hit (" : " hits (") + dropChecks + 
		" BC/hit, max " + (dropChecks * numHits) + " BC generated)  \n";
	return text;
}

//print sp enhancements
function printSP(id){
	//check if SP file is loaded
	if(document.getElementById("sp-content").innerHTML != "SP input from file will be output here."){
		var text = "";
		var json_obj = JSON.parse(document.getElementById("sp-content").innerHTML);
		var unitSkills = json_obj[id]["skills"];
		//print each sp option
		for(s in unitSkills){
			var curSkill = unitSkills[s]["skill"];
			//print desc and ID
			text += " * " + curSkill["desc"] + " (" + curSkill["id"] + ")\n";
			text += "  * **Type:** " + getSPCategory(unitSkills[s]["category"]) + "\n";
			text += "  * **Cost:** " + curSkill["bp"] + "\n";
			text += "  * **Dependency:** " + ((unitSkills[s]["dependency"] == "") ? "None\n" : (unitSkills[s]["dependency"] + "\n"));
			//print sp effects
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

//try to load unit art
function loadUnitArt(){
	var urls = [
		"http://cdn.android.brave.a-lim.jp/unit/img/",
		"http://dlc.bfglobal.gumi.sg/content/unit/img/",
		"http://static-bravefrontier.gumi-europe.net/content/unit/img/",
		"http://i.imgur.com/y1rE5ve.png"
	];

	var img = document.getElementById("unit-full-img");
	var currURL = img.src;
	var id = img.alt;

	if(currURL == "http://i.imgur.com/6vQObKW.png" || currURL == "http://i.imgur.com/LHkoVqZ.gif"){//try JP first
		currURL = urls[0];
	}else if(currURL.search("a-lim.jp") > -1){//try global next
		currURL = urls[1];
	}else if(currURL.search("bfglobal") > -1){//try EU next
		currURL = urls[2];
	}else if(currURL.search("gumi-europe") > -1){ //image is not found on any server
		document.getElementById("unit-full-img").src = urls[3];
		document.getElementById("unit-full-img-text").innerHTML = "Unit Art not found.<br>All Brave Frontier images are owned by Gumi.";
		return;
	}else{//internet error
		document.getElementById("unit-full-img").src = "index.html";
		document.getElementById("unit-full-img-text").innerHTML = "Unit Art not found.<br>All Brave Frontier images are owned by Gumi.";
		return;
	}

	document.getElementById("unit-full-img").src = currURL + "unit_ills_full_" + id + ".png";
	document.getElementById("unit-full-img-text").innerHTML = "All Brave Frontier images are owned by Gumi.";
}

//get the burst frame times of a unit
function getBurstFrameTimes(unit, type){
	var frames = [];

	frames.push(unit[type]["damage frames"][0]["frame times"]);
	var proc = unit[type]["damage frames"][0]["proc id"];
	//return empty array if burst is non-attacking
	if(proc == "2" || proc == "5" || proc == "51" ||
		proc == "18" || proc == "3" || proc == "38"){
		if(frames.length != 0){
			frames.pop();
		}
		return frames;
	}

	//check for multiple attacks
	try{
		for(i = 1; i < unit[type]["damage frames"].length; ++i){
			var proc = unit[type]["damage frames"][i]["proc id"];
			if((proc == "1" || proc == "64" || proc == "47" ||
				proc == "13" || proc == "14")){
				frames.push(unit[type]["damage frames"][i]["frame times"]);
			}
		}
	}catch(err){
		console.log(err);
	}
	return frames;
}

//get list of units that spark at least once with currently loaded unit
//type of main unit = bb, sbb, ubb
function getSparkList(type){
	var json_obj = JSON.parse(document.getElementById("file-content").innerHTML);
	var unitID = document.getElementById("unit-full-img").alt;
	var mainUnit = json_obj[unitID];
	var output = document.getElementById("temp");
	var types = ["bb", "sbb", "ubb"];
	var speedType = mainUnit["movement"]["skill"]["move speed type"];
	var results = [];
	//try to load burst, if it exists
	try{
		var mainFrames = getBurstFrameTimes(mainUnit,type);
	}catch(err){
		document.getElementById("temp").innerHTML = "This unit does not have a " + type.toUpperCase();
		return;
	}
	//check for non-attacking burst
	var proc = mainUnit[type]["damage frames"][0]["proc id"];
	if(proc == "2" || proc == "5" || proc == "51" ||
		proc == "18" || proc == "3" || proc == "38"){
		document.getElementById("temp").innerHTML = "This unit does not have an attacking " + type.toUpperCase();
		return;
	}

	//cycle through every units BB/SBB/UBB if they have the same move speed
	for(unitID in json_obj){//for every unit
		var otherUnit = json_obj[unitID];
		//only check units of same move speed type
		if(otherUnit["movement"]["skill"]["move speed type"] == speedType){
			//check bb
			try{
				var otherFrames = getBurstFrameTimes(otherUnit, types[0]);
				if(otherFrames.length > 0){
					for(f in mainFrames){//for every attack in burst of main unit
						for(f2 in otherFrames){//for every attack in burst of other unit
							var tempResult = getSparkability(otherFrames[f2],mainFrames[f]);
							if(tempResult.sparks > 0){
								results.push({
									sparkResult: tempResult,
									unitID: unitID,
									burstType: types[0],
									burstIndex: f2,
									burstIndexMain: f,
								});
							}
						}//end for every atk in other
					}//end for every atk in main
				}else{
					console.log("Error at " + unitID);
				}
			}catch(err){
				console.log(otherUnit["id"] + " & " + types[0] + "\n" + err);
			}

			//check sbb
			if(otherUnit["rarity"] > 5){
				try{
					var otherFrames = getBurstFrameTimes(otherUnit, types[1]);
					if(otherFrames.length > 0){
						for(f in mainFrames){//for every attack in burst of main unit
							for(f2 in otherFrames){//for every attack in burst of other unit
								var tempResult = getSparkability(otherFrames[f2],mainFrames[f]);
								if(tempResult.sparks > 0){
									results.push({
										sparkResult: tempResult,
										unitID: unitID,
										burstType: types[1],
										burstIndex: f2,
										burstIndexMain: f,
									});
								}
							}//end for every atk in other
						}//end for every atk in main
					}else{
						console.log("Error at " + unitID);
					}
				}catch(err){
					console.log(otherUnit["id"] + " & " + types[1] + "\n" + err);
				}
			}//end if bb/sbb/ubb and rarity

			//check ubb
			if(otherUnit["rarity"] > 6){
				try{
					var otherFrames = getBurstFrameTimes(otherUnit, types[2]);
					if(otherFrames.length > 0){
						for(f in mainFrames){//for every attack in burst of main unit
							for(f2 in otherFrames){//for every attack in burst of other unit
								var tempResult = getSparkability(otherFrames[f2],mainFrames[f]);
								if(tempResult.sparks > 0){
									results.push({
										sparkResult: tempResult,
										unitID: unitID,
										burstType: types[2],
										burstIndex: f2,
										burstIndexMain: f,
									});
								}
							}//end for every atk in other
						}//end for every atk in main
					}else{
						console.log("Arr Length = 0 at " + unitID);
					}
				}catch(err){
					console.log(otherUnit["id"] + " & " + types[2] + "\n" + err);
				}
			}//end if bb/sbb/ubb and rarity
		}//end if same move speed
	}//end for every unit

	//print formatted results table
	var formattedResults = "**Notes:** \n* The results are units of the [same movespeed (" + speedType + ")](https://www.reddit.com/r/bravefrontier/comments/4sm6ro/how_to_perfect_spark_identical_units_compilation/) that spark at least 1 of their hits with **" + mainUnit["guide_id"] + ": " + mainUnit["name"] + " (" + mainUnit["id"] + ")**\n";
	formattedResults +="* The results do not take into account whether or not a unit teleports/doesn't move before attacking.\n";
	formattedResults += "* MU = main unit (unit being compared to); OU = other unit\n"
	formattedResults += "* This is still a work in progress. IF there are any issues or suggestions you have, you can contact me via the Issues page (link found in the `Description` tab)\n\n"
	formattedResults += "\n| Other Unit (OU) | OU's Sparked Hits | OU's Spark Percentage | OU's Burst Type[index] | MU's Sparked Hits | MU's Spark Percentage | MU's Burst Type[index] |\n";
	formattedResults += "|:--:|:--:|:--:|:--:|:--:|:--:|:--:|\n";
	//{{other}} sparks ##/## of its hits on {{BB|SBB|UBB}}[{{index of burst}}] with ##/## of {{main}}'s hits on {{BB|SBB|UBB}}[{{index of burst}}]
	for(r in results){
		var currUnit = json_obj[results[r].unitID]
		var currResult = results[r].sparkResult;
		formattedResults += "| " + currUnit["guide_id"] + ": " + currUnit["name"] + " (" + currUnit["id"] + ") - " + ((currUnit["rarity"] == 8) ? "OE" : (currUnit["rarity"] + "*")) + " | ";
		formattedResults += currResult.otherSparks.split(" ")[0] + " | " + currResult.otherSparks.split(" ")[1] + " | " + results[r].burstType + "[" + results[r].burstIndex + "] | ";
		formattedResults += currResult.mainSparks.split(" ")[0] + " | " + currResult.mainSparks.split(" ")[1] + " | " + type + "[" + results[r].burstIndexMain + "] |\n";
	}
	formattedResults += "\n";

	document.getElementById("temp").innerHTML = formattedResults;
}

//count the number of matching frame counts
//other = other unit, main = main unit you're comparing
//{{other}} sparks ##/## of its hits on {{BB|SBB|UBB}}[{{index of burst}}] with ##/## of {{main}}'s hits on {{BB|SBB|UBB}}[{{index of burst}}]
function getSparkability(otherFrames, mainFrames){
	var sparkedHits = 0;
	var totalHits = [otherFrames.length, mainFrames.length];

	var i = 0; j = 0;
	for(i = 0; i < totalHits[1]; ++i){//for every frame of the main unit
		for(j = 0; j < totalHits[0]; ++j){//for every frame of the other unit
			if(otherFrames[j] >= mainFrames[i]){
				if(otherFrames[j] == mainFrames[i]){
					sparkedHits++;
				}
				break; //stop checking once at or past current frame number
			}//end if >=
		}//end for j
	}//end for i

	var result = {
		sparks: sparkedHits,
		otherSparks: sparkedHits + "/" + totalHits[0] + " " + ((sparkedHits / totalHits[0])*100).toFixed(2) + "%",
		mainSparks: sparkedHits + "/" + totalHits[1]  + " " + ((sparkedHits / totalHits[1])*100).toFixed(2) + "%",
	};

	return result;
}

