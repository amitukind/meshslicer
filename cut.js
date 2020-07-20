import CSG from "./lib/CSGMesh.js";
var modifier;
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
    doubleSide: true,
  })
);
knife.rotation.y = Math.PI / 2;
knife.scale.set(50, 7, 1);
knife.position.z = -35;
knife.position.x = 0.5;
knife.position.y = 40;
knife.receiveShadow = true;
scene.add(knife);

var cubeMeshes = cutDemo();
var enableInput = true;
var deltaWidth = 0;
var mainMeshPos = -100;
var newWidth = 200;
var mainTween = new TWEEN.Tween(cubeMeshes[0].position)
  .to({ x: cubeMeshes[0].position.x + 100 }, 50000)
  .delay(50)
  .onComplete(function () {})
  .onStop(function () {
    deltaWidth = cubeMeshes[0].position.x + 100;
  })
  .start();

function getMeshToBend(width) {
  let meshToBend = new THREE.Mesh(
    new THREE.CylinderGeometry(25, 25, width, 64, 64),
    new THREE.MeshPhongMaterial({
      color: 0xff0000,
      shininess: 100,
    })
  );
  meshToBend.position.x = 0;
  meshToBend.rotation.z = -Math.PI / 2;
  meshToBend.rotation.x = Math.PI;
  return meshToBend;
}

window.addEventListener("keypress", (event) => {
  if (event.key === "c" && enableInput) {
    enableInput = false;
    
    let meshes = doOperation(cubeMeshes[0], cubeMeshes[1], cubeMeshes[2], {
      material: new THREE.MeshPhongMaterial({
        color: 0xff0000,
        shininess: 100,
      }),
    });
    scene.add(meshes[1]); //big piece
    scene.remove(meshes[0]);
    
    mainTween.stop();
    mainMeshPos = meshes[1].position.x;
    newWidth -=  deltaWidth;
    var meshToBend = getMeshToBend(deltaWidth);
    // meshToBend.scale.y = deltaWidth/5;

    meshToBend.position.x = deltaWidth/2;
    scene.add(meshToBend);
    
    cubeMeshes = nextCut(meshes[1]);

    bendMesh(meshToBend);
    var knifeTween = new TWEEN.Tween(knife.position)
    .to({ y: -15 }, 1300)
    .repeat(1)
    .yoyo(true).easing(TWEEN.Easing.Cubic.InOut)
    .onUpdate(function () {})
    .onComplete(function () {})
    .start();

    var tween1 = new TWEEN.Tween(meshToBend.position)
      .to({ y: -200, x: meshToBend.position.x + 100 }, 2000)
      .delay(1500)
      .onUpdate(function () {})
      .onComplete(function () {
        scene.remove(meshToBend);
        enableInput = true;
      })
      .start();

    mainTween = new TWEEN.Tween(meshes[1].position)
      .to({ x: meshes[1].position.x + 100 }, 50000)
      .delay(3500)
      .onComplete(function () {})
      .onStop(function () {
        deltaWidth = meshes[1].position.x - mainMeshPos;
      })
      .start();
  }
});


function nextCut(NextmainMesh) {
  var leftBoundingMesh = new THREE.Mesh(
    new THREE.BoxGeometry(200, 100, 100),
    new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      shininess: 100,
    })
  );
  leftBoundingMesh.position.x = -100;
  var rightBoundingMesh = new THREE.Mesh(
    new THREE.BoxGeometry(50, 100, 100),
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
  NextmainMesh.updateMatrix();
  leftBoundingMesh.updateMatrix();
  rightBoundingMesh.updateMatrix();

  return [NextmainMesh, leftBoundingMesh, rightBoundingMesh];
}

function cutDemo() {
  let mainMesh = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(25, 25, 200, 64, 64),
    new THREE.MeshPhongMaterial({
      color: 0xff0000,
      shininess: 100,
    })
  );
  mainMesh.position.x = -100;
  mainMesh.rotation.z = Math.PI / 2;

  var leftBoundingMesh = new THREE.Mesh(
    new THREE.BoxGeometry(200, 100, 100),
    new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      shininess: 100,
    })
  );
  leftBoundingMesh.position.x = -100;
  var rightBoundingMesh = new THREE.Mesh(
    new THREE.BoxGeometry(50, 100, 100),
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

function doOperation(_mainMesh, _leftBoundingMesh, _rightBoundingMesh, _params) {
  let __leftMesh = doCSG(_mainMesh, _leftBoundingMesh, "subtract", _params.material);

  let __rightMesh = doCSG(
    _mainMesh,
    _rightBoundingMesh,
    "subtract",
    _params.material
  );
  scene.remove(_mainMesh);
  scene.remove(_leftBoundingMesh);
  scene.remove(_rightBoundingMesh);
  _mainMesh.geometry.dispose();
  _mainMesh.material.dispose();
  _mainMesh = undefined;
  return [__leftMesh, __rightMesh];
}
