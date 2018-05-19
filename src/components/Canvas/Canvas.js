import React, { Component } from "react";
import Mountain from "../../features/Mountain";
import Forest from "../../features/Forest";
import { topcodeFeatures } from "../../config/topcodes";
import mapSprite from "./assets/map.jpg";

const CANVAS_ID = "map-canvas";

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.context = null;
    this.canvas = (
      <canvas
        id={CANVAS_ID}
        width={700}
        height={600}
        ref={c => (this.canvasRef = c)}
      />
    );
    this.mapSprite = new Image(317, 309);
    this.mapSprite.src = mapSprite;
  }

  render() {
    const { topcodes } = this.props;
    if (this.canvasRef && topcodes) {
      const { width, height } = this.canvasRef;

      this.context = this.canvasRef.getContext("2d");
      this.context.clearRect(0, 0, width, height);
      this.context.drawImage(this.mapSprite, 0, 0, width, height);

      topcodes.forEach(topcode => {
        let feature = null;
        switch (topcodeFeatures[topcode.code]) {
          case "Mountain":
            feature = new Mountain(topcode.x, topcode.y, this.context);
            break;
          case "Forest":
            feature = new Forest(topcode.x, topcode.y, this.context);
            break;
          default:
        }

        if (feature) {
          feature.effect();
        }
      });
    }

    return this.canvas;
  }
}
