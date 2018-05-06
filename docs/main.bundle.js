webpackJsonp(["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/***/ (function(module, exports) {

module.exports = "\n.gradient-button {\n    background: -webkit-linear-gradient(-45deg,#f761a1 0,#8c1bab 100%);\n    color: #fff;\n    letter-spacing: .5px;\n    font-size: 14px;\n    height: 42px;\n    width:120px;\n    -webkit-box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);\n            box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);\n}\n\n.button-container{\n    text-align:center;\n    margin-top:20px;\n}\n"

/***/ }),

/***/ "./src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<!-- Background -->\n<div id=\"container\">\n  <app-backdrop></app-backdrop>\n  <app-birds></app-birds>\n  <app-crow-balance></app-crow-balance>\n</div>\n\n<!-- Title -->\n<div id=\"title-container\" class=\"animated\" [ngClass]=\"{'bounceOutUp': terminalOpen, 'bounceInDown': bounceIn}\">\n  <span id=\"title\"></span>\n  <br/>\n  <span id=\"subtitle\"></span>\n  <br/>\n  <div class=\"button-container\">\n    <button mat-button (click)=\"openTerminal()\" *ngIf=\"showButton\"  class=\"gradient-button animated bounceInUp\">\n      LETS GO\n    </button>\n  </div>\n</div>\n\n\n<!-- Console -->\n<app-terminal id=\"terminal-container\" *ngIf=\"terminalOpen && bounceInTerminal\" class=\"animated zoomIn\">\n</app-terminal>\n\n\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_services_communicate_service__ = __webpack_require__("./src/app/services/communicate.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_typed_js__ = __webpack_require__("./node_modules/typed.js/lib/typed.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_typed_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_typed_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__classes_app_state_enum__ = __webpack_require__("./src/app/classes/app-state.enum.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AppComponent = /** @class */ (function () {
    function AppComponent(comService) {
        this.comService = comService;
        this.terminalOpen = false;
        this.bounceIn = false;
        this.bounceInTerminal = false;
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (localStorage.getItem('hasOpened') === 'true') {
            setTimeout(function () {
                _this.showButton = true;
            }, 1000);
        }
        this.initTitle();
        this.terminalSubscription = this.comService.appState$.subscribe(function (state) {
            if (state == __WEBPACK_IMPORTED_MODULE_3__classes_app_state_enum__["a" /* AppState */].terminal || state == __WEBPACK_IMPORTED_MODULE_3__classes_app_state_enum__["a" /* AppState */].game) {
                _this.terminalOpen = true;
            }
            else {
                if (_this.terminalOpen) {
                    _this.bounceIn = true;
                    _this.bounceInTerminal = false;
                    _this.terminalOpen = false;
                }
            }
        });
    };
    AppComponent.prototype.ngOnDestroy = function () {
        this.terminalSubscription.unsubscribe();
    };
    AppComponent.prototype.initTitle = function () {
        var _this = this;
        this.title = new __WEBPACK_IMPORTED_MODULE_2_typed_js__('#title', {
            strings: ['<h4>CROW STORM</h4>'],
            typeSpeed: 110,
            backSpeed: 0,
            showCursor: false,
            loop: false,
            onComplete: function () {
                _this.subtitle = new __WEBPACK_IMPORTED_MODULE_2_typed_js__('#subtitle', {
                    strings: ['Melbourne is under attack from a storm of pesky crows!', 'Help get rid of them and earn some crow coins',
                        'Ka-kawwwwwww Ka-kawwwwwwww'],
                    typeSpeed: 30,
                    backSpeed: 30,
                    loop: true,
                    fadeOut: true,
                    onComplete: function () {
                        _this.showButton = true;
                    }
                });
            }
        });
    };
    AppComponent.prototype.openTerminal = function () {
        var _this = this;
        this.comService.setState(__WEBPACK_IMPORTED_MODULE_3__classes_app_state_enum__["a" /* AppState */].terminal);
        setTimeout(function () {
            _this.bounceInTerminal = true;
        }, 500);
        localStorage.setItem('hasOpened', 'true');
    };
    AppComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-root',
            template: __webpack_require__("./src/app/app.component.html"),
            styles: [__webpack_require__("./src/app/app.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__app_services_communicate_service__["a" /* CommunicateService */]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("./node_modules/@angular/platform-browser/esm5/platform-browser.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser_animations__ = __webpack_require__("./node_modules/@angular/platform-browser/esm5/animations.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_material__ = __webpack_require__("./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_countup_js_angular2__ = __webpack_require__("./node_modules/countup.js-angular2/dist/bundles/countup.js-angular2.umd.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_countup_js_angular2___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_countup_js_angular2__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_angularfire2__ = __webpack_require__("./node_modules/angularfire2/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_angularfire2_firestore__ = __webpack_require__("./node_modules/angularfire2/firestore/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__environments_environment__ = __webpack_require__("./src/environments/environment.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__services_services_module__ = __webpack_require__("./src/app/services/services.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__app_component__ = __webpack_require__("./src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__backdrop_backdrop_component__ = __webpack_require__("./src/app/backdrop/backdrop.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__birds_birds_component__ = __webpack_require__("./src/app/birds/birds.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__terminal_terminal_component__ = __webpack_require__("./src/app/terminal/terminal.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__classes_wei_to_eth_pipe__ = __webpack_require__("./src/app/classes/wei-to-eth.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__terminal_game_game_component__ = __webpack_require__("./src/app/terminal/game/game.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__crow_balance_crow_balance_component__ = __webpack_require__("./src/app/crow-balance/crow-balance.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

















var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_10__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_11__backdrop_backdrop_component__["a" /* BackdropComponent */],
                __WEBPACK_IMPORTED_MODULE_12__birds_birds_component__["a" /* BirdsComponent */],
                __WEBPACK_IMPORTED_MODULE_13__terminal_terminal_component__["a" /* TerminalComponent */],
                __WEBPACK_IMPORTED_MODULE_14__classes_wei_to_eth_pipe__["a" /* WeiToEthPipe */],
                __WEBPACK_IMPORTED_MODULE_15__terminal_game_game_component__["a" /* GameComponent */],
                __WEBPACK_IMPORTED_MODULE_16__crow_balance_crow_balance_component__["a" /* CrowBalanceComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_6_angularfire2__["a" /* AngularFireModule */].initializeApp(__WEBPACK_IMPORTED_MODULE_8__environments_environment__["a" /* environment */].firebase),
                __WEBPACK_IMPORTED_MODULE_7_angularfire2_firestore__["b" /* AngularFirestoreModule */],
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */],
                __WEBPACK_IMPORTED_MODULE_4__angular_material__["a" /* MatButtonModule */],
                __WEBPACK_IMPORTED_MODULE_4__angular_material__["b" /* MatIconModule */],
                __WEBPACK_IMPORTED_MODULE_9__services_services_module__["a" /* ServicesModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["c" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_5_countup_js_angular2__["CountUpModule"]
            ],
            providers: [],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_10__app_component__["a" /* AppComponent */]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/backdrop/backdrop.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/backdrop/backdrop.component.html":
/***/ (function(module, exports) {

module.exports = "\n  <canvas id=\"granim-canvas\"></canvas>\n"

/***/ }),

/***/ "./src/app/backdrop/backdrop.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BackdropComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_communicate_service__ = __webpack_require__("./src/app/services/communicate.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__classes_app_state_enum__ = __webpack_require__("./src/app/classes/app-state.enum.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_granim__ = __webpack_require__("./node_modules/granim/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_granim___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_granim__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var BackdropComponent = /** @class */ (function () {
    function BackdropComponent(comService) {
        this.comService = comService;
    }
    BackdropComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.granimInstance = new __WEBPACK_IMPORTED_MODULE_3_granim__({
            element: '#granim-canvas',
            direction: 'diagonal',
            opacity: [0.8, 0.8],
            stateTransitionSpeed: 2000,
            isPausedWhenNotInView: true,
            image: {
                source: 'assets/bg-forest.jpg',
                blendingMode: 'multiply',
                position: ['left', 'bottom'],
                stretchMode: ['stretch', 'stretch']
            },
            states: {
                'default-state': {
                    gradients: [
                        ['#42f4f4', '#274D25'],
                        // ['#80d3fe', '#7ea0c4']  // blue grey
                        ['#0963A2', '#053F6B'] // blue light blue
                    ],
                    transitionSpeed: 10000
                },
                'terminal-state': {
                    gradients: [
                        // ['#93201D', '#420200'], // red, dark red
                        ['#f761a1', '#8c1bab'],
                    ],
                    transitionSpeed: 10000
                },
                'game-state': {
                    gradients: [
                        // ['#412A89', '#030202'], // dark purple, light grey
                        ['#DD6C0F', '#FFAB66'],
                        ['#C7342C', '#760600'] // red, dark red
                    ],
                    transitionSpeed: 10000
                },
            }
        });
        this.appStateSubscription = this.comService.appState$.subscribe(function (state) {
            if (state == __WEBPACK_IMPORTED_MODULE_2__classes_app_state_enum__["a" /* AppState */].terminal) {
                _this.granimInstance.changeState('terminal-state');
            }
            else if (state == __WEBPACK_IMPORTED_MODULE_2__classes_app_state_enum__["a" /* AppState */].game) {
                _this.granimInstance.changeState('game-state');
            }
            else if (state == __WEBPACK_IMPORTED_MODULE_2__classes_app_state_enum__["a" /* AppState */].home) {
                _this.granimInstance.changeState('default-state');
            }
        });
    };
    BackdropComponent.prototype.ngOnDestroy = function () {
        this.appStateSubscription.unsubscribe();
    };
    BackdropComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-backdrop',
            template: __webpack_require__("./src/app/backdrop/backdrop.component.html"),
            styles: [__webpack_require__("./src/app/backdrop/backdrop.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__services_communicate_service__["a" /* CommunicateService */]])
    ], BackdropComponent);
    return BackdropComponent;
}());



/***/ }),

/***/ "./src/app/birds/birds.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/birds/birds.component.html":
/***/ (function(module, exports) {

module.exports = "<div #container id=\"birds\"></div>\n"

/***/ }),

/***/ "./src/app/birds/birds.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BirdsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_three_examples_js_Detector_js__ = __webpack_require__("./node_modules/three/examples/js/Detector.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_three_examples_js_Detector_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_three_examples_js_Detector_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_three_examples_js_GPUComputationRenderer_js__ = __webpack_require__("./node_modules/three/examples/js/GPUComputationRenderer.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_three_examples_js_GPUComputationRenderer_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_three_examples_js_GPUComputationRenderer_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_communicate_service__ = __webpack_require__("./src/app/services/communicate.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__classes_app_state_enum__ = __webpack_require__("./src/app/classes/app-state.enum.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var BirdsComponent = /** @class */ (function () {
    function BirdsComponent(comService) {
        var _this = this;
        this.comService = comService;
        this.terminalSubscription = this.comService.appState$.subscribe(function (state) {
            if (state == __WEBPACK_IMPORTED_MODULE_4__classes_app_state_enum__["a" /* AppState */].terminal || state == __WEBPACK_IMPORTED_MODULE_4__classes_app_state_enum__["a" /* AppState */].game) {
                clearInterval(_this.mouseInterval);
                _this.mouseInterval = setInterval(function () {
                    document.dispatchEvent(new MouseEvent('simulatemousemove'));
                }, 10);
            }
            else {
                clearInterval(_this.mouseInterval);
            }
        });
    }
    BirdsComponent.prototype.ngOnDestroy = function () {
        this.terminalSubscription.unsubscribe();
    };
    BirdsComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (!__WEBPACK_IMPORTED_MODULE_1_three_examples_js_Detector_js__["webgl"]) {
            __WEBPACK_IMPORTED_MODULE_1_three_examples_js_Detector_js__["addGetWebGLMessage"]();
        }
        /* TEXTURE WIDTH FOR SIMULATION */
        var WIDTH = 32;
        var BIRDS = WIDTH * WIDTH;
        // Custom Geometry - using 3 triangles each. No UVs, no normals currently.
        THREE.BirdGeometry = function () {
            var triangles = BIRDS * 3;
            var points = triangles * 3;
            THREE.BufferGeometry.call(this);
            var vertices = new THREE.BufferAttribute(new Float32Array(points * 3), 3);
            var birdColors = new THREE.BufferAttribute(new Float32Array(points * 3), 3);
            var references = new THREE.BufferAttribute(new Float32Array(points * 2), 2);
            var birdVertex = new THREE.BufferAttribute(new Float32Array(points), 1);
            this.addAttribute('position', vertices);
            this.addAttribute('birdColor', birdColors);
            this.addAttribute('reference', references);
            this.addAttribute('birdVertex', birdVertex);
            // this.addAttribute( 'normal', new Float32Array( points * 3 ), 3 );
            var v = 0;
            function verts_push(args) {
                for (var i_1 = 0; i_1 < args.length; i_1++) {
                    vertices.array[v++] = args[i_1];
                }
            }
            var wingsSpan = 20;
            for (var f = 0; f < BIRDS; f++) {
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
            for (var v_1 = 0; v_1 < triangles * 3; v_1++) {
                var i_2 = ~~(v_1 / 3);
                var x = (i_2 % WIDTH) / WIDTH;
                var y = ~~(i_2 / WIDTH) / WIDTH;
                var c = new THREE.Color(0x000000 +
                    ~~(v_1 / 9) / BIRDS * 0x222222);
                birdColors.array[v_1 * 3 + 0] = c.r;
                birdColors.array[v_1 * 3 + 1] = c.g;
                birdColors.array[v_1 * 3 + 2] = c.b;
                references.array[v_1 * 2] = x;
                references.array[v_1 * 2 + 1] = y;
                birdVertex.array[v_1] = v_1 % 9;
            }
            this.scale(0.2, 0.2, 0.2);
        };
        THREE.BirdGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
        var camera, scene, renderer, geometry, i, h, color;
        var mouseX = 0, mouseY = 0;
        var mouseWiggle = 0;
        var windowHalfX = window.innerWidth / 2;
        var windowHalfY = window.innerHeight / 2;
        var BOUNDS = 800, BOUNDS_HALF = BOUNDS / 2;
        function change(n) {
            location.hash = n;
            location.reload();
            return false;
        }
        var last = performance.now();
        var gpuCompute;
        var velocityVariable;
        var positionVariable;
        var positionUniforms;
        var velocityUniforms;
        var birdUniforms;
        var init = function () {
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
            _this.container.nativeElement.appendChild(renderer.domElement);
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
            var dtPosition = gpuCompute.createTexture();
            var dtVelocity = gpuCompute.createTexture();
            fillPositionTexture(dtPosition);
            fillVelocityTexture(dtVelocity);
            velocityVariable = gpuCompute.addVariable('textureVelocity', document.getElementById('fragmentShaderVelocity').textContent, dtVelocity);
            positionVariable = gpuCompute.addVariable('texturePosition', document.getElementById('fragmentShaderPosition').textContent, dtPosition);
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
            var error = gpuCompute.init();
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
            switch (mouseWiggle) {
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
            var now = performance.now();
            var delta = (now - last) / 1000;
            if (delta > 1) {
                delta = 1;
            } // safety cap on large deltas
            last = now;
            positionUniforms.time.value = now;
            positionUniforms.delta.value = delta;
            velocityUniforms.time.value = now;
            velocityUniforms.delta.value = delta;
            birdUniforms.time.value = now;
            birdUniforms.delta.value = delta;
            velocityUniforms.predator.value.set(0.5 * mouseX / windowHalfX, -0.5 * mouseY / windowHalfY, 0);
            mouseX = 10000;
            mouseY = 10000;
            gpuCompute.compute();
            birdUniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget(positionVariable).texture;
            birdUniforms.textureVelocity.value = gpuCompute.getCurrentRenderTarget(velocityVariable).texture;
            renderer.render(scene, camera);
        }
        init();
        animate();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('container'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"])
    ], BirdsComponent.prototype, "container", void 0);
    BirdsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-birds',
            template: __webpack_require__("./src/app/birds/birds.component.html"),
            styles: [__webpack_require__("./src/app/birds/birds.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__services_communicate_service__["a" /* CommunicateService */]])
    ], BirdsComponent);
    return BirdsComponent;
}());



/***/ }),

/***/ "./src/app/classes/app-state.enum.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppState; });
var AppState;
(function (AppState) {
    AppState["home"] = "Home";
    AppState["terminal"] = "Terminal";
    AppState["game"] = "Game";
})(AppState || (AppState = {}));


/***/ }),

/***/ "./src/app/classes/command.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Command; });
var Command = /** @class */ (function () {
    function Command(command) {
        this.containsCommand = command !== null;
        this.command = command;
    }
    return Command;
}());



/***/ }),

/***/ "./src/app/classes/web3-loading-status.enum.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Web3LoadingStatus; });
var Web3LoadingStatus;
(function (Web3LoadingStatus) {
    Web3LoadingStatus["inProgress"] = "Wallet loading is in progress";
    Web3LoadingStatus["noMetaMask"] = "MetaMask is not connected. Console needs MetaMask in order to give you Crow Coins";
    Web3LoadingStatus["noAccountsAvailable"] = "MetaMask is not unlocked or there are no accounts available.\n Load MetaMask and type 'checkconnection' to try again";
    Web3LoadingStatus["wrongNetwork"] = "Your MetaMask is connected to the wrong Network.\n Console needs access to the Ropsten network in order to give you Crow Coins";
    Web3LoadingStatus["error"] = "Something went wrong when connecting to your MetMask wallet";
    // newAccount = "New MetaMask account loaded",
    Web3LoadingStatus["complete"] = "Console has successfully connected to your MetaMask wallet";
})(Web3LoadingStatus || (Web3LoadingStatus = {}));


/***/ }),

/***/ "./src/app/classes/wei-to-eth.pipe.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WeiToEthPipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var Web3 = __webpack_require__("./node_modules/web3/src/index.js");
var WeiToEthPipe = /** @class */ (function () {
    function WeiToEthPipe() {
    }
    WeiToEthPipe.prototype.transform = function (wei, args) {
        // const weiString = Web3.utils.toBN(Web3.utils.toHex(wei)).toString();
        return Web3.utils.fromWei(wei, 'ether');
    };
    WeiToEthPipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Pipe"])({
            name: 'weiToEth'
        })
    ], WeiToEthPipe);
    return WeiToEthPipe;
}());



