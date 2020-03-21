import {
	AfterViewInit,
	Component,
	ElementRef,
	Input,
	OnDestroy,
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
export class DeformerComponent implements AfterViewInit, OnDestroy {
	/**
	 * Deformation to render.
	 */
	@Input()
	deformation: Deformation;
	/**
	 * Width of page elements.
	 */
	@Input()
	width = 640;
	/**
	 * Height of page elements.
	 */
	@Input()
	height = 480;

	@ViewChild('video', { static: true })
	private videoRef: ElementRef<HTMLVideoElement>;
	@ViewChild('overlay', { static: true })
	private overlayRef: ElementRef<HTMLCanvasElement>;
	@ViewChild('webGl', { static: true })
	private webGlRef: ElementRef<HTMLCanvasElement>;

	private canvas: HTMLCanvasElement;
	private canvasContext: CanvasRenderingContext2D;
	private overlayContext: CanvasRenderingContext2D;
	private tracker: clm.tracker;
	private enabled = false;
	private mouthVertices = [
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
	private extendVertices = [
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

	private gl: WebGLRenderingContext;
	private vertexMap: number[][];
	private texCoordBuffer: WebGLBuffer;
	private gridCoordBuffer: WebGLBuffer;

	private drawProgram: WebGLProgram;
	private gridProgram: WebGLProgram;

	/**
	 * Loads WebGL shader.
	 * @param gl - WebGL context.
	 * @param shaderSource - Shader source.
	 * @param shaderType - Shader type.
	 */
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

	/**
	 * Creates WebGL program.
	 * @param gl - WebGL context.
	 * @param shaders - WebGL shader array.
	 */
	static createProgram(
		gl: WebGLRenderingContext,
		shaders: WebGLShader[],
	): WebGLProgram {
		const program = gl.createProgram();
		for (const shader of shaders) {
			gl.attachShader(program, shader);
		}
		gl.linkProgram(program);

		const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
		if (!linked) {
			gl.deleteProgram(program);
			return null;
		}
		return program;
	}

	/**
	 * Creates a WebGL context from a Canvas HTML element.
	 * @param canvas - Canvas to create context from.
	 */
	static create3DContext(canvas: HTMLCanvasElement): WebGLRenderingContext {
		const names = ['webgl', 'experimental-webgl'];
		let context = null;
		for (const name of names) {
			try {
				context = canvas.getContext(name);
			} catch (e) {
				//
			}
			if (context) {
				break;
			}
		}
		return context;
	}

	constructor(private elementRef: ElementRef) {}

	/**
	 * Lifecycle hook that runs after the view is initialized.
	 */
	ngAfterViewInit(): void {
		this.enabled = true;
		this.canvas = document.createElement('canvas');
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then((stream: MediaStream) => {
				this.videoRef.nativeElement.srcObject = stream;
				const setCanvasSize = () => {
					const {
						width,
						height,
					} = stream.getVideoTracks()[0].getSettings();
					const aspectRatio = width / height;
					const {
						clientWidth,
						clientHeight,
					} = this.elementRef.nativeElement;
					const clientAspectRatio = clientWidth / clientHeight;
					// this.width = clientAspectRatio > aspectRatio ? width * clientHeight / height : clientWidth;
					// this.height = clientAspectRatio > aspectRatio ? clientHeight : height * clientWidth / width;
					this.canvas.width = this.width;
					this.canvas.height = this.height;
				};
				this.videoRef.nativeElement.onresize = setCanvasSize;
				setCanvasSize();
				this.canvasContext = this.canvas.getContext('2d');
				this.overlayContext = this.overlayRef.nativeElement.getContext(
					'2d',
				);
				if (!this.tracker) {
					this.tracker = new clm.tracker();
					this.tracker.init(pModel);
					this.tracker.start(this.videoRef.nativeElement);
				}
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
				this.initRender();
			})
			.catch(console.error);
	}

	/**
	 * Lifecycle hook that runs when the view is destroyed.
	 */
	ngOnDestroy(): void {
		this.enabled = false;
		this.clear();
		this.tracker.reset();
		this.tracker = null;
		this.canvas.remove();
		this.canvas = null;
		const stream = this.videoRef.nativeElement.srcObject as MediaStream;
		if (stream) {
			stream.getVideoTracks().forEach((track) => track.stop());
		}
	}

	/**
	 * Initializes the rendering sequence for deformation.
	 */
	initRender(): void {
		if (this.enabled && this.tracker.getConvergence() < 2) {
			this.overlayContext.clearRect(0, 0, this.width, this.height);
			this.render();
		} else {
			requestAnimationFrame(() => {
				this.clear();
				if (this.enabled) {
					if (this.tracker.getCurrentPosition()) {
						this.tracker.draw(this.overlayRef.nativeElement);
					}
					this.initRender();
				}
			});
		}
	}

	/**
	 * Controls the rendering sequence for the deformation.
	 */
	render(): void {
		this.canvasContext.drawImage(
			this.videoRef.nativeElement,
			0,
			0,
			this.width,
			this.height,
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

			this.load(this.canvasContext, newPos, newVertices);

			const parameters = this.tracker.getCurrentParameters();
			for (let i = 6; i < parameters.length; i++) {
				parameters[i] += this.deformation.data[i - 6];
			}
			// @ts-ignore
			const positions = this.tracker.calculatePositions(parameters);

			if (positions) {
				newPos = positions.concat(addPos);
				this.deform(newPos);
			}
		}
		requestAnimationFrame(() => {
			if (this.enabled) {
				this.render();
			}
		});
	}

	/**
	 * Clears the rendering contexts.
	 */
	clear(): void {
		// TODO - See if you can remove some of these...
		this.canvasContext.drawImage(
			this.videoRef.nativeElement,
			0,
			0,
			this.width,
			this.height,
		);
		this.overlayContext.clearRect(0, 0, this.width, this.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}

	/**
	 * Loads the deformation.
	 * @param canvasContext - Canvas context to load deformation onto.
	 * @param points - Points to load.
	 * @param vertices - Vertices to load.
	 */
	load(
		canvasContext: CanvasRenderingContext2D,
		points: [number, number][],
		vertices?: number[][],
	): void {
		if (vertices) {
			this.vertexMap = vertices;
		} else {
			this.vertexMap = pModel.path.vertices;
		}

		// Get cropping
		let maxx = 0;
		let minx = this.width;
		let maxy = 0;
		let miny = this.height;
		for (const point of points) {
			if (point[0] > maxx) {
				maxx = point[0];
			}
			if (point[0] < minx) {
				minx = point[0];
			}
			if (point[1] > maxy) {
				maxy = point[1];
			}
			if (point[1] < miny) {
				miny = point[1];
			}
		}
		minx = Math.floor(minx);
		maxx = Math.ceil(maxx);
		miny = Math.floor(miny);
		maxy = Math.ceil(maxy);
		const width = maxx - minx;
		const height = maxy - miny;

		const image = canvasContext.getImageData(minx, miny, width, height);

		// Correct points
		const nupoints = [];
		for (let i = 0; i < points.length; i++) {
			nupoints[i] = [];
			nupoints[i][0] = points[i][0] - minx;
			nupoints[i][1] = points[i][1] - miny;
		}

		// Create vertices based on points
		const textureVertices = [];
		for (const v of this.vertexMap) {
			textureVertices.push(nupoints[v[0]][0] / width);
			textureVertices.push(nupoints[v[0]][1] / height);
			textureVertices.push(nupoints[v[1]][0] / width);
			textureVertices.push(nupoints[v[1]][1] / height);
			textureVertices.push(nupoints[v[2]][0] / width);
			textureVertices.push(nupoints[v[2]][1] / height);
		}

		// Load program for drawing grid
		this.gl.useProgram(this.gridProgram);

		// Set the resolution for grid program
		let resolutionLocation = this.gl.getUniformLocation(
			this.gridProgram,
			'u_resolution',
		);
		this.gl.uniform2f(
			resolutionLocation,
			this.gl.drawingBufferWidth,
			this.gl.drawingBufferHeight,
		);

		// Load program for drawing deformed face
		this.gl.useProgram(this.drawProgram);

		// Look up where the vertex data needs to go.
		const texCoordLocation = this.gl.getAttribLocation(
			this.drawProgram,
			'a_texCoord',
		);

		// Provide texture coordinates for face vertices (i.e. where we're going to copy face vertices from).
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

		// Set the resolution for draw program
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

	/**
	 * Draws the deformation.
	 * @param points - Points to draw.
	 */
	deform(points: [number, number][]): void {
		// Create draw-vertices based on points
		const vertices = [];
		for (const v of this.vertexMap) {
			vertices.push(points[v[0]][0]);
			vertices.push(points[v[0]][1]);
			vertices.push(points[v[1]][0]);
			vertices.push(points[v[1]][1]);
			vertices.push(points[v[2]][0]);
			vertices.push(points[v[2]][1]);
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
