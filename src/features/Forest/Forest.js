import Feature from "../Feature";
import treeSprite from "./assets/tree.gif";

export default class Forest extends Feature {
  constructor() {
    super();
    this.sprite = new Image(117, 123);
    this.sprite.src = treeSprite;
    this.effectRadius = 50;
  }

  draw(x, y, context) {
    context.drawImage(this.sprite, x, y, 117, 123);
  }
}
