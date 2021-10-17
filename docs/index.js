var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");


var simplex = new SimplexNoise()
let krat = 50
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

	//render Tarrain
	for(let i=0; i<T.length; i++){
		for(let j=0; j<T[i].length; j++){
			let a = _W/krat
			let offsetW = 0
			let offsetH = 0
			
			if(T[i][j] == 1){
				ctx.fillStyle = "#19bf1e"
				ctx.strokeStyle = "#000000"
				ctx.fillRect(j*a+offsetW, i*a+offsetH, a, a)
				ctx.strokeRect(j*a+offsetW, i*a+offsetH, a, a)
			}
			if(T[i][j] >= 2){
				ctx.fillStyle = "darkgreen"
				ctx.strokeStyle = "#000000"
				ctx.fillRect(j*a+offsetW, i*a+offsetH, a, a)
				ctx.strokeRect(j*a+offsetW, i*a+offsetH, a, a)
			}
		}
	}

	}
loop()