/* CSS Utility Functions
-------------------------------------------------- */

var CssUtils = (function() {	
	var s = document.documentElement.style;
 	var vendorPrefix = 
		(s.WebkitTransform !== undefined && "-webkit-") ||
		(s.MozTransform !== undefined && "-moz-") ||
		(s.msTransform !== undefined && "-ms-") || "";
	
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
var regioncolours = ["blue", "url('css3dlab_files/brickwall.jpg')", "url('css3dlab_files/sback.jpg')", "yellow", "url('papad.jpg')","orange","white"];
regioncolours[29] = "url('css3dlab_files/sback.jpg')";
var currentregion=10;
var map = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 2, 29, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 3, 0],
    [0, 1, 1, 2, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 3, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 3, 0],
    [0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0],
    [0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0],
    [0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0],
    [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0],
    [0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0],
    [0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0],
    [0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0],
    [0, 5, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0],
    [0, 5, 5, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 4, 4, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 4, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	];
var unlocked = [1];
var walls = {};

function findRegion(x,y){
	var xindex = Math.floor(x/wallw);
	var yindex = Math.floor(y/wallw);
	if(xindex < 0 || xindex >= map[0].length) return -1;
	if(xindex < 0 || yindex >= map.length) return -1;
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

function checksuhailanswer(){
	console.log("Checking");
	var ans = document.getElementById('suhailans').value.toLowerCase();
	if(ans == "research"){
		walls["2,2,1"].node.remove();
		unlocked.push(2);
		unlocked.push(29);
		document.getElementById('key').play();
	}
}

window.onload = function() {
	
	var maxSpeed = 5;
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
	var pointer = { x: 0, y: 0 };

	function regionUpdate(newregion){
		if(currentregion==10)	document.getElementById('intro').play();
		if(currentregion==newregion)	return;
		else{
			console.log("Entered ",newregion," from ",currentregion);
			currentregion = newregion;
			if(newregion==29) document.getElementById('svid').play();
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

	// function buildCube( colour, w, h, d, x, y, z, rx, ry, rz ) {

	// 	world.addPlane( new Plane(colour, h, w, x, y, z, 0, 180, 90));		
	// 	world.addPlane( new Plane(colour, w, d, x, y, z, 90, 0, 0));
	// 	world.addPlane( new Plane(colour, d, h, x, y, z, 0, 270, 0));
	// 	world.addPlane( new Plane(colour, d, h, x+w, y, z+d, 0, 90, 0));
	// 	world.addPlane( new Plane(colour, w, d, x+w, y+h, z, 90, 180, 0));
	// 	world.addPlane( new Plane(colour, w, h, x, y, z+d, 0, 0, 0));
	// }

	// // floor
	// world.addPlane( new Plane("url(wood.jpg)", 800, 800, -400, 400, 53, 180, 0, 0));

	// // walls
	// world.addPlane( new Plane("red", 800, 500, 400, -400, -447, 270, 0,180));
	// world.addPlane( new Plane("blue", 800, 500, -400, -400, -447, 270, 90, 180));
	// world.addPlane( new Plane("green", 800, 500, -400, 400, -447, 90, 00, 0,0));
	// world.addPlane( new Plane("yellow", 800, 500, 400, 400, -447, 90, 270, 0));

	// // rug
	// world.addPlane( new Plane("url(rug.jpg)", 200, 340, 100, -170, 52,0,180,0));

	// // table
	// buildCube("url(desk.jpg)", 10, 10, 100, -50, -100, -49);
	// buildCube("url(desk.jpg)", 10, 10, 100, 50, -100, -49);
	// buildCube("url(desk.jpg)", 10, 10, 100, -50, 100, -49);
	// buildCube("url(desk.jpg)", 10, 10, 100, 50, 100, -49);
	// buildCube("url(desk.jpg)", 130, 250, 15, -60, -120, -65);

	// // chair
	// buildCube("url(desk.jpg)", 10, 10, 55, 135, -30, -4);
	// buildCube("url(desk.jpg)", 10, 10, 55, 135, 30, -4);
	// buildCube("url(desk.jpg)", 10, 10, 55, 75, -30, -4);
	// buildCube("url(desk.jpg)", 10, 10, 55, 75, 30, -4);
	// buildCube("#111", 60, 70, 15, 75, -30, -20);
	// buildCube("#111", 10, 70, 95, 135, -30, -100);

	// // mac
	// buildCube("#eee", 10, 120, 85, -30, -60, -170);
	// buildCube("#ccc", 40, 50, 2, -50, -25, -67);
	// world.addPlane( new Plane("url(osx.jpg)", 110, 65,-19,-55,-165,90,90,0));

	// //buildCube("#ddd", 2, 50, 50, -50, -25, -118);
	// world.addPlane( new Plane("#bbb", 2, 50,-33,-25,-115,90,0,20));
	// world.addPlane( new Plane("#999", 50, 50,-33,-25,-115,0,250,0));
	// world.addPlane( new Plane("#bbb", 2, 50,-31,25,-115,90,180,340));
	// world.addPlane( new Plane("#eee", 50, 50,-48,-25,-68,0,70,0));
	// world.addPlane( new Plane("#ddd", 2, 50,-30,-25,-115,0,160,0));

	// // keyboard
	// buildCube("url(mac-keybd.png)", 31, 70, 1, 10, -35, -67);

	// // mouse
	// buildCube("#eee", 20, 12, 2, 20, 60, -69);

	// // bookshelf
	// buildCube("url(desk.jpg)", 10, 50, 300, -350, 345, -250);
	// buildCube("url(desk.jpg)", 10, 50, 300, -150, 345, -250);
	// buildCube("url(desk.jpg)", 190, 50, 10, -340, 345, -250); // shelf
	// buildCube("url(desk.jpg)", 190, 50, 10, -340, 345, -160); // shelf
	// buildCube("url(desk.jpg)", 190, 50, 10, -340, 345, -65); // shelf
	// buildCube("url(desk.jpg)", 190, 50, 10, -340, 345, 30); // shelf


	for(var i = 0; i < map.length; i++){
		for(var j=0; j < map[i].length; j++){
			if(map[i][j]==0) continue;
			if(!covered[i][j][0] && map[i-1][j]==0)	coverwalls(i,j,0,i,j,0);
			if(!covered[i][j][1] && map[i][j+1]==0)	coverwalls(i,j,1,i,j,1);
			if(!covered[i][j][2] && map[i+1][j]==0)	coverwalls(i,j,2,i,j,2);
			if(!covered[i][j][3] && map[i][j-1]==0)	coverwalls(i,j,3,i,j,3);

		}
	}

	walls["1,1,0"].node.innerHTML = "<span style='color: white'>Use arrow keys to navigate</span>";
	walls["1,3,0"].node.innerHTML = "<span>You can tell her things on the walls!</span>";

	// Gate for Suhail portion
	addwall(2,2,1,'url("css3dlab_files/noentry.jpg")');
	var suhailq = document.createElement("div");
	suhailq.innerHTML = `
	Fill in the blanks:<br>Tata Institute of Fundamental ________<br>
	<input type='text' id='suhailans' oninput='checksuhailanswer()'>
	`;
	walls["2,2,1"].node.appendChild(suhailq);
	// Video for Suhail
	var suhailvid = document.createElement('video');
	suhailvid.id = 'svid';
	suhailvid.src = 'css3dlab_files/svid.webm';
	suhailvid.preload = 'auto';
	suhailvid.autoplay = 'false';
	walls["1,4,1"].node.appendChild(suhailvid);

	// testwalls(1,1,0,1);
	// testwalls(1,1,1,2);
	// testwalls(1,1,2,3);
	// testwalls(1,1,3,4);

	viewport.camera.position.x=-wallw*1.5;
	viewport.camera.position.y=-wallw*1.5;
	viewport.camera.position.z=-50;
	viewport.camera.rotation.x=270;
	viewport.camera.rotation.y=0;
	viewport.camera.rotation.z=-90;
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
			speed = 0;
		} else {
			viewport.camera.position.x -= xo * speed;
			viewport.camera.position.y -= yo * speed;
			viewport.camera.update();
			var region = findRegion(-viewport.camera.position.x, -viewport.camera.position.y);
			regionUpdate(region);
		}
		if(keyState.debug)	console.log(viewport.camera.position);
		if(keyState.debug)	console.log(viewport.camera.rotation);
		setTimeout( arguments.callee, 15);

	})();
}
