import { Injectable } from '@angular/core';

/**
 * IMPORTANT: This class is a TypeScript implementation of a facial deformation
 * script written by "audano" on GitHub. See the original source of the script
 * here:
 *
 * https://github.com/auduno/clmtrackr/blob/master/examples/js/face_deformer.js
 */
@Injectable({
	providedIn: 'root',
})
export class DeformerService {
	gl: WebGLRenderingContext;
	first = true;
	useGrid = false;
	numTriangles: number;
	vertexMap: number[][];
	texCoordLocation: number;
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

	init(gl: WebGLRenderingContext): void {
		this.first = true;
		this.gl = gl;
		// @ts-ignore
		this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
	}

	load(
		element: HTMLCanvasElement,
		points: [number, number][],
		pModel,
		vertices?: number[][],
	): void {
		if (vertices) {
			this.vertexMap = vertices;
		} else {
			this.vertexMap = pModel.path.vertices;
		}
		this.numTriangles = this.vertexMap.length;

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

		if (this.first) {
			const gridVertexShader = DeformerService.loadShader(
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
			const gridFragmentShader = DeformerService.loadShader(
				this.gl,
				`
				void main() {
					gl_FragColor = vec4(0.2, 0.2, 0.2, 1.0);
				}
				`,
				this.gl.FRAGMENT_SHADER,
			);
			this.gridProgram = DeformerService.createProgram(this.gl, [
				gridVertexShader,
				gridFragmentShader,
			]);

			this.gridCoordBuffer = this.gl.createBuffer();

			const vertexShader = DeformerService.loadShader(
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
			const fragmentShader = DeformerService.loadShader(
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
			this.drawProgram = DeformerService.createProgram(this.gl, [
				vertexShader,
				fragmentShader,
			]);

			this.texCoordBuffer = this.gl.createBuffer();

			this.first = false;
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
		this.texCoordLocation = this.gl.getAttribLocation(
			this.drawProgram,
			'a_texCoord',
		);

		// provide texture coordinates for face vertices (i.e. where we're going to copy face vertices from).
		this.gl.enableVertexAttribArray(this.texCoordLocation);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			new Float32Array(textureVertices),
			this.gl.STATIC_DRAW,
		);

		this.gl.vertexAttribPointer(
			this.texCoordLocation,
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
		if (this.useGrid) {
			// switch program if needed
			this.gl.useProgram(this.drawProgram);

			//texCoordLocation = gl.getAttribLocation(drawProgram, "a_texCoord");

			this.gl.enableVertexAttribArray(this.texCoordLocation);
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
			this.gl.vertexAttribPointer(
				this.texCoordLocation,
				2,
				this.gl.FLOAT,
				false,
				0,
				0,
			);

			this.useGrid = false;
		}

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
		this.gl.drawArrays(this.gl.TRIANGLES, 0, this.numTriangles * 3);
	}

	clear(): void {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}
}
