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

k.add([
  k.rect(50, 50),
  k.pos(k.center().x, k.center().y - 100),
  k.outline(3),
  k.area(),
  k.body({ isStatic: true }),
  "npc",
]);

const player = k.add([
  k.sprite("spritesheet", { anim: "idle-down" }),
  k.area({ collisionIgnore: ["controlZone"] }),
  k.body(),
  k.anchor("center"),
  k.pos(k.center()),
  k.scale(scaleFactor),
  { speed: 400, direction: "down", isInDialogue: false },
  "player",
]);

const dialogueManager = {};

player.onCollide("npc", () => {
  player.isInDialogue = true;
  const dialogueUI = document.getElementById("textbox-ui");
  const dialogue = document.getElementById("dialogue");

  dialogueUI.style.display = "block";
  const text =
    "The text box you're currently reading is not rendered within canvas!\nIt's made with html and css!";
  let index = 0;
  dialogueManager.intervalRef = setInterval(() => {
    if (index < text.length) {
      dialogue.innerHTML += text[index];
      index++;
      return;
    }

    clearInterval(dialogueManager.intervalRef);
  }, 5);

  document.getElementById("close").addEventListener("click", () => {
    player.isInDialogue = false;
    dialogueUI.style.display = "none";
    dialogue.innerHTML = "";
    clearInterval(dialogueManager.intervalRef);
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
  k.camPos(player.pos.x, player.pos.y - 100);
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
