import GUI from 'lil-gui';

/**
 * Creates the control panel on the right side of the screen.
 * This is the main interactive part of the project: users can change lighting live.
 *
 * @param {Object} params - Objects needed to build the GUI.
 * @param {Object} params.lights - Lights created in createLights.js.
 * @param {Object} params.mushroom - Mushroom group, used for the wireframe toggle.
 * @param {Object} params.sceneState - Shared state for toggles like auto-rotate.
 * @param {Function} params.resetLighting - Function that restores default light settings.
 */
export function createGui({ lights, mushroom, sceneState, resetLighting }) {
  const gui = new GUI({ title: 'Lighting Controls' });

  // Main light controls: these directly change how the mushroom is lit.
  const lightFolder = gui.addFolder('Main Light');
  lightFolder.add(lights.mainLight, 'intensity', 0, 6, 0.01).name('Intensity');
  lightFolder.addColor({ color: '#ffd8b1' }, 'color').name('Color').onChange((value) => {
    lights.mainLight.color.set(value);
  });
  lightFolder.add(lights.mainLight.position, 'x', -10, 10, 0.01).name('Position X');
  lightFolder.add(lights.mainLight.position, 'y', 0, 12, 0.01).name('Position Y');
  lightFolder.add(lights.mainLight.position, 'z', -10, 10, 0.01).name('Position Z');
  lightFolder.open();

  // Ambient light controls how much general light fills the scene.
  const ambientFolder = gui.addFolder('Ambient Light');
  ambientFolder.add(lights.ambientLight, 'intensity', 0, 2, 0.01).name('Intensity');

  // Scene controls are not lighting math, but they help with presenting and debugging.
  const sceneFolder = gui.addFolder('Scene');
  sceneFolder.add(sceneState, 'autoRotate').name('Auto Rotate');
  sceneFolder.add(sceneState, 'wireframe').name('Wireframe').onChange((enabled) => {
    mushroom.traverse((child) => {
      if (child.isMesh) {
        child.material.wireframe = enabled;
      }
    });
  });
  sceneFolder.add({ resetLighting }, 'resetLighting').name('Reset Lighting');

  return gui;
}
