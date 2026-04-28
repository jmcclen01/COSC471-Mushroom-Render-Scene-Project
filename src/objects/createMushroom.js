import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

/**
 * This file handles the mushroom object.
 * The project first shows a simple backup mushroom, then tries to replace it
 * with the downloaded OBJ/MTL mushroom model from the public/models folder.
 */

const MODEL_FOLDER = '/models/';
const OBJ_FILE = 'mushroom.obj';
const MTL_FILE = '10192_MushroomShitake_v1-L3.mtl';

/**
 * Applies shared mesh settings to every mesh inside a loaded object.
 * This mainly enables shadows and gives fallback materials if a model has no material.
 *
 * @param {THREE.Object3D} object - The loaded model or group to configure.
 */
function applyMeshSettings(object) {
  object.traverse((child) => {
    if (!child.isMesh) return;

    child.castShadow = true;
    child.receiveShadow = true;

    // If the OBJ does not bring in a real material, give it one that still reacts to light.
    if (!child.material) {
      child.material = new THREE.MeshStandardMaterial({
        color: '#b14a3b',
        roughness: 0.75,
        metalness: 0.05,
      });
    }
  });
}

/**
 * Centers the model and scales it to a consistent size.
 * Downloaded models often come in random sizes/orientations, so this keeps the demo stable.
 *
 * @param {THREE.Object3D} object - The object to center and scale.
 */
function centerAndScaleObject(object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();

  box.getSize(size);
  box.getCenter(center);

  const largestSide = Math.max(size.x, size.y, size.z);
  const targetSize = 3.2;
  const scale = largestSide > 0 ? targetSize / largestSide : 1;

  object.scale.setScalar(scale);

  // Recalculate after scaling so the model sits centered on the pedestal.
  const scaledBox = new THREE.Box3().setFromObject(object);
  const scaledCenter = new THREE.Vector3();
  scaledBox.getCenter(scaledCenter);

  object.position.x -= scaledCenter.x;
  object.position.z -= scaledCenter.z;
  object.position.y -= scaledBox.min.y;
}

/**
 * Attempts to load the downloaded OBJ mushroom.
 * It tries MTL first so textures/materials show correctly. If that fails, it still loads the OBJ.
 *
 * @param {THREE.Group} group - The group where the final mushroom should be placed.
 */
function loadObjModel(group) {
  const objLoader = new OBJLoader();
  const mtlLoader = new MTLLoader();
  mtlLoader.setPath(MODEL_FOLDER);
  objLoader.setPath(MODEL_FOLDER);

  mtlLoader.load(
    MTL_FILE,
    (materials) => {
      materials.preload();
      objLoader.setMaterials(materials);
      objLoader.load(
        OBJ_FILE,
        (object) => {
          group.clear();

          // The downloaded model was sideways, so this rotates it upright for the scene.
          object.rotation.x = -Math.PI / 2;

          applyMeshSettings(object);
          centerAndScaleObject(object);
          group.add(object);
          console.log('Loaded OBJ model with MTL:', `${MODEL_FOLDER}${OBJ_FILE}`);
        },
        undefined,
        (error) => {
          console.warn('OBJ file failed to load. Using procedural backup mushroom.', error);
        },
      );
    },
    undefined,
    () => {
      // If the MTL is missing or broken, still load the OBJ so the project is not dead.
      objLoader.load(
        OBJ_FILE,
        (object) => {
          group.clear();
          applyMeshSettings(object);
          centerAndScaleObject(object);
          group.add(object);
          console.log('Loaded OBJ model without MTL:', `${MODEL_FOLDER}${OBJ_FILE}`);
        },
        undefined,
        (error) => {
          console.warn('No OBJ model found. Using procedural backup mushroom.', error);
        },
      );
    },
  );
}

/**
 * Creates the backup mushroom stem using basic Three.js geometry.
 * This is only used before/if the downloaded OBJ model loads.
 */
function createStem() {
  const geometry = new THREE.CylinderGeometry(0.45, 0.7, 2.6, 32);
  const material = new THREE.MeshStandardMaterial({
    color: '#e6dcc6',
    roughness: 0.85,
    metalness: 0.02,
  });

  const stem = new THREE.Mesh(geometry, material);
  stem.position.y = 1.3;
  return stem;
}

/**
 * Creates the cap for the backup mushroom.
 */
function createCap() {
  const geometry = new THREE.SphereGeometry(1.65, 48, 32, 0, Math.PI * 2, 0, Math.PI / 1.9);
  const material = new THREE.MeshStandardMaterial({
    color: '#b14a3b',
    roughness: 0.78,
    metalness: 0.04,
  });

  const cap = new THREE.Mesh(geometry, material);
  cap.position.y = 2.5;
  cap.scale.set(1.18, 0.72, 1.18);
  return cap;
}

/**
 * Creates a simple underside/gill section for the backup mushroom.
 */
function createGills() {
  const geometry = new THREE.CylinderGeometry(1.25, 1.25, 0.12, 40, 1, false);
  const material = new THREE.MeshStandardMaterial({
    color: '#f1dfcf',
    roughness: 0.92,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });

  const gills = new THREE.Mesh(geometry, material);
  gills.position.y = 2.18;
  return gills;
}

/**
 * Adds small spots to the backup mushroom cap.
 */
function createSpots() {
  const spotGroup = new THREE.Group();
  const geometry = new THREE.SphereGeometry(0.16, 16, 16);
  const material = new THREE.MeshStandardMaterial({
    color: '#f6f3ed',
    roughness: 0.85,
    metalness: 0.01,
  });

  const spotPositions = [
    [0.0, 3.0, 0.7],
    [0.6, 2.92, 0.35],
    [-0.62, 2.88, 0.4],
    [0.88, 2.8, -0.08],
    [-0.88, 2.83, -0.12],
    [0.25, 2.74, -0.85],
    [-0.38, 2.78, -0.74],
  ];

  spotPositions.forEach(([x, y, z], index) => {
    const spot = new THREE.Mesh(geometry, material);
    spot.position.set(x, y, z);
    spot.scale.setScalar(index === 0 ? 1.35 : 1.0);
    spotGroup.add(spot);
  });

  return spotGroup;
}

/**
 * Creates a rounded base at the bottom of the backup mushroom.
 */
function createBaseTuft() {
  const geometry = new THREE.SphereGeometry(0.95, 24, 24);
  const material = new THREE.MeshStandardMaterial({
    color: '#d7ccb4',
    roughness: 0.92,
    metalness: 0.0,
  });

  const base = new THREE.Mesh(geometry, material);
  base.position.y = 0.45;
  base.scale.set(1.0, 0.55, 1.0);
  return base;
}

/**
 * Builds the backup mushroom out of simple geometry.
 * This lets the project run immediately even if the real OBJ files are missing.
 */
function createProceduralBackupMushroom() {
  const mushroom = new THREE.Group();
  mushroom.add(createStem());
  mushroom.add(createBaseTuft());
  mushroom.add(createCap());
  mushroom.add(createGills());
  mushroom.add(createSpots());
  applyMeshSettings(mushroom);
  return mushroom;
}

/**
 * Creates the mushroom group used by the scene.
 * Starts with a backup model, then replaces it with the OBJ model when loading succeeds.
 *
 * @returns {THREE.Group} The group containing the mushroom object.
 */
export function createMushroom() {
  const mushroom = new THREE.Group();

  mushroom.add(createProceduralBackupMushroom());
  loadObjModel(mushroom);

  return mushroom;
}
