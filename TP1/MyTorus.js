class MyTorus extends CGFobject {
	constructor(scene, inner, outer, slices, loops) {
		super(scene);

		this.slices = slices;
		this.loops = loops;
		this.inner_radius = inner;
		this.outer_radius = outer;

		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		var slice_alpha = 2 * Math.PI / this.slices;
		var loop_alpha = 2 * Math.PI / this.loops;

		for (var i = 0; i < this.loops; i++) {
			for (var n = 0; n < this.slices; n++) {
				this.vertices.push(
					(this.outer_radius + this.inner_radius * Math.cos(slice_alpha * n)) * Math.cos(loop_alpha * i),
					(this.outer_radius + this.inner_radius * Math.cos(slice_alpha * n)) * Math.sin(loop_alpha * i),
					(this.inner_radius) * Math.sin(slice_alpha * n));

					this.normals.push(
						Math.cos(slice_alpha * n) * Math.cos(loop_alpha * i),
						Math.cos(slice_alpha * n) * Math.sin(loop_alpha * i),
						Math.sin(slice_alpha * n)
					);
			}
		}		

		for (var n = 0; n < this.loops; n++) {
			var slices_variable = this.slices * n;

			if (n == this.loops - 1) {
				for (var j = 0; j < this.slices; j++) {
					if (j == this.slices - 1) {
						this.indices.push(
							j - this.slices + 1 + slices_variable, j - this.slices + 1, j + slices_variable,
							j - this.slices + 1, j + slices_variable, j
						);

						// Reverse order
						this.indices.push(
							j + slices_variable, j - this.slices + 1, j - this.slices + 1 + slices_variable,
							j, j + slices_variable, j - this.slices + 1
						);
					}
					else {
						this.indices.push(
							j + slices_variable, j , j + 1,
							j + slices_variable, j + 1, j + slices_variable + 1
						);

						// Reverse order
						this.indices.push(
							j + 1, j , j + slices_variable,
							j + slices_variable + 1, j + 1, j + slices_variable
						);
					}
				}
			}

			else {
				for (var j = 0; j < this.slices; j++) {
					if (j == this.slices - 1) {
						this.indices.push(
							j - this.slices + 1 + slices_variable, j + 1 + slices_variable, j + slices_variable,
							j + 1 + slices_variable, j + slices_variable, j + this.slices + slices_variable
						);
						// Reverse order
						this.indices.push(
							j + slices_variable, j + 1 + slices_variable, j - this.slices + 1 + slices_variable,
							j + this.slices + slices_variable, j + slices_variable, j + 1 + slices_variable
						);
					}
					else {
						this.indices.push(
							j + this.slices + slices_variable, j + this.slices + 1 + slices_variable, j + 1 + slices_variable,
							j + this.slices + slices_variable, j + 1 + slices_variable, j + slices_variable
						);

						// Reverse order
						this.indices.push(
							j + 1 + slices_variable, j + this.slices + 1 + slices_variable, j + this.slices + slices_variable,
							j + slices_variable, j + 1 + slices_variable, j + this.slices + slices_variable
						);
					}
				}
			}
		}

		for (var i = 0; i < this.loops; i++) {
			for (var n = 0; n < this.slices; n++) {
				this.texCoords.push(n / this.slices, 1 - i / this.loops);
			}
			
		}


		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}
