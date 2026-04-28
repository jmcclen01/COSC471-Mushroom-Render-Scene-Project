import * as THREE from 'three';

/**
 * Creates all lights used in the scene.
 * The main light is the one controlled by the GUI, while ambient/fill lights keep the model readable.
 *
 * @param {THREE.Scene} scene - The scene that the lights should be added to.
 * @returns {Object} References to the lights so the GUI can adjust them later.
 */
export function createLights(scene) {
  // Soft base light so the shadowed side of the mushroom is not completely black.
  const ambientLight = new THREE.AmbientLight('#ffffff', 0.45);
  scene.add(ambientLight);

  // Main directional light. This is the key light used to show intensity, color, and direction changes.
  const mainLight = new THREE.DirectionalLight('#ffd8b1', 2.5);
  mainLight.position.set(4, 6, 3);
  mainLight.castShadow = true;

  // Shadow map settings. Larger map size gives cleaner shadows without making the project too heavy.
  mainLight.shadow.mapSize.width = 1024;
  mainLight.shadow.mapSize.height = 1024;
  mainLight.shadow.camera.left = -8;
  mainLight.shadow.camera.right = 8;
  mainLight.shadow.camera.top = 8;
  mainLight.shadow.camera.bottom = -8;
  mainLight.shadow.camera.near = 0.5;
  mainLight.shadow.camera.far = 25;
  scene.add(mainLight);

  // Small cool fill light from the opposite side for extra depth.
  const fillLight = new THREE.PointLight('#7ec8ff', 0.55, 18);
  fillLight.position.set(-3, 2, -3);
  scene.add(fillLight);

  // Directional lights need a target object to aim at.
  const lightTarget = new THREE.Object3D();
  lightTarget.position.set(0, 1.2, 0);
  scene.add(lightTarget);
  mainLight.target = lightTarget;

  return {
    ambientLight,
    mainLight,
    fillLight,
    lightTarget,
  };
}
