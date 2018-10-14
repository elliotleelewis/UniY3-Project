import clm from 'clmtrackr';
import * as React from 'react';
import { connect } from 'react-redux';

import { IState } from '../../reducers/models';

class Viewer extends React.Component {
	static modifyFrame(frame: ImageData) {
		const modified = frame;
		// for (let i = 0; i < frame.data.length / 4; i++) {
		// 	const pixelDataPoint = i * 4;
		// 	const r = frame.data[pixelDataPoint];
		// 	const g = frame.data[pixelDataPoint + 1];
		// 	const b = frame.data[pixelDataPoint + 2];
		// 	const a = frame.data[pixelDataPoint + 3];
		// }
		return modified;
	}

	canvas: React.RefObject<HTMLCanvasElement> = React.createRef();
	video: React.RefObject<HTMLVideoElement> = React.createRef();
	canvasContext: CanvasRenderingContext2D = null;
	tracker = new clm.tracker();

	componentWillMount() {
		navigator.mediaDevices.getUserMedia({ video: true })
			.then((stream: MediaStream) => {
				const video = this.video.current;
				video.srcObject = stream;
				video.onresize = () => {
					//
				};
				this.canvasContext = this.canvas.current.getContext('2d');
				this.tracker.init();
				setTimeout(() => {
					this.tracker.start(video);
					this.renderVideo();
				}, 5000);
			})
			.catch(console.error);
	}

	componentWillUnmount() {
		(this.video.current.srcObject as MediaStream).getVideoTracks().forEach((track) => track.stop());
	}

	renderVideo() {
		if (
			this.video.current
			&& (this.video.current.srcObject as MediaStream).getVideoTracks().every((track) => track.enabled)
		) {
			requestAnimationFrame(() => {
				this.renderVideo();
			});
			this.renderCanvas(this.canvas.current, this.canvasContext);
			this.trackPositions();
		}
	}

	renderCanvas(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		context.clearRect(0, 0, canvas.width, canvas.height);
		if (this.tracker.getCurrentPosition()) {
			this.tracker.draw(canvas);
		}
		else {
			console.log(this.tracker);
		}
	}

	trackPositions() {
		console.log(this.tracker.getCurrentPosition());
	}

	render() {
		return (
			<>
				<video
					ref={this.video}
					autoPlay={true}
					muted={true}
					playsInline={true}
					// style={{ width: 0, height: 0 }}
				/>
				<canvas ref={this.canvas} />
			</>
		);
	}
}

export default connect((state: IState) => ({
	camera: state.camera,
}))(Viewer);
