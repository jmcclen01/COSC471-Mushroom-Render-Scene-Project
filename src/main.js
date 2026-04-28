import * as THREE from 'three';
import './style.css';

import {
  createBackdrop,
  createCamera,
  createControls,
  createGround,
  createRenderer,
  createScene,
  handleResize,
} from './scene/setupScene.js';
import { createMushroom } from './objects/createMushroom.js';
import { createLights } from './scene/createLights.js';
import { createGui } from './ui/createGui.js';
import { createOverlay } from './utils/createOverlay.js';

/**
 * main.js is the main starting point for the project.
 * This file pulls together the renderer, scene, camera, model, lights, GUI,
 * and animation loop so the rest of the project can stay split into smaller files.
 */

const app = document.querySelector('#app');

// Create the WebGL renderer and attach its canvas to the page.
const renderer = createRenderer();
app.appendChild(renderer.domElement);

// Basic Three.js setup: scene holds objects, camera views them, controls let the user orbit.
const scene = createScene();
const camera = createCamera();
const controls = createControls(camera, renderer);

// Add the display pedestal and forest-style backdrop.
const ground = createGround();
scene.add(ground);
scene.add(createBackdrop());

// Load the mushroom model. If the OBJ fails, the backup mushroom appears instead.
const mushroom = createMushroom();
mushroom.position.y = 0.02;
scene.add(mushroom);

// Add all scene lights and store references so the GUI can edit them live.
const lights = createLights(scene);

/**
 * Small shared state object for scene-level toggles.
 * The GUI changes these values, and the animation loop reads them every frame.
 */
const sceneState = {
  autoRotate: true,
  wireframe: false,
};

/**
 * Restores the main light settings back to our default look.
 * This is connected to the Reset Lighting button in the GUI.
 */
function resetLighting() {
  lights.mainLight.intensity = 2.5;
  lights.mainLight.color.set('#ffd8b1');
  lights.mainLight.position.set(4, 6, 3);
  lights.ambientLight.intensity = 0.45;
}

// Build the user interface and instruction overlay.
createGui({ lights, mushroom, sceneState, resetLighting });
createOverlay();
handleResize(camera, renderer);

const clock = new THREE.Clock();

/**
 * Main render loop.
 * This function runs once per frame, updates movement/controls, and redraws the scene.
 */
function animate() {
  const elapsed = clock.getElapsedTime();

  // Auto-rotate is mostly for presentation so the lighting and texture can be seen from all sides.
  if (sceneState.autoRotate) {
    mushroom.rotation.y = elapsed * 0.35;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