/***/ }),

/***/ "./src/app/crow-balance/crow-balance.component.css":
/***/ (function(module, exports) {

module.exports = "#crowCoinBalance {\n  position: fixed;\n  bottom: 10px;\n  right: 70px;\n  z-index: 50;\n  display: inline-table;\n}\n\n#crowCoinBalance div {\n    display: inline-block;\n}\n\n#balance {\n    line-height: 60px; \n    font-size: 24px;\n    margin-right: 10px;\n    color: #f0f0f0;\n    font-family: 'Catamaran', sans-serif;\n}\n\n#crowCoin {\n  -webkit-transform-style: preserve-3d;\n  -webkit-animation: spin 3s infinite linear;\n  width: 60px;\n  height: 60px;\n  position: absolute;\n  line-height: 60px;\n  background-image: url('/assets/crowCoin.png');\n  background-size: 60px;\n}\n\n@-webkit-keyframes spin {\n  0% {\n    -webkit-transform: rotateY(0deg);\n  }\n  100% {\n    -webkit-transform: rotateY(740deg);\n  }\n}\n"

/***/ }),

/***/ "./src/app/crow-balance/crow-balance.component.html":
/***/ (function(module, exports) {

module.exports = "<div id=\"crowCoinBalance\" *ngIf=\"terminalIsOpen && crowBalance\" class=\"animated bounceInUp\" [ngClass]=\"{'bounceOutDown' : !terminalIsOpen}\" title=\"Crow Coins\">\n  <div id=\"balance\" *ngIf=\"terminalIsOpen && crowBalance\" countUp  duration=\"10\" [startVal]=\"0\" [endVal]=\"crowBalance\">\n    <!-- {{crowBalance | weiToEth}} x -->\n  </div>\n  <div id=\"crowCoin\">\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/crow-balance/crow-balance.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CrowBalanceComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_web3_service__ = __webpack_require__("./src/app/services/web3.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_communicate_service__ = __webpack_require__("./src/app/services/communicate.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__classes_web3_loading_status_enum__ = __webpack_require__("./src/app/classes/web3-loading-status.enum.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__classes_app_state_enum__ = __webpack_require__("./src/app/classes/app-state.enum.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





var CrowBalanceComponent = /** @class */ (function () {
    function CrowBalanceComponent(service, comService) {
        var _this = this;
        this.service = service;
        this.comService = comService;
        this.terminalIsOpen = false;
        this.isLoaded = false;
        this.web3Subscription = this.service.web3Status$.subscribe(function (status) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (status == __WEBPACK_IMPORTED_MODULE_3__classes_web3_loading_status_enum__["a" /* Web3LoadingStatus */].complete) {
                    this.accountSubscription = this.service.account$.subscribe(function (acc) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        var crowBalanceWei, crowBalanceString;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(acc != undefined)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, this.service.getTokenBalanceAsync()];
                                case 1:
                                    crowBalanceWei = _a.sent();
                                    return [4 /*yield*/, this.service.convertWeiToEth(crowBalanceWei)];
                                case 2:
                                    crowBalanceString = _a.sent();
                                    this.crowBalance = parseInt(crowBalanceString);
                                    this.coinsAddedSubscription = this.comService.coinsAdded$.subscribe(function (amount) {
                                        _this.crowBalance += amount;
                                    });
                                    return [3 /*break*/, 4];
                                case 3:
                                    this.coinsAddedSubscription.unsubscribe();
                                    this.crowBalance = null;
                                    _a.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                }
                else {
                    this.accountSubscription.unsubscribe();
                    this.coinsAddedSubscription.unsubscribe();
                    this.crowBalance = null;
                }
                return [2 /*return*/];
            });
        }); });
        this.appStateSubscription = this.comService.appState$.subscribe(function (state) {
            if (state == __WEBPACK_IMPORTED_MODULE_4__classes_app_state_enum__["a" /* AppState */].terminal || state == __WEBPACK_IMPORTED_MODULE_4__classes_app_state_enum__["a" /* AppState */].game) {
                setTimeout(function () {
                    _this.terminalIsOpen = true;
                }, 3000);
            }
            else {
                _this.terminalIsOpen = false;
            }
        });
        // this.isLoaded = true;
    }
    // async ngAfterViewInit() {
    // }
    CrowBalanceComponent.prototype.ngOnDestroy = function () {
        this.web3Subscription.unsubscribe();
        this.appStateSubscription.unsubscribe();
        this.accountSubscription.unsubscribe();
        this.coinsAddedSubscription.unsubscribe();
    };
    CrowBalanceComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-crow-balance',
            template: __webpack_require__("./src/app/crow-balance/crow-balance.component.html"),
            styles: [__webpack_require__("./src/app/crow-balance/crow-balance.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__services_web3_service__["b" /* Web3Service */], __WEBPACK_IMPORTED_MODULE_2__services_communicate_service__["a" /* CommunicateService */]])
    ], CrowBalanceComponent);
    return CrowBalanceComponent;
}());



/***/ }),

