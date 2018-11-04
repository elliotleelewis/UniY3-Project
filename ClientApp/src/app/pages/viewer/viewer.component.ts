import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import clm from 'clmtrackr';

@Component({
	selector: 'app-viewer',
	templateUrl: './viewer.component.html',
	styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit, OnDestroy {
	@ViewChild('video')
	videoRef: ElementRef<HTMLVideoElement>;
	@ViewChild('canvas')
	canvasRef: ElementRef<HTMLCanvasElement>;
	canvasContext: CanvasRenderingContext2D;
	tracker: clm.tracker;
	enabled = false;

	ngOnInit() {
		// this.enabled = true;
		navigator.mediaDevices.getUserMedia({ video: true })
			.then((stream: MediaStream) => {
				this.videoRef.nativeElement.srcObject = stream;
				const setCanvasSize = () => {
					const { width, height } = this.videoRef.nativeElement;
					this.canvasRef.nativeElement.width = width;
					this.canvasRef.nativeElement.height = height;
				};
				this.videoRef.nativeElement.onresize = setCanvasSize;
				setCanvasSize();
				this.canvasContext = this.canvasRef.nativeElement.getContext('2d');
				this.tracker = new clm.tracker();
				this.tracker.init();
				this.tracker.start(this.videoRef.nativeElement);
				this.render();
			})
			.catch(console.error);
	}

	ngOnDestroy() {
		this.enabled = false;
		(this.videoRef.nativeElement.srcObject as MediaStream).getVideoTracks().forEach((track) => track.stop());
	}

	render() {
		if (this.enabled) {
			requestAnimationFrame(() => {
				this.canvasContext.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
				this.track();
				this.render();
			});
		}
		else {
			requestAnimationFrame(() => {
				this.canvasContext.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
			});
		}
	}

	track() {
		if (this.tracker.getCurrentPosition()) {
			this.tracker.draw(this.canvasRef.nativeElement);
		}
		// console.log(this.tracker.getCurrentPosition());
		console.log('test');
	}

	toggleEnabled() {
		this.enabled = !this.enabled;
		this.render();
	}
}
