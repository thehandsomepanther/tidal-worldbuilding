import Feature from "../Feature";
import mountainSprite from "./assets/mountain.png";

export default class Mountain extends Feature {
  constructor() {
    super();
    this.width = 272 / 3;
    this.height = 163 / 3;
    this.sprite = new Image(this.width, this.height);
    this.sprite.src = mountainSprite;
    this.effectRadius = 70;
  }
}