/***/ "./src/app/services/communicate.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CommunicateService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_BehaviorSubject__ = __webpack_require__("./node_modules/rxjs/_esm5/BehaviorSubject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__ = __webpack_require__("./node_modules/rxjs/_esm5/Subject.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CommunicateService = /** @class */ (function () {
    function CommunicateService() {
        this.appState = new __WEBPACK_IMPORTED_MODULE_1_rxjs_BehaviorSubject__["a" /* BehaviorSubject */](null);
        this.appState$ = this.appState.asObservable();
        this.coinsAdded = new __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__["a" /* Subject */]();
        this.coinsAdded$ = this.coinsAdded.asObservable();
    }
    CommunicateService.prototype.setState = function (state) {
        this.appState.next(state);
    };
    CommunicateService.prototype.addCoins = function (amount) {
        this.coinsAdded.next(amount);
    };
    CommunicateService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], CommunicateService);
    return CommunicateService;
}());



/***/ }),

/***/ "./src/app/services/firebase.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Actions */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FirebaseService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("./node_modules/@angular/http/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_firestore__ = __webpack_require__("./node_modules/angularfire2/firestore/index.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var Actions;
(function (Actions) {
    Actions["ACC_RETRIEVAL_PKEY"] = "Account_retrieved_via_public_key";
    Actions["TOKEN_PURCHASE_TX_CREATED"] = "Token_purchase_initialised";
    Actions["TOKEN_PURCHASE_TX_SENT"] = "Token_purchase_tx_sent";
    Actions["TOKEN_PURCHASE_SUCCESS"] = "Token_purchase_success";
    Actions["TOKEN_PURCHASE_ERROR"] = "Token_purchase_error";
    Actions["EXTERNAL_URL_CLICKED"] = "External_url_clicked";
})(Actions || (Actions = {}));
var FirebaseService = /** @class */ (function () {
    // coins = new BehaviorSubject<Coin[]>(null);
    // coins$ = this.coins.asObservable();
    function FirebaseService(http, db) {
        this.http = http;
        this.db = db;
        // db.collection<Coin>('coins').valueChanges().subscribe(res => {
        //   this.coins.next(res);
        // });
    }
    FirebaseService.prototype.logAction = function (userAddr, actionType, contents) {
        if (contents === void 0) { contents = {}; }
        var id = this.db.createId();
        var action = Object.assign({ id: id, userAddr: userAddr, action: actionType }, contents);
        console.log(JSON.stringify(action));
        this.db.collection('actions').doc(id).set(action);
    };
    FirebaseService.prototype.logAccountRetrieval = function (userAddr) {
        this.logAction(userAddr, Actions.ACC_RETRIEVAL_PKEY);
    };
    FirebaseService.prototype.logTokenPurchaseTxCreated = function (userAddr, transaction) {
        this.logAction(userAddr, Actions.TOKEN_PURCHASE_TX_CREATED, { transaction: transaction });
    };
    FirebaseService.prototype.logTokenPurchaseTxSent = function (userAddr, transactionHex) {
        this.logAction(userAddr, Actions.TOKEN_PURCHASE_TX_SENT, { transactionHex: transactionHex });
    };
    FirebaseService.prototype.logTokenPurchaseSuccess = function (userAddr, receipt) {
        this.logAction(userAddr, Actions.TOKEN_PURCHASE_SUCCESS, { receipt: receipt });
    };
    FirebaseService.prototype.logTokenPurchaseError = function (userAddr, error) {
        this.logAction(userAddr, Actions.TOKEN_PURCHASE_ERROR, { error: error });
    };
    FirebaseService.prototype.logExternalUrlClicked = function (userAddr, url) {
        this.logAction(userAddr, Actions.EXTERNAL_URL_CLICKED, { url: url });
    };
    FirebaseService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */], __WEBPACK_IMPORTED_MODULE_2_angularfire2_firestore__["a" /* AngularFirestore */]])
    ], FirebaseService);
    return FirebaseService;
}());



/***/ }),

/***/ "./src/app/services/services.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ServicesModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("./node_modules/@angular/common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__("./node_modules/@angular/http/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__web3_service__ = __webpack_require__("./src/app/services/web3.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__firebase_service__ = __webpack_require__("./src/app/services/firebase.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__communicate_service__ = __webpack_require__("./src/app/services/communicate.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils__ = __webpack_require__("./src/app/services/utils.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var ServicesModule = /** @class */ (function () {
    function ServicesModule() {
    }
    ServicesModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* HttpModule */]
            ],
            declarations: [],
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__firebase_service__["a" /* FirebaseService */],
                __WEBPACK_IMPORTED_MODULE_3__web3_service__["b" /* Web3Service */],
                __WEBPACK_IMPORTED_MODULE_6__utils__["a" /* Utils */],
                __WEBPACK_IMPORTED_MODULE_5__communicate_service__["a" /* CommunicateService */]
            ]
        })
    ], ServicesModule);
    return ServicesModule;
}());



/***/ }),

/***/ "./src/app/services/utils.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Utils; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var Web3 = __webpack_require__("./node_modules/web3/src/index.js");
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.prototype.prefixHex = function (hex) {
        return hex.substring(0, 2) === '0x' ? hex : '0x' + hex;
    };
    Utils.prototype.sanitizeHex = function (hex) {
        hex = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex;
        if (hex === '') {
            return '';
        }
        return '0x' + this.padLeftEven(hex);
    };
    Utils.prototype.padLeftEven = function (hex) {
        hex = hex.length % 2 !== 0 ? '0' + hex : hex;
        return hex;
    };
    Utils.prototype.getNakedAddress = function (address) {
        return address.toLowerCase().replace('0x', '');
    };
    Utils.prototype.getFunctionSignature = function (name) {
        return Web3.utils.sha3(name).substr(0, 10);
    };
    Utils.prototype.hexToDecimal = function (hex) {
        return parseInt(hex, 16);
    };
    Utils = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])()
    ], Utils);
    return Utils;
}());



/***/ }),

