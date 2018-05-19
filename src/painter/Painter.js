import Mountain from "../features/Mountain";
import Forest from "../features/Forest";
import { topcodeFeatures } from "../config/topcodes";

const distance = (x1, y1, x2, y2) =>
  Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

export default class Painter {
  constructor() {
    this.mountain = new Mountain();
    this.forest = new Forest();
  }

  createGraph(features) {
    features.sort((a, b) => a.x - b.x);
    for (let i = 0; i < features.length; i++) {
      let currentFeature = features[i];
      for (let j = 1; j < features.length; j++) {
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
          currentFeature.neighbors.push(nextFeature.code);
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

    this.createGraph(features);
    console.log(features);

    topcodes.forEach(topcode => {
      switch (topcodeFeatures[topcode.code]) {
        case "mountain":
          this.mountain.draw(topcode.x, topcode.y, context);
          break;
        case "forest":
          this.forest.draw(topcode.x, topcode.y, context);
          break;
        default:
      }
    });
  }
}
