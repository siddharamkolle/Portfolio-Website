import * as THREE from 'three';

/* ============================================================
   ADVANCED 3D BACKGROUND ENGINE (Three.js)
   Supports Dual Theme:
   - 'dark': Precision Obsidian Black & White Monochrome
   - 'white': Cyberpunk Midnight Blue & Electric Cyan Neon
============================================================ */

export default class FancyDonutScene {
  constructor(canvas, theme = 'dark') {
    this.canvas = canvas;
    this.theme = theme;
    this.width = canvas.clientWidth || window.innerWidth;
    this.height = canvas.clientHeight || window.innerHeight;

    // Core Three.js components
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 0, 10.5);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Interaction & Animation state
    this.mouse = { x: 0, y: 0 };
    this.targetRotation = { x: 0, y: 0 };
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.dragRotation = { x: 0, y: 0 };

    this.currentMode = 'cyber-donut'; // 'cyber-donut' | 'torus-knot' | 'quantum-particles' | 'blockchain-mesh'
    this.sectionIndex = 0;

    // Build scene graph
    this.masterGroup = new THREE.Group();
    this.scene.add(this.masterGroup);

    this._setupLighting();
    this._buildModes();
    this._setMode('cyber-donut');

    this._bindEvents();
    this.clock = new THREE.Clock();
    this._animate = this._animate.bind(this);
    this._animate();
  }

  _getPalette() {
    if (this.theme === 'white') {
      // White Mode (Blue & White / Cyber Cyan Theme)
      return {
        ambientColor: 0xffffff,
        ambientIntensity: 0.55,
        keyLightColor: 0x00f0ff,
        keyLightIntensity: 2.4,
        accentLightColor: 0x9d4edd,
        accentLightIntensity: 3.0,
        rimLightColor: 0x06080d,
        rimLightIntensity: 1.0,

        // Donut
        wireColor: 0x00f0ff,
        wireOpacity: 0.45,
        coreColor: 0x0d1527,
        coreEmissive: 0x1a0b36,
        coreEmissiveIntensity: 0.6,
        coreMetalness: 0.85,
        coreRoughness: 0.2,
        coreOpacity: 0.65,
        ring1Color: 0x8a2be2,
        ring1Opacity: 0.7,
        ring2Color: 0x00f0ff,
        ring2Opacity: 0.5,
        particleColors: [new THREE.Color(0x00f0ff), new THREE.Color(0x9d4edd)],
        particleOpacity: 0.85,

        // Knot
        knotWireColor: 0x8a2be2,
        knotWireOpacity: 0.55,
        knotCoreColor: 0x07111e,
        knotCoreEmissive: 0x0b2545,
        knotCoreEmissiveIntensity: 0.8,
        knotCoreMetalness: 0.9,
        knotCoreRoughness: 0.3,
        knotCoreOpacity: 0.6,

        // Quantum Particles
        qColor1: new THREE.Color(0x00f0ff),
        qColor2: new THREE.Color(0x7b2cbf),
        qColor3: new THREE.Color(0xff007f),
        qOpacity: 0.9,

        // Blockchain Mesh
        nodeWireColor: 0x00f0ff,
        nodeWireOpacity: 0.85,
        nodeCoreColor: 0x0a192f,
        nodeCoreOpacity: 0.7,
        edgeColor: 0x8a2be2,
        edgeOpacity: 0.25,
      };
    } else {
      // Dark Mode (Black & White / Obsidian Monochrome Theme)
      return {
        ambientColor: 0xffffff,
        ambientIntensity: 0.5,
        keyLightColor: 0xffffff,
        keyLightIntensity: 2.2,
        accentLightColor: 0x627eea,
        accentLightIntensity: 1.8,
        rimLightColor: 0xe5e5e5,
        rimLightIntensity: 1.4,

        // Donut
        wireColor: 0xcccccc,
        wireOpacity: 0.38,
        coreColor: 0x0a0a0a,
        coreEmissive: 0x141414,
        coreEmissiveIntensity: 0.4,
        coreMetalness: 0.95,
        coreRoughness: 0.2,
        coreOpacity: 0.75,
        ring1Color: 0xffffff,
        ring1Opacity: 0.45,
        ring2Color: 0x627eea,
        ring2Opacity: 0.4,
        particleColors: [new THREE.Color(0xffffff), new THREE.Color(0x999999), new THREE.Color(0x627eea)],
        particleOpacity: 0.75,

        // Knot
        knotWireColor: 0xe5e5e5,
        knotWireOpacity: 0.45,
        knotCoreColor: 0x050505,
        knotCoreEmissive: 0x141414,
        knotCoreEmissiveIntensity: 0.5,
        knotCoreMetalness: 0.95,
        knotCoreRoughness: 0.2,
        knotCoreOpacity: 0.7,

        // Quantum Particles
        qColor1: new THREE.Color(0xffffff),
        qColor2: new THREE.Color(0xcccccc),
        qColor3: new THREE.Color(0x627eea),
        qOpacity: 0.85,

        // Blockchain Mesh
        nodeWireColor: 0xffffff,
        nodeWireOpacity: 0.75,
        nodeCoreColor: 0x141414,
        nodeCoreOpacity: 0.8,
        edgeColor: 0x404040,
        edgeOpacity: 0.35,
      };
    }
  }

  _setupLighting() {
    const pal = this._getPalette();

    const ambientLight = new THREE.AmbientLight(pal.ambientColor, pal.ambientIntensity);
    this.scene.add(ambientLight);
    this.ambientLight = ambientLight;

    const keyLight = new THREE.PointLight(pal.keyLightColor, pal.keyLightIntensity, 28);
    keyLight.position.set(5, 5, 6);
    this.scene.add(keyLight);

    const accentLight = new THREE.PointLight(pal.accentLightColor, pal.accentLightIntensity, 25);
    accentLight.position.set(-6, -4, 5);
    this.scene.add(accentLight);

    const rimLight = new THREE.PointLight(pal.rimLightColor, pal.rimLightIntensity, 20);
    rimLight.position.set(0, 6, -5);
    this.scene.add(rimLight);

    this.lights = { keyLight, accentLight, rimLight };
  }

  _buildModes() {
    this.modeGroups = {
      'cyber-donut': this._buildCyberDonut(),
      'torus-knot': this._buildTorusKnot(),
      'quantum-particles': this._buildQuantumParticles(),
      'blockchain-mesh': this._buildBlockchainMesh(),
    };

    Object.values(this.modeGroups).forEach((grp) => {
      this.masterGroup.add(grp);
      grp.visible = false;
    });
  }

  /* -------------------------------------------------------------
     MODE 1: CYBER DONUT (WIREFRAME + CORE + PARTICLES)
  ------------------------------------------------------------- */
  _buildCyberDonut() {
    const group = new THREE.Group();
    const pal = this._getPalette();

    // 1. Outer wireframe torus ring
    const torusGeo = new THREE.TorusGeometry(3.3, 0.95, 28, 70);
    const wireGeo = new THREE.WireframeGeometry(torusGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: pal.wireColor,
      transparent: true,
      opacity: pal.wireOpacity,
      blending: THREE.AdditiveBlending,
    });
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    group.add(wireMesh);

    // 2. Inner core
    const coreMat = new THREE.MeshStandardMaterial({
      color: pal.coreColor,
      emissive: pal.coreEmissive,
      emissiveIntensity: pal.coreEmissiveIntensity,
      roughness: pal.coreRoughness,
      metalness: pal.coreMetalness,
      transparent: true,
      opacity: pal.coreOpacity,
    });
    const coreMesh = new THREE.Mesh(torusGeo, coreMat);
    group.add(coreMesh);

    // 3. Concentric thin orbital rings
    const ringGeo1 = new THREE.TorusGeometry(4.7, 0.02, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: pal.ring1Color,
      transparent: true,
      opacity: pal.ring1Opacity,
      blending: THREE.AdditiveBlending,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI * 0.35;
    group.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(5.2, 0.015, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: pal.ring2Color,
      transparent: true,
      opacity: pal.ring2Opacity,
      blending: THREE.AdditiveBlending,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI * 0.4;
    group.add(ring2);

    // 4. Orbiting particle cloud along the torus surface
    const particleCount = 550;
    const pPositions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      const R = 3.3 + (Math.random() - 0.5) * 0.35;
      const r = 0.95 + (Math.random() - 0.5) * 0.35;

      const x = (R + r * Math.cos(v)) * Math.cos(u);
      const y = (R + r * Math.cos(v)) * Math.sin(u);
      const z = r * Math.sin(v);

      pPositions[i * 3] = x;
      pPositions[i * 3 + 1] = y;
      pPositions[i * 3 + 2] = z;

      const colorPick = pal.particleColors[Math.floor(Math.random() * pal.particleColors.length)];
      pColors[i * 3] = colorPick.r;
      pColors[i * 3 + 1] = colorPick.g;
      pColors[i * 3 + 2] = colorPick.b;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: pal.particleOpacity,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(pGeo, pMat);
    group.add(particles);

    return group;
  }

  /* -------------------------------------------------------------
     MODE 2: TORUS KNOT (MATHEMATICAL INFINITY KNOT)
  ------------------------------------------------------------- */
  _buildTorusKnot() {
    const group = new THREE.Group();
    const pal = this._getPalette();

    const knotGeo = new THREE.TorusKnotGeometry(2.6, 0.65, 120, 24, 2, 3);
    const wireGeo = new THREE.WireframeGeometry(knotGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: pal.knotWireColor,
      transparent: true,
      opacity: pal.knotWireOpacity,
      blending: THREE.AdditiveBlending,
    });
    const knotMesh = new THREE.LineSegments(wireGeo, wireMat);
    group.add(knotMesh);

    const coreMat = new THREE.MeshStandardMaterial({
      color: pal.knotCoreColor,
      emissive: pal.knotCoreEmissive,
      emissiveIntensity: pal.knotCoreEmissiveIntensity,
      roughness: pal.knotCoreRoughness,
      metalness: pal.knotCoreMetalness,
      transparent: true,
      opacity: pal.knotCoreOpacity,
    });
    const knotCore = new THREE.Mesh(knotGeo, coreMat);
    group.add(knotCore);

    return group;
  }

  /* -------------------------------------------------------------
     MODE 3: QUANTUM PARTICLES (VORTEX)
  ------------------------------------------------------------- */
  _buildQuantumParticles() {
    const group = new THREE.Group();
    const pal = this._getPalette();

    const count = 1200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      const R = 3.2 + (Math.random() - 0.5) * 0.8;
      const r = 1.0 + (Math.random() - 0.5) * 0.6;

      positions[i * 3] = (R + r * Math.cos(v)) * Math.cos(u);
      positions[i * 3 + 1] = (R + r * Math.cos(v)) * Math.sin(u);
      positions[i * 3 + 2] = r * Math.sin(v);

      const rVal = Math.random();
      const col = rVal < 0.45 ? pal.qColor1 : rVal < 0.85 ? pal.qColor2 : pal.qColor3;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.075,
      vertexColors: true,
      transparent: true,
      opacity: pal.qOpacity,
      blending: THREE.AdditiveBlending,
    });

    const pMesh = new THREE.Points(geo, mat);
    group.add(pMesh);

    return group;
  }

  /* -------------------------------------------------------------
     MODE 4: BLOCKCHAIN MESH (CONNECTED NODES)
  ------------------------------------------------------------- */
  _buildBlockchainMesh() {
    const group = new THREE.Group();
    const pal = this._getPalette();
    const nodeCount = 18;
    const radius = 4.0;
    const positions = [];

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      positions.push(new THREE.Vector3(x, y, z));
    }

    const boxGeo = new THREE.BoxGeometry(0.38, 0.38, 0.38);
    const edgesGeo = new THREE.EdgesGeometry(boxGeo);
    const nodeMat = new THREE.LineBasicMaterial({
      color: pal.nodeWireColor,
      transparent: true,
      opacity: pal.nodeWireOpacity,
    });
    const coreNodeMat = new THREE.MeshBasicMaterial({
      color: pal.nodeCoreColor,
      transparent: true,
      opacity: pal.nodeCoreOpacity,
    });

    positions.forEach((pos) => {
      const block = new THREE.Group();
      block.add(new THREE.LineSegments(edgesGeo, nodeMat));
      block.add(new THREE.Mesh(boxGeo, coreNodeMat));
      block.position.copy(pos);
      group.add(block);
    });

    // Edges
    const lineMat = new THREE.LineBasicMaterial({
      color: pal.edgeColor,
      transparent: true,
      opacity: pal.edgeOpacity,
    });
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        if (positions[i].distanceTo(positions[j]) < 2.9) {
          const lGeo = new THREE.BufferGeometry().setFromPoints([positions[i], positions[j]]);
          group.add(new THREE.Line(lGeo, lineMat));
        }
      }
    }

    return group;
  }

  _setMode(mode) {
    if (!this.modeGroups[mode]) return;
    this.currentMode = mode;
    Object.entries(this.modeGroups).forEach(([key, grp]) => {
      grp.visible = key === mode;
    });
  }

  setMode(mode) {
    this._setMode(mode);
  }

  getMode() {
    return this.currentMode;
  }

  setTheme(theme) {
    if (this.theme === theme) return;
    this.theme = theme;

    // Reset lighting
    if (this.ambientLight) this.scene.remove(this.ambientLight);
    if (this.lights) {
      if (this.lights.keyLight) this.scene.remove(this.lights.keyLight);
      if (this.lights.accentLight) this.scene.remove(this.lights.accentLight);
      if (this.lights.rimLight) this.scene.remove(this.lights.rimLight);
    }
    this._setupLighting();

    // Rebuild mode groups
    if (this.modeGroups) {
      Object.values(this.modeGroups).forEach((grp) => {
        this.masterGroup.remove(grp);
      });
    }
    this._buildModes();
    this._setMode(this.currentMode);
  }

  setSection(index) {
    this.sectionIndex = index;
    const targetZ = 10.5 + (index % 2 === 0 ? 0.3 : -0.3);
    this.camera.position.z = targetZ;
  }

  _bindEvents() {
    this._onMove = (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;

      if (this.isDragging) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;
        this.dragRotation.y += deltaX * 0.006;
        this.dragRotation.x += deltaY * 0.006;
        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    this._onMouseDown = (e) => {
      if (e.target.closest('button, a, input, textarea, .proj-card, .skill-card, .exp-card, .dock-nav, .three-hud-container')) return;
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    this._onMouseUp = () => {
      this.isDragging = false;
    };

    this._onResize = () => {
      this.width = this.canvas.clientWidth || window.innerWidth;
      this.height = this.canvas.clientHeight || window.innerHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    };

    window.addEventListener('mousemove', this._onMove);
    window.addEventListener('mousedown', this._onMouseDown);
    window.addEventListener('mouseup', this._onMouseUp);
    window.addEventListener('resize', this._onResize);
  }

  _animate() {
    this._raf = requestAnimationFrame(this._animate);
    const dt = this.clock.getDelta();

    // Lerp mouse target parallax
    this.targetRotation.y += (this.mouse.x * 0.45 - this.targetRotation.y) * 0.04;
    this.targetRotation.x += (this.mouse.y * 0.35 - this.targetRotation.x) * 0.04;

    // Base constant spin + mouse parallax + manual drag rotation
    this.masterGroup.rotation.y += dt * 0.16 + (this.targetRotation.y - this.masterGroup.rotation.y) * 0.02 + this.dragRotation.y * 0.05;
    this.masterGroup.rotation.x = this.targetRotation.x * 0.4 + this.dragRotation.x * 0.8;
    this.masterGroup.rotation.z += dt * 0.04;

    // Decay manual drag rotation smoothly
    this.dragRotation.x *= 0.95;
    this.dragRotation.y *= 0.95;

    // Subtle breathing pulse on lights
    const t = this.clock.getElapsedTime();
    if (this.lights) {
      if (this.lights.keyLight) {
        this.lights.keyLight.intensity = (this.theme === 'white' ? 2.4 : 2.2) + Math.sin(t * 1.5) * (this.theme === 'white' ? 0.5 : 0.4);
      }
      if (this.lights.accentLight) {
        this.lights.accentLight.intensity = (this.theme === 'white' ? 3.0 : 1.8) + Math.cos(t * 1.3) * (this.theme === 'white' ? 0.6 : 0.5);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    cancelAnimationFrame(this._raf);
    window.removeEventListener('mousemove', this._onMove);
    window.removeEventListener('mousedown', this._onMouseDown);
    window.removeEventListener('mouseup', this._onMouseUp);
    window.removeEventListener('resize', this._onResize);
    this.renderer.dispose();
  }
}
