var splineHelperObjects = [],
  splineOutline;
var splinePointsLength = 4;
var positions = [];
var options;

var geometry = new THREE.BoxGeometry(20, 20, 20);
var transformControl;

var ARC_SEGMENTS = 200;
var splineMesh;

var splines = {};

var params = {
  uniform: false,
  tension: 0.5,
  centripetal: true,
  chordal: false,
  addPoint: addPoint,
  removePoint: removePoint,
  exportSpline: exportSpline,
};



function initBend() {


  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.damping = 0.2;
  controls.addEventListener("change", render);

  controls.addEventListener("start", function () {
    cancelHideTransorm();
  });

  controls.addEventListener("end", function () {
    delayHideTransform();
  });

  transformControl = new THREE.TransformControls(camera, renderer.domElement);
  transformControl.addEventListener("change", render);
  scene.add(transformControl);

  // Hiding transform situation is a little in a mess :()
  transformControl.addEventListener("change", function (e) {
    cancelHideTransorm();
  });

  transformControl.addEventListener("mouseDown", function (e) {
    cancelHideTransorm();
  });

  transformControl.addEventListener("mouseUp", function (e) {
    delayHideTransform();
  });

  transformControl.addEventListener("objectChange", function (e) {
    updateSplineOutline();
  });

  var dragcontrols = new THREE.DragControls(
    splineHelperObjects,
    camera,
    renderer.domElement
  ); //
  dragcontrols.enabled = false;
  dragcontrols.addEventListener("hoveron", function (event) {
    transformControl.attach(event.object);
    cancelHideTransorm();
  });

  dragcontrols.addEventListener("hoveroff", function (event) {
    delayHideTransform();
  });

  var hiding;

  function delayHideTransform() {
    cancelHideTransorm();
    hideTransform();
  }

  function hideTransform() {
    hiding = setTimeout(function () {
      transformControl.detach(transformControl.object);
    }, 2500);
  }

  function cancelHideTransorm() {
    if (hiding) clearTimeout(hiding);
  }


  for (var i = 0; i < splinePointsLength; i++) {
    addSplineObject(positions[i]);
  }

  positions = [];

  for (var i = 0; i < splinePointsLength; i++) {
    positions.push(splineHelperObjects[i].position);
  }

  var geometry = new THREE.Geometry();

  for (var i = 0; i < ARC_SEGMENTS; i++) {
    geometry.vertices.push(new THREE.Vector3());
  }

  var curve = new THREE.CatmullRomCurve3(positions);
  curve.curveType = "catmullrom";
  curve.mesh = new THREE.Line(
    geometry.clone(),
    new THREE.LineBasicMaterial({
      color: 0xff0000,
      opacity: 0.35,
      linewidth: 2,
    })
  );
  curve.mesh.castShadow = true;
  splines.uniform = curve;

  curve = new THREE.CatmullRomCurve3(positions);
  curve.curveType = "centripetal";
  curve.mesh = new THREE.Line(
    geometry.clone(),
    new THREE.LineBasicMaterial({
      color: 0x00ff00,
      opacity: 0.35,
      linewidth: 2,
    })
  );
  curve.mesh.castShadow = true;
  splines.centripetal = curve;

  curve = new THREE.CatmullRomCurve3(positions);
  curve.curveType = "chordal";
  curve.mesh = new THREE.Line(
    geometry.clone(),
    new THREE.LineBasicMaterial({
      color: 0x0000ff,
      opacity: 0.35,
      linewidth: 2,
    })
  );
  curve.mesh.castShadow = true;
  splines.chordal = curve;

  for (var k in splines) {
    var spline = splines[k];
    scene.add(spline.mesh);
  }



}


