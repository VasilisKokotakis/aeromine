import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
const perspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// OrbitControls setup
const controls = new OrbitControls(perspectiveCamera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 1;
controls.maxDistance = 20;

// Load the GLTF model with auto-scaling and centering
const loader = new GLTFLoader();
let model;
loader.load(
  '/Models/lato/Lato_lights.gltf', 
  (gltf) => {
    model = gltf.scene;
    scene.add(model);

    // Get model size and center
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Scale Factor (Adjusted based on model size)
    const scaleFactor = 0.01;
    model.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // Center the model properly
    model.position.set(-center.x * scaleFactor, -center.y * scaleFactor, -center.z * scaleFactor);
    
    // Adjust Y position slightly if needed
    model.position.y += 1;
  },
  undefined,
  (error) => {
    console.error('An error occurred while loading the model:', error);
  }
);

// Camera setup
perspectiveCamera.position.set(0, 1, 5);
perspectiveCamera.lookAt(0, 0, 0);

// Orthographic camera for predefined views
const aspect = window.innerWidth / window.innerHeight;
const orthoCamera = new THREE.OrthographicCamera(-aspect * 5, aspect * 5, 5, -5, 0.1, 1000);
orthoCamera.lookAt(0, 0, 0);

// Camera positions for each view
const cameraPositions = {
  top: [0, 10, 0],
  front: [0, 0, 10],
  back: [0, 0, -10],
  left: [-10, 0, 0],
  right: [10, 0, 0],
  bottom: [0, -10, 0],
};

// Animation setup
let animateModel = false;
function toggleAnimation() {
  animateModel = !animateModel;
  const button = document.getElementById('animateButton');
  button.textContent = animateModel ? 'Stop Animation' : 'Start Animation';
}

// Switch camera view function
function switchView(view) {
  if (view === 'perspective') {
    controls.enabled = true;
    return;
  }
  controls.enabled = false;
  const [x, y, z] = cameraPositions[view];
  orthoCamera.position.set(x, y, z);
  orthoCamera.lookAt(0, 0, 0);
}

// Animation loop
function animate() {
  controls.update();

  if (animateModel && model) {
    model.rotation.y += 0.01;
    model.position.x = Math.sin(Date.now() * 0.001) * 1;
  }

  const activeCamera = controls.enabled ? perspectiveCamera : orthoCamera;
  renderer.render(scene, activeCamera);
}
renderer.setAnimationLoop(animate);

// Button Event Listeners
document.getElementById('perspectiveView').addEventListener('click', () => {
  controls.enabled = true;
});

document.getElementById('floorPlanView').addEventListener('click', () => {
  controls.enabled = false;
  switchView('top');
});

document.getElementById('frontView').addEventListener('click', () => {
  controls.enabled = false;
  switchView('front');
});

document.getElementById('backView').addEventListener('click', () => {
  controls.enabled = false;
  switchView('back');
});

document.getElementById('leftView').addEventListener('click', () => {
  controls.enabled = false;
  switchView('left');
});

document.getElementById('rightView').addEventListener('click', () => {
  controls.enabled = false;
  switchView('right');
});

document.getElementById('bottomView').addEventListener('click', () => {
  controls.enabled = false;
  switchView('bottom');
});

document.getElementById('infoButton').addEventListener('click', () => {
  const modelInfoUrl = 'https://en.wikipedia.org/wiki/Dinosaur';
  window.open(modelInfoUrl, '_blank');
});

document.getElementById('changeBgButton').addEventListener('click', () => {
  const colors = ['white', 'lightblue', 'lightgreen', 'pink'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  renderer.setClearColor(randomColor);
});

document.getElementById('animateButton').addEventListener('click', toggleAnimation);