/***/ "./src/app/services/web3.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export TxInfo */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TxStatus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Web3Service; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_BehaviorSubject__ = __webpack_require__("./node_modules/rxjs/_esm5/BehaviorSubject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils__ = __webpack_require__("./src/app/services/utils.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__firebase_service__ = __webpack_require__("./src/app/services/firebase.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__communicate_service__ = __webpack_require__("./src/app/services/communicate.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__classes_web3_loading_status_enum__ = __webpack_require__("./src/app/classes/web3-loading-status.enum.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};






var Web3 = __webpack_require__("./node_modules/web3/src/index.js");
var Tx = __webpack_require__("./node_modules/ethereumjs-tx/es5/index.js");
// tslint:disable-next-line
var CrowdsaleAbi = [{ "constant": true, "inputs": [], "name": "rate", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "cap", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "weiRaised", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "capReached", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "wallet", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_beneficiary", "type": "address" }], "name": "buyTokens", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "token", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "_rate", "type": "uint256" }, { "name": "_cap", "type": "uint256" }, { "name": "_token", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "purchaser", "type": "address" }, { "indexed": true, "name": "beneficiary", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }, { "indexed": false, "name": "amount", "type": "uint256" }], "name": "TokenPurchase", "type": "event" }];
var TxInfo = /** @class */ (function () {
    function TxInfo(status, data) {
        this.status = status;
        this.data = data;
    }
    return TxInfo;
}());

var TxStatus;
(function (TxStatus) {
    TxStatus["hash"] = "hash";
    TxStatus["receipt"] = "receipt";
    TxStatus["confirmed"] = "confirmed";
    TxStatus["error"] = "error";
})(TxStatus || (TxStatus = {}));
var Web3Service = /** @class */ (function () {
    function Web3Service(utils, firebase, comService) {
        var _this = this;
        this.utils = utils;
        this.firebase = firebase;
        this.comService = comService;
        this.crowCoin = {
            contractAddress: "0xcab46d722ab70590d04b55ea27eb344ff806c0eb",
            id: "oasisCredit",
            name: "Oasis Credit",
            ratio: 8000,
            saleContractAddress: "0xd0cd15c52eef857928035e62db3410bbc1aad64b",
            symbol: "OCR"
        };
        this.web3Status = new __WEBPACK_IMPORTED_MODULE_1_rxjs_BehaviorSubject__["a" /* BehaviorSubject */](null);
        this.web3Status$ = this.web3Status.asObservable();
        this.account = new __WEBPACK_IMPORTED_MODULE_1_rxjs_BehaviorSubject__["a" /* BehaviorSubject */](null);
        this.account$ = this.account.asObservable();
        this.txStatus = new __WEBPACK_IMPORTED_MODULE_1_rxjs_BehaviorSubject__["a" /* BehaviorSubject */](null);
        this.txStatus$ = this.txStatus.asObservable();
        if (typeof web3 !== 'undefined') {
            this.web3js = new Web3(web3.currentProvider);
            this.isMetaMask = true;
            console.log("Web3Service: IsMetaMask");
            try {
                this.web3js.eth.net.getId().then(function (id) {
                    console.log("Web3Service: Network retrieved: ID= " + id);
                    switch (id) {
                        case 3:
                            _this.isRopsten = true;
                            console.log("Web3Service: Is Ropsten");
                            _this.web3js.eth.getAccounts().then(function (accs) {
                                console.log("Web3Service: Got accounts: " + JSON.stringify(accs));
                                if (accs[0]) {
                                    _this.account.next(accs[0]);
                                    _this.web3Status.next(__WEBPACK_IMPORTED_MODULE_5__classes_web3_loading_status_enum__["a" /* Web3LoadingStatus */].complete);
                                }
                                else {
                                    _this.account.next(accs[0]);
                                    _this.web3Status.next(__WEBPACK_IMPORTED_MODULE_5__classes_web3_loading_status_enum__["a" /* Web3LoadingStatus */].noAccountsAvailable);
                                }
                                _this.accountInterval = setInterval(function () {
                                    _this.checkAccountMetaMask();
                                }, 500);
                            });
                            return;
                        default:
                            // this.isRopsten = false;
                            _this.isRopsten = true;
                            console.log("Web3Service: Is Not Ropsten");
                            _this.web3Status.next(__WEBPACK_IMPORTED_MODULE_5__classes_web3_loading_status_enum__["a" /* Web3LoadingStatus */].wrongNetwork);
                            return;
                    }
                });
            }
            catch (e) {
                this.web3Status.next(__WEBPACK_IMPORTED_MODULE_5__classes_web3_loading_status_enum__["a" /* Web3LoadingStatus */].error);
            }
        }
        else {
            // this.setProvider(new Web3.providers.HttpProvider('https://ropsten.infura.io/'));
            this.web3Status.next(__WEBPACK_IMPORTED_MODULE_5__classes_web3_loading_status_enum__["a" /* Web3LoadingStatus */].noMetaMask);
        }
    }
    Web3Service.prototype.ngOnDestroy = function () {
        clearInterval(this.accountInterval);
    };
    Web3Service.prototype.checkAccountMetaMask = function () {
        var _this = this;
        this.web3js.eth.getAccounts().then(function (accs) {
            console.log("Web3Service: loadedaccounts: " + JSON.stringify(accs));
            if (accs[0] !== _this.account.value) {
                console.log("Web3Service: new account found: " + JSON.stringify(accs[0]));
                if (accs[0] != undefined) {
                    if (_this.web3Status.value != __WEBPACK_IMPORTED_MODULE_5__classes_web3_loading_status_enum__["a" /* Web3LoadingStatus */].complete) {
                        _this.web3Status.next(__WEBPACK_IMPORTED_MODULE_5__classes_web3_loading_status_enum__["a" /* Web3LoadingStatus */].complete);
                    }
                }
                else {
                    _this.web3Status.next(__WEBPACK_IMPORTED_MODULE_5__classes_web3_loading_status_enum__["a" /* Web3LoadingStatus */].noAccountsAvailable);
                }
                _this.account.next(accs[0]);
            }
        });
    };
    // setProvider(provider: any) {
    //   this.web3 = new Web3(provider);
    //   // this.currentProvider.next(provider.host);
    //   console.log(JSON.stringify(this.web3js.eth.accounts));
    // }
    // async getAccountFromPKeyAsync(pkey: string): Promise<EthAccount> {
    //   const acc = await this.web3js.eth.accounts.privateKeyToAccount(pkey);
    //   if (acc != null) {
    //     // this.authenticatedAccount.next(acc);
    //     this.firebase.logAccountRetrieval(acc.address);
    //   }
    //   return Promise.resolve(acc);
    // }
    Web3Service.prototype.getTokenBalanceAsync = function (tokenAddr, userAddress) {
        if (tokenAddr === void 0) { tokenAddr = this.crowCoin.contractAddress; }
        if (userAddress === void 0) { userAddress = this.account.value; }
        return __awaiter(this, void 0, void 0, function () {
            var parsedUserAddress, functionHash, contractData, balanceHex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parsedUserAddress = this.utils.getNakedAddress(userAddress);
                        functionHash = this.utils.getFunctionSignature('balanceOf(address)');
                        contractData = functionHash + '000000000000000000000000' + parsedUserAddress;
                        return [4 /*yield*/, this.web3js.eth.call({
                                to: tokenAddr,
                                data: contractData
                            })];
                    case 1:
                        balanceHex = _a.sent();
                        if (balanceHex) {
                            return [2 /*return*/, Promise.resolve(this.web3js.utils.toBN(balanceHex).toString())];
                        }
                        return [2 /*return*/, Promise.reject(null)];
                }
            });
        });
    };
    Web3Service.prototype.getEthBalanceAsync = function (userAddress) {
        if (userAddress === void 0) { userAddress = this.account.value; }
        return __awaiter(this, void 0, void 0, function () {
            var balance, tokens;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.web3js.eth.getBalance(userAddress)];
                    case 1:
                        balance = _a.sent();
                        if (balance) {
                            console.log(balance);
                            tokens = this.web3js.utils.toBN(balance).toString();
                            console.log('Eth Owned: ' + this.web3js.utils.fromWei(tokens, 'ether'));
                            return [2 /*return*/, Promise.resolve(tokens)];
                        }
                        return [2 /*return*/, Promise.reject(null)];
                }
            });
        });
    };
    Web3Service.prototype.estimateGasAsync = function (rawTransaction) {
        return __awaiter(this, void 0, void 0, function () {
            var gasCost;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.web3js.eth.estimateGas(rawTransaction)];
                    case 1:
                        gasCost = _a.sent();
                        console.log('Gascost: ' + gasCost);
                        return [2 /*return*/, Promise.resolve(gasCost)];
                }
            });
        });
    };
    Web3Service.prototype.getPurchaseTokensTransaction = function (userAddress, saleContractAddress, weiAmountHex, gasPriceGwei, gasLimit) {
        return __awaiter(this, void 0, void 0, function () {
            var contract, count, chainId, rawTransaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userAddress = this.utils.prefixHex(userAddress);
                        saleContractAddress = this.utils.prefixHex(saleContractAddress);
                        contract = new this.web3js.eth.Contract(CrowdsaleAbi, saleContractAddress, {
                            from: userAddress
                        });
                        return [4 /*yield*/, this.web3js.eth.getTransactionCount(userAddress)];
                    case 1:
                        count = _a.sent();
                        return [4 /*yield*/, this.web3js.eth.net.getId()];
                    case 2:
                        chainId = _a.sent();
                        rawTransaction = {
                            'from': userAddress,
                            'nonce': '0x' + count.toString(16),
                            'gasPrice': this.web3js.utils.toHex(gasPriceGwei * 1e9),
                            'gasLimit': this.web3js.utils.toHex(gasLimit),
                            'to': saleContractAddress,
                            'value': weiAmountHex,
                            'data': contract.methods.buyTokens(userAddress).encodeABI(),
                            'chainId': chainId
                        };
                        return [2 /*return*/, Promise.resolve(rawTransaction)];
                }
            });
        });
    };
    Web3Service.prototype.convertWeiToEth = function (wei) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.resolve(this.web3js.utils.fromWei(wei, 'ether'))];
            });
        });
    };
    Web3Service.prototype.purchaseTokensAsync = function (userAddress, amount, successCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var ethAmount, weiAmountHex, rawTransaction, gasLimit, receipt, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        userAddress = this.account.value;
                        ethAmount = (parseInt(amount) / this.crowCoin.ratio).toString();
                        weiAmountHex = this.web3js.utils.toHex(this.web3js.utils.toWei(ethAmount));
                        return [4 /*yield*/, this.getPurchaseTokensTransaction(userAddress, this.crowCoin.saleContractAddress, weiAmountHex, 91, 250000)];
                    case 1:
                        rawTransaction = _a.sent();
                        console.log('evaluating cost of tx:' + JSON.stringify(rawTransaction));
                        return [4 /*yield*/, this.estimateGasAsync(rawTransaction)];
                    case 2:
                        gasLimit = _a.sent();
                        return [4 /*yield*/, this.getPurchaseTokensTransaction(userAddress, this.crowCoin.saleContractAddress, weiAmountHex, 91, gasLimit)];
                    case 3:
                        rawTransaction = _a.sent();
                        console.log("Raw tx: \n" + JSON.stringify(rawTransaction, null, '\t'));
                        this.firebase.logTokenPurchaseTxCreated(userAddress, rawTransaction);
                        // userPrivKey = this.utils.getNakedAddress(userPrivKey);
                        // const privKey = new Buffer(userPrivKey, 'hex');
                        // const tx = new Tx(rawTransaction);
                        // tx = tx.sign();
                        // const serializedTxHex = tx.serialize().toString('hex');
                        // console.log(`Sending signed tx: ${serializedTxHex.toString('hex')}`);
                        // this.firebase.logTokenPurchaseTxSent(userAddress, serializedTxHex.toString('hex'));
                        this.txStatus.next(null);
                        return [4 /*yield*/, this.web3js.eth.sendTransaction(rawTransaction)
                                .on('transactionHash', function (hash) {
                                _this.txStatus.next(new TxInfo(TxStatus.hash, hash));
                            })
                                .on('receipt', function (receipt) {
                                _this.txStatus.next(new TxInfo(TxStatus.receipt, receipt.transactionHash));
                            })
                                .on('confirmation', function (confirmationNumber, receipt) {
                                if (confirmationNumber == 0) {
                                    _this.txStatus.next(new TxInfo(TxStatus.confirmed, receipt.transactionHash));
                                    _this.comService.addCoins(parseInt(amount));
                                }
                            })
                                .on('error', function () {
                                _this.txStatus.next(new TxInfo(TxStatus.error, null));
                            })];
                    case 4:
                        receipt = _a.sent();
                        //     , (error, hash) => {
                        //     console.log("send transaction:" + error);
                        //     console.log("send transaction:" + hash);
                        //     if(hash){
                        //       this.comService.addCoins(parseInt(amount));
                        //     }
                        // });  
                        // const receipt = await this.web3js.eth.sendSignedTransaction('0x' + serializedTxHex.toString('hex'))
                        //   .on('transactionHash', hash => {
                        //     successCallback(hash);
                        //   });F
                        // console.log(`Receipt: \n${JSON.stringify(receipt, null, '\t')}`);
                        // this.firebase.logTokenPurchaseSuccess(userAddress, JSON.stringify(receipt));
                        console.log("sending transaction receipt: " + JSON.stringify(receipt));
                        return [2 /*return*/, Promise.resolve(receipt)];
                    case 5:
                        e_1 = _a.sent();
                        this.firebase.logTokenPurchaseError(userAddress, JSON.stringify(e_1));
                        return [2 /*return*/, Promise.reject(null)];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Web3Service = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* Utils */], __WEBPACK_IMPORTED_MODULE_3__firebase_service__["a" /* FirebaseService */], __WEBPACK_IMPORTED_MODULE_4__communicate_service__["a" /* CommunicateService */]])
    ], Web3Service);
    return Web3Service;
}());



/***/ }),

/***/ "./src/app/terminal/game/game.component.css":
/***/ (function(module, exports) {

module.exports = "#gameCanvas {\n    /* background-color:rgba(0,0,0,0.8); */\n    background-image: url('/assets/backdropBlue.png');\n    /* background: none; */\n}\n\n#gameCanvas, #backgroundCanvas {\n    position: fixed;\n}\n\n/* #background{\n\n    background-image: url('/assets/backdrop.png');\n    content: \"\";\n    opacity: 0.5;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    right: 0;\n    position: absolute;\n    z-index: -1;   \n  } */\n\n#muteLink {\n    position: absolute;\n    top: 35px;\n    left: 10px;\n    color: #f0f0f0;\n}\n\n#gamecontainer {\n    height: 600px;\n}\n\n  \n  "

/***/ }),

/***/ "./src/app/terminal/game/game.component.html":
/***/ (function(module, exports) {

module.exports = "<div id=\"gamecontainer\">\n    <!-- <div id=\"background\"></div> -->\n    <!-- <canvas #backgroundCanvas id=\"backgroundCanvas\"></canvas> -->\n    <canvas #gameCanvas id=\"gameCanvas\"></canvas>\n  <a id=\"muteLink\" *ngIf=\"loaded && sounds != null\" href=\"#\" (click)=\"toggleMute()\">\n      <mat-icon *ngIf=\"sounds.mute\"><i class=\"material-icons\">volume_off</i></mat-icon>\n      <mat-icon *ngIf=\"!sounds.mute\"><i class=\"material-icons\">volume_ups</i></mat-icon>\n  </a>\n</div>\n"

/***/ }),

/***/ "./src/app/terminal/game/game.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Ship */
/* unused harmony export Rocket */
/* unused harmony export Bomb */
/* unused harmony export Invader */
/* unused harmony export PlayState */
/* unused harmony export WelcomeState */
/* unused harmony export LevelIntroState */
/* unused harmony export GameOverState */
/* unused harmony export PauseState */
/* unused harmony export Sounds */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GameComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_communicate_service__ = __webpack_require__("./src/app/services/communicate.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__classes_app_state_enum__ = __webpack_require__("./src/app/classes/app-state.enum.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var Ship = /** @class */ (function () {
    function Ship(x, y) {
        this.width = 32;
        this.height = 32;
        this.x = x;
        this.y = y;
    }
    return Ship;
}());

var Rocket = /** @class */ (function () {
    function Rocket(x, y, velocity) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
    }
    return Rocket;
}());

var Bomb = /** @class */ (function () {
    function Bomb(x, y, velocity) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
    }
    return Bomb;
}());

var Invader = /** @class */ (function () {
    function Invader(x, y, rank, file, type) {
        this.x = x;
        this.y = y;
        this.rank = rank;
        this.file = file;
        this.type = type;
        this.width = 36;
        this.height = 28;
    }
    return Invader;
}());

