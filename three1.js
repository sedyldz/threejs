import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Sphere
const geometry = new THREE.SphereGeometry(0.05, 16, 16);
const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
});
const dot = new THREE.Mesh(geometry, material);
scene.add(dot);
camera.position.z = 1;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

renderer.render(scene, camera);

function animate() {
  requestAnimationFrame(animate);
  dot.rotation.x += 0.01;
  dot.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();
