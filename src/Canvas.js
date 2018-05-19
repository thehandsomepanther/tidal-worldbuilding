import React, { Component } from "react";
import Mountain from "./features/Mountain";
import Forest from "./features/Forest";

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
  }

  render() {
    const { topcodes } = this.props;
    if (this.canvasRef && topcodes) {
      this.context = this.canvasRef.getContext("2d");
      this.context.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);
      topcodes.forEach(topcode => {
        const mountain = new Forest(topcode.x, topcode.y, this.context);
        mountain.effect();
      });
    }

    return this.canvas;
  }
}
