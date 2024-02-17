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
  { speed: 400 },
]);

k.onResize(() => {
  const resizeFactor = k.width() / k.height();
  if (resizeFactor < 1) {
    k.camScale(k.vec2(1.5));
  } else {
    k.camScale(1);
  }
});

k.onUpdate(() => {
  k.camPos(player.pos);
});

k.onMouseDown(() => {
  const mouseDirectionX = k.mousePos().x - k.width() / 2 > 0 ? "right" : "left";
  const mouseDirectionY = k.mousePos().y - k.height() / 2 > 0 ? "down" : "up";
  const activeAxis =
    k.mousePos().y < player.pos.y + 100 && k.mousePos().y > player.pos.y - 100
      ? "horizontal"
      : "vertical";

  if (player.curAnim() !== "walk-down") {
    player.play("walk-down");
  }

  if (mouseDirectionX === "left" && activeAxis === "horizontal") {
    player.move(-player.speed, 0);
    return;
  }

  if (mouseDirectionX === "right" && activeAxis === "horizontal") {
    player.move(player.speed, 0);
    return;
  }

  if (mouseDirectionY === "up" && activeAxis === "vertical") {
    player.move(0, -player.speed);
    return;
  }

  if (mouseDirectionY === "down" && activeAxis === "vertical") {
    player.move(0, player.speed);
    return;
  }
});

k.onMouseRelease(() => {
  player.play("idle-down");
});
