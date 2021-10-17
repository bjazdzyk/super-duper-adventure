var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
let _W = window.innerWidth
let _H = window.innerHeight
c.width = _W
c.height = _H

let T = []
{
	const generate=(seedNum)=>{
		let T = []
		//let seedNum = Math.floor(Math.random()*10000000000)
		seedNum = seedNum%1000000000+1000000000
		let seed = seedNum.toString()
		while(seedNum.toString().includes('0')){
			seedNum = Math.floor(Math.random()*1000000000)
			seedNum = seedNum%1000000000+1000000000
			seed = seedNum.toString()
		}

		let seedSum = 0
		let copySeed = seedNum
		for(let i=0; i < seed.length; i++){
			seedSum += copySeed%10
			copySeed = (copySeed-(copySeed%10))/10
		}

		copySeed = seedNum
		let seed2Num = 0
		for(let i=0; i<seed.length; i++){
			seed2Num = seed2Num*10+seedSum%(copySeed%10)
			copySeed = (copySeed-(copySeed%10))/10
		}
		seed2Num = seed2Num%1000000000+1000000000
		let seed2 = seed2Num.toString()

		for(let i=0; i<seed.length; i++){
			T[i] = []
			for(let j=0; j<seed2.length; j++){
				T[i][j]=0
			}
			
			for(let j=0; j<seed[i].charCodeAt(0)-47; j++){
				T[i][j] += 1
			}
		}
		for(let i=0; i<seed2.length; i++){
			for(let j=0; j<seed2[i].charCodeAt(0)-47; j++){
				T[j][i] += 1
			}
		}
		//T[0][0] = 1
		return(T)
	}
	let T1 = generate(Math.floor(Math.random()*1000000000))
	let T2 = generate(Math.floor(Math.random()*1000000000))
	let T3 = generate(Math.floor(Math.random()*1000000000))
	let T4 = generate(Math.floor(Math.random()*1000000000))

	for(let i=0; i<30; i++){
		T[i] = []
	}


	let l = T1.length
	for(let i=0; i<l; i++){
		for(let j=0; j<l; j++){
			T[i+l/2+5][j+l/2+5] = T1[i][j]
		}
	}
	l = T2.length
	for(let i=0; i<l; i++){
		for(let j=0; j<l; j++){
			T[j+l/2+5][l/2-i+4] = T2[i][j]
		}
	}
	l = T3.length
	for(let i=0; i<l; i++){
		for(let j=0; j<l; j++){
			T[l/2-i+4][l/2-j+4] = T3[i][j]
		}
	}
	l = T4.length
	for(let i=0; i<l; i++){
		for(let j=0; j<l; j++){
			T[l/2-j+4][i+l/2+5] = T4[i][j]
		}
	}
}//terrain generation

let tick = 0
const loop=()=>{
	tick += 1
	requestAnimationFrame(loop)
	//clear screen
	ctx.fillStyle = "#0000FF"
	ctx.fillRect(0, 0, _W, _H)

	//render Tarrain
	for(let i=0; i<T.length; i++){
		for(let j=0; j<T[i].length; j++){
			let a = 30
			let offsetW = _W/2-10*a
			let offsetH = _H/2-10*a
			
			if(T[i][j] == 1){
				ctx.fillStyle = "#19bf1e"
				ctx.strokeStyle = "#000000"
				ctx.fillRect(j*a+offsetW, i*a+offsetH, a, a)
				ctx.strokeRect(j*a+offsetW, i*a+offsetH, a, a)
			}
			if(T[i][j] == 2){
				ctx.fillStyle = "darkgreen"
				ctx.strokeStyle = "#000000"
				ctx.fillRect(j*a+offsetW, i*a+offsetH, a, a)
				ctx.strokeRect(j*a+offsetW, i*a+offsetH, a, a)
			}
		}
	}

	}
loop()