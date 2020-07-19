var scene, camera, renderer, controls;

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    25,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.x = 50;
  camera.position.y = 100;
  camera.position.z = 200;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff, 1);

  document.body.appendChild(renderer.domElement);
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  createLight();

  var ground = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(3, 3, 1, 1),
    new THREE.MeshPhongMaterial({
      color: 0xa0adaf,
      shininess: 10,
    })
  );
  ground.scale.multiplyScalar(300);
  ground.receiveShadow = true;
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -100;
  scene.add(ground);

  animate();
  window.scene = scene;
}

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  controls.update();
  TWEEN.update();
  modifier && modifier.apply();
}

function createLight() {
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
  dirLight.position.set(100, 400, 300);
  dirLight.castShadow = true;
  dirLight.intensity = 0.5;

  scene.add(dirLight);
}
init();