var PlayState = /** @class */ (function () {
    function PlayState(config, level) {
        this.invaderCurrentVelocity = 10;
        this.invaderCurrentDropDistance = 0;
        this.invadersAreDropping = false;
        this.lastRocketTime = null;
        //  Game entities.
        this.ship = null;
        this.invaders = [];
        this.rockets = [];
        this.bombs = [];
        this.config = config;
        this.level = level;
    }
    PlayState.prototype.enter = function (game) {
        //  Create the ship.
        this.ship = new Ship(game.width / 2, game.gameBounds.bottom);
        //  Setup initial state.
        this.invaderCurrentVelocity = 10;
        this.invaderCurrentDropDistance = 0;
        this.invadersAreDropping = false;
        //  Set the ship speed for this level, as well as invader params.
        var levelMultiplier = this.level * this.config.levelDifficultyMultiplier;
        this.shipSpeed = this.config.shipSpeed;
        this.invaderInitialVelocity = this.config.invaderInitialVelocity + (levelMultiplier * this.config.invaderInitialVelocity);
        this.bombRate = this.config.bombRate + (levelMultiplier * this.config.bombRate);
        this.bombMinVelocity = this.config.bombMinVelocity + (levelMultiplier * this.config.bombMinVelocity);
        this.bombMaxVelocity = this.config.bombMaxVelocity + (levelMultiplier * this.config.bombMaxVelocity);
        //  Create the invaders.
        var ranks = this.config.invaderRanks;
        var files = this.config.invaderFiles;
        var invaders = [];
        for (var rank = 0; rank < ranks; rank++) {
            for (var file = 0; file < files; file++) {
                invaders.push(new Invader((game.width / 2) + ((files / 2 - file) * 300 / files), (game.gameBounds.top + rank * 30), rank, file, 'Invader'));
            }
        }
        this.invaders = invaders;
        this.invaderCurrentVelocity = this.invaderInitialVelocity;
        this.invaderVelocity = { x: -this.invaderInitialVelocity, y: 0 };
        this.invaderNextVelocity = null;
    };
    ;
    PlayState.prototype.update = function (game, dt) {
        //  If the left or right arrow keys are pressed, move
        //  the ship. Check this on ticks rather than via a keydown
        //  event for smooth movement, otherwise the ship would move
        //  more like a text editor caret.
        if (game.pressedKeys[37]) {
            this.ship.x -= this.shipSpeed * dt;
        }
        if (game.pressedKeys[39]) {
            this.ship.x += this.shipSpeed * dt;
        }
        if (game.pressedKeys[32]) {
            this.fireRocket(game);
        }
        //  Keep the ship in bounds.
        if (this.ship.x < game.gameBounds.left) {
            this.ship.x = game.gameBounds.left;
        }
        if (this.ship.x > game.gameBounds.right) {
            this.ship.x = game.gameBounds.right;
        }
        //  Move each bomb.
        for (var i = 0; i < this.bombs.length; i++) {
            var bomb = this.bombs[i];
            bomb.y += dt * bomb.velocity;
            //  If the rocket has gone off the screen remove it.
            if (bomb.y > game.height) {
                this.bombs.splice(i--, 1);
            }
        }
        //  Move each rocket.
        for (i = 0; i < this.rockets.length; i++) {
            var rocket = this.rockets[i];
            rocket.y -= dt * rocket.velocity;
            //  If the rocket has gone off the screen remove it.
            if (rocket.y < 0) {
                this.rockets.splice(i--, 1);
            }
        }
        //  Move the invaders.
        var hitLeft = false, hitRight = false, hitBottom = false;
        for (i = 0; i < this.invaders.length; i++) {
            var invader = this.invaders[i];
            var newx = invader.x + this.invaderVelocity.x * dt;
            var newy = invader.y + this.invaderVelocity.y * dt;
            if (hitLeft == false && newx < game.gameBounds.left) {
                hitLeft = true;
            }
            else if (hitRight == false && newx > game.gameBounds.right) {
                hitRight = true;
            }
            else if (hitBottom == false && newy > game.gameBounds.bottom) {
                hitBottom = true;
            }
            if (!hitLeft && !hitRight && !hitBottom) {
                invader.x = newx;
                invader.y = newy;
            }
        }
        //  Update invader velocities.
        if (this.invadersAreDropping) {
            this.invaderCurrentDropDistance += this.invaderVelocity.y * dt;
            if (this.invaderCurrentDropDistance >= this.config.invaderDropDistance) {
                this.invadersAreDropping = false;
                this.invaderVelocity = this.invaderNextVelocity;
                this.invaderCurrentDropDistance = 0;
            }
        }
        //  If we've hit the left, move down then right.
        if (hitLeft) {
            this.invaderCurrentVelocity += this.config.invaderAcceleration;
            this.invaderVelocity = { x: 0, y: this.invaderCurrentVelocity };
            this.invadersAreDropping = true;
            this.invaderNextVelocity = { x: this.invaderCurrentVelocity, y: 0 };
        }
        //  If we've hit the right, move down then left.
        if (hitRight) {
            this.invaderCurrentVelocity += this.config.invaderAcceleration;
            this.invaderVelocity = { x: 0, y: this.invaderCurrentVelocity };
            this.invadersAreDropping = true;
            this.invaderNextVelocity = { x: -this.invaderCurrentVelocity, y: 0 };
        }
        //  If we've hit the bottom, it's game over.
        if (hitBottom) {
            game.lives = 0;
        }
        //  Check for rocket/invader collisions.
        for (i = 0; i < this.invaders.length; i++) {
            var invader = this.invaders[i];
            var bang = false;
            for (var j = 0; j < this.rockets.length; j++) {
                var rocket = this.rockets[j];
                if (rocket.x >= (invader.x - invader.width / 2) && rocket.x <= (invader.x + invader.width / 2) &&
                    rocket.y >= (invader.y - invader.height / 2) && rocket.y <= (invader.y + invader.height / 2)) {
                    //  Remove the rocket, set 'bang' so we don't process
                    //  this rocket again.
                    this.rockets.splice(j--, 1);
                    bang = true;
                    game.score += (this.config.pointsPerInvader + (this.level - 1));
                    game.crowsKilled += 1;
                    break;
                }
            }
            if (bang) {
                this.invaders.splice(i--, 1);
                game.sounds.playSound('crow');
            }
        }
        //  Find all of the front rank invaders.
        var frontRankInvaders = {};
        for (var i = 0; i < this.invaders.length; i++) {
            var invader = this.invaders[i];
            //  If we have no invader for game file, or the invader
            //  for game file is futher behind, set the front
            //  rank invader to game one.
            if (!frontRankInvaders[invader.file] || frontRankInvaders[invader.file].rank < invader.rank) {
                frontRankInvaders[invader.file] = invader;
            }
        }
        //  Give each front rank invader a chance to drop a bomb.
        for (var i = 0; i < this.config.invaderFiles; i++) {
            var invader = frontRankInvaders[i];
            if (!invader)
                continue;
            var chance = this.bombRate * dt;
            if (chance > Math.random()) {
                //  Fire!
                this.bombs.push(new Bomb(invader.x, invader.y + invader.height / 2, this.bombMinVelocity + Math.random() * (this.bombMaxVelocity - this.bombMinVelocity)));
            }
        }
        //  Check for bomb/ship collisions.
        for (var i = 0; i < this.bombs.length; i++) {
            var bomb = this.bombs[i];
            if (bomb.x >= (this.ship.x - this.ship.width / 2) && bomb.x <= (this.ship.x + this.ship.width / 2) &&
                bomb.y >= (this.ship.y - this.ship.height / 2) && bomb.y <= (this.ship.y + this.ship.height / 2)) {
                this.bombs.splice(i--, 1);
                game.lives--;
                game.sounds.playSound('hit');
            }
        }
        //  Check for invader/ship collisions.
        for (var i = 0; i < this.invaders.length; i++) {
            var invader = this.invaders[i];
            if ((invader.x + invader.width / 2) > (this.ship.x - this.ship.width / 2) &&
                (invader.x - invader.width / 2) < (this.ship.x + this.ship.width / 2) &&
                (invader.y + invader.height / 2) > (this.ship.y - this.ship.height / 2) &&
                (invader.y - invader.height / 2) < (this.ship.y + this.ship.height / 2)) {
                //  Dead by collision!
                game.lives = 0;
                game.sounds.playSound('hit');
            }
        }
        //  Check for failure
        if (game.lives <= 0) {
            game.moveToState(new GameOverState());
        }
        //  Check for victory
        if (this.invaders.length === 0) {
            game.score += this.level * 100;
            game.level += 1;
            game.moveToState(new LevelIntroState(game.level));
        }
    };
    ;
    PlayState.prototype.draw = function (game, dt, ctx) {
        //  Clear the background.
        ctx.clearRect(0, 0, game.width, game.height);
        //  Draw ship.
        var shooterImg = new Image();
        shooterImg.src = "assets/shooter.png";
        ctx.drawImage(shooterImg, this.ship.x - (this.ship.width / 2), this.ship.y - (this.ship.height / 2), this.ship.width, this.ship.height);
        //  Draw invaders.
        var crowImg = new Image();
        crowImg.src = "assets/crow.png";
        // ctx.fillStyle = '#006600';
        for (var i = 0; i < this.invaders.length; i++) {
            var invader = this.invaders[i];
            ctx.drawImage(crowImg, invader.x - invader.width / 2, invader.y - invader.height / 2, invader.width, invader.height);
        }
        // Draw bombs
        var eggImg = new Image();
        eggImg.src = "assets/egg.png";
        for (var i = 0; i < this.bombs.length; i++) {
            var bomb = this.bombs[i];
            ctx.drawImage(eggImg, bomb.x - 2, bomb.y - 2, 8, 8);
        }
        //  Draw rockets.
        var bulletImg = new Image();
        bulletImg.src = "assets/bullet.png";
        for (var i = 0; i < this.rockets.length; i++) {
            var rocket = this.rockets[i];
            ctx.drawImage(bulletImg, rocket.x, rocket.y - 2, 3, 12);
        }
        //  Draw info.
        var textYpos = game.gameBounds.bottom + ((game.height - game.gameBounds.bottom) / 2) + 14 / 2;
        var livesYpos = game.gameBounds.top - 10;
        ctx.font = "14px 'Andale Mono', Consolas, 'Courier New'";
        ctx.fillStyle = '#0a0a0a';
        var info = "Lives: ";
        ctx.textAlign = "left";
        ctx.fillText(info, game.gameBounds.right - 40 - (game.lives * 25), 22);
        for (var i = 0; i < game.lives; i++) {
            ctx.drawImage(shooterImg, game.gameBounds.right - (i * 25), 10, 25, 25);
        }
        info = "Score: " + game.score + ", Horde #: " + game.level;
        ctx.textAlign = "right";
        ctx.fillText(info, (game.width / 2) + 90, 22);
        //  If we're in debug mode, draw bounds.
        if (this.config.debugMode) {
            ctx.strokeStyle = '#ff0000';
            ctx.strokeRect(0, 0, game.width, game.height);
            ctx.strokeRect(game.gameBounds.left, game.gameBounds.top, game.gameBounds.right - game.gameBounds.left, game.gameBounds.bottom - game.gameBounds.top);
        }
    };
    ;
    PlayState.prototype.keyDown = function (game, keyCode) {
        if (keyCode == 32) {
            //  Fire!
            this.fireRocket(game);
        }
        if (keyCode == 80) {
            //  Push the pause state.
            game.pushState(new PauseState());
        }
    };
    ;
    PlayState.prototype.keyUp = function (game, keyCode) {
    };
    ;
    PlayState.prototype.fireRocket = function (game) {
        //  If we have no last rocket time, or the last rocket time 
        //  is older than the max rocket rate, we can fire.
        if (this.lastRocketTime === null || ((new Date()).valueOf() - this.lastRocketTime) > (1000 / this.config.rocketMaxFireRate)) {
            //  Add a rocket.
            this.rockets.push(new Rocket(this.ship.x, this.ship.y - 12, this.config.rocketVelocity));
            this.lastRocketTime = (new Date()).valueOf();
            //  Play the 'shoot' sound.
            game.sounds.playSound('shoot');
        }
    };
    ;
    return PlayState;
}());

