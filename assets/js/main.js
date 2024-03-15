import * as THREE from './three.module.js';
import { GLTFLoader } from './GLTFLoader.js';
import { FirstPersonControls } from './FirstPersonControls.js';
import { MapControls } from './MapControls.js';



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.background = new THREE.Color(0x85a5e);
camera.position.set(0, 7, 10);
camera.lookAt(0, 7, 0);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

//Textures
const floorTexture = new THREE.TextureLoader().load('assets/textures/portalFloor.png');
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(3, 3);
const wallTexture = new THREE.TextureLoader().load('assets/textures/wallTexture.jpg');
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(1.2, 1);
const portalTexture = new THREE.TextureLoader().load('assets/textures/portal1.png');

//Lights
const dl = new THREE.DirectionalLight(0xb1c7c5, 1);
dl.position.set(8, 18, -10);
dl.lookAt(0, 0.5, 10);
scene.add(dl);

const al = new THREE.AmbientLight(0xb1c7c5, 0.3);
scene.add(al);

const rectLight = new THREE.RectAreaLight(0x73fdff, 1.5, 50, 0.5);
rectLight.position.set(-19.99, 1, 0);
rectLight.rotation.set(0, -Math.PI / 2, 0);
scene.add(rectLight)

const rectLight2 = new THREE.RectAreaLight(0x73fdff, 1.5, 50, 2);
rectLight2.position.set(-19.99, 0, 0);
rectLight2.rotation.set(Math.PI / 2, 0, -Math.PI / 2);
scene.add(rectLight2);

const rectLightInverted = new THREE.RectAreaLight(0x73fdff, 1.5, 50, 0.5);
rectLightInverted.position.set(19.99, 1, 0); 
rectLightInverted.rotation.set(0, Math.PI / 2, 0); 
scene.add(rectLightInverted);

const rectLight2Inverted = new THREE.RectAreaLight(0x73fdff, 1.5, 50, 2);
rectLight2Inverted.position.set(19.99, 0, 0); 
rectLight2Inverted.rotation.set(Math.PI / 2, 0, -Math.PI / 2); 
scene.add(rectLight2Inverted);

// 3D Models
const buttonLoader = new GLTFLoader();
buttonLoader.load('assets/button/scene.gltf',
    function (gltf) {
        gltf.scene.scale.set(4, 4, 4);
        gltf.scene.position.y = 0.5;
        gltf.scene.position.z = 10;
        scene.add(gltf.scene);
    },
    function (progress) {
        console.log((progress.loaded / progress.total * 100) + '% loaded');
    },
    function (error) {
        console.error('Error loading GLTF model:', error);
    }
);

const doorLoader = new GLTFLoader();
doorLoader.load('assets/door/scene.gltf',
    function (gltf) {
        gltf.scene.scale.set(5, 5, 5);
        gltf.scene.position.set(7, 0.5, -19.7);
        scene.add(gltf.scene);
    },
    function (progress) {
        console.log((progress.loaded / progress.total * 100) + '% loaded');
    },
    function (error) {
        console.error('Error loading GLTF model:', error);
    }
);

const doorLoader2 = new GLTFLoader();
doorLoader2.load('assets/door/scene.gltf',
    function (gltf) {
        gltf.scene.scale.set(5, 5, 5);
        gltf.scene.position.set(20, 0.5, 10);
        gltf.scene.rotation.set(0, -Math.PI/2, 0);
        scene.add(gltf.scene);
    },
    function (progress) {
        console.log((progress.loaded / progress.total * 100) + '% loaded');
    },
    function (error) {
        console.error('Error loading GLTF model:', error);
    }
);

//3D Model Cube with Animation
let cube;
const cubeLoader = new GLTFLoader();
cubeLoader.load('assets/cube/scene.gltf',
    function (gltf) {
        cube = gltf.scene;
        cube.scale.set(0.7, 0.7, 0.7);
        cube.position.set(-12.3, 2, -12.3);
        scene.add(cube);
    },
    function (progress) {
        console.log((progress.loaded / progress.total * 100) + '% loaded');
    },
    function (error) {
        console.error('Error loading GLTF model:', error);
    }
);

let targetX = 0;
let targetZ = 0;

function animateCube() {
    targetX = Math.random() * 20 - 10;
    targetZ = Math.random() * 20 - 10;
}

//Floor and Roof
const floorGeometry = new THREE.BoxGeometry(40, 1, 40);
const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
const roof = new THREE.Mesh(floorGeometry, floorMaterial);
floor.receiveShadow = true;
scene.add(floor);
scene.add(roof);
roof.position.y = 20;

