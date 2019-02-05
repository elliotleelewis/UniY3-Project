import {
	Component,
	ElementRef,
	Input,
	OnDestroy,
	OnInit,
	ViewChild,
} from '@angular/core';
import clm from 'clmtrackr';
import pModel from 'clmtrackr/models/model_pca_20_mosse';

import { Deformation } from '../../models/deformation';
import { DeformerService } from '../../services/deformer.service';

@Component({
	selector: 'app-deformer',
	templateUrl: './deformer.component.html',
	styleUrls: ['./deformer.component.scss'],
})
export class DeformerComponent implements OnInit, OnDestroy {
	@Input()
	deformation: Deformation;
	canvas: HTMLCanvasElement;
	@ViewChild('video')
	videoRef: ElementRef<HTMLVideoElement>;
	@ViewChild('overlay')
	overlayRef: ElementRef<HTMLCanvasElement>;
	@ViewChild('webGl')
	webGlRef: ElementRef<HTMLCanvasElement>;
	canvasContext: CanvasRenderingContext2D;
	overlayContext: CanvasRenderingContext2D;
	webGlContext: WebGLRenderingContext;
	tracker: clm.tracker;
	enabled = false;
	mouthVertices = [
		[44, 45, 61, 44],
		[45, 46, 61, 45],
		[46, 60, 61, 46],
		[46, 47, 60, 46],
		[47, 48, 60, 47],
		[48, 59, 60, 48],
		[48, 49, 59, 48],
		[49, 50, 59, 49],
		[50, 51, 58, 50],
		[51, 52, 58, 51],
		[52, 57, 58, 52],
		[52, 53, 57, 52],
		[53, 54, 57, 53],
		[54, 56, 57, 54],
		[54, 55, 56, 54],
		[55, 44, 56, 55],
		[44, 61, 56, 44],
		[61, 60, 56, 61],
		[56, 57, 60, 56],
		[57, 59, 60, 57],
		[57, 58, 59, 57],
		[50, 58, 59, 50],
	];
	extendVertices = [
		[0, 71, 72, 0],
		[0, 72, 1, 0],
		[1, 72, 73, 1],
		[1, 73, 2, 1],
		[2, 73, 74, 2],
		[2, 74, 3, 2],
		[3, 74, 75, 3],
		[3, 75, 4, 3],
		[4, 75, 76, 4],
		[4, 76, 5, 4],
		[5, 76, 77, 5],
		[5, 77, 6, 5],
		[6, 77, 78, 6],
		[6, 78, 7, 6],
		[7, 78, 79, 7],
		[7, 79, 8, 7],
		[8, 79, 80, 8],
		[8, 80, 9, 8],
		[9, 80, 81, 9],
		[9, 81, 10, 9],
		[10, 81, 82, 10],
		[10, 82, 11, 10],
		[11, 82, 83, 11],
		[11, 83, 12, 11],
		[12, 83, 84, 12],
		[12, 84, 13, 12],
		[13, 84, 85, 13],
		[13, 85, 14, 13],
		[14, 85, 86, 14],
		[14, 86, 15, 14],
		[15, 86, 87, 15],
		[15, 87, 16, 15],
		[16, 87, 88, 16],
		[16, 88, 17, 16],
		[17, 88, 89, 17],
		[17, 89, 18, 17],
		[18, 89, 93, 18],
		[18, 93, 22, 18],
		[22, 93, 21, 22],
		[93, 92, 21, 93],
		[21, 92, 20, 21],
		[92, 91, 20, 92],
		[20, 91, 19, 20],
		[91, 90, 19, 91],
		[19, 90, 71, 19],
		[19, 71, 0, 19],
	];

	constructor(private deformer: DeformerService) {}

	static create3DContext(canvas: HTMLCanvasElement): WebGLRenderingContext {
		const names = ['webgl', 'experimental-webgl'];
		let context = null;
		for (const name of names) {
			try {
				context = canvas.getContext(name);
			} catch (e) {}
			if (context) {
				break;
			}
		}
		return context;
	}

	ngOnInit(): void {
		this.enabled = true;
		this.canvas = document.createElement('canvas');
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then((stream: MediaStream) => {
				this.videoRef.nativeElement.srcObject = stream;
				const setCanvasSize = () => {
					const { width, height } = this.videoRef.nativeElement;
					this.canvas.width = width;
					this.canvas.height = height;
					this.overlayRef.nativeElement.width = width;
					this.overlayRef.nativeElement.height = height;
					this.webGlRef.nativeElement.width = width;
					this.webGlRef.nativeElement.height = height;
				};
				this.videoRef.nativeElement.onresize = setCanvasSize;
				setCanvasSize();
				this.canvasContext = this.canvas.getContext('2d');
				this.overlayContext = this.overlayRef.nativeElement.getContext(
					'2d',
				);
				this.webGlContext = DeformerComponent.create3DContext(
					this.webGlRef.nativeElement,
				);
				this.tracker = new clm.tracker();
				this.tracker.init(pModel);
				this.tracker.start(this.videoRef.nativeElement);
				this.deformer.init(this.webGlContext);
				this.render();
			})
			.catch(console.error);
	}

	ngOnDestroy(): void {
		this.enabled = false;
		this.clear();
		this.tracker.reset();
		this.canvas = null;
		const stream = this.videoRef.nativeElement.srcObject as MediaStream;
		if (stream) {
			stream.getVideoTracks().forEach((track) => track.stop());
		}
	}

	render(): void {
		if (this.enabled && this.tracker.getConvergence() < 2) {
			this.deform();
		} else {
			requestAnimationFrame(() => {
				this.clear();
				if (this.enabled) {
					if (this.tracker.getCurrentPosition()) {
						this.tracker.draw(this.overlayRef.nativeElement);
					}
					this.render();
				}
			});
		}
	}

	deform(): void {
		this.canvasContext.drawImage(
			this.videoRef.nativeElement,
			0,
			0,
			this.canvas.width,
			this.canvas.height,
		);
		const pos = this.tracker.getCurrentPosition() as [number, number][];
		if (pos) {
			let tempPos;
			const addPos = [];
			for (let i = 0; i < 23; i++) {
				tempPos = [];
				tempPos[0] = (pos[i][0] - pos[62][0]) * 1.3 + pos[62][0];
				tempPos[1] = (pos[i][1] - pos[62][1]) * 1.3 + pos[62][1];
				addPos.push(tempPos);
			}
			let newPos = pos.concat(addPos);
			let newVertices = pModel.path.vertices.concat(this.mouthVertices);
			newVertices = newVertices.concat(this.extendVertices);

			this.deformer.load(this.canvas, newPos, pModel, newVertices);

			const parameters = this.tracker.getCurrentParameters();
			for (let i = 6; i < parameters.length; i++) {
				parameters[i] += this.deformation.data[i - 6];
			}
			// @ts-ignore
			const positions = this.tracker.calculatePositions(parameters);

			this.overlayContext.clearRect(
				0,
				0,
				this.overlayRef.nativeElement.width,
				this.overlayRef.nativeElement.height,
			);

			if (positions) {
				newPos = positions.concat(addPos);
				this.deformer.draw(newPos);
			}
		}
		requestAnimationFrame(() => {
			if (this.enabled) {
				this.deform();
			}
		});
	}

	clear() {
		// TODO - see if you can remove some of these...
		this.canvasContext.drawImage(
			this.videoRef.nativeElement,
			0,
			0,
			this.canvas.width,
			this.canvas.height,
		);
		this.overlayContext.clearRect(
			0,
			0,
			this.canvas.width,
			this.canvas.height,
		);
		this.deformer.clear();
	}
}
