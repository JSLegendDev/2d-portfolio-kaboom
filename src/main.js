//import { dialogueData, scaleFactor } from "./constants";
import {scaleFactor} from "./constants";
import { k } from "./kaboomCtx";
//import { displayDialogue, setCamScale } from "./utils";

k.loadSprite("spritesheet", "./spritesheet.png", {
    sliceX: 39,
    sliceY: 31,
    anims: {
    "idle-down": 960,
    "walk-down": { from: 960, to: 963, loop: true, speed: 8 },
    "idle-side": 999,
    "walk-side": { from: 999, to: 1002, loop: true, speed: 8 },
    "idle-up": 1038,
    "walk-up": { from: 1038, to: 1041, loop: true, speed: 8 },
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
        shape: new k.Rect(k.vec2(0, 3), 10, 10),
        }),
        k.body(),
        k.anchor("center"),
        k.pos(),
        k.scale(scaleFactor),
        {
        speed: 250,
        direction: "down",
        isInDialogue: false,
        },
        "player",
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
                boundary.name,
                ]);

                if (boundary.name) {
                player.onCollide(boundary.name, () => {
                    player.isInDialogue = true;
                    displayDialogue(
                    dialogueData[boundary.name],
                    () => (player.isInDialogue = false)
                    );
                });
                }
            }
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
            }   
        }
    }


});

    

k.go("main");