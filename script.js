//apparently you don't need a querySelector :/

window.addEventListener("load",()=>{
    //all HTML element ids are saved as variables automatically so no need to reference it
    var scene = document.querySelector("a-scene");
    var soundisPlaying = false;

    //hands setup
    AFRAME.registerComponent('capture-mouse', {
        init: function () {
            this.eventRepeater = this.eventRepeater.bind(this)
            this.el.sceneEl.addEventListener('loaded', () => {
                this.el.sceneEl.canvas.addEventListener('mousedown', this.eventRepeater)
                this.el.sceneEl.canvas.addEventListener('mouseup', this.eventRepeater)
                this.el.sceneEl.canvas.addEventListener('touchstart', this.eventRepeater)
                this.el.sceneEl.canvas.addEventListener('touchmove', this.eventRepeater)
                this.el.sceneEl.canvas.addEventListener('touchend', this.eventRepeater)
            }, { once: true })
        },
        eventRepeater: function (evt) {
            if (evt.type.startsWith('touch')) {
                evt.preventDefault()
                // avoid repeating touchmove because it interferes with look-controls
                if (evt.type === 'touchmove') { return }
            }
            this.el.emit(evt.type, evt.detail)
        }
    })

    //key controls
    window.addEventListener("keydown",(key)=>{
        var keyCode = key.keyCode;
        //music toggling: press space to pause/play music
        if (keyCode===32){
            soundisPlaying = !soundisPlaying;
            if (soundisPlaying) {
                hedge.components.sound.playSound();
            }
            else {
                hedge.components.sound.pauseSound();
            }
        }
        //reset playCube position with backspace
        if (keyCode===8){
            playBall.body.position.set(10,0.2,-0.5);
        }
    })

    //bumping the chain
    scene.addEventListener("click", () => {
        var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

        sphere2.body.applyImpulse(
            new CANNON.Vec3(-10, 20, 0),
            new CANNON.Vec3().copy(sphere2.getAttribute('position'))
        );

        cylinder1.setAttribute('material','color',randomColor);
        
    })

    //collision detection
    var numOfCubes = 7;

    var changeColorCollide = (nameOfBody) => {

        nameOfBody.addEventListener("collide", (e) => {
            if(e.detail.body.id===6){
                var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
                nameOfBody.setAttribute('material', 'color', randomColor);
            };
        })
    }

    for (i = 0; i < numOfCubes; i++) {
        var cubeI = eval('cube'+i);

        changeColorCollide(cubeI);
    }
})

