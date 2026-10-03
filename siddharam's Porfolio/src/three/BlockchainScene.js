import * as THREE from 'three';

// A rotating network of connected nodes ("blocks") — visual metaphor for a blockchain.
// Mouse movement subtly rotates the camera around the network (parallax).
// Occasionally, a "pulse" travels along one edge (like a transaction propagating).

export default class BlockchainScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = canvas.clientWidth;
    this.height = canvas.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0, 9);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);

    this.mouse = { x: 0, y: 0 };
    this.targetRotation = { x: 0, y: 0 };
    this.nodes = [];
    this.edges = [];
    this.pulses = [];

    this._buildNetwork();
    this._bindEvents();
    this.clock = new THREE.Clock();
    this._animate = this._animate.bind(this);
    this._animate();
  }

  _buildNetwork() {
    const group = new THREE.Group();
    this.group = group;
    this.scene.add(group);

    const nodeCount = 14;
    const radius = 4.2;
    const positions = [];

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      positions.push(new THREE.Vector3(x, y, z));
    }

    // Nodes = small wireframe cubes ("blocks")
    const boxGeo = new THREE.BoxGeometry(0.34, 0.34, 0.34);
    const edgesGeo = new THREE.EdgesGeometry(boxGeo);
    const nodeMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });

    positions.forEach((pos) => {
      const node = new THREE.LineSegments(edgesGeo, nodeMat.clone());
      node.position.copy(pos);
      group.add(node);
      this.nodes.push(node);
    });

    // Edges = connect each node to its 2-3 nearest neighbors (chain-like)
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 });
    for (let i = 0; i < positions.length; i++) {
      const dists = positions
        .map((p, j) => ({ j, d: positions[i].distanceTo(p) }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);

      dists.forEach(({ j }) => {
        const key = [i, j].sort().join('-');
        if (this._seenEdges?.has(key)) return;
        (this._seenEdges = this._seenEdges || new Set()).add(key);

        const geo = new THREE.BufferGeometry().setFromPoints([positions[i], positions[j]]);
        const line = new THREE.Line(geo, lineMat.clone());
        group.add(line);
        this.edges.push({ line, from: positions[i], to: positions[j] });
      });
    }

    // Traveling pulses along a few random edges (transaction propagation effect)
    const pulseGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = 0; i < 5; i++) {
      const edge = this.edges[Math.floor(Math.random() * this.edges.length)];
      const mesh = new THREE.Mesh(pulseGeo, pulseMat.clone());
      group.add(mesh);
      this.pulses.push({ mesh, edge, t: Math.random(), speed: 0.15 + Math.random() * 0.15 });
    }
  }

  _bindEvents() {
    this._onMove = (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    this._onResize = () => {
      this.width = this.canvas.clientWidth;
      this.height = this.canvas.clientHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    };
    window.addEventListener('mousemove', this._onMove);
    window.addEventListener('resize', this._onResize);
  }

  _animate() {
    this._raf = requestAnimationFrame(this._animate);
    const dt = this.clock.getDelta();

    this.targetRotation.y += (this.mouse.x * 0.4 - this.targetRotation.y) * 0.03;
    this.targetRotation.x += (this.mouse.y * 0.25 - this.targetRotation.x) * 0.03;

    this.group.rotation.y += dt * 0.06 + (this.targetRotation.y - this.group.rotation.y) * 0.02;
    this.group.rotation.x = this.targetRotation.x * 0.3;

    // Traveling pulses
    this.pulses.forEach((p) => {
      p.t += dt * p.speed;
      if (p.t > 1) p.t = 0;
      p.mesh.position.lerpVectors(p.edge.from, p.edge.to, p.t);
    });

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    cancelAnimationFrame(this._raf);
    window.removeEventListener('mousemove', this._onMove);
    window.removeEventListener('resize', this._onResize);
    this.renderer.dispose();
  }
}
