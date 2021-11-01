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
	if(type = "forest"){
		ctx.fillStyle = "#4f2602"
		ctx.strokeStyle = "black"
		ctx.fillRect(x-s/2, y-s/2, s, s)
		ctx.strokeRect(x-s/2, y-s/2, s, s)

		ctx.fillStyle = "#248016"
		ctx.beginPath();
		ctx.arc(x, y-s*3/4, s, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
	} 
}

const coords =(x, y)=>{
	return {x: (y-x), y:(y+x)}
}

//terrain generation

var simplex = new SimplexNoise()
let krat = 50
console.log(simplex.noise2D(krat/2, krat/2))

const generate =()=>{
	//biomes
	let T = []
	for(let i=0; i<krat; i++){
		T[i] = []
	}
	//objects
	let O = []
	for(let i=0; i<krat; i++){
		O[i] = []
	}
	for(let i=0; i<krat; i++){
		for(let j=0; j<krat; j++){
			let x = simplex.noise2D(i/12, j/12)
			// x*2+1  ->  1 - 3
			if(x > 0){
				if(x*2+1 >= 1 && x*2+1 < 2){
					T[i][j] = 1 //plains
				}else if(x*2+1 >= 2 && x*2+1 <= 3){
					T[i][j] = 2
				}else{
					T[i][j] = 0
				}
				if(x*2+1 > 1 && x*2+1 < 1.25){
					T[i][j] = 4 // beach
				}


				if(x*2+1 > 1.6 && x*2+1 < 1.8){
					if(T[i][j] != 0){
						O[i][j] = 1 // forest
					}
				}
			}
		}
	}
	return {terrain: T, objects: O}
}



let T = generate().terrain
let O = generate().objects
let tick = 0
let lastTick = 0
let focus = {x:Math.floor(krat/2), y:Math.floor(krat/2)}
let cursor = {x:0, y:0}
let d = [1, 1]
const loop=()=>{
	tick += 1
	lastTick
	requestAnimationFrame(loop)
	if(tick-lastTick>3){
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

	let _W = window.innerWidth
	let _H = window.innerHeight
	c.width = _W
	c.height = _H
	let a = _H/krat*2

	let offsetH = _H/2-a*coords(focus.x, focus.y).y-a*3/4
	let offsetW = _W/2-a*coords(focus.x, focus.y).x-a

	//clear screen
	ctx.fillStyle = "#0000FF"
	ctx.fillRect(0, 0, _W, _H)

	//render Tarrain
	for(let i=0; i<T.length; i++){
		for(let j=0; j<T[i].length; j++){
			if(T[i][j] == 1){
				drawHexagon(offsetW+a*coords(i, j).x, offsetH+a*coords(i, j).y, a*2, "#19bf1e")
				//plains
			}
			if(T[i][j] == 2){
				drawHexagon(offsetW+a*coords(i, j).x, offsetH+a*coords(i, j).y, a*2, "darkgreen")
				//mountains
			}
			if(T[i][j] == 4){
				drawHexagon(offsetW+a*coords(i, j).x, offsetH+a*coords(i, j).y, a*2, "yellow")
				//beach
			}

			if(O[i][j] == 1){
				drawObject(offsetW+a*coords(i, j).x, offsetH+a*coords(i, j).y, 10, "forest")
				//forest
			}
		}
	}
	drawHexagon(_W/2+a*coords(cursor.x, cursor.y).x-a, _H/2+a*coords(cursor.x, cursor.y).y-a*3/4, a*2, "black", "cursor")
	
	
	
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
loop()