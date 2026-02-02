import { Movement, Transform } from "../../engine/components";
import { Entity, Scene } from "../../engine/core";
import { UpdateSystem, Vec2 } from "../../engine/types";
import Boid from "../components/Boid.component";
import { MovementSystem } from "../../engine/systems";
import BoidContainer from "../components/BoidContainer.components";

export default class BoidSystem extends UpdateSystem {
    public runsBefore = [MovementSystem];
    private visualRange = 5;

    public update(scene: Scene, dt: number): void {
        const boids = scene.findEntitiesWith(Boid, Transform);


        boids.forEach((boid, i) => {

            const boidContainer = scene.findEntitiesWith(BoidContainer).find((container) => container.get(BoidContainer).id === boid.get(Boid).containerId);

            if (!boidContainer) return;

            // this.flyTowardsCenter(boid, boids,)
            this.avoidOthers(boid, boids);
            this.matchVelocity(boid, boids);
            this.limitSpeed(boid);
            this.keepWithinBounds(boid, boidContainer.get(BoidContainer));

        });

    }

    private matchVelocity(entity: Entity, boids: Entity[]) {
        const matchingFactor = 0.02; // Adjust by this % of average velocity

        const position = entity.get(Transform).position;
        const velocity = entity.get(Movement).velocity;
        const boid = entity.get(Boid);

        let avgDX = 0;
        let avgDY = 0;
        let numNeighbors = 0;

        for (let otherBoid of boids) {

            const otherPosision = otherBoid.get(Transform).position;
            const otherVelocity = otherBoid.get(Movement).velocity;

            if (position.distance(otherPosision) < boid.visualRange) {
                avgDX += otherVelocity.x;
                avgDY += otherVelocity.y;
                numNeighbors += 1;
            }
        }

        if (numNeighbors) {
            avgDX = avgDX / numNeighbors;
            avgDY = avgDY / numNeighbors;

            velocity.x += (avgDX - velocity.x) * matchingFactor;
            velocity.y += (avgDY - velocity.y) * matchingFactor;
        }
    }

    // Find the center of mass of the other boids and adjust velocity slightly to
    // point towards the center of mass.
    flyTowardsCenter(entity: Entity, entities: Entity[]) {
        const centeringFactor = 0.005; // adjust velocity by this %

        const position = entity.get(Transform).position;
        const velocity = entity.get(Movement).velocity;

        let center = new Vec2(0, 0);
        let numNeighbors = 0;

        for (let otherBoid of entities) {

            const otherPosision = otherBoid.get(Transform).position;

            if (position.distance(otherPosision) < this.visualRange) {
                center.add(otherPosision);
                numNeighbors += 1;
            }
        }

        if (numNeighbors) {
            center.divScalar(numNeighbors);

            velocity.x += (center.x - position.x) * centeringFactor;
            velocity.y += (center.y - position.y) * centeringFactor;
        }
    }

    // Move away from other boids that are too close to avoid colliding
    avoidOthers(entity: Entity, entities: Entity[]) {
        const minDistance = 30; // The distance to stay away from other boids
        const avoidFactor = 0.05; // Adjust velocity by this %

        const position = entity.get(Transform).position;
        const velocity = entity.get(Movement).velocity;

        let moveX = 0;
        let moveY = 0;
        for (let otherBoid of entities) {
            if (otherBoid !== entity) {

                const otherPosision = otherBoid.get(Transform).position;

                if (position.distance(otherPosision) < minDistance) {
                    moveX += position.x - otherPosision.x;
                    moveY += position.y - otherPosision.y;
                }
            }
        }

        velocity.x += moveX * avoidFactor;
        velocity.y += moveY * avoidFactor;
    }


    // Speed will naturally vary in flocking behavior, but real animals can't go
    // arbitrarily fast.
    limitSpeed(entity: Entity) {
        const velocity = entity.get(Movement).velocity;
        const boid = entity.get(Boid);

        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        if (speed > boid.maxSpeed) {
            velocity.divScalar(speed).mulScalar(boid.maxSpeed);
        } 
        if (speed < boid.minSpeed) {
            velocity.divScalar(speed).mulScalar(boid.minSpeed);
        }
    }

    keepWithinBounds(entity: Entity, boidContainer: BoidContainer) {
        const turnFactor = 1;
        const position = entity.get(Transform).position;
        const velocity = entity.get(Movement).velocity;



        if (position.x < boidContainer.box.x + boidContainer.margin) {
            velocity.x += turnFactor;
        }
        if (position.x > boidContainer.box.x + boidContainer.box.w - boidContainer.margin) {
            velocity.x -= turnFactor
        }
        if (position.y < boidContainer.box.y + boidContainer.margin) {
            velocity.y += turnFactor;
        }
        if (position.y > boidContainer.box.y + boidContainer.box.h - boidContainer.margin) {
            velocity.y -= turnFactor;
        }
    }
}