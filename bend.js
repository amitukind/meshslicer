var bend, modifier, prevMod;
function bendMesh(mesh)
{
    //  mesh.rotation.z = - Math.PI / 2;
      //mesh.rotation.x = -Math.PI/2;
   

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
        //TweenMax.killTweensOf(prevMod);
    }
    modifier.reset();
    modifier.addModifier(mod);

    prevMod = mod;
}

function tweenBend()
{
    changeModifier(bend);
                    // TweenMax.fromTo(bend, 2,
                    //     {
                    //         force: 0
                    //     }, {
                    //     force: -1,
                    //     ease: Cubic.easeInOut
                    // }
                    // );
                    bend.force = 0;
                    var tween = new TWEEN.Tween(bend)
                    .to({ force:-1 }, 1800).easing(TWEEN.Easing.Cubic.InOut).delay(350)
                    .onUpdate(function () {})
                    .onComplete(function () {
                    })
                    .start();
              

}
