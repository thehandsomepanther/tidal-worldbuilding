import { seededRand } from "../../util";

const DENSITY = 30;

export default class Feature {
  constructor() {
    if (new.target === Feature) {
      throw new TypeError(
        'Abstract class "Feature" cannot be instantiated directly.'
      );
    }
  }

  draw(x, y, context) {
    context.drawImage(this.sprite, x, y, this.width, this.height);
  }

  drawCluster(x, y, context, code = 100, test = () => true) {
    let i = 0;
    let successCount = 0;
    while (successCount < DENSITY) {
      const angle = seededRand(`${i}${code}`) * 2 * Math.PI;
      const dist = seededRand(`${DENSITY - i}${code}`) * this.effectRadius;

      const xPos = x + Math.cos(angle) * dist;
      const yPos = y + Math.sin(angle) * dist;
      if (test(xPos, yPos)) {
        // console.log("Rendering a good one!");
        context.drawImage(this.sprite, xPos, yPos, this.width, this.height);
        successCount++;
        // console.log(successCount);
      }

      i++;
    }
  }
}
