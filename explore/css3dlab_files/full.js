/* CSS Utility Functions
-------------------------------------------------- */

var CssUtils = (function() {	
	var s = document.documentElement.style;
 	var vendorPrefix = '';
		// (s.WebkitTransform !== undefined && "-webkit-") ||
		// (s.MozTransform !== undefined && "-moz-") ||
		// (s.msTransform !== undefined && "-ms-") || "";
	
	return {
		translate: function( x, y, z, rx, ry, rz ) {
			return vendorPrefix + "transform:" +
				"translate3d(" + x + "px," + y + "px," + z + "px)" +	
				"rotateX(" + rx + "deg)" +
				"rotateY("  +ry + "deg)" +
				"rotateZ(" + rz + "deg);"
		},
		origin: function( x, y, z ) {
			return vendorPrefix + "transform-origin:" + x + "px " + y + "px " + z + "px;";
		},
		texture: function( colour, rx, ry, rz ) {
			var a = Math.abs(-0.5+ry/180)/1.5;
			if (rz!==0) {
				a/=1.75;
			}
			return "background:"+vendorPrefix +"linear-gradient(rgba(0,0,0," + a + "),rgba(0,0,0," + a + "))," + colour + "; background-size: cover;";
		}		
	}
}());


/* Triplet
-------------------------------------------------- */

function Triplet( x, y, z ) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
}

/* Camera
-------------------------------------------------- */

function Camera( world, x, y, z, rx, ry, rz) {
	this.world = world;
	this.position = new Triplet(x, y, z);
	this.rotation = new Triplet(rx, ry, rz);	
	this.fov = 700;
}

Camera.prototype = {
	update: function() {
		if (this.world) {
			this.world.node.style.cssText=
				CssUtils.origin( -this.position.x, -this.position.y, -this.position.z) +
				CssUtils.translate( this.position.x, this.position.y, this.fov, this.rotation.x, this.rotation.y, this.rotation.z)
			}
		}
}

/* Plane
-------------------------------------------------- */

function Plane( colour, w,h,x,y,z,rx,ry,rz) {
	this.node = document.createElement("div")
	this.node.className="plane"
	this.colour = colour
	this.width = w;
	this.height = h;
	this.position = new Triplet(x, y, z);
	this.rotation = new Triplet(rx, ry, rz);
	this.update();
}

Plane.prototype = {
	update: function() {
		this.node.style.cssText += 
			"width:" + this.width + "px;" +
			"height:" + this.height + "px;" +
			CssUtils.texture(this.colour, this.rotation.x, this.rotation.y, this.rotation.z) +
			CssUtils.translate( this.position.x, this.position.y, this.position.z, this.rotation.x, this.rotation.y, this.rotation.z)
	}
}

/* World
-------------------------------------------------- */

function World( viewport ) {
	this.node = document.createElement("div")
	this.node.className = "world"
	viewport.node.appendChild(this.node)
	viewport.camera.world = this;
}

World.prototype = {
	addPlane: function( plane ) {
		this.node.appendChild(plane.node)
	}
}

/* Viewport
-------------------------------------------------- */

function Viewport( node ) {
	this.node = document.createElement("div")
	this.node.className = "viewport"
	this.camera = new Camera()
	node.appendChild(this.node)
}

