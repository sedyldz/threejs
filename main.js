//import * as THREE from "three";

const gridSizeX = 35;
const gridSizeY = 35;
const spacing = 0.5;
const dotSize = 0.05;
const dotColor = 0xffffff;
const backgroundColor = 0x000000;
const movementSpeed = 0.05;
const fadeDistance = 1;
const waveAmplitude = 0.5;
const waveFrequency = 0.5;

const mountRef = document.getElementById("dotGrid");
const width = mountRef.clientWidth;
const height = mountRef.clientHeight;

let scene = new THREE.Scene();
scene.background = new THREE.Color(backgroundColor);
let camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
mountRef.appendChild(renderer.domElement);

let dotGroup = new THREE.Group();
scene.add(dotGroup);

let originalPositions = [];

for (let i = 0; i < gridSizeX; i++) {
  for (let j = 0; j < gridSizeY; j++) {
    let geometry = new THREE.SphereGeometry(dotSize, 16, 16);
    let material = new THREE.MeshBasicMaterial({
      color: dotColor,
      transparent: true,
      opacity: 1.0,
    });
    let dot = new THREE.Mesh(geometry, material);

    let x = i * spacing - (gridSizeX * spacing) / 2;
    let y = j * spacing - (gridSizeY * spacing) / 2;
    dot.position.set(x, y, 0);

    originalPositions.push(new THREE.Vector3(x, y, 0));
    dotGroup.add(dot);
  }
}

let pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(0, 0, 10);
scene.add(pointLight);

camera.position.z = 15;

let mouse = new THREE.Vector2();
let mouseOverCanvas = false;

renderer.domElement.addEventListener("mousemove", (event) => {
  mouseOverCanvas = true;
  mouse.x = (event.clientX / width) * 2 - 1;
  mouse.y = -(event.clientY / height) * 2 + 1;
});

renderer.domElement.addEventListener("mouseleave", () => {
  mouseOverCanvas = false;
});

const animate = () => {
  requestAnimationFrame(animate);
  let time = Date.now() * 0.001 * waveFrequency;

  dotGroup.children.forEach((dot, index) => {
    let originalPosition = originalPositions[index];

    if (mouseOverCanvas) {
      let vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject(camera);
      let dir = vector.sub(camera.position).normalize();
      let distance = -camera.position.z / dir.z;
      let pos = camera.position.clone().add(dir.multiplyScalar(distance));

      let dist = dot.position.distanceTo(pos);
      if (dist < fadeDistance) {
        let dx = dot.position.x - pos.x;
        let dy = dot.position.y - pos.y;
        dot.position.x += dx * movementSpeed;
        dot.position.y += dy * movementSpeed;
      }
    } else {
      dot.position.lerp(originalPositions[index], 0.1);
    }

    // Wave animation
    dot.position.z =
      Math.sin(time + originalPosition.x * 0.5 + originalPosition.y * 0.5) *
      waveAmplitude;
  });

  renderer.render(scene, camera);
};

animate();
