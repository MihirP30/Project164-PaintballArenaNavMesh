AFRAME.registerComponent("bullets", {
  init: function () {
    this.shootBullet();
  },

  shootBullet: function () {
    window.addEventListener("keydown", (e) => {
      if (e.key === "z") {
        const bullet = document.createElement("a-entity");
        bullet.setAttribute("geometry", {
          primitive: "sphere",
          radius: 0.1,
        });
        bullet.setAttribute("material", "color", "black");

        const cam = document.querySelector("#camera-rig");
        const pos = cam.getAttribute("position");

        bullet.setAttribute("position", {
          x: pos.x,
          y: pos.y + 1.6,
          z: pos.z - 0.08,
        });

        const camera = document.querySelector("#camera").object3D;
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        bullet.setAttribute("velocity", direction.multiplyScalar(-20));

        const scene = document.querySelector("#scene");

        bullet.setAttribute("dynamic-body", {
          shape: "sphere",
          mass: "0",
        });
        bullet.setAttribute("visible", false);

        bullet.addEventListener("collide", this.removeBullet);
        scene.appendChild(bullet);

        this.shootSound();
      }
    });
  },

  removeBullet: function (e) {
    const scene = document.querySelector("#scene");
    const element = e.detail.target.el;
    const elementHit = e.detail.body.el;

    const paint = document.createElement("a-entity");
    const pos = element.getAttribute("position");
    const rotate = elementHit.getAttribute("rotation");

    paint.setAttribute("position", pos);
    paint.setAttribute("rotation", rotate);
    paint.setAttribute("scale", { x: 2, y: 2, z: 2 });

    const colorNum = parseInt(Math.random() * 8 + 1);
    paint.setAttribute("material", {
      opacity: 1,
      transparent: true,
      src: `./images/paint splash-0${colorNum}.png`,
    });

    paint.setAttribute("geometry", {
      primitive: "plane",
      width: 0.5,
      height: 0.5,
    });
    scene.appendChild(paint);

    element.removeEventListener("collide", this.removeBullet);
    scene.removeChild(element);
  },

  shootSound: function () {
    const entity = document.querySelector("#sound1");
    entity.components.sound.playSound();
  },
});