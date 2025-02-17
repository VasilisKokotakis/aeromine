import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 🎯 **SCENE SETUP** 🎯
const scene = new THREE.Scene();
const perspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
perspectiveCamera.position.z = 5; // set the camera Z position!
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff); // ✅ Set background color to white
document.body.appendChild(renderer.domElement);

// 🔥 **LIGHTING**
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // ✅ Soft global light
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// 🌀 **ORBIT CONTROLS** (Allows user to rotate/zoom)
const controls = new OrbitControls(perspectiveCamera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 1;
controls.maxDistance = 20;

// 🏢 **LOAD THE 3D BUILDINGS MODEL**
const loader = new GLTFLoader();
let model;
const markers = []; // ✅ Array to store clickable markers

loader.load('/public/Models/lato/Lato_lights.gltf', (gltf) => {
  model = gltf.scene;
  scene.add(model);

  // 🎯 Auto-scale and center the model
  // THis is to trigger git
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  box.getSize(size);
  const center = new THREE.Vector3();
  box.getCenter(center);

  // ✅ Adjust the model scale & position
  const scaleFactor = 0.01;
  model.scale.set(scaleFactor, scaleFactor, scaleFactor);
  model.position.set(-center.x * scaleFactor, -center.y * scaleFactor, -center.z * scaleFactor);

  // 🏷️ **ADD MARKERS ON BUILDINGS**
  addMarker(new THREE.Vector3(0, 2, 0), "Building A", "buildingA.jpg", "This is Building A.");
  addMarker(new THREE.Vector3(5, 2, -3), "Building B", "buildingB.jpg", "This is Building B.");
}, undefined, (error) => {
  console.error('Error loading model:', error);
});

// 📍 **FUNCTION TO CREATE MARKERS**
function addMarker(position, name, imgSrc, description) {
  const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16); // ✅ Smaller sphere
  const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);

  marker.position.copy(position);
  marker.userData = { name, imgSrc, description }; // ✅ Store building info
  scene.add(marker);
  markers.push(marker);
}

// 🎯 **CLICK DETECTION WITH RAYCASTING**
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
  // ✅ Convert mouse click position to Three.js coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, perspectiveCamera);
  const intersects = raycaster.intersectObjects(markers);

  if (intersects.length > 0) {
    const selectedMarker = intersects[0].object;
    showInfoPanel(selectedMarker.userData);
  }
}

window.addEventListener('click', onMouseClick);

// 📜 **SHOW INFO PANEL WHEN MARKER IS CLICKED**
function showInfoPanel(data) {
  document.getElementById('buildingTitle').textContent = data.name;
  document.getElementById('buildingImage').src = data.imgSrc;
  document.getElementById('buildingDescription').textContent = data.description;
  document.getElementById('infoPanel').style.right = '0'; // ✅ Slide in panel
}

// ❌ **CLOSE INFO PANEL**
document.getElementById('closePanel').addEventListener('click', () => {
  document.getElementById('infoPanel').style.right = '-30%'; // ✅ Slide out panel
});

// 🎬 **ANIMATION LOOP**
function animate() {
  controls.update();
  renderer.render(scene, perspectiveCamera);
}
renderer.setAnimationLoop(animate);
