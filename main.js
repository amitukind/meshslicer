var scene, camera, renderer;
var geometry, material, mesh;

init();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.y = 200;
  camera.position.z = 500;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff, 1);

  document.body.appendChild(renderer.domElement);
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  createLight();

  geometry = new THREE.BoxGeometry(50, 50, 50);
  material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  var geometry = new THREE.PlaneBufferGeometry(3, 3, 1, 1);
  var material = new THREE.MeshPhongMaterial({
    color: 0xa0adaf,
    shininess: 10,
  });
  var plane = new THREE.Mesh(geometry, material);
  plane.scale.multiplyScalar(300);
  plane.receiveShadow = true;
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -100;
  scene.add(plane);

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  controls.update();
}

function createLight() {
  // Lights

  scene.add(new THREE.AmbientLight(0xffffff, 0.3));

  var spotLight = new THREE.SpotLight(0xffffff, 0.5);
  spotLight.angle = Math.PI / 5;
  spotLight.penumbra = 0.9;
  spotLight.position.set(20, 300, 30);
  spotLight.castShadow = true;
  spotLight.shadow.camera.near = 3;
  spotLight.shadow.camera.far = 400;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  scene.add(spotLight);

  var dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(0, 2, 0);
  dirLight.castShadow = true;
  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 10;

  dirLight.shadow.camera.right = 1;
  dirLight.shadow.camera.left = -1;
  dirLight.shadow.camera.top = 1;
  dirLight.shadow.camera.bottom = -1;

  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  scene.add(dirLight);
}
