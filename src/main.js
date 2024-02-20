import { scaleFactor } from "./constants";
import { k } from "./kaboomCtx";

k.loadSprite("spritesheet", "./spritesheet.png", {
  sliceX: 39,
  sliceY: 31,
  anims: {
    "idle-down": 936,
    "walk-down": { from: 936, to: 939, loop: true, speed: 8 },
  },
});

k.onUpdate(() => {
  k.debug.log(k.debug.fps());
});

k.add([k.rect(100, 100), k.pos(k.center().x, k.center().y)]);

const player = k.add([
  k.sprite("spritesheet", { anim: "idle-down" }),
  k.area({ collisionIgnore: ["controlZone"] }),
  k.anchor("center"),
  k.pos(k.center()),
  k.scale(scaleFactor),
  { speed: 400, direction: "down" },
  "player",
]);

const leftZone = player.add([
  k.pos(-k.width() / 2, -8),
  k.area({
    shape: new k.Rect(k.vec2(0), k.width() / 2, 16),
    collisionIgnore: ["controlZone", "player"],
  }),
  "controlZone",
]);

leftZone.onClick(() => {
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

rightZone.onClick(() => {
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

topZone.onClick(() => {
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

topDiagonalRight.onClick(() => {
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

topDiagonalLeft.onClick(() => {
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

bottomDiagonalLeft.onClick(() => {
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

bottomDiagonalRight.onClick(() => {
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

bottomZone.onClick(() => {
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
  if (player.curAnim() !== "walk-down") {
    player.play("walk-down");
  }
  if (player.direction === "left") {
    player.move(-player.speed, 0);
    return;
  }
  if (player.direction === "right") {
    player.move(player.speed, 0);
    return;
  }
  if (player.direction === "up") {
    player.move(0, -player.speed);
    return;
  }
  if (player.direction === "down") {
    player.move(0, player.speed);
    return;
  }

  if (player.direction === "diagonal-top-right") {
    player.move(player.speed / 2, -player.speed / 2);
    return;
  }

  if (player.direction === "diagonal-top-left") {
    player.move(-player.speed / 2, -player.speed / 2);
    return;
  }

  if (player.direction === "diagonal-bottom-left") {
    player.move(-player.speed / 2, player.speed / 2);
    return;
  }

  if (player.direction === "diagonal-bottom-right") {
    player.move(player.speed / 2, player.speed / 2);
    return;
  }
});

k.onMouseRelease(() => {
  player.play("idle-down");
});