//Walls
const wallGeometry = new THREE.BoxGeometry(1, 20, 40);
const wallGeometry2 = new THREE.BoxGeometry(40, 20, 1);
const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });
const wall = new THREE.Mesh(wallGeometry, wallMaterial);
const wall2 = new THREE.Mesh(wallGeometry2, wallMaterial);
const wall3 = new THREE.Mesh(wallGeometry, wallMaterial);
const wall4 = new THREE.Mesh(wallGeometry2, wallMaterial);
scene.add(wall);
scene.add(wall2);
scene.add(wall3);
scene.add(wall4);

//Wall adjustments
wall.position.x = -20.5;
wall.position.y = 9.5;
wall2.position.y = 9.5;
wall2.position.z = -20.5;
wall3.position.x = 20.5;
wall3.position.y = 9.5;
wall4.position.y = 9.5;
wall4.position.z = 20.5;

//function for circles
function createCircle(x, y, z) {
    const circleGeometry = new THREE.CircleGeometry(.7, 32);
    const circleMaterial = new THREE.MeshBasicMaterial({ color: 0x3de8ff });
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);

    circle.rotation.x = -Math.PI / 2;
    circle.position.set(x, y, z);

    return circle;
}

function createCircle2(x, y, z) {
    const circleGeometry = new THREE.CircleGeometry(.7, 32);
    const circleMaterial = new THREE.MeshBasicMaterial({ color: 0x3de8ff });
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);

    circle.rotation.x = 0;
    circle.position.set(x, y, z);

    return circle;
}

//circles
const circle = createCircle(0, 0.53, 3);
const circle2 = createCircle(0, 0.53, 1);
const circle3 = createCircle(0, 0.53, -1);
const circle4 = createCircle(0, 0.53, -3);
const circle5 = createCircle(0, 0.53, -5);
const circle6 = createCircle(0, 0.53, -7);
const circle7 = createCircle(-2, 0.53, -7);
const circle8 = createCircle(-4, 0.53, -7);
const circle9 = createCircle(-6, 0.53, -7);
const circle10 = createCircle(-6, 0.53, -9);
const circle11 = createCircle(-6, 0.53, -11);
const circle12 = createCircle(-6, 0.53, -13);
const circle13 = createCircle(-6, 0.53, -15);
const circle14 = createCircle(-6, 0.53, -17);
const circle15 = createCircle(-6, 0.53, -19);
const circle16 = createCircle2(-6, 2, -19.98);
const circle17 = createCircle2(-6, 4, -19.98);
scene.add(circle);
scene.add(circle2);
scene.add(circle3);
scene.add(circle4);
scene.add(circle5);
scene.add(circle6);
scene.add(circle7);
scene.add(circle8);
scene.add(circle9);
scene.add(circle10);
scene.add(circle11);
scene.add(circle12);
scene.add(circle13);
scene.add(circle14);
scene.add(circle15);
scene.add(circle16);
scene.add(circle17);

//Function for lights each circle
function createPointLight(x, y, z, color, intensity, distance) {
    const pointLight = new THREE.PointLight(color, intensity, distance);
    pointLight.position.set(x, y, z);
    return pointLight;
}

//Point lights
const pointLight1 = createPointLight(0, 1.5, 3, 0x73fdff, 2, 200);
const pointLight2 = createPointLight(0, 1.5, 1, 0x73fdff, 2, 200);
const pointLight3 = createPointLight(0, 1.5, -1, 0x73fdff, 2, 200);
const pointLight4 = createPointLight(0, 1.5, -3, 0x73fdff, 2, 200);
const pointLight5 = createPointLight(0, 1.5, -5, 0x73fdff, 2, 200);
const pointLight6 = createPointLight(0, 1.5, -7, 0x73fdff, 2, 200);
const pointLight7 = createPointLight(-2, 1.5, -7, 0x73fdff, 2, 200);
const pointLight8 = createPointLight(-4, 1.5, -7, 0x73fdff, 2, 200);
const pointLight9 = createPointLight(-6, 1.5, -7, 0x73fdff, 2, 200);
const pointLight10 = createPointLight(-6, 1.5, -9, 0x73fdff, 2, 200);
const pointLight11 = createPointLight(-6, 1.5, -11, 0x73fdff, 2, 200);
const pointLight12 = createPointLight(-6, 1.5, -13, 0x73fdff, 2, 200);
const pointLight13 = createPointLight(-6, 1.5, -15, 0x73fdff, 2, 200);
const pointLight14 = createPointLight(-6, 1.5, -17, 0x73fdff, 2, 200);
const pointLight15 = createPointLight(-6, 1.5, -19, 0x73fdff, 2, 200);
const pointLight16 = createPointLight(-6, 3.5, -19, 0x73fdff, 2, 200);
const pointLight17 = createPointLight(-6, 5.5, -19, 0x73fdff, 2, 200);
scene.add(pointLight1);
scene.add(pointLight2);
scene.add(pointLight3);
scene.add(pointLight4);
scene.add(pointLight5);
scene.add(pointLight6);
scene.add(pointLight7);
scene.add(pointLight8);
scene.add(pointLight9);
scene.add(pointLight10);
scene.add(pointLight11);
scene.add(pointLight12);
scene.add(pointLight13);
scene.add(pointLight14);
scene.add(pointLight15);
scene.add(pointLight16);
scene.add(pointLight17);

