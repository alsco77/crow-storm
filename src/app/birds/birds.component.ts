import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Three, CanvasRenderer, Projector } from 'three/build/three.js';
import * as Stats from 'three/examples/js/libs/stats.min.js';

@Component({
  selector: 'app-birds',
  templateUrl: './birds.component.html',
  styleUrls: ['./birds.component.css']
})
export class BirdsComponent implements OnInit {

  @ViewChild('container') container: ElementRef;

  Bird: any;
  Boid: any;

  constructor() {

  }

  ngOnInit() {
    this.setUpObjects();
    this.drawBirds(300);
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
    let stats;
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
      stats = new Stats();
      // document.getElementById('container').appendChild(stats.dom);
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
      stats.begin();
      render();
      stats.end();
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
