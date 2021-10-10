import * as THREE from 'https://threejs.org/build/three.module.js';
import {OrbitControls} from 'https://threejs.org/examples/jsm/controls/OrbitControls.js'

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
let _W = window.innerWidth
let _H = window.innerHeight
c.width = _W
c.height = _H
let Terrain = [[1, 1, 1, 1, 1],
	[1, 1, 1, 1],
	[1, 1, 1, 1, 1],
	[1, 1, 1],
	[1],
	[1]]

let tick = 0
const loop=()=>{
	tick += 1
	requestAnimationFrame(loop)
	//clear screen
	ctx.fillStyle = "#0000FF"
	ctx.fillRect(0, 0, _W, _H)

	//render Tarrain
	for(let i=0; i<Terrain.length; i++){
		for(let j=0; j<Terrain[i].length; j++){
			if(Terrain[i][j] == 1){
				ctx.fillStyle = "#19bf1e"
				ctx.strokeStyle = "#000000"
				ctx.fillRect(j*50, i*50, 50, 50)
				ctx.strokeRect(j*50, i*50, 50, 50)
			}
		}
	}

	}
loop()