var bend, modifier, prevMod;
function bendMesh(mesh) {
  addModifier(mesh);
  tweenBend();
}
function addModifier(mesh) {
  modifier = new ModifierStack(mesh);

  bend = new Bend(1.5, 0.2, 0);
  bend.constraint = ModConstant.LEFT;
}
function changeModifier(mod) {
  if (prevMod) {
    modifier.removeModifier(prevMod);
  }
  modifier.reset();
  modifier.addModifier(mod);

  prevMod = mod;
}

function tweenBend() {
  changeModifier(bend);
  bend.force = 0;
}

function updateBendForce(val) {
  if (val < bend.force) bend.force = val;
}
