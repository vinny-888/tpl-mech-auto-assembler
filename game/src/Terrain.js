import * as THREE from '../libs/three137/three.module.js';

import { createNoise2D } from '../libs/SimplexNoise.js';
// import { vertexShader, fragmentShader } from './Shader1.js';
import { vertexShader, fragmentShader } from './Shader2.js';

class Terrain{
    constructor(game, offset){
        this.size = 512;
        this.overlap = this.size/32;
        this.offset = offset;
        this.game = game;
        this.scene = game.scene;
        this.camera = game.camera;
        this.load();
    }

    load(){
        this.setupNoise();
        this.setupPlane();
        this.setupLights();
    }

    reset(offset){
        this.offset = offset;
        this.plane.position.z = this.offset * (this.size - this.overlap);
    }

    updateOffset(){
        this.offset+=2;
        this.plane.position.z = this.offset * (this.size - this.overlap);
    }

    update() {
        let offset = Date.now() * 0.0004;
        // this.adjustVertices(offset);

        
        // this.adjustCameraPos(offset);
    }

    setupNoise() {
        // By zooming y more than x, we get the
        // appearence of flying along a valley
        this.xZoom = 6;
        this.yZoom = 18;
        this.noiseStrength = 1.5;
        this.noise2D = createNoise2D();
    }

    setupPlane() {
        this.geometry = new THREE.PlaneGeometry(this.size*2, this.size, 128, 128);
        // let material = new THREE.MeshStandardMaterial({
        //     roughness: 0.8,
        //     color: new THREE.Color(0x00c500),
        // });

        // var texture, material, plane;

        // texture = THREE.ImageUtils.loadTexture( "../img/texture.jpg" );

        // // assuming you want the texture to repeat in both directions:
        // texture.wrapS = THREE.RepeatWrapping; 
        // texture.wrapT = THREE.RepeatWrapping;

        // // how many times to repeat in each direction; the default is (1,1),
        // //   which is probably why your example wasn't working
        // texture.repeat.set( 4, 4 ); 

        // material = new THREE.MeshLambertMaterial({ map : texture });
        // plane = new THREE.Mesh(new THREE.PlaneGeometry(400, 3500), material);
        // plane.material.side = THREE.DoubleSide;



        // texture used to generate "bumpiness"
        var bumpTexture = new THREE.ImageUtils.loadTexture( './src/images/heightmap.png' );
        bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping; 
        // magnitude of normal displacement
        var bumpScale   = 5.0;

        var oceanTexture = new THREE.ImageUtils.loadTexture( './src/images/dirt-512.jpg' );
	    oceanTexture.wrapS = oceanTexture.wrapT = THREE.RepeatWrapping; 
        
        var sandyTexture = new THREE.ImageUtils.loadTexture( './src/images/sand-512.jpg' );
        sandyTexture.wrapS = sandyTexture.wrapT = THREE.RepeatWrapping; 
        
        var grassTexture = new THREE.ImageUtils.loadTexture( './src/images/grass-512.jpg' );
        grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping; 
        
        var rockyTexture = new THREE.ImageUtils.loadTexture( './src/images/rock-512.jpg' );
        rockyTexture.wrapS = rockyTexture.wrapT = THREE.RepeatWrapping; 
        
        var snowyTexture = new THREE.ImageUtils.loadTexture( './src/images/snow-512.jpg' );
        snowyTexture.wrapS = snowyTexture.wrapT = THREE.RepeatWrapping; 

        // var planeGeo = new THREE.PlaneGeometry( 1000, 1000, 100, 100 );
        // var plane = new THREE.Mesh(	planeGeo, customMaterial );
        // plane.rotation.x = -Math.PI / 2;
        // plane.position.y = -100;
        // scene.add( plane );

        var waterGeo = new THREE.PlaneGeometry( 1000, 1000, 1, 1 );
        var waterTex = new THREE.ImageUtils.loadTexture( './src/images/water512.jpg' );
        waterTex.wrapS = waterTex.wrapT = THREE.RepeatWrapping; 
        waterTex.repeat.set(5,5);
        var waterMat = new THREE.MeshBasicMaterial( {map: waterTex, transparent:true, opacity:0.40} );
        var water = new THREE.Mesh(	this.plane, waterMat );
        water.rotation.x = -Math.PI / 2;
        water.position.y = -50;
        this.scene.add( water);

        
        // use "this." to create global object
        let customUniforms = {
            bumpTexture:	{ type: "t", value: bumpTexture },
            bumpScale:	    { type: "f", value: bumpScale },
            oceanTexture:	{ type: "t", value: oceanTexture },
            sandyTexture:	{ type: "t", value: sandyTexture },
            grassTexture:	{ type: "t", value: grassTexture },
            rockyTexture:	{ type: "t", value: rockyTexture },
            snowyTexture:	{ type: "t", value: snowyTexture },
        };
        
        // create custom material from the shader code above
        //   that is within specially labelled script tags
        var material = new THREE.ShaderMaterial( 
        {
            uniforms: customUniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
            // side: THREE.DoubleSide
        }   );




        // const material = new THREE.ShaderMaterial( {
        //     uniforms: {
        //         time: { value: 1.0 },
        //         resolution: { value: new THREE.Vector2() }
        //     },
        //     vertexShader: vertexShader,
        //     fragmentShader: fragmentShader
        // } );

        this.plane = new THREE.Mesh(this.geometry, material);
        this.plane.rotation.x = Math.PI/2 * 3;
        this.plane.position.y = -10;
        this.plane.position.z = this.offset * (this.size - this.overlap);
        // this.plane.scale.set(0.5,0.5,0.5);
        this.plane.castShadow = true;
        this.plane.receiveShadow = true;

        this.scene.add(this.plane);
    }

    setupLights() {
        let ambientLight = new THREE.AmbientLight(0x0c0c0c);
        this.scene.add(ambientLight);
        
        // let spotLight = new THREE.SpotLight(0xcccccc);
        // spotLight.position.set(-30, 60, 60);
        // spotLight.castShadow = true;
        // this.scene.add(spotLight);
    }

    adjustVertices(offset) {
        if(this.plane.geometry.attributes){
            const position = this.plane.geometry.attributes.position.array;

            for (let i = 0; i < position.length; i+=3) {
                let x1 = position[ i ];
                let y1 = position[ i+1 ];
                let z1 = position[ i+2 ];

                let x = x1 / this.xZoom;
                let y = y1 / this.yZoom;
                let noise = this.noise2D(x, y + offset) * this.noiseStrength; 
                position[ i+2 ] = noise;
            }
            this.geometry.verticesNeedUpdate = true;
            this.geometry.computeVertexNormals();
        }
    }

    adjustCameraPos(offset) {  
        let x = this.camera.position.x / this.xZoom;
        let y = this.camera.position.y / this.yZoom;
        let noise = this.noise2D(x, y + offset) * this.noiseStrength + 1.5; 
        this.camera.position.z = noise;
    }
}

export { Terrain };
