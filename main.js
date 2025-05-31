import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

let scene, camera, renderer, labelRenderer, controls;
let wordObjects = [];

// --- DATA ---
const wordData = [
    // Example from previous discussion: "Leadership Roles"
    // X: Scope of Authority, Y: Source/Nature of Power, Z: Sentiment/Connotation
    // Scale these values appropriately for visualization (e.g., -5 to 5, or 0 to 10)
    { text: "King",    x: 4, y: 4, z: 1,   color: 0xffd700 }, // Gold
    { text: "Queen",   x: 3.8, y: 3.9, z: 1, color: 0xffd700 }, // Gold
    { text: "President", x: 4, y: -2, z: 0.8, color: 0x007bff }, // Blue
    { text: "CEO",     x: -2, y: -3, z: 0,   color: 0x28a745 }, // Green
    { text: "Manager", x: -3, y: -3.5, z: 0, color: 0x17a2b8 }, // Teal
    { text: "Leader",  x: 0, y: 0, z: 2,   color: 0xffffff }, // White (general)
    { text: "Boss",    x: -2.5, y: -3.2, z: -1,  color: 0x6c757d }, // Gray
    { text: "Tyrant",  x: 3.5, y: 3, z: -4,  color: 0xdc3545 }, // Red

    // Add more words with different semantic & characteristic relationships
    { text: "Dog",     x: -5, y: 5, z: 3, color: 0x8B4513 }, // Brown (Animal category)
    { text: "Cat",     x: -4.5, y: 4.5, z: 2.5, color: 0xA9A9A9 }, // DarkGray
    { text: "Loyal",   x: -5.2, y: 5.2, z: 3.5, color: 0x00FF00 }, // Adjective near Dog, positive
    { text: "Fierce",  x: -4.3, y: 4.3, z: -2, color: 0xFF0000 }, // Adjective near Cat, negative/strong

    { text: "Apple (Fruit)", x: 5, y: -5, z: 2, color: 0x90EE90 }, // LightGreen
    { text: "Apple (Tech)",  x: 5.5, y: -5.5, z: 1, color: 0xD3D3D3 }, // LightGray - same name, different context
];

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);
    scene.fog = new THREE.Fog(0x222222, 10, 50); // Fog for depth perception

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 5, 15); // Adjusted initial camera position

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Label Renderer
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    document.body.appendChild(labelRenderer.domElement);

    // Controls
    controls = new OrbitControls(camera, labelRenderer.domElement); // Use labelRenderer's domElement for events
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false; // True to pan in screen space
    controls.minDistance = 2;
    controls.maxDistance = 50;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Axes Helper (optional, but useful)
    const axesHelper = new THREE.AxesHelper(10); // Length of 10 units
    scene.add(axesHelper);
    // Add axis labels (X, Y, Z)
    createAxisLabel('X', new THREE.Vector3(11, 0, 0), 'red');
    createAxisLabel('Y', new THREE.Vector3(0, 11, 0), 'green');
    createAxisLabel('Z', new THREE.Vector3(0, 0, 11), 'blue');


    // Create word spheres
    wordData.forEach(data => {
        createWordSphere(data);
    });

    // Event Listeners
    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function createAxisLabel(text, position, color) {
    const div = document.createElement('div');
    div.className = 'label'; // Use the same class or a specific one
    div.textContent = text;
    div.style.color = color;
    div.style.fontSize = '16px';
    div.style.fontWeight = 'bold';

    const label = new CSS2DObject(div);
    label.position.copy(position);
    scene.add(label); // Add to the main scene, not a specific object
}


function createWordSphere(data) {
    const geometry = new THREE.SphereGeometry(0.3, 32, 32); // Radius 0.3
    const material = new THREE.MeshStandardMaterial({
        color: data.color || 0xffffff,
        roughness: 0.5,
        metalness: 0.1
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(data.x, data.y, data.z);
    scene.add(sphere);

    // Create Label
    const wordDiv = document.createElement('div');
    wordDiv.className = 'label';
    wordDiv.textContent = data.text;
    const wordLabel = new CSS2DObject(wordDiv);
    wordLabel.position.set(0, 0.4, 0); // Offset slightly above the sphere
    sphere.add(wordLabel); // Attach label to the sphere

    wordObjects.push(sphere);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Only required if controls.enableDamping or autoRotate are set to true
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

// --- Start ---
init();