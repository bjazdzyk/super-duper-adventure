import * as THREE from 'https://threejs.org/build/three.module.js';
import {OrbitControls} from 'https://threejs.org/examples/jsm/controls/OrbitControls.js'

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
let _W = window.innerWidth
let _H = window.innerHeight
c.width = _W
c.height = _H
ctx.moveTo(0, 0);
ctx.lineTo(_W, _H);
ctx.stroke();