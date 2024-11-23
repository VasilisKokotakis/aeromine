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

// Load the glTF model with auto-scaling and centering
const loader = new GLTFLoader();
loader.load(
    '/Models/alfaRomeo/scene.gltf',
    (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        // Calculate the bounding box
        const box = new THREE.Box3().setFromObject(model);

        // Get the size of the model
        const size = new THREE.Vector3();
        box.getSize(size);

        // Get the center of the model
        const center = new THREE.Vector3();
        box.getCenter(center);

        // Calculate scaling factor to fit the model into a specific size
        const maxDimension = Math.max(size.x, size.y, size.z);
        const scaleFactor = 5 / maxDimension; // Adjust the target size as needed (e.g., 2 units)

        // Apply scaling and repositioning
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);
        model.position.sub(center); // Center the model
        model.position.y += size.y * scaleFactor * 0.5; // Lift model slightly if needed

        console.log(`Model scaled with factor: ${scaleFactor}`);
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
