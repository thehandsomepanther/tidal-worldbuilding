import Feature from "../Feature";
import waterSprite from "./assets/water.jpg";

export default class Water extends Feature {
  constructor() {
    super();
    this.sprite = new Image(1280, 720);
    this.sprite.src = waterSprite;
    this.width = 960 / 100;
    this.height = 960 / 100;
    this.effectRadius = 75;
  }
}
