var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

const drawHexagon =(x, y, s, color)=>{
	ctx.fillStyle = color
	ctx.strokeStyle = "#000000"
	ctx.beginPath()
	ctx.moveTo(x+s/2, y)
	ctx.lineTo(x+s, y+s/4)
	ctx.lineTo(x+s, y+s/2)
	ctx.lineTo(x+s/2, y+s*3/4)
	ctx.lineTo(x, y+s/2)
	ctx.lineTo(x, y+s/4)
	ctx.lineTo(x+s/2, y)
	ctx.closePath()
	ctx.fill()
	ctx.stroke()
}

//terrain generation
var simplex = new SimplexNoise()
let krat = 70
const generate =()=>{
	let T = []
	for(let i=0; i<krat; i++){
		T[i] = []
	}
	for(let i=0; i<krat; i++){
		for(let j=0; j<krat; j++){
			let x = simplex.noise2D(i/9, j/9)
			T[i][j] = Math.floor(x*2+1)
		}
	}
	return T
}



let T = generate()
console.log(T)

let tick = 0
const loop=()=>{
	let _W = window.innerWidth
	let _H = window.innerHeight
	c.width = _W
	c.height = _H
	tick += 1
	requestAnimationFrame(loop)
	//clear screen
	ctx.fillStyle = "#0000FF"
	ctx.fillRect(0, 0, _W, _H)

	let offsetH = -_H
	let offsetW = _W/2

	//render Tarrain
	for(let i=0; i<T.length; i++){
		for(let j=0; j<T[i].length; j++){
			let a = _W/krat
			
			if(T[i][j] == 1){
				drawHexagon(offsetW+a*(j-i), offsetH+a*(j+i), a*2, "#19bf1e")
			}
			if(T[i][j] >= 2){
				drawHexagon(offsetW+a*(j-i), offsetH+a*(j+i), a*2, "darkgreen")
			}
		}
	}

	}
loop()