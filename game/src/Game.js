import * as THREE from '../libs/three137/three.module.js';
// import { OrbitControls } from '../../libs/three137/OrbitControls.js';
import { RGBELoader } from '../libs/three137/RGBELoader.js';
import { LoadingBar } from '../libs/LoadingBar.js';
import { Plane } from './Plane.js';
import { Terrain } from './Terrain.js';
import { Obstacles } from './Obstacles.js';
import { SFX } from '../libs/SFX.js';

let zLookAtOffset = 0;
let xCameraOffset = 0; // -4.37 
let yCameraOffset = 2;
let zCameraOffset = -6; // -4.75
class Game{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
        
        this.loadingBar = new LoadingBar();
        this.loadingBar.visible = false;

        this.clock = new THREE.Clock();

		this.assetsPath = '../game/assets/';
        
		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
        this.camera.position.set( xCameraOffset, yCameraOffset,  zCameraOffset );
        this.camera.lookAt(0, 0, zLookAtOffset);

        

        // let res = window.innerWidth / window.innerHeight;
        // this.camera = new THREE.PerspectiveCamera(75, res, 0.1, 1000);
        // this.camera.position.x = 0;
        // this.camera.position.y = -64;
        // this.camera.position.z = 3;


        this.cameraController = new THREE.Object3D();
        this.cameraController.add(this.camera);
        this.cameraTarget = new THREE.Vector3(0,0,zLookAtOffset);



		this.scene = new THREE.Scene();
        this.scene.add(this.cameraController);
        // this.scene.add(this.camera);



		// const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        // ambient.position.set( 0.5, 1, 0.25 );
		// this.scene.add(ambient);
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
		container.appendChild( this.renderer.domElement );


        // let controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.setEnvironment();
        
        this.active = false;
        this.load();

        window.addEventListener('resize', this.resize.bind(this) );

        document.addEventListener('keydown', this.keyDown.bind(this));
        document.addEventListener('keyup', this.keyUp.bind(this));

        document.addEventListener('touchstart', this.mouseDown.bind(this) );
        document.addEventListener('touchend', this.mouseUp.bind(this) );
        document.addEventListener('mousedown', this.mouseDown.bind(this) );
        document.addEventListener('mouseup', this.mouseUp.bind(this) );
        
        this.spaceKey = false;

        const btn = document.getElementById('playBtn');
        btn.addEventListener('click', this.startGame.bind(this));
	}
	
    startGame(){
        const gameover = document.getElementById('gameover');
        const instructions = document.getElementById('instructions');
        const btn = document.getElementById('playBtn');

        gameover.style.display = 'none';
        instructions.style.display = 'none';
        btn.style.display = 'none';

        this.score = 0;
        this.bonusScore = 0;
        this.lives = 3;

        let elm = document.getElementById('score');
        elm.innerHTML = this.score;
        
        elm = document.getElementById('lives');
        elm.innerHTML = this.lives;

        this.plane.reset();
        this.terrainA.reset(0);
        this.terrainB.reset(1);
        this.obstacles.reset();

        this.active = true;

        this.sfx.play('engine');
    }

    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight ); 
    }

    keyDown(evt){
        switch(evt.keyCode){
            case 32:
                this.spaceKey = true; 
                break;
        }
    }
    
    keyUp(evt){
        switch(evt.keyCode){
            case 32:
                this.spaceKey = false;
                break;
        }
    }

    mouseDown(evt){
        this.spaceKey = true;
    }

    mouseUp(evt){
        this.spaceKey = false;
    }

    setEnvironment(){
        const loader = new RGBELoader().setPath(this.assetsPath);
        const pmremGenerator = new THREE.PMREMGenerator( this.renderer );
        pmremGenerator.compileEquirectangularShader();
        
        const self = this;
        
        loader.load( 'hdr/venice_sunset_1k.hdr', ( texture ) => {
          const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
          pmremGenerator.dispose();

          self.scene.environment = envMap;

        }, undefined, (err)=>{
            console.error( err.message );
        } );

        const color = 0xaac5aa;  // white
        const near = 10;
        const far = 512;
        this.scene.fog = new THREE.Fog(color, near, far);
    }
    
	load(){
        this.loadSkybox();
        this.renderer.setAnimationLoop(this.render.bind(this));
        this.loading = true;
        this.loadingBar.visible = true;

        this.plane = new Plane(this);
        this.terrainA = new Terrain(this, 0);
        this.terrainB = new Terrain(this, 1);
        this.obstacles = new Obstacles(this);

        this.loadSFX();

    }

    loadSFX(){
        this.sfx = new SFX(this.camera, this.assetsPath + 'plane/');

        this.sfx.load('explosion');
        this.sfx.load('engine', true);
        this.sfx.load('gliss');
        this.sfx.load('gameover');
        this.sfx.load('bonus');
    }

    loadSkybox(){
        this.scene.background = new THREE.CubeTextureLoader()
	        .setPath( `${this.assetsPath}/plane/paintedsky/` )
            .load( [
                'px.jpg',
                'nx.jpg',
                'py.jpg',
                'ny.jpg',
                'pz.jpg',
                'nz.jpg'
            ], () => {
                this.renderer.setAnimationLoop(this.render.bind(this));
            } );
    }
    
    gameOver(){
        this.active = false;

        const gameover = document.getElementById('gameover');
        const btn = document.getElementById('playBtn');

        gameover.style.display = 'block';
        btn.style.display = 'block';

        this.plane.visible = false;

        this.sfx.stopAll();
        this.sfx.play('gameover');
    }

    incScore(){
        this.score++;

        const elm = document.getElementById('score');

        if (this.score % 3==0){
            this.bonusScore += 3;
            this.sfx.play('bonus');
        }else{
            this.sfx.play('gliss');
        }

        elm.innerHTML = this.score + this.bonusScore;
    }

    decLives(){
        this.lives--;

        const elm = document.getElementById('lives');

        elm.innerHTML = this.lives;

        if (this.lives==0) setTimeout(this.gameOver.bind(this), 1200);

        this.sfx.play('explosion');
    }

    updateCamera(){
        this.cameraController.position.copy( this.plane.position );
        this.cameraTarget.copy(this.plane.position);
        this.camera.lookAt( this.cameraTarget );
    }

	render() {
        if (this.loading){
            if (this.plane.ready && this.obstacles.ready){
                this.loading = false;
                this.loadingBar.visible = false;
            }else{
                return;
            }
        }

        const dt = this.clock.getDelta();
        const time = this.clock.getElapsedTime();

        this.plane.update(time);
        // this.terrainA.size
        if(this.plane.position.z > this.terrainA.plane.position.z + this.terrainA.size/2){
            // console.log('terrainA Past End');
            this.terrainA.updateOffset();
        }

        if(this.plane.position.z > this.terrainB.plane.position.z + this.terrainB.size/2){
            // console.log('terrainB Past End');
            this.terrainB.updateOffset();
        }
        
        this.terrainA.update();
        this.terrainB.update();

        if (this.active){
            this.obstacles.update(this.plane.position, dt);
        }
    
        this.updateCamera();
    
        this.renderer.render( this.scene, this.camera );

    }
}

export { Game };