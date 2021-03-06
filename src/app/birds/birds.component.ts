import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

import { Three, CanvasRenderer, Projector } from 'three/build/three.js';
import * as Stats from 'three/examples/js/libs/stats.min.js';
import * as Detector from 'three/examples/js/Detector.js';
import 'three/examples/js/GPUComputationRenderer.js';

import { CommunicateService } from '../services/communicate.service';
import { AppState } from '../classes/app-state.enum';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-birds',
  templateUrl: './birds.component.html',
  styleUrls: ['./birds.component.css']
})
export class BirdsComponent implements AfterViewInit, OnDestroy {

  @ViewChild('container') container: ElementRef;

  Bird: any;
  Boid: any;

  terminalSubscription: Subscription;
  mouseInterval: any;

  constructor(private comService: CommunicateService) {
    this.terminalSubscription = this.comService.appState$.subscribe((state: AppState) => {

        if (state == AppState.terminal) {
          clearInterval(this.mouseInterval);
          this.mouseInterval = setInterval(() => {
            document.dispatchEvent(new MouseEvent('simulatemousemove'));
          }, 15)
        } else {
          clearInterval(this.mouseInterval);
        }
    })
  }

  ngOnDestroy(): void {
    this.terminalSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    if (!Detector.webgl) {
      Detector.addGetWebGLMessage();
    }
    /* TEXTURE WIDTH FOR SIMULATION */
    const WIDTH = 32;
    const BIRDS = WIDTH * WIDTH;
    // Custom Geometry - using 3 triangles each. No UVs, no normals currently.
    THREE.BirdGeometry = function () {
      const triangles = BIRDS * 3;
      const points = triangles * 3;
      THREE.BufferGeometry.call(this);
      const vertices = new THREE.BufferAttribute(new Float32Array(points * 3), 3);
      const birdColors = new THREE.BufferAttribute(new Float32Array(points * 3), 3);
      const references = new THREE.BufferAttribute(new Float32Array(points * 2), 2);
      const birdVertex = new THREE.BufferAttribute(new Float32Array(points), 1);
      this.addAttribute('position', vertices);
      this.addAttribute('birdColor', birdColors);
      this.addAttribute('reference', references);
      this.addAttribute('birdVertex', birdVertex);
      // this.addAttribute( 'normal', new Float32Array( points * 3 ), 3 );
      let v = 0;
      function verts_push(args: number[]) {
        for (let i = 0; i < args.length; i++) {
          vertices.array[v++] = args[i];
        }
      }
      const wingsSpan = 20;
      for (let f = 0; f < BIRDS; f++) {
        // Body
        verts_push([
          0, -0, -20,
          0, 4, -20,
          0, 0, 30
        ]);
        // Left Wing
        verts_push([
          0, 0, -15,
          -wingsSpan, 0, 0,
          0, 0, 15
        ]);
        // Right Wing
        verts_push([
          0, 0, 15,
          wingsSpan, 0, 0,
          0, 0, -15
        ]);
      }
      for (let v = 0; v < triangles * 3; v++) {
        const i = ~~(v / 3);
        const x = (i % WIDTH) / WIDTH;
        const y = ~~(i / WIDTH) / WIDTH;
        const c = new THREE.Color(
          0x000000 +
          ~~(v / 9) / BIRDS * 0x222222
        );
        birdColors.array[v * 3 + 0] = c.r;
        birdColors.array[v * 3 + 1] = c.g;
        birdColors.array[v * 3 + 2] = c.b;
        references.array[v * 2] = x;
        references.array[v * 2 + 1] = y;
        birdVertex.array[v] = v % 9;
      }
      this.scale(0.2, 0.2, 0.2);
    };

    THREE.BirdGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
    let camera, scene, renderer, geometry, i, h, color;
    let mouseX = 0, mouseY = 0;
    let mouseWiggle = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    const BOUNDS = 800, BOUNDS_HALF = BOUNDS / 2;
    function change(n) {
      location.hash = n;
      location.reload();
      return false;
    }
    let last = performance.now();
    let gpuCompute;
    let velocityVariable;
    let positionVariable;
    let positionUniforms;
    let velocityUniforms;
    let birdUniforms;
    const init = () => {
      camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 3000);
      camera.position.z = 350;
      scene = new THREE.Scene();
      // scene.background = new THREE.Color('rgba(2,50,0,0)');
      // scene.fog = new THREE.Fog(0xffffff, 100, 1000);
      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      renderer.domElement.id = 'crow-canvas';
      this.container.nativeElement.appendChild(renderer.domElement);
      initComputeRenderer();

      document.addEventListener('mousemove', onDocumentMouseMove, false);
      document.addEventListener('simulatemousemove', onDocumentSimulateMouseMove, false);
      document.addEventListener('touchstart', onDocumentTouchStart, false);
      document.addEventListener('touchmove', onDocumentTouchMove, false);
      //
      window.addEventListener('resize', onWindowResize, false);
      initBirds();
    };
    function initComputeRenderer() {
      gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer);
      const dtPosition = gpuCompute.createTexture();
      const dtVelocity = gpuCompute.createTexture();
      fillPositionTexture(dtPosition);
      fillVelocityTexture(dtVelocity);
      velocityVariable = gpuCompute.addVariable('textureVelocity',
        document.getElementById('fragmentShaderVelocity').textContent, dtVelocity);
      positionVariable = gpuCompute.addVariable('texturePosition',
        document.getElementById('fragmentShaderPosition').textContent, dtPosition);
      gpuCompute.setVariableDependencies(velocityVariable, [positionVariable, velocityVariable]);
      gpuCompute.setVariableDependencies(positionVariable, [positionVariable, velocityVariable]);
      positionUniforms = positionVariable.material.uniforms;
      velocityUniforms = velocityVariable.material.uniforms;
      positionUniforms.time = { value: 0.0 };
      positionUniforms.delta = { value: 0.0 };
      velocityUniforms.time = { value: 1.0 };
      velocityUniforms.delta = { value: 0.0 };
      velocityUniforms.testing = { value: 1.0 };
      velocityUniforms.seperationDistance = { value: 1.0 };
      velocityUniforms.alignmentDistance = { value: 1.0 };
      velocityUniforms.cohesionDistance = { value: 1.0 };
      velocityUniforms.freedomFactor = { value: 1.0 };
      velocityUniforms.predator = { value: new THREE.Vector3() };
      velocityVariable.material.defines.BOUNDS = BOUNDS.toFixed(2);
      velocityVariable.wrapS = THREE.RepeatWrapping;
      velocityVariable.wrapT = THREE.RepeatWrapping;
      positionVariable.wrapS = THREE.RepeatWrapping;
      positionVariable.wrapT = THREE.RepeatWrapping;
      const error = gpuCompute.init();
      if (error !== null) {
        console.error(error);
      }
    }
    function initBirds() {
      var geometry = new THREE.BirdGeometry();
      // For Vertex and Fragment
      birdUniforms = {
        color: { value: new THREE.Color(0xff2200) },
        texturePosition: { value: null },
        textureVelocity: { value: null },
        time: { value: 1.0 },
        delta: { value: 0.0 }
      };
      // ShaderMaterial
      var material = new THREE.ShaderMaterial({
        uniforms: birdUniforms,
        vertexShader: document.getElementById('birdVS').textContent,
        fragmentShader: document.getElementById('birdFS').textContent,
        side: THREE.DoubleSide
      });
      var birdMesh = new THREE.Mesh(geometry, material);
      birdMesh.rotation.y = Math.PI / 2;
      birdMesh.matrixAutoUpdate = false;
      birdMesh.updateMatrix();
      scene.add(birdMesh);
    }
    function fillPositionTexture(texture) {
      var theArray = texture.image.data;
      for (var k = 0, kl = theArray.length; k < kl; k += 4) {
        var x = Math.random() * BOUNDS - BOUNDS_HALF;
        var y = Math.random() * BOUNDS - BOUNDS_HALF;
        var z = Math.random() * BOUNDS - BOUNDS_HALF;
        theArray[k + 0] = x;
        theArray[k + 1] = y;
        theArray[k + 2] = z;
        theArray[k + 3] = 1;
      }
    }
    function fillVelocityTexture(texture) {
      var theArray = texture.image.data;
      for (var k = 0, kl = theArray.length; k < kl; k += 4) {
        var x = Math.random() - 0.5;
        var y = Math.random() - 0.5;
        var z = Math.random() - 0.5;
        theArray[k + 0] = x * 10;
        theArray[k + 1] = y * 10;
        theArray[k + 2] = z * 10;
        theArray[k + 3] = 1;
      }
    }
    function onWindowResize() {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    function onDocumentMouseMove(event) {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    }
    function onDocumentSimulateMouseMove() {
      switch(mouseWiggle){

        case 0:
          mouseX = 0;
          mouseY = 0;
          break;
        case 1:
          mouseX = 200;
          mouseY = 0;
          break;
        case 2:
          mouseX = 150;
          mouseY = -100;
          break;
        case 3:
          mouseX = 0;
          mouseY = -100;
          break;
        case 4:
          mouseX = -150;
          mouseY = -100;
          break;
        case 5:
          mouseX = -200;
          mouseY = 0;
          break;
        case 6:
          mouseX = -150;
          mouseY = 100;
          break;
        case 7:
          mouseX = 0;
          mouseY = 100;
          break;
        case 8:
          mouseX = 150;
          mouseY = 100;
          break;
        case 9:
          mouseX = 0;
          mouseY = 0;
          break;
      }
      mouseWiggle = (mouseWiggle + 1) % 10;
    }
    function onDocumentTouchStart(event) {
      if (event.touches.length === 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
      }
    }
    function onDocumentTouchMove(event) {
      if (event.touches.length === 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
      }
    }
    //
    function animate() {
      requestAnimationFrame(animate);
      render();
    }
    function render() {
      const now = performance.now();
      let delta = (now - last) / 1000;
      if (delta > 1) { delta = 1; } // safety cap on large deltas
      last = now;
      positionUniforms.time.value = now;
      positionUniforms.delta.value = delta;
      velocityUniforms.time.value = now;
      velocityUniforms.delta.value = delta;
      birdUniforms.time.value = now;
      birdUniforms.delta.value = delta;
      velocityUniforms.predator.value.set(0.5 * mouseX / windowHalfX, - 0.5 * mouseY / windowHalfY, 0);
      mouseX = 10000;
      mouseY = 10000;
      gpuCompute.compute();
      birdUniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget(positionVariable).texture;
      birdUniforms.textureVelocity.value = gpuCompute.getCurrentRenderTarget(velocityVariable).texture;
      renderer.render(scene, camera);
    }

    init();
    animate();
  }
}
