import CSG from "./lib/CSGMesh.js";

function doCSG(a, b, op, mat) {
  var bspA = CSG.fromMesh(a);
  var bspB = CSG.fromMesh(b);
  var bspC = bspA[op](bspB);
  var result = CSG.toMesh(bspC, a.matrix);
  result.material = mat;
  result.castShadow = result.receiveShadow = true;
  return result;
}

var cubeMeshes = cubeDemo();
var sphereMeshes = sphereDemo();

window.addEventListener("keypress", (event) => {
  if (event.key === "c") {
    doOperation(cubeMeshes[0], cubeMeshes[1], cubeMeshes[2]);
  }
  if (event.key === "s") {
    doOperation(sphereMeshes[0], sphereMeshes[1], sphereMeshes[2], true);
  }
});

function cubeDemo() {
  var mesh1 = new THREE.Mesh(
    new THREE.BoxGeometry(50, 50, 50),
    new THREE.MeshPhongMaterial({
      color: 0xff0000,
      shininess: 100,
    })
  );
  mesh1.position.x = 0;

  var mesh2 = new THREE.Mesh(
    new THREE.BoxGeometry(50, 50, 50),
    new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      shininess: 100,
    })
  );
  mesh2.position.x = -25;
  var mesh3 = new THREE.Mesh(
    new THREE.BoxGeometry(50, 50, 50),
    new THREE.MeshPhongMaterial({
      color: 0x0000ff,
      shininess: 100,
    })
  );
  mesh3.position.x = 25;
  mesh2.visible = false;
  mesh3.visible = false;
  scene.add(mesh1);
  scene.add(mesh2);
  scene.add(mesh3);
  mesh1.updateMatrix();
  mesh2.updateMatrix();
  mesh3.updateMatrix();
  return [mesh1, mesh2, mesh3];
}

function sphereDemo() {
  var mesh1 = new THREE.Mesh(
    new THREE.SphereGeometry(25, 50, 50),
    new THREE.MeshPhongMaterial({
      color: 0xff0000,
      shininess: 100,
    })
  );
  mesh1.position.x = 0;

  var mesh2 = new THREE.Mesh(
    new THREE.BoxGeometry(50, 50, 50),
    new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      shininess: 100,
    })
  );
  mesh2.position.x = -25;
  var mesh3 = new THREE.Mesh(
    new THREE.BoxGeometry(50, 50, 50),
    new THREE.MeshPhongMaterial({
      color: 0x0000ff,
      shininess: 100,
    })
  );
  mesh3.position.x = 25;
  mesh2.visible = false;
  mesh3.visible = false;
  scene.add(mesh1);
  scene.add(mesh2);
  scene.add(mesh3);
  mesh1.updateMatrix();
  mesh2.updateMatrix();
  mesh3.updateMatrix();
  mesh1.position.z = 200;
  mesh2.position.z = 200;
  mesh3.position.z = 200;
  return [mesh1, mesh2, mesh3];
}

function doOperation(mesh1, mesh2, mesh3, wireFrame) {
  mesh1.visible = false;
  var mesh4 = doCSG(
    mesh1,
    mesh2,
    "subtract",
    new THREE.MeshPhongMaterial({
      color: 0xff0000,
      shininess: 100,
      wireframe: false,
    })
  );
  scene.add(mesh4);
  var mesh5 = doCSG(
    mesh1,
    mesh3,
    "subtract",
    new THREE.MeshPhongMaterial({
      color: 0xff0000,
      shininess: 100,
      wireframe: false,
    })
  );

  scene.add(mesh5);
  var tween = new TWEEN.Tween(mesh4.position)
    .to({ y: 100, x: 100 }, 10000)
    .start();
  var tween2 = new TWEEN.Tween(mesh5.position)
    .to({ y: -100, x: -100 }, 10000)
    .start();
}
