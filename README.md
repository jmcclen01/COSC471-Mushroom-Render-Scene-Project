# Interactive Mushroom Lighting Renderer

A simple Computer Graphics project built with Three.js.  
The goal is to render a 3D object and let the user interact with lighting in real time to see how it affects the way the object looks.

## What it does

- Renders a mushroom as the main object in a 3D scene  
- Supports loading a downloaded `.obj` model  
- Falls back to a built-in mushroom if no model is added yet  
- Places the object on a pedestal with a background scene  
- Uses real-time lighting  
- Includes GUI controls for:
  - main light intensity  
  - main light color  
  - main light position  
  - ambient light intensity  
  - auto rotate toggle  
  - reset lighting  

## How to run

```bash
npm install
npm run dev
```

Then open the link shown in the terminal (usually):

```text
http://localhost:5173/
```

## Using your own OBJ model

If you want to use a different model, drop the files into:

```text
public/models/
```

Expected file:

```text
public/models/mushroom.obj
```

Optional:

```text
public/models/mushroom.mtl
```

If there are textures, keep them in the same folder unless the `.mtl` file says otherwise.

Loading steps:

1. Tries to load `.mtl` + `.obj` (full textures)
2. If no `.mtl`, loads just `.obj`
3. If no `.obj`, uses the built-in mushroom

So the project always runs, even if no model is added yet.

### `src/main.js`
Connects everything together — scene, camera, object, lights, GUI, and the animation loop.

### `src/scene/setupScene.js`
Handles the renderer, camera, controls, pedestal, background, and resize behavior.

### `src/scene/createLights.js`
Creates the lighting setup (ambient, main directional light, and fill light).

### `src/objects/createMushroom.js`
Handles loading the mushroom model. It shows a backup procedural version first, then replaces it with the `.obj` model if available.

### `src/ui/createGui.js`
Creates the GUI controls for adjusting lighting and scene behavior.

### `src/utils/createOverlay.js`
Adds the on screen instructions panel.


