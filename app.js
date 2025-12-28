/**
 * app.js
 * Viewer interaction logic for the 3D Visualizer
 * - Loads after DOMContentLoaded
 * - Exposes `selectMesh(name, element)` on `window` for the UI buttons
 * - Updates model materials and camera presets in response to user actions
 */
document.addEventListener('DOMContentLoaded', () => {
  const viewer = document.getElementById('viewer');
  if (!viewer) {
    console.warn('No <model-viewer> with id="viewer" found');
    return;
  }

  const originalColors = new Map();

  /* Descriptions for accessible UI and the description panel */
  const descriptions = {
    "Mesh 1 Mat": "This is the arm of the JCB, used for digging and lifting.",
    "Mesh 2 Mat": "This is the bucket, perfect for scooping and loading materials.",
    "Mesh 3 Mat": "This is the cabin, where the operator controls the machine."
  };

  const cameraPositions = {
    "Mesh 1 Mat": { yaw: -75, pitch: 75 },
    "Mesh 2 Mat": { yaw: -25, pitch: 85 },
    "Mesh 3 Mat": { yaw: 45, pitch: 75 }
  };

  const cameraTargets = {
    "Mesh 1 Mat": { x: 0.15, y: 4.0, z: 1.0 },
    "Mesh 2 Mat": { x: 3.0, y: 3.0, z: 3.0 },
    "Mesh 3 Mat": { x: 14.0, y: 6.0, z: 2.0 }
  };

  /**
   * Apply a neutral translucent gray to a material.
   * @param {any} material - material from model-viewer.model.materials
   * @param {number} [alpha=0.4] - alpha transparency (0..1)
   */
  function setTransparentGray(material, alpha = 0.4) {
    const pbr = material.pbrMetallicRoughness;
    pbr.setBaseColorFactor([0.6, 0.6, 0.6, alpha]);
    material.setAlphaMode("BLEND");
    material.pbrMetallicRoughness.setMetallicFactor(0.5);
    material.pbrMetallicRoughness.setRoughnessFactor(0.8);
  }

  viewer.addEventListener("load", () => {
    if (!viewer.model) return;
    viewer.model.materials.forEach(mat => {
      try {
        originalColors.set(mat.name, [...mat.pbrMetallicRoughness.baseColorFactor]);
        setTransparentGray(mat);
      } catch (e) {
        // ignore materials we can't manipulate
      }
    });

    // Initialize UI: select first available button/mesh
    const firstButton = document.querySelector("#ui button");
    selectMesh('Mesh 1 Mat', firstButton);
  });
  /**
   * Select a mesh/material by name and update the UI state.
   * - Highlights the chosen material
   * - Applies neutral styling to other materials
   * - Moves the camera to a preset orbit/target
   * - Updates the description panel for screen-reader users
   * @param {string} meshName
   * @param {HTMLElement} buttonElem
   */
  window.selectMesh = (meshName, buttonElem) => {
    if (!viewer.model) return;

    // Update visual selection state and ARIA pressed attributes
    document.querySelectorAll("#ui button").forEach(btn => {
      btn.classList.remove("selected");
      btn.setAttribute('aria-pressed', 'false');
    });
    if (buttonElem) {
      buttonElem.classList.add("selected");
      buttonElem.setAttribute('aria-pressed', 'true');
    }

    // Fade out other materials
    viewer.model.materials.forEach(mat => {
      if (mat.name === meshName) return;
      try { setTransparentGray(mat); } catch (e) { /* ignore non-PBR materials */ }
    });

    // Highlight selected material and update camera/description
    const mat = viewer.model.getMaterialByName(meshName);
    if (mat) {
      mat.pbrMetallicRoughness.setBaseColorFactor([1, 1, 0, 1]);
      mat.setAlphaMode("OPAQUE");
      mat.pbrMetallicRoughness.setMetallicFactor(1.0);
      mat.pbrMetallicRoughness.setRoughnessFactor(0.35);

      const pos = cameraPositions[meshName] || { yaw: 0, pitch: 75 };
      viewer.cameraOrbit = `${pos.yaw}deg ${pos.pitch}deg 3m`;

      const target = cameraTargets[meshName];
      if (target) {
        viewer.cameraTarget = `${target.x}m ${target.y}m ${target.z}m`;
      }

      // Update description panel for both visual users and screen readers
      const descEl = document.getElementById('description');
      if (descEl) descEl.textContent = descriptions[meshName] || 'Part selected.';
    }
  };

  console.log('app.js initialized');
});
