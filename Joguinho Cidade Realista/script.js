// Configuração inicial da cena, câmera e renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("game-container").appendChild(renderer.domElement);

// Cubo do jogador
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });
const player = new THREE.Mesh(geometry, material);
scene.add(player);

// Chão
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x777777, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Luz
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

// Posição inicial da câmera
camera.position.z = 5;
camera.position.y = 5;
camera.lookAt(0, 0, 0);

// Configuração de controle do teclado
const keys = {};
window.addEventListener("keydown", (event) => (keys[event.key] = true));
window.addEventListener("keyup", (event) => (keys[event.key] = false));

// Movimento do jogador
function movePlayer() {
  const speed = 0.1;
  if (keys["ArrowUp"]) player.position.z -= speed;
  if (keys["ArrowDown"]) player.position.z += speed;
  if (keys["ArrowLeft"]) player.position.x -= speed;
  if (keys["ArrowRight"]) player.position.x += speed;
}

// Função de animação
function animate() {
  requestAnimationFrame(animate);
  movePlayer();
  renderer.render(scene, camera);
}

// Ajustar o tamanho ao redimensionar a janela
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Iniciar o loop de animação
animate();