var WelcomeState = /** @class */ (function () {
    function WelcomeState() {
    }
    WelcomeState.prototype.enter = function (game) {
    };
    WelcomeState.prototype.update = function (game, dt) { };
    ;
    WelcomeState.prototype.draw = function (game, dt, ctx) {
        ctx.font = "30px 'Andale Mono', Consolas, 'Courier New'";
        ctx.fillStyle = '#0a0a0a';
        ctx.textBaseline = "center";
        ctx.textAlign = "center";
        ctx.fillText("Crow Invaders", game.width / 2, game.height / 2 - 40);
        ctx.font = "16px 'Andale Mono', Consolas, 'Courier New'";
        ctx.fillText("Move with arrow keys, fire with the space bar.", game.width / 2, game.height / 2);
        ctx.fillText("The crows get faster and drop more eggs as you clear each horde!", game.width / 2, game.height / 2 + 25);
        ctx.fillText("Press 'Space' to start.", game.width / 2, game.height / 2 + 80);
    };
    WelcomeState.prototype.keyDown = function (game, keyCode) {
        if (keyCode == 32) {
            //  Space starts the game.
            game.level = 1;
            game.score = 0;
            game.lives = 3;
            game.moveToState(new LevelIntroState(game.level));
        }
    };
    ;
    return WelcomeState;
}());

var LevelIntroState = /** @class */ (function () {
    function LevelIntroState(level) {
        this.countdownMessage = "3";
        this.countdown = undefined;
        this.level = level;
    }
    LevelIntroState.prototype.update = function (game, dt) {
        //  Update the countdown.
        if (this.countdown === undefined) {
            this.countdown = 3; // countdown from 3 secs
        }
        this.countdown -= dt;
        if (this.countdown < 2) {
            this.countdownMessage = "2";
        }
        if (this.countdown < 1) {
            this.countdownMessage = "1";
        }
        if (this.countdown <= 0) {
            //  Move to the next level, popping this state.
            game.moveToState(new PlayState(game.config, this.level));
        }
    };
    LevelIntroState.prototype.draw = function (game, dt, ctx) {
        //  Clear the background.
        ctx.clearRect(0, 0, game.width, game.height);
        ctx.font = "32px 'Andale Mono', Consolas, 'Courier New'";
        ctx.fillStyle = '#0a0a0a';
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText("Horde " + this.level, game.width / 2, game.height / 2 - 36);
        ctx.font = "24px 'Andale Mono', Consolas, 'Courier New'";
        ctx.fillText("Coming in " + this.countdownMessage, game.width / 2, game.height / 2);
        return;
    };
    ;
    return LevelIntroState;
}());

var GameOverState = /** @class */ (function () {
    function GameOverState() {
    }
    GameOverState.prototype.update = function (game, dt) {
    };
    ;
    GameOverState.prototype.draw = function (game, dt, ctx) {
        //  Clear the background.
        ctx.clearRect(0, 0, game.width, game.height);
        ctx.font = "30px 'Andale Mono', Consolas, 'Courier New'";
        ctx.fillStyle = '#0a0a0a';
        ctx.textBaseline = "center";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", game.width / 2, game.height / 2 - 40);
        ctx.font = "16px 'Andale Mono', Consolas, 'Courier New'";
        ctx.fillText("You took care of " + game.crowsKilled + " crows and earned " + game.score + " Crow Coins", game.width / 2, game.height / 2);
        ctx.font = "16px 'Andale Mono', Consolas, 'Courier New'";
        ctx.fillText("Press 'Space' to return to the command centre.", game.width / 2, game.height / 2 + 40);
    };
    ;
    GameOverState.prototype.keyDown = function (game, keyCode) {
        if (keyCode == 32) {
            //  Space restarts the game.
            game.finishGame();
        }
    };
    ;
    return GameOverState;
}());

var PauseState = /** @class */ (function () {
    function PauseState() {
    }
    PauseState.prototype.keyDown = function (game, keyCode) {
        if (keyCode == 80) {
            //  Pop the pause state.
            game.popState();
        }
    };
    ;
    PauseState.prototype.draw = function (game, dt, ctx) {
        //  Clear the background.
        ctx.clearRect(0, 0, game.width, game.height);
        ctx.font = "14px 'Andale Mono', Consolas, 'Courier New'";
        ctx.fillStyle = '#0a0a0a';
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText("Paused", game.width / 2, game.height / 2);
        return;
    };
    ;
    return PauseState;
}());

var Sounds = /** @class */ (function () {
    function Sounds() {
        //  The audio context.
        this.audioContext = null;
        this.mute = false;
        this.sounds = {};
    }
    Sounds.prototype.init = function () {
        //  Create the audio context, paying attention to webkit browsers.
        var context = AudioContext || webkitAudioContext;
        this.audioContext = new context();
    };
    ;
    Sounds.prototype.loadSound = function (name, url) {
        //  Reference to ourselves for closures.
        var self = this;
        //  Create an entry in the sounds object.
        this.sounds[name] = null;
        //  Create an asynchronous request for the sound.
        var req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.responseType = 'arraybuffer';
        req.onload = function () {
            self.audioContext.decodeAudioData(req.response, function (buffer) {
                self.sounds[name] = { buffer: buffer };
            });
        };
        try {
            req.send();
        }
        catch (e) {
            console.log("An exception occured getting sound the sound " + name + " this might be " +
                "because the page is running from the file system, not a webserver.");
            console.log(e);
        }
    };
    ;
    Sounds.prototype.playSound = function (name) {
        //  If we've not got the sound, don't bother playing it.
        if (this.sounds[name] === undefined || this.sounds[name] === null || this.mute === true) {
            return;
        }
        //  Create a sound source, set the buffer, connect to the speakers and
        //  play the sound.
        var source = this.audioContext.createBufferSource();
        source.buffer = this.sounds[name].buffer;
        source.connect(this.audioContext.destination);
        source.start(0);
    };
    ;
    return Sounds;
}());

var GameComponent = /** @class */ (function () {
    function GameComponent(comService) {
        var _this = this;
        this.comService = comService;
        this.finalScore = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        //  Set the initial config.
        this.config = {
            bombRate: 0.15,
            bombMinVelocity: 50,
            bombMaxVelocity: 50,
            invaderInitialVelocity: 50,
            invaderAcceleration: 0,
            invaderDropDistance: 20,
            rocketVelocity: 160,
            rocketMaxFireRate: 4,
            gameWidth: 600,
            gameHeight: 500,
            fps: 50,
            debugMode: false,
            invaderRanks: 5,
            invaderFiles: 10,
            shipSpeed: 160,
            levelDifficultyMultiplier: 0.4,
            pointsPerInvader: 10
        };
        //  All state is in the variables below.
        this.lives = 3;
        this.width = 0;
        this.height = 0;
        this.gameBounds = { left: 0, top: 0, right: 0, bottom: 0 };
        this.score = 0;
        this.crowsKilled = 0;
        this.level = 1;
        //  The state stack.
        this.stateStack = [];
        //  Input/output
        this.pressedKeys = {};
        this.gameCanvas = null;
        this.loaded = false;
        this.stateSubscription = this.comService.appState$.subscribe(function (state) {
            if (state != __WEBPACK_IMPORTED_MODULE_2__classes_app_state_enum__["a" /* AppState */].game) {
                _this.moveToState(new GameOverState());
            }
        });
    }
    GameComponent.prototype.ngAfterViewInit = function () {
        this.startGame();
    };
    GameComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.stateSubscription.unsubscribe();
    };
    GameComponent.prototype.startGame = function () {
        var _this = this;
        this.canvas.nativeElement.width = 700;
        this.canvas.nativeElement.height = 600;
        setTimeout(function () {
            _this.sounds = new Sounds();
            _this.sounds.init();
            _this.sounds.loadSound('shoot', '/assets/sounds/pistol.wav');
            _this.sounds.loadSound('bang', '/assets/sounds/bang.wav');
            _this.sounds.loadSound('crow', '/assets/sounds/crow.wav');
            _this.sounds.loadSound('hit', '/assets/sounds/hurt.wav');
        }, 0);
        // this.backgroundCanvas.nativeElement.width = 700;
        // this.backgroundCanvas.nativeElement.height = 600;
        // var ctx = this.backgroundCanvas.nativeElement.getContext("2d");
        // //  Clear the background.
        // ctx.clearRect(0, 0, 700, 600);
        // var bgImg = new Image();
        // bgImg.src = "assets/backdropTransparent.png";
        // ctx.drawImage(bgImg, 0, 0, 700, 600);
        //  Create the game.
        // var game = new Game();
        //  Initialise it with the game canvas.
        this.initialise(this.canvas.nativeElement);
        //  Start the game.
        this.start();
        //  Listen for keyboard events.
        window.addEventListener("keydown", function (e) {
            var keycode = e.keyCode;
            //  Supress further processing of left/right/space (37/29/32)
            if (keycode == 37 || keycode == 39 || keycode == 32) {
                e.preventDefault();
            }
            _this.keyDown(keycode);
        });
        window.addEventListener("keyup", function (e) {
            var keycode = e.keyCode;
            _this.keyUp(keycode);
        });
    };
    GameComponent.prototype.toggleMute = function () {
        this.mute();
    };
    ;
    GameComponent.prototype.initialise = function (gameCanvas) {
        //  Set the game canvas.
        this.gameCanvas = gameCanvas;
        //  Set the game width and height.
        this.width = gameCanvas.width;
        this.height = gameCanvas.height;
        //  Set the state game bounds.
        this.gameBounds = {
            left: gameCanvas.width / 2 - this.config.gameWidth / 2,
            right: gameCanvas.width / 2 + this.config.gameWidth / 2,
            top: gameCanvas.height / 2 - this.config.gameHeight / 2,
            bottom: gameCanvas.height / 2 + this.config.gameHeight / 2,
        };
    };
    ;
    GameComponent.prototype.moveToState = function (state) {
        //  If we are in a state, leave it.
        if (this.currentState() && this.currentState().leave) {
            this.currentState().leave(this);
            this.stateStack.pop();
        }
        //  If there's an enter function for the new state, call it.
        if (state.enter) {
            state.enter(this);
        }
        //  Set the current state.
        this.stateStack.pop();
        this.stateStack.push(state);
    };
    ;
    GameComponent.prototype.finishGame = function () {
        this.finalScore.emit(this.score);
    };
    //  Start the Game.
    GameComponent.prototype.start = function () {
        var _this = this;
        //  Move into the 'welcome' state.
        this.moveToState(new WelcomeState());
        //  Set the game variables.
        this.lives = 3;
        this.config.debugMode = /debug=true/.test(window.location.href);
        //  Start the game loop.
        this.intervalId = setInterval(function () {
            _this.gameLoop();
        }, 1000 / this.config.fps);
        setTimeout(function () {
            _this.loaded = true;
        }, 0);
    };
    ;
    //  Returns the current state.
    GameComponent.prototype.currentState = function () {
        return this.stateStack.length > 0 ? this.stateStack[this.stateStack.length - 1] : null;
    };
    ;
    //  Mutes or unmutes the game.
    GameComponent.prototype.mute = function (mute) {
        if (mute === void 0) { mute = null; }
        //  If we've been told to mute, mute.
        if (mute === true) {
            this.sounds.mute = true;
        }
        else if (mute === false) {
            this.sounds.mute = false;
        }
        else {
            // Toggle mute instead...
            this.sounds.mute = this.sounds.mute ? false : true;
        }
    };
    ;
    //  The main loop.
    GameComponent.prototype.gameLoop = function () {
        var currentState = this.currentState();
        if (currentState) {
            //  Delta t is the time to update/draw.
            var dt = 1 / this.config.fps;
            //  Get the drawing context.
            var ctx = this.gameCanvas.getContext("2d");
            //  Update if we have an update function. Also draw
            //  if we have a draw function.
            if (currentState.update) {
                currentState.update(this, dt);
            }
            if (currentState.draw) {
                currentState.draw(this, dt, ctx);
            }
        }
    };
    GameComponent.prototype.pushState = function (state) {
        //  If there's an enter function for the new state, call it.
        if (state.enter) {
            state.enter(this);
        }
        //  Set the current state.
        this.stateStack.push(state);
    };
    ;
    GameComponent.prototype.popState = function () {
        //  Leave and pop the state.
        if (this.currentState()) {
            if (this.currentState().leave) {
                this.currentState().leave(this);
            }
            //  Set the current state.
            this.stateStack.pop();
        }
    };
    ;
    //  The stop function stops the game.
    GameComponent.prototype.stop = function () {
        clearInterval(this.intervalId);
    };
    ;
    //  Inform the game a key is down.
    GameComponent.prototype.keyDown = function (keyCode) {
        this.pressedKeys[keyCode] = true;
        //  Delegate to the current state too.
        if (this.currentState() && this.currentState().keyDown) {
            this.currentState().keyDown(this, keyCode);
        }
    };
    ;
    //  Inform the game a key is up.
    GameComponent.prototype.keyUp = function (keyCode) {
        delete this.pressedKeys[keyCode];
        //  Delegate to the current state too.
        if (this.currentState() && this.currentState().keyUp) {
            this.currentState().keyUp(this, keyCode);
        }
    };
    ;
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('gameCanvas'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"])
    ], GameComponent.prototype, "canvas", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('backgroundCanvas'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"])
    ], GameComponent.prototype, "backgroundCanvas", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"])
    ], GameComponent.prototype, "finalScore", void 0);
    GameComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-game',
            template: __webpack_require__("./src/app/terminal/game/game.component.html"),
            styles: [__webpack_require__("./src/app/terminal/game/game.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__services_communicate_service__["a" /* CommunicateService */]])
    ], GameComponent);
    return GameComponent;
}());



