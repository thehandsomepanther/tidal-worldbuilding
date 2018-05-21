import { seededRand } from "../../util";

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

  drawCluster(x, y, context, code = 100, n = 30) {
    for (let i = 0; i < n; i++) {
      const angle = seededRand(`${i}${code}`) * 2 * Math.PI;
      const dist = seededRand(`${i}${code}`) * this.effectRadius;

      context.drawImage(
        this.sprite,
        x + Math.cos(angle) * dist,
        y + Math.sin(angle) * dist,
        this.width,
        this.height
      );
    }
  }
}
