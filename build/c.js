import CSG from"./lib/cs.js";var modifier;function doCSG(c,a,b,d){var e=CSG.fromMesh(c),f=CSG.fromMesh(a),g=e[b](f),h=CSG.toMesh(g,c.matrix);return h.material=d,h.castShadow=h.receiveShadow=!0,h}var knife=new THREE.Mesh(new THREE.PlaneBufferGeometry(3,3,1,1),new THREE.MeshPhongMaterial({color:255,shininess:10,doubleSide:!0}));knife.rotation.y=Math.PI/2,knife.scale.set(50,7,1),knife.position.z=-35,knife.position.x=.5,knife.position.y=40,knife.receiveShadow=!0,scene.add(knife);var cubeMeshes=cutDemo(),enableInput=!0,deltaWidth=0,mainMeshPos=-100,newWidth=200,mainTween=new TWEEN.Tween(cubeMeshes[0].position).to({x:cubeMeshes[0].position.x+100},5e4).delay(50).onComplete(function(){}).onStop(function(){deltaWidth=cubeMeshes[0].position.x+100}).start();function getMeshToBend(a){let b=new THREE.Mesh(new THREE.CylinderGeometry(25,25,a,64,64),new THREE.MeshPhongMaterial({color:16711680,shininess:100}));return b.position.x=0,b.rotation.z=-Math.PI/2,b.rotation.x=Math.PI,b}window.addEventListener("keypress",a=>{if("c"===a.key&&enableInput){enableInput=!1;let a=doOperation(cubeMeshes[0],cubeMeshes[1],cubeMeshes[2],{material:new THREE.MeshPhongMaterial({color:16711680,shininess:100})});scene.add(a[1]),scene.remove(a[0]),mainTween.stop(),mainMeshPos=a[1].position.x,newWidth-=deltaWidth;var b=getMeshToBend(deltaWidth);b.position.x=deltaWidth/2,scene.add(b),cubeMeshes=nextCut(a[1]),bendMesh(b);var c=new TWEEN.Tween(knife.position).to({y:-15},1300).repeat(1).yoyo(!0).easing(TWEEN.Easing.Cubic.InOut).onUpdate(function(){}).onComplete(function(){}).start(),d=new TWEEN.Tween(b.position).to({y:-200,x:b.position.x+100},2e3).delay(1500).onUpdate(function(){}).onComplete(function(){scene.remove(b),enableInput=!0}).start();mainTween=new TWEEN.Tween(a[1].position).to({x:a[1].position.x+100},5e4).delay(3500).onComplete(function(){}).onStop(function(){deltaWidth=a[1].position.x-mainMeshPos}).start()}});function nextCut(a){var b=new THREE.Mesh(new THREE.BoxGeometry(200,100,100),new THREE.MeshPhongMaterial({color:65280,shininess:100}));b.position.x=-100;var c=new THREE.Mesh(new THREE.BoxGeometry(50,100,100),new THREE.MeshPhongMaterial({color:255,shininess:100}));return c.position.x=25,b.visible=!1,c.visible=!1,scene.add(b),scene.add(c),a.updateMatrix(),b.updateMatrix(),c.updateMatrix(),[a,b,c]}function cutDemo(){let a=new THREE.Mesh(new THREE.CylinderBufferGeometry(25,25,200,64,64),new THREE.MeshPhongMaterial({color:16711680,shininess:100}));a.position.x=-100,a.rotation.z=Math.PI/2;var b=new THREE.Mesh(new THREE.BoxGeometry(200,100,100),new THREE.MeshPhongMaterial({color:65280,shininess:100}));b.position.x=-100;var c=new THREE.Mesh(new THREE.BoxGeometry(50,100,100),new THREE.MeshPhongMaterial({color:255,shininess:100}));return c.position.x=25,b.visible=!1,c.visible=!1,scene.add(a),scene.add(b),scene.add(c),a.updateMatrix(),b.updateMatrix(),c.updateMatrix(),[a,b,c]}function doOperation(a,b,c,d){let e=doCSG(a,b,"subtract",d.material),f=doCSG(a,c,"subtract",d.material);return scene.remove(a),scene.remove(b),scene.remove(c),a.geometry.dispose(),a.material.dispose(),a=void 0,[e,f]}