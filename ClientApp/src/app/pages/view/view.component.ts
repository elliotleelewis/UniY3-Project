import {
	Component,
	ElementRef,
	OnDestroy,
	OnInit,
	ViewChild,
} from '@angular/core';
import clm from 'clmtrackr';
import pModel from 'clmtrackr/models/model_pca_20_svm.js';

@Component({
	selector: 'app-viewer',
	templateUrl: './view.component.html',
	styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit, OnDestroy {
	@ViewChild('video')
	videoRef: ElementRef<HTMLVideoElement>;
	@ViewChild('canvas')
	canvasRef: ElementRef<HTMLCanvasElement>;
	canvasContext: CanvasRenderingContext2D;
	tracker: clm.tracker;
	enabled = false;
	deformation: number[];
	presets: Array<{ name: string; value: number[] }> = [
		{
			name: 'Default',
			value: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		},
		{
			name: '"Oi Mate!"',
			value: [
				0,
				0,
				13,
				1.2,
				0,
				-15,
				0,
				1,
				8,
				-5,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				11.6,
				0,
				-7,
			],
		},
		{
			name: 'Unhappy',
			value: [
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				-13,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
			],
		},
		{
			name: 'Greek',
			value: [
				0,
				0,
				0,
				1.6,
				0,
				-6,
				0,
				0,
				0,
				-13,
				0,
				4.7,
				1,
				0,
				11,
				-1,
				8,
				8,
				0,
				0,
			],
		},
		{
			name: 'Cheery',
			value: [
				0,
				0,
				0,
				0,
				10.7,
				0,
				16.8,
				0,
				0,
				-5,
				0,
				-4,
				13,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
			],
		},
		{
			name: 'Luke',
			value: [
				0,
				0,
				-1.7,
				-8.7,
				-8,
				-4.8,
				12.5,
				-1,
				14.6,
				-11,
				0,
				-2,
				-13,
				0,
				0,
				0,
				0,
				7,
				0,
				-3,
			],
		},
		{
			name: 'Chum',
			value: [
				0,
				0,
				13,
				1.2,
				0,
				2.5,
				0,
				1,
				16.8,
				-5,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				11.6,
				0,
				-7,
			],
		},
		{
			name: 'Disgust',
			value: [
				-4,
				-14,
				8,
				2,
				3,
				-5.6,
				-2,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				-10,
				0,
				-5,
			],
		},
	];

	ngOnInit(): void {
		// this.enabled = true;
		this.deformation = this.presets[0].value;
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then((stream: MediaStream) => {
				this.videoRef.nativeElement.srcObject = stream;
				const setCanvasSize = () => {
					const { width, height } = this.videoRef.nativeElement;
					this.canvasRef.nativeElement.width = width;
					this.canvasRef.nativeElement.height = height;
				};
				this.videoRef.nativeElement.onresize = setCanvasSize;
				setCanvasSize();
				this.canvasContext = this.canvasRef.nativeElement.getContext(
					'2d',
				);
				this.tracker = new clm.tracker();
				this.tracker.init(pModel);
				this.tracker.start(this.videoRef.nativeElement);
				// fd.load(this.videoRef.nativeElement, this.tracker.getCurrentPosition(), pModel);
				// fd.draw(this.tracker.getCurrentPosition());
				this.render();
			})
			.catch(console.error);
	}

	ngOnDestroy(): void {
		this.enabled = false;
		const stream = this.videoRef.nativeElement.srcObject as MediaStream;
		if (stream) {
			stream.getVideoTracks().forEach((track) => track.stop());
		}
	}

	render(): void {
		if (this.enabled) {
			requestAnimationFrame(() => {
				this.canvasContext.clearRect(
					0,
					0,
					this.canvasRef.nativeElement.width,
					this.canvasRef.nativeElement.height,
				);
				this.track();
				this.render();
			});
		} else {
			requestAnimationFrame(() => {
				this.canvasContext.clearRect(
					0,
					0,
					this.canvasRef.nativeElement.width,
					this.canvasRef.nativeElement.height,
				);
			});
		}
	}

	track(): void {
		if (this.tracker.getCurrentPosition()) {
			this.tracker.draw(this.canvasRef.nativeElement);
		}
		// console.log(this.tracker.getCurrentPosition());
	}

	toggleEnabled(): void {
		this.enabled = !this.enabled;
		this.render();
	}
}
