import React from 'react';
import Webcam from 'react-webcam';

const canvasToBlobAsync = (canvas: HTMLCanvasElement) => // promisify canvas.toBlob()
  new Promise<Blob>((resolve) => canvas.toBlob(resolve));

export default class App extends React.Component {

  public state = {
    error: '',

    // for videoConstraints, see https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API/Constraints
    videoConstraints: {
      aspectRatio: 841.89 / 595.28,
      facingMode: { exact: 'environment'},
    }
  }

  private webcamRef = React.createRef<Webcam & HTMLVideoElement>();

  // Handle click on the snapshot button
  private handleSnapshot = async () => {
    try {
      const canvas = this.webcamRef.current.getCanvas();
      if (! canvas) return; // Just return here, errors are handled by handleUserMediaError

      this.setState({ error: 'Sending' });

      // Prepare multipart-formdata body
      const blob = await canvasToBlobAsync(canvas);
      const body = new FormData();
      body.append('image', blob);

      // Requesting
      const response = await fetch('/upload', { method: 'POST', body });
      if (!response.ok) throw new Error('Wrong status code.');

      this.setState({ error: 'Success' });
    } catch (e) {
      console.error(e);
      this.setState({ error: e.message || e.toString() });
    }
  }

  // Handle errors thrown by react-webcam component
  private handleUserMediaError = (e: any) => {

    // When environment facingMode isn't available, mainly on desktop
    if (e.name == 'OverconstrainedError' && e.constraint == 'facingMode' && this.state.videoConstraints.facingMode) {
      console.log('Falling back to empty facing mode');
      this.setState({
        videoConstraints: {
          aspectRatio: 595.28 / 841.89, // reverse aspectRatio for desktops
          // omitting facingMode here
        },
      });
    } else {
      console.error(e);
      this.setState({ error: e.message || e.toString() });
    }
  }

  render() {
    const { videoConstraints, error } = this.state;
    return (
      <React.Fragment>
        <div style={{ margin: '-10px' }}>
          <Webcam videoConstraints={videoConstraints} style={{ filter: 'blur(10px) grayscale(0.5)', objectFit: 'cover' }} onUserMediaError={this.handleUserMediaError}/>
        </div>
        <div>
          <Webcam videoConstraints={videoConstraints} ref={this.webcamRef}/>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column-reverse', alignItems: 'center' }}>
          <button className="snapshot-btn" onClick={this.handleSnapshot}></button>
          <pre>{error}</pre>
        </div>
      </React.Fragment>
    );
  }
}