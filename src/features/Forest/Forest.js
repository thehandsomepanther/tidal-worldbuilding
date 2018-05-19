import Feature from "../Feature";
import treeSprite from "./assets/tree.gif";

export default class Forest extends Feature {
  constructor() {
    super();
    this.width = 117 / 4;
    this.height = 123 / 4;
    this.sprite = new Image(this.width, this.height);
    this.sprite.src = treeSprite;
    this.effectRadius = 30;
  }
}
