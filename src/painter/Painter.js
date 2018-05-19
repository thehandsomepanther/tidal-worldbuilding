import Mountain from "../features/Mountain";
import Forest from "../features/Forest";
import { topcodeFeatures } from "../config/topcodes";

const distance = (x1, y1, x2, y2) =>
  Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

const hash = (a, b) => [a, b].sort().join("");

const FEATURE_PRIORITIES = {
  forest: 1,
  mountain: 2
};

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
            this.mountain.drawCluster(feature.x, feature.y, context);
            break;
          case "forest":
            this.forest.drawCluster(feature.x, feature.y, context);
            break;
          default:
        }
      } else {
        feature.neighbors.forEach(neighbor => {
          if (!visitedPairs[hash(feature.code, neighbor.code)]) {
            switch (hash(feature.type, neighbor.type)) {
              case hash("mountain", "mountain"):
                this.mountain.drawCluster(feature.x, feature.y, context);
                break;
              case hash("forest", "forest"):
                // this code is a very bad approximation of a long rectangle
                // TODO: redo this interaction code.
                const a =
                  distance(feature.x, feature.y, neighbor.x, neighbor.y) + 50;
                const b = 2 * a / 3;

                for (let i = 0; i < 40; i++) {
                  context.drawImage(
                    this.forest.sprite,
                    (feature.x + neighbor.x) / 2 + Math.random() * a * 2 - a,
                    (feature.y + neighbor.y) / 2 + Math.random() * b * 2 - b,
                    this.forest.width,
                    this.forest.height
                  );
                }
                break;
              case hash("mountain", "forest"):
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
