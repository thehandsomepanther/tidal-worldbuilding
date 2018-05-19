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

  drawCluster(x, y, context, n = 20) {
    for (let i = 0; i < n; i++) {
      context.drawImage(
        this.sprite,
        x + Math.random() * this.effectRadius * 2 - this.effectRadius,
        y + Math.random() * this.effectRadius * 2 - this.effectRadius,
        this.width,
        this.height
      );
    }
  }
}
