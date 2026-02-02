import { Entity, Scene } from "../../engine/core";
import { Collider, Interactable, InteractionState, Player, Sprite, Transform } from "../../engine/components";
import { UpdateSystem, Vec2 } from "../../engine/types";
import { randomBetween } from "../../engine/utils/number.utils";
import { InteractionDetectionSystem } from "../../engine/systems";
import Cardboard from "../components/Cardboard.component";

export default class InteractionInputSystem extends UpdateSystem {
    public runsAfter = [InteractionDetectionSystem];

    treatImage: HTMLImageElement;

    constructor(treatImage: HTMLImageElement) {
        super();
        this.treatImage = treatImage;
    }


    public update(scene: Scene) {
        if (!scene.input.justPressed('KeyE')) return;

        const player = scene.findEntityWith(Player, InteractionState);
        if (!player) return;

        const target = player.get(InteractionState)?.target;

        if (target?.has(Interactable, Cardboard)) {
            // Fire interaction event
            this.interact(scene, target);
        }
    }

    private interact(scene: Scene, target: Entity) {
        const treat = this.extractTreat(target);
        if (treat) {
            scene.addEntities(treat);
        }
        if (!target.get(Cardboard).nbTreat) {
            target.delete(Interactable);
        }
    }

    private extractTreat(target: Entity) {
        if (!target.get(Cardboard).nbTreat) return null;
        target.get(Cardboard).nbTreat--;
        const treat = new Entity();
        const treatTransform = new Transform();
        const treatSprite = new Sprite(this.treatImage);

        const x = randomBetween(1000, 1200);
        const y = randomBetween(220, 260);
        treatTransform.position = new Vec2(x, y);
        treatTransform.elevation = 2;
        treatTransform.scale = 2;
        treatSprite.frame = { x: 0, y: 0, w: 10, h: 10 };

        const collider = new Collider();
        collider.size = { w: 10, h: 10 };
        treat.add(treatTransform).add(treatSprite).add(collider).add(new Interactable(5));
        return treat;
    }
}