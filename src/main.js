
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
	}else if(type == "treasure"){
		ctx.fillStyle = "#4f2602"
		ctx.strokeStyle = "black"
		ctx.fillRect(x-s/2, y-s/2, s, s)
		ctx.strokeRect(x-s/2, y-s/2, s, s)
	}
}

const hexcoords =(x, y)=>{
	return {x: (y-x), y:(y+x)}
}
const strcoords =(x, y)=>{
	return (x.toString() + ":" + y.toString())
}


//terrain generation

var simplex = new SimplexNoise()
let krat = 40

//biomes
let T = {}

//objects
let O = {}

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
		R.T = 0
		R.O = 0
	}
	return R;
}

const generateStartingTerrain =()=>{
	for(let i=0; i<krat; i++){
		for(let j=0; j<krat; j++){

			T[strcoords(i, j)] = generationLogics(simplex.noise2D(i/12, j/12)).T
			O[strcoords(i, j)] = generationLogics(simplex.noise2D(i/12, j/12)).O

			// x*2+1  ->  1 - 3

		}
	}
}

const generateCell =(x, y)=>{
	T[strcoords(x, y)] = generationLogics(simplex.noise2D(x/12, y/12)).T
	O[strcoords(x, y)] = generationLogics(simplex.noise2D(x/12, y/12)).O
}

generateStartingTerrain()
console.log(T, O)
let tick = 0
let lastTick = 0
let focus = {x:Math.floor(krat/2), y:Math.floor(krat/2)}
let cursor = {x:Math.floor(krat/2), y:Math.floor(krat/2)}
let d = [1, 1]
let _W = window.innerWidth
let _H = window.innerHeight

const loop=()=>{

	_W = window.innerWidth
	_H = window.innerHeight
	let a = _H/krat*2

	let offsetH = _H/2-a*hexcoords(focus.x, focus.y).y-a*3/4
	let offsetW = _W/2-a*hexcoords(focus.x, focus.y).x-a

	tick += 1
	requestAnimationFrame(loop)
	if(tick-lastTick>=5){
		if(keys["ArrowLeft"]){
			lastTick = tick
			cursor.y -=1
			cursor.x +=1
		}if(keys["ArrowRight"]){
			lastTick = tick
			cursor.y +=1
			cursor.x -=1
		}if(keys["ArrowUp"]){
			lastTick = tick
			d[0]+=d[1]
			d[1] = 1
			cursor.x -= (d[0]+1)%2
			cursor.y -= d[0]%2

		}if(keys["ArrowDown"]){
			lastTick = tick
			d[0]+= 1+d[1]
			d[1] = 0
			cursor.x += (d[0]+1)%2
			cursor.y += d[0]%2
		}

	}
	if(tick%2==0){
		c.width = _W
		c.height = _H

		//clear screen
		ctx.fillStyle = "#0000FF"
		ctx.fillRect(0, 0, _W, _H)

		//render Tarrain
		for(let i=Math.floor(focus.x)-Math.floor(krat/2); i<=Math.floor(focus.x)+Math.floor(krat/2); i++){
			for(let j=Math.floor(focus.y)-Math.floor(krat/2); j<=Math.floor(focus.y)+Math.floor(krat/2); j++){
				if(T[strcoords(i, j)] == 1){
					drawHexagon(offsetW+a*hexcoords(i, j).x, offsetH+a*hexcoords(i, j).y, a*2, "#19bf1e")
					//plains
				}else if(T[strcoords(i, j)] == 2){
					drawHexagon(offsetW+a*hexcoords(i, j).x, offsetH+a*hexcoords(i, j).y, a*2, "#2e8200")
					//mountains
				}else if(T[strcoords(i, j)] == 4){
					drawHexagon(offsetW+a*hexcoords(i, j).x, offsetH+a*hexcoords(i, j).y, a*2, "#d8eb02")
					//beach
				}else if(T[strcoords(i, j)] == undefined){
					generateCell(i, j)
				}


				if(O[strcoords(i, j)] == 1){
					drawObject(offsetW+a*hexcoords(i, j).x, offsetH+a*hexcoords(i, j).y, a/3, "forest")
					//forest
				}
			}
		}
		drawHexagon(offsetW+a*hexcoords(cursor.x, cursor.y).x+a, offsetH+a*hexcoords(cursor.x, cursor.y).y+a, a*2, "black", "cursor")
	}



}
//events
let keys = {}
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
function keyDown(e) {
	keys[e.code] = true
}
function keyUp(e) {
	keys[e.code] = null
}


let isDragging = false;
let deltaX = 0;
let deltaY = 0;
let lastX = 0;
let lastY = 0;
window.addEventListener('mouseup', e => {
	isDragging = false;
});

document.addEventListener('mousedown', e =>{
	lastX = e.offsetX;
	lastY = e.offsetY;
	isDragging = true;
})
document.addEventListener('mousemove', e => {
	if (isDragging == true) {
		deltaX = e.offsetX - lastX
		deltaY = e.offsetY - lastY
		lastX = e.offsetX;
		lastY = e.offsetY;
		focus.x += -hexcoords(deltaX, deltaY).x/_H*krat/4
		focus.y += -hexcoords(deltaX, deltaY).y/_H*krat/4
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


loop()
