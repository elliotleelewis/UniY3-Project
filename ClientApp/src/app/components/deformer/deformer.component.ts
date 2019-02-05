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

/**
 * IMPORTANT: This logic in this component is a TypeScript implementation of a
 * facial deformation script written by "audano" on GitHub. See the original
 * source of the script here:
 *
 * https://github.com/auduno/clmtrackr/blob/master/examples/js/face_deformer.js
 */
@Component({
	selector: 'app-deformer',
	templateUrl: './deformer.component.html',
	styleUrls: ['./deformer.component.scss'],
})
export class DeformerComponent implements OnInit, OnDestroy {
	@ViewChild('video')
	videoRef: ElementRef<HTMLVideoElement>;
	@ViewChild('overlay')
	overlayRef: ElementRef<HTMLCanvasElement>;
	@ViewChild('webGl')
	webGlRef: ElementRef<HTMLCanvasElement>;

	@Input()
	deformation: Deformation;

	canvas: HTMLCanvasElement;
	canvasContext: CanvasRenderingContext2D;
	overlayContext: CanvasRenderingContext2D;
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

	gl: WebGLRenderingContext;
	vertexMap: number[][];
	texCoordBuffer: WebGLBuffer;
	gridCoordBuffer: WebGLBuffer;

	drawProgram: WebGLProgram;
	gridProgram: WebGLProgram;

	static loadShader(
		gl: WebGLRenderingContext,
		shaderSource: string,
		shaderType: number,
	): WebGLShader {
		const shader = gl.createShader(shaderType);
		gl.shaderSource(shader, shaderSource);
		gl.compileShader(shader);

		const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		if (!compiled) {
			gl.deleteShader(shader);
			return null;
		}

		return shader;
	}

	static createProgram(
		gl: WebGLRenderingContext,
		shaders: WebGLShader[],
	): WebGLProgram {
		const program = gl.createProgram();
		for (let i = 0; i < shaders.length; ++i) {
			gl.attachShader(program, shaders[i]);
		}
		gl.linkProgram(program);

		const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
		if (!linked) {
			gl.deleteProgram(program);
			return null;
		}
		return program;
	}

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
					// TODO - Set this up properly...
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
				this.tracker = new clm.tracker();
				this.tracker.init(pModel);
				this.tracker.start(this.videoRef.nativeElement);
				this.gl = DeformerComponent.create3DContext(
					this.webGlRef.nativeElement,
				);
				this.gl.pixelStorei(
					this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
					// @ts-ignore
					true,
				);

				const gridVertexShader = DeformerComponent.loadShader(
					this.gl,
					`
				attribute vec2 a_position;

				uniform vec2 u_resolution;

				void main() {
					vec2 zeroToOne = a_position / u_resolution;
					vec2 zeroToTwo = zeroToOne * 2.0;
					vec2 clipSpace = zeroToTwo - 1.0;
					gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
				}
				`,
					this.gl.VERTEX_SHADER,
				);
				const gridFragmentShader = DeformerComponent.loadShader(
					this.gl,
					`
				void main() {
					gl_FragColor = vec4(0.2, 0.2, 0.2, 1.0);
				}
				`,
					this.gl.FRAGMENT_SHADER,
				);
				this.gridProgram = DeformerComponent.createProgram(this.gl, [
					gridVertexShader,
					gridFragmentShader,
				]);

				this.gridCoordBuffer = this.gl.createBuffer();

				const vertexShader = DeformerComponent.loadShader(
					this.gl,
					`
				attribute vec2 a_texCoord;
				attribute vec2 a_position;

				varying vec2 v_texCoord;

				uniform vec2 u_resolution;

				void main() {
					vec2 zeroToOne = a_position / u_resolution;
					vec2 zeroToTwo = zeroToOne * 2.0;
					vec2 clipSpace = zeroToTwo - 1.0;
					gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

					v_texCoord = a_texCoord;
				}
				`,
					this.gl.VERTEX_SHADER,
				);
				const fragmentShader = DeformerComponent.loadShader(
					this.gl,
					`
				precision mediump float;

				uniform sampler2D u_image;

				varying vec2 v_texCoord;

				void main() {
				  gl_FragColor = texture2D(u_image, v_texCoord);
				}
				`,
					this.gl.FRAGMENT_SHADER,
				);
				this.drawProgram = DeformerComponent.createProgram(this.gl, [
					vertexShader,
					fragmentShader,
				]);

				this.texCoordBuffer = this.gl.createBuffer();
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

