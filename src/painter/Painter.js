import Mountain from "../features/Mountain";
import Forest from "../features/Forest";
import { topcodeFeatures } from "../config/topcodes";
import { seededRand } from "../util";

const distance = (x1, y1, x2, y2) =>
  Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

const hash = (a, b) => [a, b].sort().join("");

const FEATURE_PRIORITIES = {
  forest: 1,
  mountain: 2
};

const MOUNTAIN_SPACING = 30;
const MOUNTAIN_VARIATION = 5;

export default class Painter {
  constructor() {
    this.mountain = new Mountain();
    this.forest = new Forest();
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

  paint(context, topcodes) {
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
          default:
        }
      } else {
        feature.neighbors.forEach(neighbor => {
          if (!visitedPairs[hash(feature.code, neighbor.code)]) {
            switch (hash(feature.type, neighbor.type)) {
              case hash("mountain", "mountain"):
                const dist = distance(
                  feature.x,
                  feature.y,
                  neighbor.x,
                  neighbor.y
                );
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
                let forestFeature =
                  feature.type === "forest" ? feature : neighbor;
                let mountainFeature =
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
              default:
            }

            visitedPairs[hash(feature.code, neighbor.code)] = true;
          }
        });
      }
    });
  }
}
