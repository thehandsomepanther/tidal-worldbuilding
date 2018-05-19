import Feature from "../Feature";
import treeSprite from "./assets/tree.gif";

export default class Forest extends Feature {
  constructor(x, y, context) {
    super(x, y, context);
    this.sprite = new Image(117, 123);
    this.sprite.src = treeSprite;
  }

  effect() {
    this.context.drawImage(this.sprite, this.x, this.y, 117, 123);
  }

  interaction() {}
}
