import * as THREE from 'three';

const SHAPES = [
  () => new THREE.TorusGeometry(0.75, 0.28, 16, 36), // 0: Home (Donut)
  () => new THREE.IcosahedronGeometry(0.85),          // 1: About (Polyhedron)
  () => new THREE.OctahedronGeometry(0.9),           // 2: Timeline (Crystal)
  () => new THREE.DodecahedronGeometry(0.8),         // 3: Skills (Matrix)
  () => new THREE.TorusKnotGeometry(0.6, 0.2, 48, 8),// 4: Projects (Knot)
  () => new THREE.BoxGeometry(0.7, 0.95, 0.18),      // 5: Resume / CV (Document Tablet)
  () => new THREE.BoxGeometry(0.85, 0.85, 0.85),     // 6: Credentials (Cube)
  () => new THREE.SphereGeometry(0.85, 18, 18),      // 7: AI Assistant (Sphere)
  () => new THREE.TetrahedronGeometry(0.9),          // 8: Contact (Pyramid)
];

export default class MiniCubeScene {
  constructor(canvas, theme = 'dark') {
    this.canvas = canvas;
    this.theme = theme;
    this.width = canvas.clientWidth || 100;
    this.height = canvas.clientHeight || 100;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 20);
    this.camera.position.set(0, 0, 3.2);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);

    this.group = new THREE.Group();
    this.scene.add(this.group);

    const isWhite = this.theme === 'white';
    const geo = SHAPES[0]();
    this.wireGeo = new THREE.WireframeGeometry(geo);
    this.mat = new THREE.LineBasicMaterial({
      color: isWhite ? 0x00f0ff : 0xffffff,
      transparent: true,
      opacity: isWhite ? 0.6 : 0.75,
      blending: THREE.AdditiveBlending,
    });
    this.wireMesh = new THREE.LineSegments(this.wireGeo, this.mat);
    this.group.add(this.wireMesh);

    const coreMat = new THREE.MeshBasicMaterial({
      color: isWhite ? 0x8a2be2 : 0x141414,
      wireframe: true,
      transparent: true,
      opacity: isWhite ? 0.35 : 0.45,
    });
    this.coreMesh = new THREE.Mesh(geo, coreMat);
    this.group.add(this.coreMesh);

    this.currentShapeIndex = 0;
    this.clock = new THREE.Clock();
    this.speedMultiplier = 1;

    this._animate = this._animate.bind(this);
    this._animate();
  }

  setTheme(theme) {
    if (this.theme === theme) return;
    this.theme = theme;
    const isWhite = theme === 'white';
    if (this.mat) {
      this.mat.color.setHex(isWhite ? 0x00f0ff : 0xffffff);
      this.mat.opacity = isWhite ? 0.6 : 0.75;
    }
    if (this.coreMesh && this.coreMesh.material) {
      this.coreMesh.material.color.setHex(isWhite ? 0x8a2be2 : 0x141414);
      this.coreMesh.material.opacity = isWhite ? 0.35 : 0.45;
    }
  }

  setShape(index) {
    const i = Math.abs(index) % SHAPES.length;
    if (i === this.currentShapeIndex) return;
    this.currentShapeIndex = i;

    const newGeo = SHAPES[i]();
    const newWireGeo = new THREE.WireframeGeometry(newGeo);

    this.wireMesh.geometry.dispose();
    this.coreMesh.geometry.dispose();

    this.wireMesh.geometry = newWireGeo;
    this.coreMesh.geometry = newGeo;

    // Pulse colors on shape change based on theme
    const colors = this.theme === 'white'
      ? [0x00f0ff, 0x9d4edd, 0x00e1d9, 0xff007f, 0x70e000]
      : [0xffffff, 0xcccccc, 0xe5e5e5, 0x00f0ff, 0x627eea, 0xffd700, 0x10b981, 0xffffff];
    this.mat.color.setHex(colors[i % colors.length]);
  }

  boostSpeed() {
    this.speedMultiplier = 3.5;
    setTimeout(() => {
      this.speedMultiplier = 1;
    }, 900);
  }

  _animate() {
    this._raf = requestAnimationFrame(this._animate);
    const dt = this.clock.getDelta();

    this.group.rotation.y += dt * 0.65 * this.speedMultiplier;
    this.group.rotation.x += dt * 0.35 * this.speedMultiplier;

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    cancelAnimationFrame(this._raf);
    this.renderer.dispose();
  }
}
