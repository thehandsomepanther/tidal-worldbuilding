import Feature from "../Feature";
import mountainSprite from "./assets/mountain.png";

export default class Mountain extends Feature {
  constructor() {
    super();
    this.sprite = new Image(272, 163);
    this.sprite.src = mountainSprite;
  }

  draw(x, y, context) {
    context.drawImage(this.sprite, x, y, 272, 163);
  }

  interaction() {}
}
