import * as THREE from 'https://threejs.org/build/three.module.js';
import {OrbitControls} from 'https://threejs.org/examples/jsm/controls/OrbitControls.js'

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
let _W = window.innerWidth
let _H = window.innerHeight
c.width = _W
c.height = _H
const generate=(seedNum)=>{
	let T = []
	//let seedNum = Math.floor(Math.random()*10000000000)
	seedNum = seedNum%10000000000+10000000000
	let seed = seedNum.toString()
	while(seedNum.toString().includes('0')){
		seedNum = Math.floor(Math.random()*10000000000)
		seedNum = seedNum%10000000000+10000000000
		seed = seedNum.toString()
		console.log(seedNum)
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
	seed2Num = seed2Num%10000000000+10000000000
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
	T[0][0] = 1
	return(T)
}
let T = generate(Math.floor(Math.random()*10000000000))


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
			if(T[i][j] == 1){
				ctx.fillStyle = "#19bf1e"
				ctx.strokeStyle = "#000000"
				ctx.fillRect(j*50+50, i*50+50, 50, 50)
				ctx.strokeRect(j*50+50, i*50+50, 50, 50)
			}
			if(T[i][j] == 2){
				ctx.fillStyle = "darkgreen"
				ctx.strokeStyle = "#000000"
				ctx.fillRect(j*50+50, i*50+50, 50, 50)
				ctx.strokeRect(j*50+50, i*50+50, 50, 50)
			}
		}
	}

	}
loop()