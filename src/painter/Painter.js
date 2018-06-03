import Mountain from "../features/Mountain";
import Forest from "../features/Forest";
import Water from "../features/Water";
import { topcodeFeatures } from "../config/topcodes";
import { seededRand } from "../util";

const distance = (x1, y1, x2, y2) =>
  Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

const hash = (a, b) => [a, b].sort().join("");

const FEATURE_PRIORITIES = {
  forest: 1,
  water: 2,
  mountain: 3
};

const MOUNTAIN_SPACING = 30;
const MOUNTAIN_VARIATION = 5;

const WATER_SPACING = 1;

let interactions = {};

export default class Painter {
  constructor() {
    this.mountain = new Mountain();
    this.forest = new Forest();
    this.water = new Water();
  }

  createGraph(features) {
    features.sort((a, b) => a.x - b.x);
    for (let i = 0; i < features.length - 1; i++) {
      let currentFeature = features[i];
      for (let j = i + 1; j < features.length; j++) {
        let nextFeature = features[j];
        if (
          distance(
            currentFeature.x,
            currentFeature.y,
            nextFeature.x,
            nextFeature.y
          ) <=
          currentFeature.effectRadius + nextFeature.effectRadius
        ) {
          currentFeature.neighbors.push(nextFeature);
          nextFeature.neighbors.push(currentFeature);
        }
      }
    }

    return features;
  }

  paint(context, topcodes, onError) {
    const features = topcodes
      .map(
        topcode =>
          this[topcodeFeatures[topcode.code]]
            ? {
                type: topcodeFeatures[topcode.code],
                code: topcode.code,
                x: topcode.x,
                y: topcode.y,
                effectRadius: this[topcodeFeatures[topcode.code]].effectRadius,
                neighbors: []
              }
            : null
      )
      .filter(feature => feature !== null);

    const featuresGraph = this.createGraph(features).sort(
      (a, b) => FEATURE_PRIORITIES[a.type] - FEATURE_PRIORITIES[b.type]
    );

    const visitedPairs = {};

    featuresGraph.forEach(feature => {
      if (!feature.neighbors.length) {
        switch (feature.type) {
          case "mountain":
            this.mountain.draw(feature.x, feature.y, context);
            break;
          case "forest":
            this.forest.drawCluster(
              feature.x,
              feature.y,
              context,
              feature.code
            );
            break;
          case "water":
            this.water.draw(feature.x, feature.y, context);
            break;
          default:
        }
      } else {
        feature.neighbors.forEach(neighbor => {
          if (!visitedPairs[hash(feature.code, neighbor.code)]) {
            const dist = distance(feature.x, feature.y, neighbor.x, neighbor.y);
            switch (hash(feature.type, neighbor.type)) {
              case hash("mountain", "mountain"):
                const numMountains = dist / MOUNTAIN_SPACING + 1;
                for (let i = 0; i < numMountains; i++) {
                  this.mountain.draw(
                    feature.x +
                      (neighbor.x - feature.x) * i / numMountains +
                      seededRand(feature.code) * 2 * MOUNTAIN_VARIATION -
                      MOUNTAIN_VARIATION,
                    feature.y +
                      (neighbor.y - feature.y) * i / numMountains +
                      seededRand(neighbor.code) * 2 * MOUNTAIN_VARIATION -
                      MOUNTAIN_VARIATION,
                    context
                  );
                }

                interactions[[[feature.x, feature.y]]] =
                  interactions[[[feature.x, feature.y]]] || [];
                interactions[[[feature.x, feature.y]]].push([
                  neighbor.x,
                  neighbor.y
                ]);

                interactions[[neighbor.x, neighbor.y]] =
                  interactions[[neighbor.x, neighbor.y]] || [];
                interactions[[neighbor.x, neighbor.y]].push([
                  feature.x,
                  feature.y
                ]);

                break;
              case hash("forest", "forest"):
                this.forest.drawCluster(
                  feature.x,
                  feature.y,
                  context,
                  feature.code
                );
                this.forest.drawCluster(
                  neighbor.x,
                  neighbor.y,
                  context,
                  neighbor.code
                );
                this.forest.drawCluster(
                  (feature.x + neighbor.x) / 2,
                  (feature.y + neighbor.y) / 2,
                  context,
                  (feature.code + neighbor.code) / 2
                );
                break;
              case hash("mountain", "forest"):
                const forestFeature =
                  feature.type === "forest" ? feature : neighbor;
                const mountainFeature =
                  feature.type === "mountain" ? feature : neighbor;
                this.forest.drawCluster(
                  forestFeature.x,
                  forestFeature.y,
                  context,
                  forestFeature.code,
                  (i, j) =>
                    distance(i, j, mountainFeature.x, mountainFeature.y) >
                    this.mountain.width / 2
                );

                this.mountain.draw(
                  mountainFeature.x,
                  mountainFeature.y,
                  context
                );
                break;
              case hash("water", "water"):
                const top = feature.y < neighbor.y ? feature : neighbor;
                const bottom = feature.y < neighbor.y ? neighbor : feature;
                let theta = Math.atan((bottom.x - top.x) / (bottom.y - top.y));

                for (let i = 0; i < dist / WATER_SPACING; i++) {
                  const newDist =
                    dist * (dist / WATER_SPACING - i) / (dist / WATER_SPACING);
                  const r = seededRand(feature.code + neighbor.code + i);
                  theta += r > 0.5 ? 2 * Math.PI / 180 : -2 * Math.PI / 180;

                  this.water.draw(
                    bottom.x - Math.sin(theta) * newDist,
                    bottom.y - Math.cos(theta) * newDist,
                    context
                  );
                }

                interactions[[feature.x, feature.y]] =
                  interactions[[feature.x, feature.y]] || [];
                interactions[[feature.x, feature.y]].push([
                  neighbor.x,
                  neighbor.y
                ]);

                interactions[[neighbor.x, neighbor.y]] =
                  interactions[[neighbor.x, neighbor.y]] || [];
                interactions[[neighbor.x, neighbor.y]].push([
                  feature.x,
                  feature.y
                ]);

                break;
              default:
            }

            visitedPairs[hash(feature.code, neighbor.code)] = true;
          }
        });

        for (let i = 0; i < Object.keys(interactions).length; i++) {
          let coordKeys = JSON.parse(`[${Object.keys(interactions)[i]}]`);
          if (interactions[coordKeys].length > 1) {
            for (let j = 0; j < interactions[coordKeys].length - 1; j++) {
              const p1 = interactions[coordKeys][j];
              const theta1 = Math.atan(
                (coordKeys[0] - p1[0]) / (coordKeys[1] - p1[1])
              );
              for (let k = j + 1; k < interactions[coordKeys].length; k++) {
                const p2 = interactions[coordKeys][k];
                const theta2 = Math.atan(
                  (coordKeys[0] - p2[0]) / (coordKeys[1] - p2[1])
                );
                if (theta1 + theta2 < 90) {
                  onError(
                    "Your features are at an acute angle! Mountains and rivers should generally lie along a line."
                  );

                  context.beginPath();
                  context.strokeStyle = "#FF0000";
                  context.lineWidth = 10;
                  context.ellipse(
                    700 - coordKeys[0],
                    coordKeys[1],
                    50,
                    50,
                    0,
                    0,
                    2 * Math.PI
                  );
                  context.stroke();
                }
              }
            }
          }
        }

        interactions = {};
      }
    });
  }
}
