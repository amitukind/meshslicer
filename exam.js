var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(50, 100, 100);
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

scene.add(new THREE.AxesHelper(10));

var directionalLight1 = new THREE.DirectionalLight( 0xffffff, 0.2);
  directionalLight1.castShadow = true;
  directionalLight1.position.set( 1, 1, 1);
  scene.add( directionalLight1 );

  var directionalLight1 = new THREE.DirectionalLight( 0xffffff, 0.2);
  directionalLight1.castShadow = true;
  directionalLight1.position.set( 1, 1, -1);
  scene.add( directionalLight1 );

  var directionalLight1 = new THREE.DirectionalLight( 0xffffff, 0.2);
  directionalLight1.castShadow = true;
  directionalLight1.position.set( 1, -1, 1);
  scene.add( directionalLight1 );

  var directionalLight1 = new THREE.DirectionalLight( 0xffffff, 0.2);
  directionalLight1.castShadow = true;
  directionalLight1.position.set( 1, -1, -1);
  scene.add( directionalLight1 );

  var directionalLight1 = new THREE.DirectionalLight( 0xffffff, 0.2);
  directionalLight1.castShadow = true;
  directionalLight1.position.set( -1, 1, 1);
  scene.add( directionalLight1 );

  var directionalLight1 = new THREE.DirectionalLight( 0xffffff, 0.2);
  directionalLight1.castShadow = true;
  directionalLight1.position.set( -1, 1, -1);
  scene.add( directionalLight1 );

  var directionalLight1 = new THREE.DirectionalLight( 0xffffff, 0.2);
  directionalLight1.castShadow = true;
  directionalLight1.position.set( -1, -1, 1);
  scene.add( directionalLight1 );

  var directionalLight1 = new THREE.DirectionalLight( 0xffffff, 0.2);
  directionalLight1.castShadow = true;
  directionalLight1.position.set( -1, -1, -1);
  scene.add( directionalLight1 );


scene.add(new THREE.AmbientLight(0xffffff, .5));

var geom = new THREE.BoxGeometry(
          150,
          0.1,
          50,
          150 * 10,
          1,
          1
          );

geom.vertices.forEach(function(v){
 x_val = Math.abs(v.x);
if((x_val % 9) < 0.75 || (x_val % 9) > 8.25){
          var m = parseInt(x_val/9) *9;
          var l = 0.75 - (m - x_val);
          v.y =  v.y + 0.75 * Math.sin(l* Math.PI/1.5);
        }
        else if(x_val % 3 < 0.25 || (x_val % 3) > 2.75){
          var m = parseInt(x_val/3) * 3;
          var l = 0.25 - (m - x_val);
          v.y =  v.y + 0.25 * Math.sin(l * Math.PI / 0.5);
        }
});
geom.computeFaceNormals();
geom.computeVertexNormals();

var corrugated = new THREE.Mesh(geom, new THREE.MeshLambertMaterial({color: "silver"}));
scene.add(corrugated);

document.addEventListener("click", function(){
  
  let cutLength = 125;
  let leftLimit = (cutLength - (geom.parameters.width * 0.5)) * -1;
  console.log(leftLimit);
  
  var marker = new THREE.Mesh(new THREE.SphereGeometry(1, 4, 2), new THREE.MeshBasicMaterial({color: 'red'}));
  marker.position.set(leftLimit, 0, geom.parameters.depth * 0.5);
  scene.add(marker);
  
  geom.vertices.forEach(v => {
    v.x = v.x < leftLimit ? leftLimit : v.x;
  });
  geom.vertices.forEach(v => {
    let zSign = Math.sign(v.z);
    if (v.z < 0) {
    v.z = -(v.x - leftLimit) * Math.tan(THREE.Math.degToRad(60)) + geom.parameters.depth * 0.5;
    v.z = Math.abs(v.z) > geom.parameters.depth * 0.5 ? geom.parameters.depth * 0.5 * zSign : v.z;
    }
  });
  geom.verticesNeedUpdate = true;
}, false);

render();
function render(){
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}