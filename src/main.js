
import SimplexNoise from 'simplex-noise';

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

const drawHexagon =(x, y, s, color, type = "normal")=>{
	if(type == "normal"){
		ctx.fillStyle = color
		ctx.strokeStyle = "#000000"
		ctx.lineWidth = 1
	}else if(type == "cursor"){
		ctx.lineWidth = 5
		ctx.strokestyle = "#000000"
	}
	ctx.beginPath()
	ctx.moveTo(x, y-s/2)
	ctx.lineTo(x+s/2, y-s/4)
	ctx.lineTo(x+s/2, y)
	ctx.lineTo(x, y+s/4)
	ctx.lineTo(x-s/2, y)
	ctx.lineTo(x-s/2, y-s/4)
	ctx.lineTo(x, y-s/2)
	ctx.closePath()
	if(type == "normal"){
		ctx.stroke()
		ctx.fill()
	}else if(type == "cursor"){
		ctx.stroke()
	}
}
const drawObject = (x, y, s, type)=>{
	if(type == "forest"){
		ctx.fillStyle = "#4f2602"
		ctx.strokeStyle = "black"
		ctx.fillRect(x-s/2, y-s/2, s, s)
		ctx.strokeRect(x-s/2, y-s/2, s, s)

		ctx.fillStyle = "#248016"
		ctx.beginPath();
		ctx.arc(x, y-s*3/4, s, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
	}else if(type == "mainBase"){
		ctx.fillStyle = "gray"
		ctx.strokeStyle = "black"
		ctx.fillRect(x-s, y-s, s*2, s)
		ctx.strokeRect(x-s, y-s, s*2, s)

	}
}

const checkPointInHexagon =(x, y, s, cX, cY)=>{
	if(pointWhichSide(x, y-s/2, x+s/2, y-s/4, cX, cY) != -1){return false;}
	if(pointWhichSide(x+s/2, y-s/4, x+s/2, y, cX, cY) != -1){return false;}
	if(pointWhichSide(x+s/2, y, x, y+s/4, cX, cY) != -1){return false;}
	if(pointWhichSide(x, y+s/4, x-s/2, y, cX, cY) != 1){return false;}
	if(pointWhichSide(x-s/2, y, x-s/2, y-s/4, cX, cY) != 1){return false;}
	if(pointWhichSide(x-s/2, y-s/4, x, y-s/2, cX, cY) != 1){return false;}
	return true;
}

const hexcoords =(x, y)=>{
	return {x: (y-x), y:(y+x)}
}
const strcoords =(x, y)=>{
	return (x.toString() + ":" + y.toString())
}

const pointWhichSide =(x1, y1, x2, y2, x3, y3)=>{
	if(y1 - y2 != 0){
		let x4 = (y3-y1)*(x1-x2)/(y1-y2)+x1
		if(x4 <= x3){
			return 1
		}else{
			return -1
		}
	}else{
		if(y3 >= y1){
			return 1
		}else{
			return -1
		}
	}
}

//terrain generation

var simplex = new SimplexNoise()
let krat = 40

//biomes
let T = {}

//objects
let O = {}

let basePosition = {x:0, y:0}

const getSimplex = (x, y)=>{
	return(simplex.noise2D(x/12, y/12))
}

const generateCell =(x, y)=>{
	T[strcoords(x, y)] = generationLogics(getSimplex(x, y)).T
	if(x == basePosition.x && y == basePosition.y){
		return 2
	}else{
		O[strcoords(x, y)] = generationLogics(getSimplex(x, y)).O
	}
}

const generationLogics =(x)=>{
	let R = {};
	if(x > 0){
		if(x*2+1 >= 1 && x*2+1 < 2){
			R.T = 1 //plains
		}else if(x*2+1 >= 2 && x*2+1 <= 3){
			R.T = 2 //mountains
		}else{
			R.T = 0
		}
		if(x*2+1 > 1 && x*2+1 < 1.25){
			R.T = 4 // beach
		}


		if(x*2+1 >= 1.25 && x*2+1 < 2  && Math.floor((x*2+1)*10000)%3==0){
			R.O = 1 // forest
		}
	}else{
		R.T = 0 // biome
		R.O = 0 // object
	}
	return R;
}

const generateStartingTerrain =()=>{
	for(let i=basePosition.x-Math.floor(krat/2); i<basePosition.x+Math.floor(krat/2); i++){
		for(let j=basePosition.y-Math.floor(krat/2); j<basePosition.y+Math.floor(krat/2); j++){

			T[strcoords(i, j)] = generationLogics(getSimplex(i, j)).T
			O[strcoords(i, j)] = generationLogics(getSimplex(i, j)).O

			// x*2+1  ->  1 - 3

		}
	}
}

generateStartingTerrain()

const nearObjects =(x, y, object, radius)=>{
	let count = 0;
	for(let i=x-radius; i<=x+radius; i++){
		for(let j=y-radius; j<=y+radius; j++){
			if(!(i==x-radius && j==y-radius) && !(i==x+radius && y+radius) && !(i==x && j==y)){
				if(O[strcoords(i, j)] == undefined){
					generateCell(i, j);
				}
				if(O[strcoords(i, j)] == object){
					count ++;
				}
			}
		}
	}
	return count;
}
const nearBiomes =(x, y, biome, radius)=>{
	let count = 0;
	for(let i=x-radius; i<=x+radius; i++){
		for(let j=y-radius; j<=y+radius; j++){
			if(!(i==x-radius && j==y-radius) && !(i==x+radius && y+radius) && !(i==x && j==y)){
				if(T[strcoords(i, j)] == undefined){
					generateCell(i, j);
				}
				if(T[strcoords(i, j)] == biome){
					count ++;
				}
			}
		}
	}
	return count;
}



while (true) {
	let X = basePosition.x
	let f = getSimplex(X, 0)
	if(f*2+1 >= 1.25 && f*2+1 < 2  && Math.floor((f*2+1)*10000)%3!=0){
		if(nearObjects(X, 0, 1, 1)>0 && nearBiomes(X, 0, 1, 1)>3){
			O[strcoords(basePosition.x, 0)] = 2 //main base
			break
		}
	}
	basePosition.x++;
}
console.log(strcoords(basePosition.x, 0))
let focus = {x:basePosition.x, y:basePosition.y-1}
let cursor = {x:basePosition.x, y:basePosition.y}
let tick = 0
let lastTick = 0
let time = Date.now()
let lastTime = 0
let scrollingOffset = {x:0, y:0}
let d = [1, 1]
let _W = window.innerWidth
let _H = window.innerHeight
let Clicked = false;
let clickX, clickY;

const loop=()=>{
	time = Date.now()
	_W = window.innerWidth
	_H = window.innerHeight
	let a = _H/krat*2

	let offsetH = _H/2-a*hexcoords(focus.x+scrollingOffset.x, focus.y+scrollingOffset.y).y-a*3/4
	let offsetW = _W/2-a*hexcoords(focus.x+scrollingOffset.x, focus.y+scrollingOffset.y).x-a

	tick += 1
	requestAnimationFrame(loop)
	c.width = _W
	c.height = _H

	//clear screen
	ctx.fillStyle = "#0000FF"
	ctx.fillRect(0, 0, _W, _H)

	//render Tarrain
	for(let i=Math.floor(focus.x + scrollingOffset.x)-Math.floor(krat/2); i<=Math.floor(focus.x + scrollingOffset.x)+Math.floor(krat/2); i++){
		for(let j=Math.floor(focus.y + scrollingOffset.y)-Math.floor(krat/2); j<=Math.floor(focus.y + scrollingOffset.y)+Math.floor(krat/2); j++){
			if (Clicked && checkPointInHexagon(offsetW+a*hexcoords(i, j).x, offsetH+a*hexcoords(i, j).y, a*2, clickX, clickY)){
				cursor.x = i
				cursor.y = j
				Clicked = false;
			}
			if(T[strcoords(i, j)] == 1){
				drawHexagon(offsetW+a*hexcoords(i, j).x, offsetH+a*hexcoords(i, j).y, a*2, "#19bf1e")
				//plains
			}else if(T[strcoords(i, j)] == 2){
				drawHexagon(offsetW+a*hexcoords(i, j).x, offsetH+a*hexcoords(i, j).y, a*2, "#2e8200")
				//mountains
			}else if(T[strcoords(i, j)] == 4){
				drawHexagon(offsetW+a*hexcoords(i, j).x, offsetH+a*hexcoords(i, j).y, a*2, "#d8eb02")
				//beach
			}


			if(O[strcoords(i, j)] == 1){
				drawObject(offsetW+a*hexcoords(i, j).x, offsetH+a*hexcoords(i, j).y, a/3, "forest")
				//forest
			}if(O[strcoords(i, j)] == 2){
				drawObject(offsetW+a*hexcoords(i, j).x, offsetH+a*hexcoords(i, j).y, a/2, "mainBase")
				//main base
			}

			if(T[strcoords(i, j)] == undefined || O[strcoords(i, j)] == undefined){
				generateCell(i, j)
			}
		}
	}
	drawHexagon(offsetW+a*hexcoords(cursor.x, cursor.y).x, offsetH+a*hexcoords(cursor.x, cursor.y).y, a*2, "black", "cursor")
}
//events


// let keys = {}
// document.addEventListener('keydown', keyDown);
// document.addEventListener('keyup', keyUp);
// function keyDown(e) {
// 	keys[e.code] = true
// }
// function keyUp(e) {
// 	keys[e.code] = null
// }


let isDragging = false;
let deltaX = 0;
let deltaY = 0;
let lastX = 0;
let lastY = 0;
window.addEventListener('mouseup', e => {
	isDragging = false;

	Clicked = false;
});

document.addEventListener('mousedown', e =>{
	if(e.button == 0){
		lastX = e.offsetX;
		lastY = e.offsetY;
		isDragging = true;
	}
})
document.addEventListener('mousemove', e => {
	if (isDragging == true) {
		deltaX = e.offsetX - lastX
		deltaY = e.offsetY - lastY
		lastX = e.offsetX;
		lastY = e.offsetY;
		scrollingOffset.x += -hexcoords(deltaX, deltaY).x/_H*krat/4
		scrollingOffset.y += -hexcoords(deltaX, deltaY).y/_H*krat/4
	}
});

document.addEventListener('wheel', e =>{
	if(e.deltaY<0){
		if(krat>20){
			krat = Math.floor(krat+e.deltaY * 0.1)
		}
	}else{
		if(krat<70){
			krat = Math.floor(krat+e.deltaY * 0.1)
		}
	}

})

document.addEventListener('contextmenu', e => {
    e.preventDefault();
    Clicked = true;
	clickX = e.offsetX;
	clickY = e.offsetY;
    return false;
}, false);


loop()
