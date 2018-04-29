import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { Three, CanvasRenderer, Projector } from 'three/build/three.js';
import * as Stats from 'three/examples/js/libs/stats.min.js';
import * as Detector from 'three/examples/js/Detector.js';
import 'three/examples/js/GPUComputationRenderer.js';

@Component({
  selector: 'app-birds',
  templateUrl: './birds.component.html',
  styleUrls: ['./birds.component.css']
})
export class BirdsComponent implements AfterViewInit {

  @ViewChild('container') container: ElementRef;

  Bird: any;
  Boid: any;

  constructor() {

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
      function verts_push() {
        for (let i = 0; i < arguments.length; i++) {
          vertices.array[v++] = arguments[i];
        }
      }
      const wingsSpan = 20;
      for (let f = 0; f < BIRDS; f++) {
        // Body
        verts_push(
          0, -0, -20,
          0, 4, -20,
          0, 0, 30
        );
        // Left Wing
        verts_push(
          0, 0, -15,
          -wingsSpan, 0, 0,
          0, 0, 15
        );
        // Right Wing
        verts_push(
          0, 0, 15,
          wingsSpan, 0, 0,
          0, 0, -15
        );
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
    // this.setUpObjects();
    // this.drawBirds(300);
  }

  setUpObjects() {
    this.Boid = function () {
      let vector = new THREE.Vector3(),
        _acceleration, _width = 800, _height = 500, _depth = 200, _goal, _avoidWalls = false;
      const _neighborhoodRadius = 100, _maxSpeed = 4, _maxSteerForce = 0.1;

      this.position = new THREE.Vector3();
      this.velocity = new THREE.Vector3();
      _acceleration = new THREE.Vector3();

      this.setGoal = function (target) {
        _goal = target;
      };
      this.setAvoidWalls = function (value) {
        _avoidWalls = value;
      };
      this.setWorldSize = function (width, height, depth) {
        _width = width;
        _height = height;
        _depth = depth;
      };
      this.run = function (boids) {
        if (_avoidWalls) {
          vector.set(- _width, this.position.y, this.position.z);
          vector = this.avoid(vector);
          vector.multiplyScalar(5);
          _acceleration.add(vector);
          vector.set(_width, this.position.y, this.position.z);
          vector = this.avoid(vector);
          vector.multiplyScalar(5);
          _acceleration.add(vector);
          vector.set(this.position.x, - _height, this.position.z);
          vector = this.avoid(vector);
          vector.multiplyScalar(5);
          _acceleration.add(vector);
          vector.set(this.position.x, _height, this.position.z);
          vector = this.avoid(vector);
          vector.multiplyScalar(5);
          _acceleration.add(vector);
          vector.set(this.position.x, this.position.y, - _depth);
          vector = this.avoid(vector);
          vector.multiplyScalar(5);
          _acceleration.add(vector);
          vector.set(this.position.x, this.position.y, _depth);
          vector = this.avoid(vector);
          vector.multiplyScalar(5);
          _acceleration.add(vector);
        }/* else {
          this.checkBounds();
        }
        */
        if (Math.random() > 0.5) {
          this.flock(boids);
        }
        this.move();
      };
      this.flock = function (boids) {
        if (_goal) {
          _acceleration.add(this.reach(_goal, 0.005));
        }
        _acceleration.add(this.alignment(boids));
        _acceleration.add(this.cohesion(boids));
        _acceleration.add(this.separation(boids));
      };
      this.move = function () {
        this.velocity.add(_acceleration);
        const l = this.velocity.length();
        if (l > _maxSpeed) {
          this.velocity.divideScalar(l / _maxSpeed);
        }
        this.position.add(this.velocity);
        _acceleration.set(0, 0, 0);
      };
      this.checkBounds = function () {
        if (this.position.x > _width) { this.position.x = - _width; }
        if (this.position.x < - _width) { this.position.x = _width; }
        if (this.position.y > _height) { this.position.y = - _height; }
        if (this.position.y < - _height) { this.position.y = _height; }
        if (this.position.z > _depth) { this.position.z = - _depth; }
        if (this.position.z < - _depth) { this.position.z = _depth; }
      };
      //
      this.avoid = function (target) {
        const steer = new THREE.Vector3();
        steer.copy(this.position);
        steer.sub(target);
        steer.multiplyScalar(1 / this.position.distanceToSquared(target));
        return steer;
      };
      this.repulse = function (target) {
        const distance = this.position.distanceTo(target);
        if (distance < 150) {
          const steer = new THREE.Vector3();
          steer.subVectors(this.position, target);
          steer.multiplyScalar(0.5 / distance);
          _acceleration.add(steer);
        }
      };
      this.reach = function (target, amount) {
        const steer = new THREE.Vector3();
        steer.subVectors(target, this.position);
        steer.multiplyScalar(amount);
        return steer;
      };
      this.alignment = function (boids) {
        let count = 0;
        const velSum = new THREE.Vector3();
        for (let i = 0, il = boids.length; i < il; i++) {
          if (Math.random() > 0.6) { continue; }
          const boid = boids[i];
          const distance = boid.position.distanceTo(this.position);
          if (distance > 0 && distance <= _neighborhoodRadius) {
            velSum.add(boid.velocity);
            count++;
          }
        }
        if (count > 0) {
          velSum.divideScalar(count);
          const l = velSum.length();
          if (l > _maxSteerForce) {
            velSum.divideScalar(l / _maxSteerForce);
          }
        }
        return velSum;
      };
      this.cohesion = function (boids) {
        let count = 0;
        const posSum = new THREE.Vector3();
        const steer = new THREE.Vector3();
        for (let i = 0, il = boids.length; i < il; i++) {
          if (Math.random() > 0.6) { continue; }
          const boid = boids[i];
          const distance = boid.position.distanceTo(this.position);
          if (distance > 0 && distance <= _neighborhoodRadius) {
            posSum.add(boid.position);
            count++;
          }
        }
        if (count > 0) {
          posSum.divideScalar(count);
        }
        steer.subVectors(posSum, this.position);
        const l = steer.length();
        if (l > _maxSteerForce) {
          steer.divideScalar(l / _maxSteerForce);
        }
        return steer;
      };
      this.separation = function (boids) {
        const posSum = new THREE.Vector3();
        const repulse = new THREE.Vector3();
        for (let i = 0, il = boids.length; i < il; i++) {
          if (Math.random() > 0.6) { continue; }
          const boid = boids[i];
          const distance = boid.position.distanceTo(this.position);
          if (distance > 0 && distance <= _neighborhoodRadius) {
            repulse.subVectors(this.position, boid.position);
            repulse.normalize();
            repulse.divideScalar(distance);
            posSum.add(repulse);
          }
        }
        return posSum;
      };
    };

    this.Bird = function () {
      const scope = this;
      THREE.Geometry.call(this);
      v(10, 0, 0);
      v(- 10, - 4, 2);
      v(- 10, 0, 0);
      v(- 10, - 4, - 2);
      v(0, 4, - 12);
      v(0, 4, 12);
      v(4, 0, 0);
      v(- 6, 0, 0);
      f3(0, 2, 1);
      f3(4, 7, 6);
      f3(5, 6, 7);

      this.computeFaceNormals();

      function v(x, y, z) {
        scope.vertices.push(new THREE.Vector3(x, y, z));
      }

      function f3(a, b, c) {
        scope.faces.push(new THREE.Face3(a, b, c));
      }
    };

    this.Bird.prototype = Object.create(THREE.Geometry.prototype);
    this.Bird.prototype.constructor = this.Bird;
  }


  drawBirds(number: number) {
    const SCREEN_WIDTH = window.innerWidth,
      SCREEN_HEIGHT = window.innerHeight,
      SCREEN_WIDTH_HALF = SCREEN_WIDTH / 2,
      SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;
    let camera, scene, renderer,
      birds, bird;
    let boid, boids;
    const init = () => {
      camera = new THREE.PerspectiveCamera(50, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
      camera.position.z = 450;
      scene = new THREE.Scene();
      birds = [];
      boids = [];
      for (let i = 0; i < number; i++) {
        boid = boids[i] = new this.Boid();
        boid.position.x = Math.random() * 400 - 200;
        boid.position.y = Math.random() * 400 - 200;
        boid.position.z = Math.random() * 400 - 200;
        boid.velocity.x = Math.random() * 2 - 1;
        boid.velocity.y = Math.random() * 2 - 1;
        boid.velocity.z = Math.random() * 2 - 1;
        boid.setAvoidWalls(true);
        boid.setWorldSize(800, 300, 400);
        bird = birds[i] = new THREE.Mesh(new this.Bird(), new THREE.MeshBasicMaterial(
          { color: Math.random() * 0xffffff, side: THREE.DoubleSide }));
        bird.phase = Math.floor(Math.random() * 62.83);
        scene.add(bird);
      }
      renderer = new THREE.CanvasRenderer({ alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT + 300);
      renderer.domElement.id = 'crow-canvas';

      renderer.setClearColor(0x00ff00, 0);
      document.addEventListener('mousemove', onDocumentMouseMove, false);
      // document.body.appendChild(renderer.domElement);
      this.container.nativeElement.appendChild(renderer.domElement);
      window.addEventListener('resize', onWindowResize, false);
    };

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentMouseMove(event) {
      const vector = new THREE.Vector3(event.clientX - SCREEN_WIDTH_HALF, - event.clientY + SCREEN_HEIGHT_HALF, 0);
      for (let i = 0, il = boids.length; i < il; i++) {
        boid = boids[i];
        vector.z = boid.position.z;
        boid.repulse(vector);
      }
    }
    //
    const animate = () => {
      requestAnimationFrame(animate);
      render();
    };
    function render() {
      for (let i = 0, il = birds.length; i < il; i++) {
        boid = boids[i];
        boid.run(boids);
        bird = birds[i];
        bird.position.copy(boids[i].position);
        const color = bird.material.color;
        color.r = color.g = color.b = (500 - bird.position.z) / 1000;
        bird.rotation.y = Math.atan2(- boid.velocity.z, boid.velocity.x);
        bird.rotation.z = Math.asin(boid.velocity.y / boid.velocity.length());
        bird.phase = (bird.phase + (Math.max(0, bird.rotation.z) + 0.1)) % 62.83;
        bird.geometry.vertices[5].y = bird.geometry.vertices[4].y = Math.sin(bird.phase) * 5;
      }
      renderer.render(scene, camera);
    }

    init();
    animate();
  }

}
