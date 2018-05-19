import Feature from "../Feature";
import mountainSprite from "./assets/mountain.png";

export default class Mountain extends Feature {
  constructor(x, y, context) {
    super(x, y, context);
    this.sprite = new Image(272, 163);
    this.sprite.src = mountainSprite;
  }

  effect() {
    this.context.drawImage(this.sprite, this.x, this.y, 272, 163);
  }

  interaction() {}
}
