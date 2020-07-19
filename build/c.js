import CSG from"./lib/cs.js";var modifier;function doCSG(c,a,b,d){var e=CSG.fromMesh(c),f=CSG.fromMesh(a),g=e[b](f),h=CSG.toMesh(g,c.matrix);return h.material=d,h.castShadow=h.receiveShadow=!0,h}var knife=new THREE.Mesh(new THREE.PlaneBufferGeometry(3,3,1,1),new THREE.MeshPhongMaterial({color:255,shininess:10,doubleSide:!0}));knife.rotation.y=Math.PI/2,knife.rotation.x=-Math.PI/2,knife.scale.set(50,5,1),knife.position.z=-35,knife.position.x=1,knife.position.y=5,knife.receiveShadow=!0,scene.add(knife);var cubeMeshes=cutDemo(),enableInput=!0;window.addEventListener("keypress",a=>{if("c"===a.key&&enableInput){enableInput=!1;var b=doOperation(cubeMeshes[0],cubeMeshes[1],cubeMeshes[2],{material:new THREE.MeshPhongMaterial({color:16711680,shininess:100})});scene.add(b[1]);var c=new THREE.Mesh(new THREE.CylinderGeometry(25,25,10,64,64),new THREE.MeshPhongMaterial({color:16711680,shininess:100}));c.position.x=5,c.rotation.z=-Math.PI/2,c.rotation.x=Math.PI,scene.add(c),bendMesh(c);var d=new TWEEN.Tween(knife.rotation).to({x:Math.PI/5},1500).repeat(1).yoyo(!0).onUpdate(function(){}).onComplete(function(){}).start(),e=new TWEEN.Tween(c.position).to({y:-200,x:c.position.x+100},2e3).delay(1500).onUpdate(function(){}).onComplete(function(){scene.remove(c),enableInput=!0}).start(),d=new TWEEN.Tween(b[1].position).to({y:0,x:b[1].position.x+10},1e3).delay(2500).onComplete(function(){cubeMeshes=nextCut(b[1])}).start()}});function bendGeometry(a){for(let b=0;b<a.vertices.length;b++)a.vertices[b].y=a.vertices[b].y;a.verticesNeedUpdate=!0}function nextCut(a){var b=new THREE.Mesh(new THREE.BoxGeometry(190,100,100),new THREE.MeshPhongMaterial({color:65280,shininess:100}));b.position.x=-95;var c=new THREE.Mesh(new THREE.BoxGeometry(10,100,100),new THREE.MeshPhongMaterial({color:255,shininess:100}));return c.position.x=5,b.visible=!1,c.visible=!1,scene.add(b),scene.add(c),a.updateMatrix(),b.updateMatrix(),c.updateMatrix(),[a,b,c]}function cutDemo(){var a=new THREE.Mesh(new THREE.CylinderBufferGeometry(25,25,200,64,64),new THREE.MeshPhongMaterial({color:16711680,shininess:100}));a.position.x=-90,a.rotation.z=Math.PI/2;var b=new THREE.Mesh(new THREE.BoxGeometry(190,100,100),new THREE.MeshPhongMaterial({color:65280,shininess:100}));b.position.x=-95;var c=new THREE.Mesh(new THREE.BoxGeometry(10,100,100),new THREE.MeshPhongMaterial({color:255,shininess:100}));return c.position.x=5,b.visible=!1,c.visible=!1,scene.add(a),scene.add(b),scene.add(c),a.updateMatrix(),b.updateMatrix(),c.updateMatrix(),[a,b,c]}function doOperation(a,b,c,d){var e=doCSG(a,b,"subtract",d.material),f=doCSG(a,c,"subtract",d.material);return scene.remove(a),[e,f]}