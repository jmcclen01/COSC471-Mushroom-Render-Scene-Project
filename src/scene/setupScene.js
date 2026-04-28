import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Creates the WebGL renderer, which is what actually draws the 3D scene to the browser.
 * Alpha is enabled so the background/backdrop can show cleanly behind the scene.
 */
export function createRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearAlpha(0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  return renderer;
}

/**
 * Creates the Three.js scene container.
 * Objects, lights, and the backdrop all get added to this scene.
 */
export function createScene() {
  return new THREE.Scene();
}

/**
 * Creates the camera used to view the scene.
 * The position is angled so the mushroom, pedestal, and lighting are visible immediately.
 */
export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(4.5, 3.6, 7.2);
  return camera;
}

/**
 * Adds orbit controls so the user can rotate, pan, and zoom around the mushroom.
 *
 * @param {THREE.Camera} camera - The camera being controlled.
 * @param {THREE.WebGLRenderer} renderer - The renderer whose canvas receives mouse input.
 */
export function createControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 1.3, 0);
  controls.minDistance = 3;
  controls.maxDistance = 15;
  controls.maxPolarAngle = Math.PI / 2.05;
  return controls;
}

/**
 * Creates the pedestal under the mushroom.
 * This replaced the flat ground disk so the object looks more like a display scene.
 */
export function createGround() {
  const group = new THREE.Group();

  // Top platform where the mushroom sits.
  const top = new THREE.Mesh(
    new THREE.CylinderGeometry(3, 3, 0.4, 64),
    new THREE.MeshStandardMaterial({
      color: '#2e3a2e',
      roughness: 0.9,
      metalness: 0.05,
    })
  );
  top.position.y = 0.2;
  top.receiveShadow = true;
  top.castShadow = true;

  // Lower column makes the platform feel supported instead of floating.
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 1.5, 3, 64),
    new THREE.MeshStandardMaterial({
      color: '#1f281f',
      roughness: 0.95,
      metalness: 0.02,
    })
  );
  base.position.y = -1.5;
  base.receiveShadow = true;
  base.castShadow = true;

  group.add(top);
  group.add(base);

  return group;
}

/**
 * Creates the forest background sphere.
 * The camera sits inside this sphere, so the forest texture wraps around the scene.
 */
export function createBackdrop() {
  const texture = new THREE.TextureLoader().load('/backgrounds/forest.jpg');
  texture.colorSpace = THREE.SRGBColorSpace;

  const geometry = new THREE.SphereGeometry(40, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide,
  });

  return new THREE.Mesh(geometry, material);
}

/**
 * Keeps the renderer and camera matched to the browser size.
 * Without this, resizing the window would stretch or distort the scene.
 */
export function handleResize(camera, renderer) {
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}