//plane
const planeGeometry = new THREE.PlaneGeometry(2, 2);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x3de8ff, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.position.set(-6, 6, -19.98);

//X Mark
const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

const lineGeometry1 = new THREE.BoxGeometry(2, 0.1, 0.1);
const line1 = new THREE.Mesh(lineGeometry1, lineMaterial);
line1.position.set(0, 0, 0);
line1.rotation.z = -Math.PI / 4;
plane.add(line1);

const lineGeometry2 = new THREE.BoxGeometry(2, 0.1, 0.1);
const line2 = new THREE.Mesh(lineGeometry2, lineMaterial);
line2.position.set(0, 0, 0);
line2.rotation.z = Math.PI / 4;
plane.add(line2);

//LEDs
const ledMaterial = new THREE.MeshBasicMaterial({ color: 0x73fdff });
const ledGeometry = new THREE.BoxGeometry(0.1, 0.1, 40);
const led = new THREE.Mesh(ledGeometry, ledMaterial);
const led2 = new THREE.Mesh(ledGeometry, ledMaterial);
led.position.set(-19.98, 0.5, 0);
led2.position.set(19.98, 0.5, 0);
scene.add(led);
scene.add(led2);

// Portal
const portalGeometry = new THREE.PlaneGeometry(10, 15);
const portalMaterial = new THREE.MeshBasicMaterial({ map: portalTexture, transparent: true });
const portal = new THREE.Mesh(portalGeometry, portalMaterial);
scene.add(portal);
portal.position.set(-12, 0.8, 3);
portal.rotation.set(-Math.PI / 2, 0, 0);

//Portal Light
const portalLight = createPointLight(-12, 6, 9, 0xFFA500, 10, 900);
const portalLight2 = createPointLight(-12, 6, -2, 0xFFA500, 10, 900);
scene.add(portalLight);
scene.add(portalLight2);

//Particles
let stars, starGeo;
const areaSize = 7;

particles();

function particles() {
    const points = [];
    const position = new THREE.Vector3(-12, 0, 3);

    for (let i = 0; i < 60; i++) {
        let star = new THREE.Vector3(
            Math.random() * areaSize - areaSize / 2 + position.x,
            Math.random() * 20 + position.y,
            Math.random() * areaSize - areaSize / 2 + position.z
        );
        points.push(star);
    }

    starGeo = new THREE.BufferGeometry().setFromPoints(points);

    let sprite = new THREE.TextureLoader().load("assets/textures/star.png");
    let starMaterial = new THREE.PointsMaterial({
        color: 0xFFA500,
        size: 0.7,
        map: sprite,
        vertexColors: THREE.NoColors
    });

    stars = new THREE.Points(starGeo, starMaterial);
    scene.add(stars);
}

function animateParticles() {
    for (let i = 0; i < starGeo.attributes.position.array.length; i += 3) {
        starGeo.attributes.position.array[i + 1] += 0.1; 

        if (starGeo.attributes.position.array[i + 1] > 14) {
            starGeo.attributes.position.array[i + 1] = Math.random() * 2;
        }
    }
    starGeo.attributes.position.needsUpdate = true;
}

//First Person
const fpControls = new FirstPersonControls(camera, renderer.domElement);

// const controls = new MapControls(camera, renderer.domElement);
// controls.enableDamping = true;

function animate() {
    requestAnimationFrame(animate);

    fpControls.update(1.0);

    //controls.update();

    animateParticles();

    if (cube) {
        cube.position.x += (targetX - cube.position.x) * 0.01;
        cube.position.z += (targetZ - cube.position.z) * 0.01;
    }

    renderer.render(scene, camera);
}
animate();
setInterval(animateCube, 2000);