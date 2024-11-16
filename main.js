import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x202020);
document.body.appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// OrbitControls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth motion
controls.dampingFactor = 0.05;
controls.minDistance = 1; // Minimum zoom distance
controls.maxDistance = 20; // Maximum zoom distance
controls.enablePan = true; // Enable panning (default: true)

// Load the glTF model
const loader = new GLTFLoader();
loader.load(
    '/Models/dino/scene.gltf',
    (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        model.position.set(0, 0, 0);
        model.scale.set(0.5, 0.5, 0.5);
        model.rotation.y = Math.PI;
    },
    undefined,
    (error) => {
        console.error('An error occurred while loading the model:', error);
    }
);

// Camera position
camera.position.set(0, 1, 5);
camera.lookAt(0, 0, 0);

// Animation loop
function animate() {
    controls.update(); // Update controls on each frame
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
