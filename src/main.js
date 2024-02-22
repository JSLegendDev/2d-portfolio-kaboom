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
  { speed: 400, direction: "down" },
  "player",
]);

const dialogueManager = {};

player.onCollide("npc", () => {
  const dialogueBox = document.getElementById("textbox");
  const dialogue = document.getElementById("dialogue");

  dialogueBox.style.display = "block";
  const text = "This is a test!\nIt's really cool!";
  let index = 0;
  dialogueManager.intervalRef = setInterval(() => {
    if (index < text.length) {
      dialogue.innerHTML += text[index];
      index++;
      return;
    }

    clearInterval(dialogueManager.intervalRef);
  }, 10);
});

player.onCollideEnd("npc", () => {
  const dialogueBox = document.getElementById("textbox");
  const dialogue = document.getElementById("dialogue");
  dialogueBox.style.display = "none";
  dialogue.innerText = "";
  clearInterval(dialogueManager.intervalRef);
});

const leftZone = player.add([
  k.pos(-k.width() / 2, -8),
  k.area({
    shape: new k.Rect(k.vec2(0), k.width() / 2, 16),
    collisionIgnore: ["controlZone", "player"],
  }),
  "controlZone",
]);

leftZone.onHover(() => {
  player.direction = "left";
});

const rightZone = player.add([
  k.pos(0, -8),
  k.area({
    shape: new k.Rect(k.vec2(0), k.width() / 2, 16),
    collisionIgnore: ["controlZone", "player"],
  }),
  "controlZone",
]);

rightZone.onHover(() => {
  player.direction = "right";
});

const topZone = player.add([
  k.pos(0, -158),
  k.area({
    shape: new k.Rect(k.vec2(0), 16, 300),
    collisionIgnore: ["controlZone", "player"],
  }),
  k.anchor("center"),
  "controlZone",
]);

topZone.onHover(() => {
  player.direction = "up";
});

const topDiagonalRight = player.add([
  k.pos(10, -10),
  k.rotate(270),
  k.area({
    shape: new k.Rect(k.vec2(0), k.width() / 2, 300),
    collisionIgnore: ["controlZone", "player"],
  }),
  "controlZone",
]);

topDiagonalRight.onHover(() => {
  player.direction = "diagonal-top-right";
});

const topDiagonalLeft = player.add([
  k.pos(-10, -10),
  k.rotate(180),
  k.area({
    shape: new k.Rect(k.vec2(0), k.width() / 2, 300),
    collisionIgnore: ["controlZone", "player"],
  }),
  "controlZone",
]);

topDiagonalLeft.onHover(() => {
  player.direction = "diagonal-top-left";
});

const bottomDiagonalLeft = player.add([
  k.pos(-10, 10),
  k.rotate(90),
  k.area({
    shape: new k.Rect(k.vec2(0), k.width() / 2, 300),
    collisionIgnore: ["controlZone", "player"],
  }),
  "controlZone",
]);

bottomDiagonalLeft.onHover(() => {
  player.direction = "diagonal-bottom-left";
});

const bottomDiagonalRight = player.add([
  k.pos(10, 10),
  k.rotate(0),
  k.area({
    shape: new k.Rect(k.vec2(0), k.width() / 2, 300),
    collisionIgnore: ["controlZone", "player"],
  }),
  "controlZone",
]);

bottomDiagonalRight.onHover(() => {
  player.direction = "diagonal-bottom-right";
});

const bottomZone = player.add([
  k.pos(0, 158),
  k.area({
    shape: new k.Rect(k.vec2(0), 16, 300),
    collisionIgnore: ["controlZone", "player"],
  }),
  k.anchor("center"),
  "controlZone",
]);

bottomZone.onHover(() => {
  player.direction = "down";
});

function setCamScale(k) {
  const resizeFactor = k.width() / k.height();
  if (resizeFactor < 1) {
    k.camScale(k.vec2(1));
  } else {
    k.camScale(k.vec2(1.5));
  }
}

setCamScale(k);

k.onResize(() => {
  leftZone.area.shape.width = k.width() / 2;
  leftZone.pos.x = -k.width() / 2;
  rightZone.area.shape.width = k.width() / 2;
  setCamScale(k);
});

k.onUpdate(() => {
  k.camPos(player.pos.x, player.pos.y - 100);
});

k.onMouseDown(() => {
  if (player.direction === "left") {
    player.flipX = true;
    if (player.curAnim() !== "walk-side") {
      player.play("walk-side");
    }
    player.move(-player.speed, 0);
    return;
  }
  if (player.direction === "right") {
    player.flipX = false;
    if (player.curAnim() !== "walk-side") {
      player.play("walk-side");
    }
    player.move(player.speed, 0);
    return;
  }
  if (player.direction === "up") {
    if (player.curAnim() !== "walk-up") {
      player.play("walk-up");
    }
    player.move(0, -player.speed);
    return;
  }
  if (player.direction === "down") {
    if (player.curAnim() !== "walk-down") {
      player.play("walk-down");
    }
    player.move(0, player.speed);
    return;
  }

  if (player.direction === "diagonal-top-right") {
    player.flipX = false;
    if (player.curAnim() !== "walk-side") {
      player.play("walk-side");
    }
    player.move(player.speed / 2, -player.speed / 2);
    return;
  }

  if (player.direction === "diagonal-top-left") {
    player.flipX = true;
    if (player.curAnim() !== "walk-side") {
      player.play("walk-side");
    }
    player.move(-player.speed / 2, -player.speed / 2);
    return;
  }

  if (player.direction === "diagonal-bottom-left") {
    player.flipX = true;
    if (player.curAnim() !== "walk-side") {
      player.play("walk-side");
    }
    player.move(-player.speed / 2, player.speed / 2);
    return;
  }

  if (player.direction === "diagonal-bottom-right") {
    player.flipX = false;
    if (player.curAnim() !== "walk-side") {
      player.play("walk-side");
    }
    player.move(player.speed / 2, player.speed / 2);
    return;
  }
});

k.onMouseRelease(() => {
  if (player.direction === "down") {
    player.play("idle-down");
    return;
  }
  if (player.direction === "up") {
    player.play("idle-up");
    return;
  }

  player.play("idle-side");
});
