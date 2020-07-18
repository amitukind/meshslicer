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

var cubeMeshes = cutDemo();
var meshToBeBend = null;
window.addEventListener("keypress", (event) => {
  if (event.key === "c") {
    var meshes = doOperation(cubeMeshes[0], cubeMeshes[1], cubeMeshes[2], {
      material: new THREE.MeshPhongMaterial({
        color: 0xff0000,
        shininess: 100,
      }),
    });
    scene.add(meshes[0]);
    scene.add(meshes[1]);

    var tween = new TWEEN.Tween(meshes[0].position)
      .to({ y: -50, x: meshes[0].position.x + 100 }, 2000)
      .onComplete(function () {
        scene.remove(meshes[0]);
      })
      .start();
    var tween = new TWEEN.Tween(meshes[1].position)
      .to({ y: 0, x: meshes[1].position.x + 2 }, 1000)
      .onComplete(function () {
        cubeMeshes = nextCut(meshes[1]);
      })
      .start();
  }
});

function nextCut(mainMesh) {
  var leftBoundingMesh = new THREE.Mesh(
    new THREE.BoxGeometry(50, 50, 50),
    new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      shininess: 100,
    })
  );
  leftBoundingMesh.position.x = -25;
  var rightBoundingMesh = new THREE.Mesh(
    new THREE.BoxGeometry(50, 50, 50),
    new THREE.MeshPhongMaterial({
      color: 0x0000ff,
      shininess: 100,
    })
  );
  rightBoundingMesh.position.x = 25;
  leftBoundingMesh.visible = false;
  rightBoundingMesh.visible = false;

  scene.add(leftBoundingMesh);
  scene.add(rightBoundingMesh);
  mainMesh.updateMatrix();
  leftBoundingMesh.updateMatrix();
  rightBoundingMesh.updateMatrix();
  return [mainMesh, leftBoundingMesh, rightBoundingMesh];
}

function cutDemo() {
  var mainMesh = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(5, 5, 50, 64, 64),
    new THREE.MeshPhongMaterial({
      color: 0xff0000,
      shininess: 100,
    })
  );
  mainMesh.position.x = -20;
  mainMesh.rotation.z = Math.PI / 2;

  var leftBoundingMesh = new THREE.Mesh(
    new THREE.BoxGeometry(50, 50, 50),
    new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      shininess: 100,
    })
  );
  leftBoundingMesh.position.x = -25;
  var rightBoundingMesh = new THREE.Mesh(
    new THREE.BoxGeometry(50, 50, 50),
    new THREE.MeshPhongMaterial({
      color: 0x0000ff,
      shininess: 100,
    })
  );
  rightBoundingMesh.position.x = 25;
  leftBoundingMesh.visible = false;
  rightBoundingMesh.visible = false;
  scene.add(mainMesh);
  scene.add(leftBoundingMesh);
  scene.add(rightBoundingMesh);
  mainMesh.updateMatrix();
  leftBoundingMesh.updateMatrix();
  rightBoundingMesh.updateMatrix();
  return [mainMesh, leftBoundingMesh, rightBoundingMesh];
}

function doOperation(mainMesh, leftBoundingMesh, rightBoundingMesh, params) {
  mainMesh.visible = false;
  var leftMesh = doCSG(mainMesh, leftBoundingMesh, "subtract", params.material);

  var rightMesh = doCSG(
    mainMesh,
    rightBoundingMesh,
    "subtract",
    params.material
  );

  return [leftMesh, rightMesh];
}
