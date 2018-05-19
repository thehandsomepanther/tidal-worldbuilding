/* global TopCodes */
import React, { Component } from "react";
import Canvas from "./Canvas";

const VIDEO_CANVAS_ID = "video-canvas";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topcodes: null
    };
  }

  componentDidMount() {
    TopCodes.setVideoFrameCallback(VIDEO_CANVAS_ID, this.parseTopcodes);
  }

  parseTopcodes = jsonString => {
    const json = JSON.parse(jsonString);
    this.context = document.querySelector("#video-canvas").getContext("2d");
    this.setState({
      topcodes: json.topcodes
    });
  };

  render() {
    const { topcodes } = this.state;

    return (
      <div className="App">
        <canvas
          id={VIDEO_CANVAS_ID}
          width={700}
          height={600}
          style={{ background: "#ddd" }}
        />
        <Canvas topcodes={topcodes} />
        <div>
          <button
            id="camera-button"
            onClick={() => {
              TopCodes.startStopVideoScan(VIDEO_CANVAS_ID);
            }}
          >
            Start / Stop
          </button>
        </div>
      </div>
    );
  }
}

export default App;
