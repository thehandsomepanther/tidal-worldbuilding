import Mountain from "../features/Mountain";
import Forest from "../features/Forest";
import { topcodeFeatures } from "../config/topcodes";

export default class Painter {
  constructor() {
    this.mountain = new Mountain();
    this.forest = new Forest();
  }

  paint(context, topcodes) {
    topcodes.forEach(topcode => {
      switch (topcodeFeatures[topcode.code]) {
        case "Mountain":
          this.mountain.draw(topcode.x, topcode.y, context);
          break;
        case "Forest":
          this.forest.draw(topcode.x, topcode.y, context);
          break;
        default:
      }
    });
  }
}
