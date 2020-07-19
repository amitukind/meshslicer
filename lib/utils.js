String.prototype.format = function () {
  var str = this;

  for (var i = 0; i < arguments.length; i++) {
    str = str.replace("{" + i + "}", arguments[i]);
  }
  return str;
};
function initTexture() {
  const width = 256;
  const height = 4;

  const dataArray = new Float32Array(width * height * 3);
  const dataTexture = new THREE.DataTexture(
    dataArray,
    width,
    height,
    THREE.RGBFormat,
    THREE.FloatType
  );

  dataTexture.needsUpdate = true;

  return dataTexture;
}

function setTextureValue(index, x, y, z, o) {
  const image = texture.image;
  const { width, height, data } = image;
  const i = 3 * width * (o || 0);
  data[index * 3 + i + 0] = x;
  data[index * 3 + i + 1] = y;
  data[index * 3 + i + 2] = z;
}
THREE.CatmullRomCurve3.prototype.computeFrenetFrames = function (
  segments,
  closed
) {
  // see http://www.cs.indiana.edu/pub/techreports/TR425.pdf

  var normal = new THREE.Vector3();

  var tangents = [];
  var normals = [];
  var binormals = [];

  var vec = new THREE.Vector3();
  var mat = new THREE.Matrix4();

  var i, u, theta;

  // compute the tangent vectors for each segment on the curve

  for (i = 0; i <= segments; i++) {
    u = i / segments;

    tangents[i] = this.getTangentAt(u);
    tangents[i].normalize();
  }

  // select an initial normal vector perpendicular to the first tangent vector,
  // and in the direction of the minimum tangent xyz component

  normals[0] = new THREE.Vector3();
  binormals[0] = new THREE.Vector3();
  var min = Number.MAX_VALUE;
  var tx = Math.abs(tangents[0].x);
  var ty = Math.abs(tangents[0].y);
  var tz = Math.abs(tangents[0].z);

  /**/

  if (tx <= min) {
    min = tx;
    normal.set(1, 0, 0);
  }

  if (ty <= min) {
    min = ty;
    normal.set(0, 1, 0);
  }

  if (tz <= min) {
    normal.set(0, 0, 1);
  }

  // console.log(normal);

  vec.crossVectors(tangents[0], normal).normalize();

  normals[0].crossVectors(tangents[0], vec);
  binormals[0].crossVectors(tangents[0], normals[0]);

  // binormals[ 0 ].set(0, 0, 1);
  // normals[ 0 ].crossVectors(tangents[ 0 ], binormals[ 0 ]).normalize();

  // compute the slowly-varying normal and binormal vectors for each segment on the curve

  for (i = 1; i <= segments; i++) {
    normals[i] = normals[i - 1].clone();

    binormals[i] = binormals[i - 1].clone();

    vec.crossVectors(tangents[i - 1], tangents[i]);

    if (vec.length() > Number.EPSILON) {
      vec.normalize();

      theta = Math.acos(
        THREE.Math.clamp(tangents[i - 1].dot(tangents[i]), -1, 1)
      ); // clamp for floating pt errors

      normals[i].applyMatrix4(mat.makeRotationAxis(vec, theta));
    }

    binormals[i].crossVectors(tangents[i], normals[i]);
  }

  // if the curve is closed, postprocess the vectors so the first and last normal vectors are the same

  if (closed === true) {
    theta = Math.acos(
      THREE.Math.clamp(normals[0].dot(normals[segments]), -1, 1)
    );
    theta /= segments;

    if (tangents[0].dot(vec.crossVectors(normals[0], normals[segments])) > 0) {
      theta = -theta;
    }

    for (i = 1; i <= segments; i++) {
      // twist a little...
      normals[i].applyMatrix4(mat.makeRotationAxis(tangents[i], theta * i));
      binormals[i].crossVectors(tangents[i], normals[i]);
    }
  }

  return {
    tangents: tangents,
    normals: normals,
    binormals: binormals,
  };
};