var bufferspace=80;
var wallw = 500;
var wallh = 200;
var regioncolours = {}
regioncolours[1] = "url('css3dlab_files/brickwall.jpg')";
regioncolours[2] = regioncolours[21] = "url('css3dlab_files/astralwall.jpg')";
regioncolours[3] = regioncolours[31] = regioncolours[39] = "yellow";
regioncolours[4] = regioncolours[49] = "green";
regioncolours[5] = regioncolours[59] = "orange";
regioncolours[6] = regioncolours[69] = "blue";
regioncolours[9] = regioncolours[99] = "white";
var currentregion=10;
var map = [
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,2,2,2,2,2,2,0,59,59,5,5,0,6,6,69,69,0,2,2,2,2,2,2,2,0],
	[0,0,2,2,2,2,2,2,0,0,0,0,5,0,6,0,0,0,0,2,2,2,2,2,2,2,0],
	[0,0,2,2,2,2,2,2,2,2,2,0,5,0,6,0,2,2,2,2,2,2,2,2,2,2,0],
	[0,0,2,2,2,2,2,2,2,2,2,0,5,0,6,0,2,2,2,2,2,2,2,2,2,2,0],
	[0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
	[0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
	[0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
	[0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
	[0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
	[0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
	[0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
	[0,0,2,2,2,2,2,2,2,2,2,2,0,0,0,2,2,2,2,2,2,2,2,2,2,2,0],
	[0,0,2,2,2,2,2,2,2,2,2,2,0,1,1,2,2,2,2,2,2,2,2,2,2,2,0],
	[0,0,2,2,2,2,2,2,2,2,2,2,0,1,0,2,2,2,2,2,2,2,2,2,2,0,0],
	[0,0,3,0,2,2,2,2,2,2,2,2,0,1,0,2,2,2,2,2,2,2,2,0,4,0,0],
	[0,0,3,0,0,2,0,0,2,2,2,2,0,1,0,2,2,2,2,0,0,2,0,0,4,0,0],
	[0,0,3,0,0,2,2,0,0,2,2,2,0,1,0,2,2,2,0,0,2,2,0,0,4,0,0],
	[0,0,3,31,0,0,2,2,0,0,2,2,0,0,0,2,2,0,0,2,2,0,0,4,4,0,0],
	[0,0,0,31,0,0,0,2,2,0,0,0,0,0,0,0,0,0,21,2,0,0,0,4,0,0,0],
	[0,0,39,31,0,0,0,0,9,9,9,9,9,9,9,9,9,9,99,0,0,0,0,4,49,49,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];
var unlocked = [1,2,9,99];
var walls = {};
var currvid = '';
var ponyexit = false;
var gamestarted = false;
var bgmmuted = false;

function findRegion(x,y){
	var xindex = Math.floor(x/wallw);
	var yindex = Math.floor(y/wallw);
	if(xindex < 0 || xindex >= map.length) return -1;
	if(xindex < 0 || yindex >= map[0].length) return -1;
	return map[xindex][yindex];
}

function outOfBounds(x,y){
	var buffspace = bufferspace/Math.sqrt(2);
	if(
		!(unlocked.includes(findRegion(x,y))) || !(unlocked.includes(findRegion(x,y+bufferspace))) || !(unlocked.includes(findRegion(x,y-bufferspace))) || !(unlocked.includes(findRegion(x+bufferspace,y))) || !(unlocked.includes(findRegion(x-bufferspace,y))) ||
		!(unlocked.includes(findRegion(x+buffspace,y+buffspace))) || !(unlocked.includes(findRegion(x+buffspace,y-buffspace))) || !(unlocked.includes(findRegion(x-buffspace,y+buffspace))) || !(unlocked.includes(findRegion(x-buffspace,y-buffspace)))
	)	return true;
	return false;
}

// Create Walls
var covered = map.map(function (row) { return row.map(function (entry) { return [false, false, false, false]; }) });

function checkbk1answer(){
	var ans = document.getElementById('bk1ans').value.toLowerCase();
	if(ans == "hbd"){
		walls["14,2,2"].node.remove();
		unlocked.push(3);
		document.getElementById('key').play();
	}
}
function checkbk2answer(){
	var ans = document.getElementById('bk2ans').value.toLowerCase();
	if(ans == "hbd"){
		walls["18,2,1"].node.remove();
		unlocked.push(31);
		document.getElementById('key').play();
	}
}
function checkbk3answer(){
	walls["20,3,3"].node.remove();
	unlocked.push(39);
	document.getElementById('key').play();
}


function checksuhail2answer(){
	console.log("Checking");
	var ans = document.getElementById('suhail2ans').value.toLowerCase();
	if(ans == "hbd"){
		walls["14,24,2"].node.remove();
		unlocked.push(4);
		unlocked.push(49);
		document.getElementById('key').play();
	}
}

function startthings(i){
	var stt = document.getElementById('starting');
	if(i==0){
		stt.innerHTML = "Use arrow keys to navigate.<br>Click for more.";
		stt.onclick = function(){ startthings(1); };
	}
	if(i==1){
		stt.innerHTML = "Use arrow keys to navigate.<br><span style='font-size: xx-small;'>There are bugs so you might need to follow onscreen commands that pop up once in a while.</span><br>Click one last time for more.";
		stt.onclick = function(){ startthings(2); };
		var bgm = document.getElementById('bgm');
		bgm.play();
		bgm.pause();
		var bdm = document.getElementById('bdm');
		bdm.play();
		bdm.pause();
	}
	if(i==2){
		stt.innerHTML = "Use arrow keys to navigate.<br><span style='font-size: xx-small;'>There are bugs so you might need to follow onscreen commands that pop up once in a while.</span><br>Have fun!";
		stt.onclick = null;
	}

}

function showmusic(){
	document.getElementById('musicnotice').className += " inandout";
	setTimeout(function() {document.getElementById('musicnotice').className = "notice";}, 4000)
}
function showplay(){
	document.getElementById('playnotice').className += " inandout";
	setTimeout(function() {document.getElementById('playnotice').className = "notice";}, 4000)
}
function startbgm(){
	var bgm = document.getElementById('bgm');
	var bdm = document.getElementById('bdm');
	bdm.pause();
	bgm.play();
	setTimeout(function(){
		if(bgm.paused)
			showmusic();
	},100);
}
function startbdm(){
	var bgm = document.getElementById('bgm');
	var bdm = document.getElementById('bdm');
	bgm.pause();
	bdm.play();
	setTimeout(function(){
		if(bdm.paused)
			showmusic();
	},100);
}

window.onload = function() {	
	var maxSpeed = 8;
	var accel = 0.2;
	var speed = 0;
	var viewport = new Viewport( document.body );
	var world = new World( viewport );
	var keyState = {
		forward: false,
		backward: false,
		strafeLeft: false,
		strafeRight: false
	};
	var running=false;
	var pointer = { x: 0, y: 0 };

	function regionUpdate(newregion){
		if(currentregion==newregion)	return;
		else{
			console.log("Entered ",newregion," from ",currentregion);
			var bgm = document.getElementById('bgm');
			var bdm = document.getElementById('bgm');
			switch(newregion){
				case 39:
					bgm.pause();
					var bv = document.getElementById('bkvid')
					bv.requestFullscreen().then(function() {bv.play();}, function() {
						showplay();
						currvid = 'bkvid';
					});
					break;
				case 49:
					bgm.pause();
					var sv = document.getElementById('s2vid');
					sv.requestFullscreen().then(function() {sv.play();}, function() {
						showplay();
						currvid = 's2vid';
					});
					break;
				case 99:
					if(!ponyexit){
						unlocked.push(21);
						walls["19,19,3"].node.remove();
						ponyexit = true;
					}
					if(currentregion==21){
						startbdm();
					}
					break;
				case 9:
					if(currentregion==2){
						startbdm();
					}
					break;
			}
			if(!bgmmuted){
				switch(currentregion){
					case 1:
						gamestarted = true;
						startbgm();
						break;
					case 39:
						startbgm()
						break;
					case 49:
						startbgm()
						break;
					case 99:
						if(newregion==21){
							startbgm();
						}
						break;
					case 9:
						if(newregion==2){
							startbgm();
						}
						break;
				}
			}
			currentregion = newregion;
		}
	}

	function testwalls(i,j,d,region){
		var wallc = regioncolours[region];
		var [x, y] = [[0,0],[0,wallw],[wallw,wallw],[wallw,0]][d];//[[0,-1],[1,0],[0,1],[0,0]][d];
		//x = x*wallw*.5 + wallw*(i+.5);
		//y = y*wallw*.5 + wallw*(j+.5);
		var z = 0;
		var [rotx, roty, rotz] = [[270,90,180],[270,180,180],[90,270,0],[270,0,180]][d];
		world.addPlane( new Plane(wallc, wallw, wallh, x, y, z, rotx, roty, rotz) );
	}

	function addwall(i,j,d,c){
		var [x, y] = [[0,0],[0,wallw],[wallw,wallw],[wallw,0]][d];
		x += wallw*i;
		y += wallw*j;
		var z = -50;
		var [rotx, roty, rotz] = [[270,90,180],[270,180,180],[90,270,0],[270,0,180]][d];
		var newwall = new Plane(c, wallw, wallh, x, y, z, rotx, roty, rotz);
		walls[[i,j,d]] = newwall;
		world.addPlane( newwall );
		covered[i][j][d] = true;
	}

	function coverwalls(i,j,d,si,sj,sd) {
		var region = map[i][j];
		var wallc = regioncolours[region];
		addwall(i,j,d,wallc);
		var newi, newj, newd;
		switch(d){
			case 0:
				if(map[i][j+1]==0) [newi, newj, newd] = [i, j, 1];
				else if(map[i-1][j+1]==0) [newi, newj, newd] = [i, j+1, 0];
				else [newi, newj, newd] = [i-1, j+1, 3];
				break;
			case 1:
				if(map[i+1][j]==0) [newi, newj, newd] = [i, j, 2];
				else if(map[i+1][j+1]==0) [newi, newj, newd] = [i+1, j, 1];
				else [newi, newj, newd] = [i+1, j+1, 0];
				break;
			case 2:
				if(map[i][j-1]==0) [newi, newj, newd] = [i, j, 3];
				else if(map[i+1][j-1]==0) [newi, newj, newd] = [i, j-1, 2];
				else [newi, newj, newd] = [i+1, j-1, 1];
				break;
			case 3:
				if(map[i-1][j]==0) [newi, newj, newd] = [i, j, 0];
				else if(map[i-1][j-1]==0) [newi, newj, newd] = [i-1, j, 3];
				else [newi, newj, newd] = [i-1, j-1, 2];
				break;
		}
		if(si==newi && sj==newj && sd==newd)	return;
		coverwalls(newi,newj,newd,si,sj,sd);
	}	

	for(var i = 0; i < map.length; i++){
		for(var j=0; j < map[i].length; j++){
			if(map[i][j]==0) continue;
			if(!covered[i][j][0] && map[i-1][j]==0)	coverwalls(i,j,0,i,j,0);
			if(!covered[i][j][1] && map[i][j+1]==0)	coverwalls(i,j,1,i,j,1);
			if(!covered[i][j][2] && map[i+1][j]==0)	coverwalls(i,j,2,i,j,2);
			if(!covered[i][j][3] && map[i][j-1]==0)	coverwalls(i,j,3,i,j,3);
		}
	}

	// Intro portion
	walls["17,13,2"].node.innerHTML = "<span id='starting' style='color: yellow' onclick='startthings(0)'>Click for instructions.</span>";
	walls["15,13,1"].node.innerHTML = "<span style='color: yellow'>You are entering the astral plane.</span>";
	walls["15,13,3"].node.innerHTML = "<span style='color: yellow'>Distances are no obstacle here.</span>";
	walls["14,13,1"].node.innerHTML = "<span style='color: yellow'>What an auspicious day this is.</span>";
	walls["14,13,3"].node.innerHTML = "<span style='color: yellow'>The signals are strong tonight.<br>- Pigeon Brothers Plumbing</span>";

	// Birthday greeting portion
	var bdfont = (Math.random()<.5) ? 'henry' : 'paquet';
	for(var i=0;i<9;i++)	walls["20,"+(9+i).toString()+",0"].node.style.background = 'url(css3dlab_files/'+bdfont+'/'+i.toString()+'.jpg)';
	// Birthday ponies portion
	function sendPony(){
		var newPony=document.createElement('img');
		ponies =
			[ "af.gif",
			   "bm.gif",
			   "cc.gif",
			   "cs.gif",
			   "dg.gif",
			   "dl.gif",
			   "ib.gif",
			   "jl.gif",
			   "km.gif",
			   "kr.gif",
			   "lw.gif",
			   "mk.gif",
			   "mt.gif",
			   "mu.gif",
			   "ni.gif",
			   "nk.gif",
			   "rr.gif",
			   "rs.gif",
			   "tj.gif",
			   "tl.gif",
			   "zf.gif"];
		newPony.src="css3dlab_files/ponies/"+ponies[parseInt(Math.random()*ponies.length)];
		newPony.className = "pony"
		world.node.appendChild(newPony);
		setTimeout(function(){
			newPony.remove();
		}, 20000);
	}
	window.setInterval(sendPony, 2000);
	// Glass wall
	addwall(19,19,3,'url("nonexistent.jpg")');
	walls["19,19,3"].node.style.cursor="not-allowed";

	// Gates for BK portion
	addwall(14,2,2,'url("css3dlab_files/noentry.jpg")');
	var bk1q = document.createElement("div");
	bk1q.className = "question";
	bk1q.innerHTML = `
	What was it that a monkey found worth stealing from your apartment?<br>
	<input type='text' id='bk1ans' oninput='checkbk1answer()'>
	`;
	walls["14,2,2"].node.appendChild(bk1q);
	addwall(18,2,1,'url("css3dlab_files/noentry.jpg")');
	var bk2q = document.createElement("div");
	bk2q.className = "question";
	bk2q.innerHTML = `
	Why do we always mess up birthdays of friends!?<br>
	<input type='text' id='bk2ans' oninput='checkbk2answer()'>
	`;
	walls["18,2,1"].node.appendChild(bk2q);
	addwall(20,3,3,'url("css3dlab_files/noentry.jpg")');
	var bk3q = document.createElement("div");
	bk3q.className = "question";
	bk3q.innerHTML = `
	Which emoji is me watching Jab We Met?<br>
	<span class="clickable"> &#x1F602 </span><span class="clickable"> &#x1F603 </span><span class="clickable"> &#x1F60D </span><span class="clickable" onclick='checkbk3answer()'> &#x1F62D </span><span class="clickable"> &#x1F601 </span>
	`;
	walls["20,3,3"].node.appendChild(bk3q);
	// Video for BK
	var bkvid = document.createElement('video');
	bkvid.id = 'bkvid';
	bkvid.src = 'css3dlab_files/bkvid.mp4';
	bkvid.preload = 'auto';
	bkvid.autoplay = 'false';
	walls["20,2,3"].node.appendChild(bkvid);

	// Gate for Suhail2 portion
	addwall(14,24,2,'url("css3dlab_files/noentry.jpg")');
	var suhail2q = document.createElement("div");
	suhail2q.className = "question";
	suhail2q.innerHTML = `
	Fill in the blanks:<br>The quote near the beginning is from T_im_lewee_ Park<br>
	<input type='text' id='suhail2ans' oninput='checksuhail2answer()'>
	`;
	walls["14,24,2"].node.appendChild(suhail2q);
	walls["18,24,2"].node.innerHTML = "<span style='color: yellow'>I've never made anything this cool before!</span>";
	walls["18,23,3"].node.innerHTML = "<span style='color: yellow'>**HUGS**</span>";
	// Video for Suhail
	var suhail2vid = document.createElement('video');
	suhail2vid.id = 's2vid';
	suhail2vid.src = 'css3dlab_files/svid.webm';
	suhail2vid.preload = 'auto';
	suhail2vid.autoplay = 'false';
	walls["20,25,1"].node.appendChild(suhail2vid);

	// testwalls(1,1,0,1);
	// testwalls(1,1,1,2);
	// testwalls(1,1,2,3);
	// testwalls(1,1,3,4);

	viewport.camera.position.x=-wallw*17.5;
	viewport.camera.position.y=-wallw*13.5;
	viewport.camera.position.z=-50;
	viewport.camera.rotation.x=270;
	viewport.camera.rotation.y=0;
	viewport.camera.rotation.z=90;
	viewport.camera.update();

	// window.addEventListener("devicemotion", function(ev) {
	// 	keyState.forward = ev.accelerationIncludingGravity.z<-6;
	// 	keyState.backward = ev.accelerationIncludingGravity.z>3;
	// }, false);
	
	// document.addEventListener("touchstart", function(ev) {
	// 	pointer.x = ev.targetTouches[0].pageX;
	// 	pointer.y = ev.targetTouches[0].pageY;
	// 	ev.preventDefault();
	// }, false);
	
	// document.addEventListener("touchmove", function(ev) {
	// 	viewport.camera.rotation.x -= (ev.targetTouches[0].pageY - pointer.y)/2;
	// 	viewport.camera.rotation.z += (ev.targetTouches[0].pageX - pointer.x)/2;
	// 	pointer.x = ev.targetTouches[0].pageX;
	// }, false);

	// document.addEventListener("mouseover", function(ev) {
	// 	pointer.x = ev.pageX;
	// 	pointer.y = ev.pageY;	
	// 	document.removeEventListener("mouseover", arguments.callee)
	// }, false);
	
	// document.addEventListener("mousemove", function(ev) {
	// 	viewport.camera.rotation.x -= (ev.pageY - pointer.y)/2;
	// 	viewport.camera.rotation.z += (ev.pageX - pointer.x)/2;
	// 	pointer.x = ev.pageX;
	// 	pointer.y = ev.pageY;
	// }, false);

	document.addEventListener("keydown", function(e) {
		//console.log(e.keyCode);
		switch (e.keyCode) {
			case 38:
				keyState.forward = true;
				break;	
			case 40:
				keyState.backward = true;
				break;	
			case 37:
				keyState.leftward = true;
				break;
			case 39:
				keyState.rightward = true;
				break;
			case 68:
				keyState.debug = true;
				break;
			case 80:
				if(currvid!=''){
					document.getElementById('playnotice').style.opacity = 0;
					var videlem = document.getElementById(currvid);
					videlem.requestFullscreen();
					videlem.play();
				}
				break;
			case 77:
				var reg = findRegion(-viewport.camera.position.x, -viewport.camera.position.y);
				if(reg%10!=9){
					var bgm = document.getElementById('bgm');
					if(bgm.paused)
						bgm.play();
					else
						bgm.pause();
				} else if([9,99].contains(reg)){
					var bdm = document.getElementById('bdm');
					if(bdm.paused)
						bdm.play();
					else
						bdm.pause();
				}
				break;
			}
			if(e.shiftKey){
				running=true;
			} else {
				running=false;
			}
	}, false);

	document.addEventListener("keyup", function(e) {
		switch (e.keyCode) {
			case 38:
				keyState.forward = false;
				break;	
			case 40:
				keyState.backward = false;
				break;
			case 37:
				keyState.leftward = false;
				break;
			case 39:
				keyState.rightward = false;
				break;
			case 68:
				keyState.debug = false;
				break;
			}
	}, false);
						
	// Game Loop

	(function() {
		if (keyState.backward) {
			if (speed > -maxSpeed) speed -= accel;
		} else if (keyState.forward) {
			if (speed < maxSpeed) speed += accel;
		} else if (speed > 0) {
			speed = Math.max( speed - accel, 0);
		} else if (speed < 0) {
			speed = Math.max( speed + accel, 0);
		} else {
			speed = 0;
		}
		if (keyState.rightward){
			viewport.camera.rotation.z += 1;
		} else if (keyState.leftward){
			viewport.camera.rotation.z -= 1;
		}
		var xo = Math.sin(viewport.camera.rotation.z * 0.0174532925);
		var yo = Math.cos(viewport.camera.rotation.z * 0.0174532925);

		if(outOfBounds(-viewport.camera.position.x + xo * speed, -viewport.camera.position.y + yo * speed)){
			if(!outOfBounds(-viewport.camera.position.x + xo * speed, -viewport.camera.position.y))
				viewport.camera.position.x -= xo * speed;
			else if(!outOfBounds(-viewport.camera.position.x, -viewport.camera.position.y + yo * speed))
				viewport.camera.position.y -= yo * speed;
			else
				speed=0;
		} else {
			viewport.camera.position.x -= xo * speed;
			viewport.camera.position.y -= yo * speed;
		}
		viewport.camera.update();
		var region = findRegion(-viewport.camera.position.x, -viewport.camera.position.y);
		regionUpdate(region);
		if(keyState.debug)	console.log(viewport.camera.position);
		if(keyState.debug)	console.log(viewport.camera.rotation);
		setTimeout( arguments.callee, 15);

	})();
}
