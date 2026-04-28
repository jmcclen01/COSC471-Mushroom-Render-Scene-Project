/**
 * Creates the small instruction panel shown in the bottom-left corner.
 * This gives the project title, group members, camera controls, and lighting instructions.
 */
export function createOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `
  <h2>Interactive Mushroom Lighting Renderer</h2>
  <p><em>Jaedon McClendon - Luke Rosendorf - Ethan Lightbringer</em></p>

  <h3>Controls</h3>
  <p>Left click and drag to orbit • Right click to move camera along x and y axis • Scroll to zoom</p>

  <h3>Lighting</h3>
  <p>Use the GUI to adjust intensity, color, and position</p>
`;
  document.body.appendChild(overlay);
}
