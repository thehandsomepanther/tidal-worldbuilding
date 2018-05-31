import React, { Component } from "react";
import mapSprite from "./assets/map.png";
import Painter from "../../painter";

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
    this.painter = new Painter();
  }

  render() {
    const { topcodes } = this.props;
    if (this.canvasRef && topcodes) {
      const { width, height } = this.canvasRef;

      const context = this.canvasRef.getContext("2d");
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#b0e68b";
      context.fillRect(0, 0, width, height);
      this.painter.paint(context, topcodes);
      context.drawImage(this.mapSprite, 0, 0, width, height);
    }

    return this.canvas;
  }
}
