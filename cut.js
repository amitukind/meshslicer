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

var knife = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(3, 3, 1, 1),
  new THREE.MeshPhongMaterial({
    color: 0x0000ff,
    shininess: 10,
    doubleSide:true
  })
);
knife.rotation.y = Math.PI/2;
knife.rotation.x = -Math.PI/2;
knife.scale.set(50,5,1);
knife.position.z = -35;
knife.receiveShadow = true;
scene.add(knife);



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

    var tween = new TWEEN.Tween(knife.rotation)
      .to({ x:0 }, 200).repeat(1).yoyo(true)
      .onUpdate(function () {})
      .onComplete(function () {
      })
      .start();

    var tween1 = new TWEEN.Tween(meshes[0].position)
      .to({ y: -70, x: meshes[0].position.x + 200 }, 1000)
      .onUpdate(function () {})
      .onComplete(function () {
        scene.remove(meshes[0]);
      })
      .start();
    var tween = new TWEEN.Tween(meshes[0].rotation)
      .to({ z: -Math.PI/2 }, 2000)
      .onComplete(function () {})
      .start();
    var tween = new TWEEN.Tween(meshes[1].position)
      .to({ y: 0, x: meshes[1].position.x + 10 }, 500)
      .onComplete(function () {
        cubeMeshes = nextCut(meshes[1]);
      })
      .start();
   }
});

function bendGeometry(geometry) {
  for (let i = 0; i < geometry.vertices.length; i++) {
    geometry.vertices[i].y = geometry.vertices[i].y;
  }

  // tells Three.js to re-render this mesh
  geometry.verticesNeedUpdate = true;
}

function nextCut(mainMesh) {
  var leftBoundingMesh = new THREE.Mesh(
    new THREE.BoxGeometry(190, 100, 100),
    new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      shininess: 100,
    })
  );
  leftBoundingMesh.position.x = -190/2;
  var rightBoundingMesh = new THREE.Mesh(
    new THREE.BoxGeometry(10, 100, 100),
    new THREE.MeshPhongMaterial({
      color: 0x0000ff,
      shininess: 100,
    })
  );
  rightBoundingMesh.position.x = 5;
  leftBoundingMesh.visible = false;
  rightBoundingMesh.visible = false;

  scene.add(leftBoundingMesh);
  scene.add(rightBoundingMesh);
  mainMesh.updateMatrix();
  leftBoundingMesh.updateMatrix();
  rightBoundingMesh.updateMatrix();
  // scene.remove(mainMesh);  
  return [mainMesh, leftBoundingMesh, rightBoundingMesh];
}

function cutDemo() {
  var mainMesh = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(25, 25, 200, 64, 64),
    new THREE.MeshPhongMaterial({
      color: 0xff0000,
      shininess: 100,
    })
  );
  mainMesh.position.x = -90;
  mainMesh.rotation.z = Math.PI / 2;

  var leftBoundingMesh = new THREE.Mesh(
    new THREE.BoxGeometry(190, 100, 100),
    new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      shininess: 100,
    })
  );
  leftBoundingMesh.position.x = -190/2;
  var rightBoundingMesh = new THREE.Mesh(
    new THREE.BoxGeometry(10, 100, 100),
    new THREE.MeshPhongMaterial({
      color: 0x0000ff,
      shininess: 100,
    })
  );
  rightBoundingMesh.position.x = 5;
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
 
  var leftMesh = doCSG(mainMesh, leftBoundingMesh, "subtract", params.material);

  var rightMesh = doCSG(mainMesh, rightBoundingMesh, "subtract", params.material);
  scene.remove(mainMesh);
  return [leftMesh, rightMesh];
}
