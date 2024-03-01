import { scaleFactor } from "./constants";
import { k } from "./kaboomCtx";

k.loadSprite("spritesheet", "./spritesheet.png", {
  sliceX: 39,
  sliceY: 31,
  anims: {
    "idle-down": 936,
    "walk-down": { from: 936, to: 939, loop: true, speed: 8 },
    "idle-side": 975,
    "walk-side": { from: 975, to: 978, loop: true, speed: 8 },
    "idle-up": 1014,
    "walk-up": { from: 1014, to: 1017, loop: true, speed: 8 },
  },
});

k.loadSprite("map", "./map.png");

k.setBackground(k.Color.fromHex("#311047"));

k.scene("main", async () => {
  const mapData = await (await fetch("./map.json")).json();
  const layers = mapData.layers;

  const map = k.add([k.sprite("map"), k.pos(0), k.scale(scaleFactor)]);

  const player = k.make([
    k.sprite("spritesheet", { anim: "idle-down" }),
    k.area({
      collisionIgnore: ["controlZone"],
      shape: new k.Rect(k.vec2(0), 12, 16),
    }),
    k.body(),
    k.anchor("center"),
    k.pos(),
    k.scale(scaleFactor),
    { speed: 250, direction: "down", isInDialogue: false },
    "player",
  ]);

  const npcTest = k.make([
    k.rect(50, 50),
    k.outline(3),
    k.area(),
    k.body({ isStatic: true }),
    k.pos(),
    "npc",
  ]);

  for (const layer of layers) {
    if (layer.name === "boundaries") {
      for (const boundary of layer.objects) {
        map.add([
          k.area({
            shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
          }),
          k.body({ isStatic: true }),
          k.pos(boundary.x, boundary.y),
        ]);
      }

      continue;
    }

    if (layer.name === "spawnpoints") {
      for (const entity of layer.objects) {
        if (entity.name === "player") {
          player.pos = k.vec2(
            (map.pos.x + entity.x) * scaleFactor,
            (map.pos.y + entity.y) * scaleFactor
          );
          k.add(player);
          continue;
        }

        if (entity.name === "npc-test") {
          npcTest.pos = k.vec2(
            (map.pos.x + entity.x) * scaleFactor,
            (map.pos.y + entity.y) * scaleFactor
          );
          k.add(npcTest);
        }
      }
    }
  }

  player.onCollide("npc", () => {
    player.isInDialogue = true;
    const dialogueUI = document.getElementById("textbox-ui");
    const dialogue = document.getElementById("dialogue");

    dialogueUI.style.display = "block";
    const text =
      "The text box you're currently reading is not rendered within canvas!\nIt's made with html and css!";
    let index = 0;
    const intervalRef = setInterval(() => {
      if (index < text.length) {
        dialogue.innerHTML += text[index];
        index++;
        return;
      }

      clearInterval(intervalRef);
    }, 5);

    document.getElementById("close").addEventListener("click", () => {
      player.isInDialogue = false;
      dialogueUI.style.display = "none";
      dialogue.innerHTML = "";
      clearInterval(intervalRef);
    });
  });

  function setCamScale(k) {
    const resizeFactor = k.width() / k.height();
    if (resizeFactor < 1) {
      k.camScale(k.vec2(1));
    } else {
      k.camScale(k.vec2(1.5));
    }
  }

  function setAnimToIdle() {
    if (player.direction === "down") {
      player.play("idle-down");
      return;
    }
    if (player.direction === "up") {
      player.play("idle-up");
      return;
    }

    player.play("idle-side");
  }

  setCamScale(k);

  k.onResize(() => {
    setCamScale(k);
  });

  k.onUpdate(() => {
    k.camPos(player.worldPos().x, player.worldPos().y - 100);
  });

  k.onMouseDown(() => {
    if (player.isInDialogue) return;

    const worldMousePos = k.toWorld(k.mousePos());
    player.moveTo(worldMousePos, player.speed);

    const mouseAngle = player.pos.angle(worldMousePos);

    if (mouseAngle > 80 && mouseAngle < 95 && player.curAnim() !== "walk-up") {
      player.play("walk-up");
      player.direction = "up";
      return;
    }

    if (
      mouseAngle < -80 &&
      mouseAngle > -95 &&
      player.curAnim() !== "walk-down"
    ) {
      player.play("walk-down");
      player.direction = "down";
      return;
    }

    if (Math.abs(mouseAngle) > 95) {
      player.flipX = false;
      if (player.curAnim() !== "walk-side") player.play("walk-side");
      player.direction = "right";
      return;
    }

    if (Math.abs(mouseAngle) < 80) {
      player.flipX = true;
      if (player.curAnim() !== "walk-side") player.play("walk-side");
      player.direction = "left";
      return;
    }
  });

  k.onMouseRelease(() => {
    setAnimToIdle();
  });
});

k.go("main");