function initFish() {
    load([
        new THREE.Vector3(-150, 0, 0),
        new THREE.Vector3(-50, 0, 0),
        new THREE.Vector3(50, 0, 0),
        new THREE.Vector3(150, 0, 0),
      ]);
  texture = initTexture();

  customMaterial = new THREE.ShaderMaterial({
    wireframe: true,
    uniforms: {
      texture: { value: texture },
    },
    vertexShader: `
        uniform sampler2D texture;

        void main() {
            float tz = 1. - (position.z + 6.) / 10.;
            float textureLayers = 4.;
            // (i + 0.5) / textureLayers

            vec3 spline_pos = texture2D(texture, vec2(tz, (0.5) / textureLayers)).xyz;
            vec3 a = texture2D(texture, vec2(tz, (1. + 0.5) / textureLayers)).xyz;
            vec3 b = texture2D(texture, vec2(tz, (2. + 0.5) / textureLayers)).xyz;
            vec3 c = texture2D(texture, vec2(tz, (3. + 0.5) / textureLayers)).xyz;
            mat3 basis = mat3(a, b, c);

            vec4 worldPos = modelMatrix * vec4(position, 1.);
            worldPos = vec4(
                basis * 
                vec3(worldPos.x * 0., worldPos.y * 1., worldPos.z * 1.)

                // vec3(worldPos.x, worldPos.y, worldPos.z)
                + spline_pos
                , 1.);

            vec4 mvPosition = viewMatrix * worldPos;
            gl_Position = projectionMatrix * mvPosition;
        }
        `,
    fragmentShader: `
        void main() {
            gl_FragColor.rgb = vec3(0.);
        }
        `,
  });

  var loader = new THREE.OBJLoader();
  // load a resource
  loader.load(
    // resource URL
    "ORCA.OBJ",
    // called when resource is loaded
    function onLoad(object) {
      window.orca = object;
      object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.scale.multiplyScalar(50);
          child.position.y = 100;
          child.rotation.y = -Math.PI / 2;

          child.material = customMaterial;

        }
      });

      updateSplineOutline();


      orca.children[0].geometry.computeBoundingBox();
      console.log(orca.children[0].geometry.boundingBox);

      scene.add(object);
    }
  );
}


function updateSplineTexture() {
  if (!window.texture) return;
  var POINTS = 256;
  var points = splines.centripetal.getSpacedPoints(POINTS - 1);
  var frenetFrames = splines.centripetal.computeFrenetFrames(POINTS - 1);
  for (var i = 0; i < POINTS; i++) {
    var pt = points[i];
    setTextureValue(i, pt.x, pt.y, pt.z, 0);
    pt = frenetFrames.tangents[i];
    setTextureValue(i, pt.x, pt.y, pt.z, 1);
    pt = frenetFrames.normals[i];
    setTextureValue(i, pt.x, pt.y, pt.z, 2);
    pt = frenetFrames.binormals[i];
    setTextureValue(i, pt.x, pt.y, pt.z, 3);
  }

  texture.needsUpdate = true;
}

function addSplineObject(position) {
  var material = new THREE.MeshLambertMaterial({
    color: Math.random() * 0xffffff,
  });
  var object = new THREE.Mesh(geometry, material);

  if (position) {
    object.position.copy(position);
  } else {
    object.position.x = Math.random() * 1000 - 500;
    object.position.y = Math.random() * 600;
    object.position.z = Math.random() * 800 - 400;
  }

  object.castShadow = true;
  object.receiveShadow = true;
  scene.add(object);
  splineHelperObjects.push(object);
  return object;
}

function addPoint() {
  splinePointsLength++;

  positions.push(addSplineObject().position);

  updateSplineOutline();
}

function removePoint() {
  if (splinePointsLength <= 4) {
    return;
  }
  splinePointsLength--;
  positions.pop();
  scene.remove(splineHelperObjects.pop());

  updateSplineOutline();
}

function updateSplineOutline() {
  for (var k in splines) {
    var spline = splines[k];

    splineMesh = spline.mesh;

    for (var i = 0; i < ARC_SEGMENTS; i++) {
      var p = splineMesh.geometry.vertices[i];
      var t = i / (ARC_SEGMENTS - 1);
      spline.getPoint(t, p);
    }

    splineMesh.geometry.verticesNeedUpdate = true;

    updateSplineTexture();
  }
}

function exportSpline() {
  var strplace = [];

  for (var i = 0; i < splinePointsLength; i++) {
    var p = splineHelperObjects[i].position;
    strplace.push("new THREE.Vector3({0}, {1}, {2})".format(p.x, p.y, p.z));
  }

  console.log(strplace.join(",\n"));
  var code = "[" + strplace.join(",\n\t") + "]";
  prompt("copy and paste code", code);
}

function load(new_positions) {
  while (new_positions.length > positions.length) {
    addPoint();
  }

  while (new_positions.length < positions.length) {
    removePoint();
  }

  for (var i = 0; i < positions.length; i++) {
    positions[i].copy(new_positions[i]);
  }

  updateSplineOutline();
}

function animate() {
  requestAnimationFrame(animate);
  render();
  TWEEN.update();
  transformControl.update();
}

function render() {
  splines.uniform.mesh.visible = params.uniform;
  splines.centripetal.mesh.visible = params.centripetal;
  splines.chordal.mesh.visible = params.chordal;
  renderer.render(scene, camera);
}
initBend();
initFish();
animate();