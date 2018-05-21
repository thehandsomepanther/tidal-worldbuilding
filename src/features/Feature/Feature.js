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
      const angle = Math.random() * 2 * Math.PI;
      const dist = Math.random() * this.effectRadius;

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