/***/ }),

/***/ "./src/app/terminal/terminal.component.css":
/***/ (function(module, exports) {

module.exports = ".shell-wrap {\n  width: 700px;\n  margin: 0 auto 0 auto;\n  -webkit-box-shadow: 0 0 30px rgba(0, 0, 0, 0.4);\n          box-shadow: 0 0 30px rgba(0, 0, 0, 0.4);\n  border-radius: 3px;\n}\n\n.shell-top-bar {\n  font-family: HelveticaNeue, 'Helvetica Neue', 'Lucida Grande', Arial, sans-serif;\n  text-align: center;\n  color: #525252;\n  cursor: pointer;\n  padding: 5px 0;\n  margin: 0;\n  height: 1.1em;\n  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);\n  font-size: 0.85em;\n  border: 1px solid #CCCCCC;\n  border-bottom: none;\n  -webkit-border-top-left-radius: 3px;\n  -webkit-border-top-right-radius: 3px;\n  -moz-border-radius-topleft: 3px;\n  -moz-border-radius-topright: 3px;\n  border-top-left-radius: 3px;\n  border-top-right-radius: 3px;\n  background: #f7f7f7;\n  /* Old browsers */\n  /* FF3.6+ */\n  /* Chrome10+,Safari5.1+ */\n  /* Opera 11.10+ */\n  /* IE10+ */\n  background: -webkit-gradient(linear, left top, left bottom, from(#f7f7f7), to(#B8B8B8));\n  background: linear-gradient(to bottom, #f7f7f7 0%, #B8B8B8 100%);\n  /* W3C */\n  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f7f7f7', endColorstr='#B8B8B8', GradientType=0);\n  /* IE6-9 */\n}\n\n.shell-body {\n  margin: 0;\n  padding: 5px;\n  height: 500px;\n  list-style: none;\n  background: rgba(0, 0, 0, 0.8);\n  color: rgb(219, 219, 219);\n  font: 0.8em 'Andale Mono', Consolas, 'Courier New';\n  line-height: 1.6em;\n  -webkit-border-bottom-right-radius: 3px;\n  -webkit-border-bottom-left-radius: 3px;\n  -moz-border-radius-bottomright: 3px;\n  -moz-border-radius-bottomleft: 3px;\n  border-bottom-right-radius: 3px;\n  border-bottom-left-radius: 3px;\n  overflow-y: scroll;\n}\n\n.shell-body .commandline {\n  word-wrap: break-word;\n  position: relative;\n  padding: 0 0 0 15px;\n}\n\n.buttons {\n  padding-left: 8px;\n  padding-top: 0px;\n  float: left;\n  line-height: 0px;\n}\n\n.close {\n  background: #ff5c5c;\n  font-size: 12px;\n  text-shadow: none;\n  width: 11px;\n  height: 11px;\n  border: 1px solid #e33e41;\n  border-radius: 50%;\n  display: inline-block;\n  font-family: HelveticaNeue, 'Helvetica Neue', 'Lucida Grande', Arial, sans-serif;\n}\n\n.close:hover {\n  cursor: pointer;\n}\n\n.close .closebutton {\n  color: #820005;\n  visibility: hidden;\n  opacity: 0;\n  -webkit-transition: visibility 0s, opacity 0.2s linear;\n  transition: visibility 0s, opacity 0.2s linear;\n}\n\n.close span {\n  line-height: 9px;\n  vertical-align: 50%;\n}\n\n.shell-top-bar:hover .close .closebutton {\n  visibility: visible;\n  opacity: 1;\n}\n\n.shell-body span {\n  white-space: pre-line;\n  word-wrap: break-word;\n}\n\n.command-input {\n  background: transparent;\n  border: none;\n  white-space: unset !important;\n}\n\n.output-container {\n  white-space: normal;\n}\n\n.cmdInput {\n  width: 0px;\n  height: 0px;\n  margin: 0;\n  padding: 0;\n  border: none;\n}\n\n.terminal-prompt {\n  white-space: unset !important;\n}\n\n.terminal-prompt-text {\n  color: orange;\n}\n\n.terminal-prompt-command {\n  white-space: unset !important;\n}\n\n"

/***/ }),

/***/ "./src/app/terminal/terminal.component.html":
/***/ (function(module, exports) {

module.exports = "<div id=\"terminal\" class=\"shell-wrap\">\n  <div  class=\"shell-top-bar\">\n    <div class=\"buttons\">\n      <div class=\"close\" (click)=\"closeTerminal()\">\n        <div class=\"closebutton\">\n          <span>\n            <strong>x</strong>\n          </span>\n        </div>\n      </div>\n    </div>\n    Crow Command Centre Control\n  </div>\n  <div class=\"shell-body\" #terminalBody (click)=\"focusInput()\" [hidden]=\"shootingCrows\">\n    <div *ngFor=\"let cmd of commands; let i = index\" class=\"output-container\">\n      <span [hidden]=\"!cmd.containsCommand\" class=\"terminal-prompt-command\">\n        <span class=\"terminal-prompt-text\">{{prompt}}</span>\n        {{cmd.command}}\n      </span>\n      <span [id]=\"'output-' + i\"></span>\n    </div>\n    <span class=\"terminal-prompt terminal-prompt-text\" *ngIf='showPrompt'>\n      {{prompt}}\n    </span>\n    <span class=\"command-input\" *ngIf='showPrompt'>\n      {{currentInput}}{{cursor}}\n    </span>\n    <input type=\"text\" class=\"cmdInput\" #cmdInput [(ngModel)]=\"currentInput\" (blur)=\"inputBlur()\" \n    (focus)=\"focusInput()\" (keyup.enter)=\"executeCommandAsync()\" (keyup)=\"onInput($event)\"/>\n  </div> \n  <app-game *ngIf=\"shootingCrows\" (finalScore)=\"gameFinished($event)\"></app-game>\n  <!-- <app-game  (finalScore)=\"gameFinished($event)\"></app-game> -->\n</div>\n\n\n"

/***/ }),

