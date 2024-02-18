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
  { speed: 400, activeAxis: "vertical" },
]);

const horizontalZone = player.add([
  k.rect(k.width(), 16),
  k.pos(-k.width() / 2, -8),
  k.area(),
  k.opacity(0),
]);

horizontalZone.onClick(() => {
  player.activeAxis = "horizontal";
});

function setCamScale(k) {
  const resizeFactor = k.width() / k.height();
  if (resizeFactor < 1) {
    k.camScale(k.vec2(1.5));
  } else {
    k.camScale(1);
  }
}

setCamScale(k);

k.onResize(() => {
  horizontalZone.width = k.width();
  horizontalZone.pos.x = -k.width() / 2;
  setCamScale(k);
});

k.onUpdate(() => {
  k.camPos(player.pos.x, player.pos.y - 100);
});

k.onMouseDown(() => {
  const mouseDirectionX = k.mousePos().x - k.width() / 2 > 0 ? "right" : "left";
  const mouseDirectionY = k.mousePos().y - k.height() / 2 > 0 ? "down" : "up";

  if (player.curAnim() !== "walk-down") {
    player.play("walk-down");
  }

  if (player.activeAxis === "horizontal") {
    if (mouseDirectionX === "left") {
      player.move(-player.speed, 0);
      return;
    }

    if (mouseDirectionX === "right") {
      player.move(player.speed, 0);
      return;
    }
  }

  if (player.activeAxis === "vertical") {
    if (mouseDirectionY === "up") {
      player.move(0, -player.speed);
      return;
    }

    if (mouseDirectionY === "down") {
      player.move(0, player.speed);
      return;
    }
  }
});

k.onMouseRelease(() => {
  player.play("idle-down");
  player.activeAxis = "vertical";
});
