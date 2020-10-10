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
			}

			this.normals.push(
				Math.cos(slice_alpha * n) * Math.cos(loop_alpha * i),
				Math.cos(slice_alpha * n) * Math.sin(loop_alpha * i),
				0
			);
		}
		

		for (var n = 0; n < this.loops; n++) {
			var slices_variable = this.slices * n;

			if (n == this.loops - 1) {
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



		/*this.indices.push(
			4, 5, 1,
			4, 1, 0,
			0, 3, 7,
			7, 4, 0,
			1, 5, 6,
			6, 2, 1,
			3, 2, 6,
			3, 6, 7,


			// Reverse order
			1, 5, 4,
			0, 1, 4,
			7, 3, 0,
			0, 4, 7,
			6, 5, 1,
			1, 2, 6,
			6, 2, 3,
			7, 6, 3
    
    
		);*/
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}


/*class MyTorus extends CGFobject {
	constructor(scene, inner, outer, slices, loops) {
		super(scene);

		this.slices = slices;
		this.loops = loops;
		this.inner_radius = inner;
		this.outer_radius = outer;

		this.initBuffers();
	};

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		let slice_angle = 2*Math.PI/this.slices;
		let loop_angle = 2*Math.PI/this.loops;

		// Cylinder
		for(let i = 0; i <= this.slices; ++i) {

			for(let j = 0; j <= this.loops; ++j) {

				this.vertices.push(
					(this.outer_radius + this.inner_radius*Math.cos(loop_angle*j)) * Math.cos(slice_angle*i),
					(this.outer_radius + this.inner_radius*Math.cos(loop_angle*j)) * Math.sin(slice_angle*i),
					this.inner_radius * Math.sin(loop_angle*j)
				);

				this.texCoords.push(
					i*1/this.slices,
					j*1/this.loops
				);

				this.normals.push(
					Math.cos(loop_angle*j) * Math.cos(slice_angle*i),
					Math.cos(loop_angle*j) * Math.sin(slice_angle*i),
					0
				);

			}

		}

		for (let i = 0; i < this.slices; ++i) {
			for(let j = 0; j < this.loops; ++j) {
				this.indices.push(
					(i+1)*(this.loops+1) + j, i*(this.loops+1) + j+1, i*(this.loops+1) + j,
					i*(this.loops+1) + j+1, (i+1)*(this.loops+1) + j, (i+1)*(this.loops+1) + j+1
				);
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};*/
