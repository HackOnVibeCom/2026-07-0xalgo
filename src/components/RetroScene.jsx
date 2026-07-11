import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// A lightweight, dependency-free synthwave scene: scrolling grid floor,
// a striped retro sun, and a handful of floating wireframe shapes in the
// app's pink/blue palette. No OrbitControls (kept out on purpose — this is
// a passive background, not something the user drags around).
export default function RetroScene({ className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xfff9fc, 6, 22);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 6);
    camera.lookAt(0, 1, -4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // ---- Retro striped sun (drawn on a canvas texture, used as a sprite) ----
    const sunCanvas = document.createElement("canvas");
    sunCanvas.width = 256;
    sunCanvas.height = 256;
    const ctx = sunCanvas.getContext("2d");
    const cx = 128,
      cy = 128,
      r = 110;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    const bands = ["#FF4FA3", "#FF6FB3", "#FF8FC3", "#3E8EFF", "#6FAAFF", "#FFC94A"];
    const bandH = (r * 2) / bands.length;
    bands.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(cx - r, cy - r + i * bandH, r * 2, bandH * 0.72);
    });
    ctx.restore();
    const sunTexture = new THREE.CanvasTexture(sunCanvas);
    const sunMaterial = new THREE.SpriteMaterial({ map: sunTexture, transparent: true });
    const sun = new THREE.Sprite(sunMaterial);
    sun.scale.set(4.2, 4.2, 1);
    sun.position.set(0, 2.3, -10);
    scene.add(sun);

    // ---- Scrolling grid floor ----
    const gridSize = 24;
    const gridDivisions = 24;
    const grid = new THREE.GridHelper(gridSize, gridDivisions, 0xff4fa3, 0x3e8eff);
    grid.position.y = -0.4;
    grid.material.transparent = true;
    grid.material.opacity = 0.35;
    scene.add(grid);

    // ---- Floating wireframe shapes ----
    const shapeGeometries = [
      new THREE.IcosahedronGeometry(0.55, 0),
      new THREE.BoxGeometry(0.8, 0.8, 0.8),
      new THREE.TetrahedronGeometry(0.6, 0),
      new THREE.OctahedronGeometry(0.55, 0)
    ];
    const shapeColors = [0xff4fa3, 0x3e8eff, 0x39d6b4, 0xffc94a];

    const shapes = [];
    const count = 7;
    for (let i = 0; i < count; i++) {
      const geo = shapeGeometries[i % shapeGeometries.length];
      const color = shapeColors[i % shapeColors.length];
      const mat = new THREE.MeshBasicMaterial({ color, wireframe: true });
      const mesh = new THREE.Mesh(geo, mat);
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.6 + (i % 3) * 0.6;
      mesh.position.set(
        Math.cos(angle) * radius,
        0.4 + Math.random() * 1.6,
        -2 - Math.sin(angle) * radius
      );
      mesh.userData = {
        baseY: mesh.position.y,
        speed: 0.4 + Math.random() * 0.5,
        rotSpeed: 0.2 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2
      };
      scene.add(mesh);
      shapes.push(mesh);
    }

    // ---- Mouse parallax (subtle, non-interactive feel) ----
    const mouse = { x: 0, y: 0 };
    function handlePointerMove(e) {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }
    window.addEventListener("pointermove", handlePointerMove);

    let frameId;
    const clock = new THREE.Clock();

    function animate() {
      const t = clock.getElapsedTime();

      grid.position.z = (t * 1.1) % (gridSize / gridDivisions);

      shapes.forEach((mesh) => {
        const { baseY, speed, rotSpeed, phase } = mesh.userData;
        mesh.position.y = baseY + Math.sin(t * speed + phase) * 0.25;
        mesh.rotation.x += rotSpeed * 0.01;
        mesh.rotation.y += rotSpeed * 0.015;
      });

      camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.02;
      camera.position.y += (1.4 - mouse.y * 0.3 - camera.position.y) * 0.02;
      camera.lookAt(0, 1, -4);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }
    animate();

    function handleResize() {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      shapeGeometries.forEach((g) => g.dispose());
      shapes.forEach((m) => m.material.dispose());
      sunMaterial.dispose();
      sunTexture.dispose();
      grid.material.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={className} />;
}
