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

k.add([k.rect(100, 100), k.pos(k.center().x, k.center().y)]);

const player = k.add([
  k.sprite("spritesheet", { anim: "idle-down" }),
  k.area(),
  k.anchor("center"),
  k.pos(k.center()),
  k.scale(scaleFactor),
  { speed: 400, direction: "down" },
]);

const leftZone = player.add([
  k.rect(k.width() / 2, 16),
  k.pos(-k.width() / 2, -8),
  k.area(),
  k.opacity(0),
]);

leftZone.onClick(() => {
  player.direction = "left";
});

const rightZone = player.add([
  k.rect(k.width() / 2, 16),
  k.pos(0, -8),
  k.area(),
  k.opacity(0),
]);

rightZone.onClick(() => {
  player.direction = "right";
});

const topZone = player.add([
  k.rect(k.width(), 300),
  k.pos(0, -158),
  k.area(),
  k.anchor("center"),
  k.opacity(0),
]);

topZone.onClick(() => {
  player.direction = "up";
});

const bottomZone = player.add([
  k.rect(k.width(), 300),
  k.pos(0, 158),
  k.area(),
  k.anchor("center"),
  k.opacity(0),
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
  leftZone.width = k.width() / 2;
  leftZone.pos.x = -k.width() / 2;
  rightZone.width = k.width() / 2;
  topZone.width = k.width();
  bottomZone.width = k.width();
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
});

k.onMouseRelease(() => {
  player.play("idle-down");
});
