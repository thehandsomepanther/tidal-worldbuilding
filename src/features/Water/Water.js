import Feature from "../Feature";
import waterSprite from "./assets/water.jpg";

export default class Water extends Feature {
  constructor() {
    super();
    this.sprite = new Image(1280, 720);
    this.sprite.src = waterSprite;
  }

  draw(x, y, context) {
    context.drawImage(this.sprite, x, y, 1280, 720);
  }

  interaction() {}
}
