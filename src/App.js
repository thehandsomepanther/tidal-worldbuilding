/* global TopCodes */
import React, { Component } from "react";

const VIDEO_CANVAS_ID = "video-canvas";

class App extends Component {
  render() {
    return (
      <div className="App">
        <canvas
          id={VIDEO_CANVAS_ID}
          width={800}
          height={600}
          style={{ background: "#ddd;" }}
        />
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