			this.load(this.canvas, newPos, newVertices);

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
				this.draw(newPos);
			}
		}
		requestAnimationFrame(() => {
			if (this.enabled) {
				this.deform();
			}
		});
	}

	clear(): void {
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
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}

	load(
		element: HTMLCanvasElement,
		points: [number, number][],
		vertices?: number[][],
	): void {
		if (vertices) {
			this.vertexMap = vertices;
		} else {
			this.vertexMap = pModel.path.vertices;
		}

		// get cropping
		let maxx = 0;
		let minx = element.width;
		let maxy = 0;
		let miny = element.height;
		for (let i = 0; i < points.length; i++) {
			if (points[i][0] > maxx) maxx = points[i][0];
			if (points[i][0] < minx) minx = points[i][0];
			if (points[i][1] > maxy) maxy = points[i][1];
			if (points[i][1] < miny) miny = points[i][1];
		}
		minx = Math.floor(minx);
		maxx = Math.ceil(maxx);
		miny = Math.floor(miny);
		maxy = Math.ceil(maxy);
		const width = maxx - minx;
		const height = maxy - miny;

		const cc = element.getContext('2d');
		const image = cc.getImageData(minx, miny, width, height);

		// correct points
		const nupoints = [];
		for (let i = 0; i < points.length; i++) {
			nupoints[i] = [];
			nupoints[i][0] = points[i][0] - minx;
			nupoints[i][1] = points[i][1] - miny;
		}

		// create vertices based on points
		const textureVertices = [];
		for (let i = 0; i < this.vertexMap.length; i++) {
			textureVertices.push(nupoints[this.vertexMap[i][0]][0] / width);
			textureVertices.push(nupoints[this.vertexMap[i][0]][1] / height);
			textureVertices.push(nupoints[this.vertexMap[i][1]][0] / width);
			textureVertices.push(nupoints[this.vertexMap[i][1]][1] / height);
			textureVertices.push(nupoints[this.vertexMap[i][2]][0] / width);
			textureVertices.push(nupoints[this.vertexMap[i][2]][1] / height);
		}

		// load program for drawing grid
		this.gl.useProgram(this.gridProgram);

		// set the resolution for grid program
		let resolutionLocation = this.gl.getUniformLocation(
			this.gridProgram,
			'u_resolution',
		);
		this.gl.uniform2f(
			resolutionLocation,
			this.gl.drawingBufferWidth,
			this.gl.drawingBufferHeight,
		);

		// load program for drawing deformed face
		this.gl.useProgram(this.drawProgram);

		// look up where the vertex data needs to go.
		const texCoordLocation = this.gl.getAttribLocation(
			this.drawProgram,
			'a_texCoord',
		);

		// provide texture coordinates for face vertices (i.e. where we're going to copy face vertices from).
		this.gl.enableVertexAttribArray(texCoordLocation);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			new Float32Array(textureVertices),
			this.gl.STATIC_DRAW,
		);

		this.gl.vertexAttribPointer(
			texCoordLocation,
			2,
			this.gl.FLOAT,
			false,
			0,
			0,
		);

		// Create the texture.
		const texture = this.gl.createTexture();
		this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
		this.gl.texParameteri(
			this.gl.TEXTURE_2D,
			this.gl.TEXTURE_WRAP_S,
			this.gl.CLAMP_TO_EDGE,
		);
		this.gl.texParameteri(
			this.gl.TEXTURE_2D,
			this.gl.TEXTURE_WRAP_T,
			this.gl.CLAMP_TO_EDGE,
		);
		this.gl.texParameteri(
			this.gl.TEXTURE_2D,
			this.gl.TEXTURE_MIN_FILTER,
			this.gl.LINEAR,
		);
		this.gl.texParameteri(
			this.gl.TEXTURE_2D,
			this.gl.TEXTURE_MAG_FILTER,
			this.gl.LINEAR,
		);

		// Upload the image into the texture.
		this.gl.texImage2D(
			this.gl.TEXTURE_2D,
			0,
			this.gl.RGBA,
			this.gl.RGBA,
			this.gl.UNSIGNED_BYTE,
			image,
		);

		// set the resolution for draw program
		resolutionLocation = this.gl.getUniformLocation(
			this.drawProgram,
			'u_resolution',
		);
		this.gl.uniform2f(
			resolutionLocation,
			this.gl.drawingBufferWidth,
			this.gl.drawingBufferHeight,
		);
	}

	draw(points): void {
		// create drawvertices based on points
		const vertices = [];
		for (let i = 0; i < this.vertexMap.length; i++) {
			vertices.push(points[this.vertexMap[i][0]][0]);
			vertices.push(points[this.vertexMap[i][0]][1]);
			vertices.push(points[this.vertexMap[i][1]][0]);
			vertices.push(points[this.vertexMap[i][1]][1]);
			vertices.push(points[this.vertexMap[i][2]][0]);
			vertices.push(points[this.vertexMap[i][2]][1]);
		}

		const positionLocation = this.gl.getAttribLocation(
			this.drawProgram,
			'a_position',
		);

		// Create a buffer for the position of the vertices.
		const drawPosBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, drawPosBuffer);
		this.gl.enableVertexAttribArray(positionLocation);
		this.gl.vertexAttribPointer(
			positionLocation,
			2,
			this.gl.FLOAT,
			false,
			0,
			0,
		);
		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			new Float32Array(vertices),
			this.gl.STATIC_DRAW,
		);

		// Draw the face vertices
		this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexMap.length * 3);
	}
}