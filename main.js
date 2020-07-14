import CSG from "./lib/CSGMesh.js";
var scene, camera, renderer, controls;

var mesh3bool = false;
var mesh4bool = false;
var mesh1, mesh2, mesh3, mesh4, mesh5;

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

  deformDemo();

  animate();
  window.scene = scene;
}

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  controls.update();
  if (mesh3bool) mesh3.position.y += 0.1;
  if (mesh4bool) mesh4.position.y -= 0.1;
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
  dirLight.position.set(100, 400, 300);
  dirLight.castShadow = true;
  dirLight.intensity = 0.5;

  scene.add(dirLight);
}
function deformDemo() {
  mesh1 = new THREE.Mesh(
    new THREE.BoxGeometry(50, 50, 50),
    new THREE.MeshPhongMaterial({
      color: 0xff0000,
      shininess: 100,
    })
  );
  mesh1.position.x = 0;
  
  scene.add(mesh1);

  mesh2 = new THREE.Mesh(
    new THREE.BoxGeometry(50, 50, 50),
    new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      shininess: 100,
    })
  );
  mesh2.position.x = -25;
  mesh3 = new THREE.Mesh(
    new THREE.BoxGeometry(50, 50, 50),
    new THREE.MeshPhongMaterial({
      color: 0x0000ff,
      shininess: 100,
    })
  );
  mesh3.position.x = 25;
  mesh2.visible = false;
  mesh3.visible = false;
  scene.add(mesh2);
  scene.add(mesh3);
  mesh1.updateMatrix();
  mesh2.updateMatrix();
}

function doCSG(a, b, op, mat) {
  var bspA = CSG.fromMesh(a);
  var bspB = CSG.fromMesh(b);
  var bspC = bspA[op](bspB);
  var result = CSG.toMesh(bspC, a.matrix);
  result.material = mat;
  result.castShadow = result.receiveShadow = true;
  return result;
}

function doOperation() {
  mesh1.visible = false;
  mesh3 = doCSG(
    mesh1,
    mesh2,
    "subtract",
    new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      shininess: 100,
    })
  );
  scene.add(mesh3);
  mesh3bool = true;
  mesh4 = doCSG(
    mesh1,
    mesh3,
    "subtract",
    new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      shininess: 100,
    })
  );
  scene.add(mesh4);
  mesh4bool = true;
}

window.addEventListener("click", doOperation);