/***/ "./src/app/terminal/terminal.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TerminalComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_web3_service__ = __webpack_require__("./src/app/services/web3.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_firebase_service__ = __webpack_require__("./src/app/services/firebase.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_communicate_service__ = __webpack_require__("./src/app/services/communicate.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_utils__ = __webpack_require__("./src/app/services/utils.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__classes_command__ = __webpack_require__("./src/app/classes/command.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__classes_web3_loading_status_enum__ = __webpack_require__("./src/app/classes/web3-loading-status.enum.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_typed_js__ = __webpack_require__("./node_modules/typed.js/lib/typed.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_typed_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_typed_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__classes_app_state_enum__ = __webpack_require__("./src/app/classes/app-state.enum.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};









var TerminalComponent = /** @class */ (function () {
    function TerminalComponent(service, utils, firebase, comService) {
        this.service = service;
        this.utils = utils;
        this.firebase = firebase;
        this.comService = comService;
        this.allOutput = [];
        this.commands = [new __WEBPACK_IMPORTED_MODULE_5__classes_command__["a" /* Command */](null)];
        this.currentCommand = -1;
        this.currentInput = '';
        this.showPrompt = false;
        this.shootingCrows = false;
        this.cursor = '_';
        this.firstLoad = true;
        /* Terminal Messages */
        this.prompt = '[c-c-c-c] $:';
        this.welcomeMessage = 'Welcome to the CCCC - Crow Command Centre Control\nThe time has come to fight back against the pesky crows^1000\n\n' +
            'Crow Command Centre Controls loading...^500\n `Calculating storm differentials...`^800\n ' +
            '`Hooking up to the network...`^800\n'
            + '';
        this.invalidCommandMessage = 'Command not recognised\n';
        this.getHelpMessage = '`Enter "help" for a list of available commands or "shootcrows" to get into the action`';
        this.helpMessage = '\n\n `command: "shootcrows"\t(Take care of the damn crows)`^400\n' +
            '`command: "info"\t\t\t(What is going on?)`^400\n' +
            '`command: "balance"\t\t(Check your balance)`^400\n' +
            '`command: "purchasecrowcoins [amount]"\t\t(Purchase crow coins)`^400\n' +
            '`command: "checkconnection"\t\t\t(Check MetaMask connection)`^400\n' +
            '`command: "help"\t\t\t(Get help)`^400\n\n' +
            'Now lets take care of some crows!';
        this.infoMessage = 'A giant horde of crows is descending on Melbourne...\n' +
            'If we let them get in to the city it will be a disaster!\n' +
            'Use your skills to clear them out and you will be rewarded with Crow Coins^300\n' +
            'Now enter the command \"shootcrows\" and lets get to work!';
        this.shootCrowsHelpMessage = '`command: "shootcrows"`^400\n `Params: [-difficulty] ["easy", "medium", "hard"]`^400\n' +
            '`e.g. shootcrows -difficulty medium...`^400\n' +
            '`e.g. shootcrows`';
        this.loadingCrowsMessage = 'Lets go shooting!^400\n `Prepping equipment...`^400\n' +
            '`Setting up position...`^400\n\n ';
        this.unlockAccHelpMessage = '`command: "unlockaccount"`^400\n `Params: [-key] [pKey]`^400\n' +
            '`e.g. unlockaccount -key 0x23948729347892374...`';
        this.purchaseCoinsHelpMessage = '`command: "purchasecrowcoins [amount]"`^400\n' +
            '`e.g. purchasecrowcoins 800`';
    }
    TerminalComponent.prototype.ngAfterViewInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.web3Subscription = this.service.web3Status$.subscribe(function (status) {
                    console.log("Terminal: Web3Status: " + status);
                    _this.web3State = status;
                    if (status == __WEBPACK_IMPORTED_MODULE_6__classes_web3_loading_status_enum__["a" /* Web3LoadingStatus */].complete) {
                        if (_this.firstLoad) {
                            _this.addOutput(_this.welcomeMessage + '`<span style="color:green;">' + status + '</span>`^800\n\n' + _this.getHelpMessage, true);
                            // this.addOutput('', true);
                            _this.firstLoad = false;
                        }
                        _this.accountSubscription = _this.service.account$.subscribe(function (acc) { return __awaiter(_this, void 0, void 0, function () {
                            var ethBalance, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!(acc != undefined)) return [3 /*break*/, 3];
                                        this.account = acc;
                                        console.log("Terminal: account loaded: " + acc);
                                        return [4 /*yield*/, this.service.getEthBalanceAsync()];
                                    case 1:
                                        ethBalance = _b.sent();
                                        console.log("Terminal: eth balance: " + ethBalance);
                                        _a = this;
                                        return [4 /*yield*/, this.service.getTokenBalanceAsync()];
                                    case 2:
                                        _a.crowBalance = _b.sent();
                                        console.log("Terminal: crow balance: " + this.crowBalance);
                                        _b.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); });
                    }
                    else if (status != null) {
                        _this.account = null;
                        if (_this.firstLoad) {
                            _this.firstLoad = false;
                            _this.addOutput(_this.welcomeMessage + '`<span style="color:red;">' + status + '</span>`^800\n\n' + _this.getHelpMessage, true);
                        }
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    TerminalComponent.prototype.ngOnDestroy = function () {
        this.web3Subscription.unsubscribe();
        this.accountSubscription.unsubscribe();
    };
    TerminalComponent.prototype.closeTerminal = function () {
        this.shootingCrows = false;
        this.comService.setState(__WEBPACK_IMPORTED_MODULE_8__classes_app_state_enum__["a" /* AppState */].home);
    };
    TerminalComponent.prototype.executeCommandAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var input, output;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.currentCommand = -1;
                        if (!this.showPrompt) return [3 /*break*/, 2];
                        input = this.currentInput;
                        this.showPrompt = false;
                        this.currentInput = '';
                        this.addCommand(input);
                        return [4 /*yield*/, this.handleCommandAsync(input)];
                    case 1:
                        output = _a.sent();
                        if (output == null) {
                            this.addOutput('');
                        }
                        else {
                            this.addOutput(output, true);
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    TerminalComponent.prototype.addCommand = function (input) {
        this.commands[this.commands.length] = new __WEBPACK_IMPORTED_MODULE_5__classes_command__["a" /* Command */](input);
    };
    TerminalComponent.prototype.handleCommandAsync = function (arg) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var args, output, _a, balWei, crowWei, balEth, balCrow, hash, txSubscription_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        arg = arg.trim();
                        args = arg.split(' ');
                        output = this.invalidCommandMessage + this.getHelpMessage;
                        if (!args.length) return [3 /*break*/, 14];
                        _a = args[0].toLowerCase();
                        switch (_a) {
                            case 'shootcrows': return [3 /*break*/, 1];
                            case 'info': return [3 /*break*/, 2];
                            case 'checkconnection': return [3 /*break*/, 3];
                            case 'balance': return [3 /*break*/, 4];
                            case 'purchasecrowcoins': return [3 /*break*/, 12];
                            case 'help': return [3 /*break*/, 13];
                        }
                        return [3 /*break*/, 14];
                    case 1:
                        // if (args.length === 3 && args[1] === '-difficulty' )) {
                        //   // const account = await this.service.getAccountFromPKeyAsync(args[2]);
                        //   // if (account != null) {
                        //   //   output = account.address;
                        //   // }
                        // } else {
                        this.addOutput(this.loadingCrowsMessage);
                        setTimeout(function () {
                            _this.shootingCrows = true;
                            _this.comService.setState(__WEBPACK_IMPORTED_MODULE_8__classes_app_state_enum__["a" /* AppState */].game);
                        }, 3000);
                        output = null;
                        // }
                        return [3 /*break*/, 14];
                    case 2:
                        output = this.infoMessage;
                        return [3 /*break*/, 14];
                    case 3:
                        output = this.web3State + '^400\n';
                        if (this.account) {
                            output += 'Account: ' + this.account;
                        }
                        return [3 /*break*/, 14];
                    case 4:
                        if (!(this.web3State == __WEBPACK_IMPORTED_MODULE_6__classes_web3_loading_status_enum__["a" /* Web3LoadingStatus */].complete)) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.service.getEthBalanceAsync()];
                    case 5:
                        balWei = _b.sent();
                        return [4 /*yield*/, this.service.getTokenBalanceAsync()];
                    case 6:
                        crowWei = _b.sent();
                        if (!(balWei && crowWei)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.service.convertWeiToEth(balWei)];
                    case 7:
                        balEth = _b.sent();
                        return [4 /*yield*/, this.service.convertWeiToEth(crowWei)];
                    case 8:
                        balCrow = _b.sent();
                        output = '\nEther balance:\t\t' + balEth + ' ETH\n' +
                            'CrowCoin balance:\t' + balCrow + ' CROW';
                        return [3 /*break*/, 10];
                    case 9:
                        output = '\nUnable to retrieve balance';
                        _b.label = 10;
                    case 10: return [3 /*break*/, 14];
                    case 11:
                        output = this.web3State;
                        return [3 /*break*/, 14];
                    case 12:
                        if (this.web3State == __WEBPACK_IMPORTED_MODULE_6__classes_web3_loading_status_enum__["a" /* Web3LoadingStatus */].complete) {
                            if (args.length == 2 && parseInt(args[1]) != NaN) {
                                this.addOutput('Please accept the request on MetaMask...');
                                this.service.purchaseTokensAsync(null, args[1], function () { });
                                txSubscription_1 = this.service.txStatus$.subscribe(function (txInfo) {
                                    if (txInfo != null) {
                                        switch (txInfo.status) {
                                            case __WEBPACK_IMPORTED_MODULE_1__services_web3_service__["a" /* TxStatus */].hash:
                                                hash = txInfo.data;
                                                _this.addOutput('Purchase sent^200\nPlease wait...');
                                                break;
                                            case __WEBPACK_IMPORTED_MODULE_1__services_web3_service__["a" /* TxStatus */].receipt:
                                                if (hash = txInfo.data) {
                                                    _this.addOutput('Awaiting confirmation...');
                                                    break;
                                                }
                                            case __WEBPACK_IMPORTED_MODULE_1__services_web3_service__["a" /* TxStatus */].confirmed:
                                                if (hash == txInfo.data) {
                                                    _this.addOutput('<span style="color:green">Purchase successful</span>', true);
                                                    txSubscription_1.unsubscribe();
                                                    break;
                                                }
                                            case __WEBPACK_IMPORTED_MODULE_1__services_web3_service__["a" /* TxStatus */].error:
                                                _this.addOutput('There was an <span class="color:red">error</span> in purchasing the Crow Coins', true);
                                                txSubscription_1.unsubscribe();
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                });
                                output = null;
                                return [3 /*break*/, 14];
                            }
                            else {
                                output = this.purchaseCoinsHelpMessage;
                                return [3 /*break*/, 14];
                            }
                        }
                        output = this.web3State;
                        return [3 /*break*/, 14];
                    case 13:
                        output = this.helpMessage;
                        return [3 /*break*/, 14];
                    case 14: return [2 /*return*/, Promise.resolve(output)];
                }
            });
        });
    };
    TerminalComponent.prototype.addOutput = function (output, isLastOutput) {
        var _this = this;
        if (output === void 0) { output = ''; }
        if (isLastOutput === void 0) { isLastOutput = false; }
        var scrollInterval = setInterval(function () {
            var elem = _this.terminalBody.nativeElement;
            elem.scrollTop = elem.scrollHeight;
        }, 20);
        var index = this.commands.length;
        this.commands[index] = new __WEBPACK_IMPORTED_MODULE_5__classes_command__["a" /* Command */](null);
        setTimeout(function () {
            var add = '#output-' + index;
            _this.allOutput.push(new __WEBPACK_IMPORTED_MODULE_7_typed_js__(add, {
                strings: [output],
                typeSpeed: 20,
                backSpeed: 0,
                showCursor: false,
                loop: false,
                onComplete: function () {
                    // this.addingOutput = false;
                    clearInterval(scrollInterval);
                    if (isLastOutput) {
                        _this.showPrompt = true;
                        _this.focusInput();
                    }
                }
            }));
        }, 10);
    };
    TerminalComponent.prototype.onInput = function (event) {
        var commands = this.commands.filter(function (x) { return x.containsCommand; });
        if (commands.length > 0) {
            if (event.keyCode == 38) {
                if (this.currentCommand == -1) {
                    this.currentCommand = commands.length - 1;
                }
                else if (this.currentCommand > 0) {
                    this.currentCommand -= 1;
                }
                if (this.currentCommand >= 0 && commands[this.currentCommand]) {
                    this.currentInput = commands[this.currentCommand].command;
                }
            }
            else if (event.keyCode == 40) {
                if (this.currentCommand != -1) {
                    this.currentCommand += 1;
                    if (this.currentCommand >= commands.length) {
                        this.currentCommand = -1;
                        this.currentInput = '';
                    }
                    else {
                        this.currentInput = commands[this.currentCommand].command;
                    }
                }
            }
        }
    };
    TerminalComponent.prototype.gameFinished = function (score) {
        this.shootingCrows = false;
        this.comService.setState(__WEBPACK_IMPORTED_MODULE_8__classes_app_state_enum__["a" /* AppState */].terminal);
        this.addOutput('\n<br/>Your sacrifice has been noted!^400\n Would you like to claim your ' + score +
            ' Crow Coins? [Y]es or [N]o^400\n', true);
    };
    TerminalComponent.prototype.inputBlur = function () {
        clearInterval(this.interval);
        this.cursor = '_';
    };
    TerminalComponent.prototype.focusInput = function () {
        var _this = this;
        clearInterval(this.interval);
        this.interval = setInterval(function () {
            if (_this.cursor === '') {
                _this.cursor = '_';
            }
            else {
                _this.cursor = '';
            }
        }, 500);
        this.cmdInput.nativeElement.focus();
    };
    TerminalComponent.prototype.isHexString = function (str) {
        if (str === '') {
            return true;
        }
        str = str.substring(0, 2) === '0x' ? str.substring(2).toUpperCase() : str.toUpperCase();
        var re = /^[0-9A-F]+$/g;
        return re.test(str);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('cmdInput'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"])
    ], TerminalComponent.prototype, "cmdInput", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('terminalBody'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"])
    ], TerminalComponent.prototype, "terminalBody", void 0);
    TerminalComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-terminal',
            template: __webpack_require__("./src/app/terminal/terminal.component.html"),
            styles: [__webpack_require__("./src/app/terminal/terminal.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__services_web3_service__["b" /* Web3Service */], __WEBPACK_IMPORTED_MODULE_4__services_utils__["a" /* Utils */], __WEBPACK_IMPORTED_MODULE_2__services_firebase_service__["a" /* FirebaseService */], __WEBPACK_IMPORTED_MODULE_3__services_communicate_service__["a" /* CommunicateService */]])
    ], TerminalComponent);
    return TerminalComponent;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false,
    firebase: {
        apiKey: "AIzaSyBdo33SThPU1avpGmcZALK3TQhD1Jk8Urg",
        authDomain: "mycrypto-web-wallet.firebaseapp.com",
        databaseURL: "https://mycrypto-web-wallet.firebaseio.com",
        projectId: "mycrypto-web-wallet",
        storageBucket: "mycrypto-web-wallet.appspot.com",
        messagingSenderId: "972262680456"
    }
};


/***/ }),

/***/ "./src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("./node_modules/@angular/platform-browser-dynamic/esm5/platform-browser-dynamic.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("./src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("./src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["enableProdMode"])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./src/main.ts");


/***/ }),

/***/ 1:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 3:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 4:
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map